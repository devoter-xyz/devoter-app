#!/usr/bin/env node

// Load env variables
require('dotenv').config({ path: '.env.local' });

// Import dependencies using CommonJS
const { PrismaClient } = require('@prisma/client');
const readline = require('readline');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { execSync } = require('child_process');
const path = require('path');

// Create Prisma client
const prisma = new PrismaClient();

// Helper to create a CLI prompt
function createPrompt() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

/**
 * Truncates all tables in the database in the correct order to respect foreign key constraints
 * @param {object} options - Options for emptying the database
 * @param {boolean} options.dryRun - If true, only logs actions without executing them.
 * @param {string[]} options.tables - An array of table names to clear. If empty, all tables are cleared.
 * @param {boolean} options.backup - If true, creates a database backup before clearing.
 */
async function emptyDatabase(options) {
  const { dryRun, tables: tablesToClear, backup } = options;

  console.log(`🗑️  Starting database emptying process (Dry Run: ${dryRun ? 'YES' : 'NO'})...`);
  console.log('⚠️  Warning: This will delete data from your database!');

  const prompt = createPrompt();

  try {
    if (!dryRun) {
      // Ask for confirmation before proceeding in non-dry-run mode
      const answer = await new Promise((resolve) => {
        prompt.question('Are you sure you want to continue? (yes/no): ', resolve);
      });

      if (!answer || typeof answer !== 'string' || answer.toLowerCase() !== 'yes') {
        console.log('❌ Operation cancelled.');
        return;
      }
    }

    if (backup && !dryRun) {
      console.log('💾 Attempting to create a database backup...');
      const databaseUrl = process.env.DATABASE_URL;
      if (!databaseUrl) {
        console.error('❌ DATABASE_URL is not set. Cannot create backup.');
      } else {
        try {
          const db = new URL(databaseUrl);
          const dbName = db.pathname.substring(1);
          const dbUser = db.username;
          const dbHost = db.hostname;
          const dbPort = db.port || '5432';
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
          const backupFileName = `db_backup_${timestamp}.sql`;
          const tempDir = process.env.GEMINI_TEMP_DIR || path.join(__dirname, '..', 'tmp');
          const backupFilePath = path.join(tempDir, backupFileName);

          const fs = require('fs');
          if (!fs.existsSync(tempDir)) {
              fs.mkdirSync(tempDir, { recursive: true });
          }

          console.log(`ℹ️ Backing up database "${dbName}" to "${backupFilePath}"`);
          // Note: pg_dump does not take password directly on command line for security reasons.
          // It relies on environment variable PGPASSWORD or .pgpass file.
          // For simplicity in this script, we'll assume PGPASSWORD is set in the environment or
          // it's not required (e.g., local setup with trust authentication).
          execSync(`pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} > "${backupFilePath}"`, {
              stdio: 'inherit',
              env: { ...process.env, PGPASSWORD: db.password },
          });
          console.log(`✅ Database backup created at: ${backupFilePath}`);
        } catch (e) {
          console.error('❌ Error creating database backup:', e.message);
          if (e.message.includes('command not found: pg_dump')) {
            console.error('Please ensure PostgreSQL client tools (pg_dump) are installed and in your PATH.');
          }
        }
      }
    }

    console.log('🔄 Emptying database tables...');

    // Define the correct deletion order based on foreign key dependencies
    const tableDeletionOrder = [
      'Reply',
      'Discussion',
      'UserFavorite',
      'SocialLink',
      'ApiKey',
      'ApiUser',
      'Payment',
      'WeeklyRepoLeaderboard',
      'Vote',
      'NotificationPreference',
      'Repository',
      'AdminUser',
      'User',
    ];

    const filteredTables = tablesToClear.length > 0
      ? tableDeletionOrder.filter(table => tablesToClear.includes(table))
      : tableDeletionOrder;

    if (filteredTables.length === 0) {
      console.log('ℹ️ No tables specified or found to clear. Exiting.');
      return;
    }

    // Try to relax FK enforcement (may require superuser; ignore on failure)
    let fkDisabled = false;
    if (!dryRun) {
      try {
        await prisma.$executeRawUnsafe("SET session_replication_role = 'replica'");
        fkDisabled = true;
        console.log('ℹ️ Foreign key checks temporarily disabled.');
      } catch (e) {
        console.warn('⚠️  Could not disable FK triggers (likely insufficient privileges). Proceeding without it.');
      }
    } else {
      console.log('ℹ️ (Dry Run) Would attempt to temporarily disable foreign key checks.');
    }


    for (const tableName of filteredTables) {
      if (dryRun) {
        console.log(`✅ (Dry Run) Would delete all records from table: ${tableName}`);
      } else {
        // Prisma client property names are lowercase, but model names are PascalCase
        const prismaModelName = tableName.charAt(0).toLowerCase() + tableName.slice(1);
        if (prisma[prismaModelName]) {
          await prisma[prismaModelName].deleteMany({});
          console.log(`✅ Deleted all ${tableName} records`);
        } else {
          console.warn(`⚠️  Prisma model for table '${tableName}' not found. Skipping.`);
        }
      }
    }

    // Re-enable foreign key checks
    if (fkDisabled && !dryRun) {
      await prisma.$executeRaw`SET session_replication_role = 'origin';`;
      console.log('✅ Foreign key checks re-enabled.');
    } else if (dryRun) {
      console.log('✅ (Dry Run) Would re-enable foreign key checks.');
    }

    console.log('✅ Database emptying process completed.');
  } catch (error) {
    console.error('❌ Error emptying database:', error);
  } finally {
    prompt.close();
    await prisma.$disconnect();
  }
}

// Parse command line arguments
const argv = yargs(hideBin(process.argv))
  .scriptName('empty-db.js')
  .usage('Usage: $0 [options]')
  .option('dry-run', {
    alias: 'd',
    type: 'boolean',
    default: false,
    description: 'Perform a dry run without actually deleting any data.',
  })
  .option('tables', {
    alias: 't',
    type: 'array',
    string: true,
    description: 'Specify a comma-separated list of tables to clear (e.g., "User,Repository"). If not specified, all tables will be cleared.',
  })
  .option('backup', {
    alias: 'b',
    type: 'boolean',
    default: false,
    description: 'Create a PostgreSQL dump backup of the database before clearing. Requires pg_dump to be installed and DATABASE_URL to be set.',
  })
  .help()
  .alias('h', 'help')
  .epilog('For more information, refer to the script documentation.')
  .argv;

// Execute the function with parsed arguments
emptyDatabase({
  dryRun: argv.dryRun,
  tables: argv.tables || [],
  backup: argv.backup,
});
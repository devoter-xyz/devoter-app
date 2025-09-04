#!/usr/bin/env node

// Load env variables
require('dotenv').config({ path: '.env.local' });

// Import dependencies using CommonJS
const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

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
 */
async function emptyDatabase() {
  console.log('🗑️  Starting database emptying process...');
  console.log('⚠️  Warning: This will delete ALL data from your database!');

  const prompt = createPrompt();
  
  try {
    // Ask for confirmation before proceeding
    const answer = await new Promise((resolve) => {
      prompt.question('Are you sure you want to continue? (yes/no): ', resolve);
    });
    
    if (!answer || typeof answer !== 'string' || answer.toLowerCase() !== 'yes') {
      console.log('❌ Operation cancelled.');
      return;
    }

    console.log('🔄 Emptying database tables...');
    
    // Disable foreign key checks for PostgreSQL
    await prisma.$executeRaw`SET session_replication_role = 'replica';`;

    // Delete records in reverse dependency order
    // (tables with foreign keys first, then the referenced tables)
    await prisma.reply.deleteMany({});
    console.log('✅ Deleted all Reply records');
    
    await prisma.discussion.deleteMany({});
    console.log('✅ Deleted all Discussion records');
    
    await prisma.userFavorite.deleteMany({});
    console.log('✅ Deleted all UserFavorite records');
    
    await prisma.socialLink.deleteMany({});
    console.log('✅ Deleted all SocialLink records');
    
    await prisma.apiKey.deleteMany({});
    console.log('✅ Deleted all ApiKey records');
    
    await prisma.apiUser.deleteMany({});
    console.log('✅ Deleted all ApiUser records');
    
    await prisma.payment.deleteMany({});
    console.log('✅ Deleted all Payment records');
    
    await prisma.weeklyRepoLeaderboard.deleteMany({});
    console.log('✅ Deleted all WeeklyRepoLeaderboard records');
    
    await prisma.vote.deleteMany({});
    console.log('✅ Deleted all Vote records');
    
    await prisma.repository.deleteMany({});
    console.log('✅ Deleted all Repository records');
    
    await prisma.adminUser.deleteMany({});
    console.log('✅ Deleted all AdminUser records');
    
    await prisma.user.deleteMany({});
    console.log('✅ Deleted all User records');

    // Re-enable foreign key checks
    await prisma.$executeRaw`SET session_replication_role = 'origin';`;
    
    console.log('✅ Database emptied successfully.');
  } catch (error) {
    console.error('❌ Error emptying database:', error);
  } finally {
    prompt.close();
    await prisma.$disconnect();
  }
}

// Execute the function
emptyDatabase();

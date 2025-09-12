// Import with type compatibility for CommonJS
const { faker } = require('@faker-js/faker');
const { Prisma, PrismaClient } = require('@prisma/client');
const nodeCrypto = require('crypto');
const { Wallet } = require('ethers');

// Type imports for TypeScript
type PrismaDecimal = Prisma.Decimal;

// Create Prisma client instance
const prismaClient = new PrismaClient();

// ---------------------------------------------------------------------------
// Configuration – adjust these numbers to change dataset size
// ---------------------------------------------------------------------------
const NUM_USERS = 10; // total users to create
const NUM_REPOS = 30; // repositories that will appear on the leaderboard
const MAX_VOTES_PER_REPO = 15; // upper bound for votes per repository

/**
 * Calculates the ISO week string from a date
 * @param {Date} date - The date to calculate the week for
 * @returns {string} The ISO week string in format YYYY-WXX
 */
function weekString(date: Date): string {
  const tmpDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const dayNum = tmpDate.getUTCDay() || 7;
  tmpDate.setUTCDate(tmpDate.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(tmpDate.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((tmpDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
    .toString()
    .padStart(2, '0');
  const year = tmpDate.getUTCFullYear();
  return `${year}-W${week}`;
}

/**
 * Generates a random decimal value within a range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} precision - Decimal precision
 * @returns {Prisma.Decimal} A Prisma Decimal value
 */
function randomTokenDecimal(min: number, max: number, precision = 6): PrismaDecimal {
  const multipleOf = 1 / 10 ** precision;
  const random = faker.number.float({ min, max, multipleOf });
  return new Prisma.Decimal(random.toString());
}

// Define types for our entities
type User = {
  id: string;
  walletAddress: string;
  name?: string;
  avatar?: string;
};

type Repository = {
  id: string;
  createdAt: Date;
  [key: string]: any;
};

async function main() {
  console.log('🌱  Starting simplified seed …');

  // -------------------------------------------------------------------------
  // 1. Admin User
  // -------------------------------------------------------------------------
  await prismaClient.adminUser.upsert({
    where: { walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' },
    update: {},
    create: { walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' }
  });
  console.log('✓ Upserted admin user');

  // -------------------------------------------------------------------------
  // 2. Users
  // -------------------------------------------------------------------------
  const users: User[] = [];
  for (let i = 0; i < NUM_USERS; i++) {
    const wallet = Wallet.createRandom();
    const address = wallet.address;
    
    const user = await prismaClient.user.create({
      data: {
        walletAddress: address,
        name: faker.person.fullName(),
        avatar: faker.internet.color()
      }
    });
    
    users.push(user as User);
  }
  console.log(`✓ Inserted ${users.length} users`);

  // Keep track of which weeks have had activity
  const activeWeeks = new Set<string>();

  // -------------------------------------------------------------------------
  // 3. Repositories
  // -------------------------------------------------------------------------
  console.log('⎋ Creating repositories…');
  const repos: Repository[] = [];
  
  for (let i = 0; i < NUM_REPOS; i++) {
    const submitter = faker.helpers.arrayElement(users) as User;

    if (!submitter) {
      continue;
    }

    // Submission takes place within the last 120 days
    const repoCreated = faker.date.recent({ days: 120 });
    const submissionWeek = weekString(repoCreated);
    activeWeeks.add(submissionWeek);

    // Fee for submitting: = 1 USDC
    const submissionFee = new Prisma.Decimal(1);

    const title = faker.commerce.productName();
    const description = faker.lorem.paragraph();
    const owner = faker.person.firstName().toLowerCase();
    const repoName = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-._]/g, '');
      
    // Create payment first
    const payment = await prismaClient.payment.create({
      data: {
        userId: submitter.id,
        walletAddress: submitter.walletAddress,
        tokenAmount: submissionFee,
        txHash: `0x${nodeCrypto.randomBytes(32).toString('hex')}`,
        week: submissionWeek
      }
    });
    
    // Create repository
    const repo = await prismaClient.repository.create({
      data: {
        title,
        description,
        githubUrl: `https://github.com/${owner}/${repoName}`,
        name: repoName,
        owner,
        tags: [faker.commerce.department(), faker.commerce.department()],
        submitterId: submitter.id,
        paymentId: payment.id,
        createdAt: repoCreated
      }
    });
    
    repos.push(repo as Repository);
  }
  console.log(`✓ Inserted ${repos.length} repositories`);

  // -------------------------------------------------------------------------
  // 4. Votes
  // -------------------------------------------------------------------------
  console.log('⎋ Creating votes…');
  let totalVotesCreated = 0;
  
  for (const repo of repos) {
    // Each repo gets a random number of votes
    const numVotes = faker.number.int({ min: 1, max: MAX_VOTES_PER_REPO });
    const votersWithDuplicates = faker.helpers.arrayElements(users, numVotes);
    const voters = [...new Set(votersWithDuplicates)] as User[]; // Ensure unique voters per repo

    for (const voter of voters) {
      const votingWeek = weekString(repo.createdAt);
      activeWeeks.add(votingWeek);
      const tokenAmount = randomTokenDecimal(0.1, 10);

      const vote = await prismaClient.vote.create({
        data: {
          userId: voter.id,
          repositoryId: repo.id,
          tokenAmount,
          week: votingWeek
        }
      });

      await prismaClient.payment.create({
        data: {
          userId: voter.id,
          walletAddress: voter.walletAddress,
          tokenAmount,
          txHash: `0x${nodeCrypto.randomBytes(32).toString('hex')}`,
          week: votingWeek,
          voteId: vote.id
        }
      });
      totalVotesCreated++;
    }
  }
  console.log(`✓ Inserted ${totalVotesCreated} votes`);

  // -------------------------------------------------------------------------
  // 5. Update Repository Vote Counts
  // -------------------------------------------------------------------------
  console.log('⎋ Updating repository vote counts…');
  const reposWithVotes = await prismaClient.repository.findMany({
    include: {
      _count: {
        select: { votes: true }
      }
    }
  });

  for (const repo of reposWithVotes) {
    await prismaClient.repository.update({
      where: { id: repo.id },
      data: { totalVotes: repo._count.votes }
    });
  }
  console.log(`✓ Updated vote counts for ${reposWithVotes.length} repositories`);

  // -------------------------------------------------------------------------
  // 6. Leaderboards
  // -------------------------------------------------------------------------
  console.log('⎋ Updating weekly leaderboards…');
  for (const week of activeWeeks) {
    // Get top repositories for the week
    const topRepos = await prismaClient.repository.findMany({
      where: {
        votes: {
          some: {
            week
          }
        }
      },
      include: {
        votes: {
          where: {
            week
          }
        }
      },
      orderBy: {
        totalVotes: 'desc'
      },
      take: 10
    });
    
    // Create leaderboard entries
    for (let i = 0; i < topRepos.length; i++) {
      const repo = topRepos[i];
      await prismaClient.weeklyRepoLeaderboard.create({
        data: {
          repoId: repo.id,
          rank: i + 1,
          week
        }
      });
    }
    
    console.log(`  - Updated leaderboard for ${week}`);
  }
  console.log(`✓ Updated ${activeWeeks.size} leaderboards`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaClient.$disconnect();
  });

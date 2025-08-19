import { signIn } from '@/actions/auth/signin/logic';
import { updateWeeklyLeaderboard } from '@/actions/leaderboard/archive/logic';
import { createRepository } from '@/actions/repository/createRepository/logic';
import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { Wallet } from 'ethers';
import { SiweMessage } from 'siwe';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Configuration – adjust these numbers to change dataset size
// ---------------------------------------------------------------------------
const NUM_USERS = 10; // total users to create
const NUM_REPOS = 30; // repositories that will appear on the leaderboard
const MAX_VOTES_PER_REPO = 15; // upper bound for votes per repository

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

function randomTokenDecimal(min: number, max: number, precision = 6) {
  const multipleOf = 1 / 10 ** precision;
  const random = faker.number.float({ min, max, multipleOf });
  return new Prisma.Decimal(random.toString());
}

async function main() {
  console.log('🌱  Starting faker seed …');

  // -------------------------------------------------------------------------
  // 1. Admin User
  // -------------------------------------------------------------------------
  await prisma.adminUser.upsert({
    where: { walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' },
    update: {},
    create: { walletAddress: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' }
  });
  console.log('✓ Upserted admin user');

  // -------------------------------------------------------------------------
  // 2. Users
  // -------------------------------------------------------------------------
  const users = await Promise.all(
    Array.from({ length: NUM_USERS }).map(async () => {
      const wallet = Wallet.createRandom();
      const address = wallet.address;
      const siweMessage = new SiweMessage({
        domain: process.env.NEXT_PUBLIC_APP_URL,
        address,
        statement: 'Sign in with Ethereum to the app.',
        uri: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
        version: '1',
        chainId: 1,
        nonce: crypto.randomBytes(16).toString('hex')
      });
      const message = siweMessage.prepareMessage();
      const signature = await wallet.signMessage(message);

      return signIn(
        {
          message: JSON.stringify(siweMessage),
          signature,
          nonce: siweMessage.nonce
        },
        { setCookie: false }
      );
    })
  );
  console.log(`✓ Inserted ${users.length} users`);

  // Keep track of which weeks have had activity
  const activeWeeks = new Set<string>();

  // -------------------------------------------------------------------------
  // 3. Repositories (with submission Payments)
  // -------------------------------------------------------------------------
  console.log('⎋ Creating repositories…');
  for (let i = 0; i < NUM_REPOS; i++) {
    const submitter = faker.helpers.arrayElement(users);

    if (!submitter) {
      // Should not happen with the current logic, but good practice
      continue;
    }

    // Submission takes place within the last 120 days
    const repoCreated = faker.date.recent({ days: 120 });
    const submissionWeek = weekString(repoCreated);
    activeWeeks.add(submissionWeek);

    // Fee for submitting: = 1 USDC
    const submissionFee = 1;

    const title = faker.commerce.productName();
    const description = faker.lorem.paragraph();
    const owner = faker.person.firstName().toLowerCase();
    const repoName = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-._]/g, '');

    const repo = await createRepository(
      {
        title,
        description,
        githubUrl: `https://github.com/${owner}/${repoName}`,
        tokenAmount: submissionFee
      },
      submitter.id
    );

    await prisma.repository.update({
      where: { id: repo.id },
      data: {
        createdAt: repoCreated
      }
    });
  }
  console.log(`✓ Inserted ${NUM_REPOS} repositories`);

  // -------------------------------------------------------------------------
  // 4. Votes (with Payments)
  // -------------------------------------------------------------------------
  console.log('⎋ Creating votes…');
  const repos = await prisma.repository.findMany();
  let totalVotesCreated = 0;
  for (const repo of repos) {
    // Each repo gets a random number of votes
    const numVotes = faker.number.int({ min: 1, max: MAX_VOTES_PER_REPO });
    const votersWithDuplicates = faker.helpers.arrayElements(users, numVotes);
    const voters = [...new Set(votersWithDuplicates)]; // Ensure unique voters per repo

    for (const voter of voters) {
      const votingWeek = weekString(repo.createdAt);
      activeWeeks.add(votingWeek);
      const tokenAmount = randomTokenDecimal(0.1, 10);

      const vote = await prisma.vote.create({
        data: {
          userId: voter!.id,
          repositoryId: repo.id,
          tokenAmount,
          week: votingWeek
        }
      });

      await prisma.payment.create({
        data: {
          userId: voter!.id,
          walletAddress: voter!.walletAddress,
          tokenAmount,
          txHash: `0x${crypto.randomBytes(32).toString('hex')}`,
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
  const reposWithVotes = await prisma.repository.findMany({
    include: {
      _count: {
        select: { votes: true }
      }
    }
  });

  for (const repo of reposWithVotes) {
    await prisma.repository.update({
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
    await updateWeeklyLeaderboard(week);
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
    await prisma.$disconnect();
  });

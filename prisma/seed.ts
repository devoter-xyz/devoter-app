import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import crypto from 'crypto';
import { Wallet } from 'ethers';
import { SiweMessage } from 'siwe';
import { signIn } from '@/actions/auth/signin/logic';
import { createRepository } from '@/actions/repository/createRepository/logic';
import { archiveWeeklyLeaderboard } from '@/actions/leaderboard/archive/logic';

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
  return new Decimal(random.toString());
}

async function main() {
  console.log('🌱  Starting faker seed …');

  // -------------------------------------------------------------------------
  // 1. Users
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
          nonce: siweMessage.nonce,
        },
        { setCookie: false }
      );
    })
  );
  console.log(`Inserted ${users.length} users`);

  // Keep running totals for leaderboard creation later
  const weeklyTotals: Record<string, Record<string, Decimal>> = {};

  // -------------------------------------------------------------------------
  // 2. Repositories (with submission Payments)
  // -------------------------------------------------------------------------
  for (let i = 0; i < NUM_REPOS; i++) {
    const submitter = faker.helpers.arrayElement(users);

    if (!submitter) {
      return;
    }

    // Submission takes place within the last 120 days
    const repoCreated = faker.date.recent({ days: 120 });
    const submissionWeek = weekString(repoCreated);

    // Fee for submitting: = 1 USDC
    const submissionFee = 1;

    const title = faker.commerce.productName();
    const description = faker.lorem.paragraph();
    const owner = faker.person.firstName().toLowerCase();
    const repoName = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-._]/g, '');

    await createRepository(
      {
        title,
        description,
        githubUrl: `https://github.com/${owner}/${repoName}`,
        tokenAmount: submissionFee
      },
      submitter.id,
      { createdAt: repoCreated }
    );

    // Keep running totals for leaderboard creation later
    if (!weeklyTotals[submissionWeek]) {
      weeklyTotals[submissionWeek] = {};
    }
  }

  // -------------------------------------------------------------------------
  // 3. Votes (with Payments)
  // -------------------------------------------------------------------------
  const repos = await prisma.repository.findMany();
  for (const repo of repos) {
    // Each repo gets a random number of votes
    const numVotes = faker.number.int({ min: 1, max: MAX_VOTES_PER_REPO });
    const voters = faker.helpers.arrayElements(users, numVotes);

    for (const voter of voters) {
      const votingWeek = weekString(repo.createdAt);
      const tokenAmount = randomTokenDecimal(0.1, 10);

      const vote = await prisma.vote.create({
        data: {
          userId: voter!.id,
          repositoryId: repo.id,
          tokenAmount,
          week: votingWeek,
        },
      });

      await prisma.payment.create({
        data: {
          userId: voter!.id,
          walletAddress: voter!.walletAddress,
          tokenAmount,
          txHash: `0x${crypto.randomBytes(32).toString('hex')}`,
          week: votingWeek,
          voteId: vote.id,
        },
      });

    }
  }

  // -------------------------------------------------------------------------
  // 4. Weekly Leaderboards
  // -------------------------------------------------------------------------
  await archiveWeeklyLeaderboard();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

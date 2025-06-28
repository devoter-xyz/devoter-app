import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { faker } from '@faker-js/faker';
import crypto from 'crypto';

/**
 * Seed script that populates the database with realistic, random data.
 *
 * How to run:
 *   pnpm seed
 *
 * The dataset size can be tweaked via the constants below. All generated
 * payments remain ≤ 1 USDC (the application constraint) and all dates are
 * in the past so the leaderboard can be rendered immediately.
 */

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Configuration – adjust these numbers to change dataset size
// ---------------------------------------------------------------------------
const NUM_USERS = 20; // total users to create
const NUM_REPOS = 30; // repositories that will appear on the leaderboard
const MAX_VOTES_PER_REPO = 15; // upper bound for votes per repository

/** Convert a Date to the `YYYY-Www` format used in the schema */
function weekString(date: Date): string {
  // Calculate ISO week number without external dependencies
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

/** Generate a Decimal between min and max (inclusive) with a given precision */
function randomTokenDecimal(min: number, max: number, precision = 6) {
  const factor = 10 ** precision;
  const random =
    Math.floor(faker.number.float({ min, max, precision: 1 / factor }) * factor) / factor;
  return new Decimal(random.toString());
}

async function main() {
  console.log('🌱  Starting faker seed …');

  // -------------------------------------------------------------------------
  // 1. Users
  // -------------------------------------------------------------------------
  const users = await Promise.all(
    Array.from({ length: NUM_USERS }).map(() =>
      prisma.user.create({
        data: {
          walletAddress: faker.finance.ethereumAddress(),
        },
      }),
    ),
  );
  console.log(`✅  Inserted ${users.length} users`);

  // Keep running totals for leaderboard creation later
  const weeklyTotals: Record<string, Record<string, Decimal>> = {};

  // -------------------------------------------------------------------------
  // 2. Repositories (with submission Payments)
  // -------------------------------------------------------------------------
  for (let i = 0; i < NUM_REPOS; i++) {
    const submitter = faker.helpers.arrayElement(users);

    // Submission takes place within the last 120 days
    const repoCreated = faker.date.recent({ days: 120 });
    const submissionWeek = weekString(repoCreated);

    // Fee for submitting: ≤ 1 USDC
    const submissionFee = randomTokenDecimal(0.01, 1);

    const submissionPayment = await prisma.payment.create({
      data: {
        userId: submitter.id,
        walletAddress: submitter.walletAddress,
        tokenAmount: submissionFee,
        week: submissionWeek,
        txHash: `0x${crypto.randomBytes(32).toString('hex')}`,
      },
    });

    const title = `${faker.word.adjective()} ${faker.word.noun()}`;

    const repository = await prisma.repository.create({
      data: {
        title,
        description: faker.lorem.sentences(2),
        githubUrl: `https://github.com/${faker.internet.userName()}/${faker.helpers.slugify(
          title,
        )}`,
        submitterId: submitter.id,
        paymentId: submissionPayment.id,
        createdAt: repoCreated,
      },
    });

    // Link the payment back to the repository (two-way relation)
    await prisma.payment.update({
      where: { id: submissionPayment.id },
      data: { repository: { connect: { id: repository.id } } },
    });

    // -----------------------------------------------------------------------
    // 3. Votes & associated Payments
    // -----------------------------------------------------------------------
    const votesForRepo = faker.number.int({ min: 0, max: MAX_VOTES_PER_REPO });
    const votersUsed = new Set<string>();

    for (let v = 0; v < votesForRepo; v++) {
      // Ensure one vote per (user, repo)
      let voter;
      let guard = 0;
      do {
        voter = faker.helpers.arrayElement(users);
        guard++;
      } while (votersUsed.has(voter.id) && guard < 10);

      if (votersUsed.has(voter.id)) continue;
      votersUsed.add(voter.id);

      const voteDate = faker.date.between({ from: repoCreated, to: new Date() });
      const voteWeek = weekString(voteDate);
      const voteAmount = randomTokenDecimal(0.0001, 1, 8);

      const vote = await prisma.vote.create({
        data: {
          userId: voter.id,
          repositoryId: repository.id,
          tokenAmount: voteAmount,
          week: voteWeek,
          createdAt: voteDate,
          lastVerified: voteDate,
        },
      });

      await prisma.payment.create({
        data: {
          userId: voter.id,
          walletAddress: voter.walletAddress,
          tokenAmount: voteAmount,
          voteId: vote.id,
          week: voteWeek,
          txHash: `0x${crypto.randomBytes(32).toString('hex')}`,
        },
      });

      // Update repository aggregates
      await prisma.repository.update({
        where: { id: repository.id },
        data: {
          totalTokenAmount: { increment: voteAmount },
          totalVotes: { increment: 1 },
        },
      });

      // Aggregate for leaderboard
      weeklyTotals[voteWeek] ??= {};
      weeklyTotals[voteWeek][repository.id] ??= new Decimal(0);
      weeklyTotals[voteWeek][repository.id] = weeklyTotals[voteWeek][repository.id].plus(
        voteAmount,
      );
    }
  }

  console.log(`✅  Inserted ${NUM_REPOS} repositories and votes`);

  // -------------------------------------------------------------------------
  // 4. Weekly Leaderboard entries
  // -------------------------------------------------------------------------
  for (const [week, repoTotals] of Object.entries(weeklyTotals)) {
    const ranked = Object.entries(repoTotals)
      .sort(([, a], [, b]) => b.toNumber() - a.toNumber())
      .slice(0, 10); // top-10 only

    const data = ranked.map(([repoId], index) => ({
      repoId,
      rank: index + 1,
      week,
    }));

    await prisma.weeklyRepoLeaderboard.createMany({
      data,
      skipDuplicates: true,
    });
  }

  console.log('🎉  Leaderboard created – seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

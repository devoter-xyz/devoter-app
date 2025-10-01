import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const repos = Array.from({ length: 20 }).map(() => ({
    name: faker.word.words({ count: { min: 1, max: 3 } }),
    owner: faker.internet.userName(),
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    githubUrl: faker.internet.url(),
    websiteUrl: faker.internet.url(),
    docsUrl: faker.internet.url(),
    logoUrl: faker.image.url(),
    tags: faker.helpers.arrayElements([
      'web', 'blockchain', 'ai', 'tools', 'infra', 'dev', 'security', 'data', 'api', 'mobile'
    ], faker.number.int({ min: 1, max: 4 })),
    githubStars: faker.number.int({ min: 0, max: 10000 }),
    githubForks: faker.number.int({ min: 0, max: 5000 }),
    isVerified: faker.datatype.boolean(),
    submitterId: 'seed-user-id', // Replace with a valid User ID
    paymentId: faker.string.uuid(),
    featured: faker.datatype.boolean(),
  }));

  await prisma.repository.createMany({ data: repos });
  console.log('Seeded repositories!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

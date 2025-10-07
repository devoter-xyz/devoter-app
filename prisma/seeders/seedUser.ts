
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { Wallet } from 'ethers';

const prisma = new PrismaClient();

export async function seedUsers(count: number) {
  const users = [];
  for (let i = 0; i < count; i++) {
    const wallet = Wallet.createRandom();
    const address = wallet.address;
    
    const user = await prisma.user.create({
      data: {
        walletAddress: address,
        name: faker.person.fullName(),
        avatar: faker.internet.avatar(),
      }
    });
    
    users.push(user);
  }
  console.log(`Seeded ${users.length} users!`);
  return users;
}

async function main() {
  await seedUsers(10);
}

if (require.main === module) {
  main()
    .catch(e => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}

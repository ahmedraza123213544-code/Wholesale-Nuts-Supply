import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Wholesale Nut Supply admin user...');

  await prisma.user.deleteMany({
    where: {
      email: 'admin@wholesalenutsupply.com',
    },
  });

  const password = await bcrypt.hash('Wholesale@123', 10);

  await prisma.user.create({
    data: {
      email: 'admin@wholesalenutsupply.com',
      password: password,
      role: Role.ADMIN,
    },
  });

  console.log('Admin user created: admin@wholesalenutsupply.com');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

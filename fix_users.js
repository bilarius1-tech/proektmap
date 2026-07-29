const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

async function main() {
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

  // Register partner
  const partnerHash = await bcrypt.hash('nastya2025', 10);
  let partner = await db.user.findUnique({ where: { email: 'kapibara231@bk.ru' } });
  if (!partner) {
    partner = await db.user.create({ data: { email: 'kapibara231@bk.ru', name: 'Настя', passwordHash: partnerHash, role: 'user', subscription: 'free' } });
    console.log('Created kapibara231@bk.ru');
  } else {
    await db.user.update({ where: { email: 'kapibara231@bk.ru' }, data: { passwordHash: partnerHash } });
    console.log('Updated kapibara231@bk.ru password');
  }

  // Reset admin
  const adminHash = await bcrypt.hash('123456', 10);
  await db.user.update({ where: { email: 'bilariuss@yandex.ru' }, data: { passwordHash: adminHash } });
  console.log('Admin password -> 123456');

  await db.$disconnect();
}
main();

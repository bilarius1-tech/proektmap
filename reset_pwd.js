const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

(async () => {
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: 'postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public' }) });
  
  const hash = await bcrypt.hash('123456', 10);
  console.log('New hash:', hash);
  
  await db.user.update({ where: { email: 'bilariuss@yandex.ru' }, data: { passwordHash: hash } });
  
  const user = await db.user.findUnique({ where: { email: 'bilariuss@yandex.ru' } });
  const match = await bcrypt.compare('123456', user.passwordHash);
  console.log('Verify match:', match);
  
  await db.$disconnect();
})();

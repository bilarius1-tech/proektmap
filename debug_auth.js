const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

(async () => {
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: 'postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public' }) });
  
  const email = 'bilariuss@yandex.ru'.toLowerCase();
  const password = '123456';
  
  const user = await db.user.findUnique({ where: { email } });
  console.log('User found:', !!user);
  console.log('Has passwordHash:', !!user?.passwordHash);
  console.log('Hash length:', user?.passwordHash?.length);
  
  const valid = await bcrypt.compare(password, user.passwordHash);
  console.log('bcrypt match:', valid);
  
  // Also check what the auth module sees
  const authUser = await db.user.findUnique({ where: { email: 'bilariuss@yandex.ru' } });
  console.log('Auth email match:', authUser?.email);
  console.log('Auth role:', authUser?.role);
  
  await db.$disconnect();
  console.log('DONE');
})().catch(e => console.error('ERROR:', e.message));

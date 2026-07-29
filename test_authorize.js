// Test NextAuth authorize directly
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

(async () => {
  const DATABASE_URL = 'postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public';
  
  // Simulate getAuthPrisma
  let _authPrisma = null;
  function getAuthPrisma() {
    if (_authPrisma) return _authPrisma;
    _authPrisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: DATABASE_URL }) });
    return _authPrisma;
  }

  // Simulate authorize
  const credentials = { email: 'bilariuss@yandex.ru', password: '123456' };
  
  console.log('Step 1: credentials:', credentials.email, credentials.password);
  
  const db = getAuthPrisma();
  console.log('Step 2: db created');
  
  const user = await db.user.findUnique({ where: { email: credentials.email.toLowerCase() } });
  console.log('Step 3: user found:', !!user);
  console.log('Step 4: passwordHash exists:', !!user?.passwordHash);
  console.log('Step 5: hash starts with:', user?.passwordHash?.substring(0, 10));
  
  const valid = await bcrypt.compare(credentials.password, user.passwordHash);
  console.log('Step 6: bcrypt result:', valid);
  
  if (!valid) {
    console.log('AUTHORIZE WOULD RETURN NULL -> "Неверный email или пароль"');
  } else {
    console.log('AUTHORIZE WOULD SUCCEED');
  }
  
  await db.$disconnect();
})();

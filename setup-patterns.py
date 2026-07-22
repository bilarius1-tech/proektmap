import os, subprocess
os.chdir('/var/www/www-root/data/www/proektmap.ru')

# Add category field to BuildPattern
with open('prisma/schema.prisma') as f: c = f.read()

# Add after timeToBuild
c = c.replace(
    'timeToBuild     String   @default("2 дня")',
    'timeToBuild     String   @default("2 дня")\n  category        String   @default("")'
)

with open('prisma/schema.prisma','w') as f: f.write(c)
print('category field added to BuildPattern')

# Push to DB
subprocess.run(['npx','prisma','db','push','--accept-data-loss'], env={**os.environ, 'DATABASE_URL': 'postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public'})
subprocess.run(['npx','prisma','generate'])
print('DB synced')

# Seed
subprocess.run(['node','seed-patterns-v2.js'], env={**os.environ, 'DATABASE_URL': 'postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public'})
print('Seed done')

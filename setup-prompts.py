import os, subprocess
os.chdir('/var/www/www-root/data/www/proektmap.ru')

# 1. Add PromptBlueprint model to schema
with open('prisma/schema.prisma') as f: c = f.read()

model = '''
model PromptBlueprint {
  id              String   @id @default(uuid())
  title           String
  slug            String   @unique
  category        String   @default("System")
  description     String   @default("")
  whenToUse       String   @default("")
  whenNotUse      String   @default("")
  expectedResult  String   @default("")
  systemPrompt    String   @default("")
  userPrompt      String   @default("")
  exampleOutput   String   @default("")
  stats           String   @default("{}")
  compatibility   String   @default("[]")
  dependencies    String   @default("[]")
  evolution       String   @default("[]")
  patternIds      String   @default("[]")
  mcpIds          String   @default("[]")
  agentIds        String   @default("[]")
  difficulty      Int      @default(3)
  qualityScore    Int      @default(85)
  timeSaved       String   @default("4 часа")
  tokensEstimate  Int      @default(2000)
  usageCount      Int      @default(0)
  isPublished     Boolean  @default(false)
  isFeatured      Boolean  @default(false)
  sortOrder       Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  @@map("prompt_blueprints")
}
'''

c = c.replace('model BuildPattern {', model + '\nmodel BuildPattern {')
with open('prisma/schema.prisma','w') as f: f.write(c)

# 2. DB push + generate
subprocess.run(['npx','prisma','db','push','--accept-data-loss'], env={**os.environ, 'DATABASE_URL': 'postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public'})
subprocess.run(['npx','prisma','generate'])
print('DB synced')

# 3. Seed
subprocess.run(['node','seed-prompts-v3.js'], env={**os.environ, 'DATABASE_URL': 'postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public'})
print('Seed done')

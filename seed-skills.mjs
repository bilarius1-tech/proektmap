import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

async function seed() {
  const existing = await p.skill.count();
  if (existing > 0) { console.log("Already:", existing); await p.$disconnect(); return; }
  
  const skills = [
    { title: "Настройка домена и DNS", slug: "domain-setup", description: "Покупка, выбор и привязка домена", skillMd: "## Домен\nАдрес сайта. Короткий, запоминающийся.\n## DNS\nA-запись на IP сервера.", difficulty: "easy", xpReward: 15, timeEstimate: "20 мин", isPublished: true, promptTemplate: "Помоги настроить DNS для {{domain}}." },
    { title: "SSL-сертификат", slug: "ssl-setup", description: "HTTPS, безопасность", skillMd: "## SSL\nБез него — Небезопасно.\n## Let's Encrypt\nБесплатно. ISPmanager → SSL.", difficulty: "easy", xpReward: 10, timeEstimate: "10 мин", isPublished: true, promptTemplate: "Помоги выпустить SSL для {{domain}}." },
    { title: "Деплой на VPS", slug: "vps-deploy", description: "Nginx, PM2, запуск", skillMd: "## VPS\nUbuntu 22.04\n## Деплой\nnpm build → PM2 → Nginx", difficulty: "medium", xpReward: 30, timeEstimate: "1 час", isPublished: true, promptTemplate: "Помоги задеплоить {{project}} на VPS." },
  ];

  for (const s of skills) { await p.skill.create({ data: s }); }
  console.log("Seeded:", skills.length);
  await p.$disconnect();
}
seed().catch(e => { console.error(e.message); process.exit(1); });

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });

const projects = [
  { name:'Gerwin AI', slug:'gerwin', company:'Gerwin', category:'LLM', description:'AI-копирайтер для текстов: статьи, посты, описания товаров. Поддерживает русский и 20+ языков.', website:'https://gerwin.io', pricing:'freemium', hasApi:true, rating:7 },
  { name:'YaLM 100B', slug:'yalm', company:'Яндекс', category:'OpenSource', description:'Открытая LLM Яндекса на 100 млрд параметров. Доступна для исследований и дообучения.', website:'https://github.com/yandex/YaLM-100B', pricing:'free', hasApi:false, isOpenSource:true, rating:8 },
  { name:'Николай Иронов', slug:'nikolay-ironov', company:'Сбер', category:'Image', description:'AI-дизайнер от Сбера. Генерирует логотипы, брендинг, упаковку.', website:'https://www.sberbank.com/ironov', pricing:'paid', hasApi:false, rating:7 },
  { name:'Турботекст AI', slug:'turbotext', company:'Турботекст', category:'LLM', description:'AI-генератор SEO-текстов и контента. Интегрирован с биржей копирайтинга.', website:'https://turbotext.ru', pricing:'freemium', hasApi:true, rating:6 },
  { name:'Retext.AI', slug:'retext', company:'Российский стартап', category:'LLM', description:'AI-рерайтер: перефразирование, уникализация, улучшение стиля на русском.', website:'https://retext.ai', pricing:'freemium', hasApi:true, rating:8 },
  { name:'СберМедИИ', slug:'sbermedai', company:'Сбер', category:'Business', description:'AI для медицины: анализ снимков, диагностика, поддержка врачебных решений.', website:'https://sbermed.ai', pricing:'paid', hasApi:true, rating:8 },
  { name:'Care Mentor AI', slug:'care-mentor', company:'Care Mentor', category:'Business', description:'AI-ассистент для рентгенологов: поиск патологий на снимках, приоритезация.', website:'https://carementor.ai', pricing:'paid', hasApi:true, rating:8 },
  { name:'Цифра', slug:'cifra', company:'Цифра', category:'Business', description:'Промышленный AI: цифровые двойники, мониторинг станков, предиктивное обслуживание.', website:'https://www.zyfra.com', pricing:'paid', hasApi:true, rating:7 },
  { name:'Яндекс Практикум AI', slug:'praktikum-ai', company:'Яндекс', category:'Assistant', description:'AI-наставник для обучения: проверка кода, подсказки, персонализированные задания.', website:'https://practicum.yandex.ru', pricing:'freemium', hasApi:false, rating:8 },
  { name:'Т-Банк AI Scoring', slug:'tbank-scoring', company:'Т-Банк', category:'Business', description:'AI для скоринга и кредитования: анализ рисков, проверка заёмщиков.', website:'https://www.tbank.ru', pricing:'paid', hasApi:true, rating:7 },
  { name:'Audisto AI', slug:'audisto', company:'Российский стартап', category:'Assistant', description:'AI для SEO-аудита: анализ сайта, поиск ошибок, рекомендации по оптимизации.', website:'https://audisto.ai', pricing:'freemium', hasApi:true, rating:7 },
  { name:'SberCloud AI', slug:'sbercloud-ai', company:'Сбер', category:'Code', description:'Облачная платформа для ML-разработки: Jupyter, GPU, AutoML, Mlflow.', website:'https://sbercloud.ru', pricing:'freemium', hasApi:true, rating:8 },
  { name:'Yandex Cloud AI', slug:'yandex-cloud-ai', company:'Яндекс', category:'Code', description:'AI-инфраструктура: Vision, Speech, Translation, Foundation Models.', website:'https://cloud.yandex.ru/services', pricing:'freemium', hasApi:true, rating:9 },
  { name:'Third Opinion', slug:'third-opinion', company:'Third Opinion', category:'Business', description:'Платформа для анализа медицинских изображений AI. Рентген, КТ, МРТ.', website:'https://thirdopinion.ai', pricing:'paid', hasApi:true, rating:8 },
  { name:'SberDevices AI', slug:'sberdevices', company:'Сбер', category:'Voice', description:'Умные устройства с AI: колонки SberBox, телевизоры, ассистент Салют.', website:'https://sberdevices.ru', pricing:'paid', hasApi:true, rating:7 },
];

async function main() {
  let created = 0;
  for (const p of projects) {
    const exists = await db.russianAIProject.findUnique({ where: { slug: p.slug } });
    if (exists) { console.log('skip: ' + p.name); continue; }
    await db.russianAIProject.create({ data: { ...p, useCases: '[]', howToStart: '' } });
    created++;
    console.log('+ ' + p.name);
  }
  console.log('Created: ' + created);
}

main().catch(console.error).finally(() => db.$disconnect());

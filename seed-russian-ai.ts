// Seed: 30 российских AI-проектов
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

const projects = [
  // 🤖 LLM
  { name:"YandexGPT", slug:"yandexgpt", company:"Яндекс", category:"LLM", description:"Большая языковая модель Яндекса. Встроена в Алису, Поиск, Браузер. API для разработчиков.", website:"https://ya.ru/ai/gpt", pricing:"freemium", hasApi:true, rating:9, useCases:"Чат-боты, генерация текстов, ассистенты, поиск", howToStart:"Зарегистрироваться в Yandex Cloud → получить API ключ → использовать через SDK" },
  { name:"GigaChat", slug:"gigachat", company:"Сбер", category:"LLM", description:"Флагманская LLM Сбера. Поддерживает текст, код и изображения. Работает через API и веб-интерфейс.", website:"https://developers.sber.ru/gigachat", pricing:"freemium", hasApi:true, rating:8, useCases:"Бизнес-ассистенты, генерация контента, код, креатив", howToStart:"Регистрация на developers.sber.ru → создать проект → получить токен" },
  { name:"T-Pro", slug:"t-pro", company:"Т-Банк", category:"LLM", description:"LLM от Т-Банка для внутренних задач и партнёров. Специализируется на финансовых данных.", website:"https://www.tbank.ru", pricing:"paid", hasApi:false, rating:6, useCases:"Финансовый анализ, поддержка клиентов, автоматизация", howToStart:"Корпоративный доступ через Т-Банк Бизнес" },
  { name:"Cotype", slug:"cotype", company:"МТС", category:"LLM", description:"Корпоративная AI-платформа МТС для бизнеса. NLP, аналитика, автоматизация процессов.", website:"https://cotype.ru", pricing:"paid", hasApi:true, rating:7, useCases:"Колл-центры, документооборот, HR, маркетинг", howToStart:"Сайт cotype.ru → демо-запрос → пилотный проект" },
  { name:"MWS GPT", slug:"mws-gpt", company:"МТС", category:"LLM", description:"Внутренняя LLM МТС для разработчиков и партнёров.", website:"https://mts.ru", pricing:"paid", hasApi:false, rating:5, useCases:"Внутренняя разработка, код-ревью, документация", howToStart:"Доступ через партнёрскую программу МТС" },
  { name:"RuGPT", slug:"rugpt", company:"Sber AI", category:"OpenSource", description:"Открытая русскоязычная GPT-подобная модель от Sber AI. Доступна на Hugging Face.", website:"https://huggingface.co/sberbank-ai/rugpt3large_based_on_gpt2", pricing:"free", hasApi:false, isOpenSource:true, rating:8, useCases:"Исследования, обучение, прототипы NLP", howToStart:"Скачать с Hugging Face → запустить локально или в Colab" },
  { name:"FRED-T5", slug:"fred-t5", company:"Sber AI", category:"OpenSource", description:"Модель на базе T5 для русского языка. Оптимизирована для summarization и Q&A.", website:"https://huggingface.co/sberbank-ai/FRED-T5-large", pricing:"free", hasApi:false, isOpenSource:true, rating:7, useCases:"Суммаризация, вопрос-ответ, классификация текстов", howToStart:"Скачать модель → запустить через transformers" },
  { name:"Saiga", slug:"saiga", company:"Open Source", category:"OpenSource", description:"Популярная русскоязычная LLM на базе LLaMA, файнтюненная на русских данных.", website:"https://huggingface.co/IlyaGusev/saiga_llama3_8b", pricing:"free", hasApi:false, isOpenSource:true, rating:9, useCases:"Чат-боты, ассистенты, генерация текстов на русском", howToStart:"Скачать с Hugging Face → запустить через llama.cpp или Ollama" },

  // 🎨 Генерация изображений
  { name:"Kandinsky", slug:"kandinsky", company:"Сбер", category:"Image", description:"Нейросеть для генерации изображений и видео по текстовому описанию. Флагманский продукт Сбера.", website:"https://www.sberbank.com/promo/kandinsky", pricing:"freemium", hasApi:true, rating:9, useCases:"Дизайн, реклама, контент, прототипирование", howToStart:"fusionbrain.ai → регистрация → API или веб-интерфейс" },
  { name:"Шедеврум", slug:"shedevrum", company:"Яндекс", category:"Image", description:"Приложение Яндекса для генерации изображений. Социальная сеть с AI-картинками.", website:"https://shedevrum.ai", pricing:"free", hasApi:false, rating:8, useCases:"Креатив, соцсети, вдохновение, дизайн", howToStart:"Скачать приложение → начать генерировать" },
  { name:"YandexART", slug:"yandexart", company:"Яндекс", category:"Image", description:"Технология генерации изображений Яндекса. Встроена в Яндекс Браузер, Маркет и другие сервисы.", website:"https://ya.ru/ai/art", pricing:"freemium", hasApi:true, rating:7, useCases:"E-commerce, контент, реклама, фон для товаров", howToStart:"Yandex Cloud → AI API → документация по генерации" },

  // 🎤 Голос и речь
  { name:"SpeechKit", slug:"speechkit", company:"Яндекс", category:"Voice", description:"Распознавание и синтез речи от Яндекса. 30+ языков, стриминг, кастомизация голоса.", website:"https://cloud.yandex.ru/services/speechkit", pricing:"freemium", hasApi:true, rating:9, useCases:"Колл-центры, голосовые ассистенты, озвучка, транскрибация", howToStart:"Yandex Cloud → SpeechKit → получить ключ → REST/gRPC API" },
  { name:"SaluteSpeech", slug:"salutespeech", company:"Сбер", category:"Voice", description:"Платформа распознавания и синтеза речи от Сбера. Используется в Салют и устройствах Sber.", website:"https://developers.sber.ru/portal/products/salutespeech", pricing:"freemium", hasApi:true, rating:8, useCases:"Голосовые интерфейсы, IVR, ассистенты", howToStart:"developers.sber.ru → продукты → SaluteSpeech → API ключ" },
  { name:"VoiceKit", slug:"voicekit", company:"VK", category:"Voice", description:"Голосовые технологии VK: распознавание, синтез, биометрия голоса.", website:"https://voicekit.mail.ru", pricing:"paid", hasApi:true, rating:7, useCases:"Голосовые боты, колл-центры, биометрия", howToStart:"voicekit.mail.ru → регистрация → документация API" },
  { name:"Silero", slug:"silero", company:"Silero Team", category:"OpenSource", description:"Открытые модели для speech-to-text и text-to-speech на русском. Высокое качество, малый размер.", website:"https://github.com/snakers4/silero-models", pricing:"free", hasApi:false, isOpenSource:true, rating:9, useCases:"Озвучка, распознавание, голосовые ассистенты, offline STT", howToStart:"GitHub → pip install → загрузить модель → примеры в README" },

  // 💻 Для разработчиков
  { name:"GigaCode", slug:"gigacode", company:"Сбер", category:"Code", description:"AI-ассистент для написания кода. Автодополнение, генерация, рефакторинг. Интеграция с IDE.", website:"https://gigacode.ru", pricing:"freemium", hasApi:true, rating:8, useCases:"Автодополнение кода, генерация функций, рефакторинг", howToStart:"Установить плагин для IDEA/VS Code → авторизоваться через Сбер ID" },
  { name:"SourceCraft", slug:"sourcecraft", company:"Российский стартап", category:"Code", description:"AI-парный программист. Анализирует кодовую базу, предлагает исправления и улучшения.", website:"https://sourcecraft.ai", pricing:"freemium", hasApi:false, rating:7, useCases:"Код-ревью, рефакторинг, поиск багов, документация", howToStart:"Установить расширение VS Code → авторизоваться" },
  { name:"BotHub", slug:"bothub", company:"Российский стартап", category:"Code", description:"Платформа для доступа к различным AI-моделям через единый API. Российский аналог OpenRouter.", website:"https://bothub.chat", pricing:"freemium", hasApi:true, rating:7, useCases:"Единый доступ к LLM, сравнение моделей, быстрая интеграция", howToStart:"Регистрация на bothub.chat → API ключ → документация" },

  // 🏭 AI для бизнеса
  { name:"AtomMind", slug:"atommind", company:"Росатом", category:"Business", description:"Промышленная AI-платформа Росатома. Цифровые двойники, предиктивная аналитика, оптимизация.", website:"https://rosatom.ru", pricing:"paid", hasApi:false, rating:6, useCases:"Промышленность, энергетика, логистика, производство", howToStart:"Корпоративный запрос через Росатом" },
  { name:"NtechLab FindFace", slug:"findface", company:"NtechLab", category:"Business", description:"Технология распознавания лиц мирового уровня. Используется в умных городах и безопасности.", website:"https://ntechlab.com", pricing:"paid", hasApi:true, rating:8, useCases:"Безопасность, умный город, идентификация, верификация", howToStart:"ntechlab.com → контакты → демо → API" },
  { name:"VisionLabs Luna", slug:"visionlabs", company:"VisionLabs", category:"Business", description:"Платформа компьютерного зрения: лица, объекты, жесты, эмоции.", website:"https://visionlabs.ai", pricing:"paid", hasApi:true, rating:8, useCases:"Безопасность, retail, банкинг, транспорт", howToStart:"visionlabs.ai → запрос демо → SDK/API" },
  { name:"SmartMarket AI", slug:"smartmarket", company:"Сбер", category:"Business", description:"AI-платформа для бизнеса: прогнозирование спроса, оптимизация цепочек поставок.", website:"https://developers.sber.ru", pricing:"paid", hasApi:true, rating:7, useCases:"Ритейл, логистика, прогнозирование", howToStart:"developers.sber.ru → продукты → SmartMarket" },

  // 🚀 AI-ассистенты и приложения
  { name:"Алиса Pro", slug:"alisa-pro", company:"Яндекс", category:"Assistant", description:"Профессиональная версия голосового ассистента Алиса для бизнеса.", website:"https://alice.yandex.ru/business", pricing:"paid", hasApi:true, rating:8, useCases:"Бизнес-ассистент, навыки, интеграции, колл-центр", howToStart:"dialogs.yandex.ru → платформа → создать навык" },
  { name:"Marusia AI", slug:"marusia", company:"VK", category:"Assistant", description:"Голосовой помощник VK. Работает в колонках Капсула и приложении.", website:"https://marusia.vk.com", pricing:"free", hasApi:true, rating:7, useCases:"Умный дом, голосовые команды, навыки", howToStart:"marusia.vk.com → для разработчиков → создание навыков" },
  { name:"MAX AI", slug:"max-ai", company:"VK", category:"Assistant", description:"Цифровой ассистент VK. Интегрирован в экосистему VK: почта, календарь, мессенджер.", website:"https://vk.com/max", pricing:"free", hasApi:false, rating:6, useCases:"Персональный ассистент, почта, календарь, задачи", howToStart:"Приложение VK → раздел MAX" },
  { name:"Сократик", slug:"sokratik", company:"Российский стартап", category:"Assistant", description:"AI-помощник для образования. Генерирует конспекты, тесты, объяснения.", website:"https://sokratik.ru", pricing:"freemium", hasApi:false, rating:7, useCases:"Образование, конспекты, подготовка к экзаменам", howToStart:"Сайт sokratik.ru → регистрация → загрузить материал" },
  { name:"Slidy", slug:"slidy", company:"Российский стартап", category:"Assistant", description:"AI-генератор презентаций. Текст → красивые слайды за минуту.", website:"https://slidy.ai", pricing:"freemium", hasApi:false, rating:7, useCases:"Презентации, питч-деки, отчёты", howToStart:"slidy.ai → регистрация → ввести тему → получить презентацию" },
  { name:"Begemot AI", slug:"begemot", company:"Российский стартап", category:"Assistant", description:"AI для создания учебных работ: рефераты, эссе, курсовые.", website:"https://begemot.ai", pricing:"freemium", hasApi:false, rating:6, useCases:"Образование, написание текстов, реферирование", howToStart:"begemot.ai → регистрация → выбрать тип работы → задать тему" },
  { name:"Neurobox", slug:"neurobox", company:"Российский стартап", category:"Agent", description:"Платформа для создания AI-агентов. No-code конструктор цепочек и автоматизаций.", website:"https://neurobox.ru", pricing:"freemium", hasApi:true, rating:8, useCases:"Автоматизация, AI-агенты, workflow, интеграции", howToStart:"neurobox.ru → регистрация → создать агента → подключить каналы" },
  { name:"Gigastore AI Agents", slug:"gigastore-agents", company:"Сбер", category:"Agent", description:"Магазин AI-агентов от Сбера. Готовые агенты для бизнес-задач.", website:"https://developers.sber.ru/gigastore", pricing:"paid", hasApi:true, rating:7, useCases:"Бизнес-автоматизация, агенты, интеграции", howToStart:"developers.sber.ru → Gigastore → выбрать агента → подключить" },
];

async function main() {
  let created = 0;
  for (const p of projects) {
    const exists = await db.russianAIProject.findUnique({ where: { slug: p.slug } });
    if (exists) { console.log(`⏭️  ${p.name}`); continue; }
    await db.russianAIProject.create({ data: { ...p, useCases: JSON.stringify(p.useCases.split(", ")), howToStart: p.howToStart } as any });
    created++;
    console.log(`✅ ${p.name}`);
  }
  console.log(`\n🎉 Created ${created} projects`);
}

main().catch(console.error).finally(() => db.$disconnect());

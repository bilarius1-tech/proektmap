/**
 * Фаза 1: публикация P0 поисковых активов (не RSS-фабрика).
 *
 *   npx tsx --env-file=.env scripts/content-engine/publish-p0-assets.ts
 *
 * Идемпотентно: upsert по slug. aiGenerated=false.
 */

import fs from "node:fs";
import path from "node:path";
import { getDb } from "../../src/lib/db/index";
import { ensureBlogCategory } from "../../src/lib/blog/categories";

type Asset = {
  demandId: string;
  slug: string;
  title: string;
  metaTitle: string;
  metaDesc: string;
  excerpt: string;
  tags: string;
  category: string;
  cluster: string;
  primaryKeyword: string;
  content: string;
};

const AUTHOR_EMAILS = [
  "bilariuss@yandex.ru",
  "bilarius@yandex.ru",
  process.env.ADMIN_EMAIL,
].filter(Boolean) as string[];

const ASSETS: Asset[] = [
  {
    demandId: "dm-agents-what",
    slug: "chto-takoe-ai-agent",
    title: "Что такое AI-агент: определение без хайпа",
    metaTitle: "Что такое AI-агент — определение и схема | ProektMap",
    metaDesc:
      "AI-агент — модель в окружении с целью, инструментами и проверкой. Чем отличается от чата, схема Harness → Loop → Graph на ProektMap.",
    excerpt:
      "Коротко: AI-агент — не «умный чат», а модель в каркасе: цель, инструменты, цикл с проверкой. Ниже — определение, отличие от ChatGPT и куда идти на ProektMap.",
    tags: "AI-агент,агенты,Harness,Loop,Graph,AI-инжиниринг,entity",
    category: "AI-инжиниринг",
    cluster: "ai-agents",
    primaryKeyword: "AI-агент",
    content: `
<p><strong>AI-агент</strong> — это языковая модель, которой дали цель, инструменты и правило остановки: она не только отвечает текстом, но и действует в цикле «сделал → проверил → исправил», пока критерий готовности не выполнен.</p>
<p>Чат без каркаса отвечает на вопрос. Агент работает в <em>окружении</em>: правила проекта, skills, права, бюджет шагов. На ProektMap это трек <a href="/agent-engineering">Инженерия агентов</a> — Harness → Loop → Graph.</p>

<h2>Чем агент отличается от обычного чата</h2>
<table>
<thead><tr><th>Чат (ChatGPT и аналоги)</th><th>AI-агент</th></tr></thead>
<tbody>
<tr><td>Один ответ на сообщение</td><td>Цикл до Definition of Done</td></tr>
<tr><td>Нет доступа к файлам/командам (или разовый)</td><td>Инструменты: терминал, код, MCP, браузер</td></tr>
<tr><td>Забывает «закон» репозитория</td><td>Harness: AGENTS.md, rules, skills</td></tr>
<tr><td>Красивый текст = «готово»</td><td>Готово = наблюдаемый результат + проверка</td></tr>
</tbody>
</table>

<h2>Плохо → хорошо: как ставить задачу агенту</h2>
<p><strong>Плохо:</strong> «Сделай нормального агента для сайта».</p>
<p><strong>Хорошо:</strong> «Собери harness: AGENTS.md с запретом force-reset, один skill на деплой, loop: build → curl HTTP 200 → стоп. Не трогай .env».</p>
<p><em>Почему:</em> без цели, инструментов и DoD модель имитирует работу, а не доводит до проверяемого результата.</p>

<h2>Три слоя на ProektMap</h2>
<ol>
<li><a href="/agent-engineering/harness">Harness</a> — каркас вокруг модели (правила, skills, права).</li>
<li><a href="/agent-engineering/loop">Loop</a> — повтор с критиком и бюджетом циклов.</li>
<li><a href="/agent-engineering/graph">Graph</a> — работа по карте зависимостей, не по угадайке.</li>
</ol>
<p>Практикум: <a href="/agent-engineering/grok-bot">Grok Bot</a>. Готовый продукт-маршрут после окружения: <a href="/resheniya">/resheniya</a>.</p>

<h2>Частые вопросы</h2>
<h3>Нужен ли отдельный «агентный» продукт?</h3>
<p>Нет. Нужны Cursor (или аналог), правила проекта и привычка проверять результат. Отдельный бренд агента без harness — маркетинг.</p>
<h3>Агент = AutoGPT?</h3>
<p>AutoGPT — один из ранних экспериментов. Сегодня практика ближе к IDE-агентам (Cursor) + skills + MCP. См. <a href="/arsenal">Нейро каталог</a>.</p>

<h2>Куда дальше</h2>
<ul>
<li><a href="/agent-engineering">Инженерия агентов</a> — пройти трек</li>
<li><a href="/ai-skills">AI Skills</a> — плохо/хорошо в заказах агенту</li>
<li><a href="/resheniya">Готовые решения</a> — собрать продукт по маршруту</li>
</ul>
`.trim(),
  },
  {
    demandId: "dm-tg-bot",
    slug: "kak-sdelat-telegram-bota-s-ai",
    title: "Как сделать Telegram-бота с AI: готовый маршрут",
    metaTitle: "Как сделать Telegram-бота с AI — маршрут ProektMap",
    metaDesc:
      "Пошагово: Cursor, grammY, BotFather, /start, VPS и PM2. Без выбора стека с нуля — готовый маршрут /resheniya/telegram-bot.",
    excerpt:
      "Не проектируйте стек с нуля. На ProektMap уже есть маршрут: Node + TypeScript + grammY → /start на VPS. Ниже — что сделать за первый день и типичная ошибка.",
    tags: "Telegram бот,AI бот,grammY,Cursor,готовые решения,guide",
    category: "AI-инжиниринг",
    cluster: "telegram-bot",
    primaryKeyword: "Telegram-бота с AI",
    content: `
<p><strong>Короткий ответ:</strong> зарегистрируйте бота в BotFather, соберите TypeScript-проект на grammY в Cursor, добейтесь ответа на <code>/start</code> локально, затем один процесс PM2 на VPS. На ProektMap этот путь уже разложен: <a href="/resheniya/telegram-bot">Запустить Telegram-бота</a>.</p>

<h2>Кому это нужно</h2>
<p>Вайбкодеру и AI-инженеру, которому нужен <em>живой</em> бот в Telegram, а не ещё один туториал «hello world» без деплоя и без проверки после reboot.</p>

<h2>Что рекомендует ProektMap и почему</h2>
<ul>
<li><strong>Cursor</strong> — писать и править код с агентом.</li>
<li><strong>Node.js + TypeScript + grammY</strong> — предсказуемый стек под Bot API.</li>
<li><strong>long polling + PM2</strong> — проще старт, чем webhook на первом запуске.</li>
<li><strong>Секреты в .env, не в Git</strong> — токен не утекает.</li>
</ul>
<p>Альтернативы есть, но в маршруте один главный путь — чтобы не застрять на выборе.</p>

<h2>Плохо → хорошо</h2>
<p><strong>Плохо:</strong> «Напиши мне умного телеграм-бота на AI».</p>
<p><strong>Хорошо:</strong> «По маршруту /resheniya/telegram-bot: BotFather → grammY → команды /start и /help → локальный тест → PM2 на VPS. Токен только в .env. Критерий: после reboot бот снова отвечает».</p>

<h2>Что сделать за первый день</h2>
<ol>
<li>Откройте <a href="/resheniya/telegram-bot">маршрут</a> и workspace — этапы уже с командами и промптами.</li>
<li>Создайте бота у @BotFather, положите токен в <code>.env</code>.</li>
<li>Соберите обработчик <code>/start</code> и <code>/help</code>, проверьте в реальном чате.</li>
<li>Когда локально стабильно — шаг Deploy: один процесс PM2, автозапуск.</li>
</ol>
<p>Наблюдаемый результат: публичный бот отвечает в Telegram и переживает перезапуск сервера.</p>

<h2>Типичная ошибка</h2>
<p>Сразу тащить «AI-мозг» (LLM в каждом сообщении), пока нет надёжного <code>/start</code> и деплоя. Сначала контур бота, потом интеллект. Для связки Cursor + Grok есть отдельный маршрут: <a href="/resheniya/grok-bot-cursor">Grok-бот в Cursor</a>.</p>

<h2>Куда дальше</h2>
<ul>
<li><a href="/resheniya/telegram-bot">Готовый маршрут Telegram-бота</a></li>
<li><a href="/agent-engineering">Инженерия агентов</a> — как разговаривать с Cursor по правилам</li>
<li><a href="/models">Модели</a> — что подключать для кода и проверки</li>
</ul>
`.trim(),
  },
  {
    demandId: "dm-saas-ai",
    slug: "kak-sdelat-saas-s-pomoshchyu-ai",
    title: "Как сделать SaaS с помощью AI: маршрут без анкеты",
    metaTitle: "Как сделать SaaS с AI — готовый маршрут | ProektMap",
    metaDesc:
      "Не проектируйте архитектуру с нуля. Маршрут /resheniya/saas-product: стек, этапы, промпты, проверка результата. Для вайбкодера из России.",
    excerpt:
      "SaaS с AI — не «попросил ChatGPT накидать код». Это маршрут: выбранный стек, этапы, артефакты и Definition of Done. На ProektMap он уже есть.",
    tags: "SaaS,AI,Next.js,готовые решения,вайбкодинг,guide",
    category: "AI-инжиниринг",
    cluster: "saas-product",
    primaryKeyword: "SaaS с помощью AI",
    content: `
<p><strong>Короткий ответ:</strong> откройте готовый маршрут <a href="/resheniya/saas-product">Запустить SaaS-продукт</a>, идите по этапам с готовыми командами и промптами, на каждом шаге подтверждайте наблюдаемый результат. Стек и порядок уже выбраны — анкету заполнять не нужно.</p>

<h2>Кому это нужно</h2>
<p>Тем, кто хочет довести продукт до работающего контура (регистрация, кабинет, оплата или ядро фичи), а не коллекционировать «идеи из чата».</p>

<h2>Что даёт маршрут ProektMap</h2>
<ul>
<li>Один рекомендуемый путь (не конструктор «выбери сам»).</li>
<li>Этапы: что делать → что выполнить → что скопировать → как понять, что получилось.</li>
<li>Связка с моделями, инструментами и skills внутри экосистемы.</li>
</ul>

<h2>Плохо → хорошо</h2>
<p><strong>Плохо:</strong> «Собери мне SaaS как Notion, только лучше, на AI».</p>
<p><strong>Хорошо:</strong> «Иду по /resheniya/saas-product. Сейчас этап N: артефакт X, критерий — страница открывается и форма создаёт запись в БД. Не меняй стек без причины».</p>
<p><em>Почему:</em> размытый заказ заставляет агента гадать. Маршрут сужает пространство ошибок.</p>

<h2>Что сделать за 10 минут</h2>
<ol>
<li>Откройте <a href="/resheniya">каталог решений</a> → SaaS.</li>
<li>Прочитайте результат маршрута (что будет «готово» глазами).</li>
<li>Запустите workspace и выполните первый шаг с проверкой.</li>
</ol>

<h2>Типичная ошибка</h2>
<p>Параллельно переписывать стек («а давай на другом фреймворке»), пока не закрыт текущий DoD. Сначала довести этап — потом осознанная развилка.</p>

<h2>Рядом по смыслу</h2>
<ul>
<li><a href="/resheniya/premium-landing">Премиум-лендинг</a> — если нужен сайт-витрина, не полный SaaS</li>
<li><a href="/services/site-template">Конструктор шаблона сайта</a> — быстрый старт каркаса</li>
<li><a href="/vaibik">Вайбик</a> — миссия №1, если вы совсем новичок в Cursor</li>
</ul>
`.trim(),
  },
  {
    demandId: "dm-cursor-start",
    slug: "kak-nachat-s-cursor",
    title: "Как начать с Cursor: первый вечер без хаоса",
    metaTitle: "Как начать с Cursor — первый вечер | ProektMap",
    metaDesc:
      "С чего начать в Cursor: правила проекта, один skill, одна миссия. Вайбик на ProektMap — маршрут для новичка, без бесконечной настройки.",
    excerpt:
      "Cursor мощный, но легко утонуть в настройках. Рабочий старт: закон проекта → одна задача → проверка. На ProektMap для этого есть Вайбик.",
    tags: "Cursor,вайбкодинг,Vaibik,новичок,guide,AI-инжиниринг",
    category: "AI-инжиниринг",
    cluster: "cursor-vibe",
    primaryKeyword: "начать с Cursor",
    content: `
<p><strong>Короткий ответ:</strong> установите Cursor, откройте один небольшой проект, задайте правила (что можно / нельзя), возьмите одну миссию с критерием «готово» и не прыгайте по десяти туториалам сразу. На ProektMap миссия №1 — <a href="/vaibik">Вайбик</a>.</p>

<h2>Кому это нужно</h2>
<p>Новичку в вайбкодинге и тому, кто уже открыл Cursor, но получает кашу из полуготовых файлов.</p>

<h2>Минимальный старт (вечером)</h2>
<ol>
<li>Cursor + доступ к модели (из РФ см. <a href="/ai-without-vpn">AI без VPN</a> и <a href="/models">модели</a>).</li>
<li>Папка проекта + короткий AGENTS.md / rules: запреты и стиль.</li>
<li>Одна задача на 30–60 минут с наблюдаемым результатом (страница открылась, бот ответил, тест зелёный).</li>
<li>Пройти <a href="/vaibik">Вайбик</a> — игровой вход, чтобы зафиксировать привычку «сделал → проверил».</li>
</ol>

<h2>Плохо → хорошо</h2>
<p><strong>Плохо:</strong> «Сделай мне крутой проект в Cursor».</p>
<p><strong>Хорошо:</strong> «В этом репозитории создай страницу /hello с заголовком и кнопкой. Не трогай другие папки. Готово = npm run dev открывает страницу без ошибок».</p>

<h2>Типичная ошибка</h2>
<p>Ставить десять расширений и skills до первой успешной проверки. Сначала петля Loop на крошечной задаче, потом усложнение. См. <a href="/agent-engineering/loop">Loop</a>.</p>

<h2>Куда дальше</h2>
<ul>
<li><a href="/vaibik">Вайбик</a> — миссия №1</li>
<li><a href="/ai-skills">AI Skills</a> — как писать заказы агенту</li>
<li><a href="/resheniya">Готовые решения</a> — когда готовы к продуктовому маршруту</li>
</ul>
`.trim(),
  },
  {
    demandId: "dm-no-vpn",
    slug: "neyroseti-bez-vpn-rossiya",
    title: "Нейросети без VPN в России: рабочий стек практика",
    metaTitle: "Нейросети без VPN в России — стек ProektMap",
    metaDesc:
      "Какие модели и сервисы доступны из РФ без танцев с VPN. Хаб /ai-without-vpn, каталог моделей и маршруты сборки на ProektMap.",
    excerpt:
      "Не нужен отдельный «серый» гайд из чатов. На ProektMap собран хаб: что работает из России, куда идти за моделями и как встроить в маршрут продукта.",
    tags: "без VPN,Россия,DeepSeek,YandexGPT,OpenRouter,guide",
    category: "AI-инжиниринг",
    cluster: "ai-russia",
    primaryKeyword: "нейросети без VPN",
    content: `
<p><strong>Короткий ответ:</strong> для учёбы и сборки продуктов из России опирайтесь на доступные API и локальные/российские сервисы, а не на «обязательный VPN ко всему». Актуальная карта — хаб <a href="/ai-without-vpn">AI без VPN</a>, модели — <a href="/models">/models</a>, российский контур — <a href="/russian-ai">/russian-ai</a>.</p>

<h2>Кому это нужно</h2>
<p>Вайбкодеру и AI-инженеру в РФ, которому нужен предсказуемый стек для Cursor, ботов и SaaS, а не лотерея с доступом.</p>

<h2>Как пользоваться хабом</h2>
<ol>
<li>Откройте <a href="/ai-without-vpn">AI без VPN</a> — обзор подходов и ограничений.</li>
<li>Сверьте модели в <a href="/models">каталоге</a> под задачу (код / текст / проверка).</li>
<li>В маршрутах <a href="/resheniya">/resheniya</a> уже заложены рекомендации «что подключать» на шагах.</li>
</ol>

<h2>Плохо → хорошо</h2>
<p><strong>Плохо:</strong> «Подскажи любую нейросеть, лишь бы без VPN».</p>
<p><strong>Хорошо:</strong> «Нужна coding-модель для Cursor из РФ + отдельная модель для ревью. Бюджет X. Не предлагай сервисы, которые требуют постоянного VPN».</p>

<h2>Типичная ошибка</h2>
<p>Строить весь прод на одном зарубежном ключе без запасного контура. В маршрутах ProektMap заложено разделение: модель для кода и модель для проверки.</p>

<h2>Куда дальше</h2>
<ul>
<li><a href="/ai-without-vpn">AI без VPN</a></li>
<li><a href="/russian-ai">Российский AI</a></li>
<li><a href="/resheniya/telegram-bot">Telegram-бот</a> — практика на доступном стеке</li>
</ul>
`.trim(),
  },
  {
    demandId: "dm-prompt",
    slug: "kak-pisat-prompty-dlya-cursor",
    title: "Как писать промпты для Cursor: плохо и хорошо",
    metaTitle: "Промпты для Cursor — плохо и хорошо | ProektMap",
    metaDesc:
      "Конкретные заказы агенту в Cursor: контекст, запреты, критерий готово. Примеры плохо→хорошо и библиотека /prompts на ProektMap.",
    excerpt:
      "Промпт для Cursor — не поэзия, а ТЗ: файлы, запреты, DoD. Ниже контраст плохо/хорошо и ссылки на /prompts и /ai-skills.",
    tags: "промпт,Cursor,prompt engineering,AI Skills,guide",
    category: "AI-инжиниринг",
    cluster: "prompts-skills",
    primaryKeyword: "промпты для Cursor",
    content: `
<p><strong>Короткий ответ:</strong> хороший промпт для Cursor называет цель, границы (какие файлы трогать), запреты и критерий «готово глазами». Готовые шаблоны — в <a href="/prompts">библиотеке промптов</a>, методика заказа — в <a href="/ai-skills">AI Skills</a>.</p>

<h2>Формула заказа</h2>
<ol>
<li>Контекст: что за проект и что уже есть.</li>
<li>Задача: один результат, не пять.</li>
<li>Границы: какие пути можно менять.</li>
<li>Запреты: не трогать секреты, не force-reset, не «улучшай всё».</li>
<li>Проверка: команда или экран, по которому видно успех.</li>
</ol>

<h2>Плохо → хорошо</h2>
<p><strong>Плохо:</strong> «Сделай красивый лендинг».</p>
<p><strong>Хорошо:</strong> «Собери лендинг на /landing: hero с названием продукта X, один CTA на /pricing, без карточек в первом экране. Стили из DESIGN.md. Готово = страница открывается на 375px без горизонтального скролла».</p>
<p><strong>Плохо:</strong> «Почини баги».</p>
<p><strong>Хорошо:</strong> «В src/app/api/login падает 500 при пустом email. Найди причину, покрой тестом, не меняй схему БД. Готово = тест зелёный и ручной запрос без 500».</p>

<h2>Что сделать за 10 минут</h2>
<ol>
<li>Откройте <a href="/prompts">/prompts</a> — возьмите шаблон под задачу.</li>
<li>Сверьте тон заказа с примерами на <a href="/ai-skills">/ai-skills</a>.</li>
<li>Вставьте в Cursor, добейтесь одной проверки, только потом усложняйте.</li>
</ol>

<h2>Типичная ошибка</h2>
<p>Длинный «ролевой» промпт без DoD. Роль («ты senior») не заменяет критерий готовности.</p>

<h2>Куда дальше</h2>
<ul>
<li><a href="/prompts">Библиотека промптов</a></li>
<li><a href="/ai-skills">AI Skills</a></li>
<li><a href="/agent-engineering">Инженерия агентов</a> — когда промпта мало и нужен harness</li>
</ul>
`.trim(),
  },
  {
    demandId: "dm-resheniya",
    slug: "gotovye-ai-resheniya-proektmap",
    title: "Готовые AI-решения ProektMap: зачем маршрут вместо курса",
    metaTitle: "Готовые AI-решения — каталог маршрутов | ProektMap",
    metaDesc:
      "Что такое /resheniya: готовый стек, этапы, промпты и проверка результата. Не курс и не анкета — маршрут до наблюдаемого результата.",
    excerpt:
      "/resheniya — центр продукта ProektMap: выбранный стек и путь до проверки. Ниже — кому заходить и как выбрать первое решение.",
    tags: "готовые решения,resheniya,SaaS,Telegram,вайбкодинг,commercial",
    category: "AI-инжиниринг",
    cluster: "resheniya-hub",
    primaryKeyword: "готовые AI решения",
    content: `
<p><strong>Короткий ответ:</strong> <a href="/resheniya">Готовые решения AI</a> — это каталог инженерных маршрутов: результат заранее описан, стек выбран, на каждом шаге есть команды/промпты и критерий «получилось». Это не видеокурс и не конструктор анкет.</p>

<h2>Кому заходить</h2>
<p>Вайбкодеру и AI-инженеру в России, который хочет собрать Telegram-бота, SaaS или лендинг с AI по готовому маршруту — без недели выбора фреймворка.</p>

<h2>Как выбрать за 5 минут</h2>
<ol>
<li>Откройте <a href="/resheniya">/resheniya</a>.</li>
<li>Смотрите на <em>результат</em> карточки, не на модный стек.</li>
<li>Войдите в workspace и выполните шаг 1 с проверкой.</li>
</ol>

<h2>Плохо → хорошо</h2>
<p><strong>Плохо:</strong> листать 40 туториалов и собирать «свой уникальный стек» до первого деплоя.</p>
<p><strong>Хорошо:</strong> взять маршрут ProektMap, довести до DoD, затем осознанно менять детали.</p>

<h2>Примеры маршрутов (ядро)</h2>
<ul>
<li><a href="/resheniya/telegram-bot">Telegram-бот</a></li>
<li><a href="/resheniya/saas-product">SaaS-продукт</a></li>
<li><a href="/resheniya/premium-landing">Премиум-лендинг</a></li>
<li><a href="/resheniya/grok-bot-cursor">Grok-бот в Cursor</a></li>
</ul>

<h2>Связка с обучением</h2>
<p>Окружение агента: <a href="/agent-engineering">/agent-engineering</a>. Старт новичка: <a href="/vaibik">/vaibik</a>. Стек из РФ: <a href="/ai-without-vpn">/ai-without-vpn</a>. Инструменты в браузере: <a href="/services">/services</a>.</p>
`.trim(),
  },
  {
    demandId: "dm-agents-how",
    slug: "kak-sozdat-ai-agenta-s-nulya",
    title: "Как создать AI-агента с нуля: окружение важнее промпта",
    metaTitle: "Как создать AI-агента с нуля — Harness Loop Graph | ProektMap",
    metaDesc:
      "Пошагово: цель, harness, loop с проверкой, первая миссия. Не «умный промпт», а окружение агента на ProektMap и в Cursor.",
    excerpt:
      "Агента с нуля собирают не из красивой фразы, а из каркаса: правила, цикл, критерий готово. Ниже — маршрут новичка на ProektMap.",
    tags: "AI-агент,с нуля,Harness,Loop,Cursor,вайбкодинг,guide",
    category: "AI-инжиниринг",
    cluster: "ai-agents",
    primaryKeyword: "создать AI агента с нуля",
    content: `
<p><strong>Короткий ответ:</strong> определите одну цель с наблюдаемым результатом, соберите harness (правила проекта + один skill), запустите loop «сделал → проверил → исправил», только потом усложняйте. На ProektMap это трек <a href="/agent-engineering">Инженерия агентов</a>; практика продукта — в <a href="/resheniya">/resheniya</a>.</p>

<h2>Что значит «с нуля»</h2>
<p>Не «установить AutoGPT и ждать чудес». С нуля = вы управляете окружением: что агенту можно, куда смотреть, когда стоп. Модель — двигатель; harness — руль.</p>

<h2>Пять шагов</h2>
<ol>
<li><strong>Цель.</strong> Один результат: страница открылась, бот ответил, тест зелёный.</li>
<li><strong>Среда.</strong> Cursor (или аналог) + доступ к модели из РФ — см. <a href="/ai-without-vpn">AI без VPN</a>.</li>
<li><strong>Harness.</strong> Короткий AGENTS.md / rules: запреты, стиль, «не трогай .env». Модуль: <a href="/agent-engineering/harness">Harness</a>.</li>
<li><strong>Loop.</strong> Бюджет циклов + проверка. Модуль: <a href="/agent-engineering/loop">Loop</a>.</li>
<li><strong>Миссия.</strong> Маленький продукт по маршруту <a href="/resheniya/telegram-bot">Telegram-бот</a> или старт в <a href="/vaibik">Вайбике</a>.</li>
</ol>

<h2>Плохо → хорошо</h2>
<p><strong>Плохо:</strong> «Стань автономным агентом и улучши весь проект».</p>
<p><strong>Хорошо:</strong> «Harness уже в репозитории. Сделай страницу /status с текстом OK. Не меняй другие файлы. Готово = curl возвращает 200 и виден текст».</p>
<p><em>Почему:</em> без границ агент «улучшает» всё подряд и ломает контур.</p>

<h2>Типичная ошибка</h2>
<p>Сначала купить десять tools и MCP, потом искать задачу. Сначала DoD и один loop — потом инструменты. Карта зависимостей: <a href="/agent-engineering/graph">Graph</a>.</p>

<h2>Куда дальше</h2>
<ul>
<li><a href="/blog/chto-takoe-ai-agent">Что такое AI-агент</a> — определение</li>
<li><a href="/agent-engineering">Трек инженерии агентов</a></li>
<li><a href="/ai-skills">AI Skills</a> — как писать заказы</li>
<li><a href="/resheniya">Готовые решения</a> — первая продуктовая миссия</li>
</ul>
`.trim(),
  },
  {
    demandId: "dm-vibecoding",
    slug: "chto-takoe-vaybkodling",
    title: "Что такое вайбкодинг: определение для практики в России",
    metaTitle: "Что такое вайбкодинг — определение | ProektMap",
    metaDesc:
      "Вайбкодинг — сборка продукта с AI-агентом в IDE, а не бесконечный чат. Как начать в РФ: Cursor, правила, Вайбик на ProektMap.",
    excerpt:
      "Вайбкодинг — это не «попросил ChatGPT и вставил код». Это работа в редакторе с агентом, правилами и проверкой результата. Ниже — коротко и по делу.",
    tags: "вайбкодинг,vibe coding,Cursor,Vaibik,entity,обучение",
    category: "AI-инжиниринг",
    cluster: "cursor-vibe",
    primaryKeyword: "вайбкодинг",
    content: `
<p><strong>Вайбкодинг</strong> — способ собирать софт вместе с AI-агентом в среде разработки (часто Cursor): вы задаёте цель и границы, агент пишет и правит код, вы проверяете результат. Это не замена мышления и не «магия одного промпта».</p>

<h2>Чем отличается от обычного чата</h2>
<table>
<thead><tr><th>Чат в браузере</th><th>Вайбкодинг</th></tr></thead>
<tbody>
<tr><td>Ответ текстом / фрагментом кода</td><td>Правки в реальном проекте</td></tr>
<tr><td>Легко потерять контекст файлов</td><td>Агент видит репозиторий (в рамках прав)</td></tr>
<tr><td>«Кажется, готово»</td><td>Готово = запуск, тест, экран</td></tr>
</tbody>
</table>

<h2>Плохо → хорошо</h2>
<p><strong>Плохо:</strong> «Свайбкодь мне стартап».</p>
<p><strong>Хорошо:</strong> «В этой папке собери страницу лендинга с одним CTA. Стили из DESIGN.md. Готово = открывается на телефоне без горизонтального скролла».</p>

<h2>С чего начать в России</h2>
<ol>
<li>Cursor + модель, доступная без танцев — <a href="/ai-without-vpn">AI без VPN</a>.</li>
<li>Одна миссия с проверкой — <a href="/vaibik">Вайбик</a> (вход для новичка).</li>
<li>Правила заказа агенту — <a href="/ai-skills">AI Skills</a> и <a href="/blog/kak-pisat-prompty-dlya-cursor">промпты для Cursor</a>.</li>
<li>Продуктовый маршрут — <a href="/resheniya">/resheniya</a>.</li>
</ol>

<h2>Типичная ошибка</h2>
<p>Путать вайбкодинг с копированием ответов из чата без запуска. Если код не проверяли — это не вайбкодинг, а черновик.</p>

<h2>Куда дальше</h2>
<ul>
<li><a href="/vaibik">Вайбик — миссия №1</a></li>
<li><a href="/blog/kak-nachat-s-cursor">Как начать с Cursor</a></li>
<li><a href="/agent-engineering">Инженерия агентов</a></li>
</ul>
`.trim(),
  },
  {
    demandId: "dm-learn-ai-ru",
    slug: "obuchenie-ai-inzhenerii-rossiya",
    title: "Обучение AI-инженерии в России: карта ProektMap",
    metaTitle: "Обучение AI-инженерии в России — карта | ProektMap",
    metaDesc:
      "С чего учить AI-инженерию из РФ: агенты, вайбкодинг, маршруты /resheniya, модели без VPN. Не курс ради курса — практика с проверкой.",
    excerpt:
      "ProektMap — карта обучения AI-инженерии для практики в России: окружение агента, вайбкодинг, готовые маршруты продуктов. Ниже — куда зайти первым.",
    tags: "обучение,AI-инженерия,Россия,вайбкодинг,guide",
    category: "AI-инжиниринг",
    cluster: "resheniya-hub",
    primaryKeyword: "обучение AI инженерии",
    content: `
<p><strong>Короткий ответ:</strong> учите не «нейросети вообще», а контур практика: как ставить задачу агенту, как проверять результат, как собрать маленький продукт. На ProektMap путь такой: <a href="/agent-engineering">инженерия агентов</a> → <a href="/vaibik">Вайбик / Cursor</a> → <a href="/resheniya">готовое решение</a>, со стеком из РФ через <a href="/ai-without-vpn">AI без VPN</a>.</p>

<h2>Кому это</h2>
<p>Новичкам в вайбкодинге и тем, кто уже трогал ChatGPT, но не доводит проекты до работающего контура в России.</p>

<h2>Карта обучения (без воды)</h2>
<ol>
<li><strong>Язык заказа.</strong> Плохо/хорошо промпты — <a href="/ai-skills">/ai-skills</a>, <a href="/prompts">/prompts</a>.</li>
<li><strong>Окружение агента.</strong> Harness → Loop → Graph — <a href="/agent-engineering">/agent-engineering</a>.</li>
<li><strong>Первая миссия.</strong> <a href="/vaibik">Вайбик</a> или небольшой маршрут в <a href="/resheniya">/resheniya</a>.</li>
<li><strong>Модели и доступ.</strong> <a href="/models">/models</a>, <a href="/russian-ai">/russian-ai</a>.</li>
<li><strong>Инструменты.</strong> <a href="/arsenal">Нейро каталог</a>, <a href="/mcp">MCP</a>.</li>
</ol>

<h2>Плохо → хорошо</h2>
<p><strong>Плохо:</strong> «Хочу выучить AI за выходные по случайным роликам».</p>
<p><strong>Хорошо:</strong> «За две недели: harness в учебном репо + один маршрут Telegram-бота до /start на VPS. Критерий — бот отвечает после reboot».</p>

<h2>Типичная ошибка</h2>
<p>Коллекционировать курсы и ключи API без одного доведённого артефакта. На ProektMap артефакт важнее сертификата.</p>

<h2>Куда дальше</h2>
<ul>
<li><a href="/agent-engineering">Инженерия агентов</a></li>
<li><a href="/resheniya">Готовые решения</a></li>
<li><a href="/blog/chto-takoe-vaybkodling">Что такое вайбкодинг</a></li>
<li><a href="/sitemap">Карта сайта</a> — вся структура</li>
</ul>
`.trim(),
  },
  {
    demandId: "dm-cursor-vs",
    slug: "cursor-vs-vscode-copilot",
    title: "Cursor vs VS Code Copilot: что выбрать вайбкодеру в РФ",
    metaTitle: "Cursor vs Copilot — сравнение для РФ | ProektMap",
    metaDesc:
      "Чем Cursor отличается от VS Code + Copilot для вайбкодинга. Таблица для практика в России и куда идти на ProektMap.",
    excerpt:
      "Оба помогают писать код с AI. Разница — в глубине агента и привычке «миссия → проверка». Ниже сравнение без рекламы и старт на ProektMap.",
    tags: "Cursor,Copilot,VS Code,сравнение,вайбкодинг,comparison",
    category: "AI-инжиниринг",
    cluster: "cursor-vibe",
    primaryKeyword: "Cursor vs Copilot",
    content: `
<p><strong>Короткий ответ:</strong> VS Code + Copilot сильнее как «умный автодополнитель» в привычном редакторе. Cursor заточен под агентный вайбкодинг: чат/агент ближе к правкам по всему проекту. Для маршрутов ProektMap чаще рекомендуем Cursor — см. <a href="/vaibik">Вайбик</a> и <a href="/resheniya">/resheniya</a>.</p>

<h2>Сравнение для практика</h2>
<table>
<thead><tr><th>Критерий</th><th>VS Code + Copilot</th><th>Cursor</th></tr></thead>
<tbody>
<tr><td>Привычный UX</td><td>Максимально знакомый</td><td>Похож на VS Code, свой продукт</td></tr>
<tr><td>Агент по репозиторию</td><td>Есть, зависит от режима</td><td>Центральный сценарий</td></tr>
<tr><td>Вайбкодинг «миссия → DoD»</td><td>Можно, но меньше «из коробки»</td><td>Удобнее для loop</td></tr>
<tr><td>Доступ из РФ</td><td>Смотрите актуальные ограничения</td><td>То же + запасные модели — <a href="/ai-without-vpn">без VPN</a></td></tr>
<tr><td>Цена</td><td>Подписка Copilot</td><td>Подписка Cursor; оплата из РФ — см. маршруты /resheniya</td></tr>
</tbody>
</table>
<p>Цифры тарифов меняются — перед оплатой сверяйте официальные сайты. ProektMap не продаёт подписки IDE.</p>

<h2>Плохо → хорошо</h2>
<p><strong>Плохо:</strong> «Какой редактор круче, скажи один и навсегда».</p>
<p><strong>Хорошо:</strong> «Нужен агент для правок в монорепо и проверка через npm test. Бюджет подписки X. Работаю из РФ».</p>

<h2>Что выбрать на старте</h2>
<ol>
<li>Если цель — вайбкодинг и маршруты ProektMap → начните с Cursor + <a href="/blog/kak-nachat-s-cursor">гайд старта</a>.</li>
<li>Если уже глубоко в VS Code и нужен только автокомплит → Copilot нормален; агентные привычки всё равно учите через <a href="/agent-engineering">Harness/Loop</a>.</li>
</ol>

<h2>Куда дальше</h2>
<ul>
<li><a href="/vaibik">Вайбик</a></li>
<li><a href="/blog/chto-takoe-vaybkodling">Что такое вайбкодинг</a></li>
<li><a href="/models">Каталог моделей</a></li>
</ul>
`.trim(),
  },
];

async function resolveAuthorId(db: Awaited<ReturnType<typeof getDb>>): Promise<string> {
  for (const email of AUTHOR_EMAILS) {
    const u = await db.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true, email: true },
    });
    if (u) return u.id;
  }
  const admin = await db.user.findFirst({
    where: { role: "admin" },
    select: { id: true, email: true },
  });
  if (!admin) throw new Error("Admin author not found");
  return admin.id;
}

async function main() {
  const db = await getDb();
  const authorId = await resolveAuthorId(db);
  const outDir = path.join(process.cwd(), "data/content-engine/assets");
  fs.mkdirSync(outDir, { recursive: true });

  const results: { demandId: string; slug: string; url: string; action: string }[] = [];

  for (const asset of ASSETS) {
    const cat = await ensureBlogCategory(db, asset.category);
    if (!cat) throw new Error(`Category failed: ${asset.category}`);

    const marker = `<!-- content-asset:${asset.demandId}; cluster:${asset.cluster}; primary:${encodeURIComponent(asset.primaryKeyword)} -->`;
    const content = `${marker}\n${asset.content}`;

    fs.writeFileSync(
      path.join(outDir, `${asset.slug}.html`),
      content,
      "utf8",
    );

    const existing = await db.blogPost.findUnique({ where: { slug: asset.slug } });
    const data = {
      title: asset.title,
      slug: asset.slug,
      content,
      excerpt: asset.excerpt,
      coverImage: `/api/og?title=${encodeURIComponent(asset.title.slice(0, 80))}&category=${encodeURIComponent(asset.category)}`,
      status: "published" as const,
      tags: asset.tags,
      metaTitle: asset.metaTitle,
      metaDesc: asset.metaDesc,
      categoryId: cat.id,
      authorId,
      aiGenerated: false,
      aiModel: "",
      publishedAt: existing?.publishedAt || new Date(),
    };

    if (existing) {
      await db.blogPost.update({
        where: { slug: asset.slug },
        data: {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          tags: data.tags,
          metaTitle: data.metaTitle,
          metaDesc: data.metaDesc,
          categoryId: data.categoryId,
          authorId: data.authorId,
          aiGenerated: false,
          status: "published",
          coverImage: existing.coverImage || data.coverImage,
        },
      });
      results.push({
        demandId: asset.demandId,
        slug: asset.slug,
        url: `https://proektmap.ru/blog/${asset.slug}`,
        action: "updated",
      });
    } else {
      await db.blogPost.create({ data });
      results.push({
        demandId: asset.demandId,
        slug: asset.slug,
        url: `https://proektmap.ru/blog/${asset.slug}`,
        action: "created",
      });
    }
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    count: results.length,
    results,
    note: "P0 search assets — human-authored, not auto-publish factory",
  };
  fs.writeFileSync(
    path.join(process.cwd(), "data/content-engine/p0-assets-manifest.json"),
    JSON.stringify(manifest, null, 2),
  );

  console.log(JSON.stringify(manifest, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

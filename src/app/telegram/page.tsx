import { getDb } from "@/lib/db/index";
import Link from "next/link";
import Term from "@/components/glossary/tooltip-term";
import { Bot, ArrowRight, GitBranch, Database, CreditCard, Brain, Smartphone, Rocket, Globe, BookOpen, ShoppingCart, Lightbulb, Code2, Wrench, GraduationCap, Sparkles, Timer, Wallet, AlertTriangle, Key, MessageCircle, Zap, Shield, HelpCircle, ChevronDown, Copy, Check } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Telegram Боты — полная экосистема AI-разработки",
  description: "Всё для создания Telegram ботов: Blueprint, AI-инструменты, готовые решения, навыки, глоссарий, FAQ. От идеи до работающего бота с платежами и AI.",
};

const PHASE_ICONS: Record<string, any> = { GitBranch, Database, CreditCard, Brain, Smartphone, Rocket };

export default async function TelegramPage() {
  const db = await getDb();

  const [blueprint, tools, solutions, skills, glossary, patterns] = await Promise.all([
    db.blueprint.findUnique({
      where: { slug: "telegram-bot" },
      include: { stages: { include: { stage: true }, orderBy: { sortOrder: "asc" } } },
    }),
    db.aITool.findMany({
      where: { bestFor: { contains: "telegram" }, isActive: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    }),
    db.solution.findMany({
      where: { isPublished: true, OR: [{ title: { contains: "Бот" } }, { title: { contains: "Telegram" } }, { title: { contains: "бот" } }] },
      orderBy: { createdAt: "desc" },
      take: 3,
    }),
    db.skill.findMany({
      where: { isPublished: true, title: { contains: "Telegram" } },
      orderBy: { sortOrder: "asc" },
      take: 4,
    }),
    db.glossaryTerm.findMany({
      where: { isPublished: true, category: "Telegram" },
      orderBy: { sortOrder: "asc" },
      take: 12,
    }),
    db.buildPattern.findMany({
      where: { isPublished: true, OR: [{ title: { contains: "Telegram" } }, { title: { contains: "бот" } }] },
      take: 3,
    }),
  ]);

  const stages = blueprint?.stages || [];

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>

      {/* ═══ HERO ═══ */}
      <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", padding: "80px 20px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(0,136,204,0.15), transparent 70%)" }} />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: "var(--radius-full)", background: "rgba(0,136,204,0.2)", color: "#0af", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
            <Bot size={16} /> Telegram Bot MAX
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 800, lineHeight: 1.05, marginBottom: "var(--space-s)", letterSpacing: "-0.02em", color: "#fff" }}>
            Всё для создания<br />Telegram Ботов
          </h1>
          <p style={{ fontSize: "var(--text-l)", color: "rgba(255,255,255,0.7)", maxWidth: 520, margin: "0 auto var(--space-xl)", lineHeight: 1.7 }}>
            От получения токена у <Term term="BotFather" /> до работающего бота с <Term term="Telegram Stars" /> и AI. Полная экосистема: Blueprint, инструменты, готовые решения.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/telegram-bot" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Пройти Blueprint <ArrowRight size={16} />
            </Link>
            <a href="#howto" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Как создать бота <Key size={16} />
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>

        {/* ═══ WHAT IS A TELEGRAM BOT ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
            Что такое Telegram Бот?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-xl)" }}>

            <div>
              <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-primary)", lineHeight: 1.8, margin: "0 0 var(--space-m)" }}>
                <strong>Telegram Бот</strong> — это программа, которая живёт внутри Telegram. Пользователь пишет боту в чат, нажимает <Term term="Inline Keyboard" /> — и получает результат: ответ на вопрос, товар из каталога, оплату, уведомление.
              </p>
              <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.8, margin: "0 0 var(--space-m)" }}>
                Технически бот — это сервер, который общается с <Term term="Telegram Bot API" /> через HTTP. Ты пишешь код, Telegram присылает сообщения пользователей на твой сервер, а ты отвечаешь через API. Никакой магии — чистый HTTP и JSON.
              </p>
              <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.8, margin: 0 }}>
                В отличие от сайта или приложения, боту <strong>не нужна установка</strong>. Пользователь просто открывает ссылку <code style={{ background: "var(--color-bg-secondary)", padding: "2px 6px", borderRadius: 4, fontSize: "var(--text-xs)" }}>t.me/your_bot</code> и сразу начинает взаимодействие. Это делает ботов идеальным каналом для бизнеса в России, где Telegram — платформа №1.
              </p>
            </div>

            <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", padding: "var(--space-xl)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-m)" }}>Популярные сценарии</h3>
              <ScenarioItem icon={<ShoppingCart size={16} />} title="Интернет-магазин" desc="Каталог товаров, корзина, оплата через ЮKassa — прямо в чате." />
              <ScenarioItem icon={<MessageCircle size={16} />} title="AI-консультант" desc="Бот с RAG по вашей базе знаний. Отвечает 24/7, эскалирует на оператора." />
              <ScenarioItem icon={<Zap size={16} />} title="Автоматизация" desc="Уведомления о заказах, сбор заявок, интеграция с CRM и Google Sheets." />
              <ScenarioItem icon={<Globe size={16} />} title="Mini App" desc="Полноценное веб-приложение внутри Telegram: запись, бронирование, панель управления." />
              <ScenarioItem icon={<Bot size={16} />} title="Игры и квизы" desc="Викторины, текстовые RPG, опросы с ветвлением — всё на <Term term='Inline Keyboard' />." />
            </div>
          </div>
        </section>

        {/* ═══ HOW TO CREATE ═══ */}
        <section id="howto" style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)", letterSpacing: "-0.01em" }}>
            Как создать Telegram Бота: пошагово
          </h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-xl)" }}>
            От нуля до первого ответа пользователю. Без воды — только рабочие шаги.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
            {/* Step 1 */}
            <StepCard num={1} title="Получи токен у @BotFather" icon={<Key size={20} />}>
              <StepContent>
                1. Открой Telegram и напиши <a href="https://t.me/botfather" target="_blank" style={{ color: "var(--color-accent)" }}>@BotFather</a> — это официальный конструктор ботов от Telegram.<br />
                2. Отправь команду <InlineCode>/newbot</InlineCode> и следуй инструкциям: придумай <strong>имя</strong> бота (например «Мой Магазин») и <strong>username</strong> (например <InlineCode>my_shop_bot</InlineCode>). Username должен заканчиваться на <InlineCode>bot</InlineCode>.<br />
                3. <Term term="BotFather" /> выдаст <strong>токен</strong> — длинную строку вроде <InlineCode>123456:ABC-DEF1234ghikl...</InlineCode><br />
                ⚠️ <strong>Никому не показывай токен!</strong> Кто знает токен — управляет ботом.
              </StepContent>
            </StepCard>

            {/* Step 2 */}
            <StepCard num={2} title="Выбери фреймворк" icon={<Code2 size={20} />}>
              <StepContent>
                Для Python — <Term term="aiogram" /> (самый популярный в РФ). Для JavaScript/TypeScript — <Term term="grammy" />.<br />
                Установка aiogram: <InlineCode>pip install aiogram</InlineCode><br />
                Установка grammy: <InlineCode>npm install grammy</InlineCode>
              </StepContent>
            </StepCard>

            {/* Step 3 */}
            <StepCard num={3} title="Напиши echo-бота (5 строк)" icon={<MessageCircle size={20} />}>
              <StepContent>
                Простейший бот, который отвечает тем же текстом:
                <CodeBlock>{`from aiogram import Bot, Dispatcher, types
import asyncio

bot = Bot(token="ТВОЙ_ТОКЕН")
dp = Dispatcher()

@dp.message()
async def echo(message: types.Message):
    await message.answer(message.text)

asyncio.run(dp.start_polling(bot))`}</CodeBlock>
                Замени <InlineCode>ТВОЙ_ТОКЕН</InlineCode> на токен от BotFather, запусти — бот отвечает!
              </StepContent>
            </StepCard>

            {/* Step 4 */}
            <StepCard num={4} title="Выбери способ получения сообщений" icon={<GitBranch size={20} />}>
              <StepContent>
                <strong><Term term="Polling" /> (Long Polling)</strong> — бот постоянно спрашивает Telegram «есть что новое?». Простой, но жрёт ресурсы. Подходит для разработки.<br />
                <strong><Term term="Webhook" /></strong> — Telegram сам присылает обновления на твой URL. Быстрее и экономичнее. Требует HTTPS-домен.<br />
                Мы рекомендуем: Polling для прототипа → Webhook для продакшена.
              </StepContent>
            </StepCard>

            {/* Step 5 */}
            <StepCard num={5} title="Задеплой на сервер" icon={<Rocket size={20} />}>
              <StepContent>
                Бот должен работать 24/7. Самый простой вариант — <strong>VDS от Beget или TimeWeb</strong> (400-800 ₽/мес).<br />
                Запусти бота через <InlineCode>pm2</InlineCode> или <InlineCode>systemd</InlineCode> чтобы он перезапускался при падении.<br />
                Для Mini App понадобится домен с HTTPS. Бесплатный SSL через LetsEncrypt.
              </StepContent>
            </StepCard>
          </div>
        </section>

        {/* ═══ PITFALLS ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-l)" }}>
            <div style={{ width: 40, height: 40, borderRadius: "var(--radius-m)", background: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={22} style={{ color: "#000" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>Подводные камни</h2>
          </div>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-l)" }}>
            Типичные ошибки новичков — прочитай сейчас, чтобы не наступить потом.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-m)" }}>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Токен в коде = взлом">
              Никогда не коммить токен в Git! Используй <InlineCode>.env</InlineCode> и переменные окружения. Если токен утёк — сбрось его через <Term term="BotFather" /> командой <InlineCode>/revoke</InlineCode>.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Polling в продакшене">
              Новички запускают Polling на бою и удивляются счетам. Каждый polling-запрос жрёт CPU. <Term term="Webhook" /> экономит ресурсы в 10+ раз.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Нет обработки ошибок">
              Если бот упадёт на одном сообщении — он перестанет отвечать всем. Оборачивай каждый handler в try/except и логируй ошибки.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Забыли про 54-ФЗ">
              При приёме платежей через ЮKassa чеки обязательны. Без ИП/ООО можешь использовать <Term term="Telegram Stars" /> — они не требуют кассы.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Бот = один процесс">
              Если ты запустил <Term term="Long Polling" /> в одном потоке — второй пользователь ждёт пока обработается первый. Используй асинхронность (aiogram async/await) или несколько worker'ов.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Забыли про лимиты API">
              Telegram Bot API имеет лимиты: ~30 сообщений/сек в группу, ~20/сек в личку. При рассылке на 10K пользователей нужна очередь с rate limiting.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Mini App: забыли про инициализацию">
              Mini App не видит пользователя пока не вызовешь <InlineCode>WebApp.ready()</InlineCode>. Без этого initData пустая — авторизация не работает.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="GPT без бюджета = банкрот">
              AI-запросы стоят денег. Один пользователь может нагенерить на тысячи рублей. Ставь дневные лимиты и кэшируй частые ответы.
            </PitfallCard>
          </div>
        </section>

        {/* ═══ WHY TELEGRAM ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
            Почему Telegram Бот?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-l)" }}>
            <ReasonCard icon={<Globe size={28} />} title="900M+ пользователей" desc="Telegram входит в топ-5 мессенджеров мира. В России им пользуются >60% населения." />
            <ReasonCard icon={<Wallet size={28} />} title="Встроенные платежи" desc="ЮKassa и Telegram Stars — принимай деньги прямо в чате. Без сайта, без лишних переходов." />
            <ReasonCard icon={<Smartphone size={28} />} title="Mini Apps" desc="Полноценные веб-приложения внутри Telegram. Свой магазин, CRM, панель управления." />
            <ReasonCard icon={<Bot size={28} />} title="Никаких установок" desc="Пользователь просто открывает бота. Не надо скачивать приложение или регистрироваться." />
          </div>
        </section>

        {/* ═══ BLUEPRINT ═══ */}
        {blueprint && (
          <section style={{ marginBottom: "var(--space-xxl)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "var(--space-l)" }}>
              <div style={{ width: 48, height: 48, borderRadius: "var(--radius-m)", background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Bot size={24} /></div>
              <div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, margin: 0 }}>{blueprint.title}</h2>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", margin: "4px 0 0" }}>{blueprint.description}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginBottom: "var(--space-l)", padding: "var(--space-m) var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)" }}>
              <Stat icon={<Timer size={16} />} label="Время" value={blueprint.timeToComplete || "2–3 недели"} />
              <Stat icon={<Sparkles size={16} />} label="XP" value={`${blueprint.totalXp} XP`} />
              <Stat icon={<GraduationCap size={16} />} label="Решений" value={String(blueprint.totalDecisions)} />
              <Stat icon={<Globe size={16} />} label="Сложность" value={blueprint.difficulty === "medium" ? "Средняя" : "Лёгкая"} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-m)" }}>
              {stages.map((bs: any, i: number) => {
                const s = bs.stage;
                const Icon = PHASE_ICONS[s.icon] || GitBranch;
                return (
                  <Link key={bs.id} href={`/${blueprint.slug}?stage=${s.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "var(--space-l)", transition: "box-shadow 0.2s", height: "100%" }} className="card-hover">
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-s)" }}>
                        <div style={{ width: 40, height: 40, borderRadius: "var(--radius-s)", background: "var(--color-accent-light)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-accent)" }}>
                          <Icon size={20} />
                        </div>
                        <div style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}>Этап {i + 1}</div>
                      </div>
                      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, margin: "0 0 6px" }}>{s.title}</h3>
                      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>{s.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ═══ SOLUTIONS ═══ */}
        {solutions.length > 0 && (
          <section style={{ marginBottom: "var(--space-xxl)" }}>
            <SectionHeader icon={<ShoppingCart size={20} />} title="Готовые решения" subtitle="Клонируй и запускай" href="/solutions" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-m)" }}>
              {solutions.map((sol: any) => (
                <Link key={sol.id} href={`/solutions/${sol.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <Card>
                    <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)", marginBottom: 4, textTransform: "uppercase" }}>{sol.productType}</div>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, margin: "0 0 6px" }}>{sol.title}</h3>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 10px" }}>{sol.summary || sol.description}</p>
                    <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--color-text-secondary)", flexWrap: "wrap" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Timer size={12} /> MVP: {sol.mvpDays}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Wallet size={12} /> Сервер: {sol.costServer}</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ AI TOOLS ═══ */}
        {tools.length > 0 && (
          <section style={{ marginBottom: "var(--space-xxl)" }}>
            <SectionHeader icon={<Wrench size={20} />} title="AI-инструменты" subtitle="Фреймворки и библиотеки" href="/ai-tools" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-m)" }}>
              {tools.map((tool: any) => (
                <Link key={tool.id} href={`/ai-tools/${tool.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <Card>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{ fontSize: "var(--text-m)", fontWeight: 800, fontFamily: "var(--font-heading)" }}>{tool.name}</div>
                      {tool.rating >= 9 && <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: "var(--radius-full)", background: "#fbbf24", color: "#000", fontWeight: 700 }}>Топ</span>}
                    </div>
                    <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 8px" }}>{tool.description}</p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {tool.russianUi && <Tag text="Русский UI" color="var(--color-accent)" />}
                      {tool.russianSupport && <Tag text="Поддержка РФ" color="var(--color-accent)" />}
                      <Tag text={tool.pricingAmount} color="var(--color-text-secondary)" />
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ═══ SKILLS + GLOSSARY ═══ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-xl)", marginBottom: "var(--space-xxl)" }}>
          {skills.length > 0 && (
            <section>
              <SectionHeader icon={<GraduationCap size={20} />} title="Навыки" subtitle="Практические руководства" />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
                {skills.map((sk: any) => (
                  <Link key={sk.id} href={`/skills/${sk.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)" }} className="card-hover">
                      <div style={{ width: 40, height: 40, borderRadius: "var(--radius-s)", background: "var(--color-accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Code2 size={20} style={{ color: "var(--color-accent)" }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 2 }}>{sk.title}</div>
                        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{sk.timeEstimate} · {sk.xpReward} XP</div>
                      </div>
                      <ArrowRight size={14} style={{ color: "var(--color-text-secondary)" }} />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {glossary.length > 0 && (
            <section>
              <SectionHeader icon={<BookOpen size={20} />} title="Глоссарий Telegram" subtitle="Термины на понятном языке" href="/glossary" />
              <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-xs)" }}>
                {glossary.map((g: any) => (
                  <Link key={g.id} href={`/glossary/${g.slug}`} style={{ textDecoration: "none" }}>
                    <span style={{ display: "inline-block", padding: "6px 14px", background: "var(--color-accent-light)", color: "var(--color-accent)", borderRadius: "var(--radius-full)", fontSize: "var(--text-xs)", fontWeight: 600 }} className="card-hover">
                      {g.term}
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ═══ FAQ ═══ */}
        <FAQSection />

        {/* ═══ CTA ═══ */}
        <section style={{ textAlign: "center", padding: "var(--space-xxl) var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <Bot size={48} style={{ color: "var(--color-accent)", marginBottom: "var(--space-m)" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)", letterSpacing: "-0.01em" }}>
            Готов создать своего бота?
          </h2>
          <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", maxWidth: 480, margin: "0 auto var(--space-l)", lineHeight: 1.6 }}>
            Пройди Blueprint «Telegram Бот» — 6 этапов, 24 инженерных решения, AI-Архитектор на каждом шагу.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/telegram-bot" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Начать Blueprint <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "var(--color-bg-primary)", color: "var(--color-accent)", border: "1px solid var(--color-accent)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Pro — 300 ₽/мес
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

// ═══ FAQ ═══
function FAQSection() {
  const faqs = [
    {
      q: "Сколько стоит создание Telegram бота?",
      a: "Сам бот бесплатный — Telegram не берёт денег за ботов. Ты платишь только за хостинг (400–800 ₽/мес на VDS) и, опционально, за AI-запросы если используешь GPT/YandexGPT. MVP-бота на aiogram можно сделать за 2–3 дня с нулевым бюджетом на софт."
    },
    {
      q: "Нужно ли быть программистом чтобы создать бота?",
      a: "Базовые навыки программирования нужны. Но если ты никогда не писал код — начни с квеста «Быстрый старт» (8 шагов для новичков). С AI-помощником (Claude, GPT) ты напишешь первого простого бота за 1 вечер."
    },
    {
      q: "Какой фреймворк выбрать: aiogram или grammy?",
      a: "aiogram 3.x — если пишешь на Python. Самая большая экосистема в РФ, документация на русском. grammy — если на TypeScript/JavaScript. Оба отличные. Для новичков проще aiogram."
    },
    {
      q: "Как принимать платежи в боте?",
      a: "Два пути: ЮKassa (карты РФ, СБП, комиссия 3.5%, нужен ИП/ООО) и Telegram Stars (внутренняя валюта Telegram, комиссия ~30% через Apple/Google, не требует юрлица). Для старта проще Stars, для бизнеса — ЮKassa."
    },
    {
      q: "Можно ли подключить ChatGPT к боту?",
      a: "Да. Но из России нужен VPN или API-прокси для GPT. Альтернатива — YandexGPT или GigaChat, они работают из РФ без VPN и оплачиваются в рублях. В нашем Blueprint есть целый этап «AI-интеграция» с 4 решениями на эту тему."
    },
    {
      q: "Что такое Mini App и зачем оно нужно?",
      a: "Mini App — это веб-приложение, которое открывается прямо внутри Telegram (как встроенный браузер). Нужно когда простого чат-интерфейса не хватает: каталог с картинками, корзина, форма бронирования, панель администратора."
    },
    {
      q: "Сколько пользователей выдержит бот?",
      a: "На VDS за 800 ₽/мес с Webhook'ом — спокойно 10 000+ пользователей. При правильной архитектуре (асинхронность, очередь) масштабируется до миллионов. Telegram сам держит инфраструктуру доставки сообщений."
    },
    {
      q: "Как продвигать бота?",
      a: "Каталоги ботов (t.me/botstore, telemetr.me), Telegram Ads (официальная реклама), тематические чаты и каналы, SEO-статьи, YouTube-обзоры. Самый быстрый способ — запустить рекламу в каналах твоей тематики."
    },
  ];

  return (
    <section style={{ marginBottom: "var(--space-xxl)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-l)" }}>
        <div style={{ width: 40, height: 40, borderRadius: "var(--radius-m)", background: "var(--color-accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <HelpCircle size={22} style={{ color: "var(--color-accent)" }} />
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, margin: 0 }}>Часто задаваемые вопросы</h2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
        {faqs.map((faq, i) => (
          <FAQItem key={i} {...faq} />
        ))}
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  return (
    <details style={{
      background: "var(--color-bg-primary)", border: "1px solid var(--color-border)",
      borderRadius: "var(--radius-m)", overflow: "hidden",
    }}>
      <summary style={{
        padding: "var(--space-l)", cursor: "pointer", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        fontSize: "var(--text-s)", fontWeight: 600, fontFamily: "var(--font-heading)",
        listStyle: "none",
      }}>
        {q}
        <ChevronDown size={18} style={{ color: "var(--color-accent)", flexShrink: 0, transition: "transform 0.2s" }} />
      </summary>
      <div style={{
        padding: "0 var(--space-l) var(--space-l)", fontSize: "var(--text-xs)",
        color: "var(--color-text-secondary)", lineHeight: 1.8,
      }}>
        {a}
      </div>
    </details>
  );
}

// ═══ HELPERS ═══
function SectionHeader({ icon, title, subtitle, href }: { icon: any; title: string; subtitle: string; href?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-l)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ color: "var(--color-accent)" }}>{icon}</div>
        <div>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, margin: 0 }}>{title}</h3>
          <p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "2px 0 0" }}>{subtitle}</p>
        </div>
      </div>
      {href && <Link href={href} style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>Все <ArrowRight size={14} /></Link>}
    </div>
  );
}

function Card({ children }: { children: any }) {
  return <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "var(--space-l)", height: "100%", transition: "box-shadow 0.2s" }} className="card-hover">{children}</div>;
}

function Stat({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "var(--color-accent)" }}>{icon}</span>
      <div><div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{label}</div><div style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>{value}</div></div>
    </div>
  );
}

function ReasonCard({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div style={{ textAlign: "center", padding: "var(--space-l)" }}>
      <div style={{ color: "var(--color-accent)", marginBottom: "var(--space-s)", display: "inline-flex" }}>{icon}</div>
      <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, marginBottom: "var(--space-xs)" }}>{title}</h4>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>{desc}</p>
    </div>
  );
}

function Tag({ text, color }: { text: string; color: string }) {
  return <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--radius-full)", background: `${color}18`, color, fontWeight: 600, border: `1px solid ${color}30` }}>{text}</span>;
}

function StepCard({ num, title, icon, children }: { num: number; title: string; icon: any; children: any }) {
  return (
    <div style={{ display: "flex", gap: "var(--space-l)", alignItems: "flex-start" }}>
      <div style={{ width: 44, height: 44, borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "var(--text-m)", fontWeight: 800 }}>{num}</div>
      <div style={{ flex: 1, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "var(--space-l)" }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, margin: "0 0 var(--space-s)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "var(--color-accent)" }}>{icon}</span> {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

function StepContent({ children }: { children: any }) {
  return <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.9 }}>{children}</div>;
}

function PitfallCard({ icon, title, children }: { icon: any; title: string; children: any }) {
  return (
    <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderLeft: "3px solid #fbbf24", borderRadius: "var(--radius-m)", padding: "var(--space-l)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-s)" }}>
        <span style={{ color: "#fbbf24" }}>{icon}</span>
        <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xs)", fontWeight: 700, margin: 0 }}>{title}</h4>
      </div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre style={{ background: "#1a1a2e", color: "#e0e0e0", padding: "var(--space-m)", borderRadius: "var(--radius-s)", fontSize: 12, lineHeight: 1.6, overflowX: "auto", margin: "var(--space-s) 0", fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      {children}
    </pre>
  );
}

function InlineCode({ children }: { children: string }) {
  return <code style={{ background: "var(--color-bg-secondary)", padding: "2px 6px", borderRadius: 4, fontSize: "var(--text-xs)", fontFamily: "'JetBrains Mono', monospace" }}>{children}</code>;
}

function ScenarioItem({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div style={{ display: "flex", gap: 10, marginBottom: "var(--space-m)" }}>
      <div style={{ color: "var(--color-accent)", flexShrink: 0, marginTop: 2 }}>{icon}</div>
      <div>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

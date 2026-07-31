import { getDb } from "@/lib/db/index";
import Link from "next/link";
import Term from "@/components/glossary/tooltip-term";
import { ArrowRight, Globe, Shield, Wrench, HelpCircle, ChevronDown, Zap, AlertTriangle, Server, CreditCard, Smartphone, Bot, Key, Code2, Rocket, ExternalLink, Monitor, Cloud, Cpu, Download, ShoppingCart, Mail, GlobeLock, DollarSign, Clock, Users, Star, ThumbsUp, ThumbsDown, Check, X } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Vibe Coding — создание сайтов и ботов с помощью AI (без кода)",
  description: "Полный гайд по Vibe Coding для России: Windsurf, Cursor, Bolt.new, Lovable, Claude Code, Cline. Как оплатить, где хостить, как привязать домен, как забрать код.",
};

export default async function VibecraftPage() {
  const db = await getDb();

  const [tools, solutions] = await Promise.all([
    db.aITool.findMany({ where: { isActive: true, OR: [
      { name: { contains: "Cursor" } }, { name: { contains: "Windsurf" } },
      { name: { contains: "Claude Code" } }, { name: { contains: "Cline" } },
      { name: { contains: "Roo" } }, { name: { contains: "Aider" } },
      { name: { contains: "Bolt" } }, { name: { contains: "Lovable" } },
      { name: "Replit" }, { name: { contains: "v0" } },
    ]}, take: 10 }),
    db.solution.findMany({ where: { isPublished: true }, take: 4 }),
  ]);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>

      {/* ═══ HERO ═══ */}
      <div style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 50%, #0f3460 100%)", padding: "80px 20px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 60%, rgba(168,85,247,0.15), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: "var(--radius-full)", background: "rgba(168,85,247,0.2)", color: "#a855f7", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
            <Zap size={16} /> Vibe Coding
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 6vw, 44px)", fontWeight: 800, lineHeight: 1.05, marginBottom: "var(--space-s)", letterSpacing: "-0.02em", color: "#fff" }}>
            Создавай сайты и ботов<br />с помощью AI. Без кода.
          </h1>
          <p style={{ fontSize: "var(--text-l)", color: "rgba(255,255,255,0.7)", maxWidth: 560, margin: "0 auto var(--space-xl)", lineHeight: 1.7 }}>
            Полный гайд для России: как оплатить, где хостить, как привязать домен, как забрать код. Все ответы на вопросы из Telegram-чатов.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#tools" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "#a855f7", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Инструменты <Wrench size={16} />
            </a>
            <a href="#howto" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Как начать <Rocket size={16} />
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>

        {/* ═══ ЧТО ТАКОЕ ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
            Что такое Vibe Coding?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-xl)" }}>
            <div>
              <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-primary)", lineHeight: 1.8, margin: "0 0 var(--space-m)" }}>
                <strong>Vibe Coding</strong> — это подход к разработке, где ты <strong>описываешь что хочешь получить</strong>, а AI пишет код. Ты говоришь: «Сделай сайт-портфолио с тёмной темой, формой обратной связи и галереей работ». AI генерирует готовый сайт.
              </p>
              <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.8, margin: 0 }}>
                Не нужно знать HTML, CSS или JavaScript. Ты работаешь на уровне идей и описаний — AI превращает их в работающий продукт. За 1-2 часа можно создать лендинг, интернет-магазин, Telegram бота или дашборд.
              </p>
            </div>
            <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", padding: "var(--space-xl)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-m)" }}>Что можно создать?</h3>
              <ScenarioItem icon={<Monitor size={16} />} title="Лендинг / Сайт-визитка" desc="Одностраничный сайт за 30 минут. Форма заявки, контакты, отзывы." />
              <ScenarioItem icon={<ShoppingCart size={16} />} title="Интернет-магазин" desc="Каталог, корзина, оплата. Bolt.new или Lovable — за час." />
              <ScenarioItem icon={<Bot size={16} />} title="Telegram бот" desc="Бот с кнопками, базой данных и AI. Claude Code + aiogram." />
              <ScenarioItem icon={<Cloud size={16} />} title="Дашборд / CRM" desc="Таблицы, графики, фильтры. Cursor + React + готовые компоненты." />
              <ScenarioItem icon={<Smartphone size={16} />} title="Mini App" desc="Веб-приложение внутри Telegram. Lovable → экспорт → деплой." />
            </div>
          </div>
        </section>

        {/* ═══ ИНСТРУМЕНТЫ ═══ */}
        <section id="tools" style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-xs)", letterSpacing: "-0.01em" }}>
            Инструменты для Vibe Coding
          </h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-l)" }}>
            От новичка до продвинутого: что выбрать, как оплатить из России, где взять код.
          </p>

          {/* Comparison table */}
          <div style={{ overflowX: "auto", marginBottom: "var(--space-xl)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                  <th style={thStyle}>Инструмент</th>
                  <th style={thStyle}>Тип</th>
                  <th style={thStyle}>Цена</th>
                  <th style={thStyle}>VPN</th>
                  <th style={thStyle}>Карта РФ</th>
                  <th style={thStyle}>Код</th>
                  <th style={thStyle}>Деплой</th>
                </tr>
              </thead>
              <tbody>
                <ToolRow name="Bolt.new" type="No-code" price="Бесплатно / $20" vpn="❌ Нужен" card="❌" code="✅ Скачать" deploy="✅ Встроен" />
                <ToolRow name="Lovable" type="No-code" price="Бесплатно / $20" vpn="❌ Нужен" card="❌" code="✅ GitHub" deploy="✅ Встроен" />
                <ToolRow name="Cursor" type="AI-IDE" price="Бесплатно / $20" vpn="⚠️ Частично" card="❌ Pro" code="✅ Локально" deploy="❌ Сам" />
                <ToolRow name="Windsurf" type="AI-IDE" price="Бесплатно / $15" vpn="❌ Нужен" card="❌" code="✅ Локально" deploy="❌ Сам" />
                <ToolRow name="Claude Code" type="CLI" price="$ API" vpn="❌ Нужен" card="❌" code="✅ Локально" deploy="❌ Сам" />
                <ToolRow name="Cline" type="Open-source" price="Бесплатно" vpn="✅ Нет" card="✅ OpenRouter" code="✅ Локально" deploy="❌ Сам" />
                <ToolRow name="Roo Code" type="Open-source" price="Бесплатно" vpn="✅ Нет" card="✅ OpenRouter" code="✅ Локально" deploy="❌ Сам" />
                <ToolRow name="Aider" type="CLI" price="Бесплатно" vpn="✅ Нет" card="✅ OpenRouter" code="✅ Локально" deploy="❌ Сам" />
                <ToolRow name="v0 (Vercel)" type="No-code" price="Бесплатно / $20" vpn="❌ Нужен" card="❌" code="✅ Экспорт" deploy="✅ Vercel" />
                <ToolRow name="Replit" type="No-code" price="Бесплатно / $25" vpn="⚠️ Частично" card="⚠️ Не всегда" code="✅ Скачать" deploy="✅ Встроен" />
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: 11, color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)" }}>
            ✅ = работает из РФ. ❌ = нужен VPN или зарубежная карта. ⚠️ = работает нестабильно.
          </p>

          {/* Tool details */}
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-l)" }}>Подробно о каждом</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
            <ToolDetail name="Bolt.new" icon={<Zap size={20} />} color="#34d399" rating={9}
              desc="Самый простой вход. Заходишь на сайт, пишешь что хочешь — получаешь готовый сайт. Идеально для новичков."
              rf={{
                access: "Нужен VPN. Работает через любой VPN-сервис.",
                pay: "Бесплатный тариф: 1 проект, 200K токенов/день. Pro ($20/мес): 10 проектов, 5M токенов. Оплата — зарубежная карта.",
                code: "Можно скачать ZIP с кодом. Кнопка «Download» в меню проекта. Это обычный React/Vue проект.",
                deploy: "Встроенный деплой на Netlify (тоже нужен VPN для управления). Альтернатива: скачай код и залей на Beget.",
                domain: "Встроенный поддомен .netlify.app. Свой домен — через настройки Netlify.",
                email: "Нет встроенной отправки писем. Добавь EmailJS (бесплатный сервис) в код после скачивания.",
              }} />
            <ToolDetail name="Lovable" icon={<Heart size={20} />} color="#f472b6" rating={8}
              desc="Похож на Bolt.new, но с акцентом на дизайн и красоту. Лучше для лендингов и визиток."
              rf={{
                access: "Нужен VPN.",
                pay: "Бесплатно: 5 проектов, 100K токенов. Starter ($20/мес): безлимит. Карта зарубежная.",
                code: "Автоматически пушится на GitHub. Можно клонировать репозиторий себе.",
                deploy: "Встроенный деплой. Или клонируй с GitHub → залей на хостинг РФ.",
                domain: "Поддомен .lovable.app или свой домен через настройки.",
                email: "Добавляется через сторонние сервисы (EmailJS, Resend) после экспорта кода.",
              }} />
            <ToolDetail name="Cursor" icon={<Code2 size={20} />} color="#3b82f6" rating={9}
              desc="AI-редактор кода на базе VS Code. Самый популярный среди разработчиков. Пишет, правит, объясняет код."
              rf={{
                access: "Скачивается и работает без VPN. Но AI-функции (Tab, Composer) через VPN или прокси. Частично работает напрямую.",
                pay: "Бесплатно: 2000 автодополнений/мес. Pro ($20/мес): безлимит. Нужна зарубежная карта. Хитрость: купи подписку через Казахстан.",
                code: "Всё локально на твоём компьютере. Ты владеешь кодом полностью.",
                deploy: "Сам. Экспортируй проект и залей на Beget/TimeWeb через FTP или Git.",
                domain: "Покупаешь на Beget/TimeWeb (200-600 ₽/год). Настраиваешь Nginx на VDS.",
                email: "Любые решения: Nodemailer (свой SMTP), EmailJS (бесплатный), SendGrid (через прокси).",
              }} />
            <ToolDetail name="Cline / Roo Code" icon={<Cpu size={20} />} color="#84cc16" rating={8}
              desc="Бесплатные open-source AI-агенты для VS Code. Лучший выбор для России: без VPN, с OpenRouter."
              rf={{
                access: "Полностью без VPN. Установи расширение VS Code → подключи OpenRouter API ключ.",
                pay: "Расширение — бесплатно. Платишь только за API-запросы к AI-модели. OpenRouter принимает некоторые карты РФ. Запасной вариант: YandexGPT API (рубли).",
                code: "Всё локально. Полный контроль над проектом.",
                deploy: "Сам. Как с Cursor: git push → сервер.",
                domain: "Покупаешь в РФ. Настраиваешь сам.",
                email: "Любые npm-пакеты. Nodemailer + SMTP от твоего хостинга.",
              }} />
            <ToolDetail name="Claude Code" icon={<Terminal size={20} />} color="#f97316" rating={8}
              desc="AI-агент от Anthropic прямо в терминале. Самый мощный для сложных задач. Пишет целые проекты по описанию."
              rf={{
                access: "Нужен VPN + API-ключ Anthropic. API ключ получается через зарубежный аккаунт.",
                pay: "Pay-as-you-go через API. ~$3-15 за сложный проект. Нужна зарубежная карта для пополнения Anthropic.",
                code: "Всё локально в твоей папке.",
                deploy: "Сам. Git push → хостинг РФ.",
                domain: "Сам.",
                email: "Сам, как в Cursor.",
              }} />
          </div>
        </section>

        {/* ═══ КАК НАЧАТЬ ═══ */}
        <section id="howto" style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)", letterSpacing: "-0.01em" }}>
            Быстрый старт: от идеи до сайта
          </h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-xl)" }}>
            Самый простой путь для пользователя из России. Без VPN, с оплатой в рублях.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
            <StepCard num={1} title="Выбери инструмент" icon={<Wrench size={20} />} color="#a855f7">
              <StepContent>
                <strong>Новичок:</strong> Bolt.new или Lovable (нужен VPN на 30 минут чтобы сгенерировать и скачать сайт).<br />
                <strong>Продвинутый:</strong> Cline + OpenRouter — полностью бесплатно, без VPN, AI пишет код в VS Code.<br />
                <strong>Разработчик:</strong> Cursor или Claude Code — максимальная мощь, но нужна зарубежная карта.
              </StepContent>
            </StepCard>

            <StepCard num={2} title="Сгенерируй сайт" icon={<Zap size={20} />} color="#a855f7">
              <StepContent>
                Опиши что хочешь получить максимально конкретно:{' '}
                <InlineCode>«Сделай лендинг для кофейни: тёмная тема, меню напитков с ценами, форма бронирования столика, Яндекс.Карта с адресом, кнопка Позвонить, отзывы клиентов»</InlineCode><br />
                Чем детальнее описание — тем лучше результат. Не пиши «сделай сайт» — пиши «сделай лендинг из 5 блоков».
              </StepContent>
            </StepCard>

            <StepCard num={3} title="Скачай код" icon={<Download size={20} />} color="#a855f7">
              <StepContent>
                <strong>Bolt.new:</strong> кнопка Download → ZIP с проектом.<br />
                <strong>Lovable:</strong> автоматический push на GitHub → клонируй себе.<br />
                <strong>Cline/Cursor:</strong> код уже у тебя на компьютере.<br />
                После скачивания отключи VPN — дальше всё делается из России.
              </StepContent>
            </StepCard>

            <StepCard num={4} title="Купи домен и хостинг" icon={<Globe size={20} />} color="#a855f7">
              <StepContent>
                <strong>Домен:</strong> Beget (200-600 ₽/год, зона .ru). Регистрация за 10 минут, оплата картой РФ.<br />
                <strong>Хостинг:</strong> Beget VDS от 400 ₽/мес. Node.js, PostgreSQL, SSL через LetsEncrypt (бесплатно).<br />
                <strong>Альтернатива:</strong> TimeWeb (облако, дороже но удобнее). Amvera (serverless, платишь за использование).
              </StepContent>
            </StepCard>

            <StepCard num={5} title="Задеплой сайт" icon={<Rocket size={20} />} color="#a855f7">
              <StepContent>
                <strong>1.</strong> Залей код на сервер через Git: <InlineCode>git push</InlineCode> или FTP через FileZilla.<br />
                <strong>2.</strong> Установи зависимости: <InlineCode>npm install</InlineCode><br />
                <strong>3.</strong> Собери проект: <InlineCode>npm run build</InlineCode><br />
                <strong>4.</strong> Настрой Nginx на домен и HTTPS (LetsEncrypt).<br />
                <strong>5.</strong> Запусти через PM2: <InlineCode>pm2 start npm -- start</InlineCode><br />
                Сайт в интернете! 🎉
              </StepContent>
            </StepCard>

            <StepCard num={6} title="Добавь фичи: почта, аналитика" icon={<Mail size={20} />} color="#a855f7">
              <StepContent>
                <strong>Отправка писем:</strong> EmailJS (бесплатно до 200 писем/мес). Добавь в код форму — письма приходят на твою почту. Альтернатива: Nodemailer + SMTP от хостинга.<br />
                <strong>Яндекс.Метрика:</strong> бесплатно, вставь код в тег head сайта.<br />
                <strong>Формы заявок:</strong> EmailJS или Telegram Bot API (отправляй заявки прямо в Telegram).
              </StepContent>
            </StepCard>
          </div>
        </section>

        {/* ═══ ПОДВОДНЫЕ КАМНИ ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-l)" }}>
            <div style={{ width: 40, height: 40, borderRadius: "var(--radius-m)", background: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={22} style={{ color: "#000" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, margin: 0 }}>Подводные камни</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-m)" }}>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Токены быстро кончаются">
              Бесплатные лимиты Bolt.new/Lovable (~200K токенов) улетают за 1-2 часа активной работы. Планируй что генерировать заранее. Пиши промпт на русском — AI понимает.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Сгенерированный код ≠ идеальный">
              AI иногда генерирует нерабочий код или использует несуществующие пакеты. Всегда проверяй что получилось — запусти локально перед деплоем.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Netlify/Vercel из РФ неудобно">
              Бесплатный деплой Bolt.new — на Netlify. Управлять им из РФ без VPN сложно. Скачай код и залей на Beget.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="API ключи = деньги">
              Cline через OpenRouter тратит $0.5-2 в час активной работы. Следи за балансом. Поставь лимит в настройках OpenRouter.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Дизайн как у всех">
              Bolt.new и Lovable генерируют красивые, но типовые дизайны. Чтобы выделиться — после генерации попроси AI изменить цвета, шрифты, расположение.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="База данных сложнее чем кажется">
              Vibe-инструменты хорошо делают фронтенд. Бэкенд с БД — сложнее. Для интернет-магазина лучше готовое решение или конструктор.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="VPN нужен только на старте">
              Bolt.new/Lovable — VPN только для генерации и скачивания кода (30 мин). Дальше работаешь локально без VPN. Не держи VPN постоянно включенным.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Свой домен ≠ автоматически">
              После деплоя на хостинг нужно настроить DNS-записи (A-запись на IP сервера). Это занимает 1-24 часа на обновление.
            </PitfallCard>
          </div>
        </section>

        {/* ═══ РЕАЛЬНЫЕ ВОПРОСЫ ИЗ TELEGRAM ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
            Вопросы из Telegram-чатов
          </h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-l)" }}>
            Реальные вопросы от пользователей из России. Собраны из тематических каналов по Vibe Coding.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            <QAItem q="Как оплатить Bolt.new из России?" a="Зарубежная карта (Казахстан, Киргизия) или попросить друга за границей. Бесплатного тарифа хватает на 1-2 проекта. Главное — сгенерировать и скачать код, дальше работаешь локально." />
            <QAItem q="Где хостить сайт сделанный в Lovable?" a="Скачай код (он автоматически в GitHub). Залей на Beget VDS (400 ₽/мес), настрой Nginx, запусти через PM2. Или используй Amvera — serverless, платишь только за использование, деплой одной командой." />
            <QAItem q="Как привязать свой домен к сайту из Bolt.new?" a="Вариант А: через Netlify (нужен VPN) — купи домен, добавь в Netlify DNS. Вариант Б (рекомендуем): скачай код с Bolt.new, купи домен на Beget, залей код на VDS, настрой Nginx на домен." />
            <QAItem q="Как сделать отправку писем с формы на сайте?" a="EmailJS — бесплатно до 200 писем/мес. Регистрируешься, создаёшь шаблон, вставляешь 5 строк JS-кода в форму. Письма приходят на твою почту. Альтернатива: Resend (тоже бесплатный тир)." />
            <QAItem q="Как забрать код из Lovable если нет GitHub?" a="Lovable автоматически создаёт GitHub репозиторий. Зарегистрируй GitHub (бесплатно, без VPN), свяжи с Lovable, клонируй репозиторий себе." />
            <QAItem q="Можно ли работать без VPN вообще?" a="Да. Cline + OpenRouter — полностью без VPN. Установи VS Code → расширение Cline → API ключ OpenRouter. Работает с российского IP, оплата через OpenRouter (принимает некоторые карты РФ)." />
            <QAItem q="Какой инструмент выбрать если я вообще не программист?" a="Bolt.new или Lovable. Они не требуют писать код — только описывать что хочешь. Нужен VPN на 30 минут для генерации. После скачивания кода — работаешь без VPN." />
            <QAItem q="Почему сайт выглядит не так как я хотел?" a="Пиши промпты детальнее. Не «сделай красивый сайт», а «сделай лендинг: тёмный фон #1a1a2e, белый текст, круглые кнопки фиолетового цвета, 5 блоков: герой, услуги, цены, отзывы, контакты»." />
            <QAItem q="Как добавить Яндекс.Метрику на сайт из Bolt.new?" a="Скачай код → открой в редакторе → вставь код Метрики в тег head → залей обратно на хостинг. Или попроси AI в Bolt: «Добавь Яндекс.Метрику с ID XXXXX»." />
            <QAItem q="Что делать если Bolt.new заблокировали?" a="Всегда скачивай код сразу после генерации. Код — твой, он не зависит от Bolt. Зальёшь на любой хостинг. Не храни проект только в облаке Bolt." />
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <FAQSection />

        {/* ═══ CTA ═══ */}
        <section style={{ textAlign: "center", padding: "var(--space-xxl) var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <Zap size={48} style={{ color: "#a855f7", marginBottom: "var(--space-m)" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)", letterSpacing: "-0.01em" }}>
            Готов создать свой первый сайт с AI?
          </h2>
          <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", maxWidth: 480, margin: "0 auto var(--space-l)", lineHeight: 1.6 }}>
            Выбери инструмент, опиши идею, получи готовый сайт за 1 час. Без знаний программирования.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/blueprints" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "#a855f7", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Выбрать Blueprint <ArrowRight size={16} />
            </Link>
            <Link href="/telegram" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "var(--color-bg-primary)", color: "#a855f7", border: "1px solid #a855f7", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Сделать Telegram Бота
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
    { q: "Что такое Vibe Coding простыми словами?", a: "Ты описываешь что хочешь получить — AI пишет код. Как разговор с разработчиком, только разработчик — искусственный интеллект. Не нужно уметь программировать." },
    { q: "Сколько стоит создать сайт через Vibe Coding?", a: "От 0 до $20. Бесплатные тарифы Bolt.new/Lovable позволяют сделать 1-2 проекта. Pro-подписка $15-20/мес. Хостинг в РФ: 400-800 ₽/мес. Домен: 200-600 ₽/год." },
    { q: "Какой инструмент лучший для России?", a: "Cline + OpenRouter — бесплатно, без VPN, с оплатой в рублях (через OpenRouter). Для новичков: Bolt.new (нужен VPN на 30 мин чтобы сгенерировать и скачать)." },
    { q: "Можно ли сделать интернет-магазин?", a: "Можно, но осторожно. Vibe-инструменты хорошо делают витрину и корзину. Платёжную систему (ЮKassa) придётся подключать вручную. Для сложного магазина лучше готовое решение." },
    { q: "Нужно ли знать HTML/CSS?", a: "Нет. Но базовое понимание помогает писать более точные промпты. Если совсем ноль — просто описывай результат словами, AI разберётся." },
    { q: "Кому принадлежит код?", a: "Тебе. Код который генерирует AI — твой. Ты можешь его скачать, изменить, продать. Никаких ограничений." },
    { q: "Что будет если сервис заблокируют?", a: "Поэтому первое правило: всегда скачивай код. Код работает без сервиса. Залей на свой хостинг — сайт останется даже если Bolt.new закроется." },
    { q: "Как научиться писать хорошие промпты?", a: "Практика + правило «Чем детальнее — тем лучше». Указывай: цвета, количество блоков, шрифты, примеры сайтов которые нравятся. AI понимает русский язык." },
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
          <details key={i} style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", overflow: "hidden" }}>
            <summary style={{ padding: "var(--space-l)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "var(--text-s)", fontWeight: 600, fontFamily: "var(--font-heading)", listStyle: "none" }}>
              {faq.q}
              <ChevronDown size={18} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
            </summary>
            <div style={{ padding: "0 var(--space-l) var(--space-l)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>{faq.a}</div>
          </details>
        ))}
      </div>
    </section>
  );
}

// ═══ COMPONENTS ═══
const thStyle: any = { textAlign: "left", padding: "var(--space-s) var(--space-m)", fontWeight: 700, fontSize: 11, whiteSpace: "nowrap" };

function ToolRow({ name, type, price, vpn, card, code, deploy }: any) {
  return (
    <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
      <td style={{ padding: "var(--space-s) var(--space-m)", fontWeight: 700, fontSize: "var(--text-xs)" }}>{name}</td>
      <td style={{ padding: "var(--space-s) var(--space-m)", fontSize: 11, color: "var(--color-text-secondary)" }}>{type}</td>
      <td style={{ padding: "var(--space-s) var(--space-m)", fontSize: 11 }}>{price}</td>
      <td style={{ padding: "var(--space-s) var(--space-m)", fontSize: 11 }}>{vpn}</td>
      <td style={{ padding: "var(--space-s) var(--space-m)", fontSize: 11 }}>{card}</td>
      <td style={{ padding: "var(--space-s) var(--space-m)", fontSize: 11 }}>{code}</td>
      <td style={{ padding: "var(--space-s) var(--space-m)", fontSize: 11 }}>{deploy}</td>
    </tr>
  );
}

function ToolDetail({ name, icon, color, rating, desc, rf }: any) {
  return (
    <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", overflow: "hidden" }}>
      <div style={{ padding: "var(--space-l)", display: "flex", alignItems: "flex-start", gap: "var(--space-m)", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-secondary)" }}>
        <div style={{ width: 44, height: 44, borderRadius: "var(--radius-m)", background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>{icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, margin: 0 }}>{name}</h4>
            <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: "var(--radius-full)", background: "#fbbf24", color: "#000", fontWeight: 700 }}>★ {rating}/10</span>
          </div>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", margin: "6px 0 0", lineHeight: 1.6 }}>{desc}</p>
        </div>
      </div>
      <div style={{ padding: "var(--space-l)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-s)" }}>
        <DetailItem label="Доступ из РФ" value={rf.access} />
        <DetailItem label="Оплата" value={rf.pay} />
        <DetailItem label="Где код" value={rf.code} />
        <DetailItem label="Деплой" value={rf.deploy} />
        <DetailItem label="Свой домен" value={rf.domain} />
        <DetailItem label="Отправка писем" value={rf.email} />
      </div>
    </div>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-secondary)", textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 11, color: "var(--color-text-primary)", lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function ScenarioItem({ icon, title, desc }: any) {
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

function StepCard({ num, title, icon, color, children }: any) {
  return (
    <div style={{ display: "flex", gap: "var(--space-l)", alignItems: "flex-start" }}>
      <div style={{ width: 44, height: 44, borderRadius: "var(--radius-m)", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "var(--text-m)", fontWeight: 800 }}>{num}</div>
      <div style={{ flex: 1, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "var(--space-l)" }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, margin: "0 0 var(--space-s)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color }}>{icon}</span> {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

function StepContent({ children }: any) {
  return <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.9 }}>{children}</div>;
}

function PitfallCard({ icon, title, children }: any) {
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

function QAItem({ q, a }: { q: string; a: string }) {
  return (
    <details style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", overflow: "hidden" }}>
      <summary style={{ padding: "var(--space-m) var(--space-l)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "var(--text-xs)", fontWeight: 600, fontFamily: "var(--font-heading)", listStyle: "none" }}>
        {q}
        <ChevronDown size={16} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
      </summary>
      <div style={{ padding: "0 var(--space-l) var(--space-m)", fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.8 }}>{a}</div>
    </details>
  );
}

function InlineCode({ children }: any) {
  return <code style={{ background: "var(--color-bg-secondary)", padding: "2px 6px", borderRadius: 4, fontSize: "var(--text-xs)", fontFamily: "'JetBrains Mono', monospace" }}>{children}</code>;
}

// Missing icons inline
function Heart({ size }: any) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>; }
function Terminal({ size }: any) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>; }

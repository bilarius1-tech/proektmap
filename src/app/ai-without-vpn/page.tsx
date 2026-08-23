import { getDb } from "@/lib/db/index";
import Link from "next/link";
import Term from "@/components/glossary/tooltip-term";
import { ArrowRight, Globe, Shield, Wrench, BookOpen, HelpCircle, ChevronDown, Zap, AlertTriangle, Server, CreditCard, Smartphone, Bot, Key, Code2, GraduationCap, Timer, Wallet, Lightbulb, Cloud, Cpu, Lock, Rocket, Wifi, ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "AI без VPN — как работать с нейросетями из России",
  description: "Полный гайд: российские AI-сервисы, замена западных инструментов, оплата без зарубежных карт, хостинг и платёжные системы РФ.",
};

export default async function AiWithoutVpnPage() {
  const db = await getDb();

  const [tools, solutions, glossary, skills] = await Promise.all([
    db.aITool.findMany({
      where: { isActive: true, OR: [
        { name: { contains: "YandexGPT" } }, { name: { contains: "GigaChat" } },
        { name: { contains: "DeepSeek" } }, { name: { contains: "Cline" } },
        { name: { contains: "Roo Code" } }, { name: { contains: "Aider" } },
        { name: "Kandinsky" }, { name: "Шедеврум" },
        { bestFor: { contains: "vpn" } }, { bestFor: { contains: "российск" } },
        { bestFor: { contains: "рф" } },
      ]},
      take: 8,
    }),
    db.solution.findMany({ where: { isPublished: true }, take: 4 }),
    db.glossaryTerm.findMany({ where: { isPublished: true, category: "Telegram" }, take: 8 }),
    db.skill.findMany({ where: { isPublished: true }, take: 3 }),
  ]);

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>

      {/* ═══ HERO ═══ */}
      <div style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #0f3460 100%)", padding: "80px 20px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 40%, rgba(234,88,12,0.12), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: "var(--radius-full)", background: "rgba(234,88,12,0.2)", color: "#f97316", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
            <Shield size={16} /> AI без VPN
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 6vw, 46px)", fontWeight: 800, lineHeight: 1.05, marginBottom: "var(--space-s)", letterSpacing: "-0.02em", color: "#fff" }}>
            AI-разработка<br />без VPN и зарубежных карт
          </h1>
          <p style={{ fontSize: "var(--text-l)", color: "rgba(255,255,255,0.7)", maxWidth: 520, margin: "0 auto var(--space-xl)", lineHeight: 1.7 }}>
            Российские нейросети, хостинг, платёжные системы — полный гайд по импортозамещению AI-инструментов.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#replacements" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "#f97316", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Чем заменить <ArrowRight size={16} />
            </a>
            <a href="#howto" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Быстрый старт <Zap size={16} />
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>

        {/* ═══ ПРОБЛЕМА ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
            Почему это важно?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-xl)" }}>
            <div>
              <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-primary)", lineHeight: 1.8, margin: "0 0 var(--space-m)" }}>
                В 2025 году большинство западных AI-сервисов <strong>недоступны из России напрямую</strong>. ChatGPT, Claude, Cursor, GitHub Copilot, Windsurf — все требуют либо VPN, либо зарубежную банковскую карту, либо и то и другое.
              </p>
              <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.8, margin: 0 }}>
                Но это не значит что AI-разработка для вас закрыта. Существуют <strong>российские аналоги</strong> и <strong>обходные пути</strong>, которые позволяют полноценно работать с нейросетями из РФ — легально, без VPN и с оплатой в рублях.
              </p>
            </div>
            <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", padding: "var(--space-xl)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-m)" }}>Главные барьеры</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
                <BarrierItem icon={<Wifi size={16} />} title="Геоблокировка" desc="ChatGPT, Claude, Cursor — недоступны без VPN." />
                <BarrierItem icon={<CreditCard size={16} />} title="Оплата" desc="OpenAI, Anthropic, Vercel — только зарубежные карты." />
                <BarrierItem icon={<Cloud size={16} />} title="Хостинг" desc="Vercel, Netlify, Railway — без карты не задеплоить." />
                <BarrierItem icon={<Server size={16} />} title="API" desc="Stripe, AWS, Google Cloud — заблокированы для РФ." />
              </div>
            </div>
          </div>
        </section>

        {/* ═══ ЧЕМ ЗАМЕНИТЬ ═══ */}
        <section id="replacements" style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)", letterSpacing: "-0.01em" }}>
            Чем заменить западные AI-инструменты
          </h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-xl)" }}>
            Прямые замены, которые работают из России без VPN и с оплатой в рублях.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            <ReplacementCard
              western="ChatGPT / Claude" westernDesc="Универсальные AI-модели"
              russian="YandexGPT / GigaChat" russianDesc="Российские нейросети: работают без VPN, оплата в рублях."
              verdict="YandexGPT для 80% задач. GigaChat для enterprise и Сбера."
              color="#4ade80"
            />
            <ReplacementCard
              western="GitHub Copilot / Cursor" westernDesc="AI-помощники в коде"
              russian="Cline / Roo Code / Aider" russianDesc="Open-source AI-агенты в IDE. Работают с любыми API-ключами."
              verdict="Cline + DeepSeek/OpenRouter = полная замена Copilot."
              color="#60a5fa"
            />
            <ReplacementCard
              western="Midjourney / DALL-E" westernDesc="Генерация изображений"
              russian="Kandinsky / Шедеврум" russianDesc="Российские генераторы изображений. Бесплатно, без VPN."
              verdict="Kandinsky 3.1 — лучшая российская модель. Шедеврум для быстрых идей."
              color="#c084fc"
            />
            <ReplacementCard
              western="Vercel / Netlify" westernDesc="Хостинг frontend"
              russian="Beget / TimeWeb / Selectel" russianDesc="Российские хостинги: VDS, облако, SSL."
              verdict="Beget VDS от 400 ₽/мес. TimeWeb для Node.js. Selectel для enterprise."
              color="#fbbf24"
            />
            <ReplacementCard
              western="Stripe / PayPal" westernDesc="Платёжные системы"
              russian="ЮKassa / CloudPayments" russianDesc="Приём платежей в РФ: карты, СБП, ЮMoney."
              verdict="ЮKassa — стандарт для РФ. CloudPayments если нужен эквайринг."
              color="#fb923c"
            />
          </div>
        </section>

        {/* ═══ КАК НАЧАТЬ ═══ */}
        <section id="howto" style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)", letterSpacing: "-0.01em" }}>
            Быстрый старт: AI-разработка из РФ
          </h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-xl)" }}>
            5 шагов к полноценной AI-разработке без VPN.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
            <StepCard num={1} title="Выбери AI-модель" icon={<Cpu size={20} />}>
              <StepContent>
                <strong>Вариант А (без VPN):</strong> YandexGPT через Yandex Cloud. Регистрация за 5 минут, 1000 бесплатных запросов, оплата в рублях.<br />
                <strong>Вариант Б (через прокси):</strong> OpenAI API через OpenRouter — прокси-сервис, который принимает российские карты (не все).<br />
                <strong>Вариант В (локально):</strong> DeepSeek R1 / Qwen — open-source модели, запускаются на твоём компьютере через Ollama.
              </StepContent>
            </StepCard>

            <StepCard num={2} title="Установи AI-редактор кода" icon={<Code2 size={20} />}>
              <StepContent>
                <strong>Cline (VS Code):</strong> бесплатный open-source AI-агент. Подключается к любому API: YandexGPT, DeepSeek, OpenRouter.<br />
                <strong>Aider:</strong> AI pair programming в терминале. Работает с Ollama локально — вообще без интернета.<br />
                <strong>VS Code + Continue:</strong> open-source плагин для автодополнения кода с выбором модели.
              </StepContent>
            </StepCard>

            <StepCard num={3} title="Настрой хостинг в РФ" icon={<Server size={20} />}>
              <StepContent>
                <strong>Beget:</strong> VDS от 400 ₽/мес, Node.js, PostgreSQL, SSL через LetsEncrypt.<br />
                <strong>TimeWeb:</strong> облачный хостинг, удобная панель, поддержка Docker.<br />
                <strong>Amvera:</strong> serverless-платформа — платишь только за использование. Идеально для Telegram ботов.
              </StepContent>
            </StepCard>

            <StepCard num={4} title="Подключи приём платежей" icon={<Wallet size={20} />}>
              <StepContent>
                <strong>ЮKassa:</strong> нужен ИП/ООО. Подключение за 1 день. Комиссия 3.5%. Карты РФ, СБП, ЮMoney.<br />
                <strong>Telegram Stars:</strong> для ботов — не нужен ИП. Комиссия ~30% (Apple/Google).<br />
                <strong>CloudPayments:</strong> интернет-эквайринг, рекуррентные платежи.
              </StepContent>
            </StepCard>

            <StepCard num={5} title="Собери MVP и запусти" icon={<Rocket size={20} />}>
              <StepContent>
                Используй готовые <Link href="/solutions" style={{ color: "var(--color-accent)" }}>решения</Link> с ProektMap как основу. AI-Архитектор поможет с выбором стека. Напиши бота или сайт через Cline + YandexGPT, задеплой на Beget, подключи ЮKassa — проект в продакшене за 2–3 дня.
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
            <PitfallCard icon={<AlertTriangle size={16} />} title="VPN + API = блокировка">
              OpenAI банит аккаунты замеченные через VPN-IP. Используй OpenRouter как прокси или работай с российскими аналогами.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Зарубежная карта — не всё">
              Даже с картой Киргизии/Казахстана не все сервисы принимают. Vercel требует карту страны присутствия. Всегда имей план Б.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="YandexGPT ≠ ChatGPT">
              Российские модели слабее в креативных задачах и коде. Для фактов и структурирования отлично. Для креатива — DeepSeek через OpenRouter.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Санкции меняются">
              То что работает сегодня — может заблокироваться завтра. Не строй бизнес на одном зарубежном сервисе. Всегда имей fallback.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Оплата OpenRouter нестабильна">
              OpenRouter периодически отклоняет карты РФ. Заведи аккаунт заранее и пополни баланс, пока работает.
            </PitfallCard>
            <PitfallCard icon={<AlertTriangle size={16} />} title="Локальные модели ≠ быстро">
              DeepSeek на домашнем ПК без GPU — это 2-3 токена/сек. Для комфортной работы нужен хотя бы RTX 3060 (12GB VRAM).
            </PitfallCard>
          </div>
        </section>

        {/* ═══ РОССИЙСКИЙ AI-СТЕК ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
            Российский AI-стек: готовый набор
          </h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-l)" }}>
            Минимальный набор инструментов для AI-разработки из РФ без VPN.
          </p>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                  <th style={{ textAlign: "left", padding: "var(--space-s) var(--space-m)", fontWeight: 700 }}>Компонент</th>
                  <th style={{ textAlign: "left", padding: "var(--space-s) var(--space-m)", fontWeight: 700 }}>Российское решение</th>
                  <th style={{ textAlign: "left", padding: "var(--space-s) var(--space-m)", fontWeight: 700 }}>Цена</th>
                </tr>
              </thead>
              <tbody>
                <StackRow component="AI-модель" solution="YandexGPT" price="0,60–3 ₽ / 1000 токенов" />
                <StackRow component="AI-модель (картинки)" solution="Kandinsky 3.1" price="Бесплатно / от 2 ₽" />
                <StackRow component="AI-редактор кода" solution="Cline + OpenRouter" price="Бесплатно + API" />
                <StackRow component="Хостинг" solution="Beget VDS" price="400–1500 ₽/мес" />
                <StackRow component="Домен + SSL" solution="Beget / LetsEncrypt" price="200–600 ₽/год" />
                <StackRow component="Платежи" solution="ЮKassa" price="3.5% комиссия" />
                <StackRow component="База данных" solution="PostgreSQL на VDS" price="Включено в VDS" />
                <StackRow component="Мониторинг" solution="Grafana + Prometheus" price="Бесплатно" />
              </tbody>
            </table>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <FAQSection />

        {/* ═══ CTA ═══ */}
        <section style={{ textAlign: "center", padding: "var(--space-xxl) var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <Shield size={48} style={{ color: "#f97316", marginBottom: "var(--space-m)" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)", letterSpacing: "-0.01em" }}>
            Готов начать AI-разработку без VPN?
          </h2>
          <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", maxWidth: 480, margin: "0 auto var(--space-l)", lineHeight: 1.6 }}>
            Выбери Blueprint под свой проект, подключи российский AI-стек и запусти MVP за 2–3 дня.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/blueprints" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "#f97316", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Выбрать Blueprint <ArrowRight size={16} />
            </Link>
            <Link href="/pricing" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "var(--color-bg-primary)", color: "#f97316", border: "1px solid #f97316", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
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
    { q: "Можно ли пользоваться ChatGPT из России?", a: "Да, но нужен VPN и зарубежная карта для оплаты. Бесплатная версия ChatGPT работает через VPN. Для API можно использовать OpenRouter — прокси-сервис, который иногда принимает карты РФ." },
    { q: "YandexGPT бесплатный?", a: "YandexGPT через Yandex Cloud: ~1000 бесплатных запросов при регистрации, дальше от 0,60 ₽ за 1000 токенов. Для тестов и прототипов бесплатного лимита хватает." },
    { q: "Что лучше: YandexGPT или GigaChat?", a: "YandexGPT лучше для общих задач и кода. GigaChat сильнее в русском языке и работе с документами. Для разработки рекомендуем YandexGPT." },
    { q: "Как оплачивать зарубежные AI-сервисы?", a: "Способы: карта иностранного банка (Киргизия, Казахстан), криптовалюта (где принимают), сервисы-посредники (OpenRouter). Самый надёжный — использовать российские аналоги." },
    { q: "Нужен ли VPN для GitHub?", a: "Нет. GitHub полностью доступен из России без VPN. Все репозитории, Actions, Pages — работают. Ограничений для российских разработчиков нет." },
    { q: "Какой хостинг выбрать для Next.js в РФ?", a: "Beget VDS (от 400 ₽/мес) — установи Node.js, PostgreSQL, настрой Nginx. TimeWeb — более дорогой но с удобной панелью. Amvera — serverless, платишь только за использование." },
    { q: "Можно ли запускать open-source модели локально?", a: "Да. Ollama позволяет запускать DeepSeek R1, Qwen 2.5, Mistral и другие на своём компьютере. Для комфортной работы нужна видеокарта с 8+ GB VRAM." },
    { q: "Что делать если OpenRouter перестал принимать карты?", a: "План Б: YandexGPT через Yandex Cloud (рубли), локальные модели через Ollama (бесплатно), GigaChat (рубли). Никогда не завязывайся на один зарубежный сервис." },
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
function ReplacementCard({ western, westernDesc, russian, russianDesc, verdict, color }: { western: string; westernDesc: string; russian: string; russianDesc: string; verdict: string; color: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "var(--space-m)", alignItems: "center", padding: "var(--space-l)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)" }}>
      <div>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 2 }}>{western}</div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{westernDesc}</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <ArrowRight size={24} style={{ color: "var(--color-text-secondary)" }} />
      </div>
      <div>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color, marginBottom: 2 }}>{russian}</div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{russianDesc}</div>
        <div style={{ fontSize: 10, marginTop: 4, padding: "2px 8px", borderRadius: "var(--radius-full)", background: `${color}20`, color, fontWeight: 600, display: "inline-block" }}>{verdict}</div>
      </div>
    </div>
  );
}

function BarrierItem({ icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{ color: "#f97316", flexShrink: 0, marginTop: 2 }}>{icon}</div>
      <div>
        <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{desc}</div>
      </div>
    </div>
  );
}

function StackRow({ component, solution, price }: { component: string; solution: string; price: string }) {
  return (
    <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
      <td style={{ padding: "var(--space-s) var(--space-m)", fontWeight: 600 }}>{component}</td>
      <td style={{ padding: "var(--space-s) var(--space-m)", color: "var(--color-accent)" }}>{solution}</td>
      <td style={{ padding: "var(--space-s) var(--space-m)", color: "var(--color-text-secondary)" }}>{price}</td>
    </tr>
  );
}

function StepCard({ num, title, icon, children }: { num: number; title: string; icon: any; children: any }) {
  return (
    <div style={{ display: "flex", gap: "var(--space-l)", alignItems: "flex-start" }}>
      <div style={{ width: 44, height: 44, borderRadius: "var(--radius-m)", background: "#f97316", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "var(--text-m)", fontWeight: 800 }}>{num}</div>
      <div style={{ flex: 1, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "var(--space-l)" }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, margin: "0 0 var(--space-s)", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#f97316" }}>{icon}</span> {title}
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

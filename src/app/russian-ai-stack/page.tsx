import { getDb } from "@/lib/db/index";
import Link from "next/link";
import Term from "@/components/glossary/tooltip-term";
import { ArrowRight, Globe, Shield, Wrench, HelpCircle, ChevronDown, Zap, AlertTriangle, Server, CreditCard, Smartphone, Bot, Code2, Rocket, Cpu, Cloud, Wallet, Monitor, Star, ExternalLink, Check, X, Image, MessageCircle, FileText, Search } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Российский AI-стек — нейросети и инструменты доступные из РФ",
  description: "Полный обзор российских AI-сервисов: YandexGPT, GigaChat, Kandinsky, Шедеврум. Сравнение с западными аналогами, цены, API, примеры кода.",
};

export default async function RussianAiStackPage() {
  const db = await getDb();
  const tools = await db.aITool.findMany({ where: { isActive: true, OR: [
    { name: "YandexGPT" }, { name: "GigaChat" }, { name: "Kandinsky" },
    { name: "Шедеврум" }, { name: "DeepSeek" }, { name: "Cline" },
    { name: "Roo Code" }, { name: "Aider" },
  ]}, take: 10 });

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>

      {/* HERO */}
      <div style={{ background: "linear-gradient(135deg, #0c1929 0%, #162844 50%, #1a3a5c 100%)", padding: "80px 20px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 40%, rgba(59,130,246,0.12), transparent 50%), radial-gradient(circle at 70% 60%, rgba(234,88,12,0.08), transparent 50%)" }} />
        <div style={{ position: "relative", maxWidth: 740, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: "var(--radius-full)", background: "rgba(59,130,246,0.2)", color: "#60a5fa", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
            <Cpu size={16} /> Российский AI-стек
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 6vw, 44px)", fontWeight: 800, lineHeight: 1.05, marginBottom: "var(--space-s)", letterSpacing: "-0.02em", color: "#fff" }}>
            Нейросети и AI-инструменты<br />доступные из России
          </h1>
          <p style={{ fontSize: "var(--text-l)", color: "rgba(255,255,255,0.7)", maxWidth: 540, margin: "0 auto var(--space-xl)", lineHeight: 1.7 }}>
            YandexGPT, GigaChat, Kandinsky, Шедеврум — полный обзор, сравнение с западными аналогами, цены, API, примеры кода.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#models" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "#3b82f6", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Обзор моделей <ArrowRight size={16} />
            </a>
            <a href="#howto" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Как начать <Zap size={16} />
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>

        {/* WHAT IS */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
            Российский AI-стек — почему это важно
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-xl)" }}>
            <div>
              <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-primary)", lineHeight: 1.8, margin: 0 }}>
                В 2025 году <strong>большинство западных AI-сервисов недоступны из России</strong> без VPN и зарубежной карты. ChatGPT, Claude, Midjourney, GitHub Copilot — всё это требует обходных путей.
              </p>
              <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.8, margin: "var(--space-m) 0 0" }}>
                Но в России есть <strong>собственный AI-стек</strong> — нейросети и инструменты которые работают без VPN, с оплатой в рублях и русскоязычной поддержкой. По качеству они уже приближаются к западным аналогам, а для многих задач — полностью их заменяют.
              </p>
            </div>
            <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", padding: "var(--space-xl)" }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-m)" }}>Что входит в стек</h3>
              <StackItem icon={<Cpu size={14} />} label="AI-модели" value="YandexGPT, GigaChat, DeepSeek R1" />
              <StackItem icon={<Code2 size={14} />} label="AI-редакторы" value="Cline, Roo Code, Aider (open-source)" />
              <StackItem icon={<Image size={14} />} label="Генерация картинок" value="Kandinsky 3.1, Шедеврум" />
              <StackItem icon={<Server size={14} />} label="Хостинг" value="Beget, TimeWeb, Selectel, Amvera" />
              <StackItem icon={<Wallet size={14} />} label="Платежи" value="ЮKassa, CloudPayments" />
            </div>
          </div>
        </section>

        {/* MODELS TABLE */}
        <section id="models" style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)", letterSpacing: "-0.01em" }}>
            Сравнение AI-моделей
          </h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-l)" }}>
            Ключевые российские и доступные модели — стоимость, качество, доступность.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-border)", background: "var(--color-bg-secondary)" }}>
                  <th style={thS}>Модель</th><th style={thS}>Тип</th><th style={thS}>Цена</th><th style={thS}>VPN</th><th style={thS}>Оплата РФ</th><th style={thS}>API</th><th style={thS}>Качество</th>
                </tr>
              </thead>
              <tbody>
                <ModelRow name="YandexGPT 4" type="Текст/Код" price="0,60–3 ₽/1K ток." vpn="✅" pay="✅ Рубли" api="✅" quality="⭐⭐⭐⭐" note="Лучший выбор РФ" />
                <ModelRow name="GigaChat" type="Текст/Код" price="от 1,5 ₽/1K ток." vpn="✅" pay="✅ Рубли" api="✅" quality="⭐⭐⭐⭐" note="Сбер, enterprise" />
                <ModelRow name="YandexGPT Lite" type="Текст" price="0,20 ₽/1K ток." vpn="✅" pay="✅ Рубли" api="✅" quality="⭐⭐⭐" note="Дешёвый для простых задач" />
                <ModelRow name="Kandinsky 3.1" type="Изображения" price="2–5 ₽/изобр." vpn="✅" pay="✅ Рубли" api="✅" quality="⭐⭐⭐⭐" note="Лучшая генерация РФ" />
                <ModelRow name="Шедеврум" type="Изображения" price="Бесплатно" vpn="✅" pay="—" api="❌" quality="⭐⭐⭐" note="Яндекс, быстро" />
                <ModelRow name="DeepSeek R1" type="Текст/Код" price="Бесплатно / $0.5" vpn="✅" pay="⚠️ OpenRouter" api="✅" quality="⭐⭐⭐⭐⭐" note="Open-source, локально" />
                <ModelRow name="ChatGPT-4o" type="Текст/Код" price="$2.5–10/1M ток." vpn="❌ Нужен" pay="❌" api="⚠️ Прокси" quality="⭐⭐⭐⭐⭐" note="Эталон качества" />
                <ModelRow name="Claude 4 Opus" type="Текст/Код" price="$15/1M ток." vpn="❌ Нужен" pay="❌" api="❌ Из РФ" quality="⭐⭐⭐⭐⭐" note="Лучший для кода" />
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: "var(--space-s)" }}>✅ = работает. ❌ = нужен VPN/карта. ⚠️ = нестабильно. Цены на июль 2026.</p>
        </section>

        {/* DETAILED CARDS */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
            Подробно о каждой модели
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
            <ModelCard name="YandexGPT 4" icon={<Cpu size={20} />} color="#3b82f6" rating={8}
              desc="Флагманская текстовая модель Яндекса. Аналог GPT-4o для русского языка. Встроена в Алису, Яндекс Браузер, доступна через Yandex Cloud API."
              features={[
                "Контекст: 32K токенов",
                "API: REST, gRPC, Python/Node.js SDK",
                "Бесплатно: 1000 запросов при регистрации",
                "Интеграция: Telegram боты, сайты, приложения",
              ]}
              code={`// Python: YandexGPT API
import requests
api_key = "YOUR_API_KEY"
resp = requests.post(
  "https://llm.api.cloud.yandex.net/...",
  headers={"Authorization": f"Api-Key {api_key}"},
  json={"modelUri": "gpt://...", "messages": [...]}
)`}
            />
            <ModelCard name="GigaChat" icon={<Cpu size={20} />} color="#10b981" rating={7}
              desc="Нейросеть от Сбера. Хороша для работы с русскоязычными документами, юридическими и финансовыми текстами. Интеграция с экосистемой Сбера."
              features={[
                "Контекст: 8K токенов",
                "API: REST, SDK для Python/Java",
                "Бесплатно: тестовый доступ при регистрации",
                "Встроена в: СберБанк Онлайн, SaluteBot",
              ]}
            />
            <ModelCard name="Kandinsky 3.1" icon={<Image size={20} />} color="#8b5cf6" rating={8}
              desc="Генерация изображений от Сбера. Российский аналог Midjourney и DALL-E. Понимает русские промпты лучше западных моделей."
              features={[
                "Стили: фотореализм, аниме, 3D, концепт-арт",
                "Разрешение: до 1024×1024",
                "API: REST, Python SDK",
                "FusionBrain: бесплатная веб-версия",
              ]}
            />
            <ModelCard name="DeepSeek R1 (локально)" icon={<Server size={20} />} color="#f59e0b" rating={9}
              desc="Китайская open-source модель. Можно запустить на своём компьютере через Ollama — полностью бесплатно и без интернета."
              features={[
                "Локально: Ollama + 8GB+ VRAM",
                "Качество: на уровне GPT-4o",
                "API: совместим с OpenAI API",
                "Инструменты: Cline, Aider, Continue",
              ]}
              code={`# Установка и запуск DeepSeek локально
ollama pull deepseek-r1:8b
ollama run deepseek-r1:8b
# Теперь доступен на http://localhost:11434`}
            />
          </div>
        </section>

        {/* HOW TO START */}
        <section id="howto" style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
            Быстрый старт с российским AI
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
            <StepCard num={1} title="Зарегистрируйся в Yandex Cloud" icon={<Cloud size={20} />} color="#3b82f6">
              <StepC>Перейди на cloud.yandex.ru → зарегистрируйся (нужен Яндекс ID) → подключи сервис YandexGPT → получи API-ключ. <strong>1000 запросов бесплатно</strong> для теста.</StepC>
            </StepCard>
            <StepCard num={2} title="Установи Cline в VS Code" icon={<Code2 size={20} />} color="#3b82f6">
              <StepC>VS Code → Extensions → Cline → установить. Подключи YandexGPT API ключ в настройках. Или DeepSeek через Ollama (локально и бесплатно).</StepC>
            </StepCard>
            <StepCard num={3} title="Напиши первый AI-запрос" icon={<MessageCircle size={20} />} color="#3b82f6">
              <StepC>В Cline открой чат → опиши что нужно сделать → AI напишет код. Пример: «Создай Telegram бота на aiogram с командой /start и кнопкой Узнать погоду».</StepC>
            </StepCard>
            <StepCard num={4} title="Задеплой на российский хостинг" icon={<Rocket size={20} />} color="#3b82f6">
              <StepC>Beget VDS от 400 ₽/мес → установи Node.js + PostgreSQL → залей код через Git → запусти через PM2. Бесплатный SSL через LetsEncrypt.</StepC>
            </StepCard>
          </div>
        </section>

        {/* PITFALLS */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-l)" }}>
            <div style={{ width: 40, height: 40, borderRadius: "var(--radius-m)", background: "#fbbf24", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <AlertTriangle size={22} style={{ color: "#000" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, margin: 0 }}>Подводные камни</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-m)" }}>
            <PitfallC icon={<AlertTriangle size={16} />} title="YandexGPT ≠ ChatGPT по качеству">
              Для креативных задач и сложного кода западные модели пока впереди. Но для 80% рутинных задач (рефакторинг, документация, простой код) YandexGPT достаточно.
            </PitfallC>
            <PitfallC icon={<AlertTriangle size={16} />} title="Локальные модели требуют железо">
              DeepSeek R1 8B — минимум 8GB VRAM. Для 70B версии нужно 32GB+. Если видеокарты нет — используй YandexGPT через API.
            </PitfallC>
            <PitfallC icon={<AlertTriangle size={16} />} title="GigaChat API сложнее получить">
              Нужно юрлицо или ИП для полного доступа. Физическим лицам — только тестовый режим с ограничениями.
            </PitfallC>
            <PitfallC icon={<AlertTriangle size={16} />} title="Цены меняются">
              Российские AI-сервисы активно развиваются — тарифы и лимиты обновляются каждые 2-3 месяца. Проверяй актуальные цены перед интеграцией.
            </PitfallC>
          </div>
        </section>

        {/* TOOLS */}
        {tools.length > 0 && (
          <section style={{ marginBottom: "var(--space-xxl)" }}>
            <SH icon={<Wrench size={20} />} title="AI-инструменты в каталоге" subtitle="Подробные обзоры в разделе AI-инструментов" href="/ai-tools" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-m)" }}>
              {tools.map((t: any) => (
                <Link key={t.id} href={`/ai-tools/${t.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "var(--space-l)", transition: "box-shadow 0.2s" }} className="card-hover">
                    <div style={{ fontSize: "var(--text-s)", fontWeight: 700, marginBottom: 4 }}>{t.name}</div>
                    <div style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{t.description?.slice(0, 100)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: "var(--space-l)" }}>
            <div style={{ width: 40, height: 40, borderRadius: "var(--radius-m)", background: "var(--color-accent-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <HelpCircle size={22} style={{ color: "var(--color-accent)" }} />
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, margin: 0 }}>Часто задаваемые вопросы</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            <FAQ q="Чем YandexGPT хуже ChatGPT?" a="Для креатива и сложной архитектуры кода — пока уступает. Для фактов, переводов, структурирования, простого кода — работает отлично. Главный плюс: доступен из РФ без VPN, оплата в рублях." />
            <FAQ q="Можно ли использовать YandexGPT в коммерческом проекте?" a="Да. Yandex Cloud предоставляет API для бизнеса. Нужен договор (ИП или ООО). Цены прозрачные, есть бесплатный тестовый период." />
            <FAQ q="Что лучше для кода: YandexGPT или DeepSeek?" a="DeepSeek R1 через Ollama (локально) показывает лучшее качество кода. Но требует видеокарту. YandexGPT проще в интеграции и не требует железа." />
            <FAQ q="Работает ли Kandinsky также хорошо как Midjourney?" a="Kandinsky 3.1 приближается к Midjourney v5, особенно на русских промптах. Для коммерческой графики — достаточен. Для фотореализма Midjourney пока впереди." />
            <FAQ q="Как оплатить зарубежный AI-сервис из России?" a="OpenRouter принимает некоторые карты РФ. Альтернативы: карта иностранного банка, криптовалюта. Но проще использовать российские аналоги." />
            <FAQ q="Есть ли российский аналог GitHub Copilot?" a="Прямого аналога нет. Но связка Cline + YandexGPT/DeepSeek даёт 90% той же функциональности: автодополнение, чат, рефакторинг — бесплатно и без VPN." />
          </div>
        </section>

        {/* CTA */}
        <section style={{ textAlign: "center", padding: "var(--space-xxl) var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <Cpu size={48} style={{ color: "#3b82f6", marginBottom: "var(--space-m)" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-s)" }}>
            Готов начать AI-разработку на российском стеке?
          </h2>
          <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", maxWidth: 480, margin: "0 auto var(--space-l)", lineHeight: 1.6 }}>
            Выбери Blueprint, подключи YandexGPT или DeepSeek, и создай свой первый AI-проект за 2–3 дня.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/blueprints" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "#3b82f6", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Выбрать Blueprint <ArrowRight size={16} />
            </Link>
            <Link href="/ai-without-vpn" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "var(--color-bg-primary)", color: "#3b82f6", border: "1px solid #3b82f6", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              AI без VPN <Shield size={16} />
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}

// ── Components ──
const thS: any = { textAlign: "left", padding: "var(--space-s) var(--space-m)", fontWeight: 700, fontSize: 11 };
function ModelRow({ name, type, price, vpn, pay, api, quality, note }: any) {
  return <tr style={{ borderBottom: "1px solid var(--color-border)" }}>
    <td style={{ padding: "var(--space-s) var(--space-m)", fontWeight: 700, fontSize: "var(--text-xs)" }}>{name}</td>
    <td style={{ padding: "var(--space-s) var(--space-m)", fontSize: 11, color: "var(--color-text-secondary)" }}>{type}</td>
    <td style={{ padding: "var(--space-s) var(--space-m)", fontSize: 11 }}>{price}</td>
    <td style={{ padding: "var(--space-s) var(--space-m)", fontSize: 11 }}>{vpn}</td>
    <td style={{ padding: "var(--space-s) var(--space-m)", fontSize: 11 }}>{pay}</td>
    <td style={{ padding: "var(--space-s) var(--space-m)", fontSize: 11 }}>{api}</td>
    <td style={{ padding: "var(--space-s) var(--space-m)", fontSize: 11 }}>{quality}</td>
  </tr>;
}
function ModelCard({ name, icon, color, rating, desc, features, code }: any) {
  return <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", overflow: "hidden" }}>
    <div style={{ padding: "var(--space-l)", display: "flex", gap: "var(--space-m)", borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-secondary)" }}>
      <div style={{ width: 44, height: 44, borderRadius: "var(--radius-m)", background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", color, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}><div style={{ display: "flex", alignItems: "center", gap: 8 }}><h4 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, margin: 0 }}>{name}</h4><span style={{ fontSize: 10, padding: "2px 6px", borderRadius: "var(--radius-full)", background: "#fbbf24", color: "#000", fontWeight: 700 }}>★ {rating}/10</span></div>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", margin: "4px 0 0", lineHeight: 1.6 }}>{desc}</p>
      </div>
    </div>
    <div style={{ padding: "var(--space-l)" }}>
      <div style={{ fontSize: "var(--text-xs)", lineHeight: 1.8, color: "var(--color-text-primary)" }}>
        {features?.map((f: string, i: number) => <div key={i} style={{ marginBottom: 4 }}>• {f}</div>)}
        {code && <pre style={{ background: "#1a1a2e", color: "#e0e0e0", padding: "var(--space-m)", borderRadius: "var(--radius-s)", fontSize: 11, lineHeight: 1.5, overflowX: "auto", marginTop: "var(--space-m)" }}>{code}</pre>}
      </div>
    </div>
  </div>;
}
function StackItem({ icon, label, value }: any) {
  return <div style={{ display: "flex", gap: 10, marginBottom: "var(--space-s)", alignItems: "flex-start" }}>
    <div style={{ color: "#3b82f6", flexShrink: 0, marginTop: 2 }}>{icon}</div>
    <div><div style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>{label}</div><div style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{value}</div></div>
  </div>;
}
function StepCard({ num, title, icon, color, children }: any) {
  return <div style={{ display: "flex", gap: "var(--space-l)", alignItems: "flex-start" }}>
    <div style={{ width: 44, height: 44, borderRadius: "var(--radius-m)", background: color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "var(--text-m)", fontWeight: 800 }}>{num}</div>
    <div style={{ flex: 1, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "var(--space-l)" }}>
      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, margin: "0 0 var(--space-s)", display: "flex", alignItems: "center", gap: 8 }}><span style={{ color }}>{icon}</span> {title}</h3>
      {children}
    </div>
  </div>;
}
function StepC({ children }: any) { return <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.9 }}>{children}</div>; }
function PitfallC({ icon, title, children }: any) {
  return <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderLeft: "3px solid #fbbf24", borderRadius: "var(--radius-m)", padding: "var(--space-l)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-s)" }}><span style={{ color: "#fbbf24" }}>{icon}</span><h4 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xs)", fontWeight: 700, margin: 0 }}>{title}</h4></div>
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>{children}</div>
  </div>;
}
function SH({ icon, title, subtitle, href }: any) {
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-l)" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ color: "var(--color-accent)" }}>{icon}</div><div><h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, margin: 0 }}>{title}</h3><p style={{ fontSize: 11, color: "var(--color-text-secondary)", margin: "2px 0 0" }}>{subtitle}</p></div></div>
    {href && <Link href={href} style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>Все <ArrowRight size={14} /></Link>}
  </div>;
}
function FAQ({ q, a }: any) {
  return <details style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", overflow: "hidden" }}>
    <summary style={{ padding: "var(--space-l)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: "var(--text-s)", fontWeight: 600, fontFamily: "var(--font-heading)", listStyle: "none" }}>{q}<ChevronDown size={18} style={{ color: "var(--color-accent)", flexShrink: 0 }} /></summary>
    <div style={{ padding: "0 var(--space-l) var(--space-l)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>{a}</div>
  </details>;
}

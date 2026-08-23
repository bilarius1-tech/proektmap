import { getDb } from "@/lib/db/index";
import Link from "next/link";
import { ArrowRight, Code2, BookOpen, Puzzle, Sparkles, ExternalLink, Layers, Brain, Target, Bot, Shield, CheckCircle, AlertTriangle, Users } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Skills — библиотека профессиональных навыков",
  description: "Skills ProektMap: публичные AI-навыки для Reasonix, Prisma Skills для обучения, методология визуального контента. Открытая библиотека переиспользуемых процедур.",
};

// ─── Reasonix Skills (public, free) ───
const REASONIX_SKILLS = [
  {
    name: "visual-content",
    icon: "\uD83D\uDC41\uFE0F",
    title: "Visual Content",
    status: "ready",
    trust: "verified",
    description: "Создаёт профессиональные визуальные пояснения: схемы, диаграммы, UI-примеры, скриншоты. Анализирует текст и выбирает лучший тип визуализации.",
    bullets: ["17 правил визуальной методологии", "6 типов визуала (схема, диаграмма, UI, фото, иллюстрация, скриншот)", "Приоритет SVG/HTML/CSS над стоком", "Анти-AI-сток политика"],
    link: null,
    color: "#0FB880",
    author: "ProektMap",
    testedWith: ["Reasonix", "Cursor"],
  },
  {
    name: "yookassa-checkout",
    icon: "\uD83D\uDCB3",
    title: "ЮKassa Checkout",
    status: "ready",
    trust: "verified",
    description: "Профессиональная интеграция ЮKassa в Next.js: архитектура, API, webhook, идемпотентность, обработка платежей, возвраты и тестирование.",
    bullets: ["Архитектура платёжного потока", "API + webhook с идемпотентностью", "Модель БД (Prisma)", "Тестовые карты и проверка перед деплоем"],
    link: null,
    color: "#F59E0B",
    author: "ProektMap",
    testedWith: ["Reasonix", "Cursor", "Claude Code"],
  },
  {
    name: "blueprint-builder",
    icon: "\uD83C\uDFD7\uFE0F",
    title: "Blueprint Builder",
    status: "planned",
    trust: "community",
    description: "Генерирует структуру Blueprint по теме: фазы, решения, стек, зависимости. Превращает идею в инженерный маршрут.",
    bullets: ["5+ фаз с решениями", "Подбор стека под задачу", "Связи между решениями", "Оценка сложности"],
    link: null,
    color: "#3B82F6",
    author: null,
    testedWith: [],
  },
  {
    name: "decision-coach",
    icon: "\uD83E\uDDED",
    title: "Decision Coach",
    status: "planned",
    trust: "community",
    description: "Проводит пользователя через Decision-Driven Development: цепочка решений, альтернативы, компромиссы.",
    bullets: ["Методология принятия решений", "Сравнение альтернатив", "Фиксация решений", "Экспорт в Blueprint"],
    link: null,
    color: "#F59E0B",
    author: null,
    testedWith: [],
  },
  {
    name: "seo-analyzer",
    icon: "\uD83D\uDD0D",
    title: "SEO Analyzer",
    status: "planned",
    trust: "community",
    description: "Аудит страницы по методологии ProektMap SEO: структура, Schema.org, кластеры, длинный хвост.",
    bullets: ["Проверка meta-тегов", "Schema.org валидация", "Кластерный анализ", "Рекомендации по длинному хвосту"],
    link: null,
    color: "#8B5CF6",
    author: null,
    testedWith: [],
  },
  {
    name: "knowledge-clipper",
    icon: "\uD83D\uDCCE",
    title: "Knowledge Clipper",
    status: "planned",
    trust: "community",
    description: "Работа с Knowledge Panel: сохранение, связывание и поиск знаний в персональном блокноте пользователя.",
    bullets: ["Сохранение фрагментов", "Связывание знаний", "Поиск по блокноту", "Экспорт в Blueprint"],
    link: null,
    color: "#EC4899",
    author: null,
    testedWith: [],
  },
];

// ─── Prisma Skills (educational, from DB) ───
export default async function SkillsPage() {
  const db = await getDb();

  let prismaSkills: any[] = [];
  try {
    prismaSkills = await db.skill.findMany({
      where: { isPublished: true },
      orderBy: { xpReward: "desc" },
      take: 6,
    });
  } catch (e) {}

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>

      {/* ═══ HERO ═══ */}
      <div style={{ background: "linear-gradient(135deg, #0d1b2a 0%, #1b2838 50%, #0f3460 100%)", padding: "80px 20px 60px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 40%, rgba(15,184,128,0.12), transparent 60%)" }} />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 18px", borderRadius: "var(--radius-full)", background: "rgba(15,184,128,0.2)", color: "#0FB880", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
            <Shield size={16} /> Проверенные навыки
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px, 6vw, 46px)", fontWeight: 800, lineHeight: 1.05, marginBottom: "var(--space-s)", letterSpacing: "-0.02em", color: "#fff" }}>
            Библиотека профессиональных<br />Skills для AI-разработки
          </h1>
          <p style={{ fontSize: "var(--text-l)", color: "rgba(255,255,255,0.7)", maxWidth: 520, margin: "0 auto var(--space-xl)", lineHeight: 1.7 }}>
            ProektMap — не океан Skills, а навигатор по проверенным. Каждый Skill проходит аудит безопасности перед публикацией.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a href="#reasonix" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "#0FB880", color: "#fff", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Reasonix Skills <ArrowRight size={16} />
            </a>
            <a href="#trust" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Система доверия <Shield size={16} />
            </a>
            <a href="#prisma" style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 32px", borderRadius: "var(--radius-m)", background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
              Prisma Skills <BookOpen size={16} />
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>

        {/* ═══ ДВА ТИПА ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
            Два типа Skills в ProektMap
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-xl)" }}>
            <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", padding: "var(--space-xl)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)" }}>
                <div style={{ width: 40, height: 40, borderRadius: "var(--radius-s)", background: "rgba(15,184,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Bot size={20} color="#0FB880" />
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, margin: 0 }}>Reasonix Skills</h3>
              </div>
              <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 var(--space-m)" }}>
                AI-агенты выполняют эти Skills автоматически. Каждый Skill — это файл <code style={{ background: "rgba(0,0,0,0.1)", padding: "1px 6px", borderRadius: 4, fontSize: "0.9em" }}>SKILL.md</code> с процедурой. Агент анализирует задачу и применяет методологию ProektMap.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                <BulletItem icon={<Code2 size={14} color="#0FB880" />}>Живут в <code style={{ background: "rgba(0,0,0,0.05)", padding: "1px 4px", borderRadius: 3, fontSize: "0.9em" }}>.reasonix/skills/</code></BulletItem>
                <BulletItem icon={<Sparkles size={14} color="#0FB880" />}>Выполняются AI-агентом</BulletItem>
                <BulletItem icon={<Shield size={14} color="#0FB880" />}>Проходят аудит безопасности</BulletItem>
                <BulletItem icon={<ExternalLink size={14} color="#0FB880" />}>Публикуются в реестре Reasonix</BulletItem>
              </div>
            </div>
            <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", padding: "var(--space-xl)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)" }}>
                <div style={{ width: 40, height: 40, borderRadius: "var(--radius-s)", background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={20} color="#3B82F6" />
                </div>
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, margin: 0 }}>Prisma Skills</h3>
              </div>
              <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 var(--space-m)" }}>
                Образовательные навыки для людей. Каждый Skill — это урок с шагами, XP-очками и привязкой к Blueprint. Пользователь проходит Skill и получает практический опыт.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                <BulletItem icon={<Brain size={14} color="#3B82F6" />}>Учебные модули с шагами</BulletItem>
                <BulletItem icon={<Target size={14} color="#3B82F6" />}>XP-очки и уровни сложности</BulletItem>
                <BulletItem icon={<Layers size={14} color="#3B82F6" />}>Привязка к Blueprint и решениям</BulletItem>
                <BulletItem icon={<ExternalLink size={14} color="#3B82F6" />}>Pro-подписка открывает все</BulletItem>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ REASONIX SKILLS ═══ */}
        <section id="reasonix" style={{ marginBottom: "var(--space-xxl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-l)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "var(--radius-s)", background: "rgba(15,184,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={18} color="#0FB880" />
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
              Reasonix Skills
            </h2>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", background: "var(--color-bg-secondary)", padding: "2px 10px", borderRadius: "var(--radius-full)" }}>
              {REASONIX_SKILLS.filter(s => s.status === "ready").length} готово · {REASONIX_SKILLS.length} всего
            </span>
            <span style={{ fontSize: "var(--text-xs)", color: "#0FB880", background: "rgba(15,184,128,0.15)", padding: "2px 10px", borderRadius: "var(--radius-full)", marginLeft: 4 }}>
              🟢 {REASONIX_SKILLS.filter(s => s.trust === "verified").length} проверено
            </span>
          </div>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-xl)" }}>
            Публичные Skills для AI-агентов. Каждый Skill — это файл <code style={{ background: "rgba(0,0,0,0.05)", padding: "1px 6px", borderRadius: 4, fontSize: "0.9em" }}>SKILL.md</code> в директории <code style={{ background: "rgba(0,0,0,0.05)", padding: "1px 6px", borderRadius: 4, fontSize: "0.9em" }}>.reasonix/skills/</code>. Агент подгружает Skill по необходимости и применяет методологию ProektMap.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
            {REASONIX_SKILLS.map((skill) => (
              <SkillCard key={skill.name} {...skill} />
            ))}
          </div>

          <div style={{ marginTop: "var(--space-xl)", padding: "var(--space-xl)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", textAlign: "center" }}>
            <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", margin: "0 0 var(--space-m)", lineHeight: 1.6 }}>
              \uD83D\uDCCB <strong>План развития:</strong> 3 фазы — от ядра до экосистемы.
            </p>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>См. docs/SKILLS-LIBRARY-PLAN.md в репозитории проекта</span>
          </div>
        </section>

        {/* ═══ СИСТЕМА ДОВЕРИЯ ═══ */}
        <section id="trust" style={{ marginBottom: "var(--space-xxl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-l)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "var(--radius-s)", background: "rgba(15,184,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Shield size={18} color="#0FB880" />
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
              Система доверия
            </h2>
          </div>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-xl)" }}>
            Исследование 2026 года показало дефекты у 91,8% Skills в публичных каталогах. Обнаружены вредоносные Skills, ворующие SSH-ключи и токены.
            ProektMap вводит трёхуровневую систему проверки.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-m)", marginBottom: "var(--space-xl)" }}>
            <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid rgba(15,184,128,0.3)", padding: "var(--space-xl)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)" }}>
                <CheckCircle size={20} color="#0FB880" />
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, margin: 0 }}>🟢 Проверен ProektMap</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                <span>• Ручная проверка кода экспертом</span>
                <span>• Нет сетевых запросов к сторонним хостам</span>
                <span>• Нет доступа к secrets и credentials</span>
                <span>• Протестирован с 2+ AI-агентами</span>
                <span>• Автор подтверждён</span>
              </div>
            </div>
            <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid rgba(245,158,11,0.3)", padding: "var(--space-xl)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)" }}>
                <Users size={20} color="#F59E0B" />
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, margin: 0 }}>🟡 Community</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                <span>• Новый Skill, ещё не проверенный</span>
                <span>• Код доступен и читаем</span>
                <span>• Автор известен</span>
                <span>• Нет явных угроз</span>
                <span>• Ждёт полной проверки</span>
              </div>
            </div>
            <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid rgba(239,68,68,0.3)", padding: "var(--space-xl)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)" }}>
                <AlertTriangle size={20} color="#EF4444" />
                <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, margin: 0 }}>🔴 Не рекомендуется</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                <span>• Обнаружены подозрительные команды</span>
                <span>• Сетевые запросы к неизвестным хостам</span>
                <span>• Попытки доступа к secrets</span>
                <span>• Обфускация кода</span>
                <span>• Не рекомендуется к использованию</span>
              </div>
            </div>
          </div>

          <div style={{ padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)" }}>
            <h4 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xs)", fontWeight: 700, marginBottom: "var(--space-s)", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--color-text-tertiary)" }}>
              Процесс проверки
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
              <span><strong>1. Автоматическая</strong> — сканирование на подозрительные паттерны (shell exec, network requests, доступ к secrets)</span>
              <span><strong>2. Ручная</strong> — аудит кода экспертом ProektMap</span>
              <span><strong>3. Community</strong> — отзывы и репорты от пользователей</span>
              <span><strong>4. Периодическая</strong> — повторная проверка при обновлениях Skill</span>
            </div>
          </div>
        </section>

        {/* ═══ PRISMA SKILLS ═══ */}
        <section id="prisma" style={{ marginBottom: "var(--space-xxl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-l)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "var(--radius-s)", background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookOpen size={18} color="#3B82F6" />
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, margin: 0, letterSpacing: "-0.01em" }}>
              Prisma Skills
            </h2>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", background: "var(--color-bg-secondary)", padding: "2px 10px", borderRadius: "var(--radius-full)" }}>
              {prismaSkills.length} в базе
            </span>
          </div>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-xl)" }}>
            Образовательные навыки для людей. Проходите уроки, получайте XP, применяйте знания в Blueprint.
          </p>

          {prismaSkills.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-m)" }}>
              {prismaSkills.map((skill: any) => (
                <div key={skill.id} style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", padding: "var(--space-l)", display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, margin: 0 }}>{skill.title}</h3>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-full)", background: difficultyBg(skill.difficulty), color: difficultyColor(skill.difficulty), textTransform: "uppercase" }}>
                      {difficultyLabel(skill.difficulty)}
                    </span>
                  </div>
                  {skill.timeEstimate && (
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                      ⏱ {skill.timeEstimate} · ⭐ {skill.xpReward} XP
                    </div>
                  )}
                  {skill.slug && (
                    <Link href={`/skills/${skill.slug}`} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none", fontWeight: 600, marginTop: "auto", paddingTop: "var(--space-s)" }}>
                      Открыть <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ padding: "var(--space-xl)", textAlign: "center", color: "var(--color-text-tertiary)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)" }}>
              <BookOpen size={32} style={{ marginBottom: "var(--space-m)", opacity: 0.3 }} />
              <p style={{ fontSize: "var(--text-s)", margin: 0 }}>Prisma Skills скоро появятся</p>
            </div>
          )}
        </section>

        {/* ═══ МОСТ ═══ */}
        <section style={{ marginBottom: "var(--space-xxl)", padding: "var(--space-xl)", background: "linear-gradient(135deg, rgba(15,184,128,0.08), rgba(59,130,246,0.08))", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)", textAlign: "center" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-s)", letterSpacing: "-0.01em" }}>
            Мост между мирами
          </h2>
          <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", maxWidth: 600, margin: "0 auto var(--space-m)", lineHeight: 1.7 }}>
            Prisma Skill описывает <strong>«что делать»</strong>, Reasonix Skill выполняет <strong>«как делать»</strong>.
            В будущем прохождение Prisma Skill будет разблокировать Reasonix Skill — и наоборот.
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-xl)", flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "var(--radius-m)", background: "rgba(59,130,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-s)" }}>
                <BookOpen size={28} color="#3B82F6" />
              </div>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Prisma Skills</div>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Образование</div>
            </div>
            <div style={{ fontSize: "var(--text-l)", color: "var(--color-accent)", fontWeight: 700 }}>↔</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ width: 64, height: 64, borderRadius: "var(--radius-m)", background: "rgba(15,184,128,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto var(--space-s)" }}>
                <Bot size={28} color="#0FB880" />
              </div>
              <div style={{ fontSize: "var(--text-xs)", fontWeight: 600 }}>Reasonix Skills</div>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Исполнение</div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

// ─── Helpers ───

function SkillCard({ name, icon, title, status, trust, description, bullets, color, author, testedWith }: {
  name: string; icon: string; title: string; status: string; trust: string; description: string; bullets: string[]; color: string; link: string | null; author: string | null; testedWith: string[];
}) {
  return (
    <div style={{ background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: `1px solid ${trust === "verified" ? "rgba(15,184,128,0.4)" : status === "ready" ? color + "40" : "var(--color-border)"}`, padding: "var(--space-xl)", display: "flex", gap: "var(--space-l)", alignItems: "flex-start" }}>
      <div style={{ width: 48, height: 48, borderRadius: "var(--radius-m)", background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-xs)", flexWrap: "wrap" }}>
          <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, margin: 0 }}>
            {title}
          </h3>
          <StatusBadge status={status} />
          <TrustBadge trust={trust} />
        </div>
        <code style={{ fontSize: 10, color: "var(--color-text-tertiary)", background: "rgba(0,0,0,0.05)", padding: "1px 6px", borderRadius: 3, marginBottom: "var(--space-s)", display: "inline-block" }}>
          .reasonix/skills/{name}/SKILL.md
        </code>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: "0 0 var(--space-s)" }}>
          {description}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {bullets.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: color, flexShrink: 0 }} />
              {b}
            </div>
          ))}
        </div>
        {(author || testedWith.length > 0) && (
          <div style={{ marginTop: "var(--space-s)", display: "flex", alignItems: "center", gap: "var(--space-m)", flexWrap: "wrap", fontSize: 10, color: "var(--color-text-tertiary)" }}>
            {author && <span>Автор: {author}</span>}
            {testedWith.length > 0 && (
              <span>🧪 {testedWith.join(" / ")}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isReady = status === "ready";
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-full)",
      background: isReady ? "rgba(15,184,128,0.2)" : "rgba(245,158,11,0.2)",
      color: isReady ? "#0FB880" : "#F59E0B",
      textTransform: "uppercase", letterSpacing: "0.03em",
    }}>
      {isReady ? "✅ Готов" : "📋 План"}
    </span>
  );
}

function TrustBadge({ trust }: { trust: string }) {
  if (trust === "verified") {
    return (
      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-full)", background: "rgba(15,184,128,0.2)", color: "#0FB880", textTransform: "uppercase", letterSpacing: "0.03em", display: "inline-flex", alignItems: "center", gap: 3 }}>
        🟢 Проверен
      </span>
    );
  }
  if (trust === "community") {
    return (
      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: "var(--radius-full)", background: "rgba(245,158,11,0.2)", color: "#F59E0B", textTransform: "uppercase", letterSpacing: "0.03em", display: "inline-flex", alignItems: "center", gap: 3 }}>
        🟡 Community
      </span>
    );
  }
  return null;
}

function BulletItem({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
      {icon}
      {children}
    </div>
  );
}

function difficultyBg(d: string) {
  const map: Record<string, string> = { easy: "rgba(15,184,128,0.2)", medium: "rgba(245,158,11,0.2)", hard: "rgba(239,68,68,0.2)" };
  return map[d] || "rgba(100,100,100,0.2)";
}

function difficultyColor(d: string) {
  const map: Record<string, string> = { easy: "#0FB880", medium: "#F59E0B", hard: "#EF4444" };
  return map[d] || "#999";
}

function difficultyLabel(d: string) {
  const map: Record<string, string> = { easy: "Лёгкий", medium: "Средний", hard: "Сложный" };
  return map[d] || d;
}

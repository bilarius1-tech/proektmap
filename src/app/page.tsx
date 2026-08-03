import { getDb } from "@/lib/db/index";
import AnimatedHero from "@/components/hero/animated-hero";
import Link from "next/link";
import BlueprintQuiz from "@/components/widgets/blueprint-quiz";
import CostCalculator from "@/components/widgets/cost-calculator";
import { Globe, Smartphone, Gamepad2, Server, Camera, Package, ArrowRight, Check, Crown, Shield, Map, Bot, Rocket, GitBranch, Compass } from "lucide-react";

const blueprints = [
  { slug: "corporate-website", title: "Корпоративный сайт", desc: "От покупки домена до запуска рекламы", icon: Globe, xp: 710, decisions: 40, active: true },
  { slug: "saas-project", title: "SaaS-продукт", desc: "От идеи до первых платящих клиентов", icon: Server, xp: 445, decisions: 21, active: true },
  { slug: "mobile-app", title: "Мобильное приложение", desc: "React Native + AI: от макета до App Store", icon: Smartphone, xp: 0, decisions: 0 },
  { slug: "game-dev", title: "Разработка игры", desc: "Godot + AI: от идеи до Яндекс.Игр", icon: Gamepad2, xp: 350, decisions: 19, active: true },
  { slug: "photo-service", title: "Сервис обработки фото", desc: "AI API + загрузка + галерея", icon: Camera, xp: 0, decisions: 0 },
  { slug: "api-service", title: "Backend API", desc: "REST/GraphQL + БД + авторизация", icon: Package, xp: 0, decisions: 0 },
];

export default async function Home() {
  const db = await getDb();
  const latestPosts = await db.blogPost.findMany({ where: { status: "published" }, orderBy: { publishedAt: "desc" }, take: 3, select: { title: true, slug: true, excerpt: true, coverImage: true, publishedAt: true, viewCount: true } });
  const latestUsers = await db.user.findMany({ orderBy: { createdAt: "desc" }, take: 4, select: { id: true, name: true, email: true, avatar: true, createdAt: true, status: true, role: true } });
  const latestBlueprints = await db.blueprint.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 3, select: { title: true, slug: true, description: true, coverImage: true, difficulty: true, icon: true } });
  const popularPosts = await db.blogPost.findMany({ where: { status: "published" }, orderBy: { viewCount: "desc" }, take: 3, select: { title: true, slug: true, publishedAt: true, viewCount: true } });
  const [decisionCount, skillCount, postCount] = await Promise.all([
    db.decision.count(), db.skill.count({ where: { isPublished: true } }), db.blogPost.count({ where: { status: "published" } }),
  ]);
  const latestTerms = await db.glossaryTerm.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 6, select: { term: true, slug: true, simpleExplanation: true, level: true } });

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>
      {/* Hero */}
      <AnimatedHero>
      <div style={{ background: "transparent", padding: "80px 20px 50px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: "var(--radius-full)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-m)" }}>
          ⚡ Конструктор проектов
        </div>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, lineHeight: 1.05, marginBottom: "var(--space-s)", letterSpacing: "-0.02em" }}>
          Создавайте цифровые продукты<br />с помощью ИИ
        </h1>
        <p style={{ fontSize: "var(--text-l)", color: "var(--color-text-secondary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
          Пошаговые Blueprint для сайтов, SaaS, CRM-систем, маркетплейсов и Telegram-ботов. Готовые инструменты, решения и реальные кейсы.
        </p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: "var(--space-xl)", flexWrap: "wrap" }}>
          <Link href="/blueprints" style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 28px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
            Посмотреть все Blueprint'ы <ArrowRight size={16} />
          </Link>
          <Link href="/pricing" style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 28px", borderRadius: "var(--radius-m)", background: "white", color: "var(--color-accent)", border: "1px solid var(--color-accent)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
            <Crown size={16} /> Pro — 300 /мес
          </Link>
        </div>
      </div>
      </AnimatedHero>
      <div style={{ height: 1, background: "var(--color-border)" }} />

      {/* Как это работает */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, textAlign: "center", marginBottom: "var(--space-xl)", letterSpacing: "-0.01em" }}>
          Как это работает
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-l)" }}>
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "var(--space-xl)", textAlign: "center", position: "relative" }}>
            <div style={{ position: "absolute", top: 12, left: 16, fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}>1</div>
            <Map size={36} style={{ color: "var(--color-accent)", marginBottom: "var(--space-s)" }} />
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-xs)" }}>Выбери шаблон</h3>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>Blueprint под твой проект: сайт, SaaS, игра или приложение. Готовая дорожная карта с этапами.</p>
          </div>
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "var(--space-xl)", textAlign: "center", position: "relative" }}>
            <div style={{ position: "absolute", top: 12, left: 16, fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}>2</div>
            <Bot size={36} style={{ color: "var(--color-accent)", marginBottom: "var(--space-s)" }} />
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-xs)" }}>Пройди этапы</h3>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>AI-Архитектор предлагает решения на каждом шаге. Ты выбираешь — система собирает проект.</p>
          </div>
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "var(--space-xl)", textAlign: "center", position: "relative" }}>
            <div style={{ position: "absolute", top: 12, left: 16, fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}>3</div>
            <Rocket size={36} style={{ color: "var(--color-accent)", marginBottom: "var(--space-s)" }} />
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-xs)" }}>Запусти проект</h3>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>Опубликуй результат: сайт, бот или SaaS. От идеи до работающего продукта с готовыми промптами.</p>
          </div>
        </div>
      </div>

      {/* Два пути */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 var(--space-m) var(--space-xl)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, textAlign: "center", marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
          Два пути к результату
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-l)" }}>
          <a href="/decisions" style={{ textDecoration: "none", color: "inherit", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderTop: "4px solid var(--color-accent)", padding: "var(--space-xl)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "var(--space-m)" }}>
              <div style={{ width: 48, height: 48, background: "var(--color-accent)", borderRadius: "var(--radius-s)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><GitBranch size={22} /></div>
              <div><div style={{ fontSize: "var(--text-s)", fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: 2 }}>Принимай решения</div><div style={{ fontSize: 11, color: "var(--color-accent)", fontWeight: 700 }}>Decision-Driven</div></div>
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7, flex: 1, marginBottom: "var(--space-m)" }}>Твой проект — цепочка осознанных инженерных решений. AI-Архитектор предлагает варианты, ты выбираешь, система строит карту навыков.</p>
            <div style={{ marginTop: "auto", fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}>ПОНЯТЬ → ВЫБРАТЬ → ПРОВЕРИТЬ</div>
          </a>
          <a href="/quest/beginner" style={{ textDecoration: "none", color: "inherit", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderTop: "4px solid #8b5cf6", padding: "var(--space-xl)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "var(--space-m)" }}>
              <div style={{ width: 48, height: 48, background: "#8b5cf6", borderRadius: "var(--radius-s)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Compass size={22} /></div>
              <div><div style={{ fontSize: "var(--text-s)", fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: 2 }}>Пройди путь</div><div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700 }}>Быстрый старт</div></div>
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7, flex: 1, marginBottom: "var(--space-m)" }}>Никогда не писал код? Пройди 8 шагов от «что такое редактор» до работающего сайта в интернете. Каждый шаг — готовый промпт.</p>
            <div style={{ marginTop: "auto", fontSize: "var(--text-xs)", fontWeight: 700, color: "#8b5cf6", fontFamily: "var(--font-heading)" }}>8 шагов → сайт в интернете</div>
          </a>
        </div>
      </div>

      {/* Architect Banner */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 var(--space-m) var(--space-m)" }}>
        <Link href="/architect" style={{ display: "flex", alignItems: "center", gap: "var(--space-m)", padding: "var(--space-l)", background: "var(--color-accent-light)", border: "1px solid var(--color-accent)", borderLeft: "4px solid var(--color-accent)", textDecoration: "none", color: "inherit" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}> Новый инструмент</div>
            <div style={{ fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)" }}>AI-Архитектор</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: 2 }}>Опиши бизнес-идею — получи карту проекта: сущности, паттерны, MCP, стоимость, план</div>
          </div>
          <ArrowRight size={20} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
        </Link>
      </div>

      {/* Search */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", textAlign: "center" }}>
        <div style={{ fontSize: "var(--text-m)", fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: "var(--space-m)" }}>
          Найди термин, паттерн или инструмент
        </div>
        <form action="/search" method="GET" style={{ display: "flex", gap: 0, maxWidth: 500, margin: "0 auto", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
          <input name="q" placeholder="RAG, MCP, Prisma, SEO Аудитор..." style={{ flex: 1, padding: "14px 20px", fontSize: "var(--text-m)", border: "2px solid var(--color-border)", borderRight: "none", background: "var(--color-bg-primary)", outline: "none", color: "var(--color-text-primary)", boxSizing: "border-box" }} />
          <button type="submit" style={{ padding: "14px 24px", border: "none", background: "var(--color-accent)", color: "white", fontWeight: 700, fontSize: "var(--text-s)", cursor: "pointer" }}> Найти</button>
        </form>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: "var(--space-m)", flexWrap: "wrap", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
          Часто ищут: <a href="/search?q=MCP" style={{ color: "var(--color-accent)", textDecoration: "none" }}>MCP</a> <a href="/search?q=RAG" style={{ color: "var(--color-accent)", textDecoration: "none" }}>RAG</a> <a href="/search?q=Prisma" style={{ color: "var(--color-accent)", textDecoration: "none" }}>Prisma</a> <a href="/search?q=SEO" style={{ color: "var(--color-accent)", textDecoration: "none" }}>SEO</a>
        </div>
      </div>

      {/* 3 Content Blocks */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 var(--space-m) var(--space-xl)" }}>
        {/* Latest Posts */}
        {latestPosts.length > 0 && (
          <div style={{ marginBottom: "var(--space-xl)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: 0 }}>Новые посты</h2>
              <a href="/blog" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none", fontWeight: 600 }}>Все посты </a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-m)" }}>
              {latestPosts.map((p: any) => (
                <a key={p.slug} href={`/blog/${p.slug}`} style={{ padding: "var(--space-l)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}>
                  {p.coverImage && <img src={p.coverImage} alt="" style={{ width: "100%", height: 140, objectFit: "cover", marginBottom: "var(--space-s)" }} />}
                  <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: 4, lineHeight: 1.4 }}>{p.title}</div>
                  {p.excerpt && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1.5, marginBottom: "var(--space-s)", flex: 1 }}>{p.excerpt.slice(0, 100)}{p.excerpt.length > 100 ? "..." : ""}</div>}
                  <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{new Date(p.publishedAt).toLocaleDateString("ru")} &middot; {p.viewCount || 0} просмотров</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Latest Blueprints */}
        {latestBlueprints.length > 0 && (
          <div style={{ marginBottom: "var(--space-xl)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: 0 }}>Новые Blueprint'ы</h2>
              <a href="/blueprints" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none", fontWeight: 600 }}>Все Blueprint'ы →</a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-m)" }}>
              {latestBlueprints.map((bp: any) => (
                <a key={bp.slug} href={`/blueprints/${bp.slug}`} style={{ padding: "var(--space-l)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column" }}>
                  {bp.coverImage ? <img src={bp.coverImage} alt="" style={{ width: "100%", height: 140, objectFit: "cover", marginBottom: "var(--space-s)" }} /> : (
                    <div style={{ width: "100%", height: 140, background: "var(--color-bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-s)", fontSize: 32 }}>
                      {bp.icon === "Bot" ? "🤖" : bp.icon === "Store" ? "🛒" : bp.icon === "Users" ? "👥" : bp.icon === "ShoppingBag" ? "🛍️" : bp.icon === "Brain" ? "🧠" : bp.icon === "Globe" ? "🌐" : "📄"}
                    </div>
                  )}
                  <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: 4, lineHeight: 1.4 }}>{bp.title}</div>
                  {bp.description && <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", lineHeight: 1.5, marginBottom: "var(--space-s)", flex: 1 }}>{bp.description.slice(0, 100)}{bp.description.length > 100 ? "..." : ""}</div>}
                  <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>
                    {bp.difficulty === "easy" ? "🟢 Лёгкий" : bp.difficulty === "hard" ? "🔴 Сложный" : "🟡 Средний"}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Latest Users */}
        {latestUsers.length > 0 && (
          <div style={{ marginBottom: "var(--space-xl)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: 0 }}>Новые участники</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-m)" }}>
              {latestUsers.map((u: any) => (
                <a key={u.id} href={`/profile/${u.id}`} style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "var(--space-m)" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "var(--radius-full)", background: u.avatar ? `url(${u.avatar}) center/cover` : "var(--color-bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>
                    {!u.avatar && (u.name?.[0] || u.email[0]).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: "var(--text-xs)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.name || u.email.split("@")[0]}</div>
                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{u.status === "junior" ? "Новичок" : u.status}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Popular Posts */}
        {popularPosts.length > 0 && (
          <div style={{ marginBottom: "var(--space-xl)" }}>
            <div style={{ marginBottom: "var(--space-m)" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: 0 }}>Популярное за неделю</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-m)" }}>
              {popularPosts.map((p: any, i: number) => (
                <a key={p.slug} href={`/blog/${p.slug}`} style={{ padding: "var(--space-l)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "var(--space-m)" }}>
                  <div style={{ fontSize: "var(--text-xl)", fontWeight: 800, color: "var(--color-accent)", fontFamily: "var(--font-heading)", width: 32, flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{new Date(p.publishedAt).toLocaleDateString("ru")} &middot; {p.viewCount || 0} просмотров</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Latest Glossary */}
        {latestTerms.length > 0 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: 0 }}>Новое в Глоссарии</h2>
              <a href="/glossary" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none", fontWeight: 600 }}>Все термины </a>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "var(--space-s)" }}>
              {latestTerms.map((t: any) => (
                <a key={t.slug} href={`/glossary/${t.slug}`} style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", textDecoration: "none", color: "inherit" }}>
                  <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, fontFamily: "var(--font-heading)", marginBottom: 2 }}>{t.term}</div>
                  <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", lineHeight: 1.4 }}>{t.simpleExplanation}</div>
                  <span style={{ fontSize: 10, color: t.level === "beginner" ? "#0fb880" : t.level === "intermediate" ? "#f59e0b" : "#ef4444" }}>{t.level}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Виджеты */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 var(--space-m) var(--space-xl)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "var(--space-xl)" }}>
        <BlueprintQuiz />
        <CostCalculator />
      </div>

      {/* Реквизиты */}
      <div style={{ padding: "var(--space-xl) var(--space-m)", background: "var(--color-bg-primary)", borderTop: "1px solid var(--color-border)", textAlign: "center" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", lineHeight: 1.8 }}>
          <div style={{ fontWeight: 700, marginBottom: 4, color: "var(--color-text-secondary)" }}>Реквизиты</div>
          <div>ИП Тимофеев Алексей Геннадьевич &middot; ИНН 532002912418</div>
          <div>Email: bilariuss@yandex.ru &middot; Telegram: @bilarius</div>
          <div style={{ marginTop: "var(--space-s)", display: "flex", gap: "var(--space-m)", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/privacy" style={{ color: "var(--color-text-tertiary)" }}>Политика</Link>
            <Link href="/terms" style={{ color: "var(--color-text-tertiary)" }}>Соглашение</Link>
            <Link href="/offer" style={{ color: "var(--color-text-tertiary)" }}>Оферта</Link>
            <Link href="/refund" style={{ color: "var(--color-text-tertiary)" }}>Возврат</Link>
            <Link href="/contacts" style={{ color: "var(--color-text-tertiary)" }}>Контакты</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

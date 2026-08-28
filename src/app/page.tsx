import { getDb } from "@/lib/db/index";
import AnimatedHero from "@/components/hero/animated-hero";
import Link from "next/link";
import { ArrowRight, Map, Bot, Rocket, Route, Sparkles, Boxes, Compass, Plus, Flame, Eye, Layers } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ProektMap — Карта роста и готовые AI-решения для создания продуктов",
  description: "Готовые инженерные маршруты, стек, промпты, Skills и практические шаги для создания веб-сервисов, Telegram-ботов и AI-ассистентов.",
  alternates: {
    canonical: "https://proektmap.ru",
  },
};

export default async function Home() {
  const db = await getDb();
  const latestPosts = await db.blogPost.findMany({ where: { status: "published" }, orderBy: { publishedAt: "desc" }, take: 3, select: { title: true, slug: true, excerpt: true, coverImage: true, publishedAt: true, viewCount: true } });
  const latestUsers = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: { id: true, name: true, email: true, avatar: true, createdAt: true, status: true, headline: true, role: true, publicProfile: true },
  });
  const latestProjects = await db.aiProject.findMany({
    where: { isPublished: true, moderationStatus: "approved" },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 6,
    include: {
      user: {
        select: { id: true, name: true, email: true, avatar: true, status: true, headline: true },
      },
    },
  });
  const popularPosts = await db.blogPost.findMany({ where: { status: "published" }, orderBy: { viewCount: "desc" }, take: 3, select: { title: true, slug: true, publishedAt: true, viewCount: true } });
  const latestTerms = await db.glossaryTerm.findMany({ where: { isPublished: true }, orderBy: { createdAt: "desc" }, take: 6, select: { term: true, slug: true, simpleExplanation: true, level: true } });

  return (
    <div className="home-page" style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-primary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>
      {/* Hero */}
      <AnimatedHero>
      <div className="home-hero-content" style={{ background: "transparent", padding: "80px 20px 50px", textAlign: "center" }}>
        <div className="home-hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: "var(--radius-full)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-m)" }}>
          <Sparkles size={14} /> Новый центр ProektMap
        </div>
        <h1 className="home-hero-title" style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, lineHeight: 1.05, marginBottom: "var(--space-s)", letterSpacing: "-0.02em" }}>
          Не изучайте AI бесконечно.<br />Соберите работающий продукт
        </h1>
        <p className="home-hero-lead" style={{ fontSize: "var(--text-l)", color: "var(--color-text-secondary)", maxWidth: 520, margin: "0 auto", lineHeight: 1.6 }}>
          ProektMap уже выбрал стек, программы, модели, команды и промпты. Выберите продукт и выполняйте готовый маршрут до production.
        </p>
        <div className="home-solution-flow" aria-label="Модель готового решения">
          {["Продукт", "Рекомендация", "Команда", "Результат", "Проверка"].map((step, index) => (
            <div key={step}>
              <span>{index + 1}</span>
              <strong>{step}</strong>
              {index < 4 && <ArrowRight size={13} aria-hidden />}
            </div>
          ))}
        </div>
        <div className="home-hero-actions" style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: "var(--space-xl)", flexWrap: "wrap" }}>
          <Link href="/resheniya" className="home-hero-action home-solutions-primary" style={{ display: "flex", alignItems: "center", gap: 8, padding: "17px 34px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-m)", fontWeight: 800 }}>
            Открыть готовые решения AI <ArrowRight size={18} />
          </Link>
          <Link href="/resheniya/saas-product" className="home-hero-action" style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 28px", borderRadius: "var(--radius-m)", background: "var(--color-surface)", color: "var(--color-accent)", border: "1px solid var(--color-accent)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
            Посмотреть маршрут SaaS
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
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-xs)" }}>Выберите результат</h3>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>Начните не с теории, а с конкретной цели: например, запустить SaaS с работающим сценарием и оплатой.</p>
          </div>
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "var(--space-xl)", textAlign: "center", position: "relative" }}>
            <div style={{ position: "absolute", top: 12, left: 16, fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}>2</div>
            <Bot size={36} style={{ color: "var(--color-accent)", marginBottom: "var(--space-s)" }} />
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-xs)" }}>Сделайте и докажите</h3>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>Каждый этап заканчивается артефактом и проверками. Прогресс растёт только после доказанного результата.</p>
          </div>
          <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", padding: "var(--space-xl)", textAlign: "center", position: "relative" }}>
            <div style={{ position: "absolute", top: 12, left: 16, fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}>3</div>
            <Rocket size={36} style={{ color: "var(--color-accent)", marginBottom: "var(--space-s)" }} />
            <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-xs)" }}>Получите продукт</h3>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>На финише остаются работающий продукт, принятые решения, файлы и проверяемый внешний сигнал.</p>
          </div>
        </div>
      </div>

      {/* Точки входа */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 var(--space-m) var(--space-xl)" }}>
        <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 700, textAlign: "center", marginBottom: "var(--space-l)", letterSpacing: "-0.01em" }}>
          Начните с подходящей точки
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-l)" }}>
          <Link href="/resheniya" style={{ textDecoration: "none", color: "inherit", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderTop: "4px solid var(--color-accent)", padding: "var(--space-xl)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "var(--space-m)" }}>
              <div style={{ width: 48, height: 48, background: "var(--color-accent)", borderRadius: "var(--radius-s)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Route size={22} /></div>
              <div><div style={{ fontSize: "var(--text-s)", fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: 2 }}>Пройти готовый маршрут</div><div style={{ fontSize: 11, color: "var(--color-accent)", fontWeight: 700 }}>SaaS или Telegram-бот</div></div>
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7, flex: 1, marginBottom: "var(--space-m)" }}>В SaaS-маршруте программа, модели, стек, GitHub, авторизация, AI, оплата и deploy уже разложены по готовым шагам.</p>
            <div style={{ marginTop: "auto", fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)", fontFamily: "var(--font-heading)" }}>2 МАРШРУТА → ПРОВЕРЕННЫЙ РЕЗУЛЬТАТ</div>
          </Link>
          <Link href="/architect" style={{ textDecoration: "none", color: "inherit", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderTop: "4px solid #8b5cf6", padding: "var(--space-xl)", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "var(--space-m)" }}>
              <div style={{ width: 48, height: 48, background: "#8b5cf6", borderRadius: "var(--radius-s)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}><Compass size={22} /></div>
              <div><div style={{ fontSize: "var(--text-s)", fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: 2 }}>Спроектировать свою идею</div><div style={{ fontSize: 11, color: "#8b5cf6", fontWeight: 700 }}>AI-Архитектор</div></div>
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7, flex: 1, marginBottom: "var(--space-m)" }}>Опишите идею и получите сущности, стек, паттерны, MCP, стоимость и план реализации.</p>
            <div style={{ marginTop: "auto", fontSize: "var(--text-xs)", fontWeight: 700, color: "#8b5cf6", fontFamily: "var(--font-heading)" }}>ИДЕЯ → ТЕХНИЧЕСКАЯ КАРТА</div>
          </Link>
        </div>
      </div>

      {/* Ecosystem Banner */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 var(--space-m) var(--space-m)" }}>
        <Link href="/sitemap" style={{ display: "flex", alignItems: "center", gap: "var(--space-m)", padding: "var(--space-l)", background: "var(--color-accent-light)", border: "1px solid var(--color-accent)", borderLeft: "4px solid var(--color-accent)", textDecoration: "none", color: "inherit" }}>
          <Boxes size={24} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Экосистема вокруг результата</div>
            <div style={{ fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)" }}>Полная карта сайта — все разделы деревом</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: 2 }}>Открывайте ветки, ищите по названию или URL и сразу переходите на нужную страницу</div>
          </div>
          <ArrowRight size={20} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
        </Link>
      </div>

      {/* Search */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", textAlign: "center" }}>
        <div style={{ fontSize: "var(--text-m)", fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: "var(--space-m)" }}>
          Найди термин, паттерн или инструмент
        </div>
        <form action="/search" method="GET" className="home-search-form" style={{ display: "flex", gap: 0, maxWidth: 500, margin: "0 auto", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
          <input name="q" placeholder="RAG, MCP, Prisma, SEO Аудитор..." style={{ flex: 1, padding: "14px 20px", fontSize: "var(--text-m)", border: "2px solid var(--color-border)", borderRight: "none", background: "var(--color-bg-primary)", outline: "none", color: "var(--color-text-primary)", boxSizing: "border-box" }} />
          <button type="submit" style={{ padding: "14px 24px", border: "none", background: "var(--color-accent)", color: "white", fontWeight: 700, fontSize: "var(--text-s)", cursor: "pointer" }}> Найти</button>
        </form>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: "var(--space-m)", flexWrap: "wrap", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
          Часто ищут: <a href="/search?q=MCP" style={{ color: "var(--color-accent)", textDecoration: "none" }}>MCP</a> <a href="/search?q=RAG" style={{ color: "var(--color-accent)", textDecoration: "none" }}>RAG</a> <a href="/search?q=Prisma" style={{ color: "var(--color-accent)", textDecoration: "none" }}>Prisma</a> <a href="/search?q=SEO" style={{ color: "var(--color-accent)", textDecoration: "none" }}>SEO</a>
        </div>
      </div>

      {/* Behance-Style AI Showcase & Community Portfolio */}
      {latestProjects.length > 0 && (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 var(--space-m) var(--space-xxl)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                <Sparkles size={13} /> Портфолио вайбкодеров
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-xl)", fontWeight: 800, margin: 0, letterSpacing: "-0.01em" }}>
                Свежие работы сообщества
              </h2>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Link
                href="/projects/new"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 6,
                  background: "var(--color-accent)",
                  color: "#fff",
                  textDecoration: "none",
                  fontSize: "var(--text-xs)",
                  fontWeight: 700,
                }}
              >
                <Plus size={14} /> Загрузить работу
              </Link>
              <Link
                href="/ai-workshop"
                style={{
                  fontSize: "var(--text-xs)",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Все кейсы ({latestProjects.length}) →
              </Link>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-l)" }}>
            {latestProjects.map((p: any) => {
              const authorName = p.user?.name || p.authorName || "Вайбкодер";
              const authorAvatar = p.user?.avatar || p.authorAvatar || "";
              const authorProfileUrl = p.userId ? `/profile/${p.userId}` : p.authorUrl || "#";
              const aiList = (p.aiTools || "").split(",").map((s: string) => s.trim()).filter(Boolean);

              return (
                <div
                  key={p.id}
                  style={{
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius-m)",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Image Cover */}
                  <Link
                    href={`/ai-workshop/${p.slug}`}
                    style={{
                      display: "block",
                      width: "100%",
                      aspectRatio: "16/10",
                      background: p.screenshot ? `url(${p.screenshot}) center/cover` : "linear-gradient(135deg, #0f172a, #1e293b)",
                      position: "relative",
                      textDecoration: "none",
                    }}
                  >
                    {!p.screenshot && (
                      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.7)", textAlign: "center", padding: 16 }}>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{p.title}</div>
                      </div>
                    )}
                    <span
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        padding: "2px 8px",
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        background: "rgba(0,0,0,0.7)",
                        color: "#fff",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      {p.category}
                    </span>
                  </Link>

                  {/* Body */}
                  <div style={{ padding: "16px", display: "flex", flexDirection: "column", flex: 1 }}>
                    <Link
                      href={`/ai-workshop/${p.slug}`}
                      style={{ textDecoration: "none", color: "inherit", marginBottom: 6 }}
                    >
                      <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
                        {p.title}
                      </h3>
                    </Link>

                    <p style={{ fontSize: 11, color: "var(--color-text-secondary)", lineHeight: 1.5, margin: "0 0 12px", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {p.description}
                    </p>

                    {/* AI Tools */}
                    {aiList.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                        {aiList.slice(0, 2).map((t: string) => (
                          <span key={t} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 3, background: "rgba(15, 184, 128, 0.08)", color: "var(--color-accent)" }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Author & Stats Footer */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--color-border)", paddingTop: 10, marginTop: "auto" }}>
                      <Link
                        href={authorProfileUrl}
                        style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "inherit", minWidth: 0 }}
                      >
                        <div
                          style={{
                            width: 26,
                            height: 26,
                            borderRadius: "50%",
                            background: authorAvatar ? `url(${authorAvatar}) center/cover` : "var(--color-bg-secondary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {!authorAvatar && authorName[0].toUpperCase()}
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {authorName}
                        </span>
                      </Link>

                      <div style={{ display: "flex", gap: 8, fontSize: 11, color: "var(--color-text-tertiary)", flexShrink: 0 }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <Flame size={12} color="#ef4444" /> {p.likesCount || 0}
                        </span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}>
                          <Eye size={12} /> {p.viewCount || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

        {/* Latest Users */}
        {latestUsers.length > 0 && (
          <div style={{ marginBottom: "var(--space-xl)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: 0 }}>
                Новые участники и вайбкодеры
              </h2>
              <Link href="/specialists" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none", fontWeight: 600 }}>
                Все специалисты ({latestUsers.length}) →
              </Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-m)" }}>
              {latestUsers.map((u: any) => (
                <Link key={u.id} href={`/profile/${u.id}`} style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "var(--space-m)" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "var(--radius-full)", background: u.avatar ? `url(${u.avatar}) center/cover` : "var(--color-bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0, border: "1px solid var(--color-border)" }}>
                    {!u.avatar && (u.name?.[0] || u.email[0]).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "var(--text-xs)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {u.name || u.email.split("@")[0]}
                    </div>
                    <div style={{ fontSize: 10, color: "var(--color-accent)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {u.headline || (u.status === "architect" ? "AI-Архитектор" : "Вайбкодер")}
                    </div>
                  </div>
                </Link>
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

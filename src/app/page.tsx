import { db } from "@/lib/db";
import Link from "next/link";

export default async function Home() {
  const blueprints = await db.blueprint.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fafafa", color: "#222", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ height: 72, background: "white", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", borderBottom: "1px solid #ececec", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>
          Engineering <span style={{ color: "#0FB880" }}>Blueprint</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#e5e7eb" }} />
        </div>
      </header>

      {/* Empty dashboard or blueprint list */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "60px 20px" }}>
        {blueprints.length === 0 ? (
          /* Пустой дашборд */
          <div style={{ textAlign: "center", paddingTop: 100 }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%", background: "#0FB880",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              marginBottom: 24, cursor: "pointer", transition: "transform 0.2s",
              boxShadow: "0 4px 20px rgba(15,184,128,0.3)",
            }}>
              <span style={{ color: "white", fontSize: 40, fontWeight: 300, lineHeight: 1 }}>+</span>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Выберите проект</h1>
            <p style={{ fontSize: 16, color: "#888", lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>
              Какое инженерное знание вы хотели бы получить?
              Выберите шаблон и пройдите путь от идеи до готового продукта.
            </p>
          </div>
        ) : (
          /* Список Blueprint'ов */
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>Выберите проект</h1>
            <p style={{ fontSize: 16, color: "#888", marginBottom: 32 }}>
              Какое инженерное знание вы хотели бы получить?
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {blueprints.map(bp => (
                <Link key={bp.id} href={`/${bp.slug}`}
                  style={{
                    display: "flex", alignItems: "center", gap: 16,
                    padding: "24px 28px", background: "white", borderRadius: 18,
                    border: "1px solid #ececec", textDecoration: "none", color: "#222",
                    transition: "box-shadow 0.2s, border-color 0.2s",
                  }}
                  onMouseOver={e => { e.currentTarget.style.borderColor = "#0FB880"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,184,128,0.1)"; }}
                  onMouseOut={e => { e.currentTarget.style.borderColor = "#ececec"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: "#eef3ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, flexShrink: 0 }}>
                    🌐
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>{bp.title}</div>
                    <div style={{ fontSize: 14, color: "#888" }}>{bp.description}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontWeight: 700, color: "#0FB880", fontSize: 16 }}>{bp.totalXp} XP</div>
                    <div style={{ fontSize: 13, color: "#aaa" }}>{bp.totalCards} карточек</div>
                  </div>
                  <span style={{ color: "#0FB880", fontSize: 20 }}>→</span>
                </Link>
              ))}

              {/* Кнопка добавить новый */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "20px", border: "2px dashed #d1d5db", borderRadius: 18,
                color: "#aaa", fontSize: 15, cursor: "pointer", marginTop: 8,
              }}>
                <span style={{ fontSize: 24, lineHeight: 1 }}>+</span>
                <span>Новый проект (скоро)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "32px 20px", borderTop: "1px solid #ececec", marginTop: 40 }}>
        <div style={{ fontSize: 14, color: "#aaa", marginBottom: 8 }}>
          Engineering Blueprint © 2026
        </div>
        <div style={{ display: "flex", gap: 20, justifyContent: "center", fontSize: 13 }}>
          <a href="#" style={{ color: "#888", textDecoration: "none" }}>Политика конфиденциальности</a>
          <a href="#" style={{ color: "#888", textDecoration: "none" }}>Условия использования</a>
          <a href="/admin" style={{ color: "#888", textDecoration: "none" }}>Админка</a>
        </div>
      </footer>
    </div>
  );
}

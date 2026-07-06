export default function Home() {
  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fafafa", color: "#222", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ height: 72, background: "white", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", borderBottom: "1px solid #ececec", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ fontSize: 22, fontWeight: 800 }}>
          Engineering <span style={{ color: "#0FB880" }}>Blueprint</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <div style={{ textAlign: "right" }}>
            <strong>Маршрут</strong><br />
            <small style={{ color: "#888" }}>Корпоративный сайт</small>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#e5e7eb" }} />
        </div>
      </header>

      {/* Wrapper */}
      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <aside style={{ width: 310, background: "white", borderRight: "1px solid #ececec", minHeight: "calc(100vh - 72px)", padding: 35 }}>
          <h3 style={{ marginBottom: 20, fontSize: 14, color: "#777", textTransform: "uppercase", letterSpacing: "0.08em" }}>Путь проекта</h3>

          {[
            { n: "1", t: "Фундамент", d: "Определяем будущий проект", active: true },
            { n: "2", t: "Контент", d: "Структура сайта" },
            { n: "3", t: "Design System", d: "Создаем основу интерфейса" },
            { n: "4", t: "UI Kit", d: "Компоненты" },
            { n: "5", t: "Frontend", d: "Генерация проекта" },
            { n: "6", t: "Backend", d: "Если необходим" },
            { n: "7", t: "SEO", d: "" },
            { n: "8", t: "Deploy", d: "" },
            { n: "9", t: "Поддержка", d: "" },
          ].map((step) => (
            <div key={step.n} style={{
              padding: 15, borderRadius: 14, marginBottom: 10, cursor: "pointer",
              background: step.active ? "#eef3ff" : "transparent",
              border: step.active ? "1px solid #d8e2ff" : "1px solid transparent",
              transition: ".2s",
            }}>
              <strong style={{ display: "block", marginBottom: 5, color: step.active ? "#0FB880" : "#222" }}>
                {step.n}. {step.t}
              </strong>
              {step.d && <small style={{ color: "#888" }}>{step.d}</small>}
            </div>
          ))}

          {/* XP Stats */}
          <div style={{ marginTop: 30, padding: "16px", borderRadius: 14, background: "#f8f8f8" }}>
            <strong style={{ display: "block", marginBottom: 8, fontSize: 13 }}>Прогресс</strong>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
              <span style={{ color: "#666" }}>XP</span>
              <span style={{ fontWeight: 700, color: "#0FB880" }}>250</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
              <span style={{ color: "#666" }}>Уровень</span>
              <span style={{ fontWeight: 600 }}>🥈 Практик</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#666" }}>Streak</span>
              <span style={{ fontWeight: 600 }}>🔥 3 дня</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: "60px", maxWidth: 1200 }}>
          {/* Progress */}
          <div style={{ height: 8, background: "#ececec", borderRadius: 30, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ width: "18%", height: "100%", background: "#0FB880", borderRadius: 30, transition: "width 0.6s ease" }} />
          </div>

          <div style={{ display: "inline-block", padding: "8px 16px", borderRadius: 30, background: "#eef3ff", color: "#0FB880", fontSize: 13, marginBottom: 18 }}>
            Blueprint • Корпоративный сайт
          </div>

          <h1 style={{ fontSize: 44, marginBottom: 18, fontWeight: 800, lineHeight: 1.15 }}>
            Этап 1. Фундамент проекта
          </h1>

          <p style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 900, color: "#555", marginBottom: 50 }}>
            Не открывайте Cursor, VS Code или любой другой редактор кода.
            Хороший проект начинается не с программирования, а с принятия нескольких важных инженерных решений.
            Сейчас мы заложим фундамент, который сэкономит десятки часов в будущем.
          </p>

          {/* Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 35 }}>
            {/* Left: Cards */}
            <div>
              <div style={{ background: "white", borderRadius: 22, padding: 35, border: "1px solid #ececec", marginBottom: 25 }}>
                <h2 style={{ fontSize: 26, marginBottom: 20 }}>Что нужно сделать</h2>

                <div style={{ marginTop: 25 }}>
                  {[
                    "Определить цель сайта",
                    "Определить целевую аудиторию",
                    "Составить карту страниц",
                    "Подготовить структуру блоков",
                    "Определить необходимые интеграции",
                  ].map((task, i) => (
                    <div key={i} style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "14px 0", borderBottom: i < 4 ? "1px solid #f2f2f2" : "none",
                    }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", border: "2px solid #0FB880", flexShrink: 0 }} />
                      <span style={{ fontSize: 16 }}>{task}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: "#FFF9EA", border: "1px solid #FFE29A", padding: 20, borderRadius: 16, marginTop: 25 }}>
                  <strong style={{ display: "block", marginBottom: 8 }}>Почему это важно?</strong>
                  <p style={{ lineHeight: 1.8, color: "#666", fontSize: 15 }}>
                    90% новичков начинают писать код сразу. Через несколько часов они понимают,
                    что структура проекта постоянно меняется. Мы сначала принимаем инженерные решения,
                    и только потом начинаем разработку.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: AI + Info */}
            <div>
              <div style={{ background: "white", padding: 28, borderRadius: 22, border: "1px solid #ececec", marginBottom: 20 }}>
                <h3 style={{ marginBottom: 15 }}>🤖 AI Архитектор</h3>
                <p style={{ lineHeight: 1.7, color: "#666", fontSize: 15, marginBottom: 20 }}>
                  Я буду сопровождать вас на протяжении всего проекта. Моя задача — не писать код вместо вас,
                  а помогать принимать правильные инженерные решения.
                </p>
                <button style={{
                  display: "block", width: "100%", padding: 18, background: "#0FB880", color: "white",
                  border: "none", borderRadius: 14, fontSize: 16, fontWeight: 600, cursor: "pointer",
                }}>
                  Начать этап →
                </button>
                <div style={{ padding: 15, background: "#F8F8F8", borderRadius: 14, marginTop: 15, fontSize: 14, lineHeight: 1.6, color: "#666" }}>
                  💡 <strong>Совет:</strong> не пытайтесь сделать всё идеально с первого раза. Инженерные решения можно уточнять по мере движения.
                </div>
              </div>

              <div style={{ background: "white", padding: 28, borderRadius: 22, border: "1px solid #ececec", marginBottom: 20 }}>
                <h3 style={{ marginBottom: 15 }}>После завершения этапа</h3>
                <div style={{ lineHeight: 2.2, color: "#444", fontSize: 15 }}>
                  ✔ Карта страниц<br />
                  ✔ Структура проекта<br />
                  ✔ Техническое задание<br />
                  ✔ Промпт для AI
                </div>
              </div>

              <div style={{ padding: 18, background: "#eef3ff", borderRadius: 14 }}>
                <strong style={{ display: "block", marginBottom: 8 }}>Следующий этап</strong>
                <span style={{ color: "#666" }}>Создание Design System и Design Tokens</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

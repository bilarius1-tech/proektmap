export const metadata = { title: "Windows 98 — демо стиля" };

export default function Win98Demo() {
  return (
    <div style={{ fontFamily: "'MS Sans Serif', 'Trebuchet MS', sans-serif", background: "#008080", color: "#000", minHeight: "100vh", fontSize: 14 }}>
      {/* Desktop */}
      <div style={{ padding: 20, minHeight: "100vh" }}>

        {/* Window — main */}
        <div style={{
          maxWidth: 800, margin: "0 auto",
          border: "2px solid", borderColor: "#dfdfdf #0a0a0a #0a0a0a #dfdfdf",
          background: "#c0c0c0", boxShadow: "inset 1px 1px 0 #fff, inset -1px -1px 0 #808080",
        }}>
          {/* Title bar */}
          <div style={{
            background: "linear-gradient(90deg, #000080, #1084d0)", color: "white",
            padding: "2px 4px", display: "flex", justifyContent: "space-between", alignItems: "center",
            fontSize: 12, fontWeight: "bold",
          }}>
            <span>ProektMap — Карта роста</span>
            <div style={{ display: "flex", gap: 2 }}>
              <button style={{ width: 16, height: 14, border: "1px solid #fff", borderColor: "#fff #808080 #808080 #fff", background: "#c0c0c0", padding: 0, fontSize: 9, lineHeight: 1, cursor: "pointer" }}>─</button>
              <button style={{ width: 16, height: 14, border: "1px solid #fff", borderColor: "#fff #808080 #808080 #fff", background: "#c0c0c0", padding: 0, fontSize: 9, lineHeight: 1, cursor: "pointer" }}>□</button>
              <button style={{ width: 16, height: 14, border: "1px solid #fff", borderColor: "#fff #808080 #808080 #fff", background: "#c0c0c0", padding: 0, fontSize: 9, lineHeight: 1, cursor: "pointer" }}>✕</button>
            </div>
          </div>

          {/* Menu bar */}
          <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #808080", padding: "1px 0", background: "#c0c0c0" }}>
            {["Файл", "Правка", "Вид", "Путь", "Блог", "Справка"].map(m => (
              <span key={m} style={{ padding: "2px 8px", fontSize: 12, cursor: "pointer" }}>{m}</span>
            ))}
          </div>

          {/* Content */}
          <div style={{ padding: 16, background: "#fff", border: "2px solid", borderColor: "#808080 #dfdfdf #dfdfdf #808080", margin: 4 }}>
            
            {/* Hero — chunky */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 10, color: "#808080", marginBottom: 4, fontFamily: "monospace" }}>C:\PROEKTMAP\README.TXT</div>
              <h1 style={{ fontSize: 20, fontWeight: "bold", marginBottom: 8, fontFamily: "'Times New Roman', serif" }}>
                Карта роста <span style={{ color: "#e5533c" }}>v1.0</span>
              </h1>
              <p style={{ fontSize: 12, lineHeight: 1.6, color: "#333", marginBottom: 12, borderLeft: "3px solid #c0c0c0", paddingLeft: 8 }}>
                Инженерный навигатор для тех кто строит проекты с помощью AI. Без курсов, без лекций — только практика.
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{
                  padding: "4px 16px", border: "2px solid", borderColor: "#dfdfdf #0a0a0a #0a0a0a #dfdfdf",
                  background: "#c0c0c0", fontSize: 12, fontWeight: "bold", cursor: "pointer",
                }}>▶ Начать путь</button>
                <button style={{
                  padding: "4px 16px", border: "2px solid", borderColor: "#dfdfdf #0a0a0a #0a0a0a #dfdfdf",
                  background: "#c0c0c0", fontSize: 12, cursor: "pointer",
                }}>Pro — 300₽/мес</button>
              </div>
            </div>

            {/* Stats — chunky boxes */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4, marginBottom: 16 }}>
              {[
                { value: "203", label: "Решений" },
                { value: "2,795", label: "XP" },
                { value: "94", label: "Терминов" },
                { value: "3", label: "Blueprint'а" },
              ].map(s => (
                <div key={s.label} style={{
                  border: "2px solid", borderColor: "#808080 #dfdfdf #dfdfdf #808080",
                  padding: "8px", textAlign: "center", background: "#fff",
                }}>
                  <div style={{ fontSize: 18, fontWeight: "bold", fontFamily: "monospace" }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "#808080", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Blueprints — folder-like */}
            <div style={{ fontSize: 11, fontWeight: "bold", marginBottom: 6, fontFamily: "monospace" }}>📁 C:\PROEKTMAP\BLUEPRINTS\</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { title: "Корпоративный сайт.exe", desc: "От домена до запуска", size: "1140 XP" },
                { title: "SaaS-продукт.exe", desc: "От идеи до клиентов", size: "875 XP" },
                { title: "Разработка игры.exe", desc: "Godot + AI → Яндекс.Игры", size: "780 XP" },
              ].map(bp => (
                <div key={bp.title} style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "6px 8px",
                  border: "1px dotted #808080", background: "#fff", cursor: "pointer",
                }}>
                  <span style={{ fontSize: 16 }}>📄</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: "bold" }}>{bp.title}</div>
                    <div style={{ fontSize: 10, color: "#808080" }}>{bp.desc}</div>
                  </div>
                  <div style={{ fontSize: 10, fontFamily: "monospace", color: "#808080" }}>{bp.size}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Status bar */}
          <div style={{
            display: "flex", gap: 4, padding: "2px 4px", fontSize: 10,
            border: "2px solid", borderColor: "#808080 #dfdfdf #dfdfdf #808080",
            background: "#c0c0c0", margin: "0 4px 4px",
          }}>
            <span>🟢 Online</span>
            <span style={{ marginLeft: "auto" }}>C:\PROEKTMAP\</span>
          </div>
        </div>

        {/* Desktop icons */}
        <div style={{ position: "fixed", top: 20, left: 20, color: "white", fontSize: 11, textAlign: "center" }}>
          <div style={{ marginBottom: 16 }}>🖥️<br/>Мой<br/>компьютер</div>
          <div style={{ marginBottom: 16 }}>📁<br/>Мои<br/>проекты</div>
          <div style={{ marginBottom: 16 }}>🗑️<br/>Корзина</div>
        </div>
      </div>
    </div>
  );
}

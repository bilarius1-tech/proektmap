export default function AIRules() {
  return (
    <div style={{
      padding: "var(--space-l)", background: "var(--color-accent-light)",
      borderRadius: "var(--radius-l)", border: "1px solid var(--color-accent)",
      marginBottom: "var(--space-l)",
    }}>
      <div style={{ fontWeight: 800, fontSize: "var(--text-m)", marginBottom: "var(--space-s)", color: "var(--color-accent)" }}>
        📐 Правила работы с AI
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: "var(--space-s)" }}>
        {[
          { emoji: "🧠", title: "Планируй до кода", text: "Сначала структура данных и страниц. Код — последний шаг." },
          { emoji: "📂", title: "Memory Bank", text: "Создай 5 файлов. AI читает их между сессиями." },
          { emoji: "🗣", title: "Пиши промпты", text: "Не «сделай сайт». А «Next.js проект с формами и 3 страницами»." },
          { emoji: "✅", title: "Проверяй", text: "AI ошибается. Проверяй каждый шаг." },
          { emoji: "🔄", title: "Итерация", text: "Не вышло? Уточни промпт. Это нормально." },
        ].map((rule, i) => (
          <div key={i} style={{
            padding: "var(--space-m)", background: "var(--color-bg-primary)",
            borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)",
          }}>
            <div style={{ fontSize: "var(--text-l)", marginBottom: "var(--space-xs)" }}>{rule.emoji}</div>
            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-2xs)" }}>{rule.title}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{rule.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

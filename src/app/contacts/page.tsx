export const metadata = {
  title: "Контакты — Карта роста",
  description: "ИП Тимофеев А.Г., ИНН 532002912418. Свяжитесь с нами.",
};

export default function ContactsPage() {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", lineHeight: 1.8, fontSize: "var(--text-s)" }}>
      <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 800, marginBottom: "var(--space-l)" }}>Контакты и реквизиты</h1>

      <div style={{ padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)", marginBottom: "var(--space-l)" }}>
        <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>Реквизиты</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <div><b>Исполнитель:</b> Индивидуальный предприниматель Тимофеев Алексей Геннадьевич</div>
          <div><b>ИНН:</b> 532002912418</div>
          <div><b>Юридический адрес:</b> РФ, Новгородская область</div>
          <div><b>Email:</b> bilariuss@yandex.ru</div>
          <div><b>Telegram:</b> @bilarius</div>
          <div><b>Телефон:</b> +7 921 201-32-52</div>
          <div><b>Сайт:</b> proektmap.ru</div>
        </div>
      </div>

      <div style={{ padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)" }}>
        <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>Связь с нами</h2>
        <p>По всем вопросам: <a href="mailto:bilariuss@yandex.ru" style={{ color: "var(--color-accent)" }}>bilariuss@yandex.ru</a></p>
        <p>Telegram: <a href="https://t.me/bilarius" style={{ color: "var(--color-accent)" }}>@bilarius</a></p>
        <p>Время ответа: до 24 часов в будние дни.</p>
        <div style={{ marginTop: "var(--space-m)", padding: "var(--space-m)", background: "var(--color-accent-light)", borderRadius: "var(--radius-m)", fontSize: "var(--text-xs)" }}>
          <b>Для возвратов:</b> напишите на bilariuss@yandex.ru с темой «Возврат», указав email аккаунта и дату платежа. Подробнее — в <a href="/refund" style={{ color: "var(--color-accent)" }}>Условиях возврата</a>.
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Публичная оферта — Карта роста",
  description: "Договор-оферта на оказание услуг. ИП Тимофеев А.Г., ИНН 532002912418.",
};

export default function OfferPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", lineHeight: 1.8, fontSize: "var(--text-s)" }}>
      <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-l)" }}>Публичная оферта</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-l)" }}>Дата публикации: 8 июля 2026 г.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>1. Термины</h2>
      <p><b>Исполнитель:</b> ИП Тимофеев Алексей Геннадьевич, ИНН 532002912418.<br />
      <b>Заказчик:</b> лицо, оплатившее подписку Pro на сайте proektmap.ru.<br />
      <b>Сервис:</b> «Карта роста» — платформа для обучения AI-инжинирингу.</p>
      <p>Оплата подписки Pro является акцептом настоящей оферты (ст. 438 ГК РФ).</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>2. Предмет договора</h2>
      <p>Исполнитель предоставляет Заказчику доступ к расширенным функциям сервиса «Карта роста» на условиях подписки Pro.</p>
      <p><b>Состав подписки Pro:</b> неограниченный доступ к AI-консультанту, полная библиотека промптов, приоритетная поддержка, доступ ко всем Blueprint'ам.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>3. Стоимость и порядок оплаты</h2>
      <p>Стоимость подписки Pro: 300 ₽/мес. Оплата производится через ЮKassa. Подписка продлевается автоматически ежемесячно.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>4. Срок действия</h2>
      <p>Договор вступает в силу с момента оплаты и действует до окончания оплаченного периода. Автопродление — до отмены Заказчиком.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>5. Реквизиты Исполнителя</h2>
      <p>ИП Тимофеев Алексей Геннадьевич<br />
      ИНН 532002912418<br />
      Email: bilariuss@yandex.ru<br />
      Telegram: @bilarius<br />
      Сайт: https://proektmap.ru</p>
    </div>
  );
}

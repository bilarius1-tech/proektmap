export const metadata = {
  title: "Пользовательское соглашение — Карта роста",
  description: "Правила использования сервиса Карта роста. ИП Тимофеев А.Г.",
};

export default function TermsPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", lineHeight: 1.8, fontSize: "var(--text-s)" }}>
      <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-l)" }}>Пользовательское соглашение</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-l)" }}>Дата обновления: 8 июля 2026 г.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>1. Предмет соглашения</h2>
      <p>Настоящее соглашение регулирует использование сервиса «Карта роста» (proektmap.ru). Используя сервис, вы принимаете условия соглашения.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>2. Услуги</h2>
      <p>Сервис предоставляет: доступ к Blueprint'ам (пошаговым руководствам), AI-консультанту, библиотеке промптов. Часть функций доступна бесплатно, часть — по подписке Pro (300 ₽/мес).</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>3. Права и обязанности</h2>
      <p><b>Пользователь обязуется:</b> не передавать свой аккаунт третьим лицам, не использовать сервис для незаконной деятельности, не копировать контент без разрешения.</p>
      <p><b>Сервис обязуется:</b> обеспечивать доступ 24/7, уведомлять о плановых работах, хранить данные в РФ.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>4. Оплата и возврат</h2>
      <p>Подписка Pro: 300 ₽/мес. Отключение — в любой момент в личном кабинете. Возврат за текущий месяц не производится. Подробнее — в <a href="/refund" style={{ color: "var(--color-accent)" }}>Условиях возврата</a>.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>5. Ответственность</h2>
      <p>Сервис предоставляется «как есть». Мы не гарантируем 100% точность AI-рекомендаций. Пользователь сам принимает решение о применении полученных знаний.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>6. Применимое право</h2>
      <p>Настоящее соглашение регулируется законодательством Российской Федерации. Споры решаются в досудебном порядке. Email: bilariuss@yandex.ru.</p>
    </div>
  );
}

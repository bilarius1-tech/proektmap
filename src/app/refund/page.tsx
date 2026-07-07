export const metadata = {
  title: "Условия возврата — Карта роста",
  description: "Порядок возврата средств за подписку Pro. ИП Тимофеев А.Г.",
};

export default function RefundPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", lineHeight: 1.8, fontSize: "var(--text-s)" }}>
      <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-l)" }}>Условия возврата</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-l)" }}>Дата обновления: 8 июля 2026 г.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>1. Подписка Pro</h2>
      <p>Стоимость: 300 ₽/мес. Подписка продлевается автоматически. Отключить автопродление можно в личном кабинете в любой момент.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>2. Возврат средств</h2>
      <p>Возврат возможен в течение 3 дней с момента оплаты, если сервис не был использован. Для запроса возврата напишите на <a href="mailto:bilariuss@yandex.ru" style={{ color: "var(--color-accent)" }}>bilariuss@yandex.ru</a> с указанием: email аккаунта, даты платежа, причины.</p>
      <p>Срок возврата: до 10 рабочих дней с момента получения запроса.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>3. Когда возврат невозможен</h2>
      <p>Возврат не производится: после истечения 3 дней с момента оплаты, если сервис активно использовался (пройдено более 3 этапов), за уже истекший оплаченный период.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>4. Контакты</h2>
      <p>ИП Тимофеев Алексей Геннадьевич, ИНН 532002912418<br />
      Email: bilariuss@yandex.ru<br />
      Telegram: @bilarius</p>
    </div>
  );
}

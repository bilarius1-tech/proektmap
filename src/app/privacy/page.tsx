export const metadata = {
  title: "Политика конфиденциальности — Карта роста",
  description: "Политика обработки персональных данных. ИП Тимофеев А.Г., ИНН 532002912418.",
};

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", lineHeight: 1.8, fontSize: "var(--text-s)" }}>
      <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-l)" }}>Политика конфиденциальности</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-l)" }}>Дата обновления: 8 июля 2026 г.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>1. Общие положения</h2>
      <p>Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта <b>proektmap.ru</b> («Карта роста»).</p>
      <p><b>Оператор персональных данных:</b> Индивидуальный предприниматель Тимофеев Алексей Геннадьевич, ИНН 532002912418, email: bilariuss@yandex.ru.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>2. Какие данные собираем</h2>
      <p>При регистрации и использовании сервиса мы можем собирать:</p>
      <ul style={{ paddingLeft: 20, marginBottom: "var(--space-m)" }}>
        <li>Имя и email — при регистрации через Яндекс или email/пароль</li>
        <li>Данные о прогрессе — какие этапы пройдены, какие решения приняты</li>
        <li>Технические данные — IP-адрес, тип браузера, файлы cookie</li>
      </ul>
      <p>Мы <b>не собираем</b> платёжные данные — они обрабатываются ЮKassa напрямую.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>3. Цели обработки</h2>
      <ul style={{ paddingLeft: 20, marginBottom: "var(--space-m)" }}>
        <li>Предоставление доступа к сервису «Карта роста»</li>
        <li>Сохранение прогресса обучения</li>
        <li>Отправка уведомлений об изменениях в сервисе</li>
        <li>Улучшение качества сервиса</li>
      </ul>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>4. Хранение данных</h2>
      <p>Данные хранятся на сервере на территории РФ (хостинг Beget). Срок хранения — пока вы пользуетесь сервисом + 1 год после удаления аккаунта.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>5. Передача третьим лицам</h2>
      <p>Мы <b>не передаём</b> персональные данные третьим лицам, кроме:</p>
      <ul style={{ paddingLeft: 20, marginBottom: "var(--space-m)" }}>
        <li>Яндекс OAuth — для авторизации</li>
        <li>ЮKassa — для обработки платежей</li>
        <li>OpenRouter / DeepSeek — для AI-функций (передаются только промпты, не персональные данные)</li>
      </ul>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>6. Ваши права</h2>
      <p>Вы имеете право: запросить свои данные, потребовать их удаления, отозвать согласие на обработку. Для этого напишите на <a href="mailto:bilariuss@yandex.ru" style={{ color: "var(--color-accent)" }}>bilariuss@yandex.ru</a>.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>7. Cookies</h2>
      <p>Мы используем cookies для: авторизации (сессия), аналитики (Яндекс.Метрика), сохранения настроек. Продолжая использовать сайт, вы соглашаетесь с этим.</p>

      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginTop: "var(--space-l)", marginBottom: "var(--space-s)" }}>8. Контакты</h2>
      <p>ИП Тимофеев А.Г., ИНН 532002912418<br />
      Email: <a href="mailto:bilariuss@yandex.ru" style={{ color: "var(--color-accent)" }}>bilariuss@yandex.ru</a><br />
      Telegram: <a href="https://t.me/bilarius" style={{ color: "var(--color-accent)" }}>@bilarius</a></p>
    </div>
  );
}

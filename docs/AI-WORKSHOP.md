# AI-WORKSHOP.md — AI Цех

> **Статус:** Архитектурный документ
> **Создан:** 31.07.2026
> **Для кого:** AI-агенты, разработчики, администраторы

---

## Что такое AI Цех

**AI Цех** — это витрина российских проектов, созданных с использованием AI-технологий. Раздел показывает реальные кейсы: что построено, каким стеком, с помощью каких AI-инструментов.

Цель: пользователь видит проект → вдохновляется → проходит Blueprint → строит свой.

---

## Философия

```
Увидел → Вдохновился → Построил
```

AI Цех — не просто каталог. Это генератор новых пользователей Blueprint'ов. Каждый проект в Цехе — это доказательство что «такой же можно сделать и ты».

---

## Модель данных

```prisma
model AiProject {
  id          String   @id @default(uuid())
  title       String                    // Название проекта
  slug        String   @unique          // URL-safe
  description String   @default("")     // Описание
  url         String   @default("")     // Ссылка на проект
  techStack   String   @default("")     // CSV: "aiogram,PostgreSQL,YandexGPT"
  aiTools     String   @default("")     // CSV: "Cursor,Claude"
  authorName  String   @default("")     // Автор
  authorUrl   String   @default("")     // Ссылка на автора
  screenshot  String   @default("")     // URL скриншота
  category    String   @default("Бот")  // Бот, Сайт, SaaS, Игра, Инструмент, Другое
  status      String   @default("Запущен") // Запущен, В разработке
  featured    Boolean  @default(false)  // В топ?
  viewCount   Int      @default(0)      // Счётчик просмотров
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("ai_projects")
}
```

### Почему techStack и aiTools — строки а не relations

Для MVP строки с запятыми проще и быстрее. При выводе на странице:
- Разбиваем по запятой
- Для каждого слова проверяем есть ли такой инструмент в `AITool`
- Если есть — делаем ссылкой на `/ai-tools/[slug]`
- Если нет — показываем как текст

Отношения через отдельные таблицы (`AiProjectTechnology[]`) — на v1.5.

---

## API

| Метод | Путь | Назначение | Авторизация |
|-------|------|-----------|------------|
| GET | `/api/admin/ai-projects` | Список проектов | admin |
| POST | `/api/admin/ai-projects` | Создать проект | admin |
| PUT | `/api/admin/ai-projects` | Обновить проект | admin |
| DELETE | `/api/admin/ai-projects?id=` | Удалить проект | admin |
| POST | `/api/admin/ai-projects/ai-fill` | AI-заполнение по URL | admin |

### AI-fill — как работает

1. Админ вставляет GitHub URL (или любой URL)
2. Если GitHub — используется GitHub API: название, описание, topics, README
3. Если другой URL — фетчится HTML, вырезаются теги, берётся текст
4. Текст отправляется в DeepSeek с промптом «заполни JSON-карточку проекта»
5. DeepSeek возвращает JSON: title, description, techStack, aiTools, authorName, category
6. Форма админки заполняется — админ проверяет и сохраняет

---

## Страницы

| Страница | Файл | Назначение |
|----------|------|-----------|
| `/ai-workshop` | `src/app/ai-workshop/page.tsx` | Каталог: сетка карточек с фото |
| `/ai-workshop/[slug]` | `src/app/ai-workshop/[slug]/page.tsx` | Детальная: скриншот, стек, AI-инструменты |
| `/admin/ai-projects` | `src/app/admin/ai-projects/page.tsx` | Админка: таблица, форма, AI-fill |

---

## Админка — как работать

### Добавить проект вручную:
1. `/admin/ai-projects` → «Новый проект»
2. Заполнить: название, slug, описание, URL, стек, AI-инструменты, автор, категория, скриншот
3. «Сохранить»

### Добавить проект через AI:
1. Вставить GitHub URL в поле «Добавить по ссылке»
2. «Заполнить через AI» → 10 секунд → форма заполнена
3. Проверить поля → «Сохранить»

### Скриншоты:
- Используется `ImagePicker` — можно выбрать из медиатеки или загрузить новый
- Медиатека: `/api/admin/media`

---

## Интеграция с экосистемой

Проект в AI Цехе содержит ссылки на:
- **AI-инструменты** — если `aiTools` содержит имя инструмента из каталога → кликабельная ссылка
- **Blueprint'ы** — в будущем: если стек совпадает с Blueprint'ом → рекомендация
- **Глоссарий** — технические термины из `techStack` могут ссылаться на глоссарий

---

## План развития

| Версия | Что |
|--------|-----|
| MVP (сейчас) | Модель, API, админка, каталог, страница проекта, AI-fill |
| v1.5 | Связи techStack → AITool через relation, авто-линковка на Blueprint |
| v2.0 | Форма «Предложить проект», модерация, авто-импорт с GitHub по расписанию |

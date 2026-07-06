# Architecture Handbook v1.0

> **Статус:** Инженерная архитектура проекта
> **Версия:** 1.0
> **Обновляется:** При изменении архитектуры
> **Связан с:** MANIFEST.md

---

## 1. Модель данных (Prisma)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  xp        Int      @default(0)
  level     String   @default("novice") // novice, practitioner, engineer, architect
  streak    Int      @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  projects  Project[]
  decisions Decision[]
}

model Project {
  id            String   @id @default(uuid())
  userId        String
  blueprintType String   // "corporate-website", "saas", "telegram-bot"...
  progress      Int      @default(0) // 0-100
  status        String   @default("active") // active, completed, archived
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  user   User     @relation(fields: [userId], references: [id])
  cards  Card[]
}

model Card {
  id        String   @id @default(uuid())
  projectId String
  phase     String   // structure, technology, implementation, launch
  cardKey   String   // design-tokens, framework-choice...
  title     String
  xpReward  Int      @default(15)
  status    String   @default("pending") // pending, done, skipped
  notes     String?
  createdAt DateTime @default(now())

  project Project @relation(fields: [projectId], references: [id])
  decision Decision?

  @@unique([projectId, cardKey])
}

model Decision {
  id        String   @id @default(uuid())
  userId    String
  cardId    String   @unique
  question  String
  answer    String
  aiAdvice  String?
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
  card Card @relation(fields: [cardId], references: [id])
}
```

## 2. Структура URL

```
/                         — Главная (список Blueprint'ов)
/[blueprint]              — Страница Blueprint'а
/[blueprint]/[card]       — Карточка с AI
/profile                  — Профиль пользователя
/api/auth/...             — NextAuth (Magic Link)
/api/ai/ask               — OpenRouter прокси
/api/progress              — Обновление прогресса
```

## 3. API

### POST /api/ai/ask
```json
{
  "cardKey": "design-tokens",
  "blueprint": "corporate-website",
  "question": "Почему CSS-переменные а не SCSS?"
}
→ { "advice": "...", "alternatives": [...] }
```

### POST /api/progress
```json
{
  "projectId": "...",
  "cardKey": "design-tokens",
  "status": "done"
}
→ { "ok": true, "xpGained": 20, "newLevel": "practitioner" }
```

## 4. Blueprint как данные

Blueprints хранятся как MDX файлы:

```
src/content/blueprints/
├── corporate-website/
│   ├── meta.json          ← название, описание, сложность
│   ├── 01-structure.mdx   ← Фаза 1: карточки
│   ├── 02-technology.mdx  ← Фаза 2
│   ├── 03-implementation.mdx
│   └── 04-launch.mdx
```

## 5. AI Integration

```
Пользователь → вопрос → /api/ai/ask → OpenRouter → ответ
                                        ↑
                                   Контекст из карточки +
                                   Blueprint'а + истории решений
```

Модель: `deepseek/deepseek-chat` (MVP). Позже — выбор модели.

## 6. XP и уровни

| Уровень | XP | Название |
|---------|-----|----------|
| 0-99 | novice | Новичок |
| 100-299 | practitioner | Практик |
| 300-599 | engineer | Инженер |
| 600+ | architect | Архитектор |

XP начисляется за выполнение карточек (15-50 XP).

## 7. Деплой

- Сервер: 109.196.165.106
- Порт: 3030
- Nginx: прокси на :3030
- PM2: `pm2 start npm --name proektmap -- run start`
- SSL: Let's Encrypt через ISPmanager
- База: PostgreSQL на localhost:5433 (общая с leads/chat)

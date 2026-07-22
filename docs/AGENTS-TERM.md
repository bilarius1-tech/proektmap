# Правила для AI-агентов ProektMap

## Глоссарий и компонент `<Term />`

### Правило №1: Использовать `<Term />` везде

Любой технический термин в тексте сайта должен быть обёрнут в `<Term term="Термин" />`:

```tsx
import Term from "@/components/glossary/tooltip-term";

// ✅ Правильно
Для поиска используем <Term term="RAG" /> и <Term term="Qdrant" />

// ❌ Неправильно
Для поиска используем RAG и Qdrant
```

### Правило №2: Термины в новых страницах

При создании любой новой страницы или компонента:
- Проверить текст на наличие технических терминов
- Обернуть их в `<Term />`
- Добавить импорт `import Term from "@/components/glossary/tooltip-term";`

### Правило №3: API доступен

Глоссарий загружается через `/api/glossary` и кешируется на клиенте.
94 термина уже в БД. Не нужно загружать их повторно.

### Правило №4: Админка глоссария

Редактирование терминов: `/admin/glossary`
API для CRUD: `/api/admin/glossary`
Модель: `GlossaryTerm` (Prisma)

### Правило №5: Категории терминов

| Категория | Для чего |
|-----------|----------|
| AI и LLM | Prompt, RAG, Agent, MCP, Token |
| Разработка | API, REST, CRUD, Webhook, ORM |
| Базы данных | PostgreSQL, Prisma, Migration |
| Git | Commit, Branch, Merge, PR |
| Дизайн | CSS, Tailwind, Адаптив |
| SEO | Sitemap, Meta, Schema.org |
| SaaS | MVP, Churn, LTV, CAC |
| Деплой | Vercel, Docker, Nginx, SSL |

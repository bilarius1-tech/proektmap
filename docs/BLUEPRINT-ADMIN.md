# Как работать с Blueprint

## Правило: Blueprint = контент продукта, не seed-данные

Blueprint, этапы, промпты, навыки и чек-листы — это контент, который редактируется через админку.
Seed используется ТОЛЬКО для системных данных (роли, настройки, демо).

## Админка

/admin/blueprints — дерево Blueprint → Stage → Decision

### Редактирование Decision
1. Развернуть Blueprint → развернуть Stage
2. Нажать «Ред.» на нужном решении
3. Заполнить поля:
   - Заголовок
   - Проблема (почему это важно)
   - Почему это решение?
   - Рекомендация
   - Промпт (для Cursor/Claude Code) — используй {{project}}, {{stack}} для подстановки
   - Навыки — JSON массив slug-ов из глоссария, например [nextjs,prisma,postgresql]
   - Типичные ошибки
   - XP за решение
4. «Сохранить»

### API
POST /api/admin/decisions — сохраняет изменения в БД

## Структура Blueprint
- Blueprint → Stages → Stage → Decisions
- Каждое решение: title, problem, why, recommended, promptTemplate, skillsRequired, mistakes, xpReward
- Навыки (skillsRequired) — JSON массив slug-ов глоссария
- Промпт использует переменные {{project}} и {{stack}} для подстановки

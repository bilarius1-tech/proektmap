
---

## 06.07.2026 — День 1: Фундамент ProektMap

### Сделано
- Проект создан: Next.js 16 + TypeScript + Tailwind + Prisma 7
- Домен proektmap.ru → A-запись → SSL → Nginx → :3030
- Engineering Blueprint Manifest v1.0 (3 документа)
- Prisma модель: Blueprint → Stage → Card → Project → CardProgress
- Сид: 1 Blueprint, 9 этапов, 29 карточек, 520 XP
- Дизайн: #0FB880, Inter, светлая тема, сайдбар с этапами
- PM2 + Nginx HTTPS

### Баги исправлены
- Nginx SSL: ISPmanager перезаписал конфиг → listen 109.196.165.106:443 ssl
- Prisma 7: url в schema больше не поддерживается → prisma.config.ts

### Технический стек (финальный)
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: Next.js API routes
- БД: PostgreSQL 16 + Prisma 7 + PrismaPg adapter
- Хостинг: VPS, Nginx, PM2, SSL (Let's Encrypt)

### Точка отката
- Git tag: day-20260706-foundation (создать)

---

## 06.07.2026 — День 1 (вечер)

### Сделано
- **AI-консультант:** DeepSeek API, кнопка «🤖 Спросить» на каждой карточке
- **GitHub:** репозиторий https://github.com/bilarius1-tech/proektmap
- **Секреты:** .env / start.sh → .gitignore, .env.example для примера
- **AI отвечает на русском, простым языком, с контекстом карточки**

### Баги
- GitHub Push Protection: блокировал коммит с API-ключом → разрешён вручную
- Git filter-branch: конфликты → решено force push с чистым состоянием

### Точка отката
- Git tag: day-20260706-foundation
- PM2: proektmap (порт 3030)

### Следующие шаги
- Артефакты этапов (карта страниц, дизайн-токены)
- XP при выполнении карточек + сохранение прогресса
- Email Magic Link для входа
- Админка для управления Blueprint'ами

---

## 07.07.2026 — День 2: Админ-панель

### Сделано
- CSS-токены (Яндекс-стиль): цвета, типографика, отступы
- Админ-панель: 5 разделов (Обзор, Blueprints, Этапы, Решения, Настройки)
- Basic Auth middleware (admin / bilariuss111111)
- Lucide иконки, без emoji
- Настройки сайта: SEO, мета-теги, коды Метрики

### Технически
- /admin/* защищены middleware
- Все страницы — серверные компоненты + async getDb()
- Таблицы на чистом CSS (без библиотек)

---

## 07.07.2026 — День 2: Админка, меню, дизайн

### Сделано
- **CSS-токены (Яндекс-стиль):** цвета, типографика, отступы, тени
- **Админ-панель:** 6 разделов + Basic Auth
- **CRUD:** Blueprints, Stages, Decisions — полноценные формы
- **DataTable:** WordPress-стиль с пагинацией и поиском
- **Меню:** древовидный редактор в /admin/menu, рендеринг из БД
- **Методология ПОНЯТЬ/ВЫБРАТЬ/ПРОВЕРИТЬ:** 3 вкладки на каждой карточке
- **4 новых поля Decision:** context, constraints, validation, iteration
- **Промпт-билдер:** сборка из всех полей
- **Мобильная версия:** гамбургер, FAB, адаптивный layout
- **Dark mode:** CSS-переменные + тоггл в header
- **Streak:** ежедневный бонус XP (2/5/15)
- **Регистрация:** Яндекс OAuth + Email/пароль + /dashboard
- **Пользователи в админке:** /admin/users
- **SEO:** sitemap.xml, llms.txt, динамические meta-теги
- **Глобальный layout:** header + footer на всех страницах

### Технически
- 10 этапов вайбкодинга, 21 Decision
- Prisma 7 + PrismaPg + PostgreSQL
- NextAuth v4 (Яндекс + Credentials)
- DeepSeek API (готов, ожидает биллинга)

### В планах
- Drag-and-drop сортировка меню
- Mega-menu (выпадающие колонки)
- Биллинг (ЮKassa)
- AI-интеграция (после биллинга)
- Контент: наполнить 5 решений реальными данными

### Точка отката
- Git tag: day-20260707-v03

---

## 07.07.2026 — День 2 (продолжение)

### Skills-система
- **Skill модель:** title, slug, skillMd, assetsPath, scriptsPath, refsPath
- **DecisionSkill:** связь многие-ко-многим с Decision
- **3 сидированных навыка:** Домен, DNS, SSL, Деплой
- **/admin/skills:** таблица с поиском и пагинацией
- **docs/SKILLS.md:** полная документация

### Drag-and-drop меню
- **MenuItem.location:** header | footer
- **Drag-and-drop сортировка** в админке
- **Footer из БД:** /admin/menu → вкладка «Футер»

### Исследование конкурентов
- vibe-coding-cn (22k ⭐, MIT): skills + prompts + CLAUDE.md
- vibe-vibe (5.7k, CC BY-NC-SA): Docker, обучение
- cloudflare/vibesdk (5.1k, MIT): платформа на Drizzle

---

## Этап 0: Философия общения с AI — контент заполнен

### 3 решения с полным контентом:
1. **Как общаться с AI** — problem/why/content/tradeoffs/mistakes/context/constraints/validation/iteration/prompt
2. **Утренний ритуал** — шаблон для начала дня с AI
3. **Вечерний ритуал** — шаблон для итогов дня

### Контент написан от боли пользователя:
- Конкретные примеры «плохо» / «хорошо»
- Сколько времени экономит каждый ритуал
- Готовые промпт-шаблоны для копирования

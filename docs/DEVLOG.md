
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

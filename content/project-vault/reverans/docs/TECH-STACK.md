# TECH-STACK — Реверанс

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 App Router |
| Language | TypeScript |
| UI | Tailwind CSS + design tokens (Tiffany `#7DD3D3`, beige `#F5F0E8`, …) |
| Fonts | Montserrat / Cormorant (TZ); Playfair local for brand |
| ORM | Prisma |
| DB | PostgreSQL 16 |
| Auth | NextAuth (Credentials + Yandex) |
| Payments | TBank API v2 (Init + Notification webhook) |
| Process | PM2 `reverans` |
| Proxy | Nginx (ISPmanager vhost) |
| Hosting | Single VPS (not Vercel / Supabase) |
| Health | Custom harness shell + HTTP `/api/health` |
| Editor | TipTap in CMS |

## Design tokens (must preserve on forks)

- primary `#7DD3D3`, secondary `#F5F0E8`, text `#4A3728`, accent `#C9A96E`
- success `#8ED1B0`, error `#E88B8B`, border `#E0D8CF`
- radii: buttons 16px, cards 20px, inputs 12px, modals 24px

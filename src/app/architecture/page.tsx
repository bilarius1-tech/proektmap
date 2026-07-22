import { getDb } from "@/lib/db/index";
import ArchitectureClient from "./client";
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Карта метро AI-инжиниринга | ProektMap",
  description: "Визуальная карта связей: этапы Blueprint → компоненты ProektMap. Линии метро, пересадки, подсказки. Пойми архитектуру AI-разработки за 2 минуты.",
};

// Component mapping: which ProektMap components link to which phase
const COMPONENT_MAP: Record<string, { name: string; href: string; icon: string; desc: string }[]> = {
  "phase-0": [
    { name: "AI-инструменты", href: "/ai-tools", icon: "🛠️", desc: "Сравнение 16 инструментов: Cursor, Vibecraft, Reasonix" },
    { name: "Vibecraft Guide", href: "/corporate-website?stage=phase-0-tools", icon: "🤖", desc: "Пошаговый гайд по Yandex AI-конструктору" },
  ],
  "phase-1": [
    { name: "Reg.ru", href: "https://reg.ru", icon: "🌐", desc: "Регистрация доменов .ru/.рф" },
    { name: "Beget", href: "https://beget.com", icon: "☁️", desc: "Российский хостинг с PM2" },
    { name: "Vercel", href: "https://vercel.com", icon: "🚀", desc: "Бесплатный деплой Next.js" },
  ],
  "phase-2": [
    { name: "Prisma", href: "https://prisma.io", icon: "📊", desc: "ORM для PostgreSQL с автогенерацией типов" },
    { name: "Яндекс OAuth", href: "/corporate-website?stage=phase-2-auth", icon: "🔑", desc: "Вход через Яндекс ID" },
    { name: "NextAuth", href: "https://next-auth.js.org", icon: "🔐", desc: "Аутентификация для Next.js" },
  ],
  "phase-3": [
    { name: "Design Tokens", href: "/corporate-website?stage=phase-3-design", icon: "🎨", desc: "CSS-переменные: цвета, шрифты, отступы" },
    { name: "Lucide Icons", href: "https://lucide.dev", icon: "🧩", desc: "Бесплатные векторные иконки" },
    { name: "Inter Font", href: "https://fonts.google.com/specimen/Inter", icon: "🔤", desc: "Шрифт без засечек для текста" },
  ],
  "phase-4": [
    { name: "MCP-серверы", href: "/mcp", icon: "🔌", desc: "34+ сервера Model Context Protocol" },
    { name: "Telegram", href: "https://core.telegram.org/bots/api", icon: "📱", desc: "Bot API для уведомлений и ботов" },
    { name: "ЮKassa", href: "/dashboard/billing", icon: "💳", desc: "Приём платежей для российского бизнеса" },
  ],
  "phase-5": [
    { name: "SEO", href: "/corporate-website?stage=phase-5-seo", icon: "🔍", desc: "Метатеги, sitemap, Schema.org" },
    { name: "Яндекс.Метрика", href: "https://metrika.yandex.ru", icon: "📈", desc: "Аналитика: визиты, цели, вебвизор" },
    { name: "Право", href: "/privacy", icon: "📋", desc: "Политика, оферта, возврат" },
  ],
};

export default async function ArchitecturePage() {
  const db = await getDb();
  const blueprints = await db.blueprint.findMany({
    where: { isPublished: true },
    include: { stages: { orderBy: { sortOrder: "asc" }, include: { stage: true } } },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <ArchitectureClient
      blueprints={JSON.parse(JSON.stringify(blueprints))}
      componentMap={COMPONENT_MAP}
    />
  );
}

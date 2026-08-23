import Link from "next/link";
import { getDb } from "@/lib/db";

async function getFooterLinks() {
  try {
    const db = await getDb();
    return await db.menuItem.findMany({
      where: { parentId: null, isActive: true, location: "footer" },
      orderBy: { sortOrder: "asc" },
    });
  } catch { return []; }
}

export default async function GlobalFooter() {
  const footerLinks = await getFooterLinks();

  return (
    <footer className="bg-bg-primary border-t border-border-light px-m py-xl mt-auto">
      <div className="max-w-[1000px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-xl">
        {/* Brand */}
        <div>
          <div className="font-extrabold text-m mb-s">
            Proekt<span className="text-accent">Map</span>
          </div>
          <p className="text-xs text-text-tertiary leading-relaxed">
            Первая школа AI-инженеров в России. Научись создавать проекты с помощью AI.
          </p>
        </div>

        {/* Project links */}
        <div>
          <div className="font-semibold text-xs mb-s uppercase tracking-[0.06em] text-text-tertiary">Проект</div>
          <div className="flex flex-col gap-xs">
            <Link href="/" className="text-s text-text-secondary no-underline">Шаблоны</Link>
            <Link href="/skills" className="text-s text-text-secondary no-underline">Skills</Link>
            <Link href="/dashboard" className="text-s text-text-secondary no-underline">Личный кабинет</Link>
            <Link href="/auth" className="text-s text-text-secondary no-underline">Войти</Link>
          </div>
        </div>

        {/* Documents */}
        <div>
          <div className="font-semibold text-xs mb-s uppercase tracking-[0.06em] text-text-tertiary">Документы</div>
          <div className="flex flex-col gap-xs">
            {footerLinks.length > 0 ? (
              footerLinks.map(item => (
                <Link key={item.id} href={item.href} className="text-s text-text-secondary no-underline">{item.label}</Link>
              ))
            ) : (
              <>
                <Link href="/privacy" className="text-s text-text-secondary no-underline">Политика конфиденциальности</Link>
                <Link href="/terms" className="text-s text-text-secondary no-underline">Условия использования</Link>
                <Link href="/sitemap" className="text-s text-text-secondary no-underline">Карта сайта</Link>
                <Link href="/pricing" className="text-s text-text-secondary no-underline">Тарифы</Link>
                <Link href="/offer" className="text-s text-text-secondary no-underline">Оферта</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-[1000px] mx-auto mt-xl pt-m border-t border-border-light text-center text-xs text-text-tertiary">
        © 2026 Карта роста. Школа AI-инженеров. ИП Тимофеев Алексей Геннадьевич, ИНН 532002912418.
        <div className="mt-1">
          <a href="/admin" className="text-text-tertiary text-[10px] no-underline opacity-30">админка</a>
        </div>
      </div>
    </footer>
  );
}

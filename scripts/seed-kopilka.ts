const CATEGORIES = [
  { slug: "animations", title: "Анимации", emoji: "✨", description: "CSS/JS motion, микроинтеракции, scroll" },
  { slug: "landing-sections", title: "Секции лендинга", emoji: "🧱", description: "Hero, features, pricing, FAQ-блоки" },
  { slug: "buttons-cta", title: "Кнопки и CTA", emoji: "🔘", description: "Кнопки, ховеры, call-to-action" },
  { slug: "backgrounds", title: "Фоны и текстуры", emoji: "🎨", description: "Градиенты, паттерны, mesh, noise" },
  { slug: "dashboards", title: "Дашборды", emoji: "📊", description: "Админки, таблицы, графики, layouts" },
  { slug: "ui-kits", title: "UI-киты / компоненты", emoji: "🧩", description: "Готовые киты и библиотеки компонентов" },
  { slug: "codepen-demos", title: "CodePen и demos", emoji: "🖊️", description: "Живые демо, песочницы, сниппеты" },
  { slug: "typography", title: "Типографика", emoji: "🔤", description: "Шрифты, иерархия, текстовые эффекты" },
  { slug: "icons-illustrations", title: "Иконки и иллюстрации", emoji: "🖼️", description: "Иконки, SVG, иллюстрации" },
  { slug: "color-themes", title: "Цвет и темы", emoji: "🌈", description: "Палитры, dark mode, токены" },
];

async function main() {
  const { getDb } = await import("../src/lib/db/index");
  const db = await getDb();

  for (let i = 0; i < CATEGORIES.length; i++) {
    const c = CATEGORIES[i];
    await db.designBankCategory.upsert({
      where: { slug: c.slug },
      create: {
        slug: c.slug,
        title: c.title,
        emoji: c.emoji,
        description: c.description,
        sortOrder: i + 1,
        isPublished: true,
      },
      update: {
        title: c.title,
        emoji: c.emoji,
        description: c.description,
        sortOrder: i + 1,
        isPublished: true,
      },
    });
  }

  console.log(`OK: ${CATEGORIES.length} категорий копилки`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

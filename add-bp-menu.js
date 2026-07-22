const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: "postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public" }) });

async function menu() {
  const bps = await p.blueprint.findMany({ where: { isPublished: true }, select: { slug: true, title: true }, orderBy: { sortOrder: "asc" } });
  console.log("Blueprints:", bps.map(b => b.slug).join(", "));

  const labels = { "corporate-website": "Корп. сайт", "saas-project": "SaaS", "game-dev": "Игра" };
  for (const bp of bps) {
    await p.menuItem.upsert({
      where: { id: "bp-" + bp.slug },
      update: { label: labels[bp.slug] || bp.title, href: "/" + bp.slug, sortOrder: 10 + bps.indexOf(bp), isActive: true, location: "header" },
      create: { id: "bp-" + bp.slug, label: labels[bp.slug] || bp.title, href: "/" + bp.slug, sortOrder: 10 + bps.indexOf(bp), isActive: true, location: "header", parentId: null }
    });
  }
  console.log("Menu items added");
  await p.$disconnect();
}
menu();

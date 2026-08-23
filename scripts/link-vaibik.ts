import { getDb } from "../src/lib/db/index";

async function main() {
  const db = await getDb();
  await db.menuItem.upsert({
    where: { id: "header-vaibik" },
    create: {
      id: "header-vaibik",
      label: "Вайбик",
      href: "/vaibik",
      location: "header",
      sortOrder: 7,
      isActive: true,
      parentId: null,
    },
    update: {
      label: "Вайбик",
      href: "/vaibik",
      isActive: true,
      location: "header",
    },
  });

  // Append CTA into kids blog if not present
  const slug = "ii-dlya-detey-kak-eto-pomozhet-prodavtsam-na-avito";
  const post = await db.blogPost.findUnique({ where: { slug } });
  if (post && post.content && !post.content.includes("/vaibik")) {
    const cta =
      '<p><strong>Попробуйте сами:</strong> детский квест <a href="/vaibik">«Вайбик: Миссия №1»</a> на ProektMap — промпты и первая игра вместе с роботом Вайбиком.</p>';
    await db.blogPost.update({
      where: { slug },
      data: { content: post.content + cta },
    });
    console.log("blog CTA added");
  } else {
    console.log("blog CTA skip", !!post);
  }

  const roots = await db.menuItem.findMany({
    where: { location: "header", parentId: null, isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { label: true, href: true, sortOrder: true },
  });
  console.log(roots);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

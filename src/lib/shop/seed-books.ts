import { getDb } from "@/lib/db/index";

const BOOKS = [
  {
    slug: "ii-dlya-uchitelya",
    title: "ИИ для учителя: первый шаг",
    description:
      "Практический гид по российским нейросетям для педагогов. 30 страниц, PDF. После оплаты файл скачивается на странице заказа.",
    priceRub: 309,
    litresUrl: "https://www.litres.ru/74575859/",
    fileName: "ii-dlya-uchitelya.pdf",
    originalName: "ii-dlya-uchitelya.pdf",
    coverUrl: "/shop/covers/ii-dlya-uchitelya.jpg",
    cardTitle: "ИИ для учителя: первый шаг",
    ageRating: "0+",
    pageCount: 30,
    sortOrder: 1,
  },
  {
    slug: "ii-uchitel-pravo",
    title:
      "Использование технологий искусственного интеллекта в профессиональной деятельности учителя: правовые и этические аспекты Российской Федерации",
    description:
      "Методическое руководство для педагогических работников. Право и этика ИИ в школе, Российская Федерация. 59 страниц, PDF, 12+.",
    priceRub: 399,
    litresUrl: "https://www.litres.ru/74566257/",
    fileName: "kartarosta_ai_guide.pdf",
    originalName: "kartarosta_ai_guide.pdf",
    coverUrl: "/shop/covers/ii-v-shkole.jpg",
    cardTitle: "ИИ в школе",
    ageRating: "12+",
    pageCount: 59,
    sortOrder: 2,
  },
];

export async function seedShopBooks() {
  const db = await getDb();
  const category = await db.productCategory.upsert({
    where: { slug: "knigi" },
    update: { title: "Книги", kind: "book", sortOrder: 1 },
    create: { title: "Книги", slug: "knigi", kind: "book", sortOrder: 1 },
  });

  for (const book of BOOKS) {
    await db.digitalProduct.upsert({
      where: { slug: book.slug },
      update: {
        title: book.title,
        description: book.description,
        priceRub: book.priceRub,
        kind: "book",
        categoryId: category.id,
        litresUrl: book.litresUrl,
        fileName: book.fileName,
        originalName: book.originalName,
        coverUrl: book.coverUrl,
        cardTitle: book.cardTitle,
        ageRating: book.ageRating,
        pageCount: book.pageCount,
        isPublished: true,
        sortOrder: book.sortOrder,
      },
      create: {
        ...book,
        kind: "book",
        categoryId: category.id,
        isPublished: true,
      },
    });
  }
}

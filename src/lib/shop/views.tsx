import Link from "next/link";
import { notFound } from "next/navigation";
import { Eye } from "lucide-react";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";
import BuyBox from "@/components/shop/buy-box";
import ProductCard from "@/components/shop/product-card";
import ShareButton from "@/components/shop/share-button";
import { plainDescription, shopDescriptionHtml } from "@/lib/shop/description-html";

export const dynamic = "force-dynamic";

const SITE = "https://proektmap.ru";

export const SHOP_PAGE_SIZE = 12;

export type ShopSort = "new" | "price" | "views";

export function parseShopSort(value: string | undefined): ShopSort {
  if (value === "price" || value === "views") return value;
  return "new";
}

export async function publishedPage(kind: "book" | "file", sort: ShopSort, page: number) {
  const db = await getDb();
  const where = { kind, isPublished: true };
  const orderBy = sort === "price"
    ? [{ priceRub: "asc" as const }, { title: "asc" as const }]
    : sort === "views"
      ? [{ viewCount: "desc" as const }, { title: "asc" as const }]
      : [{ createdAt: "desc" as const }];
  const total = await db.digitalProduct.count({ where });
  const pages = Math.max(1, Math.ceil(total / SHOP_PAGE_SIZE));
  const safePage = Math.min(Math.max(1, page), pages);
  const products = await db.digitalProduct.findMany({
    where,
    orderBy,
    skip: (safePage - 1) * SHOP_PAGE_SIZE,
    take: SHOP_PAGE_SIZE,
    include: { category: { select: { title: true, slug: true, sortOrder: true } } },
  });
  return { products, total, page: safePage, pages };
}

export async function loadProduct(kind: "book" | "file", slug: string) {
  const db = await getDb();
  return db.digitalProduct.findFirst({
    where: { kind, slug, isPublished: true },
    include: { category: { select: { title: true } } },
  });
}

export function productMeta(product: {
  title: string;
  description: string;
  slug: string;
  kind: string;
  coverUrl: string;
  priceRub: number;
}) {
  const path = `${product.kind === "book" ? "/books" : "/faily"}/${product.slug}`;
  const description = plainDescription(product.description).slice(0, 160);
  const image = product.coverUrl ? `${SITE}${product.coverUrl}` : undefined;
  return {
    title: `${product.title} | ProektMap`,
    description,
    alternates: { canonical: `${SITE}${path}` },
    openGraph: {
      title: product.title,
      description,
      url: `${SITE}${path}`,
      type: product.kind === "book" ? "book" : "website",
      images: image ? [{ url: image, alt: product.title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: product.title,
      description,
      images: image ? [image] : undefined,
    },
  } as const;
}

export async function buyerEmail() {
  const session = await auth();
  return (session?.user as { email?: string } | undefined)?.email || "";
}

export function ShopIndex({
  title,
  lead,
  products,
  basePath,
  sort,
  page,
  pages,
}: {
  title: string;
  lead: string;
  products: Awaited<ReturnType<typeof publishedPage>>["products"];
  basePath: "/books" | "/faily";
  sort: ShopSort;
  page: number;
  pages: number;
}) {
  const sorts: { id: ShopSort; label: string }[] = [
    { id: "new", label: "Новинки" },
    { id: "price", label: "Сначала дешевле" },
    { id: "views", label: "По просмотрам" },
  ];

  function hrefFor(nextSort: ShopSort, nextPage: number) {
    const params = new URLSearchParams();
    if (nextSort !== "new") params.set("sort", nextSort);
    if (nextPage > 1) params.set("page", String(nextPage));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  return (
    <main style={{ maxWidth: 1080, margin: "0 auto", padding: "40px 20px 72px" }}>
      <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: "var(--color-text-tertiary)" }}>
        <Link href="/agent-engineering" style={{ color: "var(--color-accent)", textDecoration: "none" }}>Научиться</Link>
        {" · "}
        <Link href="/zakaz" style={{ color: "var(--color-accent)", textDecoration: "none" }}>Найти заказ</Link>
      </p>
      <h1 style={{ margin: "0 0 12px", fontSize: 40, lineHeight: 1.15 }}>{title}</h1>
      <p style={{ margin: "0 0 16px", maxWidth: 640, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>{lead}</p>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
        {sorts.map((item) => (
          <Link
            key={item.id}
            href={hrefFor(item.id, 1)}
            style={{
              padding: "8px 12px",
              border: "1px solid var(--color-border)",
              background: sort === item.id ? "var(--color-accent)" : "var(--color-bg-primary)",
              color: sort === item.id ? "#fff" : "var(--color-text-primary)",
              textDecoration: "none",
              fontWeight: 700,
              fontSize: 14,
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>
      {products.length === 0 && (
        <p style={{ margin: 0 }}>Пока пусто. Товары появляются из админки, когда у них есть файл и публикация.</p>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
          gap: 16,
        }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              categoryTitle: basePath === "/faily" ? product.category?.title : undefined,
            }}
          />
        ))}
      </div>
      {pages > 1 && (
        <nav style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 24 }} aria-label="Страницы каталога">
          {page > 1 && (
            <Link href={hrefFor(sort, page - 1)} style={{ color: "var(--color-accent)", fontWeight: 700 }}>Назад</Link>
          )}
          <span>Страница {page} из {pages}</span>
          {page < pages && (
            <Link href={hrefFor(sort, page + 1)} style={{ color: "var(--color-accent)", fontWeight: 700 }}>Дальше</Link>
          )}
        </nav>
      )}
    </main>
  );
}

export async function ShopProductPage({ kind, slug }: { kind: "book" | "file"; slug: string }) {
  const product = await loadProduct(kind, slug);
  if (!product) notFound();
  const db = await getDb();
  const viewed = await db.digitalProduct.update({
    where: { id: product.id },
    data: { viewCount: { increment: 1 } },
    select: { viewCount: true },
  });
  const email = await buyerEmail();
  const base = kind === "book" ? "/books" : "/faily";
  const url = `${SITE}${base}/${product.slug}`;
  const image = product.coverUrl ? `${SITE}${product.coverUrl}` : undefined;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": kind === "book" ? "Book" : "Product",
    name: product.title,
    description: plainDescription(product.description),
    image,
    url,
    inLanguage: "ru",
    ...(product.pageCount > 0 ? { numberOfPages: product.pageCount } : {}),
    offers: {
      "@type": "Offer",
      price: String(product.priceRub),
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      url,
    },
  };

  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px 72px" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <p style={{ margin: "0 0 16px", fontSize: 13 }}>
        <Link href={base} style={{ color: "var(--color-accent)", textDecoration: "none" }}>
          {kind === "book" ? "Книги" : "Файлы"}
        </Link>
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 28,
          alignItems: "start",
        }}
      >
        {product.coverUrl ? (
          <img
            src={product.coverUrl}
            alt={product.title}
            style={{ width: "100%", aspectRatio: "4 / 5", objectFit: "cover", border: "1px solid var(--color-border)" }}
          />
        ) : (
          <div style={{ aspectRatio: "4 / 5", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }} />
        )}
        <div style={{ display: "grid", gap: 14, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.2 }}>{product.title}</h1>
          {(product.ageRating || product.pageCount > 0) && (
            <p style={{ margin: 0, color: "var(--color-text-tertiary)" }}>
              {[product.ageRating, product.pageCount > 0 ? `${product.pageCount} страниц` : ""].filter(Boolean).join(" · ")}
            </p>
          )}
          <p style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{product.priceRub} ₽</p>
          <p style={{ margin: 0, display: "inline-flex", alignItems: "center", gap: 6, color: "var(--color-text-tertiary)", fontSize: 14 }}>
            <Eye size={16} /> {viewed.viewCount} просмотров
          </p>
          <p style={{ margin: 0, fontSize: 14 }}>
            В заказе будет файл {product.originalName || "PDF"}. Ссылка на скачивание появится после оплаты.
          </p>
          <ShareButton title={product.title} text={plainDescription(product.description).slice(0, 140)} />
          <BuyBox productId={product.id} priceRub={product.priceRub} defaultEmail={email} />
          {product.litresUrl && (
            <a href={product.litresUrl} style={{ color: "var(--color-accent)", fontWeight: 700 }}>
              Купить на Литрес
            </a>
          )}
        </div>
      </div>
      <article
        className="blog-content blog-article-body"
        style={{ marginTop: 36, color: "var(--color-text-secondary)" }}
        dangerouslySetInnerHTML={{ __html: shopDescriptionHtml(product.description) }}
      />
    </main>
  );
}

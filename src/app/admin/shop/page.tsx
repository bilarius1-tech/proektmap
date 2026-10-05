import { getDb } from "@/lib/db/index";
import { shopFileExists } from "@/lib/shop/storage";
import AdminShopClient from "./client";

export const dynamic = "force-dynamic";

const ORDER_PAGE_SIZE = 20;

export default async function AdminShopPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; page?: string; email?: string }>;
}) {
  const params = await searchParams;
  const orderEmail = String(params.email || "").trim().toLowerCase();
  const requestedPage = Math.max(1, Number(params.page) || 1);
  const where = orderEmail
    ? { email: { contains: orderEmail, mode: "insensitive" as const } }
    : {};
  const db = await getDb();
  const [products, categories, orderTotal] = await Promise.all([
    db.digitalProduct.findMany({
      orderBy: [{ kind: "asc" }, { sortOrder: "asc" }],
      include: { category: { select: { title: true, kind: true } } },
    }),
    db.productCategory.findMany({ orderBy: [{ kind: "asc" }, { sortOrder: "asc" }] }),
    db.shopOrder.count({ where }),
  ]);
  const orderPages = Math.max(1, Math.ceil(orderTotal / ORDER_PAGE_SIZE));
  const orderPage = Math.min(requestedPage, orderPages);
  const orders = await db.shopOrder.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: (orderPage - 1) * ORDER_PAGE_SIZE,
    take: ORDER_PAGE_SIZE,
    include: { items: true },
  });

  const rows = products.map((product) => ({
    ...product,
    fileReady: shopFileExists(product.fileName),
  }));
  const tab = params.tab === "orders" || params.tab === "file" || params.tab === "categories" || params.tab === "book"
    ? params.tab
    : "book";

  return (
    <AdminShopClient
      products={JSON.parse(JSON.stringify(rows))}
      categories={JSON.parse(JSON.stringify(categories))}
      orders={JSON.parse(JSON.stringify(orders))}
      orderEmail={orderEmail}
      orderPage={orderPage}
      orderPages={orderPages}
      initialTab={tab}
    />
  );
}

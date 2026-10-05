import type { Metadata } from "next";
import { parseShopSort, publishedPage, ShopIndex } from "@/lib/shop/views";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Книги Алексея Тимофеева — PDF для педагогов | ProektMap",
  description:
    "Книги про ИИ для учителя: купить на Литрес или скачать PDF сразу после оплаты на сайте Карты роста.",
  alternates: { canonical: "https://proektmap.ru/books" },
};

type Props = { searchParams: Promise<{ sort?: string; page?: string }> };

export default async function BooksPage({ searchParams }: Props) {
  const params = await searchParams;
  const sort = parseShopSort(params.sort);
  const page = Math.max(1, Number(params.page) || 1);
  const data = await publishedPage("book", sort, page);
  return (
    <ShopIndex
      title="Книги"
      lead="PDF Алексея Тимофеева для педагогов. На Литрес — витрина магазина. «Купить здесь» — тот же файл сразу после оплаты ЮKassa."
      products={data.products}
      basePath="/books"
      sort={sort}
      page={data.page}
      pages={data.pages}
    />
  );
}

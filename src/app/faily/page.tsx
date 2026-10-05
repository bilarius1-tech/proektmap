import type { Metadata } from "next";
import { parseShopSort, publishedPage, ShopIndex } from "@/lib/shop/views";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Цифровые файлы и архивы | ProektMap",
  description:
    "Zip и другие файлы Карты роста по категориям. Оплата через ЮKassa, скачивание после подтверждения платежа.",
  alternates: { canonical: "https://proektmap.ru/faily" },
};

type Props = { searchParams: Promise<{ sort?: string; page?: string }> };

export default async function FilesPage({ searchParams }: Props) {
  const params = await searchParams;
  const sort = parseShopSort(params.sort);
  const page = Math.max(1, Number(params.page) || 1);
  const data = await publishedPage("file", sort, page);
  return (
    <ShopIndex
      title="Файлы"
      lead="Архивы и материалы по категориям. Один товар — один платёж. Файл открывается на странице заказа после оплаты."
      products={data.products}
      basePath="/faily"
      sort={sort}
      page={data.page}
      pages={data.pages}
    />
  );
}

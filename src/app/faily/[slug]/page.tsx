import type { Metadata } from "next";
import { loadProduct, productMeta, ShopProductPage } from "@/lib/shop/views";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct("file", slug);
  if (!product) return { title: "Файл не найден | ProektMap" };
  return productMeta(product);
}

export default async function FilePage({ params }: Props) {
  const { slug } = await params;
  return <ShopProductPage kind="file" slug={slug} />;
}

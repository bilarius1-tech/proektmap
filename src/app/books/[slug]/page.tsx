import type { Metadata } from "next";
import { loadProduct, productMeta, ShopProductPage } from "@/lib/shop/views";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct("book", slug);
  if (!product) return { title: "Книга не найдена | ProektMap" };
  return productMeta(product);
}

export default async function BookPage({ params }: Props) {
  const { slug } = await params;
  return <ShopProductPage kind="book" slug={slug} />;
}

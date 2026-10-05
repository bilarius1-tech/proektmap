import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard, { type ShopCardProduct } from "@/components/shop/product-card";

export default function HomeShop({ products }: { products: ShopCardProduct[] }) {
  if (products.length === 0) return null;
  return (
    <section className="home-hub" aria-labelledby="home-shop-title" style={{ paddingBottom: 12 }}>
      <h2 id="home-shop-title">Последнее из магазина</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 200px), 1fr))",
          gap: 12,
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
      <p style={{ margin: "16px 0 0", textAlign: "center" }}>
        <Link href="/books" style={{ color: "var(--color-accent)", fontWeight: 700, textDecoration: "none" }}>
          Все книги <ArrowRight size={14} style={{ verticalAlign: "middle" }} />
        </Link>
      </p>
    </section>
  );
}

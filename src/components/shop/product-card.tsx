import Link from "next/link";
import { Eye } from "lucide-react";

export type ShopCardProduct = {
  slug: string;
  title: string;
  cardTitle?: string;
  description?: string;
  priceRub: number;
  kind: string;
  coverUrl: string;
  viewCount: number;
  litresUrl?: string;
  ageRating?: string;
  pageCount?: number;
  categoryTitle?: string;
};

export function productHref(product: { kind: string; slug: string }) {
  return `${product.kind === "book" ? "/books" : "/faily"}/${product.slug}`;
}

export function cardLabel(product: { title: string; cardTitle?: string }) {
  return product.cardTitle?.trim() || product.title;
}

export default function ProductCard({ product }: { product: ShopCardProduct }) {
  const href = productHref(product);
  const label = cardLabel(product);
  const facts = [product.ageRating, product.pageCount ? `${product.pageCount} стр.` : "", product.categoryTitle]
    .filter(Boolean)
    .join(" · ");
  return (
    <article
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: 0,
        border: "1px solid var(--color-border)",
        background: "var(--color-bg-primary)",
        color: "inherit",
      }}
    >
      <Link href={href} style={{ display: "block", background: "var(--color-bg-secondary)", textDecoration: "none" }}>
        {product.coverUrl ? (
          <img
            src={product.coverUrl}
            alt={product.title}
            style={{ display: "block", width: "100%", aspectRatio: "4 / 5", objectFit: "cover" }}
          />
        ) : (
          <span
            style={{
              display: "flex",
              alignItems: "flex-end",
              width: "100%",
              aspectRatio: "4 / 5",
              padding: 16,
              boxSizing: "border-box",
              color: "var(--color-text-secondary)",
              fontWeight: 700,
              lineHeight: 1.3,
            }}
          >
            {label}
          </span>
        )}
      </Link>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: 14, flex: 1 }}>
        <h2 style={{ margin: 0, fontSize: 16, lineHeight: 1.35, fontFamily: "var(--font-heading)" }}>
          <Link href={href} style={{ color: "inherit", textDecoration: "none" }}>
            {label}
          </Link>
        </h2>
        {facts ? (
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-tertiary)" }}>{facts}</p>
        ) : null}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: "auto" }}>
          <strong style={{ fontSize: 18 }}>{product.priceRub} ₽</strong>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--color-text-tertiary)" }}>
            <Eye size={14} /> {product.viewCount}
          </span>
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <Link
            href={`${href}#buy`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 44,
              background: "var(--color-accent)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Купить здесь
          </Link>
          {product.litresUrl ? (
            <a
              href={product.litresUrl}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 44,
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                textDecoration: "none",
                fontWeight: 700,
              }}
            >
              Купить на Литрес
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

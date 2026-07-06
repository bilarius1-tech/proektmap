import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ProektMap — Инженерный навигатор",
  description: "Пошаговое сопровождение от идеи до готового продукта. AI-консультант на каждом этапе.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  );
}

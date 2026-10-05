import type { Metadata } from "next";
import OrderLookup from "./lookup";

export const metadata: Metadata = {
  title: "Найти заказ — скачать книгу или файл | ProektMap",
  description: "Найдите оплаченный заказ магазина Карты роста по email и откройте страницу скачивания.",
  alternates: { canonical: "https://proektmap.ru/zakaz" },
};

export default function FindOrderPage() {
  return <OrderLookup />;
}

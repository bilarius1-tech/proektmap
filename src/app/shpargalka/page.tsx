import type { Metadata } from "next";
import ShpargalkaHubClient from "./hub-client";

export const metadata: Metadata = {
  title: "Шпаргалка промптов ChatGPT по профессиям | ProektMap",
  description:
    "Бесплатная русская коллекция готовых промптов: разработка, дизайн, маркетинг, Excel, юрист, финансы, книги и коучи. Скопировали шаблон — адаптировали под задачу.",
  alternates: {
    canonical: "https://proektmap.ru/shpargalka",
  },
  openGraph: {
    title: "Шпаргалка промптов по профессиям | ProektMap",
    description:
      "200+ русских шаблонов с фильтрами по профессии и задаче. Не Skills и не инженерные System Prompt — рабочая шпаргалка для чата.",
    url: "https://proektmap.ru/shpargalka",
    siteName: "ProektMap",
    type: "website",
  },
};

export default function ShpargalkaPage() {
  return <ShpargalkaHubClient />;
}

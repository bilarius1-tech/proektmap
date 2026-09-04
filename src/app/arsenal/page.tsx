import { Metadata } from "next";
import ArsenalHub from "./arsenal-hub";
import {
  getPublishedStacks,
  ARSENAL_TOOLS,
  ARSENAL_CATEGORIES,
} from "@/lib/arsenal";

export const metadata: Metadata = {
  title: "Нейро каталог — стеки AI-инструментов под задачу | ProektMap",
  description:
    "Нейро каталог ProektMap: 12 стеков под миссию — локальный AI, вайбкодинг, голос, Авито-фото, РФ-стек. Порядок использования, Definition of Done и мост к /resheniya.",
  alternates: {
    canonical: "https://proektmap.ru/arsenal",
  },
  openGraph: {
    title: "Нейро каталог — стеки под миссию | ProektMap",
    description:
      "Не свалка ссылок: готовые наборы 4–7 инструментов в понятном порядке с проверкой готовности.",
    url: "https://proektmap.ru/arsenal",
    siteName: "ProektMap",
    type: "website",
  },
};

export default function ArsenalPage() {
  const stacks = getPublishedStacks();
  return (
    <ArsenalHub stacks={stacks} tools={ARSENAL_TOOLS} categories={ARSENAL_CATEGORIES} />
  );
}

import AvitoCatalog from "./avito-catalog";
import { avitoTools, avitoCategories } from "./data";

export const metadata = {
  title: "Лаборатория Авито — экосистема инструментов под задачу",
  description:
    "Подбор инструментов Авито под задачу: парсеры, автопостинг, AI-чаты, аналитика, CRM, расширения. Фильтры по разделам и цене — не просто рейтинг сервисов.",
};

export default function AvitoPage() {
  return <AvitoCatalog tools={avitoTools} categories={avitoCategories} />;
}

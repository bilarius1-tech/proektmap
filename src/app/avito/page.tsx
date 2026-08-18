import AvitoCatalog from "./avito-catalog";
import { avitoTools, avitoCategories } from "./data";

export const metadata = {
  title: "Лаборатория Авито — сервисы и инструменты для продавца",
  description:
    "Каталог программ, сервисов и расширений для работы с Авито: аналитика, парсинг, автопостинг, AI, CRM, дизайн. Собрано и проверено в одном месте.",
};

export default function AvitoPage() {
  return <AvitoCatalog tools={avitoTools} categories={avitoCategories} />;
}

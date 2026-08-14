import type { Metadata } from "next";
import AiLandClient from "./client";

export const metadata: Metadata = {
  title: "AI-LAND: игровой квест для детей — Карта роста",
  description:
    "Игровой квест для детей 9–15 лет: исследуй AI Forest и научись составлять точные команды для искусственного интеллекта.",
};

export default function AiLandPage() {
  return <AiLandClient />;
}

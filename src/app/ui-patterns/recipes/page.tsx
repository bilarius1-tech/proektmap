import { Metadata } from "next";
import { UI_RECIPES, UI_PATTERNS } from "../data";
import RecipesClient from "./client";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Дизайн-Рецепты и Master-Промпты для AI-экранов | ProektMap",
  description: "Готовые проверенные связки UI-паттернов (Header + Bento + Dock + Tokens) для сборки целых экранов через Cursor и Claude Code.",
  alternates: {
    canonical: "https://proektmap.ru/ui-patterns/recipes",
  },
};

export default function Page() {
  return <RecipesClient recipes={UI_RECIPES} patterns={UI_PATTERNS} />;
}

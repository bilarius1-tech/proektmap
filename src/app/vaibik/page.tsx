import type { Metadata } from "next";
import GameMenu from "@/components/vaibik/game-menu";

export const metadata: Metadata = {
  title: "Главное меню «Вайбик: Миссия №1»",
  description:
    "Добро пожаловать в «Вайбик: Миссия №1» — детский квест по вайбкодингу для детей 9–12 лет. Начни миссию, узнай об игре или свяжись с автором Тимофеевым Алексеем.",
};

export default function HomePage() {
  return <GameMenu />;
}

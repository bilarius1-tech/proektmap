import type { Metadata } from "next";
import Quest from "@/components/vaibik/quest";

export const metadata: Metadata = {
  title: "Квест «Вайбик: Миссия №1» — пройди миссию",
  description:
    "Интерактивный детский квест «Вайбик: Миссия №1»: придумай игру вместе с роботом Вайбиком, составь промпт, запусти программу в VibeCraft и получи 50 XP и медаль вайбкодера.",
};

export default function QuestPage() {
  return <Quest />;
}

import VibeCraftKBClient from "./client";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "VibeCraft/ SourceCraft — база знаний | ProektMap",
  description: "Часто задаваемые вопросы о VibeCraft и SourceCraft от Яндекса. Как начать, ограничения, цены, сравнение с аналогами. Собрано из Telegram-чатов.",
};
export default function Page() {
  return <VibeCraftKBClient />;
}

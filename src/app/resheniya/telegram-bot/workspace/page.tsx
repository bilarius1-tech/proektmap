import type { Metadata } from "next";
import GuidedWorkspace from "../../saas-product/workspace/guided-workspace";
import { guidedTelegramSolution } from "../../telegram-guided-data";

export const metadata: Metadata = {
  title: "Создать Telegram-бота с командой /start — готовый маршрут",
  description: "Готовые шаги: оплата из РФ, где работать локально, Cursor, grammY, BotFather, /start и /help, deploy на VPS.",
  robots: { index: false, follow: true },
};

export default function TelegramBotWorkspacePage() {
  return (
    <GuidedWorkspace
      solution={guidedTelegramSolution}
      overviewHref="/resheniya/telegram-bot"
      storageKey="proektmap:resheniya:telegram-guided:v3-setup"
      finalCta="Бот запущен — завершить маршрут"
    />
  );
}

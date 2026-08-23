import type { Metadata } from "next";
import GuidedWorkspace from "../../saas-product/workspace/guided-workspace";
import { guidedTelegramSolution } from "../../telegram-guided-data";

export const metadata: Metadata = {
  title: "Создать Telegram-бота с командой /start — готовый маршрут",
  description: "10 готовых шагов: Cursor, grammY, BotFather, рабочие команды /start и /help, проверка и deploy на VPS через PM2.",
  robots: { index: false, follow: true },
};

export default function TelegramBotWorkspacePage() {
  return (
    <GuidedWorkspace
      solution={guidedTelegramSolution}
      overviewHref="/resheniya/telegram-bot"
      storageKey="proektmap:resheniya:telegram-guided:v1"
      finalCta="Бот запущен — завершить маршрут"
    />
  );
}

import type {
  VaibikAction,
  VaibikAudioId,
  VaibikIterationItem,
  VaibikTheme,
} from "./audio/vaibik-audio";

export const LINE_TEXT = {
  "mission1.welcome":
    "Привет! Я — Вайбик, твой робот-напарник. Добро пожаловать в космическую лабораторию!",
  "lab.intro.greet": "Привет! Я Вайбик! Ура-а!",
  "lab.intro.clever": "Я очень умный робот!",
  "lab.intro.secret": "Но у меня есть секрет...",
  "lab.intro.noMindRead": "Я не умею читать мысли!",
  "lab.intro.explain": "Честно-честно! Поэтому расскажи, что ты задумал.",
  "lab.intro.together": "Давай придумаем игру вместе!",
  "lab.theme.prompt": "Выбери тему игры:",
  "lab.theme.reaction.space": "Космос! Класс!",
  "lab.theme.reaction.dino": "Динозавры! Ух ты!",
  "lab.theme.reaction.cat": "Котик! Люблю котов!",
  "lab.action.reaction.stars": "Собирать звёзды! Отлично!",
  "lab.action.reaction.aliens": "Убегать от пришельцев! Здорово!",
  "lab.action.reaction.score": "Набирать очки! Супер!",
  "lab.learned":
    "ИИ не читает мысли! Ему нужно объяснить задачу словами — как ты объяснил мне.",
  "prompt.magic": "Смотри! Сейчас произойдёт волшебство...",
  "prompt.explain": "Ух ты! Промпт готов! Собираю твою игру!",
  "prompt.game": "Игра готова! Поехали!",
  "game.hint":
    "Но ИИ иногда ошибается. Давай проверим твою игру внимательнее!",
  "program.typing":
    "Вижу твой промпт! Сейчас я превращу его в настоящую программу...",
  "program.magic":
    "Ух ты! Слова оживают и становятся игрой! Посмотри, как всё засветилось!",
  "program.explain":
    "Запомни: работа с ИИ — это не просто красивые промпты. Мастер ИИ думает, объясняет, проверяет и исправляет. Этому надо учиться!",
  "program.reward": "Ты понял главный секрет вайбкодера!",
  "program.done": "Дальше — проверим игру!",
  "iteration.found":
    "Стоп-стоп! Не хватает одного предмета... Ой! Я поставил его за пределами игрового поля! Что будем делать?",
  "iteration.guide.quit":
    "Бросить? Нет-нет! Мы почти всё собрали — один предмет до победы! Попробуй ещё раз.",
  "iteration.guide.nothing":
    "Ничего не делать? Тогда предмет так и потеряется в космосе. А ведь мы можем всё исправить! Подумай ещё.",
  "iteration.guide.default":
    "Попробуй ещё раз! Как думаешь, что нужно сделать?",
  "iteration.fixed":
    "Отлично! Я объясню ИИ, где ошибка. Проверяю... Возвращаю предмет! Собери его!",
  "iteration.work": "Работает!",
  "iteration.explain":
    "Итерация — это повтор. Проверяешь → находишь проблему → объясняешь ИИ → получаешь лучше!",
  "iteration.done": "Ты настоящий вайбкодер!",
  "final.done": "Миссия выполнена! Ты настоящий вайбкодер!",
} as const;

const THEME_TEXT: Record<VaibikTheme, string> = {
  space: "космос",
  dino: "динозавры",
  cat: "котик",
};

const ACTION_TEXT: Record<VaibikAction, string> = {
  stars: "собирать звёзды",
  aliens: "убегать от пришельцев",
  score: "набирать очки",
};

const ITEM_TEXT: Record<VaibikIterationItem, string> = {
  stars: "звёзды",
  crystals: "кристаллы",
  coins: "монеты",
};

export function buildLabActionPrompt(theme: VaibikTheme) {
  return `Отлично — ${THEME_TEXT[theme]}! А что будем делать? Выбери действие:`;
}

export function buildLabDone(theme: VaibikTheme, action: VaibikAction) {
  return `Отлично! ${capitalize(THEME_TEXT[theme])} + ${ACTION_TEXT[action]} — теперь я всё понял и построю твою игру!`;
}

export function buildIterationPlay(item: VaibikIterationItem) {
  return `Проверь игру, что я построил! Собери все светящиеся ${ITEM_TEXT[item]}!`;
}

export function getQuestLineText(id: VaibikAudioId): string {
  if (id in LINE_TEXT) {
    return LINE_TEXT[id as keyof typeof LINE_TEXT];
  }

  const parts = id.split(".");
  if (parts[0] === "lab" && parts[1] === "action" && parts[2] === "prompt") {
    return buildLabActionPrompt(parts[3] as VaibikTheme);
  }
  if (parts[0] === "lab" && parts[1] === "done") {
    return buildLabDone(parts[2] as VaibikTheme, parts[3] as VaibikAction);
  }
  if (parts[0] === "iteration" && parts[1] === "play") {
    return buildIterationPlay(parts[2] as VaibikIterationItem);
  }
  return "";
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

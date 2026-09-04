# Нейро каталог — намеренные исключения

> Не путать с дедупом: это строки Excel, которые **осознанно не попали** в каталог (план §7.5).

| Источник | Имя / тема | Почему не в каталоге |
|----------|------------|----------------------|
| Промпты | The Gay Jailbreak Technique | Jailbreak / обход защит — не рекомендуем в продукте |
| Разное | AWESOME OSINT ARSENAL | Тяжёлый / серый OSINT-пробив |
| Разное | HuggingBay | Пиратский / сомнительный каталог моделей |
| Разное | BookHunter | Пиратские материалы |
| Разное | GPTDisguise | Маскировка UI / обход детекции |

**Итого исключено: 5** (gap Excel 298 уник. → каталог без них).

Дедуп Excel-дублей (одна карточка, `wasDuplicate: true`):

1. Agent Skills  
2. Understand Anything  
3. Agent Reach  
4. Real-ESRGAN  
5. HyperFrames  
6. AI Engineering (from Scratch)  
7. Awesome Nano Banana Pro → слит в `awesome-nano-banana-pro-prompts` (этап 10)

Скрипт QA ссылок: `npx tsx scripts/qa-arsenal-urls.ts`

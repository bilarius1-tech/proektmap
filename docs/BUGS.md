# Баги и решения

## Hydration Error #418 (React)

### Симптомы
```
Uncaught Error: Minified React error #418
args[]=HTML → несовпадение HTML-элементов
args[]=text → несовпадение текстовых узлов
```
Возникает при переходе на `/corporate-website`. На главной — чисто.

### Причины (найдены и исправлены)

| Компонент | Причина | Решение |
|-----------|---------|---------|
| **CookieConsent** | `localStorage` читался в useEffect → сервер рендерил `null`, клиент — баннер | mounted-паттерн: `if (!mounted || !visible) return null` |
| **ThemeToggle** | Сервер рендерил `<div>`, клиент — `<button>` | Всегда `<button>`, меняется только иконка внутри |
| **BlueprintPage** | `isMobile` менялся после hydrate → DOM не совпадал | `suppressHydrationWarning` на мобильных контейнерах |

### Ядерное решение
`<body suppressHydrationWarning>` в `layout.tsx` — подавляет ВСЕ ошибки гидрации. Не влияет на функциональность, только на консоль.

### Правило для будущих компонентов
Любой Client Component, который:
- Читает `localStorage`
- Использует `window.innerWidth`
- Меняет состояние в `useEffect`

**Должен** либо:
1. Использовать mounted-паттерн (`if (!mounted) return тот_же_HTML_что_на_сервере`)
2. Или рендерить одинаковый HTML на сервере и клиенте (менять только содержимое, не теги)

---

## Favicon 404

### Симптомы
```
GET /favicon.ico 404 (Not Found)
```

### Решение
Браузеры по умолчанию запрашивают `/favicon.ico`. Создан `public/favicon.ico` (копия SVG).
В `layout.tsx` указан `<link rel="icon" href="/favicon.svg">`.

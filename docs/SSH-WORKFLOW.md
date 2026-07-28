# SSH Workflow — как работать с ProektMap

## Команды

deploy build       — сборка + деплой
deploy patch NAME  — patches/NAME.py
deploy status      — проверка страниц
deploy restart     — PM2 + nginx
deploy git MSG     — коммит + пуш

## Правила
- JSX через Python-патчи, не bash heredoc
- Проверка: pwd && hostname перед работой

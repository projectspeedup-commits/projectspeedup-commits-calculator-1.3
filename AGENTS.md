# Project Identity & Facts

## Server Infrastructure
- **Server OS:** macOS (MacBook Pro 2017, 16GB RAM)
- **Primary User/Developer:** aleksandrtrusin
- **Tools:** Docker Desktop, Portainer

## Application Setup
- **Directory:** `/Users/aleksandrtrusin/Documents/my-server/ZMK Prodachion/zmk-server`
- **Process Manager:** Docker Compose (services: `zmk_production`, `zmk_supply`, `zmk_postgres`, `portainer`)
- **Git Repo:** GitHub (main branch)

## Update Workflow
*(Настроен автоматический пуллинг из GitHub через скрипт `auto-update.sh`)*
1. Выгрузка изменений в GitHub через меню AI Studio.
2. Скрипт `auto-update.sh` на MacBook автоматически каждые 60 секунд проверяет изменения в GitHub.
3. Если есть новые коммиты, скрипт делает `git fetch` и `git reset --hard origin/main`, затем перезапускает контейнеры.

## Custom Instructions
- Use Russian for communication with the user.
- Maintain industrial/logistics context for the UI/UX.
- Keep "Tech Support" instructions updated in `AdminPanelHelpTab.tsx`.

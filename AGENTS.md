# Project Identity & Facts

## Server Infrastructure
- **Server OS:** macOS (MacBook Pro 2017, 16GB RAM)
- **Primary User/Developer:** aleksandrtrusin
- **Tools:** Docker Desktop, Portainer

## Application Setup
- **Directory:** `/Users/aleksandrtrusin/Documents/my-server/ZMK Prodachion/zmk-arsenal-разработка-блок-производсво.`
- **Process Manager:** Docker Compose (services: `zmk_production`, `zmk_supply`, `portainer`)
- **Git Repo:** GitHub (main branch)

## Update Workflow
*(Настроен автоматический пуллинг из GitHub через скрипт `auto-update.sh`)*
1. Выгрузка изменений в GitHub через меню AI Studio.
2. Скрипт `auto-update.sh` на MacBook автоматически каждые 60 секунд проверяет изменения в GitHub.
3. Если есть новые коммиты, сервер сам выполняет `git pull` и пересоберет контейнеры: `docker compose up -d --build`.

## Custom Instructions
- Use Russian for communication with the user.
- Maintain industrial/logistics context for the UI/UX.
- Keep "Tech Support" instructions updated in `AdminPanelHelpTab.tsx`.

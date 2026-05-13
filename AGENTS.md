# Project Identity & Facts

## Server Infrastructure
- **Server OS:** macOS (MacBook Pro 2017, 16GB RAM)
- **Primary User/Developer:** aleksandrtrusin
- **Tools:** Docker Desktop, Portainer

## Application Setup
- **Directory:** `/Users/aleksandrtrusin/Documents/my-server/ZMK Prodachion/zmk-server`
- **Process Manager:** Docker Compose (services: `zmk_production`, `zmk_supply`, `zmk_postgres`, `portainer`)
- **Git Repo:** GitHub (main branch)

## Engineering Standards (Optimization)
1. **Modular UI**: Large components must be split into sub-components in `src/components/`.
2. **Global State**: Use Zustand store in `src/store/` for cross-component data (prices, settings). 
3. **Data Access**: All backend calls must go through `src/services/api/` or `src/services/db/`.
4. **Environment**: Production uses Multi-stage Docker build. 

## Update Workflow
*(Настроен автоматический пуллинг из GitHub через скрипт `auto-update.sh`)*
1. Выгрузка изменений в GitHub через меню AI Studio.
2. Скрипт `auto-update.sh` на MacBook автоматически каждые 10 секунд проверяет изменения в GitHub.
3. Если есть новые коммиты, скрипт делает `git fetch` и `git reset --hard origin/main`, затем перезапускает контейнеры.

## Custom Instructions
- Use Russian for communication with the user.
- Maintain industrial/logistics context for the UI/UX.
- Keep "Tech Support" instructions updated in `AdminPanelHelpTab.tsx`.

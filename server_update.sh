#!/bin/bash
# Скрипт для автоматического обновления приложения zmk-app
# Рекомендуется запускать через cron (например, раз в 5 минут)

# Переходим в директорию проекта
cd /home/aleksandr/zmk-app || exit

# Забираем информацию о ветке из удаленного репозитория (без слияния)
git fetch origin main

# Проверяем хэши коммитов
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})

if [ $LOCAL != $REMOTE ]; then
    echo "$(date) | Обнаружены новые изменения. Начинаем обновление..."
    
    # Применяем обновления
    git pull origin main
    
    # Запускаем сборку
    npm run build
    
    # Перезапускаем сервис в PM2
    pm2 restart zmk-app
    
    echo "$(date) | Обновление успешно завершено."
fi

#!/bin/bash

# Путь к приложению
APP_DIR=~/zmk-app
SERVICE_NAME=zmk-app

echo "--- Начинаю процесс автоматического обновления ---"
cd $APP_DIR || exit

# Проверка наличия изменений в удаленном репозитории
git fetch origin main

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse @{u})

if [ $LOCAL = $REMOTE ]; then
    echo "Обновлений не найдено. Сервер актуален."
else
    echo "Обнаружены изменения. Загружаю..."
    git pull origin main
    
    echo "Установка зависимостей..."
    npm install
    
    echo "Сборка приложения..."
    npm run build
    
    echo "Перезапуск сервиса..."
    pm2 restart $SERVICE_NAME
    
    echo "Обновление завершено успешно!"
fi

#!/bin/bash

# Переходим в папку проекта
cd "/Users/aleksandrtrusin/Documents/my-server/ZMK Prodachion/zmk-arsenal-разработка-блок-производсво."

# Проверяем обновления в GitHub
echo "Checking for updates..."
git fetch origin main

# Если есть изменения, скачиваем их и перезапускаем Docker
if [ $(git rev-parse HEAD) != $(git rev-parse @{u}) ]; then
    echo "New updates found! Pulling code..."
    git pull origin main
    
    # Пересобираем и перезапускаем только приложение
    docker compose up -d --build zmk_sales
    echo "App updated and restarted."
else
    echo "No updates found."
fi

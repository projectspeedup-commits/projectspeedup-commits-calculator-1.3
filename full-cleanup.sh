#!/bin/bash
# Скрипт для полной очистки проекта от старых библиотек и остатков Docker

echo "1. Останавливаем все контейнеры..."
docker compose down -v 2>/dev/null

echo "2. Удаляем старый Portainer (если остался)..."
docker rm -f portainer 2>/dev/null

echo "3. Очищаем локальные библиотеки Mac (нужен пароль администратора)..."
sudo rm -rf node_modules package-lock.json

echo "4. Очищаем неиспользуемые ресурсы Docker..."
docker system prune -f

echo "Очистка завершена! Теперь можно запускать 'docker compose up -d --build'"

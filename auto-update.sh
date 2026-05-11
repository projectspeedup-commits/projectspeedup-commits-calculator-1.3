#!/bin/bash

# Скрипт для автоматического обновления приложения из GitHub на macOS
# Вы можете запустить его в фоновом режиме или в tmux (screen), например: 
# ./auto-update.sh &

echo "Запуск скрипта авто-обновления... (проверка каждые 60 секунд)"

while true; do
  # Обновляем информацию из удаленного репозитория (без слияния)
  git fetch -q origin

  # Получаем хэши локального и удаленного коммитов
  LOCAL=$(git rev-parse HEAD)
  REMOTE=$(git rev-parse @{u} 2>/dev/null)

  # Если произошла ошибка при получении origin (например нет сети), пропускаем цикл
  if [ -z "$REMOTE" ]; then
    sleep 60
    continue
  fi

  if [ "$LOCAL" != "$REMOTE" ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Обнаружены изменения в GitHub! Начинаю обновление..."
    
    # Скачиваем изменения
    git pull origin main

    # Пересобираем и перезапускаем Docker контейнеры:
    echo "Пересобираю Docker-контейнеры..."
    docker compose down
    docker compose up -d --build

    echo "$(date '+%Y-%m-%d %H:%M:%S') - Обновление успешно завершено."
  fi

  # Ждем 1 минуту до следующей проверки
  sleep 60
done

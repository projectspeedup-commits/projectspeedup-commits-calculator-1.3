#!/bin/bash

# Скрипт для автоматического обновления приложения из GitHub на macOS
# Вы можете запустить его в фоновом режиме или в tmux (screen), например: 
# ./auto-update.sh &

echo "Запуск скрипта авто-обновления... (проверка каждые 10 секунд)"

# Переход в папку, где находится сам скрипт (корень проекта)
cd "$(dirname "$0")" || { echo "Не удалось перейти в папку проекта"; exit 1; }

while true; do
  # Обновляем информацию из удаленного репозитория (без слияния)
  git fetch -q origin

  # Получаем хэши локального и удаленного коммитов
  LOCAL=$(git rev-parse HEAD)
  REMOTE=$(git rev-parse origin/main 2>/dev/null)

  # Если произошла ошибка при получении origin (например нет сети), пропускаем цикл
  if [ -z "$REMOTE" ]; then
    sleep 10
    continue
  fi

  if [ "$LOCAL" != "$REMOTE" ]; then
    echo "$(date '+%Y-%m-%d %H:%M:%S') - Обнаружены изменения в GitHub! Начинаю обновление..."
    
    # Сбрасываем до состояния origin/main (быстрее чем pull)
    git reset --hard origin/main

    # пересобираем и перезапускаем Docker контейнеры:
    echo "Обновляю Docker-контейнеры..."
    docker-compose up -d --build

    echo "$(date '+%Y-%m-%d %H:%M:%S') - Обновление успешно завершено."
  fi

  # Ждем 10 секунд до следующей проверки
  sleep 10
done

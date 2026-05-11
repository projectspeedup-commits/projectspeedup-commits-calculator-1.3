# Используем легкий образ Node.js
FROM node:20-slim AS base

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код
COPY . .

# Сборка фронтенда (Vite)
RUN npm run build

# Пробрасываем порт (внутренний)
EXPOSE 3000

# Команда запуска (по умолчанию)
CMD ["npm", "run", "start"]

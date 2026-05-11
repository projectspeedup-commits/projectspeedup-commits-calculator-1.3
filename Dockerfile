# Используем проверенный образ Node.js
FROM node:20-slim

# Устанавливаем системные зависимости для сборки
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Устанавливаем tsx глобально, чтобы он точно был доступен
RUN npm install -g tsx

# Копируем конфиги
COPY package*.json ./

# Устанавливаем локальные зависимости
RUN npm install

# Копируем всё остальное
COPY . .

# Собираем фронтенд (создаем папку dist)
RUN npm run build

EXPOSE 3000

# Запуск
CMD ["npx", "tsx", "server.ts"]

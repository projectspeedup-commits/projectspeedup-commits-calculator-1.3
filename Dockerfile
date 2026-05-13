# Stage 1: Build
FROM node:20-slim AS builder
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20-slim
WORKDIR /app

# Устанавливаем tsx глобально для запуска
RUN npm install -g tsx

# Копируем зависимости и собранный фронтенд из builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./
COPY --from=builder /app/src ./src 
# Добавляем src, так как tsx читает server.ts который может импортировать из src

EXPOSE 3000
CMD ["tsx", "server.ts"]

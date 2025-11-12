# ============================================
# Stage 1: Build Frontend
# ============================================
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# 复制前端依赖文件
COPY frontend/package*.json ./

# 安装所有依赖（包括 devDependencies，用于构建）
RUN npm ci

# 复制前端源代码
COPY frontend/ ./

# 设置构建时的环境变量（Next.js 需要在构建时就有这些变量）
ARG NEXT_PUBLIC_AMAP_KEY
ARG NEXT_PUBLIC_API_URL=http://localhost:3001
ENV NEXT_PUBLIC_AMAP_KEY=${NEXT_PUBLIC_AMAP_KEY}
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

# 构建前端
RUN npm run build

# ============================================
# Stage 2: Build Backend
# ============================================
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# 复制后端依赖文件
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# 安装所有依赖（包括 devDependencies，用于构建）
RUN npm ci

# 生成 Prisma Client
RUN npx prisma generate

# 复制后端源代码
COPY backend/ ./

# 编译 TypeScript
RUN npm run build

# ============================================
# Stage 3: Production Runtime
# ============================================
FROM node:18-alpine AS production

# 安装运行时依赖 (Prisma 需要 OpenSSL)
RUN apk add --no-cache tini openssl

# 创建应用目录
WORKDIR /app

# 安装前端生产依赖
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm ci --only=production

# 安装后端生产依赖
WORKDIR /app
COPY backend/package*.json ./backend/
COPY backend/prisma ./backend/prisma/
WORKDIR /app/backend
RUN npm ci --only=production && npx prisma generate

# 回到应用根目录
WORKDIR /app

# 复制前端构建产物
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/next.config.js ./frontend/
COPY --from=frontend-builder /app/frontend/package*.json ./frontend/

# 复制后端构建产物
COPY --from=backend-builder /app/backend/dist ./backend/dist

# 创建启动脚本
COPY <<'EOF' /app/start.sh
#!/bin/sh
set -e

echo "🚀 Starting AI Travel Planner..."

# 优先使用 IPv4
export NODE_OPTIONS="--dns-result-order=ipv4first"

# 启动后端
cd /app/backend
echo "📡 Starting backend on port 3001..."
node dist/index.js &
BACKEND_PID=$!

# 启动前端
cd /app/frontend
echo "🎨 Starting frontend on port 5090..."
npx next start -p 5090 -H 0.0.0.0 &
FRONTEND_PID=$!

# 等待所有进程
echo "✅ Services started successfully!"
wait $BACKEND_PID $FRONTEND_PID
EOF

RUN chmod +x /app/start.sh

# 暴露端口
EXPOSE 3001 5090

# 健康检查 (使用 127.0.0.1 而不是 localhost 来强制使用 IPv4)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:5090 || exit 1

# 使用 tini 作为 init 进程
ENTRYPOINT ["/sbin/tini", "--"]

# 启动应用
CMD ["/app/start.sh"]

# 元数据
LABEL maintainer="Lvawe <your-email@example.com>"
LABEL description="AI-powered travel planning application with voice input and intelligent itinerary generation"
LABEL version="1.0.0"

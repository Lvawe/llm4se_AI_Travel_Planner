# 部署指南

本文档提供 AI Travel Planner 的详细部署说明。

## 目录

- [本地开发部署](#本地开发部署)
- [Docker 部署](#docker-部署)
- [生产环境部署](#生产环境部署)
- [阿里云镜像仓库配置](#阿里云镜像仓库配置)

## 本地开发部署

### 前置要求

- Node.js >= 18
- PostgreSQL >= 13
- npm 或 yarn

### 步骤

1. **克隆项目**
```bash
git clone https://github.com/Lvawe/llm4se_AI_Travel_Planner.git
cd llm4se_AI_Travel_Planner
```

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件，配置数据库连接等信息
```

3. **安装后端依赖**
```bash
cd backend
npm install
```

4. **运行数据库迁移**
```bash
npm run db:migrate
```

5. **启动后端服务**
```bash
npm run dev
# 后端运行在 http://localhost:3001
```

6. **安装前端依赖**（新终端）
```bash
cd frontend
npm install
```

7. **启动前端服务**
```bash
npm run dev
# 前端运行在 http://localhost:3000
```

## Docker 部署

### 使用 Docker Compose（推荐）

1. **确保 Docker 和 Docker Compose 已安装**

2. **配置环境变量**
```bash
cp .env.example .env
# 编辑 .env 文件
```

3. **启动所有服务**
```bash
docker-compose up -d
```

4. **查看日志**
```bash
docker-compose logs -f
```

5. **停止服务**
```bash
docker-compose down
```

6. **清理数据（谨慎使用）**
```bash
docker-compose down -v  # 会删除数据库数据
```

### 单独构建镜像

**构建后端镜像:**
```bash
docker build -f docker/Dockerfile.backend -t ai-travel-planner-backend ./backend
```

**构建前端镜像:**
```bash
docker build -f docker/Dockerfile.frontend -t ai-travel-planner-frontend ./frontend
```

## 生产环境部署

### 环境准备

1. **数据库配置**
   - 创建生产环境数据库
   - 配置数据库连接字符串
   - 运行数据库迁移

2. **环境变量配置**
   - 修改 JWT_SECRET 为强密码
   - 配置正确的 API URLs
   - 设置生产环境 API Keys

3. **域名和 SSL**
   - 配置域名解析
   - 使用 Let's Encrypt 或其他 SSL 证书

### 使用 Docker Compose 部署

1. **创建生产环境配置**
```bash
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    image: registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner-backend:latest
    restart: always
    environment:
      DATABASE_URL: ${DATABASE_URL}
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    ports:
      - "3001:3001"

  frontend:
    image: registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner-frontend:latest
    restart: always
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    ports:
      - "3000:3000"
```

2. **启动生产环境**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 使用 Nginx 反向代理

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # 前端
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 阿里云镜像仓库配置

### 创建命名空间和镜像仓库

1. 登录[阿里云容器镜像服务](https://cr.console.aliyun.com/)
2. 创建命名空间（如：`your-namespace`）
3. 创建镜像仓库：
   - `ai-travel-planner-backend`
   - `ai-travel-planner-frontend`

### 推送镜像到阿里云

1. **登录阿里云镜像仓库**
```bash
docker login registry.cn-hangzhou.aliyuncs.com
# 输入阿里云账号和密码
```

2. **标记镜像**
```bash
docker tag ai-travel-planner-backend registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner-backend:latest
docker tag ai-travel-planner-frontend registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner-frontend:latest
```

3. **推送镜像**
```bash
docker push registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner-backend:latest
docker push registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner-frontend:latest
```

### 从阿里云拉取镜像

```bash
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner-backend:latest
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner-frontend:latest
```

## GitHub Actions 自动部署

项目已配置 GitHub Actions，当推送到 `main` 或 `develop` 分支时会自动构建并推送镜像。

### 配置 Secrets

在 GitHub 仓库设置中添加以下 Secrets:

- `ALIYUN_USERNAME`: 阿里云账号
- `ALIYUN_PASSWORD`: 阿里云密码

### 修改配置

编辑 `.github/workflows/docker-build.yml`，将 `your-namespace` 替换为你的阿里云命名空间。

## 数据库迁移

### 创建新迁移

```bash
cd backend
npx prisma migrate dev --name migration_name
```

### 应用迁移到生产环境

```bash
npx prisma migrate deploy
```

## 健康检查

- 后端健康检查: `http://your-domain:3001/health`
- 前端访问: `http://your-domain:3000`

## 故障排查

### 后端无法连接数据库
- 检查 DATABASE_URL 环境变量
- 确认数据库服务正在运行
- 检查网络连接和防火墙设置

### 前端无法连接后端
- 检查 NEXT_PUBLIC_API_URL 配置
- 确认后端服务正在运行
- 检查 CORS 配置

### Docker 容器启动失败
- 查看日志: `docker-compose logs -f service-name`
- 检查端口占用: `lsof -i :3000` / `lsof -i :3001`
- 确认环境变量配置正确

## 性能优化建议

1. **使用 CDN** 加速静态资源
2. **启用 Gzip** 压缩
3. **配置缓存策略**
4. **数据库索引优化**
5. **使用 Redis** 缓存会话和频繁查询的数据

## 安全建议

1. **定期更新依赖**
2. **使用强密码** 配置 JWT_SECRET
3. **限制 API 请求频率**
4. **启用 HTTPS**
5. **定期备份数据库**

## 监控和日志

建议配置：
- 应用性能监控（APM）
- 日志收集和分析
- 错误追踪服务
- 服务器资源监控

## 支持

如有问题，请：
1. 查看[常见问题](./FAQ.md)
2. 提交 [Issue](https://github.com/Lvawe/llm4se_AI_Travel_Planner/issues)
3. 查看[文档](./README.md)

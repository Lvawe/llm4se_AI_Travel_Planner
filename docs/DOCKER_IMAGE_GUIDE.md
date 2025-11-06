# Docker 镜像使用指南

本文档说明如何使用预构建的 Docker 镜像文件直接运行 AI Travel Planner 项目。

## 下载镜像文件

### 方式 1: 从 GitHub Releases 下载

访问项目的 [Releases 页面](https://github.com/Lvawe/llm4se_AI_Travel_Planner/releases)，下载最新的 `ai-travel-planner.tar` 文件。

### 方式 2: 从阿里云镜像仓库拉取

```bash
docker pull registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest
```

## 使用 tar 文件运行

### 1. 加载镜像

```bash
docker load -i ai-travel-planner.tar
```

加载成功后会显示:
```
Loaded image: ai-travel-planner:latest
```

### 2. 准备环境配置

创建 `.env` 文件（或使用项目提供的 `env.example` 作为模板）:

```bash
# 数据库配置
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@host.docker.internal:25432/postgres

# JWT 密钥
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# 阿里云 DashScope API Key
DASHSCOPE_API_KEY=sk-your-dashscope-api-key

# 高德地图 API Key
NEXT_PUBLIC_AMAP_KEY=your-amap-api-key

# API 地址
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. 启动数据库代理 (如果使用 Supabase IPv6)

如果你的数据库是 Supabase 且仅支持 IPv6，需要先启动 socat 代理:

```bash
# macOS/Linux
socat TCP-LISTEN:25432,fork,reuseaddr TCP:db.sygvmnyyzyynuewppitb.supabase.co:5432 &

# Windows (需要安装 socat)
# 或者修改 DATABASE_URL 直接连接数据库
```

### 4. 运行容器

```bash
docker run -d \
  --name ai-travel-planner \
  -p 5090:5090 \
  -p 3001:3001 \
  --add-host host.docker.internal:host-gateway \
  --env-file .env \
  ai-travel-planner:latest
```

**参数说明:**
- `-d`: 后台运行
- `--name`: 容器名称
- `-p 5090:5090`: 映射前端端口
- `-p 3001:3001`: 映射后端端口
- `--add-host`: 允许容器访问宿主机
- `--env-file`: 指定环境变量文件

### 5. 验证运行状态

```bash
# 查看容器日志
docker logs ai-travel-planner

# 检查健康状态
curl http://localhost:3001/health
curl http://localhost:5090
```

### 6. 访问应用

- 前端: http://localhost:5090
- 后端 API: http://localhost:3001
- 健康检查: http://localhost:3001/health

## 使用 docker-compose (推荐)

如果你下载了完整的项目代码，可以使用 docker-compose:

### 1. 加载镜像

```bash
docker load -i ai-travel-planner.tar
```

### 2. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    image: ai-travel-planner:latest
    container_name: ai-travel-planner
    ports:
      - "5090:5090"
      - "3001:3001"
    extra_hosts:
      - "host.docker.internal:host-gateway"
    dns:
      - 8.8.8.8
      - 1.1.1.1
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
      - DASHSCOPE_API_KEY=${DASHSCOPE_API_KEY}
      - NEXT_PUBLIC_AMAP_KEY=${NEXT_PUBLIC_AMAP_KEY}
      - NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
    env_file:
      - .env
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:5090"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    restart: unless-stopped
```

### 3. 启动服务

```bash
# 启动数据库代理 (如果需要)
socat TCP-LISTEN:25432,fork,reuseaddr TCP:db.sygvmnyyzyynuewppitb.supabase.co:5432 &

# 启动应用
docker-compose up -d
```

## 常见问题

### 1. 容器无法连接数据库

**问题:** 容器启动后无法连接到数据库，日志显示 `the URL must start with the protocol postgresql://`

**原因:**
- `.env` 文件不存在或未正确加载
- `DATABASE_URL` 格式错误或为空

**解决方案:**
```bash
# 1. 确认 .env 文件存在
ls -la .env

# 2. 如果不存在，从模板创建
cp env.example .env

# 3. 编辑 .env 文件，确保 DATABASE_URL 正确
# Docker 部署必须使用代理地址:
DATABASE_URL="postgresql://postgres:PASSWORD@host.docker.internal:25432/postgres"

# 4. 确认 socat 代理正在运行
lsof -i :25432

# 5. 如果代理未运行，启动它
socat TCP-LISTEN:25432,fork,reuseaddr TCP:db.YOUR_PROJECT.supabase.co:5432 &

# 6. 重启容器
docker restart ai-travel-planner

# 7. 查看日志确认
docker logs ai-travel-planner
```

**检查清单:**
- ✅ `.env` 文件存在于项目根目录
- ✅ `DATABASE_URL` 格式正确: `postgresql://user:pass@host:port/db`
- ✅ socat 代理在端口 25432 运行
- ✅ 容器启动时使用了 `--env-file .env` 或 `--add-host host.docker.internal:host-gateway`

### 2. 前端无法访问

**问题:** 访问 http://localhost:5090 无响应

**解决方案:**
- 检查容器是否正在运行: `docker ps`
- 查看容器日志: `docker logs ai-travel-planner`
- 确认端口没有被占用: `lsof -i :5090`

### 3. API 调用失败

**问题:** 前端可以访问但 API 调用失败

**解决方案:**
- 检查 `NEXT_PUBLIC_API_URL` 是否设置为 `http://localhost:3001`
- 验证后端服务: `curl http://localhost:3001/health`
- 检查 API Key 是否正确配置

### 4. 地图无法显示

**问题:** 高德地图组件无法加载

**解决方案:**
- 确认 `NEXT_PUBLIC_AMAP_KEY` 已正确设置
- 检查浏览器控制台是否有错误信息
- 验证 API Key 是否有效

## 容器管理命令

```bash
# 查看运行中的容器
docker ps

# 查看所有容器（包括停止的）
docker ps -a

# 停止容器
docker stop ai-travel-planner

# 启动容器
docker start ai-travel-planner

# 重启容器
docker restart ai-travel-planner

# 删除容器
docker rm ai-travel-planner

# 查看容器日志
docker logs ai-travel-planner

# 实时查看日志
docker logs -f ai-travel-planner

# 进入容器
docker exec -it ai-travel-planner sh

# 查看容器资源使用
docker stats ai-travel-planner
```

## 镜像管理

```bash
# 查看已加载的镜像
docker images

# 删除镜像
docker rmi ai-travel-planner:latest

# 导出镜像
docker save -o ai-travel-planner.tar ai-travel-planner:latest

# 加载镜像
docker load -i ai-travel-planner.tar

# 压缩镜像文件
gzip ai-travel-planner.tar
# 解压
gunzip ai-travel-planner.tar.gz
```

## 生产环境部署建议

### 1. 使用环境变量

不要在 `.env` 文件中硬编码敏感信息，使用环境变量或密钥管理服务。

### 2. 配置反向代理

使用 Nginx 或 Traefik 作为反向代理:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 3. 启用 HTTPS

使用 Let's Encrypt 获取免费 SSL 证书:

```bash
certbot --nginx -d your-domain.com
```

### 4. 配置日志持久化

```bash
docker run -d \
  --name ai-travel-planner \
  -p 5090:5090 \
  -p 3001:3001 \
  -v /var/log/ai-travel-planner:/app/logs \
  --add-host host.docker.internal:host-gateway \
  --env-file .env \
  ai-travel-planner:latest
```

### 5. 设置自动重启

使用 `--restart unless-stopped` 确保容器意外停止后自动重启:

```bash
docker run -d \
  --name ai-travel-planner \
  --restart unless-stopped \
  -p 5090:5090 \
  -p 3001:3001 \
  --add-host host.docker.internal:host-gateway \
  --env-file .env \
  ai-travel-planner:latest
```

## 性能优化

### 1. 限制资源使用

```bash
docker run -d \
  --name ai-travel-planner \
  --memory="1g" \
  --cpus="1.0" \
  -p 5090:5090 \
  -p 3001:3001 \
  --env-file .env \
  ai-travel-planner:latest
```

### 2. 使用镜像缓存

构建时使用 BuildKit 加速:

```bash
DOCKER_BUILDKIT=1 docker build -t ai-travel-planner:latest .
```

## 更新镜像

### 从阿里云镜像仓库更新

```bash
# 拉取最新镜像
docker pull registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest

# 停止并删除旧容器
docker stop ai-travel-planner
docker rm ai-travel-planner

# 使用新镜像启动
docker run -d \
  --name ai-travel-planner \
  --restart unless-stopped \
  -p 5090:5090 \
  -p 3001:3001 \
  --add-host host.docker.internal:host-gateway \
  --env-file .env \
  registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest
```

## 技术支持

- GitHub Issues: https://github.com/Lvawe/llm4se_AI_Travel_Planner/issues
- 项目文档: [README.md](./README.md)
- Docker 构建指南: [DOCKER_GUIDE.md](./DOCKER_GUIDE.md)

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](./LICENSE) 文件。

# 🐳 Docker 部署指南

本文档详细说明如何使用 Docker 部署 AI Travel Planner 应用。

## 📋 目录

- [快速开始](#快速开始)
- [使用预构建镜像](#使用预构建镜像)
- [本地构建镜像](#本地构建镜像)
- [使用 Docker Compose](#使用-docker-compose)
- [环境变量配置](#环境变量配置)
- [常见问题](#常见问题)

## 🚀 快速开始

### 方式一：使用预构建镜像（推荐）

从阿里云容器镜像仓库拉取最新镜像：

```bash
# 拉取镜像
docker pull registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest

# 运行容器
docker run -d \
  --name ai-travel-planner \
  -p 5090:5090 \
  -p 3001:3001 \
  -e DATABASE_URL="your_database_url" \
  -e DASHSCOPE_API_KEY="your_api_key" \
  -e NEXT_PUBLIC_AMAP_KEY="your_amap_key" \
  registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest
```

访问应用：
- 前端: http://localhost:5090
- 后端 API: http://localhost:3001

### 方式二：使用 Docker Compose

```bash
# 1. 克隆项目
git clone https://github.com/Lvawe/llm4se_AI_Travel_Planner.git
cd llm4se_AI_Travel_Planner

# 2. 配置环境变量
cp .env.example .env
# 编辑 .env 文件，填写实际配置

# 3. 启动服务
docker-compose up -d

# 4. 查看日志
docker-compose logs -f

# 5. 停止服务
docker-compose down
```

## 🔧 使用预构建镜像

### 从阿里云容器镜像仓库拉取

```bash
# 拉取最新版本
docker pull registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest

# 拉取指定版本（如果有标签）
docker pull registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:v1.0.0
```

### 运行容器

#### 基础运行

```bash
docker run -d \
  --name ai-travel-planner \
  -p 5090:5090 \
  -p 3001:3001 \
  registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest
```

#### 完整配置运行

```bash
docker run -d \
  --name ai-travel-planner \
  --restart unless-stopped \
  -p 5090:5090 \
  -p 3001:3001 \
  -e DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres" \
  -e JWT_SECRET="your-super-secret-key" \
  -e JWT_EXPIRES_IN="7d" \
  -e DASHSCOPE_API_KEY="sk-your-api-key" \
  -e LLM_MODEL="qwen-turbo" \
  -e NEXT_PUBLIC_AMAP_KEY="your-amap-key" \
  -e NEXT_PUBLIC_API_URL="http://localhost:3001" \
  --health-cmd="wget --no-verbose --tries=1 --spider http://localhost:5090 || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest
```

### 使用环境变量文件

创建 `.env` 文件：

```env
DATABASE_URL=postgresql://postgres:password@db.xxx.supabase.co:5432/postgres
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d
DASHSCOPE_API_KEY=sk-your-api-key
LLM_MODEL=qwen-turbo
NEXT_PUBLIC_AMAP_KEY=your-amap-key
NEXT_PUBLIC_API_URL=http://localhost:3001
```

运行容器：

```bash
docker run -d \
  --name ai-travel-planner \
  -p 5090:5090 \
  -p 3001:3001 \
  --env-file .env \
  registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest
```

## 🏗️ 本地构建镜像

如果你想自己构建镜像：

```bash
# 1. 克隆项目
git clone https://github.com/Lvawe/llm4se_AI_Travel_Planner.git
cd llm4se_AI_Travel_Planner

# 2. 构建镜像
docker build -t ai-travel-planner:local .

# 3. 运行容器
docker run -d \
  --name ai-travel-planner \
  -p 5090:5090 \
  -p 3001:3001 \
  --env-file .env \
  ai-travel-planner:local
```

### 多平台构建

如果需要构建支持多平台的镜像（amd64 和 arm64）：

```bash
# 创建并使用 buildx builder
docker buildx create --use --name multi-platform-builder

# 构建多平台镜像
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t ai-travel-planner:multi \
  --push \
  .
```

## 📦 使用 Docker Compose

### 基础使用

```bash
# 启动服务（后台运行）
docker-compose up -d

# 查看运行状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 停止并删除数据
docker-compose down -v
```

### 重新构建

```bash
# 重新构建镜像
docker-compose build

# 不使用缓存重新构建
docker-compose build --no-cache

# 重新构建并启动
docker-compose up -d --build
```

### 扩展配置

创建 `docker-compose.override.yml` 文件用于本地开发：

```yaml
version: '3.8'

services:
  ai-travel-planner:
    volumes:
      - ./frontend:/app/frontend
      - ./backend:/app/backend
    environment:
      - NODE_ENV=development
```

## 🔑 环境变量配置

### 必需环境变量

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `DATABASE_URL` | Supabase 数据库连接字符串 | `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres` |
| `DASHSCOPE_API_KEY` | 阿里云百炼 API Key | `sk-xxxxxxxxxxxxxxxx` |
| `NEXT_PUBLIC_AMAP_KEY` | 高德地图 API Key | `xxxxxxxxxxxxxxxx` |

### 可选环境变量

| 变量名 | 默认值 | 说明 |
|--------|--------|------|
| `JWT_SECRET` | `your-secret-key` | JWT 加密密钥 |
| `JWT_EXPIRES_IN` | `7d` | JWT 过期时间 |
| `BACKEND_PORT` | `3001` | 后端端口 |
| `LLM_MODEL` | `qwen-turbo` | LLM 模型名称 |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | 前端访问后端的 URL |

### 配置文件方式

创建 `.env` 文件：

```bash
# 复制示例文件
cp .env.example .env

# 编辑配置
nano .env  # 或使用你喜欢的编辑器
```

## 🔍 容器管理

### 查看容器状态

```bash
# 列出运行中的容器
docker ps

# 列出所有容器（包括已停止的）
docker ps -a

# 查看容器详细信息
docker inspect ai-travel-planner

# 查看容器资源使用情况
docker stats ai-travel-planner
```

### 容器日志

```bash
# 查看实时日志
docker logs -f ai-travel-planner

# 查看最近 100 行日志
docker logs --tail 100 ai-travel-planner

# 查看指定时间范围的日志
docker logs --since 1h ai-travel-planner
```

### 进入容器

```bash
# 进入容器 shell
docker exec -it ai-travel-planner sh

# 执行命令
docker exec ai-travel-planner ls -la /app
```

### 停止和删除

```bash
# 停止容器
docker stop ai-travel-planner

# 启动容器
docker start ai-travel-planner

# 重启容器
docker restart ai-travel-planner

# 删除容器
docker rm ai-travel-planner

# 强制删除运行中的容器
docker rm -f ai-travel-planner
```

## 🩺 健康检查

容器内置了健康检查功能：

```bash
# 查看健康状态
docker inspect --format='{{.State.Health.Status}}' ai-travel-planner

# 查看健康检查日志
docker inspect --format='{{json .State.Health}}' ai-travel-planner | jq
```

健康检查配置：
- 检查间隔: 30 秒
- 超时时间: 10 秒
- 启动延迟: 40 秒
- 重试次数: 3 次

## 🐛 常见问题

### 1. 端口被占用

**错误信息**:
```
Error: bind: address already in use
```

**解决方案**:
```bash
# 查找占用端口的进程
lsof -i :5090
lsof -i :3001

# 使用不同端口运行
docker run -p 8090:5090 -p 8001:3001 ...
```

### 2. 容器无法启动

**检查步骤**:

```bash
# 1. 查看容器日志
docker logs ai-travel-planner

# 2. 检查环境变量是否正确
docker exec ai-travel-planner env

# 3. 检查容器状态
docker inspect ai-travel-planner
```

### 3. 数据库连接失败

**检查清单**:
- ✅ `DATABASE_URL` 格式是否正确
- ✅ Supabase 项目是否正常运行
- ✅ 数据库密码是否正确
- ✅ 网络连接是否正常

### 4. 前端无法访问后端

**解决方案**:

确保 `NEXT_PUBLIC_API_URL` 配置正确：
- Docker 内部访问: `http://localhost:3001`
- 外部访问: `http://your-server-ip:3001`

### 5. 镜像拉取失败

**解决方案**:

```bash
# 1. 检查网络连接
ping registry.cn-hangzhou.aliyuncs.com

# 2. 配置镜像加速器（中国大陆用户）
# 编辑 /etc/docker/daemon.json
{
  "registry-mirrors": [
    "https://mirror.ccs.tencentyun.com",
    "https://registry.docker-cn.com"
  ]
}

# 3. 重启 Docker
sudo systemctl restart docker
```

## 📊 性能优化

### 资源限制

```bash
docker run -d \
  --name ai-travel-planner \
  --memory="2g" \
  --cpus="2" \
  -p 5090:5090 \
  -p 3001:3001 \
  registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest
```

### 日志限制

```bash
docker run -d \
  --name ai-travel-planner \
  --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  -p 5090:5090 \
  -p 3001:3001 \
  registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest
```

## 🔐 安全建议

1. **使用强密钥**: 生产环境必须修改 `JWT_SECRET`
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **限制容器权限**: 使用非 root 用户运行（镜像已配置）

3. **网络隔离**: 使用 Docker 网络隔离

4. **定期更新**: 保持镜像更新到最新版本

5. **环境变量保护**: 不要将敏感信息提交到代码仓库

## 📮 获取帮助

如果遇到问题：

1. 查看[常见问题](#常见问题)部分
2. 检查容器日志: `docker logs ai-travel-planner`
3. 在 [GitHub Issues](https://github.com/Lvawe/llm4se_AI_Travel_Planner/issues) 提问

---

🎉 祝你部署顺利！

# Docker 镜像测试目录

这是一个独立的测试环境，模拟用户下载 Docker 镜像文件后的使用场景。

## 📦 文件说明

- `ai-travel-planner.tar` - Docker 镜像文件 (326MB)
- `.env` - 环境变量配置文件
- `env.example` - 环境变量配置模板
- `README.md` - 本文档

## 🚀 快速启动

### 方法 1: 一键启动（推荐）

```bash
# 1. 确保 socat 代理正在运行（如果使用 Supabase）
lsof -i :25432

# 如果代理未运行，启动它：
socat TCP-LISTEN:25432,fork,reuseaddr TCP:db.sygvmnyyzyynuewppitb.supabase.co:5432 &

# 2. 加载镜像
docker load -i ai-travel-planner.tar

# 3. 运行容器
docker run -d \
  --name ai-travel-planner \
  --restart unless-stopped \
  -p 5090:5090 \
  -p 3001:3001 \
  --add-host host.docker.internal:host-gateway \
  --env-file .env \
  ai-travel-planner:latest

# 4. 查看日志
docker logs -f ai-travel-planner
```

### 方法 2: 使用脚本启动

```bash
# 运行启动脚本（即将创建）
./start.sh
```

## 🔍 验证运行

```bash
# 检查容器状态
docker ps | grep ai-travel

# 测试后端服务
curl http://localhost:3001/health

# 测试前端服务
curl http://localhost:5090

# 在浏览器中访问
open http://localhost:5090
```

## 📍 访问地址

- 前端应用: http://localhost:5090
- 后端 API: http://localhost:3001
- 健康检查: http://localhost:3001/health

## ⚙️ 配置说明

环境变量配置在 `.env` 文件中：

- `DATABASE_URL` - 数据库连接地址（已配置为使用代理）
- `JWT_SECRET` - JWT 密钥
- `DASHSCOPE_API_KEY` - 阿里云 API Key
- `NEXT_PUBLIC_AMAP_KEY` - 高德地图 API Key
- `NEXT_PUBLIC_API_URL` - 后端 API 地址

## 🛠️ 常用命令

```bash
# 停止容器
docker stop ai-travel-planner

# 启动容器
docker start ai-travel-planner

# 重启容器
docker restart ai-travel-planner

# 删除容器
docker rm -f ai-travel-planner

# 查看日志
docker logs ai-travel-planner

# 实时查看日志
docker logs -f ai-travel-planner

# 进入容器
docker exec -it ai-travel-planner sh

# 清理（删除容器和镜像）
docker rm -f ai-travel-planner
docker rmi ai-travel-planner:latest
```

## 🐛 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker logs ai-travel-planner

# 检查端口是否被占用
lsof -i :5090
lsof -i :3001
```

### 数据库连接失败

```bash
# 检查代理是否运行
lsof -i :25432

# 启动代理
socat TCP-LISTEN:25432,fork,reuseaddr TCP:db.sygvmnyyzyynuewppitb.supabase.co:5432 &

# 重启容器
docker restart ai-travel-planner
```

### 前端或后端无响应

```bash
# 检查容器健康状态
docker ps

# 查看最近的错误日志
docker logs ai-travel-planner --tail 50

# 重启容器
docker restart ai-travel-planner
```

## 📖 更多信息

- 完整文档: [DOCKER_IMAGE_GUIDE.md](../DOCKER_IMAGE_GUIDE.md)
- 项目主页: https://github.com/Lvawe/llm4se_AI_Travel_Planner
- 问题反馈: https://github.com/Lvawe/llm4se_AI_Travel_Planner/issues

## ✅ 测试清单

- [ ] 镜像文件已下载 (ai-travel-planner.tar)
- [ ] .env 文件已配置
- [ ] socat 代理已启动 (如果需要)
- [ ] 镜像已加载 (docker images)
- [ ] 容器已运行 (docker ps)
- [ ] 后端健康检查通过 (curl http://localhost:3001/health)
- [ ] 前端可访问 (curl http://localhost:5090)
- [ ] 浏览器可打开应用

# AI Travel Planner - Release Notes

## Version 1.0.0 (2025-11-05)

### 🎉 首次发布

这是 AI Travel Planner 的首个正式版本，提供完整的 Docker 镜像和部署支持。

### 📦 Docker 镜像信息

**镜像大小**: 约 326MB (压缩后约 325MB)

**镜像包含**:
- ✅ 完整的前端应用 (Next.js 14)
- ✅ 完整的后端服务 (Express.js)
- ✅ 所有依赖和运行时环境
- ✅ 生产优化配置

**基础镜像**: node:18-alpine

### 🚀 快速开始

#### 方法 1: 使用 tar 镜像文件

1. **下载文件**
   - `ai-travel-planner.tar` (326MB) - 原始镜像
   - `ai-travel-planner.tar.gz` (325MB) - 压缩镜像

2. **加载镜像**
   ```bash
   # 如果下载的是 .tar.gz，先解压
   gunzip ai-travel-planner.tar.gz
   
   # 加载镜像
   docker load -i ai-travel-planner.tar
   ```

3. **运行容器**
   ```bash
   # 使用快速启动脚本（推荐）
   ./quick-start.sh ai-travel-planner.tar
   
   # 或手动运行
   docker run -d \
     --name ai-travel-planner \
     --restart unless-stopped \
     -p 5090:5090 \
     -p 3001:3001 \
     --add-host host.docker.internal:host-gateway \
     --env-file .env \
     ai-travel-planner:latest
   ```

#### 方法 2: 从阿里云镜像仓库拉取

```bash
# 拉取最新镜像
docker pull registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest

# 运行容器
docker run -d \
  --name ai-travel-planner \
  --restart unless-stopped \
  -p 5090:5090 \
  -p 3001:3001 \
  --add-host host.docker.internal:host-gateway \
  --env-file .env \
  registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest
```

### ✨ 核心功能

#### 🎤 智能语音填写
- 浏览器原生语音识别 (Web Speech API)
- 中文语音转文字，智能提取关键信息
- 自动填充表单字段（目的地、天数、预算、人数）

#### 🤖 AI 行程规划
- 阿里云通义千问 (qwen-turbo) 智能生成
- 详细日程安排和景点推荐
- 智能预算分配和费用预估

#### 📍 地图集成
- 高德地图 JS API 2.0
- 实时位置标记和路线导航
- 响应式交互体验

#### 💰 费用管理
- 多分类费用记录（餐饮/交通/住宿/娱乐/其他）
- 实时预算跟踪和可视化图表
- 超支提醒

#### 🔐 用户系统
- JWT 身份认证
- 云端数据同步 (Supabase)
- 多设备访问

### 🛠️ 技术栈

**前端**:
- Next.js 14 (App Router)
- TypeScript 5
- Tailwind CSS
- Zustand (状态管理)

**后端**:
- Express.js
- Prisma ORM
- PostgreSQL (Supabase)
- JWT 认证

**AI & 服务**:
- 阿里云百炼 DashScope (qwen-turbo)
- 高德地图 Web API + JS API 2.0
- Web Speech API

### 📋 环境要求

#### 必需配置

在运行容器前，需要准备以下配置（在 `.env` 文件中）:

```env
# 数据库连接（Supabase）
DATABASE_URL="postgresql://postgres:password@host:5432/database"

# JWT 密钥
JWT_SECRET="your-secret-key"

# 阿里云 API Key
DASHSCOPE_API_KEY="sk-your-key"

# 高德地图 API Key
NEXT_PUBLIC_AMAP_KEY="your-amap-key"

# API 地址
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

参考 `.env.example` 文件获取完整配置说明。

#### API Keys 获取

1. **Supabase** (数据库)
   - 访问: https://supabase.com/
   - 创建项目并获取数据库连接字符串

2. **阿里云百炼 DashScope**
   - 访问: https://dashscope.console.aliyun.com/
   - 创建 API Key

3. **高德地图**
   - 访问: https://console.amap.com/
   - 创建应用并获取 Web 服务 API Key

### ⚙️ 端口配置

- **5090**: 前端应用 (Next.js)
- **3001**: 后端 API (Express)

确保这些端口未被占用。

### 🔧 特殊配置

#### Supabase IPv6 连接

如果使用 Supabase 数据库（仅支持 IPv6），Docker 容器无法直接连接。需要在宿主机启动代理:

```bash
# macOS/Linux
socat TCP-LISTEN:25432,fork,reuseaddr TCP:db.xxx.supabase.co:5432 &

# 然后在 .env 中配置
DATABASE_URL="postgresql://postgres:password@host.docker.internal:25432/postgres"
```

详见 [DOCKER_IMAGE_GUIDE.md](DOCKER_IMAGE_GUIDE.md)

### 📖 文档

- **快速开始**: [README.md](README.md)
- **Docker 镜像使用指南**: [DOCKER_IMAGE_GUIDE.md](DOCKER_IMAGE_GUIDE.md)
- **Docker 构建指南**: [DOCKER_GUIDE.md](DOCKER_GUIDE.md)
- **快速启动脚本**: [quick-start.sh](quick-start.sh)

### 🐛 已知问题

1. **IPv6 数据库连接**: Docker 容器不支持 IPv6，需要使用 socat 代理
2. **首次启动较慢**: 前端构建和 Prisma 初始化需要时间（约 30-40 秒）
3. **语音识别**: 依赖浏览器支持，需要 HTTPS 或 localhost 环境

### 🔄 CI/CD

项目已配置 GitHub Actions 自动构建流程:
- 代码推送到 `main` 分支时自动触发
- 自动构建 Docker 镜像
- 推送到阿里云容器镜像仓库

### 📊 性能指标

- **镜像大小**: 326MB
- **冷启动时间**: ~40秒
- **前端首屏加载**: <2秒
- **API 响应时间**: <100ms (不含 LLM 调用)
- **LLM 响应时间**: 2-5秒

### 🔐 安全建议

1. **修改 JWT_SECRET**: 生产环境务必使用强随机密钥
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **使用 HTTPS**: 生产环境配置反向代理和 SSL 证书

3. **定期更新**: 及时更新依赖包和安全补丁

4. **限制访问**: 配置防火墙规则，只开放必要端口

5. **备份数据**: 定期备份数据库

### 🆘 故障排除

#### 容器无法启动
```bash
# 查看日志
docker logs ai-travel-planner

# 检查配置
docker inspect ai-travel-planner
```

#### 数据库连接失败
```bash
# 检查代理是否运行
lsof -i :25432

# 测试数据库连接
psql "postgresql://user:pass@host:port/db"
```

#### 端口被占用
```bash
# 查看端口占用
lsof -i :5090
lsof -i :3001

# 杀死占用进程
kill -9 <PID>
```

### 📞 支持

- **GitHub Issues**: https://github.com/Lvawe/llm4se_AI_Travel_Planner/issues
- **项目主页**: https://github.com/Lvawe/llm4se_AI_Travel_Planner
- **文档**: 查看项目 README 和 Docker 指南

### 📝 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

### 🙏 致谢

感谢以下开源项目和服务:
- Next.js
- React
- Express.js
- Prisma
- Supabase
- 阿里云百炼
- 高德地图
- Docker

---

**发布日期**: 2025-11-06 
**版本**: v1.0.0  
**镜像标签**: `latest`, `v1.0.0`

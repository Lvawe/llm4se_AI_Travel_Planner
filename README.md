# 🧳 AI Travel Planner - AI 旅行规划师

> 基于 AI 的智能旅行规划应用，支持语音输入、智能行程规划、费用管理和地图导航。

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 📖 文档导航

- 📘 **[完整文档索引](./DOCS_INDEX.md)** - 查看所有文档
- 🚀 **[快速开始](./QUICKSTART.md)** - 5 分钟快速上手
- 🎤 **[语音和 AI 功能](./VOICE_AND_AI_GUIDE.md)** - 核心功能使用指南
- 🏗️ **[项目结构](./PROJECT_STRUCTURE.md)** - 代码结构详解

## ✨ 核心功能

- 🎤 **语音输入** - 使用浏览器语音识别 API，支持中文语音转文字
- 🤖 **AI 智能规划** - 接入阿里云通义千问，自动生成个性化旅行行程
- 📍 **地图集成** - 高德地图显示目的地位置和路线
- 💰 **费用管理** - 记录旅行支出，实时预算跟踪
- 🔐 **用户系统** - 安全的注册登录，数据云端同步
- 📱 **响应式设计** - 适配各种设备尺寸

## 🏗️ 技术栈

| 类型 | 技术 |
|------|------|
| **前端** | Next.js 14, TypeScript, Tailwind CSS, Zustand |
| **后端** | Express.js, TypeScript, Prisma ORM |
| **数据库** | Supabase (PostgreSQL) |
| **认证** | JWT + bcrypt |
| **AI** | 阿里云百炼（通义千问 qwen-turbo） |
| **地图** | 高德地图 JS API 2.0 |
| **语音** | Web Speech API |

## 🚀 快速开始

### 1️⃣ 克隆项目

```bash
git clone https://github.com/Lvawe/llm4se_AI_Travel_Planner.git
cd llm4se_AI_Travel_Planner
```

### 2️⃣ 配置数据库（Supabase）

1. 访问 [Supabase](https://supabase.com/) 创建免费项目
2. 获取数据库连接字符串
3. 详细步骤：[docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)

### 3️⃣ 配置环境变量

**后端** `backend/.env`:
```bash
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
BACKEND_PORT=3001
JWT_SECRET="your-secret-key"

# 阿里云百炼 API
DASHSCOPE_API_KEY="sk-your-api-key"
LLM_MODEL="qwen-turbo"
```

**前端** `frontend/.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AMAP_KEY="your-amap-key"
```

### 4️⃣ 启动项目

```bash
# 后端
cd backend
npm install
npx prisma migrate dev  # 数据库迁移
npm run dev

# 前端（新终端）
cd frontend
npm install
npm run dev
```

访问 http://localhost:5090 🎉

## 快速开始

### 前置要求

- Node.js >= 18
- Docker & Docker Compose（可选）
- Supabase 账号（免费）

### 环境配置

1. 克隆项目
```bash
git clone https://github.com/Lvawe/llm4se_AI_Travel_Planner.git
cd llm4se_AI_Travel_Planner
```

2. 创建 Supabase 项目

   - 访问 [Supabase](https://supabase.com/) 创建免费账号
   - 创建新项目，选择 Tokyo 或 Singapore 区域
   - 获取数据库连接字符串
   - 详细步骤请参考 [Supabase 配置指南](./docs/SUPABASE_SETUP.md)

3. 配置环境变量

在项目根目录创建 `.env` 文件:

```env
# Supabase 数据库配置（推荐）
DATABASE_URL="postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres"

# 或使用本地 PostgreSQL
# DATABASE_URL="postgresql://user:password@localhost:5432/travel_planner"

# JWT 密钥
JWT_SECRET="your-secret-key-change-in-production"
JWT_EXPIRES_IN="7d"

# 服务端口
BACKEND_PORT=3001
FRONTEND_PORT=3000

# API Keys (可以在应用设置页面配置)
# 科大讯飞语音 API
IFLYTEK_APP_ID=""
IFLYTEK_API_KEY=""
IFLYTEK_API_SECRET=""

# 阿里云百炼 API (或其他 LLM)
LLM_API_KEY=""
LLM_API_URL=""

# 高德地图 API
AMAP_API_KEY=""
```

### 本地开发

#### 方式一：使用 Supabase（推荐，支持云端同步）

```bash
# 1. 配置 Supabase（参考 docs/SUPABASE_SETUP.md）

# 2. 启动后端
cd backend
npm install
npm run db:generate  # 生成 Prisma Client
npm run db:migrate   # 运行数据库迁移
npm run dev

# 3. 启动前端（新终端）
cd frontend
npm install
npm run dev
```

访问:
- 前端: http://localhost:3000
- 后端 API: http://localhost:3001

#### 方式二：使用 Docker Compose（本地数据库）

```bash
# 启动所有服务（包括 PostgreSQL）
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

访问:
- 前端: http://localhost:3000
- 后端 API: http://localhost:3001

#### 手动启动

1. 启动数据库
```bash
docker run -d \
  --name travel-planner-db \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=travel_planner \
  -p 5432:5432 \
  postgres:15
```

2. 启动后端
```bash
cd backend
npm install
npm run db:migrate  # 运行数据库迁移
npm run dev
```

3. 启动前端
```bash
cd frontend
npm install
npm run dev
```

### Docker 镜像使用

#### 拉取镜像

```bash
# 从阿里云镜像仓库拉取
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest
```

#### 运行镜像

```bash
# 使用 docker-compose
docker-compose -f docker/docker-compose.prod.yml up -d
```

## 项目结构

```
.
├── frontend/               # Next.js 前端应用
│   ├── src/
│   │   ├── app/           # 应用路由
│   │   ├── components/    # React 组件
│   │   ├── lib/           # 工具函数
│   │   ├── hooks/         # 自定义 Hooks
│   │   └── types/         # TypeScript 类型定义
│   ├── public/            # 静态资源
│   └── package.json
│
├── backend/               # Express 后端应用
│   ├── src/
│   │   ├── routes/        # API 路由
│   │   ├── controllers/   # 控制器
│   │   ├── models/        # 数据模型
│   │   ├── middleware/    # 中间件
│   │   ├── services/      # 业务逻辑
│   │   └── utils/         # 工具函数
│   ├── prisma/            # Prisma 配置
│   └── package.json
│
├── docker/                # Docker 配置
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
## 📂 项目结构

```
llm4se_AI_Travel_Planner/
├── frontend/              # Next.js 前端
│   ├── src/
│   │   ├── app/          # 页面路由
│   │   ├── components/   # UI 组件
│   │   ├── lib/          # 工具函数
│   │   └── store/        # 状态管理
│   └── package.json
│
├── backend/              # Express 后端
│   ├── src/
│   │   ├── routes/       # API 路由
│   │   ├── services/     # 业务逻辑
│   │   └── middleware/   # 中间件
│   ├── prisma/           # 数据库 Schema
│   └── package.json
│
├── docs/                 # 详细文档
│   ├── SUPABASE_SETUP.md
│   ├── API_CONFIG.md
│   └── ...
│
├── QUICKSTART.md         # 快速开始指南
├── VOICE_AND_AI_GUIDE.md # 语音和 AI 功能使用说明
└── README.md             # 本文件
```

## 📖 详细文档

| 文档 | 说明 |
|------|------|
| [快速开始](./QUICKSTART.md) | 5 分钟快速上手指南 |
| [语音和 AI 功能](./VOICE_AND_AI_GUIDE.md) | 语音输入和 AI 规划使用说明 |
| [Supabase 配置](./docs/SUPABASE_SETUP.md) | 数据库配置详细步骤 |
| [API 配置](./docs/API_CONFIG.md) | API Key 获取和配置 |
| [开发指南](./docs/DEVELOPMENT.md) | 开发环境和规范 |
| [部署指南](./docs/DEPLOYMENT.md) | 生产环境部署 |

## 🔑 API Key 配置

获取以下服务的 API Key：

1. **阿里云百炼**（必需，AI 功能）
   - 访问：https://bailian.console.aliyun.com/
   - 获取 DashScope API Key
   - 配置到 `backend/.env` 的 `DASHSCOPE_API_KEY`

2. **高德地图**（必需，地图功能）
   - 访问：https://console.amap.com/
   - 创建 Web 服务应用
   - 配置到 `frontend/.env.local` 的 `NEXT_PUBLIC_AMAP_KEY`

3. **Supabase**（必需，数据库）
   - 访问：https://supabase.com/
   - 创建项目，获取数据库连接字符串
   - 配置到 `backend/.env` 的 `DATABASE_URL`

详细配置步骤：[docs/API_CONFIG.md](./docs/API_CONFIG.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 👤 作者

- GitHub: [@Lvawe](https://github.com/Lvawe)
- 项目地址: https://github.com/Lvawe/llm4se_AI_Travel_Planner

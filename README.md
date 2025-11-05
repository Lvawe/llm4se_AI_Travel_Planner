# AI Travel Planner - AI 旅行规划师

一个基于 AI 的智能旅行规划应用，支持语音输入、智能行程规划、费用管理等功能。

## 项目简介

本项目旨在简化旅行规划过程，通过 AI 了解用户需求，自动生成详细的旅行路线和建议，并提供实时旅行辅助。

## 核心功能

### ✅ 已完成功能
- ✅ 用户注册与登录系统
- ✅ 云端数据同步（Supabase）
- ✅ 行程创建与管理
- ✅ 费用记录与预算跟踪
- ✅ 高德地图集成
- ✅ 响应式 UI 设计

### 🚧 开发中功能
- 🚧 AI 智能行程生成（LLM 集成）
- 🚧 语音输入功能（讯飞语音识别）
- 🚧 路线规划与导航
- 🚧 实时旅行助手

## 技术栈

### 前端
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **地图**: 高德地图 API
- **语音识别**: 科大讯飞语音 API

### 后端
- **框架**: Express.js
- **语言**: TypeScript
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **认证**: JWT
- **AI**: 阿里云百炼/其他 LLM API

### 部署
- **容器化**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **镜像仓库**: 阿里云镜像仓库

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
├── .github/               # GitHub Actions 配置
│   └── workflows/
│
└── README.md
```

## API 文档

### 认证接口

#### 注册
```
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "张三"
}
```

#### 登录
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "张三"
  }
}
```

### 行程规划接口

详细 API 文档请参考 [API.md](./docs/API.md)

## API Key 配置说明

**重要**: 请勿将 API Key 直接写入代码中！

### 配置方式

1. **通过环境变量** (推荐生产环境)
   - 在 `.env` 文件中配置
   - 通过 Docker 环境变量传入

2. **通过应用设置页面** (推荐用户使用)
   - 访问应用设置页面
   - 输入各项 API Key
   - 保存后即可使用

### API Key 获取

- **科大讯飞语音**: https://console.xfyun.cn/
- **阿里云百炼**: https://bailian.console.aliyun.com/
- **高德地图**: https://console.amap.com/

## 开发指南

### 提交规范

使用 Conventional Commits 规范:

```
feat: 添加新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具链相关
```

### 分支策略

- `main`: 生产环境分支
- `develop`: 开发分支
- `feature/*`: 功能分支
- `bugfix/*`: Bug 修复分支

## 测试

```bash
# 后端测试
cd backend
npm run test

# 前端测试
cd frontend
npm run test
```

## 部署

详细部署文档请参考 [DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## 贡献

欢迎提交 Issue 和 Pull Request!

## 许可证

MIT License

## 联系方式

- GitHub: [@Lvawe](https://github.com/Lvawe)
- 项目地址: https://github.com/Lvawe/llm4se_AI_Travel_Planner

## 更新日志

详细更新日志请参考 [CHANGELOG.md](./CHANGELOG.md)

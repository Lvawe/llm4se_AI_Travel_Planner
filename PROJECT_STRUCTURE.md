# 项目结构说明

## 📁 目录结构

```
llm4se_AI_Travel_Planner/
│
├── 📂 frontend/                    # 前端应用（Next.js）
│   ├── public/                     # 静态资源
│   ├── src/
│   │   ├── app/                    # Next.js 应用路由
│   │   │   ├── (auth)/            # 认证相关页面组
│   │   │   │   ├── login/         # 登录页面
│   │   │   │   └── register/      # 注册页面
│   │   │   ├── dashboard/         # 仪表盘（首页）
│   │   │   ├── trips/             # 行程管理
│   │   │   │   ├── new/           # 创建新行程
│   │   │   │   └── [id]/          # 行程详情页
│   │   │   ├── layout.tsx         # 全局布局
│   │   │   └── page.tsx           # 根页面
│   │   │
│   │   ├── components/            # React 组件
│   │   │   ├── AmapComponent.tsx  # 高德地图组件
│   │   │   └── VoiceInput.tsx     # 语音输入组件
│   │   │
│   │   ├── lib/                   # 工具库
│   │   │   └── api.ts             # API 请求封装
│   │   │
│   │   └── store/                 # 状态管理
│   │       └── authStore.ts       # 认证状态
│   │
│   ├── .env.local                 # 前端环境变量
│   ├── next.config.js             # Next.js 配置
│   ├── tailwind.config.ts         # Tailwind CSS 配置
│   └── package.json               # 前端依赖
│
├── 📂 backend/                     # 后端应用（Express）
│   ├── prisma/
│   │   ├── migrations/            # 数据库迁移文件
│   │   └── schema.prisma          # Prisma 数据模型
│   │
│   ├── src/
│   │   ├── routes/                # API 路由
│   │   │   ├── auth.ts            # 认证路由
│   │   │   ├── trip.ts            # 行程路由
│   │   │   ├── expense.ts         # 费用路由
│   │   │   ├── apiKey.ts          # API Key 管理
│   │   │   └── ai.ts              # AI 规划路由
│   │   │
│   │   ├── services/              # 业务逻辑服务
│   │   │   └── llmService.ts      # AI 服务（DashScope）
│   │   │
│   │   ├── middleware/            # 中间件
│   │   │   └── auth.ts            # JWT 认证中间件
│   │   │
│   │   └── index.ts               # 应用入口
│   │
│   ├── .env                       # 后端环境变量
│   ├── tsconfig.json              # TypeScript 配置
│   └── package.json               # 后端依赖
│
├── 📂 docker/                      # Docker 配置
│   ├── Dockerfile.frontend        # 前端镜像
│   ├── Dockerfile.backend         # 后端镜像
│   └── docker-compose.yml         # 容器编排
│
├── 📂 docs/                        # 详细文档
│   ├── SUPABASE_SETUP.md          # Supabase 配置指南
│   ├── API_CONFIG.md              # API Key 配置说明
│   ├── DEVELOPMENT.md             # 开发指南
│   └── DEPLOYMENT.md              # 部署指南
│
├── 📄 README.md                    # 项目简介
├── 📄 QUICKSTART.md                # 快速开始
├── 📄 VOICE_AND_AI_GUIDE.md        # 语音和 AI 功能使用说明
├── 📄 LICENSE                      # MIT 许可证
├── 📄 .gitignore                   # Git 忽略文件
└── 📄 docker-compose.yml           # 根目录 Docker 编排
```

## 🔍 核心文件说明

### 前端关键文件

| 文件 | 说明 |
|------|------|
| `frontend/src/app/layout.tsx` | 全局布局，配置字体、元数据等 |
| `frontend/src/app/trips/new/page.tsx` | 创建行程页面，集成语音输入和 AI 生成 |
| `frontend/src/components/VoiceInput.tsx` | 语音输入组件（Web Speech API） |
| `frontend/src/components/AmapComponent.tsx` | 高德地图组件 |
| `frontend/src/lib/api.ts` | Axios 实例配置，处理 API 请求和认证 |
| `frontend/src/store/authStore.ts` | Zustand 认证状态管理 |
| `frontend/.env.local` | 前端环境变量（API URL、地图 Key） |

### 后端关键文件

| 文件 | 说明 |
|------|------|
| `backend/src/index.ts` | Express 应用入口，注册路由和中间件 |
| `backend/src/routes/ai.ts` | AI 行程规划路由 |
| `backend/src/services/llmService.ts` | LLM 服务，调用阿里云通义千问 API |
| `backend/src/middleware/auth.ts` | JWT 认证中间件 |
| `backend/prisma/schema.prisma` | 数据库模型定义 |
| `backend/.env` | 后端环境变量（数据库、API Keys） |

### 配置文件

| 文件 | 说明 |
|------|------|
| `frontend/next.config.js` | Next.js 配置，设置图片域名等 |
| `frontend/tailwind.config.ts` | Tailwind CSS 主题配置 |
| `backend/tsconfig.json` | TypeScript 编译配置 |
| `docker-compose.yml` | Docker 容器编排配置 |

## 📝 数据库模型

### User（用户表）
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  trips     Trip[]
  expenses  Expense[]
  apiKeys   ApiKey?
}
```

### Trip（行程表）
```prisma
model Trip {
  id          String   @id @default(cuid())
  userId      String
  destination String
  startDate   DateTime
  endDate     DateTime
  budget      Float
  travelers   Int
  preferences String[]
  description String?
  itinerary   Json?      # 存储 AI 生成的行程计划
  status      String
  expenses    Expense[]
}
```

### Expense（费用表）
```prisma
model Expense {
  id          String   @id @default(cuid())
  tripId      String
  userId      String
  category    String
  amount      Float
  description String
  date        DateTime
}
```

### ApiKey（API 密钥表）
```prisma
model ApiKey {
  id        String   @id @default(cuid())
  userId    String   @unique
  iFlytek   Json?
  llm       Json?
  amap      Json?
}
```

## 🛣️ API 路由

### 认证路由 (`/api/auth`)
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 行程路由 (`/api/trips`)
- `GET /api/trips` - 获取用户所有行程
- `GET /api/trips/:id` - 获取单个行程详情
- `POST /api/trips` - 创建新行程
- `PUT /api/trips/:id` - 更新行程
- `DELETE /api/trips/:id` - 删除行程

### 费用路由 (`/api/expenses`)
- `GET /api/expenses` - 获取所有费用
- `GET /api/expenses/trip/:tripId` - 获取行程的所有费用
- `POST /api/expenses` - 添加费用记录
- `PUT /api/expenses/:id` - 更新费用
- `DELETE /api/expenses/:id` - 删除费用

### AI 路由 (`/api/ai`)
- `POST /api/ai/generate-plan` - 生成 AI 行程计划

### API Key 路由 (`/api/api-keys`)
- `GET /api/api-keys` - 获取用户的 API Keys
- `PUT /api/api-keys` - 更新 API Keys

## 🎨 前端页面路由

| 路由 | 页面 | 说明 |
|------|------|------|
| `/` | 首页 | 重定向到 dashboard 或 login |
| `/login` | 登录页 | 用户登录 |
| `/register` | 注册页 | 用户注册 |
| `/dashboard` | 仪表盘 | 显示行程统计和列表 |
| `/trips/new` | 创建行程 | 语音输入 + AI 生成 |
| `/trips/[id]` | 行程详情 | 查看行程和管理费用 |

## 🔐 认证流程

1. 用户注册/登录 → 后端验证 → 生成 JWT
2. 前端保存 token 到 localStorage
3. Axios 拦截器自动在请求头添加 token
4. 后端 authMiddleware 验证 token
5. 验证通过 → 执行业务逻辑

## 📦 依赖说明

### 前端核心依赖
- `next` - React 框架
- `react` - UI 库
- `typescript` - 类型检查
- `tailwindcss` - CSS 框架
- `zustand` - 状态管理
- `axios` - HTTP 客户端
- `react-hot-toast` - 通知提示
- `@amap/amap-jsapi-loader` - 高德地图

### 后端核心依赖
- `express` - Web 框架
- `typescript` - 类型检查
- `@prisma/client` - ORM 客户端
- `prisma` - ORM 工具
- `bcryptjs` - 密码加密
- `jsonwebtoken` - JWT 认证
- `axios` - HTTP 客户端（调用外部 API）
- `zod` - 数据验证

## 🚀 开发命令

### 前端
```bash
cd frontend
npm install          # 安装依赖
npm run dev          # 启动开发服务器（端口 5090）
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
```

### 后端
```bash
cd backend
npm install          # 安装依赖
npx prisma generate  # 生成 Prisma Client
npx prisma migrate dev  # 运行数据库迁移
npm run dev          # 启动开发服务器（端口 3001）
npm run build        # 编译 TypeScript
npm start            # 启动生产服务器
```

## 🔧 环境变量

### 后端 `.env`
```bash
DATABASE_URL=postgresql://...     # Supabase 数据库连接
BACKEND_PORT=3001                 # 后端端口
JWT_SECRET=your-secret            # JWT 密钥
DASHSCOPE_API_KEY=sk-xxx          # 阿里云 API Key
LLM_MODEL=qwen-turbo              # AI 模型
```

### 前端 `.env.local`
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001    # 后端 API 地址
NEXT_PUBLIC_AMAP_KEY=your-amap-key           # 高德地图 Key
```

## 📚 相关文档

- [快速开始](../QUICKSTART.md) - 5 分钟快速上手
- [语音和 AI 功能](../VOICE_AND_AI_GUIDE.md) - 语音输入和 AI 规划详细说明
- [Supabase 配置](./SUPABASE_SETUP.md) - 数据库配置步骤
- [API 配置](./API_CONFIG.md) - API Key 获取和配置
- [开发指南](./DEVELOPMENT.md) - 开发规范和最佳实践
- [部署指南](./DEPLOYMENT.md) - 生产环境部署

---

**更新日期**: 2025-11-05

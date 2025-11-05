# 开发指南

## 快速开始

### 方式一：使用 Docker（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/Lvawe/llm4se_AI_Travel_Planner.git
cd llm4se_AI_Travel_Planner

# 2. 启动所有服务
./start.sh

# 或手动启动
docker-compose up -d
```

访问:
- 前端: http://localhost:3000
- 后端: http://localhost:3001
- 健康检查: http://localhost:3001/health

### 方式二：本地开发

#### 前置要求
- Node.js >= 18
- PostgreSQL >= 13
- npm 或 yarn

#### 后端设置

```bash
cd backend

# 安装依赖
npm install

# 生成 Prisma Client
npm run db:generate

# 运行数据库迁移
npm run db:migrate

# 启动开发服务器
npm run dev
```

#### 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 项目结构说明

```
.
├── frontend/                 # Next.js 前端应用
│   ├── src/
│   │   ├── app/             # 应用路由（App Router）
│   │   │   ├── page.tsx     # 首页
│   │   │   ├── login/       # 登录页
│   │   │   ├── register/    # 注册页
│   │   │   └── layout.tsx   # 根布局
│   │   ├── components/      # React 组件
│   │   ├── lib/             # 工具函数
│   │   │   └── api.ts       # API 客户端
│   │   ├── store/           # 状态管理
│   │   │   └── authStore.ts # 认证状态
│   │   └── types/           # TypeScript 类型
│   └── package.json
│
├── backend/                 # Express 后端应用
│   ├── src/
│   │   ├── index.ts         # 入口文件
│   │   ├── routes/          # API 路由
│   │   │   ├── auth.ts      # 认证相关
│   │   │   ├── trip.ts      # 行程管理
│   │   │   ├── expense.ts   # 费用管理
│   │   │   └── apiKey.ts    # API Key 管理
│   │   └── middleware/      # 中间件
│   │       └── auth.ts      # JWT 认证
│   ├── prisma/
│   │   └── schema.prisma    # 数据库模型
│   └── package.json
│
├── docker/                  # Docker 配置
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
│
├── .github/
│   └── workflows/           # GitHub Actions
│
└── docs/                    # 文档
    └── DEPLOYMENT.md
```

## 技术栈详解

### 前端

- **Next.js 14**: React 框架，使用 App Router
- **TypeScript**: 类型安全
- **Tailwind CSS**: 原子化 CSS 框架
- **Zustand**: 轻量级状态管理
- **Axios**: HTTP 客户端
- **React Hot Toast**: 消息提示

### 后端

- **Express**: Node.js Web 框架
- **Prisma**: 现代化 ORM
- **PostgreSQL**: 关系型数据库
- **JWT**: 认证令牌
- **bcryptjs**: 密码加密
- **Zod**: 数据验证

## API 文档

### 认证接口

#### 注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "张三"
}

Response: 201
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "张三",
    "createdAt": "2025-11-05T00:00:00.000Z"
  }
}
```

#### 登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200
{
  "token": "jwt-token",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "张三",
    "createdAt": "2025-11-05T00:00:00.000Z"
  }
}
```

### 行程接口

所有行程接口需要在 Header 中携带 JWT Token:
```
Authorization: Bearer <token>
```

#### 获取所有行程
```http
GET /api/trips
```

#### 获取单个行程
```http
GET /api/trips/:id
```

#### 创建行程
```http
POST /api/trips
Content-Type: application/json

{
  "destination": "日本",
  "startDate": "2025-12-01T00:00:00.000Z",
  "endDate": "2025-12-05T00:00:00.000Z",
  "budget": 10000,
  "travelers": 2,
  "preferences": ["美食", "动漫", "亲子"]
}
```

## 数据库模型

### User（用户）
- id: 主键
- email: 邮箱（唯一）
- password: 密码（加密）
- name: 姓名
- createdAt: 创建时间
- updatedAt: 更新时间

### Trip（行程）
- id: 主键
- userId: 用户 ID（外键）
- destination: 目的地
- startDate: 开始日期
- endDate: 结束日期
- budget: 预算
- travelers: 旅行人数
- preferences: 偏好（数组）
- itinerary: 详细行程（JSON）
- status: 状态（draft/planned/ongoing/completed）

### Expense（费用）
- id: 主键
- tripId: 行程 ID（外键）
- userId: 用户 ID（外键）
- category: 类别
- amount: 金额
- currency: 货币
- description: 描述
- date: 日期

### ApiKey（API 密钥）
- id: 主键
- userId: 用户 ID（外键）
- iFlytek: 科大讯飞配置（JSON）
- llm: LLM 配置（JSON）
- amap: 高德地图配置（JSON）

## 开发工作流

### 1. 创建新功能

```bash
# 创建新分支
git checkout -b feature/new-feature

# 开发...

# 提交
git add .
git commit -m "feat: 添加新功能"

# 推送
git push origin feature/new-feature

# 创建 Pull Request
```

### 2. 数据库变更

```bash
cd backend

# 修改 prisma/schema.prisma

# 创建迁移
npm run db:migrate -- --name add_new_field

# 生成 Prisma Client
npm run db:generate
```

### 3. 添加新路由

**后端:**
1. 在 `backend/src/routes/` 创建新文件
2. 在 `backend/src/index.ts` 中注册路由

**前端:**
1. 在 `frontend/src/app/` 创建新目录
2. 添加 `page.tsx` 文件

## 调试技巧

### 后端调试

```bash
# 查看日志
docker-compose logs -f backend

# 进入容器
docker-compose exec backend sh

# 查看数据库
cd backend
npm run db:studio
```

### 前端调试

使用浏览器开发者工具:
- Network 标签查看 API 请求
- Console 查看日志
- React DevTools 查看组件状态

## 常见问题

### Q: 端口被占用
```bash
# 查看端口占用
lsof -i :3000
lsof -i :3001

# 杀死进程
kill -9 <PID>
```

### Q: 数据库连接失败
- 检查 `.env` 中的 `DATABASE_URL`
- 确认 PostgreSQL 服务正在运行
- 检查防火墙设置

### Q: 前端无法连接后端
- 检查 `NEXT_PUBLIC_API_URL` 配置
- 确认后端服务正在运行
- 检查浏览器控制台的 CORS 错误

## 测试

```bash
# 后端测试
cd backend
npm run test

# 前端测试
cd frontend
npm run test

# E2E 测试（待实现）
npm run test:e2e
```

## 代码规范

### Commit 规范

使用 Conventional Commits:

```
feat: 新功能
fix: Bug 修复
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

示例:
```bash
git commit -m "feat: 添加语音识别功能"
git commit -m "fix: 修复登录页面样式问题"
git commit -m "docs: 更新 API 文档"
```

### 代码风格

- 使用 ESLint 和 Prettier
- TypeScript 严格模式
- 组件使用函数式写法
- 使用有意义的变量名

## 下一步开发计划

1. **语音识别功能**
   - 集成科大讯飞语音 API
   - 实现语音转文字
   - 添加语音输入按钮

2. **AI 行程规划**
   - 集成大语言模型 API
   - 实现行程生成算法
   - 优化提示词工程

3. **地图导航**
   - 集成高德地图
   - 显示景点位置
   - 路线规划

4. **费用管理**
   - 费用记录界面
   - 预算分析图表
   - 语音记账功能

## 参考资源

- [Next.js 文档](https://nextjs.org/docs)
- [Prisma 文档](https://www.prisma.io/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [科大讯飞 API](https://www.xfyun.cn/doc/)
- [高德地图 API](https://lbs.amap.com/api/)

## 获取帮助

- 查看 [README.md](../README.md)
- 查看 [部署文档](./DEPLOYMENT.md)
- 提交 [Issue](https://github.com/Lvawe/llm4se_AI_Travel_Planner/issues)

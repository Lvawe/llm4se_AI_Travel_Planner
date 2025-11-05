# AI Travel Planner 项目概述

**项目名称**: AI 旅行规划师 (AI Travel Planner)  
**GitHub 仓库**: https://github.com/Lvawe/llm4se_AI_Travel_Planner  
**开发时间**: 2025年11月5日开始  
**当前版本**: v0.1.0 (基础架构)

## 项目简介

AI Travel Planner 是一个基于人工智能的智能旅行规划 Web 应用，旨在通过 AI 技术简化旅行规划过程。用户可以通过语音或文字输入旅行需求，系统会自动生成个性化的旅行路线、预算分析和实时导航辅助。

## 核心功能

### ✅ 已实现功能

1. **用户管理系统**
   - 用户注册（邮箱 + 密码）
   - 用户登录（JWT 认证）
   - 密码加密存储（bcrypt）
   - 会话管理（Token 自动刷新）

2. **基础架构**
   - 前端：Next.js 14 + TypeScript + Tailwind CSS
   - 后端：Express + TypeScript + Prisma ORM
   - 数据库：PostgreSQL
   - 容器化：Docker + Docker Compose
   - CI/CD：GitHub Actions

3. **数据模型设计**
   - User（用户表）
   - Trip（行程表）
   - Expense（费用表）
   - ApiKey（API密钥表）

### 🚧 开发中功能

1. **智能行程规划**
   - 支持语音输入旅行需求
   - AI 自动生成个性化路线
   - 包含交通、住宿、景点、餐厅等信息
   - 支持行程编辑和调整

2. **费用预算与管理**
   - 智能预算分析
   - 实时费用追踪
   - 支持语音记账
   - 费用分类统计

3. **地图导航**
   - 实时位置定位
   - 景点路线规划
   - 附近推荐功能

4. **云端同步**
   - 多设备数据同步
   - 离线缓存支持

## 技术栈

### 前端技术
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **UI 组件**: Lucide React Icons
- **消息提示**: React Hot Toast

### 后端技术
- **框架**: Express.js
- **语言**: TypeScript
- **ORM**: Prisma
- **数据库**: PostgreSQL 15
- **认证**: JWT (jsonwebtoken)
- **密码加密**: bcryptjs
- **数据验证**: Zod

### 第三方服务（计划集成）
- **语音识别**: 科大讯飞语音 API
- **AI 规划**: 阿里云百炼或其他 LLM API
- **地图服务**: 高德地图 API

### 开发工具
- **容器化**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **镜像仓库**: 阿里云容器镜像服务
- **版本控制**: Git & GitHub

## 项目结构

```
llm4se_AI_Travel_Planner/
├── frontend/                 # Next.js 前端
│   ├── src/
│   │   ├── app/             # 页面路由
│   │   ├── components/      # React 组件
│   │   ├── lib/             # 工具库
│   │   ├── store/           # 状态管理
│   │   └── types/           # 类型定义
│   └── package.json
│
├── backend/                 # Express 后端
│   ├── src/
│   │   ├── routes/          # API 路由
│   │   ├── middleware/      # 中间件
│   │   └── index.ts         # 入口文件
│   ├── prisma/
│   │   └── schema.prisma    # 数据库模型
│   └── package.json
│
├── docker/                  # Docker 配置
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
│
├── docs/                    # 项目文档
│   ├── DEPLOYMENT.md        # 部署文档
│   ├── DEVELOPMENT.md       # 开发指南
│   └── PROGRESS.md          # 进度跟踪
│
├── .github/
│   └── workflows/           # CI/CD 配置
│
├── docker-compose.yml       # Docker Compose 配置
├── README.md               # 项目说明
├── CHANGELOG.md            # 更新日志
└── .env.example            # 环境变量示例
```

## 快速开始

### 使用 Docker（推荐）

```bash
# 1. 克隆项目
git clone https://github.com/Lvawe/llm4se_AI_Travel_Planner.git
cd llm4se_AI_Travel_Planner

# 2. 配置环境变量
cp .env.example .env

# 3. 启动服务
docker-compose up -d

# 4. 访问应用
# 前端: http://localhost:3000
# 后端: http://localhost:3001
```

### 本地开发

详见 [开发指南](./docs/DEVELOPMENT.md)

## API 接口

### 认证接口

#### POST /api/auth/register
用户注册

```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "张三"
}
```

#### POST /api/auth/login
用户登录

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 行程接口（需要认证）

- GET /api/trips - 获取所有行程
- GET /api/trips/:id - 获取单个行程
- POST /api/trips - 创建行程
- PUT /api/trips/:id - 更新行程
- DELETE /api/trips/:id - 删除行程

### 费用接口（需要认证）

- GET /api/expenses - 获取费用记录
- POST /api/expenses - 创建费用记录
- DELETE /api/expenses/:id - 删除费用记录

### API Key 接口（需要认证）

- GET /api/api-keys - 获取 API Keys
- POST /api/api-keys - 保存/更新 API Keys

## 数据库设计

### User 表
```sql
id          String    @id @default(cuid())
email       String    @unique
password    String    -- 加密存储
name        String
createdAt   DateTime  @default(now())
updatedAt   DateTime  @updatedAt
```

### Trip 表
```sql
id          String    @id @default(cuid())
userId      String    -- 外键
destination String
startDate   DateTime
endDate     DateTime
budget      Float
travelers   Int
preferences String[]  -- 偏好数组
itinerary   Json?     -- 详细行程
status      String    -- 状态
createdAt   DateTime
updatedAt   DateTime
```

### Expense 表
```sql
id          String    @id @default(cuid())
tripId      String    -- 外键
userId      String    -- 外键
category    String    -- 分类
amount      Float
currency    String
description String
date        DateTime
createdAt   DateTime
```

## 部署方案

### Docker 镜像

项目支持通过 Docker 快速部署：

```bash
# 拉取镜像
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner-backend:latest
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner-frontend:latest

# 运行
docker-compose -f docker-compose.prod.yml up -d
```

### CI/CD 流程

项目配置了 GitHub Actions，每次推送到 main 分支时会自动：
1. 构建 Docker 镜像
2. 推送到阿里云镜像仓库
3. 生成版本标签

详见 [部署文档](./docs/DEPLOYMENT.md)

## API Key 配置说明

⚠️ **重要**: 请勿将 API Key 写入代码中！

### 配置方式

1. **环境变量方式**（生产环境推荐）
   ```bash
   # .env 文件
   IFLYTEK_APP_ID=your-app-id
   IFLYTEK_API_KEY=your-api-key
   IFLYTEK_API_SECRET=your-api-secret
   LLM_API_KEY=your-llm-key
   AMAP_API_KEY=your-amap-key
   ```

2. **应用设置页面**（用户使用推荐）
   - 用户登录后进入设置页面
   - 输入各项 API Key
   - 数据加密存储在数据库

### API Key 获取

- **科大讯飞**: https://console.xfyun.cn/
- **阿里云百炼**: https://bailian.console.aliyun.com/
- **高德地图**: https://console.amap.com/

## 开发进度

- [x] 项目初始化
- [x] 基础架构搭建
- [x] 用户认证系统
- [x] 数据库设计
- [x] Docker 配置
- [x] CI/CD 配置
- [ ] 语音识别功能（30%）
- [ ] AI 行程规划（0%）
- [ ] 费用管理界面（0%）
- [ ] 地图导航（0%）

详见 [进度跟踪](./docs/PROGRESS.md)

## 文档

- [README.md](./README.md) - 项目说明
- [DEVELOPMENT.md](./docs/DEVELOPMENT.md) - 开发指南
- [DEPLOYMENT.md](./docs/DEPLOYMENT.md) - 部署文档
- [PROGRESS.md](./docs/PROGRESS.md) - 进度跟踪
- [CHANGELOG.md](./CHANGELOG.md) - 更新日志

## 注意事项

1. **安全性**
   - 所有密码使用 bcrypt 加密
   - API 使用 JWT 认证
   - 敏感信息不存储在代码中
   - 使用环境变量管理配置

2. **API 限制**
   - 实现请求频率限制
   - 合理使用第三方 API 配额
   - 添加缓存策略减少调用

3. **数据备份**
   - 定期备份数据库
   - 使用 PostgreSQL 的备份工具
   - 测试恢复流程

## 提交要求

按照作业要求，本项目提供：

1. ✅ GitHub 仓库地址
2. ✅ 详细的 README 文档
3. ✅ Docker 镜像和运行说明
4. ✅ 完整的 Git 提交记录
5. ⚠️ API Key 配置说明（请在 README 中配置）

**注意**: 如果使用非阿里云 API，请在 README 中提供有效期 3 个月的 API Key。

## 联系方式

- **GitHub**: [@Lvawe](https://github.com/Lvawe)
- **仓库**: https://github.com/Lvawe/llm4se_AI_Travel_Planner
- **Issues**: https://github.com/Lvawe/llm4se_AI_Travel_Planner/issues

## 许可证

MIT License

---

**最后更新**: 2025年11月5日

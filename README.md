# 🧳 AI Travel Planner - AI 智能旅行规划师

[![GitHub](https://img.shields.io/badge/GitHub-Lvawe/llm4se__AI__Travel__Planner-blue?logo=github)](https://github.com/Lvawe/llm4se_AI_Travel_Planner)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)

> 基于大语言模型的智能旅行规划应用，集成语音识别、AI 行程生成、地图导航和费用管理功能。

## ✨ 核心功能

### 🎤 语音智能填写
- 浏览器原生语音识别（Web Speech API）
- 中文语音转文字，自动识别目的地、天数、预算、人数
- 语音内容确认编辑，智能提取关键信息
- 自动填充表单，一键生成行程预览

### 🤖 AI 智能规划
- 阿里云通义千问大模型（qwen-turbo）
- 个性化行程推荐，包含详细日程安排
- 智能预算分配和费用预估
- 旅行建议和注意事项

### 📍 地图集成
- 高德地图 JS API 2.0 实时展示
- 目的地位置标记和路线规划
- 响应式地图交互体验

### 💰 费用管理
- 多分类费用记录（餐饮/交通/住宿/娱乐/其他）
- 实时预算跟踪和可视化图表
- 费用统计和超支提醒

### 🔐 用户系统
- JWT 身份认证，安全可靠
- 云端数据同步（Supabase）
- 多设备访问，数据实时更新

## 🏗️ 技术架构

### 前端技术栈
- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5
- **样式**: Tailwind CSS
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **UI 组件**: Lucide Icons, React Hot Toast

### 后端技术栈
- **框架**: Express.js
- **ORM**: Prisma
- **数据库**: PostgreSQL (Supabase)
- **认证**: JWT (jsonwebtoken)
- **安全**: bcryptjs, CORS

### AI & 地图服务
- **大模型**: 阿里云百炼 DashScope API
- **模型**: qwen-turbo
- **地图**: 高德地图 Web 服务 API + JS API 2.0
- **语音**: Web Speech API (浏览器原生)

## 🚀 快速开始

### 方式一：Docker 部署（推荐）

#### 1. 拉取 Docker 镜像

```bash
# 从阿里云容器镜像仓库拉取
docker pull registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest

# 或使用 Docker Hub（如果已推送）
docker pull lvawe/ai-travel-planner:latest
```

#### 2. 运行容器

```bash
docker run -d \
  -p 5090:5090 \
  -p 3001:3001 \
  -e DATABASE_URL="your_database_url" \
  -e DASHSCOPE_API_KEY="your_dashscope_key" \
  -e NEXT_PUBLIC_AMAP_KEY="your_amap_key" \
  --name ai-travel-planner \
  registry.cn-hangzhou.aliyuncs.com/llm4se/ai-travel-planner:latest
```

#### 3. 访问应用

- 前端: http://localhost:5090
- 后端 API: http://localhost:3001

### 方式二：Docker Compose 部署

#### 1. 克隆项目

```bash
git clone https://github.com/Lvawe/llm4se_AI_Travel_Planner.git
cd llm4se_AI_Travel_Planner
```

#### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并填写配置：

```bash
# 后端环境变量
cp backend/.env.example backend/.env

# 前端环境变量  
cp frontend/.env.example frontend/.env.local
```

**后端 `backend/.env`**:
```env
# 数据库配置 - Supabase
DATABASE_URL="postgresql://postgres:your_password@db.xxx.supabase.co:5432/postgres"

# JWT 配置
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# 服务端口
BACKEND_PORT=3001

# 阿里云百炼 LLM API
DASHSCOPE_API_KEY="sk-your-api-key"
LLM_MODEL="qwen-turbo"
```

**前端 `frontend/.env.local`**:
```env
# 后端 API 地址
NEXT_PUBLIC_API_URL=http://localhost:3001

# 高德地图 API Key
NEXT_PUBLIC_AMAP_KEY="your-amap-key"
```

#### 3. 启动服务

```bash
docker-compose up -d
```

#### 4. 访问应用

- 前端: http://localhost:5090
- 后端 API: http://localhost:3001

### 方式三：本地开发部署

#### 前置要求
- Node.js 18+
- npm 或 yarn
- PostgreSQL 数据库

#### 1. 克隆项目

```bash
git clone https://github.com/Lvawe/llm4se_AI_Travel_Planner.git
cd llm4se_AI_Travel_Planner
```

#### 2. 安装依赖

```bash
# 后端
cd backend
npm install

# 前端
cd ../frontend
npm install
```

#### 3. 配置环境变量

按照上面的方式二配置 `.env` 文件

#### 4. 初始化数据库

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

#### 5. 启动服务

```bash
# 启动后端 (终端1)
cd backend
npm run dev

# 启动前端 (终端2)
cd frontend
npm run dev
```

#### 6. 访问应用

- 前端: http://localhost:5090
- 后端 API: http://localhost:3001

## 📋 API 密钥获取指南

### 1. Supabase (数据库)
1. 访问 https://supabase.com/
2. 创建新项目
3. 获取数据库连接字符串: `Settings` → `Database` → `Connection String`
4. 格式: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres`

### 2. 阿里云百炼 (AI 大模型)
1. 访问 https://dashscope.aliyun.com/
2. 开通服务（有免费额度）
3. 创建 API Key: `API-KEY 管理` → `创建新的API-KEY`
4. 复制 API Key (格式: `sk-xxxxxxxx`)

### 3. 高德地图 (地图服务)
1. 访问 https://console.amap.com/
2. 创建应用并申请 Key
3. 选择 `Web端(JS API)` 类型
4. 获取 Key 并配置白名单

## 🗂️ 项目结构

```
llm4se_AI_Travel_Planner/
├── frontend/                 # Next.js 前端应用
│   ├── src/
│   │   ├── app/             # App Router 页面
│   │   │   ├── dashboard/   # 仪表盘页面
│   │   │   ├── trips/       # 行程管理页面
│   │   │   ├── login/       # 登录页面
│   │   │   └── register/    # 注册页面
│   │   ├── components/      # React 组件
│   │   │   ├── AmapComponent.tsx     # 高德地图组件
│   │   │   └── VoiceInput.tsx        # 语音输入组件
│   │   ├── lib/             # 工具函数
│   │   │   └── api.ts       # API 请求封装
│   │   └── store/           # Zustand 状态管理
│   │       └── authStore.ts # 认证状态
│   ├── public/              # 静态资源
│   ├── Dockerfile           # Docker 构建文件
│   └── package.json
│
├── backend/                  # Express.js 后端应用
│   ├── src/
│   │   ├── routes/          # API 路由
│   │   │   ├── auth.ts      # 认证路由
│   │   │   ├── trips.ts     # 行程路由
│   │   │   ├── expenses.ts  # 费用路由
│   │   │   └── ai.ts        # AI 生成路由
│   │   ├── services/        # 业务逻辑
│   │   │   ├── llmService.ts      # LLM 服务
│   │   │   └── amapService.ts     # 高德地图服务
│   │   ├── middleware/      # 中间件
│   │   │   └── auth.ts      # JWT 认证中间件
│   │   └── index.ts         # 入口文件
│   ├── prisma/              # Prisma ORM
│   │   └── schema.prisma    # 数据库模型
│   ├── Dockerfile           # Docker 构建文件
│   └── package.json
│
├── docker-compose.yml        # Docker Compose 配置
├── .github/                  # GitHub Actions 配置
│   └── workflows/
│       └── docker-publish.yml # Docker 镜像自动构建
├── README.md                 # 项目文档
└── LICENSE                   # 开源协议
```

## 🎯 功能使用指南

### 创建智能行程

#### 方式一：表单填写
1. 登录账号后点击"创建新行程"
2. 填写基本信息：
   - 📍 目的地（必填）
   - 📅 开始/结束日期（必填）
   - 💰 预算（必填）
   - 👥 出行人数（必填）
   - 🎨 旅行偏好（可选）
   - 📝 文字描述（可选）
3. 点击"🚀 智能创建行程"
4. 查看 AI 生成的预览
5. 点击"💾 保存行程"

#### 方式二：语音快速创建
1. 点击"开始语音"按钮
2. 说出需求，例如："我想去北京玩5天，预算5000元，喜欢历史文化，2个人"
3. 确认识别内容，点击"确认并填充"
4. 系统自动提取信息并生成预览
5. 点击"💾 保存行程"

### 查看行程详情

1. 在仪表盘点击任意行程卡片
2. 查看完整的 AI 生成计划：
   - 📅 详细日程安排
   - 💰 预算明细分解
   - 💡 旅行建议和注意事项
3. 查看目的地地图位置

### 费用管理

1. 在行程详情页点击"添加费用"
2. 填写费用信息：
   - 分类（餐饮/交通/住宿/娱乐/其他）
   - 金额
   - 描述（可选）
3. 实时查看预算使用情况
4. 查看费用统计图表

## 🛠️ 开发命令

### 后端开发

```bash
cd backend

# 开发模式（热重载）
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm run start

# 数据库管理
npx prisma studio          # 可视化数据库管理
npx prisma migrate dev     # 创建并应用迁移
npx prisma generate        # 生成 Prisma Client
```

### 前端开发

```bash
cd frontend

# 开发模式（热重载）
npm run dev

# 构建生产版本
npm run build

# 运行生产版本
npm run start

# 代码检查
npm run lint
```

### Docker 命令

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 重启服务
docker-compose restart
```

## 🐛 常见问题与解决方案

### 1. 地图不显示？

**问题原因**: 高德地图 API Key 未配置或配置错误

**解决方案**:
- 检查 `frontend/.env.local` 中 `NEXT_PUBLIC_AMAP_KEY` 是否正确
- 确认在高德开放平台配置了 Web 服务（JS API）
- 检查域名白名单设置（开发环境需添加 `localhost`）

### 2. AI 生成失败？

**问题原因**: DashScope API Key 失效或额度用完

**解决方案**:
- 检查 `backend/.env` 中 `DASHSCOPE_API_KEY` 是否有效
- 登录阿里云百炼控制台查看剩余额度
- 确认 API Key 有调用权限

### 3. 语音识别不工作？

**问题原因**: 浏览器兼容性或权限问题

**解决方案**:
- 使用 Chrome 或 Edge 浏览器（Firefox 不支持）
- 确保使用 HTTPS 或 localhost 访问
- 允许麦克风权限
- 检查系统麦克风设置

### 4. 数据库连接失败？

**问题原因**: 连接字符串格式错误或网络问题

**解决方案**:
- 检查 `DATABASE_URL` 格式是否正确
- 确认 Supabase 项目状态正常
- 检查网络连接
- 尝试在 Supabase 控制台直接连接测试

### 5. Docker 容器启动失败？

**问题原因**: 环境变量未配置或端口占用

**解决方案**:
- 检查 `.env` 文件是否正确配置
- 确认端口 5090 和 3001 未被占用
- 查看容器日志: `docker-compose logs`
- 尝试重新构建: `docker-compose build --no-cache`

## 📊 性能优化

- ✅ Next.js 静态生成优化首屏加载
- ✅ 图片懒加载和优化
- ✅ API 响应缓存
- ✅ 数据库查询优化
- ✅ 前端代码分割

## 🔒 安全特性

- ✅ JWT 身份认证
- ✅ 密码 bcrypt 加密
- ✅ CORS 跨域保护
- ✅ SQL 注入防护（Prisma ORM）
- ✅ XSS 防护
- ✅ 环境变量隔离

## 📄 开源协议

本项目采用 [MIT](LICENSE) 协议开源。

## 👨‍💻 作者

- **GitHub**: [@Lvawe](https://github.com/Lvawe)
- **Repository**: [llm4se_AI_Travel_Planner](https://github.com/Lvawe/llm4se_AI_Travel_Planner)

## 🙏 致谢

感谢以下开源项目和服务：

- [Next.js](https://nextjs.org/) - React 框架
- [Prisma](https://www.prisma.io/) - 数据库 ORM
- [Supabase](https://supabase.com/) - 开源 Firebase 替代品
- [阿里云百炼](https://dashscope.aliyun.com/) - 大语言模型服务
- [高德地图](https://lbs.amap.com/) - 地图服务
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架

## 📮 反馈与贡献

欢迎提交 Issue 和 Pull Request！

如有问题或建议，请在 [GitHub Issues](https://github.com/Lvawe/llm4se_AI_Travel_Planner/issues) 中反馈。

---

⭐ 如果这个项目对你有帮助，欢迎 Star 支持！

## 📄 License

MIT License - 详见 [LICENSE](./LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 👨‍💻 作者

Lvawe - [GitHub](https://github.com/Lvawe)

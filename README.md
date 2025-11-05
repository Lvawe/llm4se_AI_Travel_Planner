# 🧳 AI Travel Planner - AI 旅行规划师

> 基于 AI 的智能旅行规划应用,支持语音输入、智能行程规划、费用管理和地图导航。

## ✨ 核心功能

- 🎤 **语音输入** - 浏览器语音识别,中文语音转文字
- 🤖 **AI 智能规划** - 阿里云通义千问,自动生成个性化旅行行程
- 📍 **地图集成** - 高德地图显示目的地位置
- 💰 **费用管理** - 记录旅行支出,实时预算跟踪
- 🔐 **用户系统** - JWT 认证,数据云端同步

## 🏗️ 技术栈

- **前端**: Next.js 14, TypeScript, Tailwind CSS, Zustand
- **后端**: Express.js, Prisma ORM
- **数据库**: Supabase (PostgreSQL)
- **AI**: 阿里云百炼 (qwen-turbo)
- **地图**: 高德地图 JS API 2.0

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Lvawe/llm4se_AI_Travel_Planner.git
cd llm4se_AI_Travel_Planner
```

### 2. 配置环境变量

**后端** `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
BACKEND_PORT=3001
JWT_SECRET="your-secret-key"
DASHSCOPE_API_KEY="sk-your-api-key"
LLM_MODEL="qwen-turbo"
```

**前端** `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AMAP_KEY="your-amap-key"
```

### 3. 启动后端

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### 4. 启动前端

```bash
cd frontend
npm install
npm run dev
```

访问 http://localhost:5090 🎉

## 📋 API 密钥获取

- **Supabase**: https://supabase.com/ (免费)
- **阿里云百炼**: https://dashscope.aliyun.com/ (免费额度)
- **高德地图**: https://console.amap.com/ (免费)

## 🗂️ 项目结构

```
├── frontend/          # Next.js 前端
│   ├── src/
│   │   ├── app/       # 页面路由
│   │   ├── components/# 组件
│   │   ├── lib/       # 工具函数
│   │   └── store/     # 状态管理
│
├── backend/           # Express 后端
│   ├── src/
│   │   ├── routes/    # API 路由
│   │   ├── services/  # 业务逻辑
│   │   └── middleware/# 中间件
│   └── prisma/        # 数据库 schema
```

## 📝 使用说明

### 创建智能行程

1. 注册/登录账号
2. 点击"创建新行程"
3. 填写目的地、日期、预算等信息
4. 点击"🚀 智能创建行程"
5. AI 自动生成详细行程计划

### 语音输入

1. 在目的地输入框旁点击 🎤 图标
2. 允许麦克风权限
3. 说出目的地名称
4. 自动填充到输入框

### 费用管理

1. 在行程详情页点击"添加费用"
2. 选择分类(餐饮/交通/住宿/娱乐/其他)
3. 输入金额和描述
4. 实时查看预算使用情况

## 🛠️ 开发命令

```bash
# 后端
npm run dev          # 开发模式
npm run build        # 构建
npm run start        # 生产模式

# 前端
npm run dev          # 开发模式
npm run build        # 构建
npm run start        # 生产模式

# 数据库
npx prisma studio    # 打开数据库管理界面
npx prisma migrate dev  # 创建迁移
```

## 🐛 常见问题

### 地图不显示?
检查 `NEXT_PUBLIC_AMAP_KEY` 是否正确配置

### AI 生成失败?
检查 `DASHSCOPE_API_KEY` 是否有效,是否有剩余额度

### 语音识别不工作?
1. 使用 Chrome/Edge 浏览器
2. 确保使用 HTTPS 或 localhost
3. 允许麦克风权限

### 数据库连接失败?
检查 Supabase 连接字符串格式:
```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
```

## 📄 License

MIT License - 详见 [LICENSE](./LICENSE)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 👨‍💻 作者

Lvawe - [GitHub](https://github.com/Lvawe)

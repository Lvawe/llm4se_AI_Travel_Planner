# API 配置指南

## 📋 配置清单

### 必需配置
- [x] Supabase 数据库（已配置）
- [ ] 高德地图 API Key
- [ ] 阿里云通义千问 API Key（可选，用于 AI 功能）

## 🗺️ 高德地图 API 配置

### 1. 获取 API Key

1. 访问高德开放平台：https://lbs.amap.com/
2. 注册/登录账号
3. 进入控制台
4. 创建应用：
   - 应用名称：AI Travel Planner
   - 应用类型：Web服务
5. 添加 Key：
   - Key名称：前端地图
   - 服务平台：Web端(JS API)
   - 提交后获得 Key

### 2. 配置到项目

编辑 `frontend/.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AMAP_KEY=你的高德地图Key
```

### 3. 白名单配置（重要）

在高德平台控制台：
- 开发环境：添加 `localhost`
- 生产环境：添加你的域名

## 🤖 阿里云通义千问配置

### 1. 获取 API Key

1. 访问阿里云百炼平台：https://bailian.console.aliyun.com/
2. 登录阿里云账号
3. 开通"模型服务灵积 DashScope"
4. API-KEY 管理 → 创建新的 API-KEY
5. 复制 API Key（格式：sk-xxxxxx）

### 2. 选择模型

推荐模型：
- `qwen-turbo`: 快速响应，性价比高（推荐）
- `qwen-plus`: 能力更强，响应稍慢
- `qwen-max`: 最强能力，成本较高

### 3. 配置到项目

编辑 `backend/.env` 文件：

```env
# 通义千问 LLM API
DASHSCOPE_API_KEY=sk-你的实际APIKey
LLM_MODEL=qwen-turbo
```

### 4. 测试配置

```bash
cd backend
node check-config.js
```

## 🔧 完整的配置文件示例

### backend/.env
```env
# 数据库配置 - Supabase
DATABASE_URL="postgresql://postgres:your-password@db.xxxxx.supabase.co:5432/postgres"

# JWT 配置
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-123456"
JWT_EXPIRES_IN="7d"

# 服务端口
BACKEND_PORT=3001

# 讯飞语音识别 API (可选，暂时不用)
IFLYTEK_APPID=your_appid_here
IFLYTEK_API_SECRET=your_api_secret_here
IFLYTEK_API_KEY=your_api_key_here

# 通义千问 LLM API (必需，用于 AI 功能)
DASHSCOPE_API_KEY=sk-你的实际APIKey
LLM_MODEL=qwen-turbo
```

### frontend/.env.local
```env
# 后端 API 地址
NEXT_PUBLIC_API_URL=http://localhost:3001

# 高德地图 API Key (必需)
NEXT_PUBLIC_AMAP_KEY=你的高德地图Key
```

## ✅ 验证配置

### 1. 检查环境变量
```bash
cd backend
node check-config.js
```

### 2. 测试后端
```bash
cd backend
npm run dev
```

看到以下输出表示成功：
```
Server is running on port 3001
Database connected successfully
```

### 3. 测试前端
```bash
cd frontend
npm run dev
```

访问 http://localhost:5090，应该能看到登录页面。

### 4. 测试地图功能
1. 注册/登录账号
2. 创建新行程
3. 输入目的地（如：北京）
4. 右侧应该显示地图并定位到北京

## 🐛 常见问题

### 问题 1: 地图不显示
**原因**: API Key 未配置或配置错误
**解决**: 
1. 检查 `frontend/.env.local` 中的 `NEXT_PUBLIC_AMAP_KEY`
2. 确保 Key 正确且已在高德平台添加白名单
3. 重启前端服务（配置修改后需要重启）

### 问题 2: 地图显示"开发者Key无效"
**原因**: Key 配置错误或域名未加白名单
**解决**: 
1. 在高德平台检查 Key 状态
2. 确认白名单包含 `localhost`
3. 确保使用的是 JS API Key，不是 Web服务 Key

### 问题 3: 通义千问 API 调用失败
**原因**: API Key 错误或余额不足
**解决**: 
1. 检查 `backend/.env` 中的 `DASHSCOPE_API_KEY`
2. 确保以 `sk-` 开头
3. 在百炼平台检查账户余额和调用配额

### 问题 4: 前端无法连接后端
**原因**: 后端未启动或端口配置错误
**解决**: 
1. 确保后端正在运行（端口 3001）
2. 检查 `frontend/.env.local` 中的 `NEXT_PUBLIC_API_URL`
3. 确保防火墙允许本地端口访问

## 📊 配置状态检查命令

```bash
# 检查后端配置
cd backend
node check-config.js

# 检查后端是否运行
curl http://localhost:3001/health

# 检查前端是否运行
curl http://localhost:5090
```

## 💰 成本说明

### 高德地图
- 个人开发者：每日配额 5000 次（免费）
- 足够开发和测试使用

### 通义千问
- 新用户：赠送一定额度（通常够测试用）
- qwen-turbo: ¥0.008/1k tokens
- 单次旅行规划约消耗 1500-2000 tokens
- 成本约 ¥0.012-¥0.016/次

## 🔒 安全提示

1. **不要提交 .env 文件到 Git**
   - `.gitignore` 已包含 `.env` 和 `.env.local`
   - API Key 应该保密

2. **生产环境**
   - 使用强密码的 JWT_SECRET
   - 配置 CORS 白名单
   - 启用 HTTPS
   - 定期轮换 API Keys

## 📞 获取帮助

如果遇到问题：
1. 查看控制台错误信息
2. 运行配置检查脚本
3. 查看相关文档：
   - 高德地图：https://lbs.amap.com/api/javascript-api/summary
   - 通义千问：https://help.aliyun.com/zh/dashscope/

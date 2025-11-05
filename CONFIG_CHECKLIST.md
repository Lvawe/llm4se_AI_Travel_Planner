# 配置检查清单

## 📝 配置步骤

### ✅ 步骤 1: 配置高德地图（必需）

1. **获取 API Key**
   - [ ] 访问 https://lbs.amap.com/
   - [ ] 注册/登录账号
   - [ ] 创建应用，添加 JS API Key
   - [ ] 复制 Key

2. **配置到项目**
   - [ ] 编辑 `frontend/.env.local`
   - [ ] 设置 `NEXT_PUBLIC_AMAP_KEY=你的Key`
   - [ ] 在高德平台添加白名单 `localhost`

### ⚙️ 步骤 2: 配置通义千问（可选）

1. **获取 API Key**
   - [ ] 访问 https://bailian.console.aliyun.com/
   - [ ] 开通 DashScope 服务
   - [ ] 创建 API Key
   - [ ] 复制 Key（sk-xxxxx）

2. **配置到项目**
   - [ ] 编辑 `backend/.env`
   - [ ] 设置 `DASHSCOPE_API_KEY=sk-你的Key`
   - [ ] 确认 `LLM_MODEL=qwen-turbo`

### 🔍 步骤 3: 验证配置

```bash
cd backend
npm run check-config
```

期望输出：
- [ ] ✅ DATABASE_URL 已配置
- [ ] ✅ DASHSCOPE_API_KEY 已配置（如果配置了）
- [ ] ✅ 通义千问 API 连接成功（如果配置了）

### 🚀 步骤 4: 启动服务

**后端** (终端 1):
```bash
cd backend
npm run dev
```
- [ ] 看到 "Server is running on port 3001"

**前端** (终端 2):
```bash
cd frontend
npm run dev
```
- [ ] 看到 "Local: http://localhost:5090"

### 🧪 步骤 5: 测试功能

1. **打开浏览器** http://localhost:5090
   - [ ] 页面正常显示

2. **注册/登录**
   - [ ] 可以注册新用户
   - [ ] 可以登录系统
   - [ ] 进入 Dashboard

3. **测试地图**
   - [ ] 点击"创建新行程"
   - [ ] 输入目的地（如：北京）
   - [ ] 右侧地图正确显示位置
   - [ ] 地图可以交互（缩放、拖动）

4. **测试行程创建**
   - [ ] 填写完整行程信息
   - [ ] 成功创建行程
   - [ ] 跳转到行程详情页

5. **测试费用管理**
   - [ ] 可以添加费用
   - [ ] 可以删除费用
   - [ ] 预算统计正确

## 📂 配置文件检查

### backend/.env
```env
DATABASE_URL="postgresql://postgres:aA3527486@db.sygvmnyyzyynuewppitb.supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production-123456"
JWT_EXPIRES_IN="7d"
BACKEND_PORT=3001

# 通义千问（可选）
DASHSCOPE_API_KEY=sk-你的实际Key
LLM_MODEL=qwen-turbo
```

### frontend/.env.local
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AMAP_KEY=你的高德地图Key
```

## ⚠️ 常见错误

### 错误 1: 地图显示空白
- [ ] 检查 `NEXT_PUBLIC_AMAP_KEY` 是否正确
- [ ] 检查高德平台白名单是否包含 localhost
- [ ] 重启前端服务

### 错误 2: 地图显示"开发者Key无效"
- [ ] 确认使用的是 JS API Key
- [ ] 确认 Key 状态正常（未过期/未禁用）
- [ ] 确认白名单配置正确

### 错误 3: 后端启动失败
- [ ] 检查端口 3001 是否被占用
- [ ] 检查数据库连接是否正常
- [ ] 运行 `npm run db:generate`

### 错误 4: 前端无法连接后端
- [ ] 确认后端正在运行
- [ ] 检查 `NEXT_PUBLIC_API_URL` 配置
- [ ] 检查浏览器控制台错误信息

## 📊 配置状态

| 项目 | 状态 | 说明 |
|------|------|------|
| Supabase 数据库 | ✅ 已配置 | 云端数据库运行正常 |
| JWT 认证 | ✅ 已配置 | 用户认证可用 |
| 高德地图 | ⏳ 待配置 | 需要你的 API Key |
| 通义千问 | ⏳ 待配置 | 可选，用于 AI 功能 |

## 🎯 下一步

配置完成后：
1. [ ] 完成所有测试
2. [ ] 确认功能正常
3. [ ] 可以开始开发新功能
4. [ ] 或者提交代码到 Git

## 💡 提示

- 配置文件修改后需要重启服务
- 环境变量以 `NEXT_PUBLIC_` 开头才能在前端使用
- 不要将 `.env` 文件提交到 Git
- 开发环境的 API Key 不要用于生产环境

---

**最后更新**: 2024-01-05
**状态**: 等待配置 API Keys

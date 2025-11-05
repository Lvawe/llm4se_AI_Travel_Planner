# 🚀 快速启动指南

## 第一步：配置 API Keys

### 1. 配置高德地图 API Key（必需）

1. 访问：https://lbs.amap.com/
2. 注册并登录
3. 控制台 → 应用管理 → 我的应用 → 创建新应用
4. 添加 Key，选择 "Web端(JS API)"
5. 复制 Key

编辑 `frontend/.env.local`：
```bash
cd frontend
# 如果文件不存在，复制示例文件
cp .env.local.example .env.local
# 然后编辑文件，替换 your_amap_key_here 为实际的 Key
```

**重要**: 在高德平台添加白名单 `localhost`

### 2. 配置通义千问 API Key（可选，用于 AI 功能）

1. 访问：https://bailian.console.aliyun.com/
2. 登录阿里云账号
3. 开通 "模型服务灵积 DashScope"
4. API-KEY 管理 → 创建 API-KEY
5. 复制 Key（格式：sk-xxxxxx）

编辑 `backend/.env`，替换这行：
```env
DASHSCOPE_API_KEY=sk-你的实际APIKey
```

## 第二步：验证配置

```bash
cd backend
npm run check-config
```

你应该看到类似输出：
```
🔍 开始检查 API 配置...

1️⃣  检查数据库配置...
   ✅ DATABASE_URL 已配置

2️⃣  检查通义千问 LLM 配置...
   ✅ DASHSCOPE_API_KEY 已配置
   📝 模型: qwen-turbo
   🔄 测试通义千问 API 连接...
   ✅ 通义千问 API 连接成功！

3️⃣  检查高德地图配置...
   💡 高德地图配置在 frontend/.env.local 中
   💡 请确保设置了 NEXT_PUBLIC_AMAP_KEY
```

## 第三步：启动服务

### 方式 1: 使用两个终端（推荐）

**终端 1 - 启动后端:**
```bash
cd backend
npm run dev
```

应该看到：
```
Server is running on port 3001
Database connected successfully
```

**终端 2 - 启动前端:**
```bash
cd frontend
npm run dev
```

应该看到：
```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:5090
  
✓ Ready in 2.3s
```

### 方式 2: 使用根目录便捷命令

**终端 1:**
```bash
npm run dev:backend
```

**终端 2:**
```bash
npm run dev:frontend
```

## 第四步：测试应用

1. **打开浏览器**: http://localhost:5090

2. **注册账号**:
   - 点击 "注册" 按钮
   - 填写姓名、邮箱、密码
   - 提交注册

3. **登录系统**:
   - 使用刚注册的邮箱和密码登录
   - 进入 Dashboard

4. **测试地图功能**:
   - 点击 "创建新行程"
   - 填写目的地（如：北京、上海）
   - 查看右侧地图是否正确显示位置
   - 如果地图显示正常，说明高德地图配置成功 ✅

5. **测试行程创建**:
   - 填写完整的行程信息
   - 点击 "创建行程"
   - 应该成功创建并跳转到行程详情页

6. **测试费用管理**:
   - 在行程详情页点击 "添加费用"
   - 填写费用信息
   - 查看预算统计

## 🐛 常见启动问题

### 问题 1: 后端端口 3001 被占用
```bash
# 查找占用端口的进程
lsof -ti:3001

# 停止该进程
lsof -ti:3001 | xargs kill -9
```

### 问题 2: 前端端口 5090 被占用
```bash
# 查找占用端口的进程
lsof -ti:5090

# 停止该进程
lsof -ti:5090 | xargs kill -9
```

### 问题 3: 地图不显示
**可能原因**:
1. API Key 未配置
2. 环境变量文件路径错误
3. 需要重启前端服务

**解决方法**:
```bash
# 1. 确认配置文件位置和内容
cat frontend/.env.local

# 应该看到: NEXT_PUBLIC_AMAP_KEY=你的Key

# 2. 重启前端（Ctrl+C 停止，然后重新启动）
cd frontend
npm run dev
```

### 问题 4: Prisma 客户端未生成
```bash
cd backend
npm run db:generate
```

### 问题 5: 依赖未安装
```bash
# 安装后端依赖
cd backend
npm install

# 安装前端依赖
cd frontend
npm install
```

## 📋 启动检查清单

启动前确认：
- [ ] 已配置 `backend/.env` 文件
- [ ] 已配置 `frontend/.env.local` 文件
- [ ] 已运行 `npm install` 安装依赖
- [ ] 已运行 `npm run check-config` 验证配置
- [ ] 后端成功启动在 3001 端口
- [ ] 前端成功启动在 5090 端口
- [ ] 可以访问 http://localhost:5090

## 🎯 功能测试清单

测试以下功能确保一切正常：
- [ ] 用户注册功能
- [ ] 用户登录功能
- [ ] 查看 Dashboard
- [ ] 创建新行程
- [ ] 地图显示目的地
- [ ] 添加费用记录
- [ ] 查看行程详情
- [ ] 删除费用记录
- [ ] 删除行程

## 💡 开发提示

### 查看日志
- **后端日志**: 在后端终端查看 API 请求和错误
- **前端日志**: 在浏览器开发者工具的 Console 查看
- **数据库**: 使用 Prisma Studio 查看数据
  ```bash
  cd backend
  npm run db:studio
  ```

### 热重载
- 后端：修改代码自动重启（tsx watch）
- 前端：修改代码自动刷新（Next.js Fast Refresh）

### 数据库管理
```bash
# 查看数据库
cd backend
npm run db:studio

# 访问 http://localhost:5555
```

## 📞 需要帮助？

如果遇到问题：
1. 查看终端错误信息
2. 查看浏览器控制台错误
3. 运行配置检查: `npm run check-config`
4. 查看详细配置文档: `docs/API_CONFIG.md`

## 🎉 成功启动！

如果所有步骤都成功，你现在应该：
- ✅ 后端运行在 http://localhost:3001
- ✅ 前端运行在 http://localhost:5090
- ✅ 可以注册登录
- ✅ 可以创建和管理行程
- ✅ 地图正常显示

享受你的 AI Travel Planner！🚀

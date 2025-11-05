# 登录注册测试指南

本文档说明如何测试 AI Travel Planner 的登录注册功能。

## 当前状态

### ✅ 已实现功能

1. **用户注册**
   - 邮箱验证
   - 密码加密存储（bcrypt）
   - 输入验证（Zod）
   - 自动登录（返回 JWT Token）

2. **用户登录**
   - JWT Token 认证
   - 密码验证
   - 自动跳转到 Dashboard

3. **用户管理**
   - 支持保存和管理多份旅行计划
   - 云端数据同步（通过 Supabase）
   - 多设备访问

4. **Dashboard 页面**
   - 显示行程统计
   - 行程列表展示
   - 创建新行程入口

### 🔄 云端同步说明

项目使用 **Supabase** 作为云端数据库，提供以下功能：

1. **自动云端同步**
   - 所有数据存储在 Supabase 云端
   - 多设备实时访问
   - 无需额外配置

2. **数据安全**
   - 密码加密存储
   - JWT Token 认证
   - HTTPS 加密传输

3. **数据关系**
   ```
   User（用户）
     ├── Trip[]（行程列表）
     ├── Expense[]（费用记录）
     └── ApiKey（API密钥配置）
   ```

## 测试步骤

### 前提条件

1. **配置 Supabase 数据库**
   - 按照 [Supabase 配置指南](./SUPABASE_SETUP.md) 创建项目
   - 更新 `.env` 文件中的 `DATABASE_URL`

2. **安装依赖**
   ```bash
   # 后端
   cd backend
   npm install
   
   # 前端
   cd frontend
   npm install
   ```

3. **运行数据库迁移**
   ```bash
   cd backend
   npm run db:generate
   npm run db:migrate
   ```

### 步骤 1: 启动服务

#### 方式 A: 分别启动（推荐开发）

```bash
# 终端 1 - 后端
cd backend
npm run dev

# 终端 2 - 前端
cd frontend
npm run dev
```

#### 方式 B: 使用 Docker

```bash
# 注意：需要在 docker-compose.yml 中配置 Supabase URL
docker-compose up -d
```

### 步骤 2: 测试注册功能

1. **打开浏览器访问**
   ```
   http://localhost:3000
   ```

2. **点击"注册"按钮**

3. **填写注册信息**
   - 姓名: 测试用户
   - 邮箱: test@example.com
   - 密码: test123456

4. **提交注册**
   - 应该看到"注册成功!"提示
   - 自动跳转到 Dashboard 页面

5. **验证 Supabase 数据**
   - 登录 Supabase 控制台
   - 进入 Table Editor
   - 查看 User 表，应该能看到新注册的用户

### 步骤 3: 测试登录功能

1. **退出登录**
   - 在 Dashboard 页面点击"退出"

2. **返回首页点击"登录"**

3. **填写登录信息**
   - 邮箱: test@example.com
   - 密码: test123456

4. **提交登录**
   - 应该看到"登录成功!"提示
   - 自动跳转到 Dashboard 页面

### 步骤 4: 测试云端同步

#### 测试场景 1: 同一浏览器多标签

1. 在第一个标签登录账号
2. 打开新标签访问 `http://localhost:3000/dashboard`
3. 应该自动识别已登录状态（Token 存储在 localStorage）

#### 测试场景 2: 不同浏览器

1. 在 Chrome 登录账号并创建行程
2. 在 Firefox 或 Safari 登录同一账号
3. 应该能看到相同的行程数据（云端同步）

#### 测试场景 3: 数据持久化

1. 登录并创建一些测试数据
2. 关闭浏览器
3. 重新打开浏览器并登录
4. 数据应该仍然存在（存储在 Supabase）

### 步骤 5: 测试 Dashboard 功能

1. **查看统计卡片**
   - 全部行程数量
   - 不同状态的行程统计

2. **创建测试行程**（暂未实现创建页面）
   - 可以使用 API 测试工具（Postman、Thunder Client）
   - 或使用 Prisma Studio：`npm run db:studio`

3. **手动创建测试数据**
   ```bash
   cd backend
   npm run db:studio
   ```
   
   在 Prisma Studio 中：
   - 打开 Trip 表
   - 点击 "Add record"
   - 填写字段：
     - userId: 复制你的用户 ID
     - destination: "日本"
     - startDate: 未来日期
     - endDate: 未来日期
     - budget: 10000
     - travelers: 2
     - preferences: ["美食", "购物"]
     - status: "planned"

4. **刷新 Dashboard 页面**
   - 应该能看到新创建的行程

## 测试验证点

### ✅ 注册功能

- [ ] 邮箱格式验证
- [ ] 密码长度验证（至少 6 位）
- [ ] 重复邮箱检测
- [ ] 密码加密存储
- [ ] 自动生成 JWT Token
- [ ] 数据保存到 Supabase

### ✅ 登录功能

- [ ] 邮箱验证
- [ ] 密码验证
- [ ] 错误提示友好
- [ ] JWT Token 生成
- [ ] Token 存储到 localStorage
- [ ] 自动跳转到 Dashboard

### ✅ 云端同步

- [ ] 数据存储在 Supabase
- [ ] 多设备访问相同数据
- [ ] 实时数据更新
- [ ] 数据持久化

### ✅ Dashboard 功能

- [ ] 显示用户信息
- [ ] 显示行程统计
- [ ] 行程列表展示
- [ ] 退出登录功能

## 常见问题排查

### 问题 1: 连接数据库失败

**错误信息**: `P1001: Can't reach database server`

**解决方案**:
1. 检查 `.env` 文件中的 `DATABASE_URL` 是否正确
2. 确认 Supabase 项目正常运行
3. 检查网络连接
4. 验证数据库密码是否正确

### 问题 2: 注册后没有跳转

**可能原因**:
- 前端 API URL 配置错误
- Token 存储失败
- 路由配置问题

**检查方法**:
1. 打开浏览器开发者工具（F12）
2. 查看 Console 是否有错误
3. 查看 Network 标签，检查 API 请求状态
4. 检查 `.env` 中的 `NEXT_PUBLIC_API_URL`

### 问题 3: 页面显示 404

**解决方案**:
1. 确认前端服务正在运行
2. 检查访问的 URL 是否正确
3. 清除浏览器缓存

### 问题 4: CORS 错误

**错误信息**: `Access to XMLHttpRequest has been blocked by CORS policy`

**解决方案**:
- 后端已配置 CORS，应该不会出现此问题
- 如果出现，检查后端 `src/index.ts` 中的 CORS 配置

### 问题 5: Token 过期

**现象**: 登录后一段时间自动退出

**说明**: JWT Token 默认有效期 7 天
- 可在 `.env` 中修改 `JWT_EXPIRES_IN`
- 过期后需要重新登录

## API 测试

### 使用 curl 测试

#### 注册
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456",
    "name": "测试用户"
  }'
```

#### 登录
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123456"
  }'
```

#### 获取行程列表（需要 Token）
```bash
curl -X GET http://localhost:3001/api/trips \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 下一步开发

登录注册功能已完成，下一步应该：

1. **创建行程功能**
   - [ ] 创建 `/trips/new` 页面
   - [ ] 实现行程表单
   - [ ] 集成语音输入（可选）

2. **行程详情页**
   - [ ] 创建 `/trips/[id]` 页面
   - [ ] 显示行程详细信息
   - [ ] 支持编辑和删除

3. **集成 AI 功能**
   - [ ] 语音识别（科大讯飞）
   - [ ] AI 行程规划（LLM）
   - [ ] 地图展示（高德地图）

## 总结

✅ **登录注册系统已完成并可用**
- 用户可以注册、登录账号
- 数据存储在 Supabase 云端
- 支持多设备访问和同步
- Token 认证机制完善

✅ **云端同步已实现**
- 所有数据存储在 Supabase
- 支持多设备实时同步
- 数据安全可靠

📝 **待开发功能**
- 行程创建和编辑界面
- AI 智能规划功能
- 地图导航集成
- 费用管理界面

如有问题，请查看:
- [开发指南](./DEVELOPMENT.md)
- [Supabase 配置](./SUPABASE_SETUP.md)
- [部署文档](./DEPLOYMENT.md)

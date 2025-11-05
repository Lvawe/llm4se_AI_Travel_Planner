# AI 行程计划调试指南

## 🔍 问题现象
前端页面不显示 AI 生成的行程计划内容

## 📊 数据流分析

### 1. LLM 生成计划 (backend/src/services/llmService.ts)
```typescript
返回格式: TripPlanResponse {
  itinerary: DayPlan[],      // 日程数组
  budgetBreakdown: BudgetItem[],  // 预算明细数组
  tips: string[]             // 建议数组
}
```

### 2. AI 路由响应 (backend/src/routes/ai.ts)
```typescript
POST /api/ai/generate-plan
响应: { plan: TripPlanResponse }  // ⚠️ 注意嵌套在 plan 字段下
```

### 3. 前端创建行程 (frontend/src/app/trips/new/page.tsx)
```typescript
const aiResponse = await api.post('/api/ai/generate-plan', {...})
const generatedPlan = aiResponse.data.plan  // ✅ 正确提取 plan
// generatedPlan = {itinerary: [], budgetBreakdown: [], tips: []}

// 保存行程
await api.post('/api/trips', {
  ...formData,
  aiPlan: generatedPlan  // 传递完整计划对象
})
```

### 4. 后端保存 (backend/src/routes/trip.ts)
```typescript
POST /api/trips
const { aiPlan } = req.body
const trip = await prisma.trip.create({
  data: {
    ...otherFields,
    itinerary: aiPlan || null  // 保存到 itinerary 字段
  }
})
```

### 5. 数据库结构
```sql
Trip {
  id: string
  destination: string
  ...
  itinerary: Json?  -- 存储 {itinerary: [], budgetBreakdown: [], tips: []}
}
```

### 6. 前端读取 (frontend/src/app/trips/[id]/page.tsx)
```typescript
GET /api/trips/:id
const trip = response.data
// trip.itinerary = {itinerary: [], budgetBreakdown: [], tips: []}
//                  ↑ 直接是计划对象,不是双层嵌套!
```

## 🐛 调试步骤

### 步骤 1: 检查 LLM 生成
打开浏览器开发者工具,查看后端日志:
```
===== LLM 生成的计划 =====
plan: {
  "itinerary": [...],
  "budgetBreakdown": [...],
  "tips": [...]
}
```

### 步骤 2: 检查后端保存
查看后端日志:
```
===== 创建行程 - 后端接收数据 =====
aiPlan: { itinerary: [...], budgetBreakdown: [...], tips: [...] }

===== 保存到数据库的数据 =====
trip.itinerary: { itinerary: [...], budgetBreakdown: [...], tips: [...] }
```

### 步骤 3: 检查前端读取
打开浏览器控制台,查看日志:
```
===== API 响应数据 =====
完整响应: { id: "xxx", destination: "xxx", itinerary: {...} }
itinerary 字段: { itinerary: [...], budgetBreakdown: [...], tips: [...] }
```

### 步骤 4: 查看页面展示
页面会显示:
1. **调试信息框** - JSON 格式的完整数据
2. **原始数据类型** - 字段存在性检查
3. **日程安排** - 如果有 itinerary.itinerary 数组
4. **预算明细** - 如果有 budgetBreakdown
5. **旅行建议** - 如果有 tips

## ✅ 验证清单

- [ ] 后端日志显示 LLM 成功生成计划
- [ ] 后端日志显示 aiPlan 数据结构正确
- [ ] 后端日志显示数据成功保存到 trip.itinerary
- [ ] 前端控制台显示 trip.itinerary 有数据
- [ ] 前端控制台显示 trip.itinerary.itinerary 是数组
- [ ] 页面显示调试信息框(灰色背景)
- [ ] 页面显示日程安排(蓝色卡片)
- [ ] 页面显示预算明细(绿色背景)
- [ ] 页面显示旅行建议(黄色背景)

## 🔧 测试步骤

1. **重启后端服务**
   ```bash
   cd backend
   npm run dev
   ```

2. **重启前端服务**
   ```bash
   cd frontend
   npm run dev
   ```

3. **创建新行程**
   - 访问 http://localhost:5090/trips/new
   - 填写表单(目的地、日期、预算等)
   - 点击"🚀 智能创建行程"按钮
   - 等待 AI 生成(约 3-5 秒)
   - 自动跳转到行程详情页

4. **查看调试信息**
   - 打开浏览器开发者工具(F12)
   - 切换到 Console 标签
   - 查看前端日志输出
   - 切换到终端查看后端日志

5. **检查页面显示**
   - 滚动到"🤖 AI 生成的行程计划"区域
   - 查看灰色调试信息框
   - 查看数据类型检查
   - 查看实际内容展示

## 🚨 常见问题

### 问题 1: trip.itinerary 为 null
**原因**: AI 生成失败或保存时 aiPlan 为空
**解决**: 
- 检查 DASHSCOPE_API_KEY 环境变量
- 查看后端日志是否有 LLM 调用错误
- 检查前端是否正确传递 aiPlan

### 问题 2: trip.itinerary 不是对象
**原因**: 数据库 JSON 字段解析错误
**解决**:
- 检查 Prisma schema 中 itinerary 字段类型
- 确认为 Json? 或 Json 类型
- 重新运行 prisma generate

### 问题 3: trip.itinerary.itinerary 不存在
**原因**: 数据结构不匹配
**解决**:
- 查看前端调试信息的 JSON 输出
- 确认结构是 {itinerary: [], ...} 而不是其他格式
- 检查 LLM 服务的 parseLLMResponse 函数

### 问题 4: 页面完全不显示 AI 区域
**原因**: trip.itinerary 为 falsy 值 (null/undefined)
**解决**:
- 创建新行程测试(旧行程可能没有 itinerary 数据)
- 查看前端控制台 "itinerary 字段:" 是否为 null
- 确认后端保存逻辑正确执行

## 📝 下一步计划

完成调试后,根据实际数据结构:

1. **如果数据正常显示**:
   - 优化 UI 展示
   - 使用 AITripPlan 组件替换调试版本
   - 添加交互功能(编辑、导出等)

2. **如果发现结构问题**:
   - 修正前后端数据格式
   - 统一 itinerary 字段结构
   - 更新类型定义

3. **功能增强**:
   - 添加行程编辑功能
   - 支持重新生成 AI 计划
   - 导出为 PDF/图片

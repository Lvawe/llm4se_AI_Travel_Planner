# LLM 集成方案 - AI 旅行规划

## 1. LLM 选型建议

### 推荐方案：

#### 方案 A：通义千问（阿里云）
- ✅ 国内访问稳定
- ✅ 中文理解能力强
- ✅ 有免费额度
- ✅ API 简单易用

#### 方案 B：文心一言（百度）
- ✅ 国内服务稳定
- ✅ 旅游领域知识丰富
- ✅ 支持插件和函数调用

#### 方案 C：智谱 AI（ChatGLM）
- ✅ 开源友好
- ✅ 价格实惠
- ✅ 支持长文本

#### 方案 D：OpenAI GPT（国际）
- ✅ 能力最强
- ⚠️ 需要代理访问
- ⚠️ 成本较高

## 2. 推荐使用通义千问

### 2.1 获取 API Key

1. 访问阿里云百炼平台：https://bailian.console.aliyun.com/
2. 开通"模型服务灵积"
3. API-KEY 管理 → 创建新的 API-KEY
4. 选择模型：qwen-turbo 或 qwen-plus

### 2.2 配置环境变量

在 `backend/.env` 中添加：

```env
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxx
LLM_MODEL=qwen-turbo
```

## 3. 后端实现

### 3.1 安装依赖

```bash
cd backend
npm install @alicloud/darabonba-openapi @alicloud/openapi-client axios
```

### 3.2 创建 LLM 服务

创建 `backend/src/services/llmService.ts`：

```typescript
import axios from 'axios'

export interface TripPlanRequest {
  destination: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  preferences: string[]
  description?: string
}

export interface TripPlanResponse {
  itinerary: DayPlan[]
  recommendations: string[]
  budgetBreakdown: BudgetItem[]
  tips: string[]
}

export interface DayPlan {
  day: number
  date: string
  activities: Activity[]
}

export interface Activity {
  time: string
  title: string
  location: string
  description: string
  estimatedCost: number
  duration: string
}

export interface BudgetItem {
  category: string
  amount: number
  description: string
}

export class LLMService {
  private apiKey: string
  private model: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.DASHSCOPE_API_KEY || ''
    this.model = process.env.LLM_MODEL || 'qwen-turbo'
    this.baseUrl = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation'
  }

  /**
   * 生成旅行计划
   */
  async generateTripPlan(request: TripPlanRequest): Promise<TripPlanResponse> {
    const prompt = this.buildPrompt(request)

    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: this.model,
          input: {
            messages: [
              {
                role: 'system',
                content: '你是一个专业的旅行规划助手，擅长根据用户需求制定详细的旅行计划。你的回答应该包含每日行程、预算分配、实用建议等信息。请以 JSON 格式返回结果。'
              },
              {
                role: 'user',
                content: prompt
              }
            ]
          },
          parameters: {
            result_format: 'message',
            temperature: 0.7,
            max_tokens: 2000
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.output && response.data.output.choices) {
        const content = response.data.output.choices[0].message.content
        return this.parseLLMResponse(content, request)
      }

      throw new Error('LLM 返回数据格式错误')
    } catch (error: any) {
      console.error('LLM API 调用失败:', error.response?.data || error.message)
      throw new Error('AI 旅行规划生成失败')
    }
  }

  /**
   * 构建提示词
   */
  private buildPrompt(request: TripPlanRequest): string {
    const days = this.calculateDays(request.startDate, request.endDate)
    const dailyBudget = request.budget / days

    return `
请为以下旅行需求制定详细的旅行计划：

**目的地**: ${request.destination}
**出行日期**: ${request.startDate} 至 ${request.endDate} (共 ${days} 天)
**出行人数**: ${request.travelers} 人
**总预算**: ¥${request.budget} (人均每日约 ¥${dailyBudget.toFixed(0)})
**旅行偏好**: ${request.preferences.join('、')}
${request.description ? `**特殊需求**: ${request.description}` : ''}

请提供以下内容：

1. **每日详细行程** (包括时间、地点、活动、预估费用、游玩时长)
2. **预算分配建议** (住宿、餐饮、交通、门票、购物等)
3. **实用旅行建议** (最佳游玩路线、注意事项、美食推荐等)

请以 JSON 格式返回，结构如下：
{
  "itinerary": [
    {
      "day": 1,
      "date": "2024-01-01",
      "activities": [
        {
          "time": "09:00",
          "title": "参观故宫",
          "location": "故宫博物院",
          "description": "游览紫禁城，了解明清历史",
          "estimatedCost": 60,
          "duration": "3小时"
        }
      ]
    }
  ],
  "budgetBreakdown": [
    {
      "category": "住宿",
      "amount": 1000,
      "description": "三星级酒店，2晚"
    }
  ],
  "tips": [
    "提前预订门票可以节省排队时间",
    "建议购买公交卡方便出行"
  ]
}
`
  }

  /**
   * 解析 LLM 返回的内容
   */
  private parseLLMResponse(content: string, request: TripPlanRequest): TripPlanResponse {
    try {
      // 尝试提取 JSON
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        return parsed
      }

      // 如果无法解析 JSON，返回默认结构
      return this.generateDefaultPlan(request)
    } catch (error) {
      console.error('解析 LLM 响应失败:', error)
      return this.generateDefaultPlan(request)
    }
  }

  /**
   * 生成默认计划（作为降级方案）
   */
  private generateDefaultPlan(request: TripPlanRequest): TripPlanResponse {
    const days = this.calculateDays(request.startDate, request.endDate)
    const itinerary: DayPlan[] = []

    for (let i = 0; i < days; i++) {
      const date = new Date(request.startDate)
      date.setDate(date.getDate() + i)

      itinerary.push({
        day: i + 1,
        date: date.toISOString().split('T')[0],
        activities: [
          {
            time: '09:00',
            title: `${request.destination}景点游览`,
            location: request.destination,
            description: '探索当地著名景点',
            estimatedCost: 100,
            duration: '3小时'
          },
          {
            time: '12:00',
            title: '午餐时间',
            location: '当地特色餐厅',
            description: '品尝当地美食',
            estimatedCost: 80,
            duration: '1小时'
          },
          {
            time: '14:00',
            title: '自由活动',
            location: request.destination,
            description: '自由探索或休息',
            estimatedCost: 50,
            duration: '2小时'
          }
        ]
      })
    }

    return {
      itinerary,
      budgetBreakdown: [
        { category: '住宿', amount: request.budget * 0.35, description: '酒店住宿费用' },
        { category: '餐饮', amount: request.budget * 0.30, description: '餐饮费用' },
        { category: '交通', amount: request.budget * 0.15, description: '交通费用' },
        { category: '门票', amount: request.budget * 0.10, description: '景点门票' },
        { category: '购物', amount: request.budget * 0.10, description: '购物和其他' }
      ],
      tips: [
        '提前查看天气预报，准备合适的衣物',
        '提前预订热门景点门票',
        '保管好贵重物品',
        '了解当地的风俗习惯'
      ]
    }
  }

  /**
   * 计算天数
   */
  private calculateDays(startDate: string, endDate: string): number {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays + 1
  }

  /**
   * 聊天对话（用于后续的智能问答）
   */
  async chat(messages: Array<{ role: string; content: string }>): Promise<string> {
    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: this.model,
          input: { messages },
          parameters: {
            result_format: 'message',
            temperature: 0.8
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      if (response.data.output && response.data.output.choices) {
        return response.data.output.choices[0].message.content
      }

      throw new Error('LLM 返回数据格式错误')
    } catch (error: any) {
      console.error('LLM 聊天调用失败:', error.response?.data || error.message)
      throw new Error('AI 对话失败')
    }
  }
}
```

### 3.3 创建路由

创建 `backend/src/routes/ai.ts`：

```typescript
import { Router } from 'express'
import { LLMService } from '../services/llmService'
import { authMiddleware } from '../middleware/auth'

const router = Router()
const llmService = new LLMService()

// 生成旅行计划
router.post('/generate-plan', authMiddleware, async (req, res) => {
  try {
    const { destination, startDate, endDate, budget, travelers, preferences, description } = req.body

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ error: '缺少必填参数' })
    }

    const plan = await llmService.generateTripPlan({
      destination,
      startDate,
      endDate,
      budget: budget || 0,
      travelers: travelers || 1,
      preferences: preferences || [],
      description
    })

    res.json(plan)
  } catch (error: any) {
    console.error('Generate plan error:', error)
    res.status(500).json({ error: error.message })
  }
})

// AI 聊天
router.post('/chat', authMiddleware, async (req, res) => {
  try {
    const { messages } = req.body

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: '消息格式错误' })
    }

    const response = await llmService.chat(messages)

    res.json({ response })
  } catch (error: any) {
    console.error('Chat error:', error)
    res.status(500).json({ error: error.message })
  }
})

export default router
```

在 `backend/src/index.ts` 中注册路由：

```typescript
import aiRoutes from './routes/ai'

app.use('/api/ai', aiRoutes)
```

## 4. 前端集成

### 4.1 在创建行程页面添加"AI 生成"按钮

```tsx
const handleAIGenerate = async () => {
  if (!formData.destination || !formData.startDate || !formData.endDate) {
    toast.error('请先填写目的地和日期')
    return
  }

  setLoading(true)
  try {
    const response = await api.post('/api/ai/generate-plan', {
      destination: formData.destination,
      startDate: formData.startDate,
      endDate: formData.endDate,
      budget: parseFloat(formData.budget) || 5000,
      travelers: parseInt(formData.travelers),
      preferences: formData.preferences,
      description: formData.description
    })

    // 显示 AI 生成的计划
    setAIPlan(response.data)
    toast.success('AI 旅行计划生成成功！')
  } catch (error: any) {
    toast.error('AI 生成失败，请稍后重试')
  } finally {
    setLoading(false)
  }
}
```

## 5. 存储到数据库

### 5.1 扩展 Prisma Schema

在 `backend/prisma/schema.prisma` 中添加：

```prisma
model Trip {
  id          String   @id @default(uuid())
  userId      String
  destination String
  startDate   DateTime
  endDate     DateTime
  budget      Float    @default(0)
  travelers   Int      @default(1)
  preferences String[]
  description String?
  status      String   @default("planning")
  aiPlan      Json?    // 存储 AI 生成的计划
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  expenses Expense[]
}
```

运行迁移：

```bash
cd backend
npm run db:migrate
```

### 5.2 保存 AI 计划

```typescript
// 在创建行程时保存 AI 计划
const trip = await prisma.trip.create({
  data: {
    userId: req.user.userId,
    destination,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    budget,
    travelers,
    preferences,
    description,
    status: 'planning',
    aiPlan: aiGeneratedPlan // 保存 AI 生成的完整计划
  }
})
```

## 6. 测试流程

1. 配置通义千问 API Key
2. 填写行程基本信息
3. 点击"AI 生成计划"按钮
4. 查看生成的详细行程
5. 保存到数据库

## 7. 成本估算

### 通义千问定价（参考）：

- qwen-turbo: ¥0.008/1k tokens
- qwen-plus: ¥0.02/1k tokens
- 每次生成约消耗 1500-2000 tokens
- 成本：¥0.012-¥0.04/次

### 优化建议：

- 使用缓存减少重复请求
- 对相似请求使用模板
- 设置每日调用次数限制
- 提供降级方案（基础模板）

## 8. 相关文档

- 通义千问 API 文档：https://help.aliyun.com/zh/dashscope/
- 百度文心一言：https://cloud.baidu.com/doc/WENXINWORKSHOP/index.html
- 智谱 AI：https://open.bigmodel.cn/dev/api

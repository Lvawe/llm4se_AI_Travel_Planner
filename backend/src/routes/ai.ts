import { Router, Response } from 'express'
import { LLMService } from '../services/llmService'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const llmService = new LLMService()

// 生成旅行计划
router.post('/generate-plan', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { destination, startDate, endDate, budget, travelers, preferences, description } = req.body

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({ error: '缺少必填参数：目的地、开始日期、结束日期' })
    }

    console.log('生成旅行计划请求:', { destination, startDate, endDate, budget, travelers })

    const plan = await llmService.generateTripPlan({
      destination,
      startDate,
      endDate,
      budget: budget || 5000,
      travelers: travelers || 1,
      preferences: preferences || [],
      description
    })

    // 🔍 调试日志 - 查看 LLM 生成的计划
    console.log('===== LLM 生成的计划 =====')
    console.log('plan:', JSON.stringify(plan, null, 2))
    console.log('plan.itinerary 数量:', plan.itinerary?.length)
    console.log('plan.budgetBreakdown 数量:', plan.budgetBreakdown?.length)
    console.log('plan.tips 数量:', plan.tips?.length)
    console.log('===========================')

    res.json({ plan })
  } catch (error: any) {
    console.error('Generate plan error:', error)
    res.status(500).json({ error: error.message || '生成旅行计划失败' })
  }
})

export default router

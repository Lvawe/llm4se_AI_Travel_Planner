import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.use(authMiddleware)

// Get all expenses for user or trip
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const { tripId } = req.query
    const where: any = { userId: req.userId }
    
    if (tripId) {
      where.tripId = tripId as string
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { date: 'desc' },
    })

    res.json(expenses)
  } catch (error) {
    console.error('Get expenses error:', error)
    res.status(500).json({ message: '获取费用记录失败' })
  }
})

// Create expense
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const expense = await prisma.expense.create({
      data: {
        ...req.body,
        userId: req.userId!,
      },
    })
    res.status(201).json(expense)
  } catch (error) {
    console.error('Create expense error:', error)
    res.status(500).json({ message: '创建费用记录失败' })
  }
})

// Delete expense
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const expense = await prisma.expense.deleteMany({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    })

    if (expense.count === 0) {
      return res.status(404).json({ message: '费用记录不存在' })
    }

    res.json({ message: '费用记录已删除' })
  } catch (error) {
    console.error('Delete expense error:', error)
    res.status(500).json({ message: '删除费用记录失败' })
  }
})

export default router

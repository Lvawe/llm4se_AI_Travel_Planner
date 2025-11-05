import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

router.use(authMiddleware)

// Get API keys
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const apiKeys = await prisma.apiKey.findUnique({
      where: { userId: req.userId },
    })

    res.json(apiKeys || {})
  } catch (error) {
    console.error('Get API keys error:', error)
    res.status(500).json({ message: '获取 API Keys 失败' })
  }
})

// Save or update API keys
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const apiKeys = await prisma.apiKey.upsert({
      where: { userId: req.userId! },
      create: {
        userId: req.userId!,
        ...req.body,
      },
      update: req.body,
    })

    res.json(apiKeys)
  } catch (error) {
    console.error('Save API keys error:', error)
    res.status(500).json({ message: '保存 API Keys 失败' })
  }
})

export default router

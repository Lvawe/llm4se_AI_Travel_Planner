import { Router, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { authMiddleware, AuthRequest } from '../middleware/auth'

const router = Router()
const prisma = new PrismaClient()

// All routes require authentication
router.use(authMiddleware)

// Get all trips for user
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const trips = await prisma.trip.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
    })
    res.json(trips)
  } catch (error) {
    console.error('Get trips error:', error)
    res.status(500).json({ message: '获取行程失败' })
  }
})

// Get single trip
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const trip = await prisma.trip.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      include: {
        expenses: true,
      },
    })

    if (!trip) {
      return res.status(404).json({ message: '行程不存在' })
    }

    res.json(trip)
  } catch (error) {
    console.error('Get trip error:', error)
    res.status(500).json({ message: '获取行程失败' })
  }
})

// Create trip
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const trip = await prisma.trip.create({
      data: {
        ...req.body,
        userId: req.userId!,
      },
    })
    res.status(201).json(trip)
  } catch (error) {
    console.error('Create trip error:', error)
    res.status(500).json({ message: '创建行程失败' })
  }
})

// Update trip
router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const trip = await prisma.trip.updateMany({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
      data: req.body,
    })

    if (trip.count === 0) {
      return res.status(404).json({ message: '行程不存在' })
    }

    const updatedTrip = await prisma.trip.findUnique({
      where: { id: req.params.id },
    })

    res.json(updatedTrip)
  } catch (error) {
    console.error('Update trip error:', error)
    res.status(500).json({ message: '更新行程失败' })
  }
})

// Delete trip
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const trip = await prisma.trip.deleteMany({
      where: {
        id: req.params.id,
        userId: req.userId,
      },
    })

    if (trip.count === 0) {
      return res.status(404).json({ message: '行程不存在' })
    }

    res.json({ message: '行程已删除' })
  } catch (error) {
    console.error('Delete trip error:', error)
    res.status(500).json({ message: '删除行程失败' })
  }
})

export default router

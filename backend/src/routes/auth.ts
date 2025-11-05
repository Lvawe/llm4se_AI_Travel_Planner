import { Router, Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const router = Router()
const prisma = new PrismaClient()

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('无效的邮箱地址'),
  password: z.string().min(6, '密码至少需要 6 个字符'),
  name: z.string().min(1, '姓名不能为空'),
})

const loginSchema = z.object({
  email: z.string().email('无效的邮箱地址'),
  password: z.string().min(1, '密码不能为空'),
})

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body)
    const { email, password, name } = validatedData

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return res.status(400).json({ message: '该邮箱已被注册' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    })

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn })

    res.status(201).json({
      token,
      user,
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '验证失败',
        errors: error.errors,
      })
    }
    console.error('Register error:', error)
    res.status(500).json({ message: '注册失败，请重试' })
  }
})

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = loginSchema.parse(req.body)
    const { email, password } = validatedData

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return res.status(401).json({ message: '邮箱或密码错误' })
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: '邮箱或密码错误' })
    }

    // Generate JWT token
    const secret = process.env.JWT_SECRET || 'your-secret-key'
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d'
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    res.json({
      token,
      user: userWithoutPassword,
    })
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: '验证失败',
        errors: error.errors,
      })
    }
    console.error('Login error:', error)
    res.status(500).json({ message: '登录失败，请重试' })
  }
})

export default router

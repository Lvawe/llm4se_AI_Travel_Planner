// User types
export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Trip types
export interface Trip {
  id: string
  userId: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  preferences: string[]
  description?: string
  itinerary?: any // JSON data from AI
  status: 'draft' | 'planned' | 'ongoing' | 'completed'
  createdAt: string
  updatedAt: string
  expenses?: Expense[]
}

// Expense types
export interface Expense {
  id: string
  tripId: string
  userId: string
  category: 'transportation' | 'accommodation' | 'food' | 'activity' | 'shopping' | 'other'
  amount: number
  currency: string
  description: string
  date: string
  createdAt: string
}

// AI Plan types
export interface AIPlan {
  itinerary: DayPlan[]
  budgetBreakdown: BudgetBreakdown
  tips: string[]
}

export interface DayPlan {
  day: string
  activities: string[]
}

export interface BudgetBreakdown {
  [key: string]: number
}

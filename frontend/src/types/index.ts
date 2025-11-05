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

export interface TripPlan {
  id: string
  userId: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  travelers: number
  preferences: string[]
  itinerary: Itinerary[]
  status: 'draft' | 'planned' | 'ongoing' | 'completed'
  createdAt: string
  updatedAt: string
}

export interface Itinerary {
  day: number
  date: string
  activities: Activity[]
  accommodation?: Accommodation
  meals: Meal[]
  transportation: Transportation[]
  totalCost: number
}

export interface Activity {
  id: string
  name: string
  type: 'attraction' | 'activity' | 'rest'
  location: Location
  startTime: string
  endTime: string
  duration: number
  cost: number
  description?: string
  tips?: string[]
}

export interface Accommodation {
  name: string
  type: string
  location: Location
  checkIn: string
  checkOut: string
  cost: number
  rating?: number
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  name: string
  location: Location
  time: string
  cost: number
  cuisine?: string
}

export interface Transportation {
  type: 'flight' | 'train' | 'bus' | 'taxi' | 'walk' | 'metro'
  from: Location
  to: Location
  departureTime: string
  arrivalTime: string
  cost: number
  duration: number
}

export interface Location {
  name: string
  address: string
  latitude: number
  longitude: number
}

export interface Expense {
  id: string
  tripId: string
  category: 'transportation' | 'accommodation' | 'food' | 'activity' | 'shopping' | 'other'
  amount: number
  currency: string
  description: string
  date: string
  createdAt: string
}

export interface ApiKeysConfig {
  iFlytek?: {
    appId: string
    apiKey: string
    apiSecret: string
  }
  llm?: {
    apiKey: string
    apiUrl: string
  }
  amap?: {
    apiKey: string
  }
}

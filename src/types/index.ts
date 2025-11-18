export interface User {
  uid: string
  email: string
  name?: string
  phone?: string
  isAdmin?: boolean
}

export interface Card {
  id: string
  name: string
  description: string
  price: number
  image?: string
  quantity: number
  createdAt: any
}

export interface CartItem {
  card: Card
  quantity: number
}

export interface Order {
  id: string
  userId: string
  userName: string
  userPhone: string
  userEmail?: string
  items: CartItem[]
  total: number
  status: 'pending' | 'completed' | 'cancelled'
  createdAt: any
}


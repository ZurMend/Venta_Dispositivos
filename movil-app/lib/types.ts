export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: "electronics" | "pc"
  image: string
  stock: number
  brand: string
}

export interface User {
  id: number
  name: string
  email: string
  role: "client" | "admin"
  registeredAt: string
  phone?: string
  address?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: number
  userId: number
  userName: string
  userEmail: string
  items: OrderItem[]
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered"
  createdAt: string
}

export interface OrderItem {
  productId: number
  productName: string
  quantity: number
  price: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}

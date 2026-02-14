import { API_BASE_URL, API_ENDPOINTS, USE_MOCK_DATA } from "./api-config"
import { mockProducts, mockUsers, mockOrders } from "./mock-data"
import type { Product, User, Order, AuthResponse, LoginCredentials } from "./types"

// ============================================================
// CAPA DE SERVICIOS API
// ============================================================
// Cuando tu API de Spring Boot este lista:
// 1. Cambia USE_MOCK_DATA a false en api-config.ts
// 2. Actualiza API_BASE_URL con la URL de tu servidor
// 3. Las funciones automaticamente llamaran a tu API
// ============================================================

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(typeof window !== "undefined" && localStorage.getItem("token")
        ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
        : {}),
    },
    ...options,
  })

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`)
  }

  return res.json()
}

// --- AUTH ---

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  if (USE_MOCK_DATA) {
    const user = mockUsers.find((u) => u.email === credentials.email)
    if (!user) throw new Error("Usuario no encontrado")
    return { user, token: "mock-jwt-token-" + user.id }
  }
  return fetchAPI<AuthResponse>(API_ENDPOINTS.LOGIN, {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

// --- PRODUCTS ---

export async function getProducts(): Promise<Product[]> {
  if (USE_MOCK_DATA) return mockProducts
  return fetchAPI<Product[]>(API_ENDPOINTS.PRODUCTS)
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (USE_MOCK_DATA) return mockProducts.filter((p) => p.category === category)
  return fetchAPI<Product[]>(API_ENDPOINTS.PRODUCTS_BY_CATEGORY(category))
}

export async function getProductById(id: number): Promise<Product | undefined> {
  if (USE_MOCK_DATA) return mockProducts.find((p) => p.id === id)
  return fetchAPI<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id))
}

export async function createProduct(product: Omit<Product, "id">): Promise<Product> {
  if (USE_MOCK_DATA) {
    const newProduct = { ...product, id: Date.now() }
    mockProducts.push(newProduct)
    return newProduct
  }
  return fetchAPI<Product>(API_ENDPOINTS.PRODUCTS, {
    method: "POST",
    body: JSON.stringify(product),
  })
}

export async function updateProduct(id: number, product: Partial<Product>): Promise<Product> {
  if (USE_MOCK_DATA) {
    const idx = mockProducts.findIndex((p) => p.id === id)
    if (idx === -1) throw new Error("Producto no encontrado")
    mockProducts[idx] = { ...mockProducts[idx], ...product }
    return mockProducts[idx]
  }
  return fetchAPI<Product>(API_ENDPOINTS.PRODUCT_BY_ID(id), {
    method: "PUT",
    body: JSON.stringify(product),
  })
}

export async function deleteProduct(id: number): Promise<void> {
  if (USE_MOCK_DATA) {
    const idx = mockProducts.findIndex((p) => p.id === id)
    if (idx !== -1) mockProducts.splice(idx, 1)
    return
  }
  await fetchAPI(API_ENDPOINTS.PRODUCT_BY_ID(id), { method: "DELETE" })
}

// --- USERS (admin) ---

export async function getUsers(): Promise<User[]> {
  if (USE_MOCK_DATA) return mockUsers.filter((u) => u.role === "client")
  return fetchAPI<User[]>(API_ENDPOINTS.USERS)
}

export async function getUserById(id: number): Promise<User | undefined> {
  if (USE_MOCK_DATA) return mockUsers.find((u) => u.id === id)
  return fetchAPI<User>(API_ENDPOINTS.USER_BY_ID(id))
}

// --- ORDERS ---

export async function getOrders(): Promise<Order[]> {
  if (USE_MOCK_DATA) return mockOrders
  return fetchAPI<Order[]>(API_ENDPOINTS.ORDERS)
}

export async function getOrdersByUser(userId: number): Promise<Order[]> {
  if (USE_MOCK_DATA) return mockOrders.filter((o) => o.userId === userId)
  return fetchAPI<Order[]>(API_ENDPOINTS.ORDERS_BY_USER(userId))
}

export async function createOrder(order: Omit<Order, "id" | "createdAt">): Promise<Order> {
  if (USE_MOCK_DATA) {
    const newOrder: Order = {
      ...order,
      id: Date.now(),
      createdAt: new Date().toISOString().split("T")[0],
    }
    mockOrders.push(newOrder)
    return newOrder
  }
  return fetchAPI<Order>(API_ENDPOINTS.ORDERS, {
    method: "POST",
    body: JSON.stringify(order),
  })
}

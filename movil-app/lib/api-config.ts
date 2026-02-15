// ============================================================
// CONFIGURACION DE LA API - SPRING BOOT
// ============================================================
// Cambia esta URL base cuando tengas tu backend de Spring Boot
// funcionando. Por ahora usa datos mock locales.
// ============================================================

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

// Cambia esto a false cuando tu API de Spring Boot este lista
export const USE_MOCK_DATA = false

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  // Products
  PRODUCTS: "/products",
  PRODUCTS_BY_CATEGORY: (category: string) =>
    `/products/category/${category}`,
  PRODUCT_BY_ID: (id: number) => `/products/${id}`,

  ORDERS: "/orders",
  ORDER_BY_ID: (id: number) => `/orders/${id}`,
  ORDERS_BY_USER: (userId: number) => `/orders/user/${userId}`,


  USERS: "/users",
  USER_BY_ID: (id: number) => `/users/${id}`,

  CART: "/cart",
  CART_ADD: "/cart/add",
  CART_REMOVE: (productId: number) => `/cart/remove/${productId}`,
  CHECKOUT: "/cart/checkout",
} as const

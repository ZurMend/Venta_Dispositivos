"use client"

import { useSyncExternalStore, useCallback } from "react"
import type { CartItem, Product } from "./types"

let cartItems: CartItem[] = []
let listeners: Array<() => void> = []

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

function subscribe(listener: () => void) {
  listeners = [...listeners, listener]
  return () => {
    listeners = listeners.filter((l) => l !== listener)
  }
}

function getSnapshot() {
  return cartItems
}

function getServerSnapshot() {
  return [] as CartItem[]
}

export function useCart() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const addToCart = useCallback((product: Product) => {
    const existing = cartItems.find((item) => item.product.id === product.id)
    if (existing) {
      cartItems = cartItems.map((item) =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      cartItems = [...cartItems, { product, quantity: 1 }]
    }
    emitChange()
  }, [])

  const removeFromCart = useCallback((productId: number) => {
    cartItems = cartItems.filter((item) => item.product.id !== productId)
    emitChange()
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      cartItems = cartItems.filter((item) => item.product.id !== productId)
    } else {
      cartItems = cartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    }
    emitChange()
  }, [])

  const clearCart = useCallback(() => {
    cartItems = []
    emitChange()
  }, [])

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
  }
}

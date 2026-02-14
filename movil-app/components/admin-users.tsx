"use client"

import { useState, useEffect } from "react"
import {
  Users,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getUsers, getOrdersByUser } from "@/lib/api-service"
import type { User, Order } from "@/lib/types"

function statusColor(status: Order["status"]) {
  switch (status) {
    case "pending":
      return "bg-accent text-accent-foreground"
    case "confirmed":
      return "bg-primary text-primary-foreground"
    case "shipped":
      return "bg-secondary text-secondary-foreground"
    case "delivered":
      return "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))]"
    default:
      return "bg-secondary text-secondary-foreground"
  }
}

function statusLabel(status: Order["status"]) {
  switch (status) {
    case "pending":
      return "Pendiente"
    case "confirmed":
      return "Confirmado"
    case "shipped":
      return "Enviado"
    case "delivered":
      return "Entregado"
    default:
      return status
  }
}

function UserCard({ user }: { user: User }) {
  const [expanded, setExpanded] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  async function loadOrders() {
    if (orders.length > 0) return
    setLoadingOrders(true)
    try {
      const data = await getOrdersByUser(user.id)
      setOrders(data)
    } catch {
      // handle error
    } finally {
      setLoadingOrders(false)
    }
  }

  function toggleExpand() {
    if (!expanded) loadOrders()
    setExpanded(!expanded)
  }

  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={toggleExpand}
        className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-secondary/50"
      >
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
          {user.name.charAt(0)}
        </div>
        <div className="flex flex-1 flex-col gap-0.5">
          <p className="font-semibold text-card-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {expanded && (
        <div className="flex flex-col gap-4 border-t border-border p-4">
          {/* User Data */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{user.phone}</span>
              </div>
            )}
            {user.address && (
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-foreground">{user.address}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground">Registrado: {user.registeredAt}</span>
            </div>
          </div>

          <Separator />

          {/* Orders */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">
                  Compras ({orders.length})
                </span>
              </div>
              {orders.length > 0 && (
                <span className="text-sm font-bold text-primary">
                  Total: ${totalSpent.toFixed(2)}
                </span>
              )}
            </div>

            {loadingOrders ? (
              <p className="text-sm text-muted-foreground">Cargando compras...</p>
            ) : orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sin compras registradas</p>
            ) : (
              <div className="flex flex-col gap-2">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-md border border-border bg-background p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-muted-foreground">
                        Pedido #{order.id}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColor(order.status)}`}>
                        {statusLabel(order.status)}
                      </span>
                    </div>
                    <div className="mt-2 flex flex-col gap-1">
                      {order.items.map((item, idx) => (
                        <div
                          key={`${order.id}-${item.productId}-${idx}`}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-foreground">
                            {item.productName} x{item.quantity}
                          </span>
                          <span className="font-medium text-foreground">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                      <span className="text-xs text-muted-foreground">
                        {order.createdAt}
                      </span>
                      <span className="text-sm font-bold text-primary">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadUsers() {
      setLoading(true)
      try {
        const data = await getUsers()
        setUsers(data)
      } catch {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    loadUsers()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Usuarios</h2>
        <Badge variant="secondary">{users.length}</Badge>
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={`skel-${i}`} className="h-16 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
          <Users className="h-10 w-10 opacity-30" />
          <p className="text-sm">No hay usuarios registrados</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {users.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  )
}

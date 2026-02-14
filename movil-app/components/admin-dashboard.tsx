"use client"

import { useState, useEffect } from "react"
import { Package, Users, DollarSign, TrendingUp } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin-header"
import { AdminProducts } from "@/components/admin-products"
import { AdminUsers } from "@/components/admin-users"
import { getProducts, getUsers, getOrders } from "@/lib/api-service"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0,
  })

  useEffect(() => {
    async function loadStats() {
      try {
        const [products, users, orders] = await Promise.all([
          getProducts(),
          getUsers(),
          getOrders(),
        ])
        setStats({
          products: products.length,
          users: users.length,
          orders: orders.length,
          revenue: orders.reduce((sum, o) => sum + o.total, 0),
        })
      } catch {
        // handle error
      }
    }
    loadStats()
  }, [])

  const statCards = [
    {
      label: "Productos",
      value: stats.products,
      icon: Package,
      format: (v: number) => v.toString(),
    },
    {
      label: "Usuarios",
      value: stats.users,
      icon: Users,
      format: (v: number) => v.toString(),
    },
    {
      label: "Pedidos",
      value: stats.orders,
      icon: TrendingUp,
      format: (v: number) => v.toString(),
    },
    {
      label: "Ingresos",
      value: stats.revenue,
      icon: DollarSign,
      format: (v: number) => `$${v.toFixed(2)}`,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader onLogout={onLogout} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {statCards.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </span>
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-card-foreground">
                  {stat.format(stat.value)}
                </p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="products">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="products" className="flex-1 sm:flex-none gap-1">
                <Package className="h-4 w-4" />
                Productos
              </TabsTrigger>
              <TabsTrigger value="users" className="flex-1 sm:flex-none gap-1">
                <Users className="h-4 w-4" />
                Usuarios
              </TabsTrigger>
            </TabsList>
            <TabsContent value="products" className="mt-4">
              <AdminProducts />
            </TabsContent>
            <TabsContent value="users" className="mt-4">
              <AdminUsers />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

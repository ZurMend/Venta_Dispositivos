"use client"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductCard } from "@/components/product-card"
import { ProductDetail } from "@/components/product-detail"
import { ClientHeader } from "@/components/client-header"
import { getProducts } from "@/lib/api-service"
import type { Product } from "@/lib/types"

interface ClientStoreProps {
  onLogout: () => void
}

export function ClientStore({ onLogout }: ClientStoreProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [category, setCategory] = useState("all")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const data = await getProducts()
        setProducts(data)
      } catch {
        // handle error
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const filtered = products.filter((p) => {
    const matchCategory = category === "all" || p.category === category
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  if (selectedProduct) {
    return (
      <div className="min-h-screen bg-background">
        <ClientHeader onLogout={onLogout} />
        <main className="mx-auto max-w-7xl px-4 py-6">
          <ProductDetail
            product={selectedProduct}
            onBack={() => setSelectedProduct(null)}
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientHeader onLogout={onLogout} />

      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col gap-6">
          {/* Hero */}
          <section className="rounded-xl bg-primary px-6 py-8 text-primary-foreground">
            <h1 className="text-balance text-2xl font-bold md:text-3xl">
              Tecnologia al mejor precio
            </h1>
            <p className="mt-2 text-sm opacity-90 md:text-base">
              Encuentra dispositivos electronicos y componentes de PC de las mejores marcas.
            </p>
          </section>

          {/* Filters */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Tabs value={category} onValueChange={setCategory}>
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="electronics">Electronica</TabsTrigger>
                <TabsTrigger value="pc">PC</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={`skeleton-${i}`}
                  className="aspect-[3/4] animate-pulse rounded-lg bg-secondary"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
              <Search className="h-10 w-10 opacity-30" />
              <p className="text-sm">No se encontraron productos</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onViewDetail={setSelectedProduct}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

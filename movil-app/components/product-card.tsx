"use client"

import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/types"
import { useCart } from "@/lib/cart-store"

interface ProductCardProps {
  product: Product
  onViewDetail: (product: Product) => void
}

export function ProductCard({ product, onViewDetail }: ProductCardProps) {
  const { addToCart } = useCart()

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => onViewDetail(product)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onViewDetail(product)
        }
      }}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-border bg-card text-left transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square overflow-hidden bg-secondary">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <Badge
          className="absolute left-2 top-2"
          variant={product.category === "electronics" ? "default" : "secondary"}
        >
          {product.category === "electronics" ? "Electronica" : "PC"}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <p className="text-xs font-medium text-muted-foreground">
          {product.brand}
        </p>
        <h3 className="line-clamp-2 text-sm font-semibold leading-tight text-card-foreground">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <span className="text-lg font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              addToCart(product)
            }}
            className="h-8 gap-1 px-2 text-xs"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only">Agregar</span>
          </Button>
        </div>
        {product.stock <= 10 && (
          <p className="text-xs text-destructive">
            Solo {product.stock} disponibles
          </p>
        )}
      </div>
    </div>
  )
}

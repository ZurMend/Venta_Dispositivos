"use client"

import Image from "next/image"
import { ArrowLeft, ShoppingCart, Package, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Product } from "@/lib/types"
import { useCart } from "@/lib/cart-store"

interface ProductDetailProps {
  product: Product
  onBack: () => void
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const { addToCart } = useCart()

  return (
    <div className="flex flex-col gap-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a productos
      </button>

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-secondary md:w-1/2">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge variant={product.category === "electronics" ? "default" : "secondary"}>
                {product.category === "electronics" ? "Electronica" : "PC"}
              </Badge>
              <span className="text-sm text-muted-foreground">{product.brand}</span>
            </div>
            <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
          </div>

          <p className="text-3xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </p>

          <Separator />

          <p className="leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          <div className="flex items-center gap-2">
            {product.stock > 0 ? (
              <>
                <Check className="h-4 w-4 text-[hsl(var(--success))]" />
                <span className="text-sm text-[hsl(var(--success))]">
                  En stock ({product.stock} disponibles)
                </span>
              </>
            ) : (
              <>
                <Package className="h-4 w-4 text-destructive" />
                <span className="text-sm text-destructive">Agotado</span>
              </>
            )}
          </div>

          <Button
            size="lg"
            className="mt-4 gap-2"
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-5 w-5" />
            Agregar al carrito
          </Button>
        </div>
      </div>
    </div>
  )
}

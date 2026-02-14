"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Trash2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/api-service"
import type { Product } from "@/lib/types"

const emptyForm = {
  name: "",
  description: "",
  price: 0,
  category: "electronics" as "electronics" | "pc",
  image: "/images/iphone.jpg",
  stock: 0,
  brand: "",
}

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyForm)

  async function loadProducts() {
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

  useEffect(() => {
    loadProducts()
  }, [])

  function openCreate() {
    setEditingProduct(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(product: Product) {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      brand: product.brand,
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, form)
      } else {
        await createProduct(form)
      }
      setDialogOpen(false)
      loadProducts()
    } catch {
      // handle error
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteProduct(id)
      loadProducts()
    } catch {
      // handle error
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Productos</h2>
          <Badge variant="secondary">{products.length}</Badge>
        </div>
        <Button size="sm" onClick={openCreate} className="gap-1">
          <Plus className="h-4 w-4" />
          Nuevo
        </Button>
      </div>

      {/* Mobile Cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={`skel-${i}`} className="h-24 animate-pulse rounded-lg bg-secondary" />
            ))
          : products.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
              >
                <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <p className="text-sm font-semibold text-card-foreground">{product.name}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">
                      ${product.price.toFixed(2)}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      Stock: {product.stock}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(product)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-lg border border-border md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Marca</TableHead>
              <TableHead className="text-right">Precio</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  Cargando productos...
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-secondary">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-foreground">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.category === "electronics" ? "default" : "secondary"}>
                      {product.category === "electronics" ? "Electronica" : "PC"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{product.brand}</TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={product.stock <= 10 ? "destructive" : "outline"}>
                      {product.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(product)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nombre</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nombre del producto"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="brand">Marca</Label>
              <Input
                id="brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="Marca"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">Descripcion</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descripcion del producto"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="price">Precio ($)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number.parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Categoria</Label>
              <Select
                value={form.category}
                onValueChange={(val) =>
                  setForm({ ...form, category: val as "electronics" | "pc" })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electronics">Electronica</SelectItem>
                  <SelectItem value="pc">PC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="image">URL de imagen</Label>
              <Input
                id="image"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="/images/producto.jpg"
              />
            </div>
            <Button onClick={handleSave} className="mt-2">
              {editingProduct ? "Guardar Cambios" : "Crear Producto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

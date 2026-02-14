"use client"

import React from "react"

import { useState } from "react"
import { Monitor, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>
  error: string | null
}

export function LoginScreen({ onLogin, error }: LoginScreenProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await onLogin(email, password)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Monitor className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">ZurTep</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Inicia sesion en tu cuenta
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Correo electronico</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contrasena</Label>
            <Input
              id="password"
              type="password"
              placeholder="Tu contrasena"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="rounded-md bg-destructive/10 p-2 text-center text-sm text-destructive">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Iniciar sesion
          </Button>
        </form>

        <Separator className="my-6" />

        {/* Demo accounts */}
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Cuentas de prueba
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail("carlos@example.com")
                setPassword("demo123")
              }}
              className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
            >
              <div className="flex flex-col">
                <span className="font-medium text-card-foreground">Cliente</span>
                <span className="text-xs text-muted-foreground">
                  carlos@example.com
                </span>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Cliente
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail("admin@zurtep.com")
                setPassword("admin123")
              }}
              className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
            >
              <div className="flex flex-col">
                <span className="font-medium text-card-foreground">Administrador</span>
                <span className="text-xs text-muted-foreground">
                  admin@zurtep.com
                </span>
              </div>
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
                Admin
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

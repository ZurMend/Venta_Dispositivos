"use client"

import { Monitor, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartSheet } from "@/components/cart-sheet"
import { useAuth } from "@/lib/auth-store"

interface ClientHeaderProps {
  onLogout: () => void
}

export function ClientHeader({ onLogout }: ClientHeaderProps) {
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Monitor className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">TepZur</span>
        </div>

        <div className="flex items-center gap-2">
          {user && (
            <span className="hidden items-center gap-1.5 text-sm text-muted-foreground sm:flex">
              <User className="h-3.5 w-3.5" />
              {user.name}
            </span>
          )}
          <CartSheet />
          <Button variant="ghost" size="icon" onClick={onLogout}>
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Cerrar sesion</span>
          </Button>
        </div>
      </div>
    </header>
  )
}

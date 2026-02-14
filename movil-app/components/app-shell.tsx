"use client"

import { useState, useCallback } from "react"
import { useAuth } from "@/lib/auth-store"
import { LoginScreen } from "@/components/login-screen"
import { ClientStore } from "@/components/client-store"
import { AdminDashboard } from "@/components/admin-dashboard"

export function AppShell() {
  const { user, isAuthenticated, login, logout } = useAuth()
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleLogin = useCallback(
    async (email: string, password: string) => {
      setLoginError(null)
      try {
        await login(email, password)
      } catch {
        setLoginError("Correo o contrasena incorrectos")
      }
    },
    [login]
  )

  const handleLogout = useCallback(() => {
    logout()
  }, [logout])

  if (!isAuthenticated || !user) {
    return <LoginScreen onLogin={handleLogin} error={loginError} />
  }

  if (user.role === "admin") {
    return <AdminDashboard onLogout={handleLogout} />
  }

  return <ClientStore onLogout={handleLogout} />
}

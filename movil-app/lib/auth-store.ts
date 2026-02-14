"use client"

import { useSyncExternalStore, useCallback } from "react"
import type { User } from "./types"
import { login as apiLogin } from "./api-service"

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

let authState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

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
  return authState
}

function getServerSnapshot(): AuthState {
  return { user: null, token: null, isAuthenticated: false }
}

export function useAuth() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const loginAction = useCallback(async (email: string, password: string) => {
    const response = await apiLogin({ email, password })
    authState = {
      user: response.user,
      token: response.token,
      isAuthenticated: true,
    }
    emitChange()
    return response.user
  }, [])

  const logout = useCallback(() => {
    authState = { user: null, token: null, isAuthenticated: false }
    emitChange()
  }, [])

  return {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    login: loginAction,
    logout,
  }
}

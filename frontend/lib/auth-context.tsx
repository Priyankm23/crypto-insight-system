"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { api } from "./api"

interface User {
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing token
    const token = localStorage.getItem("access_token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      setUser(JSON.parse(userData))
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    const response = await api.auth.login(email, password)
    localStorage.setItem("access_token", response.access_token)

    const userData = { email, name: email.split("@")[0] }
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)

    router.push("/dashboard")
  }

  const signup = async (name: string, email: string, password: string) => {
    await api.auth.signup({ name, email, password })
    // Auto login after signup
    await login(email, password)
  }

  const logout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    setUser(null)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

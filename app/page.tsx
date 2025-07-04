"use client"

import { useState } from "react"
import { LoginPage } from "@/components/login-page"
import { Dashboard } from "@/components/dashboard"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const handleLogin = (email: string, password: string) => {
    // Mock authentication - in real app, this would call an API
    if (email && password) {
      setCurrentUser({
        id: 1,
        name: "John Doe",
        email: email,
        avatar: "/placeholder.svg?height=32&width=32",
      })
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />
  }

  return <Dashboard user={currentUser} onLogout={handleLogout} />
}

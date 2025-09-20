"use client"

import type React from "react"

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "user" | "admin"
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Since we're auto-logging in users, we don't need to redirect
    // Backend will handle proper authentication later
    if (!isAuthenticated) {
      // For now, just log the attempt - don't redirect
      console.log("User not authenticated, but allowing access for demo")
    }

    if (requiredRole && user && user.role !== requiredRole) {
      // Role mismatch - redirect to appropriate dashboard
      if (user.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/user/dashboard")
      }
    }
  }, [user, isAuthenticated, requiredRole, router])

  // Always render children since backend will handle auth
  return <>{children}</>
}

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "user"
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, phone?: string, address?: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing user session
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (session?.user) {
          // Get user role from users_role table
          const { data: roleData, error: roleError } = await supabase
            .from('users_role')
            .select('role')
            .eq('id', session.user.id)
            .single()

          if (roleError) {
            console.error("Error fetching user role:", roleError)
            // Create default role if it doesn't exist
            const { error: insertError } = await supabase
              .from('users_role')
              .insert([{
                id: session.user.id,
                role: 'user',
                created_at: new Date().toISOString()
              }])

            if (insertError) {
              console.error("Error creating user role:", insertError)
            }

            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.full_name || 'User',
              email: session.user.email || '',
              role: 'user'
            })
          } else {
            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.full_name || 'User',
              email: session.user.email || '',
              role: roleData.role as "admin" | "user"
            })
          }
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Get user role
        const { data: roleData } = await supabase
          .from('users_role')
          .select('role')
          .eq('id', session.user.id)
          .single()

        setUser({
          id: session.user.id,
          name: session.user.user_metadata?.full_name || 'User',
          email: session.user.email || '',
          role: roleData?.role as "admin" | "user" || 'user'
        })
      } else {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("Login error:", error)
        return false
      }

      if (data.user) {
        // Get user role from users_role table
        const { data: roleData, error: roleError } = await supabase
          .from('users_role')
          .select('role')
          .eq('id', data.user.id)
          .single()

        if (roleError) {
          console.error("Error fetching user role:", roleError)
          // Create default role if it doesn't exist
          const { error: insertError } = await supabase
            .from('users_role')
            .insert([{
              id: data.user.id,
              role: 'user',
              created_at: new Date().toISOString()
            }])

          if (insertError) {
            console.error("Error creating user role:", insertError)
            return false
          }

          setUser({
            id: data.user.id,
            name: data.user.user_metadata?.full_name || 'User',
            email: data.user.email || '',
            role: 'user'
          })
        } else {
          setUser({
            id: data.user.id,
            name: data.user.user_metadata?.full_name || 'User',
            email: data.user.email || '',
            role: roleData.role as "admin" | "user"
          })
        }
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string, phone?: string, address?: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone || '',
            address: address || ''
          }
        }
      })

      if (error) {
        console.error("Registration error:", error)
        return false
      }

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users_profile')
          .insert([{
            id: data.user.id,
            email: data.user.email,
            full_name: name,
            phone: phone || '',
            address: address || '',
            created_at: new Date().toISOString()
          }])

        if (profileError) {
          console.error("Profile creation failed:", profileError.message)
          return false
        }

        // Create user role with default value "user"
        const { error: roleError } = await supabase
          .from('users_role')
          .insert([{
            id: data.user.id,
            role: 'user',
            created_at: new Date().toISOString()
          }])

        if (roleError) {
          console.error("Role creation failed:", roleError.message)
          return false
        }

        setUser({
          id: data.user.id,
          name,
          email,
          role: 'user'
        })
        return true
      }
      return false
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Logout error:", error)
      }
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Logout error:", error)
      // Force redirect even if there's an error
      router.push("/")
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) return false
      
      setUser((prev) => prev ? { ...prev, ...updates } : prev)
      return true
    } catch (error) {
      console.error("Profile update error:", error)
      return false
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
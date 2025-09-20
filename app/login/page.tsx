"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsLoading(true)

    // Add a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      setIsLoading(false)
      setError("Login request timed out. Please check your connection and try again.")
    }, 15000) // 15 seconds

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        throw authError
      }

      if (data.user) {
        // Get user role from the users_role table
        const { data: roleData, error: roleError } = await supabase
          .from('users_role')
          .select('role')
          .eq('id', data.user.id)
          .single()

        // Handle case where role doesn't exist
        if (roleError) {
          console.error("Error fetching user role:", roleError)
          
          // Check if it's a "no rows" error (role doesn't exist)
          if (roleError.code === 'PGRST116') {
            // Create a default role for the user
            const { error: insertError } = await supabase
              .from('users_role')
              .insert([
                { 
                  id: data.user.id, 
                  role: 'user', // Default role
                  created_at: new Date().toISOString()
                }
              ])

            if (insertError) {
              console.error("Error creating user role:", insertError)
              throw new Error("Could not set up user role. Please contact support.")
            }

            // Redirect to user dashboard after creating default role
            setSuccess("Login successful! Redirecting to dashboard...")
            clearTimeout(timeout)
            setTimeout(() => {
              router.push("/user/dashboard")
            }, 2000)
          } else {
            throw new Error("Error accessing user role. Please try again.")
          }
        } else {
          // Role exists, redirect based on role
          setSuccess("Login successful! Redirecting to dashboard...")
          clearTimeout(timeout)
          setTimeout(() => {
            if (roleData.role === 'admin') {
              router.push("/admin/dashboard")
            } else {
              router.push("/user/dashboard")
            }
          }, 2000)
        }
      }
    } catch (err: any) {
      clearTimeout(timeout)
      console.error("Login error:", err)
      setError(err.message || "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative w-full h-16 overflow-hidden mb-4">
            <h1 className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-bold text-green-600 whitespace-nowrap animate-escalator">
              Kick Booking
            </h1>
          </div>
          <p className="text-gray-600">Welcome back! Please sign in to your account.</p>
        </div>

        {/* Login Card */}
        <Card className="bg-white shadow-xl border-green-200 border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">Sign In</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-green-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 border-gray-300 focus:border-green-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-green-500"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center">
              <Link href="/register" className="text-green-600 hover:text-green-700 font-medium">
                Don't have an account? Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>&copy; 2024 Kick Booking. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
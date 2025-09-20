"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function TestPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Application Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">The application is working correctly!</p>

          <div className="space-y-2">
            <Button className="w-full" onClick={() => router.push("/login")}>
              Go to Login
            </Button>

            <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
              Go to Home
            </Button>
          </div>

          <div className="text-xs text-gray-500 text-center">
            If you can see this page, the chunk loading is working properly.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

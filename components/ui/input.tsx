"use client"

// Input component - text input field with consistent styling
// Base input component used throughout the application

import * as React from "react"

import { cn } from "@/lib/utils"

// Input component interface extending HTML input attributes
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// Main Input component with forwardRef for proper ref handling
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        // Base input styling with focus states and transitions
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-black text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }

"use client"

// Button component - primary interactive element for user actions
// Supports multiple variants, sizes, and states with consistent styling

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Button variant styles using class-variance-authority
const buttonVariants = cva(
  // Base styles applied to all button variants
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        // Primary button - main call-to-action styling
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        // Destructive button - for dangerous actions like delete
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Outline button - minimal styling with border
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // Secondary button - less prominent than primary
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Ghost button - minimal styling, appears on hover
        ghost: "hover:bg-accent hover:text-accent-foreground",
        // Link button - appears as text link
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        // Default button size
        default: "h-10 px-4 py-2",
        // Small button for compact layouts
        sm: "h-9 rounded-md px-3",
        // Large button for prominent actions
        lg: "h-11 rounded-md px-8",
        // Icon-only button - square aspect ratio
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

// Button component interface
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean // Allows rendering as different element via Slot
}

// Main Button component with forwardRef for proper ref handling
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Use Slot if asChild is true, otherwise use button element
    const Comp = asChild ? Slot : "button"
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = "Button"

export { Button, buttonVariants }

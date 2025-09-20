"use client"

// Badge component - small status indicators and labels
// Used for tags, status indicators, counts, and categorical labels

import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

// Badge variant styles with different visual treatments
const badgeVariants = cva(
  // Base styles applied to all badge variants
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        // Default badge - primary brand styling
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        // Secondary badge - muted appearance for less important information
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        // Destructive badge - for errors, warnings, or negative states
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        // Outline badge - minimal styling with just a border
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

// Badge component interface extending HTML div attributes
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

// Main Badge component with variant support
function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }

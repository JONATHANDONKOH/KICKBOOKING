"use client"

// Collapsible component - expandable/collapsible content sections
// Simple wrapper around Radix UI primitives for consistent API

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

// Root collapsible container - manages open/closed state
const Collapsible = CollapsiblePrimitive.Root

// Trigger element that toggles the collapsible content
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

// Content that can be expanded or collapsed with animations
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

export { Collapsible, CollapsibleTrigger, CollapsibleContent }

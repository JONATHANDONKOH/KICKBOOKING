"use client"

// Aspect Ratio component - maintains consistent width-to-height ratios
// Useful for responsive images, videos, and other media content

import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

// Simple wrapper around Radix UI's AspectRatio primitive
// Provides a container that maintains a specific aspect ratio regardless of content size
const AspectRatio = AspectRatioPrimitive.Root

export { AspectRatio }

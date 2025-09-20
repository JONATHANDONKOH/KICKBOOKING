"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

/**
 * ThemeProvider Component
 *
 * A wrapper around next-themes ThemeProvider that enables:
 * - System theme detection (follows OS preference)
 * - Manual theme switching (light/dark mode toggle)
 * - Theme persistence across browser sessions
 * - Smooth theme transitions without flash
 *
 * @param children - React components that will have access to theme context
 * @param props - Additional theme provider configuration options
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

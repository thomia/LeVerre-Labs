"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { MotionConfig } from "framer-motion"

/**
 * Providers globaux de l'application.
 *
 * `MotionConfig reducedMotion="user"` fait respecter à Framer Motion le réglage
 * système « réduire les animations ». La règle CSS équivalente (voir
 * `src/styles/globals.css`) ne suffit pas : Framer anime en JavaScript, pas via
 * des transitions CSS.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </NextThemesProvider>
  )
}

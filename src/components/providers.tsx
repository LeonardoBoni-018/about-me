"use client"

import { LazyMotion, MotionConfig } from "motion/react"
import { Toaster } from "@/components/ui/sonner"

// As features de animação (incluindo layout animations) são carregadas sob
// demanda, mantendo o bundle inicial pequeno.
const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        {children}
        <Toaster position="bottom-right" closeButton />
      </LazyMotion>
    </MotionConfig>
  )
}

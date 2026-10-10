"use client"

import * as m from "motion/react-m"
import type { HTMLMotionProps } from "motion/react"

const ease = [0.22, 1, 0.36, 1] as const

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number
  /** Deslocamento vertical inicial, em px. */
  y?: number
}

/** Revela o conteúdo com fade + slide quando entra na viewport (uma vez). */
export function Reveal({ delay = 0, y = 12, children, ...props }: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={{ duration: 0.6, delay, ease }}
      {...props}
    >
      {children}
    </m.div>
  )
}

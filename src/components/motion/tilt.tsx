"use client"

import { useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react"
import * as m from "motion/react-m"
import { cn } from "@/lib/utils"

interface TiltProps {
  children: React.ReactNode
  className?: string
  /** Inclinação máxima, em graus. */
  max?: number
}

/**
 * Inclina o conteúdo em 3D seguindo o cursor. Só reage a mouse; em toque e com movimento
 * reduzido fica estático. Sem reflexos/degradês: o destaque visual fica a cargo do conteúdo.
 */
export function Tilt({ children, className, max = 6 }: TiltProps) {
  const reduceMotion = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const spring = { stiffness: 160, damping: 18 }
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring)
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring)

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width)
    py.set((event.clientY - rect.top) / rect.height)
  }

  function reset() {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <div
      className={cn("[perspective:1200px]", className)}
      onPointerMove={handleMove}
      onPointerLeave={reset}
    >
      <m.div
        style={{ rotateX, rotateY }}
        className="group/tilt relative h-full [transform-style:preserve-3d]"
      >
        {children}
      </m.div>
    </div>
  )
}

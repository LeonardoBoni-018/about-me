"use client"

import { useRef } from "react"
import { useScroll, useSpring } from "motion/react"
import * as m from "motion/react-m"

/** Linha do grafo de commits que é "gravada" conforme o usuário rola pela trajetória. */
export function CommitLine({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] })
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 28 })

  return (
    <div ref={ref} className="relative">
      <span
        aria-hidden="true"
        className="absolute top-8 bottom-8 left-[10px] w-0.5 bg-border sm:left-[14px]"
      />
      <m.span
        aria-hidden="true"
        style={{ scaleY }}
        className="absolute top-8 bottom-8 left-[10px] w-0.5 origin-top bg-primary sm:left-[14px]"
      />
      {children}
    </div>
  )
}

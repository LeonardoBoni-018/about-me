"use client"

import * as m from "motion/react-m"
import type { HTMLMotionProps, Variants } from "motion/react"

const container: Variants = {
  hidden: {},
  visible: (stagger: number) => ({ transition: { staggerChildren: stagger } }),
}

const item: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

interface StaggerProps extends HTMLMotionProps<"div"> {
  /** Intervalo entre a entrada de cada filho, em segundos. */
  stagger?: number
}

/** Container que revela seus `StaggerItem` em sequência ao entrar na viewport. */
export function Stagger({ stagger = 0.08, children, ...props }: StaggerProps) {
  return (
    <m.div
      variants={container}
      custom={stagger}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
      {...props}
    >
      {children}
    </m.div>
  )
}

export function StaggerItem({ children, ...props }: HTMLMotionProps<"div">) {
  return (
    <m.div variants={item} {...props}>
      {children}
    </m.div>
  )
}

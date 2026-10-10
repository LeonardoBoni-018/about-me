"use client"

import { useRef } from "react"
import { useMotionValueEvent, useReducedMotion, useScroll } from "motion/react"
import { cn } from "@/lib/utils"

interface ScrollRevealTextProps {
  paragraphs: string[]
  className?: string
}

/**
 * Parágrafos cujas palavras "acendem" uma a uma conforme o leitor rola a página.
 *
 * Desempenho: em vez de um componente animado por palavra (~150 assinaturas de scroll), o
 * scroll atualiza uma única variável CSS (`--p`, de 0 a 1) no contêiner, e cada palavra calcula
 * a própria opacidade em CSS a partir do seu índice (`--i`).
 */
export function ScrollRevealText({ paragraphs, className }: ScrollRevealTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  })

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    ref.current?.style.setProperty("--p", reduceMotion ? "1" : value.toFixed(4))
  })

  const words = paragraphs.map((p) => p.split(" "))
  const total = words.reduce((sum, w) => sum + w.length, 0)
  // Índice global da primeira palavra de cada parágrafo.
  const offsets = words.map((_, pi) =>
    words.slice(0, pi).reduce((sum, w) => sum + w.length, 0)
  )

  return (
    <div
      ref={ref}
      style={{ "--p": 0, "--n": total } as React.CSSProperties}
      className={cn("space-y-6", className)}
    >
      {words.map((paragraph, pi) => (
        <p key={pi}>
          {paragraph.map((word, wi) => (
            <span
              key={wi}
              style={{ "--i": offsets[pi] + wi } as React.CSSProperties}
              className="reveal-word"
            >
              {word}{" "}
            </span>
          ))}
        </p>
      ))}
    </div>
  )
}

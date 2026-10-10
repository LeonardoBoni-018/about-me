"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useReducedMotion } from "motion/react"

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>{}#_"

interface ScrambleTextProps {
  text: string
  /** Duração total da "decodificação", em ms. */
  duration?: number
  className?: string
}

/**
 * Texto que se "decodifica" ao entrar na viewport: os caracteres começam embaralhados e se
 * resolvem da esquerda para a direita. O HTML do servidor já traz o texto final.
 */
export function ScrambleText({ text, duration = 700, className }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: "-40px" })
  const reduceMotion = useReducedMotion()
  const [display, setDisplay] = useState(text)

  useEffect(() => {
    if (!inView || reduceMotion) return
    let frame = 0
    const start = performance.now()

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration)
      const resolved = Math.floor(progress * text.length)
      setDisplay(
        text
          .split("")
          .map((char, i) =>
            i < resolved || char === " "
              ? char
              : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          )
          .join("")
      )
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [inView, reduceMotion, text, duration])

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  )
}

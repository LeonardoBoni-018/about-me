"use client"

import { useRef } from "react"
import { useInView } from "motion/react"
import { useHydrated } from "@/hooks/use-hydrated"
import type { WireBox } from "@/lib/types"
import { cn } from "@/lib/utils"

const PAD = 4

/**
 * Planta da tela principal de um front-end. Ao entrar na viewport, os componentes são
 * "pintados" na ordem em que a árvore renderiza — o mesmo que o navegador faz no primeiro paint.
 * Sem JavaScript (ou antes da hidratação) a planta aparece inteira.
 */
export function Wireframe({ boxes, label }: { boxes: WireBox[]; label: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })
  // Antes da hidratação (HTML do servidor) tudo aparece; depois, espera entrar na tela.
  const hidden = useHydrated() && !inView

  return (
    <svg
      ref={ref}
      viewBox="0 0 320 200"
      role="img"
      aria-label={label}
      className="block h-auto w-full bg-background/60 font-mono"
    >
      {boxes.map((box, i) => (
        <g
          key={box.label}
          className="wire-box"
          data-hidden={hidden || undefined}
          style={{ transitionDelay: `${i * 140}ms` }}
        >
          <rect
            x={box.x + 0.5}
            y={box.y + 0.5}
            width={box.w - 1}
            height={box.h - 1}
            rx={2}
            className={cn("fill-card", box.accent ? "stroke-primary" : "stroke-ink/60")}
            strokeWidth={1}
          />
          {box.grid && <GridCells box={box} />}
          <text
            x={box.x + 6}
            y={box.h <= 24 ? box.y + box.h / 2 + 2.5 : box.y + 11}
            fontSize={7}
            className={box.accent ? "fill-primary" : "fill-muted-foreground"}
          >
            {box.label}
          </text>
        </g>
      ))}
    </svg>
  )
}

/** Cartões internos (grade de itens, células do calendário, linhas da tabela). */
function GridCells({ box }: { box: WireBox }) {
  const [cols, rows] = box.grid!
  const top = box.y + 16
  const width = (box.w - PAD * (cols + 1)) / cols
  const height = (box.y + box.h - top - PAD * rows) / rows
  return (
    <>
      {Array.from({ length: cols * rows }, (_, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        return (
          <rect
            key={i}
            x={box.x + PAD + col * (width + PAD)}
            y={top + row * (height + PAD)}
            width={width}
            height={height}
            rx={1.5}
            className="fill-background/70 stroke-border"
            strokeWidth={0.75}
          />
        )
      })}
    </>
  )
}

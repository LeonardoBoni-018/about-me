"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Draggable } from "gsap/Draggable"
import { InertiaPlugin } from "gsap/InertiaPlugin"

gsap.registerPlugin(useGSAP, Draggable, InertiaPlugin)

/**
 * Faixa horizontal de telas: com mouse, dá para arrastar e soltar com inércia (Draggable +
 * InertiaPlugin sobre o scrollLeft); com toque, teclado (setas, a lista é focável) ou movimento
 * reduzido, continua sendo uma rolagem horizontal nativa com snap.
 */
export function DragStrip({
  children,
  label,
  cursorLabel,
  className,
}: {
  children: React.ReactNode
  label: string
  /** Texto da etiqueta do cursor contextual sobre a faixa. */
  cursorLabel: string
  className?: string
}) {
  const list = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const el = list.current!
      el.style.scrollSnapType = "none"
      const [drag] = Draggable.create(el, {
        type: "scrollLeft",
        inertia: true,
        allowNativeTouchScrolling: true,
        // Arrastar não pode virar clique no link do card.
        minimumMovement: 6,
        onDragStart: () => el.classList.add("is-dragging"),
        onDragEnd: () => setTimeout(() => el.classList.remove("is-dragging"), 0),
      })
      const stopClick = (e: MouseEvent) => {
        if (el.classList.contains("is-dragging")) {
          e.preventDefault()
          e.stopPropagation()
        }
      }
      el.addEventListener("click", stopClick, true)
      return () => {
        el.removeEventListener("click", stopClick, true)
        el.style.scrollSnapType = ""
        drag.kill()
      }
    })
  })

  // O Draggable (scrollLeft) embrulha os filhos do contêiner num div próprio; por isso a rolagem
  // fica num <div> e o layout em linha mora no <ul> de dentro.
  return (
    <div
      ref={list}
      tabIndex={0}
      role="region"
      aria-label={label}
      data-cursor={cursorLabel}
      className={className}
    >
      <ul className="flex w-max gap-6">{children}</ul>
    </div>
  )
}

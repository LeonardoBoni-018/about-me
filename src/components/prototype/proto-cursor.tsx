"use client"

import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"

gsap.registerPlugin(useGSAP)

/**
 * Cursor contextual (só com mouse e movimento liberado): um ponto que segue o ponteiro com um
 * pouco de atraso e vira uma etiqueta com a ação ("Abrir", "Arrastar", "Girar") sobre elementos
 * marcados com `data-cursor`. O cursor do sistema continua visível — é um rótulo, não um
 * substituto.
 */
export function ProtoCursor() {
  const dot = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState("")

  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add("(pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const el = dot.current!
      gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
      const x = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" })
      const y = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" })
      let current = ""

      const onMove = (e: PointerEvent) => {
        x(e.clientX + 18)
        y(e.clientY + 18)
        const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]")
        const next = target?.dataset.cursor ?? ""
        if (next !== current) {
          current = next
          setLabel(next)
          gsap.to(el, {
            autoAlpha: next ? 1 : 0,
            scale: next ? 1 : 0.4,
            duration: 0.3,
            ease: "expo.out",
          })
        }
      }
      window.addEventListener("pointermove", onMove)
      return () => window.removeEventListener("pointermove", onMove)
    })
  })

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none invisible fixed top-0 left-0 z-50 rounded-full bg-[var(--p-signal)] px-3 py-1.5 text-xs font-medium whitespace-nowrap text-[var(--p-signal-ink)]"
    >
      {label}
    </div>
  )
}

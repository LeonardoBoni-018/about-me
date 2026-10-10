"use client"

import { useEffect, useRef } from "react"

/**
 * Mira de prancheta: linhas finas seguindo o cursor dentro do elemento pai, com a coordenada
 * atual. Só em dispositivos com mouse; atualiza via variáveis CSS (sem re-render).
 */
export function Crosshair() {
  const ref = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const parent = el?.parentElement
    if (!el || !parent || !window.matchMedia("(pointer: fine)").matches) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    function move(event: PointerEvent) {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const rect = parent!.getBoundingClientRect()
        const x = Math.round(event.clientX - rect.left)
        const y = Math.round(event.clientY - rect.top)
        el!.style.setProperty("--cx", `${x}px`)
        el!.style.setProperty("--cy", `${y}px`)
        el!.style.opacity = "1"
        if (labelRef.current) labelRef.current.textContent = `x ${x} · y ${y}`
      })
    }
    function leave() {
      el!.style.opacity = "0"
    }

    parent.addEventListener("pointermove", move)
    parent.addEventListener("pointerleave", leave)
    return () => {
      cancelAnimationFrame(frame)
      parent.removeEventListener("pointermove", move)
      parent.removeEventListener("pointerleave", leave)
    }
  }, [])

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300"
    >
      <span className="absolute inset-x-0 top-(--cy) h-px border-t border-dashed border-ink/25" />
      <span className="absolute inset-y-0 left-(--cx) w-px border-l border-dashed border-ink/25" />
      <span
        ref={labelRef}
        className="absolute top-(--cy) left-(--cx) translate-x-3 translate-y-2 font-mono text-[10px] text-ink"
      />
    </div>
  )
}

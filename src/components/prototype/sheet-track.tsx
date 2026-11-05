"use client"

import { useEffect, useRef } from "react"

/**
 * Folhas de especificação lado a lado: no desktop, a seção fica presa e a rolagem vertical
 * passa as folhas na horizontal (GSAP ScrollTrigger, como as páginas de embarcação do Seasats).
 * Celular, tablet, tela baixa e movimento reduzido: as folhas ficam empilhadas, com rolagem normal.
 */
export function SheetTrack({ children }: { children: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    let revert = () => {}
    let cancelled = false

    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)
        const mm = gsap.matchMedia()
        // Mesma condição da variante `pin:` do CSS (globals.css).
        mm.add(
          "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)",
          () => {
            const distance = () => track.scrollWidth - section.clientWidth
            gsap.to(track, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${distance()}`,
                pin: true,
                scrub: 0.6,
                invalidateOnRefresh: true,
              },
            })
          }
        )
        revert = () => mm.revert()
      }
    )

    return () => {
      cancelled = true
      revert()
    }
  }, [])

  return (
    <div ref={sectionRef} className="overflow-hidden pin:h-svh">
      <div
        ref={trackRef}
        className="flex flex-col gap-px bg-[var(--p-rule)] pin:h-full pin:w-max pin:flex-row"
      >
        {children}
      </div>
    </div>
  )
}

"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/** Mesma condição da variante `pin:` do CSS (globals.css). */
const PIN_QUERY =
  "(min-width: 1024px) and (min-height: 760px) and (prefers-reduced-motion: no-preference)"

/**
 * Folhas de especificação lado a lado: no desktop, a seção fica presa e a rolagem vertical
 * passa as folhas na horizontal (GSAP ScrollTrigger, como as páginas de embarcação do Seasats).
 * Junto vão uma régua de progresso no topo e um parallax horizontal das capturas
 * (`data-sheet-img`), ligado ao mesmo movimento via containerAnimation.
 * Celular, tablet, tela baixa e movimento reduzido: folhas empilhadas, rolagem normal.
 */
export function SheetTrack({ children }: { children: React.ReactNode }) {
  const section = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const progress = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(PIN_QUERY, () => {
        const el = track.current!
        const distance = () => el.scrollWidth - section.current!.clientWidth

        const move = gsap.to(el, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(progress.current, { scaleX: self.progress }),
          },
        })

        gsap.utils.toArray<HTMLElement>("[data-sheet-img]").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: 7 },
            {
              xPercent: -7,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                containerAnimation: move,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          )
        })
      })
    },
    { scope: section }
  )

  return (
    <div ref={section} className="relative overflow-hidden pin:h-svh">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-12 z-10 hidden h-0.5 bg-[var(--p-rule)] pin:block"
      >
        <div
          ref={progress}
          className="h-full origin-left scale-x-0 bg-[var(--p-signal)]"
        />
      </div>
      <div
        ref={track}
        className="flex flex-col gap-px bg-[var(--p-rule)] pin:h-full pin:w-max pin:flex-row"
      >
        {children}
      </div>
    </div>
  )
}

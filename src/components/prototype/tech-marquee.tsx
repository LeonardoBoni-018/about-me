"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(useGSAP, ScrollTrigger)

/**
 * Faixa contínua com as tecnologias que aparecem nos projetos. Anda sozinha e reage à rolagem:
 * acelera com a velocidade do scroll e inverte o sentido quando a página sobe.
 * Movimento reduzido: faixa parada (e rolável na horizontal).
 */
export function TechMarquee({ items, label }: { items: string[]; label: string }) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const loop = gsap.to(track.current, {
          xPercent: -50,
          ease: "none",
          duration: 38,
          repeat: -1,
        })
        let direction = 1
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            direction = self.direction
            const boost = gsap.utils.clamp(1, 6, Math.abs(self.getVelocity()) / 300)
            gsap.to(loop, {
              timeScale: direction * boost,
              duration: 0.2,
              overwrite: true,
              onComplete: () => {
                gsap.to(loop, { timeScale: direction, duration: 1.2, ease: "power2.out" })
              },
            })
          },
        })
      })
    },
    { scope: root }
  )

  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
      {items.map((item) => (
        <li
          key={item}
          className="font-wide flex items-center text-3xl font-semibold tracking-tight [font-stretch:80%] sm:text-5xl"
        >
          <span className="px-5 sm:px-8">{item}</span>
          <span aria-hidden="true" className="size-2 rotate-45 bg-[var(--p-signal)]" />
        </li>
      ))}
    </ul>
  )

  return (
    <div
      ref={root}
      role="region"
      aria-label={label}
      className="overflow-hidden border-y border-[var(--p-ink)] py-5 motion-reduce:overflow-x-auto"
    >
      <div ref={track} className="flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

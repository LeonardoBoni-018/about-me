"use client"

import { useEffect, useRef, useState } from "react"
import { useScroll, useSpring, useTransform } from "motion/react"
import * as m from "motion/react-m"

// Mesma condição da media query de `.track-*` em globals.css.
const PINNED_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)"

interface HorizontalTrackProps {
  items: React.ReactNode[]
  label: string
  queueLabel: string
}

/**
 * Fila de projetos. No desktop (sem movimento reduzido) a seção fica presa na tela e o scroll
 * vertical desliza os cards na horizontal; no mobile ou com movimento reduzido é um carrossel
 * nativo com snap.
 *
 * O layout dos dois modos é decidido em CSS (`.track-*` em globals.css), não em JavaScript:
 * assim o HTML do servidor já chega com a altura certa — sem salto de layout depois da
 * hidratação e com âncoras abaixo da fila (ex.: #contact) caindo no lugar certo.
 */
export function HorizontalTrack({ items, label, queueLabel }: HorizontalTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [distance, setDistance] = useState(0)

  // Distância horizontal real (px) a percorrer no modo fixo; 0 no modo carrossel.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const query = window.matchMedia(PINNED_QUERY)
    const measure = () =>
      // clientWidth exclui a barra de rolagem; innerWidth a inclui e cortaria o último card.
      setDistance(
        query.matches
          ? Math.max(0, track.scrollWidth - document.documentElement.clientWidth)
          : 0
      )
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(track)
    query.addEventListener("change", measure)
    window.addEventListener("resize", measure)
    return () => {
      observer.disconnect()
      query.removeEventListener("change", measure)
      window.removeEventListener("resize", measure)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })

  // Se a página já estava rolada antes da hidratação (ex.: o navegador restaurou a posição ao
  // recarregar), nenhum evento de scroll chega depois que o Motion começa a ouvir — e a fila
  // ficaria parada na posição errada. Força uma releitura logo após montar.
  useEffect(() => {
    const frame = requestAnimationFrame(() => window.dispatchEvent(new Event("scroll")))
    return () => cancelAnimationFrame(frame)
  }, [])
  const x = useTransform(smooth, [0, 1], [0, -distance])
  const current = useTransform(smooth, (v) =>
    String(Math.min(items.length, Math.floor(v * items.length) + 1)).padStart(2, "0")
  )

  // Teclado no modo fixo: ao focar um card fora da tela, rola a página até a posição em que
  // ele aparece (em vez de deixar o navegador deslocar o contêiner com overflow oculto).
  function handleFocus(event: React.FocusEvent<HTMLDivElement>) {
    const container = containerRef.current
    const target = event.target as HTMLElement
    const card = target.closest<HTMLElement>("[data-track-item]")
    // Só foco por teclado: no clique do mouse, rolar aqui moveria o card entre o mousedown e o
    // mouseup e o clique se perderia.
    if (!distance || !container || !card || !target.matches(":focus-visible")) return
    stickyRef.current?.scrollTo({ left: 0 })
    const index = Number(card.dataset.trackItem)
    const scrollRange = container.offsetHeight - window.innerHeight
    const top = container.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: top + (index / Math.max(1, items.length - 1)) * scrollRange })
  }

  return (
    <div
      ref={containerRef}
      style={{ "--n": items.length } as React.CSSProperties}
      className="track-pin relative"
    >
      <div ref={stickyRef} className="track-sticky">
        <m.div
          ref={trackRef}
          role="region"
          aria-label={label}
          tabIndex={0}
          style={{ x }}
          onFocus={handleFocus}
          className="track-rail flex snap-x snap-mandatory scroll-px-5 gap-5 overflow-x-auto px-5 pb-6 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:scroll-px-8 sm:px-8 lg:gap-8"
        >
          {items.map((item, i) => (
            <div
              key={i}
              data-track-item={i}
              className="w-[min(86vw,520px)] shrink-0 snap-start lg:w-[min(40vw,560px)]"
            >
              {item}
            </div>
          ))}
        </m.div>
        <div className="track-progress mx-auto mt-10 hidden w-full max-w-6xl items-center gap-4 px-8 font-mono text-xs text-muted-foreground">
          <span>
            {queueLabel} <m.span className="text-foreground">{current}</m.span> /{" "}
            {String(items.length).padStart(2, "0")}
          </span>
          <span className="relative h-px flex-1 bg-border">
            <m.span
              style={{ scaleX: smooth }}
              className="absolute inset-0 origin-left bg-primary"
            />
          </span>
        </div>
      </div>
    </div>
  )
}

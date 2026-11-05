"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import Lenis from "lenis"

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

const EASE = "expo.out"

/**
 * Camada de movimento do protótipo. A página é renderizada no servidor e marca o que anima com
 * atributos `data-*`; aqui tudo é ligado de uma vez, dentro de um gsap.context (via useGSAP),
 * que desfaz splits, tweens e ScrollTriggers ao desmontar.
 *
 * - `data-hero-name`: abertura (letras sobem e a fonte condensa: wdth 125% → 62%)
 * - `data-split`: títulos revelados linha a linha por máscara
 * - `data-rows`: filhos entram em sequência quando a lista chega
 * - `data-draw`: linha que se desenha conforme a rolagem
 * - `data-parallax`: imagem que anda mais devagar que a moldura
 *
 * Sem JS ou com movimento reduzido, tudo já está no estado final (nada fica escondido).
 */
export function ProtoMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Rolagem suave (Lenis) dirigindo o ScrollTrigger pelo mesmo relógio do GSAP.
        const lenis = new Lenis({ lerp: 0.11 })
        lenis.on("scroll", ScrollTrigger.update)
        const raf = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(raf)
        gsap.ticker.lagSmoothing(0)
        // Âncoras (#sistemas…) passam pelo Lenis para não "teleportar".
        const onClick = (e: MouseEvent) => {
          const link = (e.target as HTMLElement).closest<HTMLAnchorElement>(
            'a[href^="#"]'
          )
          if (!link) return
          const target = document.querySelector(link.getAttribute("href")!)
          if (!target) return
          e.preventDefault()
          lenis.scrollTo(target as HTMLElement, { offset: -48 })
        }
        document.addEventListener("click", onClick)

        // Abertura do hero: o momento autoral da página.
        const name = root.current?.querySelector<HTMLElement>("[data-hero-name]")
        if (name) {
          const split = SplitText.create(name.querySelectorAll("[data-line]"), {
            type: "chars",
            mask: "chars",
          })
          gsap.set(name, { visibility: "visible" })
          gsap
            .timeline({ defaults: { ease: EASE } })
            .from(split.chars, { yPercent: 105, duration: 1.1, stagger: 0.035 })
            .fromTo(
              name,
              { fontStretch: "100%" },
              { fontStretch: "62%", duration: 1.6, ease: "expo.inOut" },
              0.15
            )
            .from(
              "[data-hero-fade]",
              { autoAlpha: 0, y: 16, duration: 0.8, stagger: 0.08 },
              0.7
            )
        }

        // Títulos: linha a linha, por máscara, uma vez.
        gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit: (self) =>
              gsap.from(self.lines, {
                yPercent: 110,
                duration: 1,
                ease: EASE,
                stagger: 0.08,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              }),
          })
        })

        // Listas: os itens chegam juntos, em sequência curta.
        gsap.utils.toArray<HTMLElement>("[data-rows]").forEach((list) => {
          gsap.from(list.children, {
            y: 40,
            autoAlpha: 0,
            duration: 0.9,
            ease: EASE,
            stagger: { each: 0.05, amount: 0.5 },
            scrollTrigger: { trigger: list, start: "top 85%", once: true },
          })
        })

        // Linhas que se desenham com a rolagem (trajetória).
        gsap.utils.toArray<HTMLElement>("[data-draw]").forEach((line) => {
          gsap.fromTo(
            line,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              transformOrigin: "top",
              scrollTrigger: {
                trigger: line.parentElement,
                start: "top 70%",
                end: "bottom 60%",
                scrub: true,
              },
            }
          )
        })

        // Parallax dentro da moldura (fora das folhas horizontais, que têm o próprio).
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
          gsap.fromTo(
            img,
            { yPercent: -6 },
            {
              yPercent: 6,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            }
          )
        })

        return () => {
          document.removeEventListener("click", onClick)
          gsap.ticker.remove(raf)
          lenis.destroy()
        }
      })
    },
    { scope: root }
  )

  return <div ref={root}>{children}</div>
}

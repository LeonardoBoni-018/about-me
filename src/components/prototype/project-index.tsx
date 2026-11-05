"use client"

import { useLayoutEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Flip } from "gsap/Flip"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

gsap.registerPlugin(useGSAP, Flip)

export interface IndexItem {
  id: string
  title: string
  year: number
  group: "api" | "front"
  kind: string
  stack: string[]
  status: "live" | "repo"
  statusLabel: string
  href: string
  external: boolean
  image?: string
}

interface ProjectIndexProps {
  items: IndexItem[]
  filters: { id: "all" | "api" | "front"; label: string }[]
  openLabel: string
}

type FlipState = ReturnType<typeof Flip.getState>

/**
 * Arquivo editorial de tudo o que existe (ideia do Infinite Papers): linhas grandes, sem cards.
 * - Hover/foco: a linha é "carimbada" de tinta de baixo para cima e o título anda para a direita.
 * - Desktop: a captura real acompanha o ponteiro com inércia e inclina conforme a velocidade;
 *   ao trocar de linha, a imagem nova entra por máscara.
 * - Filtro: as linhas que ficam deslizam para o novo lugar (Flip) em vez de saltar.
 * - Celular: miniatura dentro da própria linha. Movimento reduzido: tudo sem deslocamento.
 */
export function ProjectIndex({ items, filters, openLabel }: ProjectIndexProps) {
  const [filter, setFilter] = useState<"all" | "api" | "front">("all")
  const [preview, setPreview] = useState<IndexItem | null>(null)
  const root = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const frame = useRef<HTMLDivElement>(null)
  const img = useRef<HTMLDivElement>(null)
  const flipState = useRef<FlipState | null>(null)
  const moveTo = useRef<{ y: (v: number) => void; r: (v: number) => void } | null>(null)
  const lastY = useRef(0)

  const visible = items.filter((item) => filter === "all" || item.group === filter)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        moveTo.current = {
          y: gsap.quickTo(frame.current, "y", { duration: 0.6, ease: "power3" }),
          r: gsap.quickTo(frame.current, "rotation", { duration: 0.8, ease: "power3" }),
        }
        return () => {
          moveTo.current = null
        }
      })
    },
    { scope: root }
  )

  // Prévia: mostra/esconde e troca a imagem com máscara.
  useGSAP(
    () => {
      if (!frame.current) return
      gsap.to(frame.current, {
        autoAlpha: preview ? 1 : 0,
        scale: preview ? 1 : 0.92,
        duration: 0.35,
        ease: "expo.out",
      })
      if (preview && img.current && moveTo.current) {
        gsap.fromTo(
          img.current,
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 0.6, ease: "expo.out" }
        )
      }
    },
    { dependencies: [preview?.id], scope: root }
  )

  // Flip: anima as linhas da posição antiga para a nova depois que o React renderiza o filtro.
  useLayoutEffect(() => {
    const state = flipState.current
    if (!state || !listRef.current) return
    flipState.current = null
    Flip.from(state, {
      targets: listRef.current.children,
      duration: 0.6,
      ease: "expo.inOut",
      absolute: true,
      onEnter: (els) =>
        gsap.fromTo(els, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5 }),
    })
  }, [filter])

  function changeFilter(next: "all" | "api" | "front") {
    if (next === filter) return
    if (listRef.current && moveTo.current) {
      flipState.current = Flip.getState(listRef.current.children)
    }
    setPreview(null)
    setFilter(next)
  }

  const place = (clientY: number) => {
    const box = listRef.current?.getBoundingClientRect()
    if (!box) return
    const y = Math.max(0, clientY - box.top - 106)
    if (moveTo.current) {
      moveTo.current.y(y)
      moveTo.current.r(gsap.utils.clamp(-6, 6, (y - lastY.current) * 0.15))
      gsap.delayedCall(0.12, () => moveTo.current?.r(0))
    } else if (frame.current) {
      frame.current.style.transform = `translateY(${y}px)`
    }
    lastY.current = y
  }

  function focusRow(item: IndexItem, el: HTMLElement) {
    const row = el.getBoundingClientRect()
    place(row.top + row.height / 2)
    setPreview(item)
  }

  return (
    <div ref={root}>
      <div role="group" className="mb-6 flex gap-1">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => changeFilter(f.id)}
            className={cn(
              "border px-3 py-1.5 text-sm transition-colors",
              filter === f.id
                ? "border-[var(--p-ink)] bg-[var(--p-ink)] text-[var(--p-paper)]"
                : "border-[var(--p-rule)] hover:border-[var(--p-ink)]"
            )}
          >
            {f.label}{" "}
            <span className="tnum font-mono text-xs opacity-70">
              {f.id === "all"
                ? items.length
                : items.filter((i) => i.group === f.id).length}
            </span>
          </button>
        ))}
      </div>

      <div className="relative grid lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-10">
        <ul
          ref={listRef}
          data-rows
          onPointerMove={(e) => place(e.clientY)}
          onPointerLeave={() => setPreview(null)}
          className="border-t border-[var(--p-ink)]"
        >
          {visible.map((item) => {
            const content = (
              <>
                {/* Tinta que sobe na linha em hover/foco */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-[var(--p-ink)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100"
                />
                <span className="tnum hidden font-mono text-xs text-[var(--p-dim)] transition-colors group-hover:text-[var(--p-paper)]/70 sm:block">
                  {item.year}
                </span>
                <span className="min-w-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3 motion-reduce:group-hover:translate-x-0">
                  <span className="font-wide block text-2xl leading-tight font-semibold tracking-tight [font-stretch:85%] sm:text-4xl">
                    {item.title}
                  </span>
                  <span className="mt-1 block truncate text-sm text-[var(--p-dim)] transition-colors group-hover:text-[var(--p-paper)]/70">
                    {item.kind} · {item.stack.join(", ")}
                  </span>
                </span>
                <span className="flex items-center gap-3 justify-self-end">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-xs whitespace-nowrap",
                      item.status === "live"
                        ? "text-[var(--p-live)]"
                        : "text-[var(--p-dim)] group-hover:text-[var(--p-paper)]/70"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 rounded-full",
                        item.status === "live"
                          ? "bg-[var(--p-live)] motion-safe:animate-pulse"
                          : "bg-[var(--p-rule)]"
                      )}
                    />
                    {item.statusLabel}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-45 group-hover:text-[var(--p-signal)]"
                  />
                </span>
                {item.image && (
                  <span className="relative col-span-full mt-2 block aspect-[16/10] overflow-hidden border border-[var(--p-rule)] lg:hidden">
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 80vw, 100vw"
                      className="object-cover object-top"
                    />
                  </span>
                )}
              </>
            )
            const className =
              "group relative isolate grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 border-b border-[var(--p-rule)] px-2 py-5 transition-colors hover:text-[var(--p-paper)] focus-visible:text-[var(--p-paper)] focus-visible:outline-none sm:grid-cols-[3rem_minmax(0,1fr)_auto]"
            return (
              <li
                key={item.id}
                data-flip-id={item.id}
                onPointerEnter={() => setPreview(item)}
              >
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${openLabel}: ${item.title}`}
                    data-cursor={openLabel}
                    onFocus={(e) => focusRow(item, e.currentTarget)}
                    onBlur={() => setPreview(null)}
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={item.href}
                    data-cursor={openLabel}
                    onFocus={(e) => focusRow(item, e.currentTarget)}
                    onBlur={() => setPreview(null)}
                    className={className}
                  >
                    {content}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>

        {/* Prévia do desktop: anda na vertical junto do ponteiro, presa à coluna */}
        <div aria-hidden="true" className="pointer-events-none relative hidden lg:block">
          <div
            ref={frame}
            className="invisible absolute inset-x-0 top-0 aspect-[16/10] overflow-hidden border border-[var(--p-ink)] bg-[var(--p-sheet)] shadow-[0_18px_40px_-18px_rgb(0_0_0/0.45)]"
          >
            {preview?.image && (
              <div ref={img} className="absolute inset-0">
                <Image
                  key={preview.image}
                  src={preview.image}
                  alt=""
                  fill
                  sizes="340px"
                  className="object-cover object-top"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

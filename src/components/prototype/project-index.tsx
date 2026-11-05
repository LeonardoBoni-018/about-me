"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

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

/**
 * Arquivo editorial de tudo o que existe (ideia do Infinite Papers): linhas grandes, sem cards.
 * No desktop, a captura real do sistema acompanha o ponteiro na lateral; com teclado, aparece
 * ao focar a linha; no celular, a miniatura fica dentro da própria linha.
 */
export function ProjectIndex({ items, filters, openLabel }: ProjectIndexProps) {
  const [filter, setFilter] = useState<"all" | "api" | "front">("all")
  const [preview, setPreview] = useState<IndexItem | null>(null)
  const [y, setY] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)

  const visible = items.filter((item) => filter === "all" || item.group === filter)

  function track(e: React.PointerEvent) {
    const box = listRef.current?.getBoundingClientRect()
    if (box) setY(e.clientY - box.top)
  }

  function focusRow(item: IndexItem, el: HTMLElement) {
    const box = listRef.current?.getBoundingClientRect()
    const row = el.getBoundingClientRect()
    if (box) setY(row.top - box.top + row.height / 2)
    setPreview(item)
  }

  return (
    <div>
      <div role="group" className="mb-6 flex gap-1">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
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
          onPointerMove={track}
          onPointerLeave={() => setPreview(null)}
          className="border-t border-[var(--p-ink)]"
        >
          {visible.map((item) => {
            const content = (
              <>
                <span className="tnum hidden font-mono text-xs text-[var(--p-dim)] sm:block">
                  {item.year}
                </span>
                <span className="min-w-0">
                  <span className="font-wide block text-2xl leading-tight font-semibold tracking-tight [font-stretch:85%] sm:text-4xl">
                    {item.title}
                  </span>
                  <span className="mt-1 block truncate text-sm text-[var(--p-dim)]">
                    {item.kind} · {item.stack.join(", ")}
                  </span>
                </span>
                <span className="flex items-center gap-3 justify-self-end">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 text-xs whitespace-nowrap",
                      item.status === "live"
                        ? "text-[var(--p-live)]"
                        : "text-[var(--p-dim)]"
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-1.5 rounded-full",
                        item.status === "live"
                          ? "bg-[var(--p-live)]"
                          : "bg-[var(--p-rule)]"
                      )}
                    />
                    {item.statusLabel}
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--p-signal)]"
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
              "group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-1 border-b border-[var(--p-rule)] py-5 transition-colors hover:bg-[var(--p-sheet)] sm:grid-cols-[3rem_minmax(0,1fr)_auto] sm:px-2"
            return (
              <li key={item.id} onPointerEnter={() => setPreview(item)}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${openLabel}: ${item.title}`}
                    onFocus={(e) => focusRow(item, e.currentTarget)}
                    onBlur={() => setPreview(null)}
                    className={className}
                  >
                    {content}
                  </a>
                ) : (
                  <Link
                    href={item.href}
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
          {preview?.image && (
            <div
              className="absolute inset-x-0 aspect-[16/10] overflow-hidden border border-[var(--p-ink)] bg-[var(--p-sheet)] shadow-[0_12px_30px_-12px_rgb(0_0_0/0.35)] transition-[top] duration-200 ease-out"
              style={{ top: Math.max(0, y - 106) }}
            >
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
  )
}

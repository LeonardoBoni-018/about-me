"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface ProtoHeaderProps {
  name: string
  homeHref: string
  localeHref: string
  localeLabel: string
  openLabel: string
  closeLabel: string
  links: { href: string; label: string }[]
  projects: { href: string; label: string; meta: string }[]
}

/**
 * Barra fina fixa + índice retrátil que desce do topo e cobre a tela (ideia do menu do Seasats).
 * O índice lista as seções e os projetos; Esc fecha e o foco volta para o botão.
 */
export function ProtoHeader({
  name,
  homeHref,
  localeHref,
  localeLabel,
  openLabel,
  closeLabel,
  links,
  projects,
}: ProtoHeaderProps) {
  const [open, setOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    document.documentElement.style.overflow = "hidden"
    panelRef.current?.querySelector<HTMLElement>("a")?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.documentElement.style.overflow = ""
    }
  }, [open])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[var(--p-rule)] bg-[var(--p-paper)]">
        <div className="mx-auto flex h-12 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-8">
          <Link
            href={homeHref}
            className="font-wide text-sm font-semibold tracking-tight"
          >
            {name}
          </Link>
          <div className="flex items-center gap-5 text-sm">
            <Link
              href={localeHref}
              className="text-[var(--p-dim)] hover:text-[var(--p-ink)]"
            >
              {localeLabel}
            </Link>
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls="proto-index"
              onClick={() => setOpen((v) => !v)}
              className="relative z-50 flex items-center gap-2 font-medium"
            >
              <span aria-hidden="true" className="relative block h-2.5 w-4">
                <span
                  className={cn(
                    "absolute inset-x-0 top-0 h-px bg-current transition-transform duration-300",
                    open && "translate-y-[5px] rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-300",
                    open && "-translate-y-[4px] -rotate-45"
                  )}
                />
              </span>
              {open ? closeLabel : openLabel}
            </button>
          </div>
        </div>
      </header>

      <div
        id="proto-index"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-0 z-30 overflow-y-auto bg-[var(--p-sheet)] pt-12 motion-safe:animate-[proto-drop_0.5s_cubic-bezier(0.16,1,0.3,1)_both]"
      >
        <div className="mx-auto grid max-w-[1500px] gap-12 px-4 py-10 sm:px-8 lg:grid-cols-[1fr_1fr] lg:py-16">
          <nav>
            <ul>
              {links.map((link) => (
                <li key={link.href} className="border-b border-[var(--p-rule)]">
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="font-wide block py-3 text-4xl font-semibold tracking-tight [font-stretch:80%] transition-colors hover:text-[var(--p-signal)] sm:text-6xl"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="self-end">
            {projects.map((project) => (
              <li key={project.href} className="border-b border-[var(--p-rule)]">
                <Link
                  href={project.href}
                  className="flex items-baseline justify-between gap-4 py-2.5 hover:text-[var(--p-signal)]"
                >
                  <span className="text-lg">{project.label}</span>
                  <span className="font-mono text-xs text-[var(--p-dim)]">
                    {project.meta}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

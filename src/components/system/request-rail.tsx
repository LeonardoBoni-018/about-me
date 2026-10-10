"use client"

import Link from "next/link"
import { useScroll, useSpring, useTransform } from "motion/react"
import * as m from "motion/react-m"
import { hops, navSections, totalLatency } from "@/components/layout/nav-items"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"
import { useActiveSection } from "@/hooks/use-active-section"
import { cn } from "@/lib/utils"

interface RequestRailProps {
  locale: Locale
  nav: Dictionary["nav"]
  label: string
}

/**
 * Trilho fixo na lateral (telas largas): um "pacote" percorre os hops conforme a página rola,
 * e o contador mostra a latência acumulada da requisição.
 */
export function RequestRail({ locale, nav, label }: RequestRailProps) {
  const active = useActiveSection()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 26 })
  const top = useTransform(progress, [0, 1], ["0%", "100%"])
  const latency = useTransform(progress, (v) => `${Math.round(v * totalLatency)} ms`)

  return (
    <nav
      aria-label={label}
      className={cn(
        "fixed top-1/2 left-5 z-30 hidden -translate-y-1/2 flex-col items-start transition-opacity duration-300 xl:flex",
        // A fila de projetos ocupa a largura toda; o trilho sai da frente enquanto ela passa.
        active === "projects" && "pointer-events-none opacity-0"
      )}
    >
      <span className="mb-3 font-mono text-[10px] text-muted-foreground">GET /</span>
      <div className="relative">
        {/* trilho */}
        <span
          aria-hidden="true"
          className="absolute top-1 bottom-1 left-[5px] w-px bg-border"
        />
        <m.span
          aria-hidden="true"
          style={{ height: top }}
          className="absolute top-1 left-[5px] w-px bg-primary"
        />
        {/* pacote */}
        <m.span
          aria-hidden="true"
          style={{ top }}
          className="absolute left-0.5 size-2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--primary)_25%,transparent)]"
        />
        <ol className="flex flex-col gap-9">
          {navSections.map((id) => {
            const isActive = active === id
            return (
              <li key={id}>
                <Link
                  href={`/${locale}#${id}`}
                  aria-current={isActive ? "true" : undefined}
                  className="group flex items-center gap-3"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative z-10 size-[11px] rounded-[3px] border bg-background transition-colors duration-300",
                      isActive
                        ? "border-primary bg-primary"
                        : "border-ink/60 group-hover:border-primary"
                    )}
                  />
                  <span
                    className={cn(
                      "font-mono text-[11px] whitespace-nowrap transition-all duration-300",
                      isActive
                        ? "text-foreground opacity-100"
                        : "-translate-x-1 text-muted-foreground opacity-0 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 2xl:translate-x-0 2xl:opacity-100"
                    )}
                  >
                    {hops[id].hop}
                    <span className="sr-only"> — {nav[id]}</span>
                  </span>
                </Link>
              </li>
            )
          })}
        </ol>
      </div>
      <m.span aria-hidden="true" className="mt-4 font-mono text-[10px] text-success">
        {latency}
      </m.span>
    </nav>
  )
}

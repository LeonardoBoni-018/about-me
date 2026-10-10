"use client"

import { useState } from "react"
import Link from "next/link"
import { useMotionValueEvent, useScroll, useSpring } from "motion/react"
import * as m from "motion/react-m"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"
import { useActiveSection } from "@/hooks/use-active-section"
import { cn } from "@/lib/utils"
import { LocaleSwitcher } from "./locale-switcher"
import { MobileNav } from "./mobile-nav"
import { hops, navSections } from "./nav-items"
import { ThemeToggle } from "./theme-toggle"

interface SiteHeaderProps {
  locale: Locale
  nav: Dictionary["nav"]
  a11y: Dictionary["a11y"]
}

export function SiteHeader({ locale, nav, a11y }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const active = useActiveSection()
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12))

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 border-b transition-colors duration-300",
        scrolled ? "border-border bg-background/95" : "border-transparent bg-background/0"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link href={`/${locale}`} className="group flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-md bg-foreground font-mono text-xs font-semibold text-background transition-colors group-hover:bg-primary"
          >
            LB
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Leonardo Boni
          </span>
        </Link>

        <nav aria-label={a11y.mainNav} className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {navSections.map((section) => (
              <li key={section}>
                <Link
                  href={`/${locale}#${section}`}
                  aria-current={active === section ? "true" : undefined}
                  className={cn(
                    "rounded-md px-3 py-1.5 transition-colors",
                    active === section
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {nav[section]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="hidden font-mono text-[11px] text-muted-foreground sm:inline md:hidden"
          >
            {active ? hops[active].hop : "client"}
          </span>
          <LocaleSwitcher locale={locale} label={a11y.switchLocale} />
          <ThemeToggle label={a11y.toggleTheme} />
          <MobileNav locale={locale} nav={nav} a11y={a11y} active={active} />
        </div>
      </div>
      <m.div
        aria-hidden="true"
        style={{ scaleX: progress }}
        className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-primary"
      />
    </header>
  )
}

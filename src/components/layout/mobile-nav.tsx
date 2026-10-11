"use client"

import Link from "next/link"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"
import { cn } from "@/lib/utils"
import { hops, navSections, type NavSection } from "./nav-items"

interface MobileNavProps {
  locale: Locale
  nav: Dictionary["nav"]
  a11y: Dictionary["a11y"]
  active: NavSection | null
}

export function MobileNav({ locale, nav, a11y, active }: MobileNavProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label={a11y.openMenu}
        >
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-72 border-l bg-background">
        <SheetTitle className="px-6 pt-7 font-display text-xl font-semibold">
          Leonardo Boni
        </SheetTitle>
        <SheetDescription className="sr-only">{a11y.mainNav}</SheetDescription>
        <nav aria-label={a11y.mainNav} className="px-6">
          <ul className="flex flex-col divide-y border-y">
            {navSections.map((section) => (
              <li key={section}>
                <SheetClose asChild>
                  <Link
                    href={`/${locale}#${section}`}
                    className={cn(
                      "flex items-baseline gap-4 py-4 font-display text-2xl font-medium transition-colors hover:text-primary",
                      active === section && "text-primary"
                    )}
                  >
                    <span className="w-16 font-mono text-xs text-muted-foreground">
                      {hops[section].hop}
                    </span>
                    {nav[section]}
                  </Link>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

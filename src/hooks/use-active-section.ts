"use client"

import { useEffect, useState } from "react"
import { navSections, type NavSection } from "@/components/layout/nav-items"

/** Observa as seções da home e retorna a que está no centro da viewport. */
export function useActiveSection(): NavSection | null {
  const [active, setActive] = useState<NavSection | null>(null)

  useEffect(() => {
    const elements = navSections
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id as NavSection)
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return active
}

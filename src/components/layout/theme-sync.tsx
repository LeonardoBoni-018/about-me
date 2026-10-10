"use client"

import { useLayoutEffect } from "react"
import type { Locale } from "@/i18n/config"
import { applyResolvedTheme } from "@/lib/theme"

/**
 * Mantém o tema ao trocar de idioma. Navegar de /pt para /en renderiza de novo o layout raiz e
 * o `className` do <html> volta ao valor do servidor (sem `dark`); o script inline do <head> só
 * roda no primeiro carregamento. Este efeito reaplica o tema salvo antes da pintura.
 */
export function ThemeSync({ locale }: { locale: Locale }) {
  useLayoutEffect(() => {
    applyResolvedTheme()
  }, [locale])

  // Sinal de "página interativa", usado pelos testes E2E para não agir antes da hidratação.
  useLayoutEffect(() => {
    document.documentElement.dataset.hydrated = "true"
  }, [])

  return null
}

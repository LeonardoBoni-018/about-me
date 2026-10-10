export const locales = ["pt", "en"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "pt"

/** Valor do atributo `lang` do <html> e de `hreflang` para cada locale. */
export const htmlLang: Record<Locale, string> = {
  pt: "pt-BR",
  en: "en",
}

export const localeNames: Record<Locale, string> = {
  pt: "Português",
  en: "English",
}

export function hasLocale(value: string | undefined): value is Locale {
  return locales.includes(value as Locale)
}

/**
 * Escolhe o melhor locale suportado a partir do header `Accept-Language`,
 * respeitando os pesos `q` e comparando apenas o idioma principal (pt-BR → pt).
 */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";")
      const q = params.find((p) => p.trim().startsWith("q="))
      return {
        language: tag.trim().toLowerCase().split("-")[0],
        quality: q ? Number(q.trim().slice(2)) || 0 : 1,
      }
    })
    .filter((entry) => entry.language && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality)

  const match = ranked.find((entry) => hasLocale(entry.language))?.language
  return hasLocale(match) ? match : defaultLocale
}

/** Troca (ou adiciona) o prefixo de locale de um pathname. */
export function switchLocalePath(pathname: string, locale: Locale): string {
  const segments = pathname.split("/")
  if (hasLocale(segments[1])) {
    segments[1] = locale
    return segments.join("/") || `/${locale}`
  }
  return `/${locale}${pathname === "/" ? "" : pathname}`
}

import { htmlLang, type Locale } from "@/i18n/config"

/** Formata "AAAA-MM" como "jan. de 2024" / "Jan 2024" (sempre em UTC, determinístico). */
export function formatMonth(value: string, locale: Locale): string {
  const [year, month] = value.split("-").map(Number)
  return new Intl.DateTimeFormat(htmlLang[locale], {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)))
}

export function formatPeriod(
  start: string,
  end: string | undefined,
  locale: Locale,
  presentLabel: string
): string {
  return `${formatMonth(start, locale)} — ${end ? formatMonth(end, locale) : presentLabel}`
}

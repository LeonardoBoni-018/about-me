"use client"

import { Fragment } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  htmlLang,
  localeNames,
  locales,
  switchLocalePath,
  type Locale,
} from "@/i18n/config"
import { cn } from "@/lib/utils"

interface LocaleSwitcherProps {
  locale: Locale
  label: string
}

export function LocaleSwitcher({ locale, label }: LocaleSwitcherProps) {
  const pathname = usePathname()

  return (
    <nav aria-label={label} className="flex items-center gap-1.5 font-mono text-xs">
      {locales.map((value, i) => {
        const active = value === locale
        return (
          <Fragment key={value}>
            {i > 0 && (
              <span aria-hidden="true" className="text-border">
                /
              </span>
            )}
            <Link
              href={switchLocalePath(pathname, value)}
              hrefLang={htmlLang[value]}
              lang={htmlLang[value]}
              aria-current={active ? "true" : undefined}
              title={localeNames[value]}
              scroll={false}
              className={cn(
                "uppercase transition-colors",
                active
                  ? "text-foreground underline decoration-primary underline-offset-4"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {value}
            </Link>
          </Fragment>
        )
      })}
    </nav>
  )
}

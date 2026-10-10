import type { Metadata, Viewport } from "next"
import {
  Bricolage_Grotesque,
  Caveat,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
} from "next/font/google"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { ThemeSync } from "@/components/layout/theme-sync"
import { Providers } from "@/components/providers"
import { profile } from "@/content/profile"
import { defaultLocale, htmlLang, locales } from "@/i18n/config"
import { getDictionary, getLocale } from "@/i18n/dictionaries"
import { siteName, siteUrl } from "@/lib/site"
import { themeScript } from "@/lib/theme-script"
import { cn } from "@/lib/utils"
import "../globals.css"

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
})
const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
})
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
})
const caveat = Caveat({ variable: "--font-caveat", subsets: ["latin"] })

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  const dict = await getDictionary()

  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: `%s · ${siteName}` },
    description: dict.meta.description,
    authors: [{ name: profile.name, url: profile.socials.linkedin }],
    keywords: [
      "Backend",
      "Java",
      "Spring Boot",
      "Go",
      "Golang",
      "API",
      "REST",
      "Microservices",
    ],
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(locales.map((l) => [htmlLang[l], `/${l}`])),
        "x-default": `/${defaultLocale}`,
      },
    },
    openGraph: {
      type: "website",
      siteName,
      title: dict.meta.title,
      description: dict.meta.description,
      url: `/${locale}`,
      locale: htmlLang[locale].replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
  }
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f1ea" },
    { media: "(prefers-color-scheme: dark)", color: "#0a1626" },
  ],
}

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale()
  const dict = await getDictionary()

  return (
    <html
      lang={htmlLang[locale]}
      className={cn(
        bricolage.variable,
        plexSans.variable,
        plexMono.variable,
        caveat.variable
      )}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body id="top" className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
        >
          {dict.a11y.skipToContent}
        </a>
        <ThemeSync locale={locale} />
        <Providers>
          <SiteHeader locale={locale} nav={dict.nav} a11y={dict.a11y} />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter dict={dict.footer} />
        </Providers>
      </body>
    </html>
  )
}

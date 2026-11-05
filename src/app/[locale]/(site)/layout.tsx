import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"
import { getDictionary, getLocale } from "@/i18n/dictionaries"

/** Moldura do site atual: header fixo, <main> e rodapé. */
export default async function SiteLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await getLocale()
  const dict = await getDictionary()

  return (
    <>
      <SiteHeader locale={locale} nav={dict.nav} a11y={dict.a11y} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter dict={dict.footer} />
    </>
  )
}

import Link from "next/link"
import { Reveal } from "@/components/motion/reveal"
import { InterfaceScreens } from "@/components/system/interface-screens"
import { SystemSection } from "@/components/system/system-section"
import { ViewportFrame } from "@/components/system/viewport-frame"
import { Wireframe } from "@/components/system/wireframe"
import { interfaces } from "@/content/interfaces"
import { getProject } from "@/content/projects"
import { techLabels } from "@/content/tech"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"
import type { InterfaceProject } from "@/lib/types"
import { cn } from "@/lib/utils"

interface InterfacesProps {
  locale: Locale
  dict: Dictionary["interfaces"]
}

/** Os fronts: sites no ar (com screenshots reais) e as telas que consomem as APIs. */
export function Interfaces({ locale, dict }: InterfacesProps) {
  return (
    <SystemSection id="interfaces" title={dict.title} description={dict.description}>
      <ol className="space-y-20 sm:space-y-28">
        {interfaces.map((item, i) => (
          <li key={item.slug}>
            <Reveal>
              <InterfaceEntry
                item={item}
                flip={i % 2 === 1}
                locale={locale}
                dict={dict}
              />
            </Reveal>
          </li>
        ))}
      </ol>
    </SystemSection>
  )
}

function InterfaceEntry({
  item,
  flip,
  locale,
  dict,
}: {
  item: InterfaceProject
  flip: boolean
  locale: Locale
  dict: Dictionary["interfaces"]
}) {
  const api = item.apiSlug ? getProject(item.apiSlug) : undefined

  return (
    <article
      aria-labelledby={`${item.slug}-title`}
      className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14"
    >
      <div className={cn("min-w-0", flip && "lg:order-2")}>
        {item.screenshots && item.demoUrl ? (
          <InterfaceScreens
            item={item}
            alt={{ desktop: dict.screenshotDesktop, mobile: dict.screenshotMobile }}
          />
        ) : (
          <ViewportFrame route={item.route} status="dev">
            <Wireframe
              boxes={item.wireframe ?? []}
              label={`${dict.wireframeLabel}: ${item.title}`}
            />
            <figcaption className="border-t px-3 py-2 font-mono text-[11px] text-muted-foreground">
              {dict.wireframeCaption}
            </figcaption>
          </ViewportFrame>
        )}
      </div>

      <div className="min-w-0">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted-foreground">
          <span className="text-primary">{dict.kinds[item.kind]}</span>
          <span aria-hidden="true">·</span>
          {item.year}
          {item.client && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-success">{item.client[locale]}</span>
            </>
          )}
          {api && (
            <>
              <span aria-hidden="true">·</span>
              <span>
                {dict.consumes} <span className="text-ink">{api.title} API</span>
              </span>
            </>
          )}
        </p>
        <h3
          id={`${item.slug}-title`}
          className="mt-3 font-display text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {item.title}
        </h3>
        <p className="mt-3 text-pretty text-muted-foreground">{item.summary[locale]}</p>

        <ul className="mt-5 space-y-1.5 text-[15px]">
          {item.highlights[locale].map((highlight) => (
            <li key={highlight} className="flex gap-2">
              <span aria-hidden="true" className="font-mono text-success">
                +
              </span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>

        <p className="mt-5 font-mono text-xs text-muted-foreground">
          {techLabels(item.tech).join(" · ")}
        </p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 font-mono text-sm">
          {item.demoUrl && (
            <a
              href={item.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary link-underline"
            >
              {dict.live} ↗<span className="sr-only"> — {dict.newTab}</span>
            </a>
          )}
          <a
            href={item.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline"
          >
            {dict.repo} ↗<span className="sr-only"> — {dict.newTab}</span>
          </a>
          {api && (
            <Link href={`/${locale}/projects/${api.slug}`} className="link-underline">
              {dict.apiLink} {api.title} →
            </Link>
          )}
        </div>
      </div>
    </article>
  )
}

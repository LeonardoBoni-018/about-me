import Link from "next/link"
import { ArrowDown } from "lucide-react"
import { ArchitectureDiagram } from "@/components/system/architecture-diagram"
import { Crosshair } from "@/components/system/crosshair"
import { TraceWaterfall } from "@/components/system/trace-waterfall"
import { profile } from "@/content/profile"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"

interface HeroProps {
  locale: Locale
  dict: Dictionary["hero"]
  nav: Dictionary["nav"]
}

// O primeiro viewport usa animação CSS (não depende da hidratação), para não atrasar o LCP.
const enter = (delayMs: number) => ({ animationDelay: `${delayMs}ms` })

export function Hero({ locale, dict, nav }: HeroProps) {
  const [first, ...rest] = profile.name.split(" ")
  const last = rest.at(-1)

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate pt-28 pb-20 sm:pt-32"
    >
      <Crosshair />
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <div>
            <p
              className="flex animate-fade-up flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs"
              style={enter(0)}
            >
              <span className="rounded border border-ink/40 px-2 py-1">
                <span className="text-primary">GET</span> /leonardo{" "}
                <span className="text-muted-foreground">HTTP/1.1</span>
              </span>
              {profile.available && (
                <span className="flex items-center gap-2 text-success">
                  <span className="size-1.5 rounded-full bg-success" aria-hidden="true" />
                  200 · {dict.status}
                </span>
              )}
            </p>

            <h1 id="hero-title" className="mt-8 font-display tracking-tight">
              <span
                className="block animate-rise text-[clamp(3.4rem,10vw,7.5rem)] leading-[0.9] font-bold [font-variation-settings:'wdth'_85]"
                style={enter(100)}
              >
                {first}
                <br />
                <span className="text-primary">{last}</span>
                <span className="text-ink">.</span>
              </span>
              <span
                className="mt-6 block animate-rise text-xl font-medium text-muted-foreground sm:text-2xl"
                style={enter(200)}
              >
                {profile.role[locale]} — Java & Go
              </span>
            </h1>

            <p
              className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-pretty"
              style={enter(280)}
            >
              {profile.intro[locale]}
            </p>

            <div
              className="mt-9 flex animate-fade-up flex-wrap items-center gap-x-6 gap-y-4"
              style={enter(360)}
            >
              <Link
                href={`/${locale}#about`}
                className="group inline-flex items-center gap-3 rounded-md bg-foreground py-3 pr-5 pl-4 font-mono text-sm text-background transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <span className="text-primary transition-colors group-hover:text-primary-foreground">
                  ▶
                </span>
                {dict.ctaStart}
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </Link>
              <Link
                href={`/${locale}#contact`}
                className="font-mono text-sm link-underline"
              >
                {dict.ctaContact}
              </Link>
              {profile.cvUrl && (
                <a
                  href={profile.cvUrl[locale]}
                  download
                  className="font-mono text-sm link-underline"
                >
                  {dict.ctaCv}
                </a>
              )}
            </div>
          </div>

          <div className="animate-fade-up" style={enter(250)}>
            <ArchitectureDiagram
              locale={locale}
              label={dict.diagramLabel}
              hint={dict.diagramHint}
            />
          </div>
        </div>

        <div className="mt-16 animate-fade-up" style={enter(600)}>
          <TraceWaterfall
            locale={locale}
            nav={nav}
            title={dict.traceTitle}
            hint={dict.traceHint}
          />
        </div>
      </div>
    </section>
  )
}

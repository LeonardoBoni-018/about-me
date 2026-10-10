import Image from "next/image"
import { HandNote } from "@/components/hand/hand-note"
import { Odometer } from "@/components/motion/odometer"
import { Reveal } from "@/components/motion/reveal"
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text"
import { SystemSection } from "@/components/system/system-section"
import { courses } from "@/content/courses"
import { profile } from "@/content/profile"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"
import { formatMonth } from "@/lib/format"

interface AboutProps {
  locale: Locale
  dict: Dictionary["about"]
}

export function About({ locale, dict }: AboutProps) {
  // Números verificáveis: os do perfil + a contagem de cursos, derivada da própria lista.
  const stats = [
    ...profile.stats.map((s) => ({
      value: s.value,
      suffix: s.suffix,
      label: s.label[locale],
    })),
    { value: courses.length, suffix: undefined, label: dict.coursesStat },
  ]

  return (
    <SystemSection id="about" title={dict.title}>
      <div className="grid gap-16 lg:grid-cols-[20rem_1fr] lg:gap-20">
        <div className="space-y-10">
          <Reveal className="relative mx-auto w-full max-w-xs lg:mx-0">
            <BlueprintPhoto placeholder={dict.photoPlaceholder} />
            <HandNote
              direction="down-left"
              className="absolute -top-12 right-0 sm:-right-8"
            >
              {dict.photoNote}
            </HandNote>
          </Reveal>

          <Reveal>
            <NowResponse
              title={dict.nowTitle}
              updated={`${dict.nowUpdated} ${formatMonth(profile.now.updated, locale)}`}
              items={profile.now.items[locale]}
            />
          </Reveal>
        </div>

        <div>
          <ScrollRevealText
            paragraphs={profile.bio[locale]}
            className="font-display text-2xl leading-snug font-medium tracking-tight text-pretty sm:text-3xl"
          />

          <Reveal>
            <blockquote className="mt-14 border-l-2 border-primary pl-6">
              <p className="font-hand text-3xl leading-snug text-primary sm:text-4xl">
                “{profile.quote[locale]}”
              </p>
            </blockquote>
          </Reveal>

          <Reveal>
            <dl className="mt-14 grid grid-cols-3 divide-x border-y">
              {stats.map((stat) => (
                <div key={stat.label} className="px-3 py-6 first:pl-0 sm:px-6">
                  <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase sm:text-xs">
                    {stat.label}
                  </dt>
                  <dd className="mt-3">
                    <Odometer
                      value={stat.value}
                      suffix={stat.suffix}
                      className="font-display text-4xl font-bold text-foreground sm:text-6xl"
                    />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </SystemSection>
  )
}

/** Foto (ou placeholder) emoldurada como um desenho técnico, com marcas de canto e cotas. */
function BlueprintPhoto({ placeholder }: { placeholder: string }) {
  return (
    <figure className="relative pt-7 pl-7">
      {/* cota horizontal */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 left-7 flex items-center gap-2"
      >
        <span className="h-2 w-px bg-ink" />
        <span className="h-px flex-1 bg-ink/60" />
        <span className="font-mono text-[10px] text-ink">320</span>
        <span className="h-px flex-1 bg-ink/60" />
        <span className="h-2 w-px bg-ink" />
      </div>
      {/* cota vertical */}
      <div
        aria-hidden="true"
        className="absolute top-7 bottom-0 left-0 flex flex-col items-center gap-2"
      >
        <span className="h-px w-2 bg-ink" />
        <span className="w-px flex-1 bg-ink/60" />
        <span className="font-mono text-[10px] text-ink [writing-mode:vertical-rl]">
          320
        </span>
        <span className="w-px flex-1 bg-ink/60" />
        <span className="h-px w-2 bg-ink" />
      </div>
      <div className="group relative aspect-square overflow-hidden bg-card corner-ticks p-2">
        {profile.avatarUrl ? (
          <Image
            src={profile.avatarUrl}
            alt={profile.name}
            fill
            sizes="320px"
            className="object-cover grayscale transition-[filter] duration-500 group-hover:grayscale-0"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 border border-dashed border-ink/40 bg-[repeating-linear-gradient(45deg,transparent_0_10px,color-mix(in_oklab,var(--ink)_8%,transparent)_10px_11px)]">
            <span className="font-display text-7xl font-bold text-ink">
              {profile.initials}
            </span>
            <span className="font-mono text-xs text-muted-foreground">{placeholder}</span>
          </div>
        )}
      </div>
    </figure>
  )
}

/** "GET /now" renderizado como uma resposta JSON real. */
function NowResponse({
  title,
  updated,
  items,
}: {
  title: string
  updated: string
  items: { label: string; text: string }[]
}) {
  return (
    <div className="rounded-lg border bg-card font-mono text-xs leading-relaxed">
      <p className="flex justify-between gap-2 border-b px-4 py-2.5">
        <span>
          <span className="text-primary">GET</span> /now{" "}
          <span className="text-success">200</span>
        </span>
        <span className="text-muted-foreground">{updated}</span>
      </p>
      <div className="px-4 py-3">
        <p className="text-muted-foreground">{`// ${title}`}</p>
        <p>{"{"}</p>
        {items.map((item, i) => (
          <p key={item.label} className="pl-4">
            <span className="text-ink">&quot;{item.label.toLowerCase()}&quot;</span>:{" "}
            <span className="text-foreground">&quot;{item.text}&quot;</span>
            {i < items.length - 1 && ","}
          </p>
        ))}
        <p>{"}"}</p>
      </div>
    </div>
  )
}

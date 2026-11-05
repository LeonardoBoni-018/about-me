import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ProjectIndex, type IndexItem } from "@/components/prototype/project-index"
import { ProtoHeader } from "@/components/prototype/proto-header"
import { SheetTrack } from "@/components/prototype/sheet-track"
import { TopologyScene } from "@/components/prototype/topology-scene"
import { CopyEmailButton } from "@/components/shared/copy-email-button"
import { experiences } from "@/content/experience"
import { interfaces } from "@/content/interfaces"
import { profile } from "@/content/profile"
import { projects } from "@/content/projects"
import { prototypeCopy as copy } from "@/content/prototype"
import { tech } from "@/content/tech"
import { getLocale } from "@/i18n/dictionaries"
import { buildTopology } from "@/lib/topology"

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale()
  return {
    title: copy.meta.title[locale],
    // Protótipo em avaliação: fora dos buscadores.
    robots: { index: false, follow: false },
  }
}

/** Projetos que ganham folha de especificação completa, nesta ordem. */
const SHEETS = ["nexo-assist", "byfood", "bar-do-marcelo"]

function monthYear(value: string, locale: string) {
  const [year, month] = value.split("-").map(Number)
  // "fev 2024" / "Feb 2024": curto o bastante para caber numa linha da coluna de datas.
  const name = new Date(Date.UTC(year, month - 1, 1))
    .toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      month: "short",
      timeZone: "UTC",
    })
    .replace(".", "")
  return `${name} ${year}`
}

export default async function PrototypePage() {
  const locale = await getLocale()
  const other = locale === "pt" ? "en" : "pt"
  const t = <T,>(value: Record<"pt" | "en", T>) => value[locale]

  const topology = buildTopology(projects)
  const screenshotFor = (slug: string) =>
    interfaces.find((ui) => ui.apiSlug === slug)?.screenshots?.desktop

  // Índice: APIs (levam ao estudo de caso) + telas (levam ao site no ar), do mais novo ao mais antigo.
  const items: IndexItem[] = [
    ...projects.map((p) => ({
      id: p.slug,
      title: p.title,
      year: p.year,
      group: "api" as const,
      kind: t(copy.index.kind.api),
      stack: p.tech.slice(0, 4).map((id) => tech[id]),
      status: p.demoUrl ? ("live" as const) : ("repo" as const),
      statusLabel: p.demoUrl ? t(copy.index.live) : t(copy.index.repo),
      href: `/${locale}/projects/${p.slug}`,
      external: false,
      image: screenshotFor(p.slug),
    })),
    ...interfaces.map((ui) => ({
      id: ui.slug,
      title: ui.title,
      year: ui.year,
      group: "front" as const,
      kind: t(copy.index.kind[ui.kind]),
      stack: ui.tech.slice(0, 4).map((id) => tech[id]),
      status: ui.demoUrl ? ("live" as const) : ("repo" as const),
      statusLabel: ui.demoUrl ? t(copy.index.live) : t(copy.index.repo),
      href: ui.demoUrl ?? ui.repoUrl,
      external: true,
      image: ui.screenshots?.desktop,
    })),
  ].sort((a, b) => b.year - a.year)

  const liveCount = new Set(
    [...projects.map((p) => p.demoUrl), ...interfaces.map((ui) => ui.demoUrl)].filter(
      Boolean
    )
  ).size
  const repoCount = new Set(
    [...projects.map((p) => p.repoUrl), ...interfaces.map((ui) => ui.repoUrl)].filter(
      Boolean
    )
  ).size

  const sheets = SHEETS.map((slug) => projects.find((p) => p.slug === slug)!).filter(
    Boolean
  )
  const [firstName, ...rest] = profile.name.split(" ")
  const lastName = rest.at(-1)

  const sections = [
    { href: "#sistemas", label: t(copy.nav.systems) },
    { href: "#detalhe", label: t(copy.nav.sheets) },
    { href: "#telas", label: t(copy.nav.screens) },
    { href: "#trajetoria", label: t(copy.nav.log) },
    { href: "#contato", label: t(copy.nav.contact) },
  ]

  return (
    <>
      <ProtoHeader
        name={`${firstName} ${lastName}`}
        homeHref={`/${locale}/prototipo`}
        localeHref={`/${other}/prototipo`}
        localeLabel={other.toUpperCase()}
        openLabel={t(copy.menu.open)}
        closeLabel={t(copy.menu.close)}
        links={sections}
        projects={projects.map((p) => ({
          href: `/${locale}/projects/${p.slug}`,
          label: p.title,
          meta: `${tech[p.language]} · ${p.year}`,
        }))}
      />

      <main id="main" className="pt-12">
        {/* Aviso do protótipo: deixa claro que é uma proposta e leva ao site atual */}
        <p className="border-b border-[var(--p-rule)] bg-[var(--p-ink)] px-4 py-2 text-center text-xs text-[var(--p-paper)] sm:px-8">
          {t(copy.banner)}{" "}
          <Link href={`/${locale}`} className="underline hover:text-[var(--p-signal)]">
            {t(copy.bannerLink)}
          </Link>
        </p>

        {/* ── Hero: nome em letreiro + grafo 3D dos sistemas ── */}
        <section className="mx-auto grid max-w-[1500px] gap-10 px-4 pt-10 pb-16 sm:px-8 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:pt-14">
          <div className="flex min-w-0 flex-col justify-between gap-10">
            <h1 className="font-wide text-[clamp(4rem,21vw,10.5rem)] leading-[0.82] font-bold tracking-[-0.04em] uppercase [font-stretch:62%] lg:text-[clamp(4rem,11.5vw,10.5rem)]">
              <span className="reveal-line block">{firstName}</span>
              <span className="reveal-line block [animation-delay:120ms]">
                {lastName}
              </span>
            </h1>
            <div className="max-w-xl">
              <p className="text-xl leading-snug text-pretty sm:text-2xl">
                {t(copy.hero.lead)}
              </p>
              <dl className="mt-8 grid grid-cols-2 border-t border-[var(--p-ink)] text-sm sm:grid-cols-3">
                <div className="border-b border-[var(--p-rule)] py-3 pr-4">
                  <dt className="text-[var(--p-dim)]">{t(profile.role)}</dt>
                  <dd>{t(profile.location)}</dd>
                </div>
                <div className="border-b border-[var(--p-rule)] py-3 pr-4">
                  <dt className="text-[var(--p-dim)]">{t(copy.hero.live)}</dt>
                  <dd className="tnum font-mono">{liveCount}</dd>
                </div>
                <div className="col-span-2 border-b border-[var(--p-rule)] py-3 sm:col-span-1">
                  <dt className="text-[var(--p-dim)]">{t(copy.hero.repos)}</dt>
                  <dd className="tnum font-mono">{repoCount}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="min-w-0 lg:min-h-[560px]">
            <TopologyScene
              topology={topology}
              label={t(copy.hero.graphLabel)}
              caption={t(copy.hero.graphCaption)}
              paths={sheets
                .concat(projects.filter((p) => !SHEETS.includes(p.slug)))
                .map((p) => ({
                  slug: p.slug,
                  title: p.title,
                }))}
            />
          </div>
        </section>

        {/* ── Índice editorial ── */}
        <section
          id="sistemas"
          className="mx-auto max-w-[1500px] scroll-mt-16 px-4 py-20 sm:px-8"
        >
          <h2 className="font-wide mb-10 max-w-3xl text-4xl leading-[0.95] font-bold tracking-[-0.03em] [font-stretch:75%] sm:text-6xl">
            {t(copy.index.title)}
          </h2>
          <ProjectIndex
            items={items}
            openLabel={t(copy.index.open)}
            filters={[
              { id: "all", label: t(copy.index.filters.all) },
              { id: "api", label: t(copy.index.filters.api) },
              { id: "front", label: t(copy.index.filters.front) },
            ]}
          />
        </section>

        {/* ── Folhas de especificação (horizontal e presa no desktop) ── */}
        <section id="detalhe" className="scroll-mt-12 border-t border-[var(--p-ink)]">
          <h2 className="sr-only">{t(copy.sheets.title)}</h2>
          <SheetTrack>
            {sheets.map((project, i) => {
              const shot = screenshotFor(project.slug)
              return (
                <article
                  key={project.slug}
                  className="grid gap-10 bg-[var(--p-paper)] px-4 pt-20 pb-16 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] pin:h-full pin:w-[min(1320px,92vw)] pin:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] pin:pt-24 pin:pb-10"
                >
                  <div className="flex min-w-0 flex-col">
                    <p className="tnum font-mono text-xs text-[var(--p-dim)]">
                      {i + 1}/{sheets.length}
                    </p>
                    <h3 className="font-wide mt-3 text-5xl leading-[0.9] font-bold tracking-[-0.035em] [font-stretch:70%] sm:text-7xl">
                      {project.title}
                    </h3>
                    <p className="mt-5 max-w-[60ch] text-lg leading-snug text-pretty">
                      {t(project.summary)}
                    </p>
                    <div className="mt-6 grid max-w-[64ch] gap-5 text-[15px] leading-relaxed text-[var(--p-dim)]">
                      <div>
                        <h4 className="mb-1 font-semibold text-[var(--p-ink)]">
                          {t(copy.sheets.problem)}
                        </h4>
                        <p>{t(project.problem)}</p>
                      </div>
                      <div>
                        <h4 className="mb-1 font-semibold text-[var(--p-ink)]">
                          {t(copy.sheets.solution)}
                        </h4>
                        <p>{t(project.solution)}</p>
                      </div>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 bg-[var(--p-signal)] px-3 py-2 font-medium text-[var(--p-signal-ink)] hover:bg-[var(--p-ink)] hover:text-[var(--p-paper)]"
                        >
                          {t(copy.sheets.visit)}{" "}
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                        </a>
                      )}
                      {project.repoUrl && (
                        <a
                          href={project.repoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 py-2 underline hover:text-[var(--p-signal)]"
                        >
                          {t(copy.sheets.code)}
                        </a>
                      )}
                      <Link
                        href={`/${locale}/projects/${project.slug}`}
                        className="inline-flex items-center gap-1 py-2 underline hover:text-[var(--p-signal)]"
                      >
                        {t(copy.sheets.case)}
                      </Link>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col gap-6">
                    {shot && (
                      <div className="relative aspect-[16/10] overflow-hidden border border-[var(--p-ink)] bg-[var(--p-sheet)]">
                        <Image
                          src={shot}
                          alt={project.title}
                          fill
                          sizes="(min-width: 1024px) 46vw, 100vw"
                          className="object-cover object-top"
                        />
                      </div>
                    )}
                    <dl className="grid grid-cols-[7rem_minmax(0,1fr)] border-t border-[var(--p-ink)] text-sm">
                      <dt className="border-b border-[var(--p-rule)] py-2 text-[var(--p-dim)]">
                        {t(copy.sheets.specs.language)}
                      </dt>
                      <dd className="border-b border-[var(--p-rule)] py-2">
                        {tech[project.language]} · {project.year}
                      </dd>
                      <dt className="border-b border-[var(--p-rule)] py-2 text-[var(--p-dim)]">
                        {t(copy.sheets.specs.stack)}
                      </dt>
                      <dd className="border-b border-[var(--p-rule)] py-2">
                        {project.tech.map((id) => tech[id]).join(", ")}
                      </dd>
                      <dt className="border-b border-[var(--p-rule)] py-2 text-[var(--p-dim)]">
                        {t(copy.sheets.specs.flow)}
                      </dt>
                      <dd className="border-b border-[var(--p-rule)] py-2">
                        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                          {project.architecture.map((node, n) => (
                            <li key={node.label} className="flex items-center gap-1.5">
                              {n > 0 && (
                                <span
                                  aria-hidden="true"
                                  className="text-[var(--p-signal)]"
                                >
                                  →
                                </span>
                              )}
                              <span title={t(node.detail)}>{node.label}</span>
                            </li>
                          ))}
                        </ol>
                      </dd>
                      <dt className="py-2 text-[var(--p-dim)]">
                        {t(copy.sheets.specs.routes)}
                      </dt>
                      <dd className="py-2">
                        <ul className="grid gap-1 font-mono text-xs">
                          {project.endpoints.slice(0, 3).map((e) => (
                            <li key={e.method + e.path} className="truncate">
                              <span className="text-[var(--p-signal)]">{e.method}</span>{" "}
                              {e.path}
                            </li>
                          ))}
                        </ul>
                      </dd>
                    </dl>
                  </div>
                </article>
              )
            })}
          </SheetTrack>
        </section>

        {/* ── Faixa de telas (galeria de trabalhos, à la Alche) ── */}
        <section id="telas" className="scroll-mt-16 border-t border-[var(--p-ink)] py-20">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-end justify-between gap-4 px-4 sm:px-8">
            <h2 className="font-wide text-4xl leading-[0.95] font-bold tracking-[-0.03em] [font-stretch:75%] sm:text-6xl">
              {t(copy.screens.title)}
            </h2>
            <p className="text-sm text-[var(--p-dim)]">{t(copy.screens.hint)}</p>
          </div>
          <ul
            tabIndex={0}
            aria-label={t(copy.screens.title)}
            className="strip mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-6 sm:px-8"
          >
            {interfaces
              .filter((ui) => ui.screenshots)
              .map((ui) => (
                <li
                  key={ui.slug}
                  className="w-[82vw] max-w-[620px] shrink-0 snap-start sm:w-[60vw]"
                >
                  <a
                    href={ui.demoUrl ?? ui.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group block"
                  >
                    <div className="relative">
                      <div className="relative aspect-[16/10] overflow-hidden border border-[var(--p-ink)] bg-[var(--p-sheet)]">
                        <Image
                          src={ui.screenshots!.desktop}
                          alt={ui.title}
                          fill
                          sizes="(min-width: 640px) 620px, 82vw"
                          className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                        />
                      </div>
                      <div className="absolute right-3 -bottom-4 aspect-[390/664] w-[22%] overflow-hidden border border-[var(--p-ink)] bg-[var(--p-sheet)] shadow-[0_10px_24px_-10px_rgb(0_0_0/0.4)]">
                        <Image
                          src={ui.screenshots!.mobile}
                          alt=""
                          fill
                          sizes="140px"
                          className="object-cover object-top"
                        />
                      </div>
                    </div>
                    <div className="mt-7 flex items-baseline justify-between gap-4">
                      <h3 className="text-lg font-semibold group-hover:text-[var(--p-signal)]">
                        {ui.title}
                      </h3>
                      <span className="font-mono text-xs text-[var(--p-dim)]">
                        {ui.route}
                      </span>
                    </div>
                    <p className="mt-1 max-w-[56ch] text-sm text-[var(--p-dim)]">
                      {t(ui.summary)}
                    </p>
                  </a>
                </li>
              ))}
          </ul>
        </section>

        {/* ── Trajetória como diário de bordo ── */}
        <section
          id="trajetoria"
          className="mx-auto grid max-w-[1500px] scroll-mt-16 gap-12 border-t border-[var(--p-ink)] px-4 py-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]"
        >
          <div>
            <h2 className="font-wide text-4xl leading-[0.95] font-bold tracking-[-0.03em] [font-stretch:75%] sm:text-6xl">
              {t(copy.log.title)}
            </h2>
            <div className="mt-8 grid max-w-[62ch] gap-4 text-[17px] leading-relaxed">
              {t(profile.bio).map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>
          </div>
          <ol className="self-start border-t border-[var(--p-ink)]">
            {experiences.map((exp) => (
              <li
                key={exp.id}
                className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4 border-b border-[var(--p-rule)] py-4 sm:grid-cols-[11rem_minmax(0,1fr)]"
              >
                <span className="tnum font-mono text-xs leading-6 text-[var(--p-dim)]">
                  {monthYear(exp.start, locale)} –{" "}
                  {exp.end ? (
                    monthYear(exp.end, locale)
                  ) : (
                    <span className="text-[var(--p-signal)]">{t(copy.log.now)}</span>
                  )}
                </span>
                <span>
                  <span className="block font-semibold">{exp.company}</span>
                  <span className="text-sm text-[var(--p-dim)]">{t(exp.role)}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Contato: rodapé grande ── */}
        <footer
          id="contato"
          className="scroll-mt-12 bg-[var(--p-ink)] px-4 pt-20 pb-10 text-[var(--p-paper)] sm:px-8"
        >
          <div className="mx-auto max-w-[1500px]">
            <h2 className="max-w-2xl text-2xl text-pretty sm:text-3xl">
              {t(copy.contact.title)}
            </h2>
            <a
              href={`mailto:${profile.email}`}
              className="font-wide mt-6 block text-[clamp(1.6rem,6.4vw,6.5rem)] leading-none font-bold tracking-[-0.03em] break-all [font-stretch:70%] hover:text-[var(--p-signal)]"
            >
              {profile.email}
            </a>
            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm [&_button]:text-[var(--p-paper)]/80 [&_button:hover]:text-[var(--p-signal)]">
              <CopyEmailButton
                email={profile.email}
                label={t(copy.contact.copy)}
                copiedLabel={t(copy.contact.copied)}
              />
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-[var(--p-signal)]"
              >
                GitHub
              </a>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-[var(--p-signal)]"
              >
                LinkedIn
              </a>
            </div>
            <p className="mt-20 flex flex-wrap justify-between gap-4 border-t border-white/15 pt-6 text-xs opacity-70">
              <span>{profile.name}</span>
              <span>{t(profile.location)}</span>
            </p>
          </div>
        </footer>
      </main>
    </>
  )
}

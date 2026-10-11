import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Reveal } from "@/components/motion/reveal"
import { ScrambleText } from "@/components/motion/scramble-text"
import { MiniPipeline } from "@/components/system/mini-pipeline"
import { ViewportFrame } from "@/components/system/viewport-frame"
import { Wireframe } from "@/components/system/wireframe"
import { interfaces } from "@/content/interfaces"
import { getProject, projects } from "@/content/projects"
import { tech, techLabels } from "@/content/tech"
import { htmlLang, locales } from "@/i18n/config"
import { getDictionary, getLocale } from "@/i18n/dictionaries"
import { shortHash } from "@/lib/hash"
import type { HttpMethod } from "@/lib/types"
import { cn } from "@/lib/utils"

export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params
  const locale = await getLocale()
  const project = getProject(slug)
  if (!project) return {}

  return {
    title: project.title,
    description: project.summary[locale],
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: Object.fromEntries(
        locales.map((l) => [htmlLang[l], `/${l}/projects/${slug}`])
      ),
    },
    openGraph: { title: project.title, description: project.summary[locale] },
  }
}

export default async function ProjectPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  const locale = await getLocale()
  const { project: dict } = await getDictionary()
  const next = projects[(projects.indexOf(project) + 1) % projects.length]
  // O front que consome esta API, se houver (seção "Front-end" da home).
  const front = interfaces.find((item) => item.apiSlug === project.slug)

  return (
    <article className="pt-28 pb-16 sm:pt-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Link
          href={`/${locale}#projects`}
          className="font-mono text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          ← {dict.back}
        </Link>

        <header className="mt-10 animate-fade-up border-b border-dashed pb-10">
          <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted-foreground">
            <span>
              job <span className="text-primary">{shortHash(project.slug)}</span>
            </span>
            <span>{tech[project.language]}</span>
            <span>{project.year}</span>
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-bold tracking-tight text-balance sm:text-7xl">
            <ScrambleText text={project.title} />
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-pretty text-muted-foreground">
            {project.summary[locale]}
          </p>
          <div className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3 font-mono text-sm">
            <p className="text-muted-foreground">
              {dict.stack}:{" "}
              <span className="text-foreground">
                {techLabels(project.tech).join(" · ")}
              </span>
            </p>
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="link-underline"
              >
                {dict.repository} ↗
              </a>
            )}
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="link-underline"
              >
                {dict.demo} ↗
              </a>
            )}
          </div>
        </header>

        <div className="grid gap-10 py-14 md:grid-cols-2">
          <Reveal>
            <Block label={dict.problem}>
              <p className="text-lg leading-relaxed text-pretty">
                {project.problem[locale]}
              </p>
            </Block>
          </Reveal>
          <Reveal delay={0.1}>
            <Block label={dict.solution}>
              <p className="text-lg leading-relaxed text-pretty">
                {project.solution[locale]}
              </p>
            </Block>
          </Reveal>
        </div>

        <Reveal className="border-t border-dashed py-14">
          <Block label={dict.architecture}>
            <div className="rounded-lg border bg-card/70 corner-ticks p-5 sm:p-8">
              <MiniPipeline nodes={project.architecture} locale={locale} variant="full" />
            </div>
          </Block>
        </Reveal>

        <Reveal className="border-t border-dashed py-14">
          <Block label={dict.endpoints}>
            {/* Focável: no celular a tabela rola na horizontal e precisa ser alcançável pelo teclado. */}
            <div
              role="region"
              aria-label={dict.endpoints}
              tabIndex={0}
              className="overflow-x-auto rounded-lg border bg-card outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <table className="w-full min-w-[520px] text-left font-mono text-sm">
                <thead className="text-xs tracking-wider text-muted-foreground uppercase">
                  <tr className="border-b">
                    <th scope="col" className="px-4 py-3 font-normal">
                      {dict.method}
                    </th>
                    <th scope="col" className="px-4 py-3 font-normal">
                      {dict.path}
                    </th>
                    <th scope="col" className="px-4 py-3 font-normal">
                      {dict.endpointDescription}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed">
                  {project.endpoints.map((endpoint) => (
                    <tr
                      key={`${endpoint.method} ${endpoint.path}`}
                      className="transition-colors hover:bg-secondary"
                    >
                      <td
                        className={cn(
                          "px-4 py-3 text-xs font-semibold",
                          methodColor[endpoint.method]
                        )}
                      >
                        {endpoint.method}
                      </td>
                      <td className="px-4 py-3">{endpoint.path}</td>
                      <td className="px-4 py-3 font-sans text-muted-foreground">
                        {endpoint.description[locale]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Block>
        </Reveal>

        <Reveal className="border-t border-dashed py-14">
          <Block label={dict.results}>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {project.results[locale].map((result) => (
                <li
                  key={result}
                  className="rounded-lg border bg-card p-5 font-display text-xl leading-snug font-semibold"
                >
                  <span
                    aria-hidden="true"
                    className="mb-3 block font-mono text-xs text-success"
                  >
                    ✓ pass
                  </span>
                  {result}
                </li>
              ))}
            </ul>
          </Block>
        </Reveal>

        {front && (
          <Reveal className="border-t border-dashed py-14">
            <Block label={dict.frontend}>
              <div className="grid items-center gap-8 lg:grid-cols-[1fr_1fr]">
                {front.wireframe && (
                  <ViewportFrame route={front.route} status="dev" className="min-w-0">
                    <Wireframe
                      boxes={front.wireframe}
                      label={`${dict.frontend}: ${front.title}`}
                    />
                  </ViewportFrame>
                )}
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-bold tracking-tight">
                    {front.title}
                  </h3>
                  <p className="mt-2 text-pretty text-muted-foreground">
                    {front.summary[locale]}
                  </p>
                  <p className="mt-4 font-mono text-xs text-muted-foreground">
                    {techLabels(front.tech).join(" · ")}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 font-mono text-sm">
                    <a
                      href={front.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link-underline"
                    >
                      {dict.frontendRepo} ↗
                    </a>
                    <Link href={`/${locale}#interfaces`} className="link-underline">
                      {dict.frontendMore} →
                    </Link>
                  </div>
                </div>
              </div>
            </Block>
          </Reveal>
        )}

        {next && next.slug !== project.slug && (
          <Reveal className="border-t pt-10">
            <Link href={`/${locale}/projects/${next.slug}`} className="group block">
              <span className="font-mono text-xs text-muted-foreground">
                {dict.next} →
              </span>
              <span className="mt-2 block font-display text-4xl font-bold tracking-tight transition-colors group-hover:text-primary sm:text-5xl">
                {next.title}
              </span>
            </Link>
          </Reveal>
        )}
      </div>
    </article>
  )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0">
      <h2 className="mb-5 font-mono text-xs tracking-widest text-primary uppercase">
        {label}
      </h2>
      {children}
    </section>
  )
}

const methodColor: Record<HttpMethod, string> = {
  GET: "text-success",
  POST: "text-primary",
  PUT: "text-ink",
  PATCH: "text-ink",
  DELETE: "text-destructive",
}

import Link from "next/link"
import { Tilt } from "@/components/motion/tilt"
import { HorizontalTrack } from "@/components/system/horizontal-track"
import { MiniPipeline } from "@/components/system/mini-pipeline"
import { SystemSection } from "@/components/system/system-section"
import { projects } from "@/content/projects"
import { tech, techLabels } from "@/content/tech"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"
import type { Project } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ProjectsProps {
  locale: Locale
  dict: Dictionary["projects"]
}

export function Projects({ locale, dict }: ProjectsProps) {
  const sorted = [...projects].sort(
    (a, b) => Number(b.featured ?? false) - Number(a.featured ?? false) || b.year - a.year
  )

  return (
    <SystemSection
      id="projects"
      title={dict.title}
      description={dict.description}
      className="pb-0 sm:pb-8"
      fullBleed={
        <HorizontalTrack
          label={dict.trackLabel}
          queueLabel={dict.queue}
          items={sorted.map((project, i) => (
            <JobCard
              key={project.slug}
              project={project}
              number={i + 1}
              locale={locale}
              dict={dict}
            />
          ))}
        />
      }
    />
  )
}

const methodColor: Record<string, string> = {
  GET: "text-success",
  POST: "text-primary",
  PUT: "text-ink",
  PATCH: "text-ink",
  DELETE: "text-destructive",
}

/** Card de projeto como um "job" processado: status, pipeline e endpoints. */
function JobCard({
  project,
  number,
  locale,
  dict,
}: {
  project: Project
  number: number
  locale: Locale
  dict: Dictionary["projects"]
}) {
  return (
    <Tilt className="h-full">
      <article className="relative flex h-full flex-col overflow-hidden rounded-xl border bg-card p-6 transition-colors duration-300 group-hover/tilt:border-primary/60 sm:p-8">
        {/* "Progresso do job": barra sólida que se preenche no hover (sem degradê). */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform duration-500 ease-out group-hover/tilt:scale-x-100"
        />
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-muted-foreground">
            job{" "}
            <span className="text-foreground">#{String(number).padStart(2, "0")}</span> ·{" "}
            {tech[project.language]} · {project.year}
          </span>
          <span className="flex items-center gap-1.5 text-success">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-success" />
            {dict.completed}
          </span>
        </div>

        <h3 className="mt-6 font-display text-3xl font-bold tracking-tight sm:text-4xl">
          <Link
            href={`/${locale}/projects/${project.slug}`}
            className="outline-none after:absolute after:inset-0 after:z-10 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-ring"
          >
            {project.title}
          </Link>
        </h3>
        <p className="mt-3 text-pretty text-muted-foreground">
          {project.summary[locale]}
        </p>

        <div className="mt-6">
          <MiniPipeline nodes={project.architecture} locale={locale} />
        </div>

        <ul className="mt-6 space-y-1 border-t border-dashed pt-4 font-mono text-xs">
          {project.endpoints.slice(0, 3).map((endpoint) => (
            <li key={`${endpoint.method} ${endpoint.path}`} className="flex gap-3">
              <span
                className={cn(
                  "w-12 shrink-0 font-semibold",
                  methodColor[endpoint.method]
                )}
              >
                {endpoint.method}
              </span>
              <span className="truncate">{endpoint.path}</span>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-end justify-between gap-4 pt-6">
          <p className="font-mono text-[11px] text-muted-foreground">
            {techLabels(
              project.tech.filter((id) => id !== project.language).slice(0, 4)
            ).join(" · ")}
          </p>
          <span
            aria-hidden="true"
            className="shrink-0 font-mono text-xs whitespace-nowrap text-primary transition-transform duration-300 group-hover/tilt:translate-x-1"
          >
            {dict.details} →
          </span>
        </div>
      </article>
    </Tilt>
  )
}

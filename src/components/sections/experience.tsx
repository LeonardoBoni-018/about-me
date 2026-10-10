import { Reveal } from "@/components/motion/reveal"
import { CommitLine } from "@/components/system/commit-line"
import { SystemSection } from "@/components/system/system-section"
import { courses } from "@/content/courses"
import { experiences } from "@/content/experience"
import { profile } from "@/content/profile"
import { techLabels } from "@/content/tech"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"
import { formatMonth, formatPeriod } from "@/lib/format"
import { shortHash } from "@/lib/hash"

interface ExperienceProps {
  locale: Locale
  dict: Dictionary["experience"]
}

/** Trajetória como um `git log`: cada emprego/formação é um commit. */
export function Experience({ locale, dict }: ExperienceProps) {
  return (
    <SystemSection id="experience" title={dict.title} description={dict.description}>
      <CommitLine>
        <ol className="space-y-6">
          {experiences.map((item, i) => {
            const isHead = i === 0
            const isRoot = i === experiences.length - 1
            return (
              <li key={item.id} className="relative pl-10 sm:pl-14">
                <span
                  aria-hidden="true"
                  className={
                    isHead
                      ? "absolute top-7 left-[3px] size-[15px] rounded-full border-2 border-primary bg-primary sm:left-[7px]"
                      : "absolute top-7 left-[3px] size-[15px] rounded-full border-2 border-ink bg-background sm:left-[7px]"
                  }
                />
                <Reveal>
                  <article className="group rounded-lg border bg-card/70 p-5 font-mono text-sm transition-colors duration-300 hover:border-primary/50 sm:p-6">
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-primary">commit {shortHash(item.id)}</span>
                      {isHead && (
                        <span className="text-xs">
                          (<span className="text-success">HEAD → main</span>)
                        </span>
                      )}
                      {item.kind === "education" && (
                        <span className="text-xs text-ink">({dict.educationBranch})</span>
                      )}
                      {isRoot && !isHead && (
                        <span className="text-xs text-ink">(tag: v0.1)</span>
                      )}
                    </p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {dict.author}: {profile.name}
                      <br />
                      {dict.date}:{" "}
                      {formatPeriod(item.start, item.end, locale, dict.present)}
                    </p>

                    <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                      {item.role[locale]}
                    </h3>
                    <p className="mt-1 font-sans text-muted-foreground">
                      @ {item.company}
                      {item.location && ` · ${item.location[locale]}`}
                    </p>
                    <p className="mt-4 max-w-prose font-sans leading-relaxed text-pretty">
                      {item.description[locale]}
                    </p>

                    {item.highlights[locale].length > 0 && (
                      <ul className="mt-4 space-y-1.5 rounded-md bg-background/60 p-3 text-[13px]">
                        {item.highlights[locale].map((highlight) => (
                          <li key={highlight} className="flex gap-2">
                            <span aria-hidden="true" className="text-success">
                              +
                            </span>
                            <span className="font-sans">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {item.tech.length > 0 && (
                      <p className="mt-4 text-xs text-muted-foreground">
                        {techLabels(item.tech).join(" · ")}
                      </p>
                    )}
                  </article>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </CommitLine>

      <Reveal className="mt-16">
        <CourseTags locale={locale} dict={dict} />
      </Reveal>
    </SystemSection>
  )
}

const VISIBLE_COURSES = 6

/** Cursos e certificações como a saída de um `git tag`: os mais recentes à mostra, o resto expansível. */
function CourseTags({
  locale,
  dict,
}: {
  locale: Locale
  dict: Dictionary["experience"]
}) {
  const row = (course: (typeof courses)[number]) => (
    <li
      key={`${course.title}-${course.date}`}
      className="grid gap-x-4 gap-y-0.5 border-b border-dashed py-3 sm:grid-cols-[7rem_1fr_auto]"
    >
      <span className="text-xs text-muted-foreground">
        {formatMonth(course.date, locale)}
      </span>
      <span className="font-sans text-foreground">
        {course.title}
        <span className="text-muted-foreground"> · {course.provider}</span>
      </span>
      {course.hours && <span className="text-xs text-success">{course.hours}h</span>}
    </li>
  )

  return (
    <div className="rounded-lg border bg-card/70 p-5 font-mono text-sm sm:p-6">
      <p className="text-xs text-muted-foreground">
        <span className="text-primary">$</span> git tag --sort=-date{" "}
        <span className="text-ink"># {dict.coursesTitle}</span>
      </p>
      <ul className="mt-3">{courses.slice(0, VISIBLE_COURSES).map(row)}</ul>
      {courses.length > VISIBLE_COURSES && (
        <details className="group mt-1">
          <summary className="cursor-pointer list-none py-3 text-xs text-primary transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
            <span className="group-open:hidden">
              + {courses.length - VISIBLE_COURSES} {dict.coursesMore}
            </span>
            <span className="hidden group-open:inline">− {dict.coursesLess}</span>
          </summary>
          <ul>{courses.slice(VISIBLE_COURSES).map(row)}</ul>
        </details>
      )}
    </div>
  )
}

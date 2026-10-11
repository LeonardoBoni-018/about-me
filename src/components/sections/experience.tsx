import { Reveal } from "@/components/motion/reveal"
import { CommitLine } from "@/components/system/commit-line"
import { SystemSection } from "@/components/system/system-section"
import { experiences } from "@/content/experience"
import { profile } from "@/content/profile"
import { techLabels } from "@/content/tech"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"
import { formatPeriod } from "@/lib/format"
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
    </SystemSection>
  )
}

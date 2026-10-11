import { Odometer } from "@/components/motion/odometer"
import { Reveal } from "@/components/motion/reveal"
import { CertificateList } from "@/components/system/certificate-list"
import { SystemSection } from "@/components/system/system-section"
import { VerifyStatus } from "@/components/system/verify-status"
import { courses } from "@/content/courses"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"
import { certificateStats, countByArea } from "@/lib/certificates"
import { formatMonth } from "@/lib/format"
import { fingerprint } from "@/lib/hash"
import type { Course } from "@/lib/types"

interface CertificatesProps {
  locale: Locale
  dict: Dictionary["certificates"]
}

/** Cursos e certificações como um cofre de certificados: destaques grandes + a lista completa. */
export function Certificates({ locale, dict }: CertificatesProps) {
  const stats = certificateStats(courses)
  // Destaques do maior para o menor em carga horária (sem carga declarada vão por último).
  const featured = courses
    .filter((course) => course.featured)
    .sort((a, b) => (b.hours ?? 0) - (a.hours ?? 0))

  return (
    <SystemSection id="certificates" title={dict.title} description={dict.description}>
      <Reveal>
        <dl className="grid grid-cols-3 divide-x border-y">
          {(
            [
              [stats.count, dict.stats.count],
              [stats.hours, dict.stats.hours],
              [stats.issuers, dict.stats.issuers],
            ] as const
          ).map(([value, label]) => (
            <div key={label} className="px-3 py-6 first:pl-0 sm:px-6">
              <dt className="font-mono text-[10px] tracking-widest text-muted-foreground uppercase sm:text-xs">
                {label}
              </dt>
              <dd className="mt-3">
                <Odometer
                  value={value}
                  className="font-display text-4xl font-bold text-foreground sm:text-6xl"
                />
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((course, i) => (
          <li key={`${course.title}-${course.date}`} className="min-w-0">
            <Reveal delay={(i % 3) * 0.08} className="h-full">
              <CertificateCard course={course} index={i} locale={locale} dict={dict} />
            </Reveal>
          </li>
        ))}
      </ol>

      <Reveal className="mt-14 rounded-lg border bg-card/70 p-5 sm:p-6">
        <p className="mb-4 font-mono text-xs text-muted-foreground">
          <span className="text-primary">$</span> openssl verify --all{" "}
          <span className="text-ink"># {dict.listTitle}</span>
        </p>
        <CertificateList
          rows={courses.map((course) => ({
            key: `${course.title}-${course.date}`,
            title: course.title,
            provider: course.provider,
            month: formatMonth(course.date, locale),
            hours: course.hours,
            area: course.area,
          }))}
          areas={countByArea(courses).map(([id, count]) => ({
            id,
            count,
            label: dict.areas[id],
          }))}
          labels={{ all: dict.all, filter: dict.filter }}
        />
      </Reveal>
    </SystemSection>
  )
}

/** Um certificado em destaque, com os campos de um X.509: emissor, data, carga e impressão digital. */
function CertificateCard({
  course,
  index,
  locale,
  dict,
}: {
  course: Course
  index: number
  locale: Locale
  dict: Dictionary["certificates"]
}) {
  return (
    <article className="flex h-full flex-col rounded-lg border bg-card p-5 transition-colors duration-300 hover:border-primary/60 sm:p-6">
      <div className="flex items-center justify-between gap-3 font-mono text-[11px] text-muted-foreground">
        <span>X.509 · v3</span>
        <VerifyStatus pending={dict.pending} valid={dict.valid} index={index} />
      </div>
      <h3 className="mt-4 font-display text-xl leading-snug font-semibold tracking-tight text-pretty sm:text-2xl">
        {course.title}
      </h3>
      <dl className="mt-5 grid grid-cols-[5.5rem_1fr] gap-y-1.5 font-mono text-xs">
        <dt className="text-muted-foreground">{dict.issuer}</dt>
        <dd className="min-w-0 [overflow-wrap:anywhere]">{course.provider}</dd>
        <dt className="text-muted-foreground">{dict.issued}</dt>
        <dd>{formatMonth(course.date, locale)}</dd>
        {course.hours && (
          <>
            <dt className="text-muted-foreground">{dict.load}</dt>
            <dd className="text-success">{course.hours} h</dd>
          </>
        )}
        <dt className="text-muted-foreground">{dict.area}</dt>
        <dd className="text-ink">{dict.areas[course.area]}</dd>
      </dl>
      <div className="mt-auto pt-5">
        <p
          aria-hidden="true"
          className="truncate border-t border-dashed pt-4 font-mono text-[10px] text-muted-foreground"
        >
          SHA-256 {fingerprint(`${course.title}|${course.provider}|${course.date}`)}
        </p>
      </div>
    </article>
  )
}

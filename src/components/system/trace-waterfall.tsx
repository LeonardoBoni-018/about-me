import Link from "next/link"
import { totalLatency, traceSpans } from "@/components/layout/nav-items"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"
import { shortHash } from "@/lib/hash"

interface TraceWaterfallProps {
  locale: Locale
  nav: Dictionary["nav"]
  title: string
  hint: string
}

/**
 * Índice da página no formato de um trace distribuído (estilo OpenTelemetry/Jaeger): cada
 * seção é um span, posicionado pelo início e pela duração. Clicar leva à seção.
 */
export function TraceWaterfall({ locale, nav, title, hint }: TraceWaterfallProps) {
  const spans = traceSpans

  return (
    <div className="rounded-lg border bg-card/80">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 font-mono text-xs">
        <p>
          <span className="text-muted-foreground">{title} · </span>
          trace_id <span className="text-primary">{shortHash("leonardo-boni", 16)}</span>
        </p>
        <p className="text-muted-foreground">
          {spans.length} spans · <span className="text-success">{totalLatency} ms</span>
        </p>
      </div>
      <ol className="divide-y divide-dashed">
        {spans.map((span, i) => (
          <li key={span.id}>
            <Link
              href={`/${locale}#${span.id}`}
              className="group grid grid-cols-[9.5rem_1fr_3.5rem] items-center gap-3 px-4 py-2.5 transition-colors hover:bg-secondary focus-visible:bg-secondary sm:grid-cols-[19rem_1fr_4rem]"
            >
              <span className="truncate font-mono text-xs">
                <span className="text-muted-foreground">{span.hop} </span>
                <span className="hidden text-muted-foreground sm:inline">
                  {span.span} ·{" "}
                </span>
                <span className="text-foreground">{nav[span.id]}</span>
              </span>
              <span className="relative h-2.5 rounded-sm bg-secondary">
                <span
                  className="absolute inset-y-0 origin-left animate-grow-x rounded-sm bg-primary/80 transition-colors group-hover:bg-primary"
                  style={{
                    left: `${(span.start / totalLatency) * 100}%`,
                    width: `${(span.ms / totalLatency) * 100}%`,
                    animationDelay: `${900 + i * 160}ms`,
                  }}
                />
              </span>
              <span className="text-right font-mono text-xs text-muted-foreground group-hover:text-foreground">
                {span.ms} ms
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <p className="border-t px-4 py-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

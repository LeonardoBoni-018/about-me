import type { Locale } from "@/i18n/config"
import type { ArchitectureNode } from "@/lib/types"
import { cn } from "@/lib/utils"

interface MiniPipelineProps {
  nodes: ArchitectureNode[]
  locale: Locale
  /** "card": compacto, dados fluem no hover do card. "full": maior, fluxo contínuo. */
  variant?: "card" | "full"
}

/** Pipeline da arquitetura de um projeto: caixas ligadas por conectores com dados trafegando. */
export function MiniPipeline({ nodes, locale, variant = "card" }: MiniPipelineProps) {
  const full = variant === "full"

  return (
    <ol
      className={cn(
        "flex",
        full
          ? "flex-col gap-0 lg:flex-row lg:items-stretch"
          : "flex-wrap items-center gap-y-2"
      )}
    >
      {nodes.map((node, i) => (
        <li
          key={node.label}
          className={cn(
            "flex items-center",
            full ? "flex-col lg:flex-1 lg:flex-row" : ""
          )}
        >
          <div
            className={cn(
              "rounded-md border border-ink/50 bg-background/80 text-center transition-colors",
              full ? "w-full px-4 py-3" : "px-2 py-1 group-hover/tilt:border-primary/60"
            )}
          >
            <p className={cn("font-mono font-medium", full ? "text-sm" : "text-[11px]")}>
              {node.label}
            </p>
            {full && (
              <p className="mt-1 text-xs text-muted-foreground">{node.detail[locale]}</p>
            )}
          </div>
          {i < nodes.length - 1 &&
            (full ? (
              <>
                <span aria-hidden="true" className="h-6 w-px bg-ink/60 lg:hidden" />
                <span
                  aria-hidden="true"
                  className="hidden h-px w-8 shrink-0 animate-flow-x dash-x lg:block"
                />
              </>
            ) : (
              <span
                aria-hidden="true"
                className="h-px w-4 shrink-0 dash-x [animation-play-state:paused] group-hover/tilt:animate-flow-x group-hover/tilt:[animation-play-state:running]"
              />
            ))}
        </li>
      ))}
    </ol>
  )
}

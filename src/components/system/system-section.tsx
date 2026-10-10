import { hops, navSections, type NavSection } from "@/components/layout/nav-items"
import { Reveal } from "@/components/motion/reveal"
import { ScrambleText } from "@/components/motion/scramble-text"
import { cn } from "@/lib/utils"

interface SystemSectionProps {
  id: NavSection
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
  /** Conteúdo que precisa ocupar a largura toda (ex.: trilho horizontal). */
  fullBleed?: React.ReactNode
}

/**
 * Seção da home como um "salto" da requisição: cabeçalho com o hop, o span de rastreamento e
 * a latência simulada daquele trecho.
 */
export function SystemSection({
  id,
  title,
  description,
  children,
  className,
  fullBleed,
}: SystemSectionProps) {
  const { hop, span, ms } = hops[id]
  const index = String(navSections.indexOf(id) + 1).padStart(2, "0")

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("py-24 sm:py-32", className)}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <header className="mb-14 grid gap-6 border-b border-dashed pb-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="flex items-center gap-3 font-mono text-xs tracking-widest text-primary uppercase">
                <span className="text-muted-foreground">{index}</span>
                <span aria-hidden="true" className="h-px w-8 bg-primary" />
                {hop}
              </p>
              <h2
                id={`${id}-title`}
                className="mt-4 max-w-4xl font-display text-4xl font-semibold tracking-tight text-balance sm:text-6xl"
              >
                <ScrambleText text={title} />
              </h2>
              {description && (
                <p className="mt-5 max-w-2xl text-lg text-pretty text-muted-foreground">
                  {description}
                </p>
              )}
            </div>
            <p
              aria-hidden="true"
              className="font-mono text-xs text-muted-foreground lg:text-right"
            >
              span <span className="text-foreground">{span}</span>
              <br />
              <span className="text-success">{ms} ms</span>
            </p>
          </header>
        </Reveal>
        {children}
      </div>
      {fullBleed}
    </section>
  )
}

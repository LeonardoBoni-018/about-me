import { cn } from "@/lib/utils"

interface ViewportFrameProps {
  /** Rota exibida na barra, como a requisição que carregou a tela. */
  route: string
  /** Status mostrado à direita da barra (ex.: "200", "dev"). */
  status: string
  children: React.ReactNode
  className?: string
}

/** Moldura de "navegador" no estilo do site: a barra é a requisição que trouxe a tela. */
export function ViewportFrame({
  route,
  status,
  children,
  className,
}: ViewportFrameProps) {
  return (
    <figure className={cn("overflow-hidden rounded-lg border bg-card", className)}>
      <div className="flex items-center gap-3 border-b px-3 py-2 font-mono text-[11px]">
        <span className="font-semibold text-success">GET</span>
        <span className="min-w-0 flex-1 truncate text-muted-foreground">{route}</span>
        <span className="text-ink">{status}</span>
      </div>
      {children}
    </figure>
  )
}

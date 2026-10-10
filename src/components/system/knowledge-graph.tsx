"use client"

import { useMemo, useRef, useState } from "react"
import { useInView } from "motion/react"
import type { TechId } from "@/content/tech"
import type { Dictionary } from "@/i18n/dictionaries"
import { neighborsOf, type KnowledgeGraph as Graph } from "@/lib/graph"
import { cn } from "@/lib/utils"

interface GroupMeta {
  id: string
  title: string
  note: string
}

interface KnowledgeGraphProps {
  graph: Graph
  groups: GroupMeta[]
  labels: Record<TechId, string>
  /** Onde cada tecnologia aparece (projetos e empresas). */
  usage: Partial<Record<TechId, string[]>>
  dict: Dictionary["stack"]
}

const nodeRadius = (weight: number) => Math.min(22, 6 + weight * 2.4)

export function KnowledgeGraph({
  graph,
  groups,
  labels,
  usage,
  dict,
}: KnowledgeGraphProps) {
  // Um único observador para o SVG inteiro; a entrada em cascata é feita com transições CSS
  // (antes eram ~190 componentes animados, cada um com seu observador — caro de hidratar).
  const svgRef = useRef<SVGSVGElement>(null)
  const entered = useInView(svgRef, { once: true, margin: "-80px" })
  const [hovered, setHovered] = useState<TechId | null>(null)
  const [pinned, setPinned] = useState<TechId | null>(null)
  const selected = hovered ?? pinned

  const position = useMemo(
    () => new Map(graph.nodes.map((n) => [n.id, n])),
    [graph.nodes]
  )
  const neighbors = useMemo(
    () => (selected ? neighborsOf(graph.edges, selected) : new Set<TechId>()),
    [graph.edges, selected]
  )
  const groupById = new Map(groups.map((g) => [g.id, g]))
  const maxEdge = Math.max(...graph.edges.map((e) => e.weight), 1)

  // Rótulo de cada grupo acima do seu agrupamento de nós.
  const groupLabels = graph.groups.map((g) => {
    const members = graph.nodes.filter((n) => n.group === g.id)
    const top = Math.min(...members.map((n) => n.y - nodeRadius(n.weight)))
    return { ...g, y: top - 22, title: groupById.get(g.id)?.title ?? g.id }
  })

  function select(id: TechId) {
    setPinned((current) => (current === id ? null : id))
  }

  const selectedNode = selected ? position.get(selected) : undefined

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_18rem]">
      {/* Grafo (tablet/desktop) */}
      <div className="relative hidden rounded-lg border bg-card/60 p-2 md:block">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${graph.width} ${graph.height}`}
          role="group"
          aria-label={dict.title}
          className="h-auto w-full"
          onPointerLeave={() => setHovered(null)}
        >
          <g
            className={cn(
              "transition-opacity delay-500 duration-1000",
              entered ? "opacity-100" : "opacity-0"
            )}
          >
            {graph.edges.map((edge) => {
              const a = position.get(edge.source)!
              const b = position.get(edge.target)!
              const lit =
                selected !== null &&
                (edge.source === selected || edge.target === selected)
              return (
                <line
                  key={`${edge.source}-${edge.target}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  strokeWidth={lit ? 2 : 1}
                  className={cn(
                    "transition-[stroke,opacity] duration-300",
                    lit ? "stroke-primary" : "stroke-ink"
                  )}
                  // Em repouso, só as ligações frequentes aparecem com força; o resto vira textura.
                  style={{
                    opacity: selected
                      ? lit
                        ? 0.9
                        : 0.03
                      : edge.weight > 1
                        ? 0.12 + (edge.weight / maxEdge) * 0.35
                        : 0.04,
                  }}
                />
              )
            })}
          </g>

          {groupLabels.map((g) => (
            <text
              key={g.id}
              x={g.x}
              y={g.y}
              textAnchor="middle"
              className="fill-muted-foreground font-mono text-[12px] tracking-widest uppercase"
            >
              {g.title}
            </text>
          ))}

          {graph.nodes.map((node, i) => {
            const isSelected = node.id === selected
            const isNeighbor = neighbors.has(node.id)
            const dim = selected !== null && !isSelected && !isNeighbor
            const r = nodeRadius(node.weight)
            return (
              // Envoltório externo: entrada (escala + opacidade, com atraso em cascata).
              // Interno: esmaecimento no hover, sem atraso.
              <g
                key={node.id}
                style={{
                  transform: entered ? "scale(1)" : "scale(0)",
                  opacity: entered ? 1 : 0,
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transition:
                    "transform 600ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease-out",
                  transitionDelay: `${100 + i * 25}ms`,
                }}
              >
                <g
                  role="button"
                  tabIndex={0}
                  aria-pressed={pinned === node.id}
                  aria-label={labels[node.id]}
                  onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(node.id)}
                  onFocus={() => setHovered(node.id)}
                  onBlur={() => setHovered(null)}
                  onClick={() => select(node.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      select(node.id)
                    }
                  }}
                  className={cn(
                    "cursor-pointer transition-opacity duration-300 outline-none",
                    dim && "opacity-25"
                  )}
                >
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r + 6}
                    className={cn(
                      "fill-primary/0 transition-[fill] duration-300",
                      isSelected && "fill-primary/15"
                    )}
                  />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={r}
                    strokeWidth={isSelected || isNeighbor ? 2 : 1.25}
                    className={cn(
                      "transition-[fill,stroke] duration-300",
                      isSelected ? "fill-primary stroke-primary" : "fill-card",
                      !isSelected && (isNeighbor ? "stroke-primary" : "stroke-ink")
                    )}
                  />
                  <text
                    x={node.x}
                    y={node.y + r + 15}
                    textAnchor="middle"
                    className={cn(
                      "pointer-events-none font-mono text-[12px]",
                      isSelected ? "fill-primary font-semibold" : "fill-foreground"
                    )}
                  >
                    {labels[node.id]}
                  </text>
                </g>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Lista tocável (mobile) */}
      <div className="space-y-5 md:hidden">
        {groups.map((group) => (
          <div key={group.id}>
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {group.title}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {graph.nodes
                .filter((n) => n.group === group.id)
                .map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    aria-pressed={pinned === n.id}
                    onClick={() => select(n.id)}
                    className={cn(
                      "rounded-md border px-2.5 py-1 font-mono text-xs transition-colors",
                      pinned === n.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : neighbors.has(n.id)
                          ? "border-primary text-primary"
                          : "border-ink/40"
                    )}
                  >
                    {labels[n.id]}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* Painel de detalhes */}
      <aside
        aria-live="polite"
        className="self-start rounded-lg border bg-card corner-ticks p-6 lg:sticky lg:top-24"
      >
        {selectedNode ? (
          <div>
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {groupById.get(selectedNode.group)?.title}
            </p>
            <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
              {labels[selectedNode.id]}
            </p>
            <p className="mt-1 font-hand text-xl text-primary">
              {groupById.get(selectedNode.group)?.note}
            </p>
            <p className="mt-5 font-mono text-xs text-muted-foreground uppercase">
              {dict.usedIn}
            </p>
            {usage[selectedNode.id]?.length ? (
              <ul className="mt-2 space-y-1 text-sm">
                {usage[selectedNode.id]!.map((where) => (
                  <li key={where} className="flex gap-2">
                    <span aria-hidden="true" className="text-primary">
                      →
                    </span>
                    {where}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">{dict.notUsed}</p>
            )}
            {neighbors.size > 0 && (
              <>
                <p className="mt-5 font-mono text-xs text-muted-foreground uppercase">
                  {neighbors.size} {dict.connections}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {[...neighbors].map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setHovered(null)
                        setPinned(id)
                      }}
                      className="rounded border border-ink/40 px-1.5 py-0.5 font-mono text-[11px] transition-colors hover:border-primary hover:text-primary"
                    >
                      {labels[id]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <p className="text-sm text-pretty text-muted-foreground">{dict.hint}</p>
        )}
      </aside>
    </div>
  )
}

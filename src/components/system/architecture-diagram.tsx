"use client"

import { useId, useState } from "react"
import { useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react"
import * as m from "motion/react-m"
import {
  SYSTEM_NODE_SIZE,
  systemEdges,
  systemNodes,
  type SystemNode,
} from "@/content/system"
import type { Locale } from "@/i18n/config"
import { cn } from "@/lib/utils"

const VIEW = { width: 520, height: 400 }
const { width: W, height: H } = SYSTEM_NODE_SIZE

function edgePath(from: SystemNode, to: SystemNode) {
  const x1 = from.x + W
  const y1 = from.y + H / 2
  const x2 = to.x
  const y2 = to.y + H / 2
  const mid = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`
}

interface ArchitectureDiagramProps {
  locale: Locale
  label: string
  hint: string
}

/**
 * Diagrama vivo da arquitetura com que trabalho: as conexões se desenham, pacotes trafegam pelas
 * arestas e cada nó explica o que eu faço com ele (hover, foco ou toque). Inclina levemente com
 * o mouse, como uma prancheta em 3D.
 */
export function ArchitectureDiagram({ locale, label, hint }: ArchitectureDiagramProps) {
  const uid = useId()
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState<string | null>(null)
  const byId = new Map(systemNodes.map((node) => [node.id, node]))
  const activeNode = active ? byId.get(active) : undefined

  // Inclinação 3D seguindo o cursor
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [7, -7]), {
    stiffness: 120,
    damping: 18,
  })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-9, 9]), {
    stiffness: 120,
    damping: 18,
  })

  function handleMove(event: React.PointerEvent<HTMLDivElement>) {
    if (reduceMotion || event.pointerType !== "mouse") return
    const rect = event.currentTarget.getBoundingClientRect()
    px.set((event.clientX - rect.left) / rect.width - 0.5)
    py.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  function isLit(edge: { from: string; to: string }) {
    return active !== null && (edge.from === active || edge.to === active)
  }

  return (
    <div
      className="relative [perspective:1100px]"
      onPointerMove={handleMove}
      onPointerLeave={() => {
        px.set(0)
        py.set(0)
      }}
    >
      <m.div
        style={{ rotateX, rotateY }}
        className="relative [transform-style:preserve-3d]"
      >
        <svg
          viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
          role="group"
          aria-label={label}
          className="h-auto w-full overflow-visible"
        >
          {/* arestas */}
          {systemEdges.map((edge, i) => {
            const from = byId.get(edge.from)!
            const to = byId.get(edge.to)!
            const id = `${uid}-edge-${i}`
            const lit = isLit(edge)
            return (
              <g key={id}>
                <m.path
                  id={id}
                  d={edgePath(from, to)}
                  fill="none"
                  strokeWidth={lit ? 2 : 1.25}
                  className={cn(
                    "transition-[stroke,opacity] duration-300",
                    lit ? "stroke-primary" : "stroke-ink",
                    active && !lit ? "opacity-20" : "opacity-70"
                  )}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 0.9,
                    delay: 0.5 + i * 0.12,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
                {!reduceMotion && (
                  // Invisível até o início do movimento, para não "piscar" no canto do SVG.
                  <circle r={lit ? 4 : 3} opacity={0} className="fill-primary">
                    <set
                      attributeName="opacity"
                      to="1"
                      begin={`${1.4 + i * 0.35}s`}
                      fill="freeze"
                    />
                    <animateMotion
                      dur={`${2.2 + (i % 3) * 0.5}s`}
                      begin={`${1.4 + i * 0.35}s`}
                      repeatCount="indefinite"
                      rotate="auto"
                    >
                      <mpath href={`#${id}`} />
                    </animateMotion>
                  </circle>
                )}
              </g>
            )
          })}

          {/* nós */}
          {systemNodes.map((node, i) => {
            const isActive = node.id === active
            const dim =
              active !== null &&
              !isActive &&
              !systemEdges.some(
                (e) => isLit(e) && (e.from === node.id || e.to === node.id)
              )
            return (
              <m.g
                key={node.id}
                role="button"
                tabIndex={0}
                // O nome acessível contém o texto visível, na ordem (tipo + rótulo) — WCAG 2.5.3.
                aria-label={`${node.kind} ${node.label}: ${node.note[locale]}`}
                aria-pressed={isActive}
                // Hover só com mouse: no toque, pointerenter + click se anulariam.
                onPointerEnter={(e) => e.pointerType === "mouse" && setActive(node.id)}
                onPointerLeave={(e) => e.pointerType === "mouse" && setActive(null)}
                onFocus={() => setActive(node.id)}
                onBlur={() => setActive(null)}
                // No toque, focus e click chegam juntos; alternar aqui desligaria o nó
                // recém-ativado. Ele é desativado ao tocar fora (blur).
                onClick={() => setActive(node.id)}
                className={cn(
                  "cursor-pointer transition-opacity duration-300 outline-none",
                  dim && "opacity-40"
                )}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.08 }}
              >
                <rect
                  x={node.x}
                  y={node.y}
                  width={W}
                  height={H}
                  rx={node.kind === "store" ? 14 : 6}
                  className={cn(
                    "fill-card transition-[stroke] duration-300",
                    isActive ? "stroke-primary" : "stroke-ink"
                  )}
                  strokeWidth={isActive ? 2 : 1.25}
                />
                {/* Um único <text>: o texto visível vira "tipo rótulo" (com espaço), contido
                    no nome acessível. Dois <text> separados seriam lidos colados. */}
                <text className="font-mono">
                  <tspan
                    x={node.x + 6}
                    y={node.y - 6}
                    className="fill-muted-foreground text-[8px] uppercase"
                  >
                    {node.kind}{" "}
                  </tspan>
                  <tspan
                    x={node.x + W / 2}
                    y={node.y + H / 2 + 4}
                    textAnchor="middle"
                    className={cn(
                      "text-[11px] font-medium",
                      isActive ? "fill-primary" : "fill-foreground"
                    )}
                  >
                    {node.label}
                  </tspan>
                </text>
              </m.g>
            )
          })}
        </svg>
      </m.div>

      {/* Explicação do nó ativo (ou a dica, quando nenhum está ativo) */}
      <div aria-live="polite" className="mt-4 min-h-16 border-l-2 border-primary pl-4">
        {activeNode ? (
          <p className="text-sm text-pretty">
            <span className="font-mono text-xs text-primary">{activeNode.label}</span>
            <br />
            {activeNode.note[locale]}
          </p>
        ) : (
          <p className="font-hand text-2xl text-primary">↑ {hint}</p>
        )}
      </div>
    </div>
  )
}

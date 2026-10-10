import type { TechId } from "@/content/tech"

export interface GraphGroup {
  id: string
  items: TechId[]
}

export interface GraphNode {
  id: TechId
  group: string
  /** Quantas vezes a tecnologia aparece em projetos/experiências (+1). */
  weight: number
  x: number
  y: number
}

export interface GraphEdge {
  source: TechId
  target: TechId
  /** Quantas vezes as duas tecnologias aparecem juntas. */
  weight: number
}

export interface KnowledgeGraph {
  nodes: GraphNode[]
  edges: GraphEdge[]
  groups: { id: string; x: number; y: number }[]
  width: number
  height: number
}

const WIDTH = 1200
const HEIGHT = 760

/**
 * Monta o grafo de conhecimento a partir dos dados reais: o peso de cada tecnologia vem de
 * quantas vezes ela aparece em projetos/experiências (`sources`) e as arestas ligam tecnologias
 * usadas juntas. O layout é determinístico (sem física), então servidor e cliente concordam.
 */
export function buildKnowledgeGraph(
  groups: GraphGroup[],
  sources: TechId[][]
): KnowledgeGraph {
  const known = new Set(groups.flatMap((g) => g.items))
  const usage = new Map<TechId, number>()
  const pairs = new Map<string, number>()

  for (const source of sources) {
    const unique = [...new Set(source)].filter((id) => known.has(id))
    for (const id of unique) usage.set(id, (usage.get(id) ?? 0) + 1)
    for (let i = 0; i < unique.length; i++) {
      for (let j = i + 1; j < unique.length; j++) {
        const key = [unique[i], unique[j]].sort().join("|")
        pairs.set(key, (pairs.get(key) ?? 0) + 1)
      }
    }
  }

  // Grupos distribuídos numa elipse; nós de cada grupo num círculo ao redor do centro do grupo,
  // com a primeira tecnologia (a "principal") no meio.
  const centerX = WIDTH / 2
  const centerY = HEIGHT / 2
  const layoutGroups = groups.map((group, i) => {
    const angle = (i / groups.length) * Math.PI * 2 - Math.PI / 2
    return {
      id: group.id,
      x: round(centerX + Math.cos(angle) * 450),
      y: round(centerY + Math.sin(angle) * 255),
    }
  })

  const nodes: GraphNode[] = groups.flatMap((group, gi) => {
    const { x: gx, y: gy } = layoutGroups[gi]
    const [lead, ...rest] = group.items
    const radius = 44 + rest.length * 7
    const offset = gi * 0.7
    return [
      { id: lead, group: group.id, weight: (usage.get(lead) ?? 0) + 1, x: gx, y: gy },
      ...rest.map((id, i) => {
        const angle = (i / rest.length) * Math.PI * 2 + offset
        return {
          id,
          group: group.id,
          weight: (usage.get(id) ?? 0) + 1,
          x: round(gx + Math.cos(angle) * radius),
          y: round(gy + Math.sin(angle) * radius * 0.8),
        }
      }),
    ]
  })

  const edges: GraphEdge[] = [...pairs.entries()].map(([key, weight]) => {
    const [source, target] = key.split("|") as [TechId, TechId]
    return { source, target, weight }
  })

  return { nodes, edges, groups: layoutGroups, width: WIDTH, height: HEIGHT }
}

/** Ids das tecnologias ligadas diretamente a `id`. */
export function neighborsOf(edges: GraphEdge[], id: TechId): Set<TechId> {
  const result = new Set<TechId>()
  for (const edge of edges) {
    if (edge.source === id) result.add(edge.target)
    if (edge.target === id) result.add(edge.source)
  }
  return result
}

function round(value: number) {
  return Math.round(value * 10) / 10
}

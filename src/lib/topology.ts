import type { Project } from "@/lib/types"

/** Um componente que aparece na arquitetura de um ou mais projetos. */
export interface TopologyNode {
  id: string
  label: string
  /** Slugs dos projetos que passam por este componente. */
  projects: string[]
}

/** Uma ligação entre dois componentes vizinhos no fluxo de algum projeto. */
export interface TopologyEdge {
  from: string
  to: string
  /** Quantos projetos usam esta ligação. */
  weight: number
}

export interface Topology {
  nodes: TopologyNode[]
  edges: TopologyEdge[]
}

/**
 * Nome canônico de um nó da arquitetura: "Site (React)" → "React", "Spring Boot 4" →
 * "Spring Boot", "PostgreSQL 16" → "PostgreSQL". Assim o mesmo componente usado em projetos
 * diferentes vira um nó só.
 */
export function canonicalLabel(label: string): string {
  const inner = label.match(/\(([^)]+)\)/)?.[1]
  const base = (inner ?? label).replace(/\s+\d+(\.\d+)*$/, "").trim()
  return base
}

function slugify(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Monta o grafo de todos os sistemas a partir de `project.architecture`: cada nó é um
 * componente real e cada aresta, um salto que uma requisição faz em algum projeto. É o dado
 * por trás da cena 3D do protótipo — nada ali é decorativo.
 */
export function buildTopology(projects: Project[]): Topology {
  const nodes = new Map<string, TopologyNode>()
  const edges = new Map<string, TopologyEdge>()

  for (const project of projects) {
    const ids = project.architecture.map((step) => {
      const label = canonicalLabel(step.label)
      const id = slugify(label)
      const node = nodes.get(id) ?? { id, label, projects: [] }
      if (!node.projects.includes(project.slug)) node.projects.push(project.slug)
      nodes.set(id, node)
      return id
    })

    for (let i = 0; i < ids.length - 1; i++) {
      const [from, to] = [ids[i], ids[i + 1]]
      if (from === to) continue
      const key = from < to ? `${from}|${to}` : `${to}|${from}`
      const edge = edges.get(key) ?? { from, to, weight: 0 }
      edge.weight += 1
      edges.set(key, edge)
    }
  }

  return {
    nodes: [...nodes.values()].sort(
      (a, b) => b.projects.length - a.projects.length || a.label.localeCompare(b.label)
    ),
    edges: [...edges.values()],
  }
}

import { describe, expect, it } from "vitest"
import { projects } from "@/content/projects"
import { buildTopology, canonicalLabel } from "@/lib/topology"

describe("canonicalLabel", () => {
  it("usa o nome entre parênteses e tira a versão", () => {
    expect(canonicalLabel("Site (React)")).toBe("React")
    expect(canonicalLabel("Spring Boot 4")).toBe("Spring Boot")
    expect(canonicalLabel("PostgreSQL 16")).toBe("PostgreSQL")
    expect(canonicalLabel("Kafka")).toBe("Kafka")
  })
})

describe("buildTopology", () => {
  const topology = buildTopology(projects)
  const ids = new Set(topology.nodes.map((node) => node.id))

  it("junta o mesmo componente de projetos diferentes num nó só", () => {
    const postgres = topology.nodes.find((node) => node.label === "PostgreSQL")
    expect(postgres?.projects.length).toBeGreaterThan(1)
    expect(topology.nodes.filter((node) => node.label === "Spring Boot")).toHaveLength(1)
  })

  it("só liga nós que existem, sem laços nem arestas repetidas", () => {
    const keys = topology.edges.map((e) => [e.from, e.to].sort().join("|"))
    expect(new Set(keys).size).toBe(keys.length)
    for (const edge of topology.edges) {
      expect(ids.has(edge.from) && ids.has(edge.to)).toBe(true)
      expect(edge.from).not.toBe(edge.to)
      expect(edge.weight).toBeGreaterThan(0)
    }
  })

  it("ordena os nós do mais usado para o menos usado", () => {
    const counts = topology.nodes.map((node) => node.projects.length)
    expect(counts).toEqual([...counts].sort((a, b) => b - a))
  })
})

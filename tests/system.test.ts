import { describe, expect, it } from "vitest"
import { totalLatency, traceSpans } from "@/components/layout/nav-items"
import { systemEdges, systemNodes } from "@/content/system"
import { buildKnowledgeGraph, neighborsOf } from "@/lib/graph"
import { shortHash } from "@/lib/hash"
import { jsonValue, statusFor } from "@/lib/http"

describe("shortHash", () => {
  it("é determinístico e tem o tamanho pedido", () => {
    expect(shortHash("payments-api")).toBe(shortHash("payments-api"))
    expect(shortHash("payments-api")).toMatch(/^[0-9a-f]{7}$/)
    expect(shortHash("x", 16)).toHaveLength(16)
  })

  it("muda quando a entrada muda", () => {
    expect(shortHash("a")).not.toBe(shortHash("b"))
  })
})

describe("buildKnowledgeGraph", () => {
  const groups = [
    { id: "java", items: ["java", "springboot", "postgresql"] as const },
    { id: "go", items: ["go", "redis"] as const },
  ].map((g) => ({ ...g, items: [...g.items] }))
  const sources = [
    ["java", "springboot", "postgresql"],
    ["go", "redis", "postgresql"],
    ["java", "springboot"],
  ] as Parameters<typeof buildKnowledgeGraph>[1]

  const graph = buildKnowledgeGraph(groups, sources)

  it("pesa cada tecnologia pelo uso real (+1)", () => {
    const weight = Object.fromEntries(graph.nodes.map((n) => [n.id, n.weight]))
    expect(weight).toMatchObject({
      java: 3,
      springboot: 3,
      postgresql: 3,
      go: 2,
      redis: 2,
    })
  })

  it("liga tecnologias usadas juntas, contando a frequência", () => {
    const edge = graph.edges.find(
      (e) => [e.source, e.target].sort().join() === ["java", "springboot"].sort().join()
    )
    expect(edge?.weight).toBe(2)
    expect([...neighborsOf(graph.edges, "postgresql")].sort()).toEqual(
      ["go", "java", "redis", "springboot"].sort()
    )
  })

  it("posiciona todos os nós dentro da área do grafo", () => {
    for (const node of graph.nodes) {
      expect(node.x).toBeGreaterThan(0)
      expect(node.x).toBeLessThan(graph.width)
      expect(node.y).toBeGreaterThan(0)
      expect(node.y).toBeLessThan(graph.height)
    }
  })
})

describe("trace e diagrama", () => {
  it("spans começam onde o anterior termina e somam a latência total", () => {
    const last = traceSpans.at(-1)!
    expect(traceSpans[0].start).toBe(0)
    expect(last.start + last.ms).toBe(totalLatency)
  })

  it("arestas do diagrama apontam para nós existentes", () => {
    const ids = new Set(systemNodes.map((n) => n.id))
    for (const edge of systemEdges) {
      expect(ids.has(edge.from)).toBe(true)
      expect(ids.has(edge.to)).toBe(true)
    }
  })
})

describe("http", () => {
  it("mapeia desfechos do contato para status HTTP", () => {
    expect(statusFor("ok")).toEqual({ code: 201, text: "Created" })
    expect(statusFor("invalid").code).toBe(422)
    expect(statusFor("rateLimited").code).toBe(429)
    expect(statusFor("error").code).toBe(503)
  })

  it("gera literais JSON escapados e truncados", () => {
    expect(jsonValue('diz "oi"')).toBe('"diz \\"oi\\""')
    expect(jsonValue("abcdef", 3)).toBe('"abc…"')
    expect(jsonValue(undefined)).toBe('""')
  })
})

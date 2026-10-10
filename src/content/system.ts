import type { Localized } from "@/lib/types"

export interface SystemNode {
  id: string
  label: string
  /** Posição (canto superior esquerdo) no viewBox 520×400 do diagrama. */
  x: number
  y: number
  kind: "client" | "edge" | "service" | "store"
  /** O que você faz com essa peça — aparece ao passar o mouse/focar. */
  note: Localized
}

export interface SystemEdge {
  from: string
  to: string
}

// Arquitetura que aparece nos projetos e no trabalho (ver src/content/projects.ts).
export const systemNodes: SystemNode[] = [
  {
    id: "client",
    label: "client",
    x: 0,
    y: 178,
    kind: "client",
    note: {
      pt: "Você, agora. Toda requisição começa com alguém precisando de algo.",
      en: "You, right now. Every request starts with someone needing something.",
    },
  },
  {
    id: "gateway",
    label: "API gateway",
    x: 116,
    y: 178,
    kind: "edge",
    note: {
      pt: "JWT, rotas públicas × administrativas e documentação OpenAPI — o contrato começa aqui.",
      en: "JWT, public vs admin routes and OpenAPI docs — the contract starts here.",
    },
  },
  {
    id: "spring",
    label: "Spring Boot",
    x: 240,
    y: 96,
    kind: "service",
    note: {
      pt: "Onde construo a maioria das minhas APIs: byFood, Psyke, agendamento e o encurtador de URLs.",
      en: "Where I build most of my APIs: byFood, Psyke, the scheduling system and the URL shortener.",
    },
  },
  {
    id: "go",
    label: "Go",
    x: 240,
    y: 260,
    kind: "service",
    note: {
      pt: "Na DT Network, integrei APIs em Go com o WhatsApp; nos estudos, microsserviços com Gin e GORM.",
      en: "At DT Network I integrated Go APIs with WhatsApp; on my own, microservices with Gin and GORM.",
    },
  },
  {
    id: "postgres",
    label: "PostgreSQL",
    x: 420,
    y: 40,
    kind: "store",
    note: {
      pt: "Modelagem, consultas e ajustes de desempenho — no trabalho e nos meus projetos.",
      en: "Modeling, queries and performance tuning — at work and in my projects.",
    },
  },
  {
    id: "kafka",
    label: "Kafka",
    x: 420,
    y: 178,
    kind: "store",
    note: {
      pt: "Eventos de agenda no Psyke geram a evolução clínica e disparam notificações.",
      en: "Scheduling events in Psyke generate clinical notes and trigger notifications.",
    },
  },
  {
    id: "redis",
    label: "Redis",
    x: 420,
    y: 316,
    kind: "store",
    note: {
      pt: "Cache e contador de cliques em tempo real no encurtador de URLs.",
      en: "Caching and a real-time click counter in the URL shortener.",
    },
  },
]

export const systemEdges: SystemEdge[] = [
  { from: "client", to: "gateway" },
  { from: "gateway", to: "spring" },
  { from: "gateway", to: "go" },
  { from: "spring", to: "postgres" },
  { from: "spring", to: "kafka" },
  { from: "go", to: "kafka" },
  { from: "go", to: "redis" },
]

/** Tamanho dos nós no diagrama (unidades do viewBox). */
export const SYSTEM_NODE_SIZE = { width: 96, height: 44 }

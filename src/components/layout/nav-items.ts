/** Seções da home, na ordem em que aparecem (ids usados nas âncoras). */
export const navSections = [
  "about",
  "stack",
  "experience",
  "projects",
  "interfaces",
  "contact",
] as const

export type NavSection = (typeof navSections)[number]

/**
 * Cada seção é um salto da "requisição" que o visitante faz ao rolar a página.
 * `span` e `ms` alimentam o trace waterfall do hero e os cabeçalhos das seções.
 */
export const hops: Record<NavSection, { hop: string; span: string; ms: number }> = {
  about: { hop: "gateway", span: "identity.resolve()", ms: 12 },
  stack: { hop: "service", span: "knowledge.query()", ms: 38 },
  experience: { hop: "database", span: "history.load()", ms: 64 },
  projects: { hop: "workers", span: "jobs.process()", ms: 91 },
  interfaces: { hop: "edge", span: "ui.render()", ms: 27 },
  contact: { hop: "response", span: "response.write()", ms: 43 },
}

export const totalLatency = navSections.reduce((sum, id) => sum + hops[id].ms, 0)

/** Spans do trace na ordem da página, com o instante de início acumulado (ms). */
export const traceSpans = navSections.map((id, i) => ({
  id,
  ...hops[id],
  start: navSections.slice(0, i).reduce((sum, prev) => sum + hops[prev].ms, 0),
}))

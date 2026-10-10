import { describe, expect, it } from "vitest"
import { courses } from "@/content/courses"
import { experiences } from "@/content/experience"
import { projects } from "@/content/projects"
import { skillGroups } from "@/content/skills"
import { tech } from "@/content/tech"
import { contactSchema } from "@/lib/schemas"
import { formatPeriod } from "@/lib/format"

describe("conteúdo", () => {
  it("slugs de projetos são únicos e seguros para URL", () => {
    const slugs = projects.map((p) => p.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    slugs.forEach((slug) => expect(slug).toMatch(/^[a-z0-9-]+$/))
  })

  it("toda tecnologia referenciada existe no catálogo", () => {
    const used = [
      ...projects.flatMap((p) => p.tech),
      ...experiences.flatMap((e) => e.tech),
      ...skillGroups.flatMap((g) => g.items),
    ]
    used.forEach((id) => expect(tech).toHaveProperty(id))
  })

  it("datas de experiência usam o formato AAAA-MM", () => {
    experiences.forEach((e) => {
      expect(e.start).toMatch(/^\d{4}-\d{2}$/)
      if (e.end) expect(e.end).toMatch(/^\d{4}-\d{2}$/)
    })
  })

  it("trajetória está do mais recente para o mais antigo", () => {
    const starts = experiences.map((e) => e.start)
    expect(starts).toEqual([...starts].sort().reverse())
  })

  it("cursos têm data AAAA-MM e estão do mais recente para o mais antigo", () => {
    const dates = courses.map((c) => c.date)
    dates.forEach((d) => expect(d).toMatch(/^\d{4}-\d{2}$/))
    expect(dates).toEqual([...dates].sort().reverse())
  })

  it("todo projeto aponta para um repositório no GitHub", () => {
    projects.forEach((p) =>
      expect(p.repoUrl).toMatch(/^https:\/\/github\.com\/LeonardoBoni-018\//)
    )
  })
})

describe("formatPeriod", () => {
  it("formata períodos por idioma", () => {
    expect(formatPeriod("2024-01", undefined, "en", "Present")).toBe("Jan 2024 — Present")
    expect(formatPeriod("2022-03", "2023-12", "pt", "Atual")).toMatch(
      /mar.*2022 — dez.*2023/
    )
  })
})

describe("contactSchema", () => {
  const valid = {
    name: "Ana",
    email: "ana@empresa.com",
    message: "Olá, vamos conversar?",
  }

  it("aceita dados válidos", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true)
  })

  it("retorna chaves de erro traduzíveis", () => {
    const result = contactSchema.safeParse({ name: "A", email: "x", message: "curta" })
    expect(result.success).toBe(false)
    const messages = result.error!.issues.map((i) => i.message).sort()
    expect(messages).toEqual(["emailInvalid", "messageShort", "nameRequired"])
  })
})

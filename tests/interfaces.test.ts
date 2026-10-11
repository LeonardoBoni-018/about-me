import { existsSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { interfaces } from "@/content/interfaces"
import { getProject } from "@/content/projects"
import { tech } from "@/content/tech"

describe("interfaces (front-ends)", () => {
  it("slugs únicos e repositório no GitHub", () => {
    const slugs = interfaces.map((i) => i.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    interfaces.forEach((i) =>
      expect(i.repoUrl).toMatch(/^https:\/\/github\.com\/LeonardoBoni-018\//)
    )
  })

  it("toda tecnologia existe no catálogo", () => {
    interfaces.flatMap((i) => i.tech).forEach((id) => expect(tech).toHaveProperty(id))
  })

  it("apiSlug aponta para um projeto existente", () => {
    interfaces
      .filter((i) => i.apiSlug)
      .forEach((i) => expect(getProject(i.apiSlug!), i.slug).toBeDefined())
  })

  it("cada uma tem screenshots (site no ar) ou wireframe", () => {
    for (const item of interfaces) {
      if (item.demoUrl) {
        expect(item.screenshots, item.slug).toBeDefined()
        for (const path of Object.values(item.screenshots!)) {
          expect(existsSync(join(process.cwd(), "public", path)), path).toBe(true)
        }
      } else {
        expect(item.wireframe?.length, item.slug).toBeGreaterThan(0)
      }
    }
  })

  it("caixas do wireframe cabem no quadro 320×200", () => {
    for (const box of interfaces.flatMap((i) => i.wireframe ?? [])) {
      expect(box.x + box.w, box.label).toBeLessThanOrEqual(320)
      expect(box.y + box.h, box.label).toBeLessThanOrEqual(200)
    }
  })

  it("destaques e resumo nos dois idiomas, com a mesma quantidade", () => {
    for (const item of interfaces) {
      expect(item.summary.pt && item.summary.en).toBeTruthy()
      expect(item.highlights.pt.length).toBe(item.highlights.en.length)
    }
  })
})

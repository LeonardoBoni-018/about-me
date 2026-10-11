import { describe, expect, it } from "vitest"
import { courses } from "@/content/courses"
import { certificateStats, countByArea, courseAreas } from "@/lib/certificates"
import { fingerprint } from "@/lib/hash"
import type { Course } from "@/lib/types"

const sample: Course[] = [
  { title: "A", provider: "X", date: "2024-01", hours: 10, area: "backend" },
  { title: "B", provider: "X", date: "2024-02", area: "ai" },
  { title: "C", provider: "Y", date: "2024-03", hours: 5, area: "backend" },
]

describe("certificateStats", () => {
  it("conta certificados, soma horas declaradas e emissores distintos", () => {
    expect(certificateStats(sample)).toEqual({ count: 3, hours: 15, issuers: 2 })
  })
})

describe("countByArea", () => {
  it("segue a ordem do filtro e omite áreas vazias", () => {
    expect(countByArea(sample)).toEqual([
      ["backend", 2],
      ["ai", 1],
    ])
  })
})

describe("fingerprint", () => {
  it("é determinística e no formato XX:XX:…", () => {
    expect(fingerprint("Curso")).toBe(fingerprint("Curso"))
    expect(fingerprint("Curso")).toMatch(/^([0-9A-F]{2}:){7}[0-9A-F]{2}$/)
    expect(fingerprint("Curso")).not.toBe(fingerprint("Outro"))
  })
})

describe("cursos reais", () => {
  it("toda área usada está no filtro e há destaques", () => {
    courses.forEach((c) => expect(courseAreas).toContain(c.area))
    expect(courses.filter((c) => c.featured).length).toBeGreaterThanOrEqual(3)
  })
})

import type { Course, CourseArea } from "@/lib/types"

/** Ordem das áreas no filtro (da mais ligada ao meu trabalho para a menos). */
export const courseAreas: CourseArea[] = [
  "backend",
  "frontend",
  "programming",
  "data",
  "ai",
  "infra",
  "language",
]

/** Totais exibidos nos instrumentos da seção: quantidade, horas declaradas e emissores. */
export function certificateStats(list: Course[]) {
  return {
    count: list.length,
    hours: list.reduce((sum, course) => sum + (course.hours ?? 0), 0),
    issuers: new Set(list.map((course) => course.provider)).size,
  }
}

/** Quantos certificados há em cada área (só áreas com pelo menos um). */
export function countByArea(list: Course[]): [CourseArea, number][] {
  return courseAreas
    .map(
      (area) => [area, list.filter((c) => c.area === area).length] as [CourseArea, number]
    )
    .filter(([, n]) => n > 0)
}

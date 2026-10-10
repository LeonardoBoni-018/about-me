import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { projects } from "../src/content/projects"
import { gotoReady } from "./helpers"

// Auditoria automática de acessibilidade (WCAG 2.1 A/AA + boas práticas) com axe-core,
// nos dois temas. Role a página antes, para avaliar o conteúdo já revelado pelas animações.
const pages = ["/pt", "/en", ...projects.slice(0, 2).map((p) => `/pt/projects/${p.slug}`)]

for (const scheme of ["light", "dark"] as const) {
  for (const path of pages) {
    test(`sem violações de acessibilidade em ${path} (${scheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: scheme })
      await gotoReady(page, path)
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y)
          await new Promise((r) => setTimeout(r, 60))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(800)

      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "best-practice"])
        .analyze()
      const summary = violations.map(
        (v) =>
          `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`
      )
      expect(summary).toEqual([])
    })
  }
}

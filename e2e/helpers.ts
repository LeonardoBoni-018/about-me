import { expect, type Page } from "@playwright/test"

/**
 * Navega e espera a hidratação (sinal `data-hydrated` no <html>, definido pelo ThemeSync).
 * Interagir antes disso testa o HTML estático, não a aplicação — e gera testes instáveis.
 */
export async function gotoReady(page: Page, url: string) {
  await page.goto(url)
  await expect(page.locator("html")).toHaveAttribute("data-hydrated", "true")
}

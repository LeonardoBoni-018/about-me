import { expect, test } from "@playwright/test"
import { gotoReady } from "./helpers"

test("redireciona / para o idioma do navegador", async ({ page }) => {
  await gotoReady(page, "/")
  await expect(page).toHaveURL(/\/pt$/)
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR")
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Leonardo")
})

test("troca de idioma preserva a rota", async ({ page }) => {
  await gotoReady(page, "/pt/projects/byfood")
  await page.getByRole("link", { name: "en", exact: true }).click()
  await expect(page).toHaveURL(/\/en\/projects\/byfood$/)
  await expect(page.getByText("Back to projects")).toBeVisible()
})

test("segue o tema do sistema por padrão", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" })
  await gotoReady(page, "/pt")
  await expect(page.locator("html")).toHaveClass(/dark/)
})

test("alterna o tema e persiste a escolha", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" })
  await gotoReady(page, "/pt")
  const html = page.locator("html")
  await expect(html).not.toHaveClass(/dark/)
  await page.getByRole("button", { name: "Alternar tema claro/escuro" }).click()
  await expect(html).toHaveClass(/dark/)
  await page.reload()
  await expect(html).toHaveClass(/dark/)
})

test("trocar o idioma mantém o tema escolhido", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" })
  await gotoReady(page, "/pt")
  const html = page.locator("html")
  await page.getByRole("button", { name: "Alternar tema claro/escuro" }).click()
  await expect(html).toHaveClass(/dark/)
  await page.getByRole("link", { name: "en", exact: true }).click()
  await expect(page).toHaveURL(/\/en$/)
  await expect(html).toHaveClass(/dark/)
  await page.getByRole("link", { name: "pt", exact: true }).click()
  await expect(page).toHaveURL(/\/pt$/)
  await expect(html).toHaveClass(/dark/)
})

test("diagrama do hero explica o nó (foco no desktop, toque no mobile)", async ({
  page,
  isMobile,
}) => {
  await gotoReady(page, "/pt")
  const node = page.locator('[aria-label*="Spring Boot:"]')
  if (isMobile) await node.tap()
  else await node.focus()
  await expect(
    page.getByText(/Onde construo a maioria das minhas APIs/, { exact: false }).last()
  ).toBeVisible()
})

test("trace waterfall leva até a seção", async ({ page }) => {
  await gotoReady(page, "/pt")
  await page.getByRole("link", { name: /\bStack \d+ ms$/ }).click()
  await expect(page).toHaveURL(/#stack$/)
})

test("grafo de conhecimento mostra onde a tecnologia aparece", async ({
  page,
  isMobile,
}) => {
  await gotoReady(page, "/pt#stack")
  const stack = page.locator("#stack")
  if (isMobile) {
    await stack.getByRole("button", { name: "Spring Boot", exact: true }).click()
  } else {
    await stack.locator('[aria-label="Spring Boot"]').hover()
  }
  const panel = stack.locator("aside")
  await expect(panel).toContainText("Spring Boot")
  await expect(panel).toContainText("byFood")
})

test("abre o estudo de caso de um projeto", async ({ page }) => {
  await gotoReady(page, "/pt#projects")
  await page
    .locator("#projects")
    .getByRole("link", { name: "byFood", exact: true })
    .click()
  await expect(page).toHaveURL(/\/pt\/projects\/byfood$/)
  await expect(page.getByRole("heading", { level: 1 })).toContainText("byFood")
  await expect(page.getByRole("table")).toContainText("/public/menu")
})

test("console de contato monta a requisição e mostra a resposta", async ({ page }) => {
  await gotoReady(page, "/pt#contact")
  const contact = page.locator("#contact")
  const submit = contact.getByRole("button", { name: /Enviar requisição/ })

  // Validação vira uma resposta 422 com os erros por campo
  await submit.click()
  await expect(contact.getByText("Preciso do seu nome")).toHaveCount(2)
  await expect(contact.getByText("HTTP/1.1 422 Unprocessable Entity")).toBeVisible()

  // A pré-visualização acompanha a digitação
  await contact.getByLabel("Seu nome").fill("Recrutadora Teste")
  await expect(contact.getByText('"Recrutadora Teste"')).toBeVisible()

  await contact.getByLabel("Seu e-mail").fill("teste@empresa.com")
  await contact
    .getByLabel("Mensagem")
    .fill("Olá! Temos uma vaga de backend com Go e Java.")
  await submit.click()
  // Sem RESEND_API_KEY, `next dev` só registra a mensagem (201) e `next start` falha de forma
  // controlada (503); após 3 envios por IP, o rate limit responde 429.
  await expect(
    contact.getByText(/201 Created|503 Service Unavailable|429 Too Many Requests/)
  ).toBeVisible()
})

test("menu mobile navega até a seção", async ({ page, isMobile }) => {
  test.skip(!isMobile, "apenas mobile")
  await gotoReady(page, "/pt")
  await page.getByRole("button", { name: "Abrir menu" }).click()
  await page
    .getByRole("dialog")
    .getByRole("link", { name: /Projetos/ })
    .click()
  await expect(page).toHaveURL(/#projects$/)
  await expect(page.getByRole("dialog")).toBeHidden()
})

test("rota inexistente mostra 404", async ({ page }) => {
  const response = await page.goto("/pt/rota-que-nao-existe")
  expect(response?.status()).toBe(404)
  await expect(page.getByRole("heading", { name: "Essa rota não existe." })).toBeVisible()
})

for (const path of ["/pt", "/en", "/pt/projects/byfood"]) {
  test(`sem scroll horizontal em ${path}`, async ({ page }) => {
    await gotoReady(page, path)
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth)
  })
}

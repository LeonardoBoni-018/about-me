import { expect, test } from "@playwright/test"
import { projects } from "../src/content/projects"

// Verificações de HTTP puro (sem navegador): uma vez só, no projeto desktop.
test.beforeEach(({}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "rotas: só no projeto desktop")
})

const slugs = projects.map((p) => p.slug)

test("todas as páginas respondem 200 nos dois idiomas", async ({ request }) => {
  for (const locale of ["pt", "en"]) {
    for (const path of ["", ...slugs.map((s) => `/projects/${s}`)]) {
      const response = await request.get(`/${locale}${path}`)
      expect(response.status(), `/${locale}${path}`).toBe(200)
    }
  }
})

test("rotas e slugs inexistentes respondem 404 de verdade", async ({ request }) => {
  for (const path of [
    "/pt/projects/nao-existe",
    "/en/projects/nope",
    "/pt/rota-inexistente",
  ]) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(404)
  }
})

test("/ redireciona conforme cookie e Accept-Language", async ({ request }) => {
  const byHeader = await request.get("/", {
    maxRedirects: 0,
    headers: { "Accept-Language": "en-US,en;q=0.9" },
  })
  expect(byHeader.status()).toBe(307)
  expect(byHeader.headers().location).toMatch(/\/en$/)

  const byCookie = await request.get("/", {
    maxRedirects: 0,
    headers: { "Accept-Language": "en-US", Cookie: "NEXT_LOCALE=pt" },
  })
  expect(byCookie.headers().location).toMatch(/\/pt$/)
})

test("sitemap lista as duas línguas de cada página, e robots aponta para ele", async ({
  request,
}) => {
  const sitemap = await (await request.get("/sitemap.xml")).text()
  const urls = sitemap.match(/<loc>/g) ?? []
  expect(urls).toHaveLength(2 + slugs.length * 2)
  expect(sitemap).toContain('hreflang="pt-BR"')

  const robots = await (await request.get("/robots.txt")).text()
  expect(robots).toMatch(/Sitemap: .*\/sitemap\.xml/)
})

test("ícones, foto e imagens de compartilhamento existem", async ({ request }) => {
  for (const [path, type] of [
    ["/favicon.ico", /image\/(x-icon|vnd\.microsoft\.icon)/],
    ["/icon.svg", /image\/svg\+xml/],
    ["/apple-icon.png", /image\/png/],
    ["/avatar.png", /image\/png/],
    ["/pt/opengraph-image", /image\/png/],
    ["/en/opengraph-image", /image\/png/],
  ] as const) {
    const response = await request.get(path)
    expect(response.status(), path).toBe(200)
    expect(response.headers()["content-type"], path).toMatch(type)
  }
})

test("cada página tem título, descrição, canonical e hreflang", async ({ request }) => {
  for (const path of ["/pt", "/en", "/pt/projects/byfood"]) {
    const html = await (await request.get(path)).text()
    expect(html, path).toMatch(/<title>[^<]+<\/title>/)
    expect(html, path).toMatch(/<meta name="description" content="[^"]+"/)
    expect(html, path).toMatch(/<link rel="canonical" href="[^"]+"/)
    expect(html, path).toMatch(/hrefLang="en"/i)
  }
})

test.describe("WhatsApp", () => {
  test("redireciona para o wa.me com mensagem no idioma, sem cache nem indexação", async ({
    request,
  }) => {
    const probe = await request.get("/api/whatsapp?lang=pt", { maxRedirects: 0 })
    test.skip(probe.status() === 404, "CONTACT_WHATSAPP não configurado neste ambiente")

    expect(probe.status()).toBe(302)
    const location = probe.headers().location
    expect(location).toMatch(/^https:\/\/wa\.me\/55\d{10,11}\?text=/)
    expect(decodeURIComponent(location)).toContain("Vi seu portfólio")
    expect(probe.headers()["x-robots-tag"]).toContain("noindex")
    expect(probe.headers()["cache-control"]).toContain("no-store")

    const en = await request.get("/api/whatsapp?lang=en", { maxRedirects: 0 })
    expect(decodeURIComponent(en.headers().location)).toContain("I saw your portfolio")
  })

  test("robots.txt bloqueia /api/", async ({ request }) => {
    const robots = await (await request.get("/robots.txt")).text()
    expect(robots).toMatch(/Disallow: \/api\//)
  })
})

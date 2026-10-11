import { expect, test, type Page } from "@playwright/test"
import { gotoReady } from "./helpers"
import { navSections } from "../src/components/layout/nav-items"
import { courses } from "../src/content/courses"
import { interfaces } from "../src/content/interfaces"
import { projects } from "../src/content/projects"

const desktopOnly = (isMobile: boolean) => test.skip(isMobile, "apenas desktop")
const mobileOnly = (isMobile: boolean) => test.skip(!isMobile, "apenas mobile")

test.describe("navegação", () => {
  test("link de pular para o conteúdo funciona pelo teclado", async ({
    page,
    isMobile,
  }) => {
    desktopOnly(isMobile)
    await gotoReady(page, "/pt")
    await page.keyboard.press("Tab")
    const skip = page.getByRole("link", { name: "Pular para o conteúdo" })
    await expect(skip).toBeFocused()
    await page.keyboard.press("Enter")
    await expect(page).toHaveURL(/#main$/)
  })

  test("cada item do menu leva à sua seção e fica marcado como atual", async ({
    page,
    isMobile,
  }) => {
    desktopOnly(isMobile)
    await gotoReady(page, "/pt")
    const nav = page.getByRole("navigation", { name: "Navegação principal" })
    for (const [label, id] of [
      ["Sobre", "about"],
      ["Stack", "stack"],
      ["Trajetória", "experience"],
      ["Projetos", "projects"],
      ["Contato", "contact"],
    ]) {
      const link = nav.getByRole("link", { name: label, exact: true })
      await link.click()
      await expect(page).toHaveURL(new RegExp(`#${id}$`))
      await expect(page.locator(`#${id}`)).toBeInViewport()
      await expect(link).toHaveAttribute("aria-current", "true")
    }
  })

  test("abrir a home direto numa âncora abaixo da fila cai no lugar certo", async ({
    page,
    isMobile,
  }) => {
    desktopOnly(isMobile)
    await gotoReady(page, "/pt#contact")
    await page.waitForTimeout(800) // dá tempo de qualquer salto de layout acontecer
    await expect(page.locator("#contact")).toBeInViewport()
  })

  test("menu da página de projeto volta para a seção da home", async ({
    page,
    isMobile,
  }) => {
    desktopOnly(isMobile)
    await gotoReady(page, "/pt/projects/byfood")
    await page
      .getByRole("navigation", { name: "Navegação principal" })
      .getByRole("link", { name: "Contato", exact: true })
      .click()
    await expect(page).toHaveURL(/\/pt#contact$/)
    await expect(page.locator("#contact")).toBeInViewport()
  })

  test("todos os spans do trace levam às seções", async ({ page }) => {
    for (const [label, id] of [
      ["Sobre", "about"],
      ["Stack", "stack"],
      ["Trajetória", "experience"],
      ["Projetos", "projects"],
      ["Contato", "contact"],
    ]) {
      await gotoReady(page, "/pt")
      await page.getByRole("link", { name: new RegExp(`\\b${label} \\d+ ms$`) }).click()
      await expect(page).toHaveURL(new RegExp(`#${id}$`))
    }
  })

  test("menu mobile lista as seções e fecha com Esc", async ({ page, isMobile }) => {
    mobileOnly(isMobile)
    await gotoReady(page, "/pt")
    await page.getByRole("button", { name: "Abrir menu" }).click()
    const dialog = page.getByRole("dialog")
    await expect(dialog.getByRole("link")).toHaveCount(navSections.length)
    await page.keyboard.press("Escape")
    await expect(dialog).toBeHidden()
  })
})

test.describe("grafo de conhecimento", () => {
  test("teclado: Enter fixa a tecnologia e as conexões navegam pelo grafo", async ({
    page,
    isMobile,
  }) => {
    desktopOnly(isMobile)
    await gotoReady(page, "/pt#stack")
    const stack = page.locator("#stack")
    const kafka = stack.locator('[aria-label="Kafka"]')
    await kafka.focus()
    await page.keyboard.press("Enter")
    await expect(kafka).toHaveAttribute("aria-pressed", "true")

    const panel = stack.locator("aside")
    await expect(panel).toContainText("Psyke Platform")
    await panel.getByRole("button", { name: "Spring Boot", exact: true }).click()
    await expect(panel.locator("p").nth(1)).toHaveText("Spring Boot")
    await expect(panel).toContainText("byFood")
  })

  test("toque: chips selecionam a tecnologia e destacam as conexões", async ({
    page,
    isMobile,
  }) => {
    mobileOnly(isMobile)
    await gotoReady(page, "/pt#stack")
    const stack = page.locator("#stack")
    const kafka = stack.getByRole("button", { name: "Kafka", exact: true }).first()
    await kafka.tap()
    await expect(kafka).toHaveAttribute("aria-pressed", "true")
    await expect(stack.locator("aside")).toContainText("Psyke Platform")
  })
})

test.describe("fila de projetos", () => {
  // Salta para perto do fim da fila e percorre o resto com a roda do mouse (eventos reais de
  // scroll, como um visitante faria) — um único salto programático pode coincidir com a
  // hidratação e não ser observado.
  async function scrollToTrackEnd(page: Page) {
    const WHEEL = 600
    // Fontes atrasadas mudam a altura do que vem antes e o navegador reancora o scroll.
    await page.evaluate(() => document.fonts.ready)
    await page.evaluate((wheel) => {
      const pinned = document.querySelector<HTMLElement>("#projects .track-pin")
      if (!pinned) throw new Error("trilho fixo não encontrado")
      const end =
        pinned.getBoundingClientRect().bottom + window.scrollY - window.innerHeight
      window.scrollTo({ top: end - wheel, behavior: "instant" })
    }, WHEEL)
    await page.mouse.move(640, 360)
    await page.mouse.wheel(0, WHEEL)
  }

  test("desktop: o scroll percorre a fila até o último job", async ({
    page,
    isMobile,
  }) => {
    desktopOnly(isMobile)
    await gotoReady(page, "/pt")
    const total = String(projects.length).padStart(2, "0")
    // Sob carga, um ajuste de layout tardio pode tirar a página do lugar: repete até chegar.
    await expect(async () => {
      await scrollToTrackEnd(page)
      await expect(page.locator("#projects")).toContainText(`${total} / ${total}`, {
        timeout: 1500,
      })
    }).toPass({ timeout: 15000 })

    const last = projects.at(-1)!
    const link = page
      .locator("#projects")
      .getByRole("link", { name: last.title, exact: true })
    await expect(link).toBeInViewport({ ratio: 0.9 })
    await link.click()
    await expect(page).toHaveURL(new RegExp(`/pt/projects/${last.slug}$`))
  })

  test("desktop: focar pelo teclado um job fora da tela traz o card para a vista", async ({
    page,
    isMobile,
  }) => {
    desktopOnly(isMobile)
    await gotoReady(page, "/pt#projects")
    await page.keyboard.press("Tab") // modo teclado: o foco seguinte conta como :focus-visible
    const last = projects.at(-1)!
    const link = page
      .locator("#projects")
      .getByRole("link", { name: last.title, exact: true })
    await link.focus()
    await expect(link).toBeInViewport({ ratio: 0.9 })
  })

  test("mobile: carrossel desliza até o último job", async ({ page, isMobile }) => {
    mobileOnly(isMobile)
    await gotoReady(page, "/pt#projects")
    const region = page.locator("#projects").getByRole("region")
    await region.evaluate((el) =>
      el.scrollTo({ left: el.scrollWidth, behavior: "instant" })
    )
    const last = projects.at(-1)!
    const link = region.getByRole("link", { name: last.title, exact: true })
    await expect(link).toBeInViewport()
    await link.tap()
    await expect(page).toHaveURL(new RegExp(`/pt/projects/${last.slug}$`))
  })

  test("com movimento reduzido, a fila vira scroll nativo", async ({
    page,
    isMobile,
  }) => {
    desktopOnly(isMobile)
    await page.emulateMedia({ reducedMotion: "reduce" })
    await gotoReady(page, "/pt#projects")
    // Sem o modo fixo, o contêiner não reserva "espaço de rolagem" extra.
    const pinHeight = await page
      .locator("#projects .track-pin")
      .evaluate((el) => el.getBoundingClientRect().height / window.innerHeight)
    expect(pinHeight).toBeLessThan(1.2)
    const region = page.locator("#projects").getByRole("region")
    const scrollable = await region.evaluate((el) => el.scrollWidth > el.clientWidth)
    expect(scrollable).toBe(true)
  })
})

test.describe("estudos de caso", () => {
  test("'Próximo job' percorre todos os projetos e volta ao primeiro", async ({
    page,
  }) => {
    await gotoReady(page, `/pt/projects/${projects[0].slug}`)
    for (let i = 1; i <= projects.length; i++) {
      const next = projects[i % projects.length]
      await page.getByRole("link", { name: /Próximo job/ }).click()
      await expect(page).toHaveURL(new RegExp(`/pt/projects/${next.slug}$`))
      await expect(page.getByRole("heading", { level: 1 })).toContainText(next.title)
    }
  })

  test("todo estudo de caso tem tabela de endpoints e link do repositório", async ({
    page,
    isMobile,
  }) => {
    desktopOnly(isMobile)
    for (const project of projects) {
      await gotoReady(page, `/en/projects/${project.slug}`)
      await expect(page.getByRole("table")).toContainText(project.endpoints[0].path)
      await expect(page.getByRole("link", { name: /See the code/ })).toHaveAttribute(
        "href",
        project.repoUrl!
      )
    }
  })

  test("'Voltar' leva à fila de projetos na home", async ({ page }) => {
    await gotoReady(page, "/pt/projects/psyke")
    await page.getByRole("link", { name: /Voltar para os projetos/ }).click()
    await expect(page).toHaveURL(/\/pt#projects$/)
    await expect(page.locator("#projects")).toBeInViewport()
  })
})

test.describe("contato", () => {
  test("pré-visualização escapa o texto como JSON válido", async ({ page }) => {
    await gotoReady(page, "/pt#contact")
    await page.getByLabel("Mensagem").fill('Olá "dev", tudo bem?')
    await expect(page.getByText('"Olá \\"dev\\", tudo bem?"')).toBeVisible()
  })

  test("honeypot preenchido responde 201 sem enviar (bots não percebem)", async ({
    page,
  }) => {
    await gotoReady(page, "/pt#contact")
    const contact = page.locator("#contact")
    await contact.getByLabel("Seu nome").fill("Robô")
    await contact.getByLabel("Seu e-mail").fill("bot@spam.com")
    await contact.getByLabel("Mensagem").fill("Mensagem automática de teste do honeypot.")
    await page.locator("#website").fill("https://spam.example", { force: true })
    await contact.getByRole("button", { name: /Enviar requisição/ }).click()
    await expect(contact.getByText("HTTP/1.1 201 Created")).toBeVisible()
  })

  test("copiar e-mail coloca o endereço na área de transferência", async ({
    page,
    context,
    isMobile,
  }) => {
    desktopOnly(isMobile)
    await context.grantPermissions(["clipboard-read", "clipboard-write"])
    await gotoReady(page, "/pt#contact")
    await page.getByRole("button", { name: "copiar" }).click()
    await expect(page.getByRole("button", { name: "E-mail copiado!" })).toBeVisible()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      "boni.leonardor@outlook.com"
    )
  })
})

test.describe("responsividade", () => {
  for (const width of [360, 768, 1024, 1280, 1536]) {
    test(`sem scroll horizontal a ${width}px`, async ({ page, isMobile }) => {
      desktopOnly(isMobile)
      await page.setViewportSize({ width, height: 900 })
      for (const path of ["/pt", "/pt/projects/psyke"]) {
        await gotoReady(page, path)
        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth - document.documentElement.clientWidth
        )
        expect(overflow, `${path} @ ${width}px`).toBeLessThanOrEqual(0)
      }
    })
  }
})

test("canais de contato: e-mail, LinkedIn e GitHub com ícone e link certo", async ({
  page,
}) => {
  await gotoReady(page, "/pt#contact")
  const contact = page.locator("#contact")
  const channels = [
    { name: /Mandar um e-mail/, href: /^mailto:/ },
    { name: /Ver perfil no LinkedIn/, href: /linkedin\.com\/in\// },
    { name: /Ver código no GitHub/, href: /github\.com\/LeonardoBoni-018/ },
  ]
  for (const { name, href } of channels) {
    const link = contact.getByRole("link", { name })
    await expect(link).toHaveAttribute("href", href)
    // O ícone fica no mesmo cartão do link, escondido de leitores de tela.
    await expect(
      link.locator("xpath=..").locator("svg[aria-hidden='true']").first()
    ).toBeVisible()
  }
  await expect(contact.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
    "target",
    "_blank"
  )
})

test.describe("WhatsApp", () => {
  test("botão mostra o número e abre o WhatsApp em nova aba", async ({ page }) => {
    await gotoReady(page, "/pt#contact")
    const link = page.getByRole("link", { name: /Conversar no WhatsApp/ })
    test.skip(
      (await link.count()) === 0,
      "CONTACT_WHATSAPP não configurado neste ambiente"
    )

    await expect(link).toHaveAttribute("href", "/api/whatsapp?lang=pt")
    await expect(link).toHaveAttribute("target", "_blank")
    await expect(link).toHaveAttribute("rel", /nofollow/)
    await expect(link).toContainText(/\+55 \(\d{2}\) \d{4,5}-\d{4}/)
  })
})

test.describe("front-ends", () => {
  test("site no ar tem screenshots e link; web apps ligam à API que consomem", async ({
    page,
  }) => {
    await gotoReady(page, "/pt#interfaces")
    const section = page.locator("#interfaces")
    await expect(section.getByRole("heading", { level: 3 })).toHaveCount(
      interfaces.length
    )

    await expect(
      section.getByRole("img", { name: /Frames by Gi no computador/ })
    ).toBeVisible()
    await expect(section.getByRole("link", { name: /Ver o site no ar/ })).toHaveAttribute(
      "href",
      "https://framesbygi.vercel.app"
    )
    // Wireframes com rótulo acessível (nomes reais dos componentes ficam no SVG).
    await expect(
      section.getByRole("img", { name: /Planta da tela principal/ })
    ).toHaveCount(interfaces.filter((i) => !i.demoUrl).length)

    await section.getByRole("link", { name: "Ver a API byFood →" }).click()
    await expect(page).toHaveURL(/\/pt\/projects\/byfood$/)
    await expect(page.getByText("A outra ponta: o front-end")).toBeVisible()
  })
})

test.describe("certificados", () => {
  test("destaques ficam válidos e o filtro por área reduz a lista", async ({ page }) => {
    await gotoReady(page, "/pt#certificates")
    const section = page.locator("#certificates")
    const featured = courses.filter((c) => c.featured)
    await expect(section.getByRole("heading", { level: 3 })).toHaveCount(featured.length)
    // A verificação termina quando os cartões entram na tela.
    await section.getByRole("heading", { level: 3 }).first().scrollIntoViewIfNeeded()
    await expect(section.locator(".verify-valid").first()).toHaveCSS("opacity", "1")

    const list = section.getByRole("list").last()
    await expect(list.getByRole("listitem")).toHaveCount(courses.length)
    const frontend = section.getByRole("button", { name: /^front-end/ })
    await frontend.click()
    await expect(frontend).toHaveAttribute("aria-pressed", "true")
    await expect(list.getByRole("listitem")).toHaveCount(
      courses.filter((c) => c.area === "frontend").length
    )
    await section.getByRole("button", { name: /^todos/ }).click()
    await expect(list.getByRole("listitem")).toHaveCount(courses.length)
  })
})

// Captura screenshots das páginas principais para verificação visual.
// Uso: node .claude/skills/testing/scripts/screenshots.mjs <baseUrl> <outDir> [filtro]
import { mkdirSync } from "node:fs"
import { createRequire } from "node:module"
import { resolve } from "node:path"

const require = createRequire(resolve(process.cwd(), "package.json"))
const { chromium } = require("playwright")

const [baseUrl = "http://localhost:3100", outDir = "screenshots", only] =
  process.argv.slice(2)
mkdirSync(outDir, { recursive: true })

const shots = [
  { name: "home-desktop-light", path: "/pt" },
  { name: "home-desktop-dark", path: "/pt", dark: true },
  { name: "home-mobile", path: "/en", width: 390, height: 844, mobile: true },
  { name: "home-hero", path: "/pt", full: false },
  { name: "project", path: "/pt/projects/byfood" },
  {
    name: "project-mobile",
    path: "/pt/projects/byfood",
    width: 390,
    height: 844,
    mobile: true,
  },
  { name: "not-found", path: "/pt/rota-inexistente", full: false },
]

const browser = await chromium.launch()
const problems = []

for (const shot of shots) {
  if (only && !shot.name.includes(only)) continue
  const context = await browser.newContext({
    viewport: { width: shot.width ?? 1440, height: shot.height ?? 900 },
    isMobile: shot.mobile ?? false,
    hasTouch: shot.mobile ?? false,
    colorScheme: shot.dark ? "dark" : "light",
    locale: "pt-BR",
  })
  const page = await context.newPage()
  page.on("console", (msg) => {
    if (["error", "warning"].includes(msg.type()))
      problems.push(`[${shot.name}] ${msg.type()}: ${msg.text()}`)
  })
  page.on("pageerror", (err) => problems.push(`[${shot.name}] pageerror: ${err.message}`))

  const response = await page.goto(baseUrl + shot.path, { waitUntil: "networkidle" })
  if (shot.full !== false) {
    // Rola devagar até o fim para disparar as animações whileInView, depois volta ao topo.
    await page.evaluate(async () => {
      const step = Math.round(window.innerHeight * 0.6)
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((r) => setTimeout(r, 250))
      }
      window.scrollTo(0, document.body.scrollHeight)
      await new Promise((r) => setTimeout(r, 600))
      window.scrollTo(0, 0)
    })
  }
  await page.waitForTimeout(1200)
  const file = resolve(outDir, `${shot.name}.png`)
  await page.screenshot({ path: file, fullPage: shot.full !== false })
  console.log(`${shot.name}: HTTP ${response?.status()} → ${file}`)
  await context.close()
}

await browser.close()
console.log(
  problems.length ? `\nConsole:\n${problems.join("\n")}` : "\nConsole: sem erros/avisos"
)

import { describe, expect, it } from "vitest"
import { resolveSiteUrl } from "@/lib/site"

describe("resolveSiteUrl", () => {
  it("prefere NEXT_PUBLIC_SITE_URL e remove a barra final", () => {
    expect(
      resolveSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://leonardo.dev/",
        VERCEL_PROJECT_PRODUCTION_URL: "about-me.vercel.app",
      })
    ).toBe("https://leonardo.dev")
  })

  it("usa o domínio de produção da Vercel quando a URL não foi configurada", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "about-me.vercel.app" })).toBe(
      "https://about-me.vercel.app"
    )
  })

  it("cai para localhost sem nenhuma variável", () => {
    expect(resolveSiteUrl({})).toBe("http://localhost:3000")
  })
})

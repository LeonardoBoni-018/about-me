import { describe, expect, it } from "vitest"
import { hasLocale, negotiateLocale, switchLocalePath } from "@/i18n/config"
import en from "@/i18n/messages/en.json"
import pt from "@/i18n/messages/pt.json"

describe("negotiateLocale", () => {
  it("usa o idioma padrão sem header", () => {
    expect(negotiateLocale(null)).toBe("pt")
  })

  it("respeita os pesos q e o idioma principal", () => {
    expect(negotiateLocale("en-US,en;q=0.9,pt-BR;q=0.8")).toBe("en")
    expect(negotiateLocale("fr-FR,pt-BR;q=0.7,en;q=0.5")).toBe("pt")
  })

  it("cai no padrão quando nada é suportado", () => {
    expect(negotiateLocale("de-DE,fr;q=0.8")).toBe("pt")
  })
})

describe("switchLocalePath", () => {
  it("troca o prefixo existente", () => {
    expect(switchLocalePath("/pt/projects/payments-api", "en")).toBe(
      "/en/projects/payments-api"
    )
    expect(switchLocalePath("/en", "pt")).toBe("/pt")
  })

  it("adiciona prefixo quando não há", () => {
    expect(switchLocalePath("/", "en")).toBe("/en")
  })
})

describe("hasLocale", () => {
  it("valida locales suportados", () => {
    expect(hasLocale("pt")).toBe(true)
    expect(hasLocale("es")).toBe(false)
    expect(hasLocale(undefined)).toBe(false)
  })
})

describe("dicionários", () => {
  const keys = (obj: object, prefix = ""): string[] =>
    Object.entries(obj).flatMap(([k, v]) =>
      v && typeof v === "object" && !Array.isArray(v)
        ? keys(v, `${prefix}${k}.`)
        : [`${prefix}${k}`]
    )

  it("pt e en têm exatamente as mesmas chaves", () => {
    expect(keys(en).sort()).toEqual(keys(pt).sort())
  })
})

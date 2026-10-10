import { describe, expect, it } from "vitest"
import { formatPhone, normalizeBrazilPhone, whatsappUrl } from "@/lib/phone"

describe("normalizeBrazilPhone", () => {
  it("aceita formatos comuns e devolve E.164 sem '+'", () => {
    for (const raw of [
      "18999990000",
      "(18) 99999-0000",
      "+55 18 99999-0000",
      "5518999990000",
    ]) {
      expect(normalizeBrazilPhone(raw)).toBe("5518999990000")
    }
  })

  it("não confunde o DDD 55 (RS) com o código do país", () => {
    expect(normalizeBrazilPhone("55999990000")).toBe("5555999990000")
  })

  it("rejeita valores vazios ou inválidos", () => {
    for (const raw of [undefined, "", "123", "abc", "1899999000000"]) {
      expect(normalizeBrazilPhone(raw)).toBeNull()
    }
  })
})

describe("formatPhone", () => {
  it("formata celular e fixo com DDD", () => {
    expect(formatPhone("5518999990000")).toBe("+55 (18) 99999-0000")
    expect(formatPhone("551833334444")).toBe("+55 (18) 3333-4444")
  })
})

describe("whatsappUrl", () => {
  it("monta o link wa.me com a mensagem codificada", () => {
    expect(whatsappUrl("5518999990000", "Olá, tudo bem?")).toBe(
      "https://wa.me/5518999990000?text=Ol%C3%A1%2C%20tudo%20bem%3F"
    )
  })
})

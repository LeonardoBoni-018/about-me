import { describe, expect, it } from "vitest"
import { createRateLimiter } from "@/lib/rate-limit"

describe("createRateLimiter", () => {
  it("bloqueia a partir da tentativa acima do máximo, por chave", () => {
    const isLimited = createRateLimiter({ windowMs: 1000, max: 3 })
    expect([1, 2, 3].map(() => isLimited("ip-a", 0))).toEqual([false, false, false])
    expect(isLimited("ip-a", 10)).toBe(true)
    expect(isLimited("ip-b", 10)).toBe(false)
  })

  it("libera de novo quando a janela passa (janela deslizante)", () => {
    const isLimited = createRateLimiter({ windowMs: 1000, max: 2 })
    isLimited("ip", 0)
    isLimited("ip", 500)
    expect(isLimited("ip", 900)).toBe(true)
    expect(isLimited("ip", 1001)).toBe(false) // a de t=0 expirou
  })

  it("descarta chaves expiradas para não crescer sem limite", () => {
    const isLimited = createRateLimiter({ windowMs: 100, max: 1, sweepAt: 2 })
    isLimited("a", 0)
    isLimited("b", 0)
    // Na próxima chamada, "a" e "b" já expiraram e são removidas; "a" volta a ser permitida.
    expect(isLimited("c", 500)).toBe(false)
    expect(isLimited("a", 500)).toBe(false)
  })
})

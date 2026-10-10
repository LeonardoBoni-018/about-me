interface RateLimitOptions {
  /** Janela de tempo, em ms. */
  windowMs: number
  /** Máximo de tentativas por chave dentro da janela. */
  max: number
  /** Quantidade de chaves a partir da qual entradas expiradas são descartadas. */
  sweepAt?: number
}

/**
 * Rate limit em memória por chave (ex.: IP), com janela deslizante. Em ambientes serverless
 * cada instância tem seu próprio estado — suficiente para um portfólio; para algo mais rígido,
 * troque por um store compartilhado (ex.: Redis).
 */
export function createRateLimiter({ windowMs, max, sweepAt = 500 }: RateLimitOptions) {
  const hits = new Map<string, number[]>()

  return function isLimited(key: string, now = Date.now()): boolean {
    // Sem limpeza, o mapa cresceria para sempre com IPs que nunca voltam.
    if (hits.size >= sweepAt) {
      for (const [k, times] of hits) {
        if (times.every((t) => now - t >= windowMs)) hits.delete(k)
      }
    }

    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
    if (recent.length >= max) {
      hits.set(key, recent)
      return true
    }
    hits.set(key, [...recent, now])
    return false
  }
}

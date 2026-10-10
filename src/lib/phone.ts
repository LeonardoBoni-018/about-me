/**
 * Normaliza um celular brasileiro para o formato internacional só com dígitos (E.164 sem "+"),
 * aceitando "18999990000", "(18) 99999-0000" ou "+55 18 99999-0000". Retorna `null` se não
 * parecer um número válido (DDD + 8 ou 9 dígitos).
 */
export function normalizeBrazilPhone(raw: string | undefined | null): string | null {
  const digits = (raw ?? "").replace(/\D/g, "")
  const national =
    digits.startsWith("55") && digits.length >= 12 ? digits.slice(2) : digits
  if (!/^\d{2}9?\d{8}$/.test(national)) return null
  return `55${national}`
}

/** Versão legível para exibição: "+55 (18) 99999-0000". */
export function formatPhone(e164: string): string {
  const national = e164.slice(2)
  const ddd = national.slice(0, 2)
  const local = national.slice(2)
  return `+55 (${ddd}) ${local.slice(0, -4)}-${local.slice(-4)}`
}

/** Link do WhatsApp (wa.me) com mensagem pré-preenchida. */
export function whatsappUrl(e164: string, text: string): string {
  return `https://wa.me/${e164}?text=${encodeURIComponent(text)}`
}

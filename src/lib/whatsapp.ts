import "server-only"
import { formatPhone, normalizeBrazilPhone } from "./phone"

/**
 * Número do WhatsApp, lido de `CONTACT_WHATSAPP` (variável de ambiente, fora do repositório).
 * `server-only` garante em tempo de build que este módulo — e o número — nunca vão para o
 * JavaScript do navegador. Retorna `null` quando não configurado (o botão some do site).
 */
export function getWhatsAppNumber(): string | null {
  const number = normalizeBrazilPhone(process.env.CONTACT_WHATSAPP)
  if (!number) warnMissingOnce()
  return number
}

let warned = false
/** Aparece no log do build (ex.: Vercel) para não descobrir só em produção que o botão sumiu. */
function warnMissingOnce() {
  if (warned || process.env.NODE_ENV !== "production") return
  warned = true
  console.warn(
    "[whatsapp] CONTACT_WHATSAPP ausente ou inválido — o botão do WhatsApp não será exibido."
  )
}

/** Número formatado para exibir na página, ou `null` se não houver número configurado. */
export function getFormattedWhatsApp(): string | null {
  const number = getWhatsAppNumber()
  return number ? formatPhone(number) : null
}

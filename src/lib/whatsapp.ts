import "server-only"
import { formatPhone, normalizeBrazilPhone } from "./phone"

/**
 * Número do WhatsApp, lido de `CONTACT_WHATSAPP` (variável de ambiente, fora do repositório).
 * `server-only` garante em tempo de build que este módulo — e o número — nunca vão para o
 * JavaScript do navegador. Retorna `null` quando não configurado (o botão some do site).
 */
export function getWhatsAppNumber(): string | null {
  return normalizeBrazilPhone(process.env.CONTACT_WHATSAPP)
}

/** Número formatado para exibir na página, ou `null` se não houver número configurado. */
export function getFormattedWhatsApp(): string | null {
  const number = getWhatsAppNumber()
  return number ? formatPhone(number) : null
}

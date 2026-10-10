"use server"

import { headers } from "next/headers"
import { defaultLocale, hasLocale } from "@/i18n/config"
import { confirmationMail, ownerMail } from "@/lib/contact-mail"
import { getMailer, getOwnerEmail } from "@/lib/mailer"
import { createRateLimiter } from "@/lib/rate-limit"
import { contactSchema } from "@/lib/schemas"
import { siteUrl } from "@/lib/site"

export type ContactResult =
  | { ok: true; confirmation: boolean }
  | { ok: false; error: "invalid" | "rateLimited" | "error" }

// 3 envios por IP a cada 10 minutos.
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 3 })
// No máximo 2 confirmações por endereço por hora, mesmo vindo de IPs diferentes: ninguém usa o
// formulário para encher a caixa de outra pessoa.
const isConfirmationLimited = createRateLimiter({ windowMs: 60 * 60 * 1000, max: 2 })

export async function sendContact(
  input: unknown,
  pageLocale?: string
): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  const { name, email, message, website } = parsed.data
  const locale = hasLocale(pageLocale) ? pageLocale : defaultLocale

  // Honeypot preenchido: provavelmente um bot. Finge sucesso e descarta.
  if (website) return { ok: true, confirmation: true }

  const requestHeaders = await headers()
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  if (isRateLimited(ip)) return { ok: false, error: "rateLimited" }

  const mailer = getMailer()
  const owner = getOwnerEmail()
  if (!mailer || !owner) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] e-mail não configurado — mensagem só registrada:", {
        name,
        email,
        message,
      })
      return { ok: true, confirmation: false }
    }
    console.error(
      "[contact] e-mail não configurado: defina SMTP_HOST/SMTP_USER/SMTP_PASS (ou RESEND_API_KEY e CONTACT_TO_EMAIL)"
    )
    return { ok: false, error: "error" }
  }

  try {
    await mailer.send(ownerMail({ name, email, message }, locale, owner))
  } catch (error) {
    console.error(`[contact] falha ao enviar a mensagem (${mailer.provider}):`, error)
    return { ok: false, error: "error" }
  }

  // A mensagem já chegou; a confirmação é cortesia — se falhar, o envio continua valendo.
  let confirmation = false
  if (!isConfirmationLimited(email.toLowerCase())) {
    try {
      await mailer.send(confirmationMail(locale, email, owner, siteUrl))
      confirmation = true
    } catch (error) {
      console.warn(`[contact] confirmação não enviada (${mailer.provider}):`, error)
    }
  }
  return { ok: true, confirmation }
}

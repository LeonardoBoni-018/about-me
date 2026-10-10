"use server"

import { headers } from "next/headers"
import { Resend } from "resend"
import { createRateLimiter } from "@/lib/rate-limit"
import { contactSchema } from "@/lib/schemas"

export type ContactResult =
  { ok: true } | { ok: false; error: "invalid" | "rateLimited" | "error" }

// 3 envios por IP a cada 10 minutos.
const isRateLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 3 })

export async function sendContact(input: unknown): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "invalid" }

  const { name, email, message, website } = parsed.data

  // Honeypot preenchido: provavelmente um bot. Finge sucesso e descarta.
  if (website) return { ok: true }

  const requestHeaders = await headers()
  const ip =
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  if (isRateLimited(ip)) return { ok: false, error: "rateLimited" }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  if (!apiKey || !to) {
    if (process.env.NODE_ENV !== "production") {
      console.info(
        "[contact] RESEND_API_KEY/CONTACT_TO_EMAIL ausentes — mensagem só registrada:",
        {
          name,
          email,
          message,
        }
      )
      return { ok: true }
    }
    console.error("[contact] RESEND_API_KEY ou CONTACT_TO_EMAIL não configurados")
    return { ok: false, error: "error" }
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from: process.env.CONTACT_FROM_EMAIL ?? "Portfolio <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: `[Portfólio] Nova mensagem de ${name}`,
    text: `Nome: ${name}\nE-mail: ${email}\n\n${message}`,
  })

  if (error) {
    console.error("[contact] Falha ao enviar e-mail:", error)
    return { ok: false, error: "error" }
  }
  return { ok: true }
}

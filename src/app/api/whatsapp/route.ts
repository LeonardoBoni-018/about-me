import { connection, NextResponse, type NextRequest } from "next/server"
import { defaultLocale, hasLocale, type Locale } from "@/i18n/config"
import en from "@/i18n/messages/en.json"
import pt from "@/i18n/messages/pt.json"
import { whatsappUrl } from "@/lib/phone"
import { createRateLimiter } from "@/lib/rate-limit"
import { getWhatsAppNumber } from "@/lib/whatsapp"

/**
 * GET /api/whatsapp?lang=pt — redireciona para o WhatsApp com uma mensagem pronta.
 *
 * O número fica só no servidor (variável de ambiente): não aparece no HTML nem no JavaScript
 * do site, onde robôs de spam costumam colher contatos. Além disso: sem cache, sem indexação
 * e com limite de requisições por IP.
 */
const isLimited = createRateLimiter({ windowMs: 10 * 60 * 1000, max: 20 })

const messages: Record<Locale, string> = {
  pt: pt.contact.whatsappMessage,
  en: en.contact.whatsappMessage,
}

const protectedHeaders = {
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow",
}

export async function GET(request: NextRequest) {
  // Sempre em tempo de requisição. Sem isso, um build sem CONTACT_WHATSAPP devolvia 404 antes
  // de tocar no request — e o Next pré-renderizava esse 404 como resposta estática.
  await connection()
  const number = getWhatsAppNumber()
  if (!number) {
    return new NextResponse("Not found", { status: 404, headers: protectedHeaders })
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  if (isLimited(ip)) {
    return new NextResponse("Too many requests", {
      status: 429,
      headers: { ...protectedHeaders, "Retry-After": "600" },
    })
  }

  const lang = request.nextUrl.searchParams.get("lang") ?? undefined
  const locale = hasLocale(lang) ? lang : defaultLocale
  const response = NextResponse.redirect(whatsappUrl(number, messages[locale]), 302)
  for (const [key, value] of Object.entries(protectedHeaders))
    response.headers.set(key, value)
  return response
}

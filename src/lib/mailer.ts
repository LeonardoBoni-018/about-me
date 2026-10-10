import "server-only"
import { createTransport } from "nodemailer"
import { Resend } from "resend"

type Env = Record<string, string | undefined>

export interface Mail {
  to: string
  subject: string
  text: string
  replyTo?: string
}

export interface Mailer {
  provider: "smtp" | "resend"
  send(mail: Mail): Promise<void>
}

/**
 * Escolhe o provedor de e-mail pelas variáveis de ambiente:
 *
 * - **SMTP** (`SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT`): ex.: Gmail com senha de app.
 *   Envia para qualquer destinatário sem precisar de domínio próprio.
 * - **Resend** (`RESEND_API_KEY`): sem domínio verificado, só entrega no e-mail da própria conta
 *   — a confirmação para o visitante falha (e é ignorada) até verificar um domínio.
 *
 * Retorna `null` quando nenhum está configurado.
 */
export function getMailer(env: Env = process.env): Mailer | null {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS } = env
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
    const port = Number(env.SMTP_PORT || 465)
    const transport = createTransport({
      host: SMTP_HOST,
      port,
      // 465 = TLS direto; 587 = STARTTLS (o nodemailer faz o upgrade sozinho).
      secure: port === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
      // Função serverless tem tempo curto: melhor falhar rápido e mostrar o 503.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    })
    // Gmail e afins só aceitam como remetente a própria conta autenticada.
    const from = `${env.CONTACT_FROM_NAME || "Leonardo Boni"} <${SMTP_USER}>`
    return {
      provider: "smtp",
      async send(mail) {
        await transport.sendMail({ from, ...mail })
      },
    }
  }

  if (env.RESEND_API_KEY) {
    const resend = new Resend(env.RESEND_API_KEY)
    const from = env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>"
    return {
      provider: "resend",
      async send(mail) {
        const { error } = await resend.emails.send({ from, ...mail })
        if (error) throw new Error(`${error.name}: ${error.message}`)
      },
    }
  }

  return null
}

/** Quem recebe as mensagens do formulário: `CONTACT_TO_EMAIL` ou, no SMTP, a própria conta. */
export function getOwnerEmail(env: Env = process.env): string | null {
  return env.CONTACT_TO_EMAIL || env.SMTP_USER || null
}

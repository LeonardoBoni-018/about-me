import type { Locale } from "@/i18n/config"
import en from "@/i18n/messages/en.json"
import pt from "@/i18n/messages/pt.json"
import type { ContactInput } from "@/lib/schemas"

const confirmation = { pt: pt.contact.confirmation, en: en.contact.confirmation }

/** E-mail que chega para o Leonardo — "Responder" vai direto para quem escreveu. */
export function ownerMail(
  { name, email, message }: Pick<ContactInput, "name" | "email" | "message">,
  locale: Locale,
  to: string
) {
  return {
    to,
    replyTo: email,
    subject: `[Portfólio] Nova mensagem de ${name}`,
    text: `Nome: ${name}\nE-mail: ${email}\nIdioma da página: ${locale}\n\n${message}`,
  }
}

/**
 * Confirmação para o visitante, no idioma da página. De propósito, não repete nada do que foi
 * digitado: assim o formulário não serve para mandar texto arbitrário a terceiros (quem digitar
 * o e-mail de outra pessoa só consegue enviar esta mensagem fixa).
 */
export function confirmationMail(
  locale: Locale,
  to: string,
  replyTo: string,
  site: string
) {
  const t = confirmation[locale]
  return {
    to,
    replyTo,
    subject: t.subject,
    text: t.body.replaceAll("{site}", site),
  }
}

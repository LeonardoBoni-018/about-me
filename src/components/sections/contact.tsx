import { MessageCircle } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { CopyEmailButton } from "@/components/shared/copy-email-button"
import { SystemSection } from "@/components/system/system-section"
import { profile } from "@/content/profile"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"
import { getFormattedWhatsApp } from "@/lib/whatsapp"
import { ContactForm } from "./contact-form"

export function Contact({
  locale,
  dict,
}: {
  locale: Locale
  dict: Dictionary["contact"]
}) {
  // O número vem de variável de ambiente (fora do repositório); o link passa por /api/whatsapp,
  // que monta a mensagem pronta no idioma da página.
  const whatsApp = getFormattedWhatsApp()

  return (
    <SystemSection id="contact" title={dict.title} description={dict.description}>
      <Reveal>
        <ContactForm locale={locale} dict={dict} />
      </Reveal>

      <Reveal className="mt-12 flex flex-col gap-4 border-t border-dashed pt-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {dict.elsewhere}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
            <a
              href={`mailto:${profile.email}`}
              className="font-display text-2xl font-semibold break-all link-underline"
            >
              {profile.email}
            </a>
            <CopyEmailButton
              email={profile.email}
              label={dict.copyEmail}
              copiedLabel={dict.copied}
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          {whatsApp && (
            <a
              href={`/api/whatsapp?lang=${locale}`}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="group inline-flex items-center gap-3 rounded-md border px-4 py-2.5 transition-colors hover:border-success focus-visible:border-success"
            >
              <MessageCircle aria-hidden="true" className="size-5 text-success" />
              <span className="font-mono text-sm">
                {dict.whatsapp}
                <span className="block text-xs text-muted-foreground">{whatsApp}</span>
                <span className="sr-only"> — {dict.whatsappHint}</span>
              </span>
              <span
                aria-hidden="true"
                className="font-mono text-sm text-muted-foreground transition-transform group-hover:translate-x-0.5"
              >
                ↗
              </span>
            </a>
          )}
          <ul className="flex gap-6 font-mono text-sm">
            <li>
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="link-underline"
              >
                LinkedIn ↗
              </a>
            </li>
            <li>
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="link-underline"
              >
                GitHub ↗
              </a>
            </li>
          </ul>
        </div>
      </Reveal>
    </SystemSection>
  )
}

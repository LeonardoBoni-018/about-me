import type { ReactNode } from "react"
import { Mail, MessageCircle } from "lucide-react"
import { Reveal } from "@/components/motion/reveal"
import { GithubIcon, LinkedinIcon } from "@/components/shared/brand-icons"
import { CopyEmailButton } from "@/components/shared/copy-email-button"
import { SystemSection } from "@/components/system/system-section"
import { profile } from "@/content/profile"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"
import { getFormattedWhatsApp } from "@/lib/whatsapp"
import { cn } from "@/lib/utils"
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

      <Reveal className="mt-12 border-t border-dashed pt-8">
        <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
          {dict.elsewhere}
        </p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          <ContactChannel
            href={`mailto:${profile.email}`}
            icon={<Mail className="size-5" />}
            label={dict.emailCta}
            value={profile.email}
            action={
              <CopyEmailButton
                email={profile.email}
                label={dict.copyEmail}
                copiedLabel={dict.copied}
              />
            }
          />
          {whatsApp && (
            <ContactChannel
              href={`/api/whatsapp?lang=${locale}`}
              icon={<MessageCircle className="size-5" />}
              iconClassName="text-success"
              label={dict.whatsapp}
              value={whatsApp}
              hint={dict.whatsappHint}
              external
              rel="nofollow noopener noreferrer"
            />
          )}
          <ContactChannel
            href={profile.socials.linkedin}
            icon={<LinkedinIcon className="size-5" />}
            label={dict.linkedinCta}
            value={`in/${handleFrom(profile.socials.linkedin)}`}
            hint={dict.newTab}
            external
          />
          <ContactChannel
            href={profile.socials.github}
            icon={<GithubIcon className="size-5" />}
            label={dict.githubCta}
            value={`@${handleFrom(profile.socials.github)}`}
            hint={dict.newTab}
            external
          />
        </ul>
      </Reveal>
    </SystemSection>
  )
}

/** Último trecho do caminho de um perfil: ".../in/fulano/" → "fulano". */
function handleFrom(url: string) {
  return new URL(url).pathname.split("/").filter(Boolean).pop() ?? url
}

interface ContactChannelProps {
  href: string
  icon: ReactNode
  iconClassName?: string
  label: string
  value: string
  /** Texto extra só para leitores de tela (ex.: "abre em uma nova aba"). */
  hint?: string
  external?: boolean
  rel?: string
  /** Controle ao lado do link (ex.: copiar e-mail). Fica fora do <a> para não aninhar interativos. */
  action?: ReactNode
}

/** Um canal de contato: o cartão inteiro é clicável (link esticado com ::after). */
function ContactChannel({
  href,
  icon,
  iconClassName,
  label,
  value,
  hint,
  external,
  rel = "noopener noreferrer",
  action,
}: ContactChannelProps) {
  return (
    <li className="group relative flex items-center gap-3 rounded-md border bg-card px-4 py-3 transition-colors hover:border-primary has-[a:focus-visible]:border-primary has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring/50">
      <span aria-hidden="true" className={cn("shrink-0 text-ink", iconClassName)}>
        {icon}
      </span>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? rel : undefined}
        className="min-w-0 flex-1 font-mono text-sm outline-none after:absolute after:inset-0 after:rounded-md"
      >
        {label}
        <span className="block text-xs [overflow-wrap:anywhere] text-muted-foreground">
          {value}
        </span>
        {hint && <span className="sr-only"> — {hint}</span>}
      </a>
      {action ? (
        <span className="relative z-10 shrink-0">{action}</span>
      ) : (
        <span
          aria-hidden="true"
          className="shrink-0 font-mono text-sm text-muted-foreground transition-transform group-hover:translate-x-0.5"
        >
          ↗
        </span>
      )}
    </li>
  )
}

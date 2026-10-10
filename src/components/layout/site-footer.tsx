import { cacheLife } from "next/cache"
import { Mail } from "lucide-react"
import { totalLatency } from "@/components/layout/nav-items"
import { GithubIcon, LinkedinIcon } from "@/components/shared/brand-icons"
import { profile } from "@/content/profile"
import type { Dictionary } from "@/i18n/dictionaries"
import { shortHash } from "@/lib/hash"

async function getCurrentYear() {
  "use cache"
  cacheLife("days")
  return new Date().getFullYear()
}

/** Rodapé como o fim da requisição: status final, latência total e conexão encerrada. */
export async function SiteFooter({ dict }: { dict: Dictionary["footer"] }) {
  const year = await getCurrentYear()
  const links = [
    { href: profile.socials.github, label: "GitHub", Icon: GithubIcon },
    { href: profile.socials.linkedin, label: "LinkedIn", Icon: LinkedinIcon },
    { href: `mailto:${profile.email}`, label: "E-mail", Icon: Mail },
  ]

  return (
    <footer className="mt-12 border-t bg-background">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <p className="font-mono text-xs text-muted-foreground">
          <span className="text-success">HTTP/1.1 200 OK</span> · trace{" "}
          {shortHash("leonardo-boni", 16)} · {totalLatency} ms · Connection: close
        </p>
        <div className="mt-6 grid gap-10 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="max-w-xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {dict.closing}
            </p>
            <p className="mt-3 text-muted-foreground">{dict.builtWith}</p>
          </div>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm sm:flex-col sm:items-end">
            {links.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <Icon
                    aria-hidden="true"
                    className="size-4 shrink-0 text-muted-foreground"
                  />
                  <span className="link-underline">{label}</span>
                </a>
              </li>
            ))}
            <li>
              <a
                href="#top"
                className="text-muted-foreground transition-colors hover:text-primary"
              >
                ↺ {dict.backToTop}
              </a>
            </li>
          </ul>
        </div>
        <p className="mt-12 font-mono text-xs text-muted-foreground">
          © {year} {profile.name}. {dict.rights}
        </p>
      </div>
    </footer>
  )
}

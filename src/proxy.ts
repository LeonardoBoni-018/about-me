import { NextResponse, type NextRequest } from "next/server"
import { projects } from "@/content/projects"
import { hasLocale, negotiateLocale } from "@/i18n/config"

const LOCALE_COOKIE = "NEXT_LOCALE"
const projectSlugs = new Set(projects.map((project) => project.slug))

/**
 * Garante que toda rota tenha prefixo de idioma: `/` → `/pt` (ou `/en`),
 * usando o último idioma escolhido (cookie) ou o `Accept-Language`.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const segment = pathname.split("/")[1]

  if (hasLocale(segment)) {
    // Slug de projeto inexistente: com a pré-renderização parcial, o notFound() da página só
    // roda depois de o layout já ter sido enviado com status 200 ("soft 404"). Reescrever para
    // uma rota sem correspondência devolve um 404 de verdade.
    const [, , section, slug] = pathname.split("/")
    if (section === "projects" && slug && !projectSlugs.has(slug)) {
      return NextResponse.rewrite(new URL(`/${segment}/__not-found`, request.url))
    }

    const response = NextResponse.next()
    if (request.cookies.get(LOCALE_COOKIE)?.value !== segment) {
      response.cookies.set(LOCALE_COOKIE, segment, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      })
    }
    return response
  }

  const saved = request.cookies.get(LOCALE_COOKIE)?.value
  const locale = hasLocale(saved)
    ? saved
    : negotiateLocale(request.headers.get("accept-language"))
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // Ignora internals do Next, rotas de API e arquivos estáticos (com extensão).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
}

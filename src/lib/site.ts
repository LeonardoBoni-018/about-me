/**
 * URL pública do site (canonical, sitemap, OG). Ordem: NEXT_PUBLIC_SITE_URL → domínio de
 * produção que a Vercel injeta no build (VERCEL_PROJECT_PRODUCTION_URL) → localhost.
 */
export function resolveSiteUrl(env: Record<string, string | undefined> = process.env) {
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL
  const url =
    env.NEXT_PUBLIC_SITE_URL || (vercel ? `https://${vercel}` : "http://localhost:3000")
  return url.replace(/\/$/, "")
}

export const siteUrl = resolveSiteUrl()

export const siteName = "Leonardo Boni"

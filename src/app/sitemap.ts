import type { MetadataRoute } from "next"
import { projects } from "@/content/projects"
import { htmlLang, locales } from "@/i18n/config"
import { siteUrl } from "@/lib/site"

function entry(path: string, priority: number): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}${path}`,
    priority,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [htmlLang[l], `${siteUrl}/${l}${path}`])
      ),
    },
  }))
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...entry("", 1),
    ...projects.flatMap((project) => entry(`/projects/${project.slug}`, 0.7)),
  ]
}

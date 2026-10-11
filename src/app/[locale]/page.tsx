import { About } from "@/components/sections/about"
import { Contact } from "@/components/sections/contact"
import { Experience } from "@/components/sections/experience"
import { Hero } from "@/components/sections/hero"
import { Interfaces } from "@/components/sections/interfaces"
import { Projects } from "@/components/sections/projects"
import { Stack } from "@/components/sections/stack"
import { RequestRail } from "@/components/system/request-rail"
import { experiences } from "@/content/experience"
import { profile } from "@/content/profile"
import { skillGroups } from "@/content/skills"
import { tech } from "@/content/tech"
import { getDictionary, getLocale } from "@/i18n/dictionaries"
import { siteUrl } from "@/lib/site"

export default async function HomePage() {
  const locale = await getLocale()
  const dict = await getDictionary()

  const current = experiences.find((e) => e.kind === "work" && !e.end)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role[locale],
    description: profile.headline[locale],
    url: `${siteUrl}/${locale}`,
    image: profile.avatarUrl ? `${siteUrl}${profile.avatarUrl}` : undefined,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Araçatuba",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    worksFor: current ? { "@type": "Organization", name: current.company } : undefined,
    alumniOf: experiences
      .filter((e) => e.kind === "education")
      .map((e) => ({ "@type": "EducationalOrganization", name: e.company })),
    email: `mailto:${profile.email}`,
    sameAs: [profile.socials.linkedin, profile.socials.github],
    knowsAbout: [...new Set(skillGroups.flatMap((group) => group.items))].map(
      (id) => tech[id]
    ),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <RequestRail locale={locale} nav={dict.nav} label={dict.a11y.rail} />
      <Hero locale={locale} dict={dict.hero} nav={dict.nav} />
      <About locale={locale} dict={dict.about} />
      <Stack locale={locale} dict={dict.stack} />
      <Experience locale={locale} dict={dict.experience} />
      <Projects locale={locale} dict={dict.projects} />
      <Interfaces locale={locale} dict={dict.interfaces} />
      <Contact locale={locale} dict={dict.contact} />
    </>
  )
}

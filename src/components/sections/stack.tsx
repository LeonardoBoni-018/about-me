import { Reveal } from "@/components/motion/reveal"
import { KnowledgeGraph } from "@/components/system/knowledge-graph"
import { SystemSection } from "@/components/system/system-section"
import { experiences } from "@/content/experience"
import { interfaces } from "@/content/interfaces"
import { projects } from "@/content/projects"
import { skillGroups } from "@/content/skills"
import { tech, type TechId } from "@/content/tech"
import type { Locale } from "@/i18n/config"
import type { Dictionary } from "@/i18n/dictionaries"
import { buildKnowledgeGraph } from "@/lib/graph"

interface StackProps {
  locale: Locale
  dict: Dictionary["stack"]
}

export function Stack({ locale, dict }: StackProps) {
  // O grafo é derivado do conteúdo real: projetos e experiências definem pesos e conexões.
  const graph = buildKnowledgeGraph(skillGroups, [
    ...projects.map((p) => p.tech),
    ...interfaces.map((i) => i.tech),
    ...experiences.map((e) => e.tech),
  ])

  const usage: Partial<Record<TechId, string[]>> = {}
  for (const project of projects) {
    for (const id of project.tech) (usage[id] ??= []).push(project.title)
  }
  for (const item of interfaces) {
    for (const id of item.tech) (usage[id] ??= []).push(item.title)
  }
  for (const job of experiences) {
    for (const id of job.tech) (usage[id] ??= []).push(job.company)
  }

  return (
    <SystemSection id="stack" title={dict.title} description={dict.description}>
      <Reveal>
        <KnowledgeGraph
          graph={graph}
          groups={skillGroups.map((g) => ({
            id: g.id,
            title: g.title[locale],
            note: g.note[locale],
          }))}
          labels={tech}
          usage={usage}
          dict={dict}
        />
      </Reveal>
    </SystemSection>
  )
}

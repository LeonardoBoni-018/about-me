import type { SkillGroup } from "@/lib/types"

// Fonte: seção "Habilidades" do currículo, competências do LinkedIn e linguagens dos repositórios.
// A primeira tecnologia de cada grupo fica no centro do agrupamento no grafo.
export const skillGroups: SkillGroup[] = [
  {
    id: "java",
    title: { pt: "Java & Spring", en: "Java & Spring" },
    items: ["java", "springboot", "springsecurity", "hibernate", "maven", "gradle"],
    note: {
      pt: "onde construo a maioria das minhas APIs",
      en: "where I build most of my APIs",
    },
  },
  {
    id: "go",
    title: { pt: "Go", en: "Go" },
    items: ["go", "gin", "gorm"],
    note: {
      pt: "do WhatsApp na DT Network aos estudos",
      en: "from WhatsApp at DT Network to side projects",
    },
  },
  {
    id: "dotnet",
    title: { pt: ".NET", en: ".NET" },
    items: ["dotnet", "csharp", "entityframework", "sqlserver"],
    note: { pt: "o dia a dia na Soft-Line", en: "my day-to-day at Soft-Line" },
  },
  {
    id: "frontend",
    title: { pt: "Front-end", en: "Front-end" },
    items: [
      "react",
      "typescript",
      "tailwind",
      "zustand",
      "tanstackquery",
      "javascript",
      "reactnative",
    ],
    note: { pt: "a outra metade do full stack", en: "the other half of full stack" },
  },
  {
    id: "integration",
    title: { pt: "APIs, integrações & automação", en: "APIs, integrations & automation" },
    items: ["openapi", "jwt", "nodejs", "n8n", "whatsapp", "selenium", "python"],
    note: { pt: "fazer sistemas conversarem", en: "getting systems to talk" },
  },
  {
    id: "data",
    title: { pt: "Dados & mensageria", en: "Data & messaging" },
    items: ["postgresql", "mysql", "redis", "flyway", "kafka"],
    note: {
      pt: "modelagem, consultas e eventos que não se perdem",
      en: "modeling, queries and events that don't get lost",
    },
  },
  {
    id: "infra",
    title: { pt: "Cloud, DevOps & testes", en: "Cloud, DevOps & testing" },
    items: ["docker", "githubactions", "azure", "git", "testcontainers"],
    note: { pt: "do commit ao container", en: "from commit to container" },
  },
]

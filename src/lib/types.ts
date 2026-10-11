import type { Locale } from "@/i18n/config"
import type { TechId } from "@/content/tech"

/** Texto (ou valor) com uma versão por idioma. */
export type Localized<T = string> = Record<Locale, T>

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export interface Profile {
  name: string
  /** Como você se apresenta no título ("Oi, eu sou …"). */
  firstName: string
  /** Iniciais usadas no lugar da foto enquanto ela não existir. */
  initials: string
  role: Localized
  /** Parágrafo curto do hero, em primeira pessoa. */
  intro: Localized
  /** Resumo neutro usado em metadados/SEO. */
  headline: Localized
  location: Localized
  /** Parágrafos da seção "Sobre". */
  bio: Localized<string[]>
  /** Frase sua, exibida como citação manuscrita na seção "Sobre". */
  quote: Localized
  /** Bloco "Agora" (estilo nownownow.com): o que você está fazendo neste momento. */
  now: {
    /** Formato "AAAA-MM". */
    updated: string
    items: Localized<{ label: string; text: string }[]>
  }
  email: string
  /** Caminho em /public, ex.: "/avatar.jpg". Opcional. */
  avatarUrl?: string
  /** Caminho em /public por idioma, ex.: "/cv-pt.pdf". Opcional. */
  cvUrl?: Localized
  available: boolean
  socials: {
    github: string
    linkedin: string
  }
  /** Números exibidos como odômetros na seção "Sobre" (use dados verificáveis). */
  stats: { value: number; suffix?: string; label: Localized }[]
}

export interface Experience {
  id: string
  company: string
  role: Localized
  /** Formato "AAAA-MM". */
  start: string
  /** Formato "AAAA-MM"; omita para o emprego/curso atual. */
  end?: string
  /** Trabalho ou formação — muda o rótulo do "commit" na trajetória. */
  kind: "work" | "education"
  location?: Localized
  description: Localized
  highlights: Localized<string[]>
  tech: TechId[]
}

export interface ArchitectureNode {
  label: string
  detail: Localized
}

export interface Endpoint {
  method: HttpMethod
  path: string
  description: Localized
}

export interface Project {
  slug: string
  title: string
  year: number
  summary: Localized
  /** Tecnologia principal, usada no filtro da seção de projetos. */
  language: "java" | "go" | "csharp"
  tech: TechId[]
  featured?: boolean
  problem: Localized
  solution: Localized
  /** Fluxo da arquitetura, em ordem (ex.: Client → Gateway → Service → DB). */
  architecture: ArchitectureNode[]
  endpoints: Endpoint[]
  results: Localized<string[]>
  repoUrl?: string
  demoUrl?: string
}

/** Wireframe da interface: caixas num quadro 320×200, com o nome real do componente. */
export interface WireBox {
  x: number
  y: number
  w: number
  h: number
  label: string
  /** Subdivide a caixa em uma grade de cartões (colunas × linhas). */
  grid?: [number, number]
  /** Destaque laranja: o componente que mais diz sobre a tela. */
  accent?: boolean
}

/** Projeto de front-end (site ou app) — seção "interfaces". */
export interface InterfaceProject {
  slug: string
  title: string
  year: number
  kind: "site" | "webapp"
  summary: Localized
  highlights: Localized<string[]>
  tech: TechId[]
  repoUrl: string
  /** Site no ar. Com ele, a seção mostra screenshots reais em vez do wireframe. */
  demoUrl?: string
  /** Screenshots em /public (desktop e celular), usadas quando há `demoUrl`. */
  screenshots?: { desktop: string; mobile: string }
  /** Projeto feito para um cliente de verdade. */
  client?: Localized
  /** Slug do projeto de API que esta interface consome (liga as duas pontas). */
  apiSlug?: string
  /** Rota exibida na barra do "navegador". */
  route: string
  /** Planta da tela principal, para quem não tem site no ar (nomes reais dos componentes). */
  wireframe?: WireBox[]
}

export interface SkillGroup {
  id: string
  title: Localized
  items: TechId[]
  /** Comentário pessoal curto sobre o grupo (ex.: "minha zona de conforto"). */
  note: Localized
}

export interface Course {
  title: string
  provider: string
  /** Mês de conclusão, formato "AAAA-MM". */
  date: string
  hours?: number
}

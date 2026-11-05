/**
 * Textos do protótipo de layout ("folha de especificação"). Ficam fora de messages/*.json
 * enquanto o protótipo é avaliado; se ele virar o site, migram para o dicionário.
 */
export const prototypeCopy = {
  meta: {
    title: {
      pt: "Protótipo · folha de especificação",
      en: "Prototype · spec sheet",
    },
  },
  banner: {
    pt: "Protótipo de layout. O site atual continua no ar.",
    en: "Layout prototype. The current site is still live.",
  },
  bannerLink: { pt: "Ver o site atual", en: "See the current site" },
  menu: { open: { pt: "Índice", en: "Index" }, close: { pt: "Fechar", en: "Close" } },
  nav: {
    systems: { pt: "Sistemas", en: "Systems" },
    sheets: { pt: "Em detalhe", en: "In detail" },
    screens: { pt: "Telas", en: "Screens" },
    log: { pt: "Trajetória", en: "Path" },
    contact: { pt: "Contato", en: "Contact" },
  },
  hero: {
    lead: {
      pt: "Eu escrevo o caminho que a sua requisição faz: a API, o banco, a fila e, quando precisa, a tela e o agent de IA na ponta.",
      en: "I write the path your request takes: the API, the database, the queue and, when it's needed, the screen and the AI agent at the edge.",
    },
    graphCaption: {
      pt: "Cada ponto é um componente que eu coloquei em produção ou em um repositório; cada linha, um salto que uma requisição faz. Arraste para girar.",
      en: "Each point is a component I've shipped to production or to a repository; each line, a hop a request makes. Drag to rotate.",
    },
    graphLabel: {
      pt: "Grafo 3D dos componentes dos meus projetos",
      en: "3D graph of the components in my projects",
    },
    drag: { pt: "Girar", en: "Rotate" },
    live: { pt: "sistemas no ar", en: "systems live" },
    repos: { pt: "repositórios descritos aqui", en: "repositories described here" },
  },
  marquee: {
    pt: "Tecnologias usadas nos projetos",
    en: "Technologies used in the projects",
  },
  index: {
    title: {
      pt: "Tudo o que está no ar ou no GitHub",
      en: "Everything live or on GitHub",
    },
    filters: {
      all: { pt: "Tudo", en: "All" },
      api: { pt: "APIs", en: "APIs" },
      front: { pt: "Telas", en: "Screens" },
    },
    kind: {
      api: { pt: "API", en: "API" },
      site: { pt: "Site", en: "Site" },
      webapp: { pt: "Web app", en: "Web app" },
    },
    live: { pt: "no ar", en: "live" },
    repo: { pt: "repositório", en: "repository" },
    open: { pt: "Abrir", en: "Open" },
  },
  sheets: {
    title: {
      pt: "Três sistemas, do pedido à resposta",
      en: "Three systems, from request to response",
    },
    problem: { pt: "O problema", en: "The problem" },
    solution: { pt: "Como resolvi", en: "How I solved it" },
    specs: {
      language: { pt: "Linguagem", en: "Language" },
      stack: { pt: "Stack", en: "Stack" },
      flow: { pt: "Fluxo", en: "Flow" },
      routes: { pt: "Rotas", en: "Routes" },
    },
    visit: { pt: "Abrir o sistema", en: "Open the system" },
    code: { pt: "Ver o código", en: "View the code" },
    case: { pt: "Estudo de caso", en: "Case study" },
  },
  screens: {
    title: { pt: "As telas na ponta", en: "The screens at the edge" },
    hint: {
      pt: "Capturas dos deploys de produção. Arraste ou role para o lado.",
      en: "Captures from the production deploys. Drag or scroll sideways.",
    },
    drag: { pt: "Arrastar", en: "Drag" },
  },
  log: {
    title: { pt: "Da solda de placas às APIs", en: "From soldering boards to APIs" },
    now: { pt: "atual", en: "now" },
  },
  contact: {
    title: {
      pt: "Tem um sistema para colocar de pé?",
      en: "Got a system to get on its feet?",
    },
    write: { pt: "Escrever", en: "Write" },
    copy: { pt: "Copiar e-mail", en: "Copy email" },
    copied: { pt: "Copiado", en: "Copied" },
  },
} satisfies Record<string, unknown>

import type { InterfaceProject } from "@/lib/types"

const GH = "https://github.com/LeonardoBoni-018"

// Fonte: repositórios no GitHub (READMEs, commits, package.json) e os sites no ar, out/2026.
// Só entram os fronts mais bem estruturados. Screenshots tiradas dos deploys de produção
// (homepage de cada repositório); telas com login mostram a entrada do sistema.
export const interfaces: InterfaceProject[] = [
  {
    slug: "frames-by-gi",
    title: "Frames by Gi",
    year: 2026,
    kind: "site",
    client: { pt: "cliente real · no ar", en: "real client · live" },
    summary: {
      pt: "Site da Giovana, fotógrafa e videomaker mobile: mostra o trabalho e os serviços dela e leva o cliente direto para o Instagram e o WhatsApp.",
      en: "A site for Giovana, a mobile photographer and videomaker: it shows her work and services and sends clients straight to her Instagram and WhatsApp.",
    },
    highlights: {
      pt: [
        "Galeria em carrossel com transições do Framer Motion",
        "Três páginas com React Router: início, sobre e trabalhos",
        "Identidade própria: paleta, tipografia serifada e a logo da marca",
        "Pensado primeiro para o celular, com menu recolhível",
      ],
      en: [
        "Carousel gallery with Framer Motion transitions",
        "Three pages with React Router: home, about and work",
        "Its own identity: palette, serif typography and the brand logo",
        "Mobile-first, with a collapsible menu",
      ],
    },
    tech: ["react", "typescript", "vite", "tailwind", "framermotion", "reactrouter"],
    repoUrl: `${GH}/SIte-Giovana`,
    demoUrl: "https://framesbygi.vercel.app",
    screenshots: {
      desktop: "/interfaces/frames-by-gi-desktop.jpg",
      mobile: "/interfaces/frames-by-gi-mobile.jpg",
    },
    route: "framesbygi.vercel.app",
  },
  {
    slug: "natal-entrega",
    title: "Ensaio de Natal · entrega",
    year: 2026,
    kind: "site",
    client: { pt: "cliente real · no ar", en: "real client · live" },
    summary: {
      pt: "Página de entrega dos ensaios de Natal do estúdio da Giovana e do Guilherme: o estúdio gera um link com o nome da família e a pasta do Drive, e cada cliente recebe uma página só dela para acessar as fotos.",
      en: "The delivery page for Giovana and Guilherme's Christmas photo shoots: the studio generates a link with the family's name and the Drive folder, and each client gets a page of their own to reach the photos.",
    },
    highlights: {
      pt: [
        "Sem banco nem login: nome e pasta viajam codificados no próprio link",
        "Só aceita links do Google Drive, para o gerador não virar redirecionador",
        "Luzes, neve e brilhos com Motion, aliviados depois de travar no iPhone",
        "Páginas fora do Google (noindex) e aviso quando o link chega cortado",
      ],
      en: [
        "No database or login: the name and folder travel encoded in the link itself",
        "Only accepts Google Drive links, so the generator can't become an open redirect",
        "Lights, snow and sparkles with Motion, toned down after freezing on iPhones",
        "Pages kept out of Google (noindex) and a notice when a link arrives truncated",
      ],
    },
    tech: ["react", "typescript", "vite", "tailwind", "motion"],
    repoUrl: `${GH}/leadpage-natal`,
    demoUrl: "https://leadpage-natal.vercel.app",
    screenshots: {
      desktop: "/interfaces/natal-desktop.jpg",
      mobile: "/interfaces/natal-mobile.jpg",
    },
    route: "leadpage-natal.vercel.app/f/…",
  },
  {
    slug: "byfood-site",
    title: "byFood · site",
    year: 2026,
    kind: "webapp",
    apiSlug: "byfood",
    summary: {
      pt: "O front do marketplace byFood: o cliente escolhe a loja, monta a sacola e fecha o pedido no WhatsApp; cada loja tem o próprio painel.",
      en: "The byFood marketplace front-end: customers pick a store, fill the bag and close the order on WhatsApp; every store gets its own panel.",
    },
    highlights: {
      pt: [
        "Vitrine de lojas com busca, filtro por tipo de comida e paginação",
        "Página de cada loja com cardápio por categoria e sacola presa a uma loja só",
        "Cadastro de cliente e de loja, com sessão que expira e rotas por papel",
        "Painel da loja: pedidos com atualização automática, cardápio e dados da loja",
      ],
      en: [
        "Store directory with search, a cuisine filter and pagination",
        "A page per store with the menu by category and a bag tied to a single store",
        "Customer and store sign-up, with an expiring session and role-based routes",
        "Store panel: auto-refreshing orders, menu and store settings",
      ],
    },
    tech: ["react", "typescript", "vite", "tailwind", "zustand", "reactrouter"],
    repoUrl: `${GH}/ByFood-Site`,
    demoUrl: "https://byfood-alpha.vercel.app",
    screenshots: {
      desktop: "/interfaces/byfood-desktop.jpg",
      mobile: "/interfaces/byfood-mobile.jpg",
    },
    route: "byfood-alpha.vercel.app/lojas/bistro-byfood",
  },
  {
    slug: "psyke-front",
    title: "Psyke · painel",
    year: 2026,
    kind: "webapp",
    apiSlug: "psyke",
    summary: {
      pt: "O painel da plataforma Psyke para clínicas de psicologia: cada clínica entra com o próprio ID e tem agenda, pacientes, prontuários, financeiro e relatórios — um módulo por funcionalidade.",
      en: "The Psyke platform's dashboard for psychology clinics: each clinic signs in with its own ID and gets scheduling, patients, records, billing and reports — one module per feature.",
    },
    highlights: {
      pt: [
        "Arquitetura por funcionalidade: 9 módulos, cada um com páginas, hooks e serviços próprios",
        "Agenda com FullCalendar e lista de espera",
        "Dados do servidor com TanStack Query; formulários com React Hook Form + Zod",
        "15 arquivos de teste com Vitest e Testing Library",
      ],
      en: [
        "Feature-based architecture: 9 modules, each with its own pages, hooks and services",
        "Scheduling with FullCalendar and a waiting list",
        "Server state with TanStack Query; forms with React Hook Form + Zod",
        "15 test files with Vitest and Testing Library",
      ],
    },
    tech: [
      "react",
      "typescript",
      "vite",
      "tailwind",
      "tanstackquery",
      "zustand",
      "reacthookform",
      "zod",
      "fullcalendar",
      "recharts",
      "vitest",
    ],
    repoUrl: `${GH}/Psyke-Front`,
    demoUrl: "https://psyke-front.vercel.app",
    screenshots: {
      desktop: "/interfaces/psyke-desktop.jpg",
      mobile: "/interfaces/psyke-mobile.jpg",
    },
    route: "psyke-front.vercel.app/login",
  },
  {
    slug: "agendamento-front",
    title: "Agendamento · web",
    year: 2026,
    kind: "webapp",
    apiSlug: "sistema-agendamento",
    summary: {
      pt: "A interface do sistema de agendamento: o cliente marca horário sem cadastro, entra na fila de espera ou paga antecipado, e o negócio acompanha tudo em tempo real.",
      en: "The scheduling system's interface: customers book without signing up, join the waiting list or pay upfront, and the business follows everything in real time.",
    },
    highlights: {
      pt: [
        "Notificações em tempo real via Server-Sent Events (hook useSse)",
        "Página pública de agendamento, sem exigir cadastro",
        "Fila de espera com aviso e pagamento antecipado pelo Mercado Pago",
        "Painel admin: funcionários, serviços, horários e avaliações; tema claro/escuro",
      ],
      en: [
        "Real-time notifications via Server-Sent Events (a useSse hook)",
        "Public booking page, no sign-up required",
        "Waiting list with notifications and upfront payment through Mercado Pago",
        "Admin panel: staff, services, schedules and reviews; light/dark theme",
      ],
    },
    tech: [
      "react",
      "typescript",
      "vite",
      "tailwind",
      "shadcn",
      "zustand",
      "reacthookform",
      "zod",
      "recharts",
      "sse",
    ],
    repoUrl: `${GH}/sistema-agendamento-front-end`,
    demoUrl: "https://sistema-agendamento-front-end.vercel.app",
    screenshots: {
      desktop: "/interfaces/agendamento-desktop.jpg",
      mobile: "/interfaces/agendamento-mobile.jpg",
    },
    route: "sistema-agendamento-front-end.vercel.app/login",
  },
]

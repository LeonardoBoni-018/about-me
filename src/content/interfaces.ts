import type { InterfaceProject } from "@/lib/types"

const GH = "https://github.com/LeonardoBoni-018"

// Fonte: repositórios no GitHub (READMEs, package.json e estrutura de pastas), out/2026.
// Só entram os fronts mais bem estruturados; os nomes no wireframe são componentes reais.
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
    slug: "byfood-site",
    title: "byFood · site",
    year: 2026,
    kind: "webapp",
    apiSlug: "byfood",
    summary: {
      pt: "O site do restaurante que consome a API byFood: cardápio com carrinho, acompanhamento do pedido e um painel para a equipe.",
      en: "The restaurant site that consumes the byFood API: a menu with a cart, order tracking and a panel for the staff.",
    },
    highlights: {
      pt: [
        "Carrinho lateral no desktop e flutuante no celular",
        "Acompanhamento do pedido quase em tempo real (consulta a cada 5 s)",
        "Painel admin com login JWT: métricas, cardápio e status dos pedidos",
        "Estado global com Zustand e tema claro/escuro que segue o sistema",
      ],
      en: [
        "Side cart on desktop, floating cart on mobile",
        "Near real-time order tracking (polls every 5 s)",
        "Admin panel with JWT login: stats, menu and order status",
        "Global state with Zustand and a light/dark theme that follows the system",
      ],
    },
    tech: ["react", "typescript", "vite", "tailwind", "zustand", "reactrouter"],
    repoUrl: `${GH}/ByFood-Site`,
    route: "localhost:3000/",
    wireframe: [
      { x: 0, y: 0, w: 320, h: 22, label: "TopBar" },
      { x: 12, y: 32, w: 208, h: 16, label: "CategoryTabs" },
      { x: 12, y: 56, w: 208, h: 132, label: "FoodGrid", grid: [3, 2] },
      { x: 230, y: 32, w: 78, h: 156, label: "CartSidebar", accent: true },
    ],
  },
  {
    slug: "psyke-front",
    title: "Psyke · painel",
    year: 2026,
    kind: "webapp",
    apiSlug: "psyke",
    summary: {
      pt: "O painel da plataforma Psyke para clínicas de psicologia: agenda, pacientes, prontuários, financeiro e relatórios — um módulo por funcionalidade.",
      en: "The Psyke platform's dashboard for psychology clinics: scheduling, patients, records, billing and reports — one module per feature.",
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
    route: "localhost:5173/agenda",
    wireframe: [
      { x: 0, y: 0, w: 62, h: 200, label: "Sidebar" },
      { x: 62, y: 0, w: 258, h: 22, label: "Header" },
      { x: 74, y: 32, w: 234, h: 28, label: "StatCard", grid: [4, 1] },
      { x: 74, y: 70, w: 234, h: 118, label: "CalendarView", grid: [7, 4], accent: true },
    ],
  },
  {
    slug: "agendamento-front",
    title: "Agendamento · web",
    year: 2026,
    kind: "webapp",
    apiSlug: "sistema-agendamento",
    summary: {
      pt: "A interface do sistema de agendamento: o cliente marca horário sem cadastro e o estabelecimento acompanha tudo em tempo real.",
      en: "The scheduling system's interface: customers book without signing up and the business follows everything in real time.",
    },
    highlights: {
      pt: [
        "Notificações em tempo real via Server-Sent Events (hook useSse)",
        "Página pública de agendamento, sem exigir cadastro",
        "Painel admin: funcionários, serviços, horários, fila de espera e avaliações",
        "Componentes shadcn/ui, formulários com React Hook Form + Zod e tema claro/escuro",
      ],
      en: [
        "Real-time notifications via Server-Sent Events (a useSse hook)",
        "Public booking page, no sign-up required",
        "Admin panel: staff, services, schedules, waiting list and reviews",
        "shadcn/ui components, React Hook Form + Zod forms and a light/dark theme",
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
    route: "localhost:5173/dashboard",
    wireframe: [
      { x: 0, y: 0, w: 62, h: 200, label: "Sidebar" },
      { x: 62, y: 0, w: 178, h: 22, label: "Header" },
      { x: 240, y: 0, w: 80, h: 22, label: "NotificationBell", accent: true },
      { x: 74, y: 32, w: 140, h: 72, label: "DashboardPage" },
      { x: 224, y: 32, w: 84, h: 72, label: "FilaEsperaCard" },
      { x: 74, y: 114, w: 234, h: 74, label: "AppointmentsPage", grid: [1, 4] },
    ],
  },
]

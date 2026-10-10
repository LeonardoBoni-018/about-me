import type { Project } from "@/lib/types"

const GH = "https://github.com/LeonardoBoni-018"

// Fonte: repositórios públicos no GitHub (READMEs, go.mod, rotas), out/2026.
// Os "resultados" descrevem o que cada projeto implementa — sem métricas inventadas.
export const projects: Project[] = [
  {
    slug: "byfood",
    title: "byFood",
    year: 2026,
    language: "java",
    featured: true,
    tech: [
      "java",
      "springboot",
      "springsecurity",
      "jwt",
      "postgresql",
      "flyway",
      "testcontainers",
      "openapi",
      "docker",
      "react",
      "typescript",
    ],
    summary: {
      pt: "Sistema de restaurante estilo iFood: API em Spring Boot 4 para cardápio e pedidos, com área admin protegida e site em React.",
      en: "An iFood-style restaurant system: a Spring Boot 4 API for menu and orders, with a protected admin area and a React site.",
    },
    problem: {
      pt: "Um restaurante precisa publicar o cardápio, receber pedidos sem exigir cadastro do cliente e dar à equipe uma área segura para gerenciar itens e o status de cada pedido.",
      en: "A restaurant needs to publish its menu, take orders without forcing customers to sign up, and give staff a secure area to manage items and each order's status.",
    },
    solution: {
      pt: "API dividida em rotas públicas e administrativas, com autenticação JWT via Spring Security. O schema é versionado com Flyway, a documentação sai automaticamente no Swagger e os testes de integração sobem um PostgreSQL real com Testcontainers.",
      en: "An API split into public and admin routes, with JWT auth via Spring Security. The schema is versioned with Flyway, docs are generated automatically in Swagger, and integration tests spin up a real PostgreSQL with Testcontainers.",
    },
    architecture: [
      {
        label: "Site (React)",
        detail: { pt: "Cardápio e pedidos", en: "Menu and orders" },
      },
      {
        label: "Spring Boot 4",
        detail: { pt: "Rotas públicas + admin JWT", en: "Public routes + JWT admin" },
      },
      {
        label: "PostgreSQL 16",
        detail: { pt: "Schema via Flyway", en: "Schema via Flyway" },
      },
      {
        label: "WhatsApp",
        detail: { pt: "Confirmação do pedido", en: "Order confirmation" },
      },
    ],
    endpoints: [
      {
        method: "GET",
        path: "/public/menu",
        description: { pt: "Cardápio paginado", en: "Paginated menu" },
      },
      {
        method: "POST",
        path: "/public/orders",
        description: { pt: "Cria um pedido", en: "Creates an order" },
      },
      {
        method: "POST",
        path: "/auth/login",
        description: { pt: "Login admin (JWT)", en: "Admin login (JWT)" },
      },
      {
        method: "PUT",
        path: "/admin/orders/{id}/status",
        description: {
          pt: "Atualiza o status do pedido",
          en: "Updates the order status",
        },
      },
      {
        method: "DELETE",
        path: "/admin/menu/{id}",
        description: { pt: "Soft-delete de item", en: "Soft-deletes an item" },
      },
    ],
    results: {
      pt: [
        "11 endpoints entre área pública e admin",
        "5 migrações Flyway versionando o banco",
        "Testes de integração com Testcontainers",
      ],
      en: [
        "11 endpoints across public and admin areas",
        "5 Flyway migrations versioning the database",
        "Integration tests with Testcontainers",
      ],
    },
    repoUrl: `${GH}/byFood-API`,
  },
  {
    slug: "psyke",
    title: "Psyke Platform",
    year: 2026,
    language: "java",
    featured: true,
    tech: [
      "java",
      "springboot",
      "hibernate",
      "postgresql",
      "flyway",
      "kafka",
      "springsecurity",
      "jwt",
      "twilio",
      "openai",
      "docker",
    ],
    summary: {
      pt: "Plataforma multi-tenant para clínicas de psicologia: agenda, prontuário, receitas, faturas, notificações e portal do paciente.",
      en: "A multi-tenant platform for psychology clinics: scheduling, records, prescriptions, invoices, notifications and a patient portal.",
    },
    problem: {
      pt: "Cada clínica precisa de dados isolados das outras, mas todas compartilham a mesma aplicação — e o dia a dia envolve agenda, documentos, cobrança e comunicação com pacientes.",
      en: "Each clinic needs its data isolated from the others while sharing the same application — and daily work spans scheduling, documents, billing and patient communication.",
    },
    solution: {
      pt: "Multi-tenancy com um schema por clínica: um DataSource roteia cada requisição pelo tenant que vem no JWT. Eventos de agendamento passam pelo Kafka para gerar a evolução clínica e disparar SMS (Twilio) e e-mail; documentos saem em PDF.",
      en: "Schema-per-tenant multi-tenancy: a routing DataSource picks the tenant carried in the JWT. Scheduling events flow through Kafka to generate clinical notes and trigger SMS (Twilio) and email; documents are exported as PDF.",
    },
    architecture: [
      {
        label: "Cliente",
        detail: { pt: "Clínica e paciente", en: "Clinic and patient" },
      },
      {
        label: "Spring Boot",
        detail: { pt: "JWT com tenant_id", en: "JWT carrying tenant_id" },
      },
      {
        label: "PostgreSQL",
        detail: { pt: "Um schema por clínica", en: "One schema per clinic" },
      },
      { label: "Kafka", detail: { pt: "Eventos de agenda", en: "Scheduling events" } },
      { label: "Notificações", detail: { pt: "SMS + e-mail", en: "SMS + email" } },
    ],
    endpoints: [
      {
        method: "POST",
        path: "/auth/login",
        description: {
          pt: "Login com tenant no token",
          en: "Login with tenant in the token",
        },
      },
      {
        method: "GET",
        path: "/portal/appointments",
        description: {
          pt: "Agenda no portal do paciente",
          en: "Appointments in the patient portal",
        },
      },
      {
        method: "GET",
        path: "/export/pdf/invoices/{id}",
        description: { pt: "Fatura em PDF", en: "Invoice as PDF" },
      },
    ],
    results: {
      pt: [
        "Isolamento de dados com schema por clínica",
        "Evolução clínica gerada por eventos no Kafka",
        "Exportação de PDFs e relatórios em CSV",
      ],
      en: [
        "Data isolation with one schema per clinic",
        "Clinical notes generated from Kafka events",
        "PDF exports and CSV reports",
      ],
    },
    repoUrl: `${GH}/Psyke`,
  },
  {
    slug: "url-shortener",
    title: "URL Shortener",
    year: 2026,
    language: "java",
    tech: [
      "java",
      "springboot",
      "redis",
      "postgresql",
      "flyway",
      "openapi",
      "docker",
      "gradle",
    ],
    summary: {
      pt: "Encurtador de URLs com Spring Boot, Redis e PostgreSQL: links com expiração e contagem de cliques em tempo real.",
      en: "A URL shortener with Spring Boot, Redis and PostgreSQL: expiring links and real-time click counting.",
    },
    problem: {
      pt: "Redirecionar rápido e contar acessos sem transformar cada clique numa escrita no banco relacional.",
      en: "Redirect fast and count visits without turning every click into a write on the relational database.",
    },
    solution: {
      pt: "Códigos aleatórios de 7 caracteres persistidos no PostgreSQL, com cache e contador de cliques no Redis. Links expiram por prazo configurável e erros seguem um handler global padronizado.",
      en: "Random 7-character codes stored in PostgreSQL, with caching and click counting in Redis. Links expire after a configurable period and errors go through a standardized global handler.",
    },
    architecture: [
      { label: "Cliente", detail: { pt: "Navegador / API", en: "Browser / API" } },
      { label: "Spring Boot", detail: { pt: "Redirect 302", en: "302 redirect" } },
      { label: "Redis", detail: { pt: "Cache + cliques", en: "Cache + clicks" } },
      { label: "PostgreSQL", detail: { pt: "Links (Flyway)", en: "Links (Flyway)" } },
    ],
    endpoints: [
      {
        method: "POST",
        path: "/api/urls",
        description: { pt: "Cria um link curto", en: "Creates a short link" },
      },
      {
        method: "GET",
        path: "/{shortCode}",
        description: {
          pt: "Redireciona para a URL original",
          en: "Redirects to the original URL",
        },
      },
      {
        method: "GET",
        path: "/api/urls/{shortCode}/stats",
        description: { pt: "Estatísticas do link", en: "Link statistics" },
      },
      {
        method: "DELETE",
        path: "/api/urls/{shortCode}",
        description: { pt: "Remove um link", en: "Deletes a link" },
      },
    ],
    results: {
      pt: [
        "Contador de cliques em tempo real no Redis",
        "Expiração automática de links",
        "Documentação Swagger gerada automaticamente",
      ],
      en: [
        "Real-time click counter in Redis",
        "Automatic link expiration",
        "Auto-generated Swagger docs",
      ],
    },
    repoUrl: `${GH}/url-shortener`,
  },
  {
    slug: "sistema-agendamento",
    title: "Sistema de Agendamento",
    year: 2026,
    language: "java",
    tech: [
      "java",
      "springboot",
      "springsecurity",
      "jwt",
      "mysql",
      "hibernate",
      "openapi",
      "react",
      "typescript",
    ],
    summary: {
      pt: "API REST para agendamentos em estabelecimentos: agendamento público, notificações em tempo real e lembretes por e-mail.",
      en: "A REST API for business appointments: public booking, real-time notifications and email reminders.",
    },
    problem: {
      pt: "Clientes querem marcar horário sem criar conta, e o estabelecimento precisa controlar profissionais, serviços, bloqueios de agenda e lembretes.",
      en: "Customers want to book without creating an account, while the business needs to manage staff, services, schedule blocks and reminders.",
    },
    solution: {
      pt: "JWT com refresh token e blacklist, papéis USER/ADMIN, agendamento público sem cadastro, eventos via Server-Sent Events, um scheduler que envia lembretes por e-mail e checkout de pagamento com webhook.",
      en: "JWT with refresh tokens and a blacklist, USER/ADMIN roles, public booking with no sign-up, Server-Sent Events, a scheduler that sends email reminders and payment checkout with a webhook.",
    },
    architecture: [
      {
        label: "Front (React)",
        detail: { pt: "Cliente e painel", en: "Customer and dashboard" },
      },
      { label: "Spring Boot 4", detail: { pt: "JWT + papéis", en: "JWT + roles" } },
      { label: "MySQL 8", detail: { pt: "JPA / Hibernate", en: "JPA / Hibernate" } },
      {
        label: "SSE + e-mail",
        detail: { pt: "Avisos e lembretes", en: "Alerts and reminders" },
      },
    ],
    endpoints: [
      {
        method: "POST",
        path: "/v1/publico/comercio/{comercioId}/agendar",
        description: {
          pt: "Agendamento público, sem cadastro",
          en: "Public booking, no sign-up",
        },
      },
      {
        method: "PUT",
        path: "/v1/appointment/reagendar/{appointmentId}",
        description: { pt: "Reagenda um horário", en: "Reschedules an appointment" },
      },
      {
        method: "GET",
        path: "/v1/events/stream",
        description: { pt: "Eventos em tempo real (SSE)", en: "Real-time events (SSE)" },
      },
      {
        method: "POST",
        path: "/v1/pagamento/webhook",
        description: { pt: "Webhook de pagamento", en: "Payment webhook" },
      },
      {
        method: "POST",
        path: "/v1/auth/refresh",
        description: { pt: "Renova o token de acesso", en: "Refreshes the access token" },
      },
    ],
    results: {
      pt: [
        "Agendamento sem cadastro para o cliente",
        "Notificações em tempo real com SSE",
        "Fila de espera, avaliações e checkout com webhook",
      ],
      en: [
        "Booking with no customer sign-up",
        "Real-time notifications with SSE",
        "Waiting list, reviews and checkout with webhook",
      ],
    },
    repoUrl: `${GH}/sistema-agendamento-spring-boot`,
  },
  {
    slug: "go-categories-microservice",
    title: "Go Categories Microservice",
    year: 2026,
    language: "go",
    tech: ["go", "gin", "gorm", "mysql"],
    summary: {
      pt: "Microsserviço em Go com Gin e GORM, organizado em entidades, casos de uso e repositórios intercambiáveis.",
      en: "A Go microservice with Gin and GORM, organized into entities, use cases and swappable repositories.",
    },
    problem: {
      pt: "Praticar uma arquitetura em Go em que a regra de negócio não dependa do banco nem do framework HTTP.",
      en: "Practice a Go architecture where business rules depend on neither the database nor the HTTP framework.",
    },
    solution: {
      pt: "Casos de uso dependem de interfaces de repositório, com duas implementações: em memória (para testes e desenvolvimento) e GORM com MySQL. O Gin fica só na borda, nos controllers.",
      en: "Use cases depend on repository interfaces with two implementations: in-memory (for tests and development) and GORM with MySQL. Gin lives only at the edge, in the controllers.",
    },
    architecture: [
      {
        label: "Gin",
        detail: { pt: "Rotas e controllers", en: "Routes and controllers" },
      },
      { label: "Use cases", detail: { pt: "Regra de negócio", en: "Business rules" } },
      { label: "Repositórios", detail: { pt: "Interface", en: "Interface" } },
      {
        label: "GORM / memória",
        detail: { pt: "MySQL ou in-memory", en: "MySQL or in-memory" },
      },
    ],
    endpoints: [
      {
        method: "POST",
        path: "/categories",
        description: { pt: "Cria uma categoria", en: "Creates a category" },
      },
      {
        method: "GET",
        path: "/categories",
        description: { pt: "Lista categorias", en: "Lists categories" },
      },
      {
        method: "POST",
        path: "/users",
        description: { pt: "Cria um usuário", en: "Creates a user" },
      },
    ],
    results: {
      pt: [
        "Regra de negócio isolada do framework",
        "Troca de persistência sem mudar os casos de uso",
      ],
      en: [
        "Business rules isolated from the framework",
        "Persistence swaps without touching use cases",
      ],
    },
    repoUrl: `${GH}/GO-CATEGORIES-MICROSERVICE`,
  },
  {
    slug: "rest-api-go",
    title: "REST API em Go",
    year: 2026,
    language: "go",
    tech: ["go", "gin", "postgresql", "jwt", "docker"],
    summary: {
      pt: "API de produtos em Go com Gin, PostgreSQL e rotas protegidas por JWT, empacotada com Docker Compose.",
      en: "A products API in Go with Gin, PostgreSQL and JWT-protected routes, packaged with Docker Compose.",
    },
    problem: {
      pt: "Separar leitura pública de alterações restritas numa API simples, fácil de subir em qualquer máquina.",
      en: "Separate public reads from restricted writes in a simple API that runs anywhere.",
    },
    solution: {
      pt: "Camadas controller → use case → repository, middleware JWT protegendo PUT e DELETE e o app + PostgreSQL orquestrados no Docker Compose.",
      en: "Controller → use case → repository layers, a JWT middleware guarding PUT and DELETE, and the app + PostgreSQL orchestrated with Docker Compose.",
    },
    architecture: [
      {
        label: "Gin",
        detail: { pt: "Rotas + middleware JWT", en: "Routes + JWT middleware" },
      },
      {
        label: "Use cases",
        detail: { pt: "Produtos e usuários", en: "Products and users" },
      },
      {
        label: "PostgreSQL",
        detail: { pt: "Via Docker Compose", en: "Via Docker Compose" },
      },
    ],
    endpoints: [
      {
        method: "POST",
        path: "/login",
        description: {
          pt: "Autentica e gera o JWT",
          en: "Authenticates and issues a JWT",
        },
      },
      {
        method: "GET",
        path: "/products",
        description: { pt: "Lista produtos", en: "Lists products" },
      },
      {
        method: "PUT",
        path: "/product/{productId}",
        description: {
          pt: "Atualiza produto (protegida)",
          en: "Updates a product (protected)",
        },
      },
      {
        method: "DELETE",
        path: "/product/{productId}",
        description: {
          pt: "Remove produto (protegida)",
          en: "Deletes a product (protected)",
        },
      },
    ],
    results: {
      pt: [
        "Rotas de escrita protegidas por JWT",
        "Ambiente completo com um docker compose up",
      ],
      en: [
        "Write routes protected by JWT",
        "Full environment with one docker compose up",
      ],
    },
    repoUrl: `${GH}/rest-api-go`,
  },
  {
    slug: "biblioteca-api",
    title: "Biblioteca API",
    year: 2026,
    language: "csharp",
    tech: ["csharp", "dotnet", "entityframework", "sqlserver", "jwt", "openapi"],
    summary: {
      pt: "API REST de biblioteca em .NET 10 com Entity Framework Core, SQL Server e autenticação JWT.",
      en: "A library REST API in .NET 10 with Entity Framework Core, SQL Server and JWT auth.",
    },
    problem: {
      pt: "Gerenciar livros, autores, usuários e empréstimos, com operações de escrita restritas a administradores.",
      en: "Manage books, authors, users and rentals, with write operations restricted to admins.",
    },
    solution: {
      pt: "Entity Framework Core com migrations no SQL Server, senhas com BCrypt e autorização por papel via JWT Bearer.",
      en: "Entity Framework Core with SQL Server migrations, BCrypt-hashed passwords and role-based authorization via JWT Bearer.",
    },
    architecture: [
      { label: "ASP.NET", detail: { pt: "Controllers + JWT", en: "Controllers + JWT" } },
      { label: "EF Core", detail: { pt: "Migrations", en: "Migrations" } },
      {
        label: "SQL Server",
        detail: { pt: "Livros e empréstimos", en: "Books and rentals" },
      },
    ],
    endpoints: [
      {
        method: "POST",
        path: "/api/auth/login",
        description: { pt: "Login e token JWT", en: "Login and JWT token" },
      },
      {
        method: "GET",
        path: "/api/book",
        description: { pt: "Lista livros", en: "Lists books" },
      },
      {
        method: "POST",
        path: "/api/author",
        description: { pt: "Cria autor (admin)", en: "Creates an author (admin)" },
      },
    ],
    results: {
      pt: ["Autorização por papel (admin × público)", "Senhas armazenadas com BCrypt"],
      en: ["Role-based authorization (admin vs public)", "Passwords stored with BCrypt"],
    },
    repoUrl: `${GH}/Biblioteca-API`,
  },
]

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

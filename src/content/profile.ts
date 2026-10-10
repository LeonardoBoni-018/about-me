import type { Profile } from "@/lib/types"

// Fontes: currículo, perfil do LinkedIn (exportação em PDF) e GitHub (out/2026).
// Os textos da bio, a citação e o "agora" foram escritos a partir desses dados — revise com a
// sua voz (TODO).
export const profile: Profile = {
  name: "Leonardo Rodrigues Boni",
  firstName: "Leonardo",
  initials: "LB",
  role: {
    pt: "Desenvolvedor full stack",
    en: "Full stack developer",
  },
  intro: {
    pt: "Sou de Araçatuba-SP e hoje trabalho com .NET na Soft-Line. Antes, na DT Network, integrei APIs em Go com o WhatsApp, automatizei processos com n8n e cuidei de bancos PostgreSQL. Meu foco é backend: APIs REST com Java/Spring Boot e Go.",
    en: "I'm from Araçatuba, Brazil, and currently work with .NET at Soft-Line. Before that, at DT Network, I integrated Go APIs with WhatsApp, automated processes with n8n and looked after PostgreSQL databases. My focus is backend: REST APIs with Java/Spring Boot and Go.",
  },
  headline: {
    pt: "Desenvolvedor full stack em Araçatuba-SP, com foco em APIs REST com Java/Spring Boot e Go.",
    en: "Full stack developer from Araçatuba, Brazil, focused on REST APIs with Java/Spring Boot and Go.",
  },
  location: {
    pt: "Araçatuba, SP",
    en: "Araçatuba, Brazil",
  },
  bio: {
    pt: [
      "Comecei pela eletrônica. No técnico do SENAI e como jovem aprendiz na Raízen, programei CLPs e montei circuitos — meu TCC monitorava compressores com um ESP. Depois, na OzonioBras, soldei placas e montei geradores de ozônio do começo ao fim.",
      "Em 2023 comecei a estudar programação a sério: algoritmos no freeCodeCamp, JavaScript, React e Node.js. Em 2025 entrei na HastyDEV com React, TypeScript e testes automatizados com Selenium, e logo depois virei full stack na DT Network — APIs em Go integradas ao WhatsApp, workflows no n8n, PostgreSQL e um editor visual de chatbots.",
      "Hoje sou desenvolvedor full stack .NET na Soft-Line, estou no 6º período de Análise e Desenvolvimento de Sistemas e, nos meus projetos, mergulho em backend: Spring Boot, Go, Kafka, Redis e muito Docker.",
    ],
    en: [
      "I started with electronics. At SENAI's technical course and as a young apprentice at Raízen, I programmed PLCs and built circuits — my final project monitored compressors with an ESP board. Then, at OzonioBras, I soldered boards and assembled ozone generators from start to finish.",
      "In 2023 I started studying programming seriously: algorithms on freeCodeCamp, JavaScript, React and Node.js. In 2025 I joined HastyDEV working with React, TypeScript and automated tests with Selenium, and soon became a full stack developer at DT Network — Go APIs integrated with WhatsApp, n8n workflows, PostgreSQL and a visual chatbot builder.",
      "Today I'm a full stack .NET developer at Soft-Line, in the 6th semester of a Systems Analysis and Development degree, and in my own projects I dive into backend: Spring Boot, Go, Kafka, Redis and lots of Docker.",
    ],
  },
  quote: {
    pt: "Da solda de placas às APIs: continuo gostando de entender como as coisas funcionam por dentro.",
    en: "From soldering boards to APIs: I still love understanding how things work on the inside.",
  },
  now: {
    updated: "2026-10",
    items: {
      pt: [
        {
          label: "Trabalhando",
          text: "como desenvolvedor full stack .NET na Soft-Line.",
        },
        {
          label: "Construindo",
          text: "o byFood: API em Spring Boot 4 com JWT, Flyway e Testcontainers, e o site em React.",
        },
        {
          label: "Estudando",
          text: "6º período de ADS na Cruzeiro do Sul e o roadmap de Java.",
        },
      ],
      en: [
        { label: "Working", text: "as a full stack .NET developer at Soft-Line." },
        {
          label: "Building",
          text: "byFood: a Spring Boot 4 API with JWT, Flyway and Testcontainers, plus a React site.",
        },
        {
          label: "Studying",
          text: "6th semester of Systems Analysis at Cruzeiro do Sul, and the Java roadmap.",
        },
      ],
    },
  },
  email: "boni.leonardor@outlook.com",
  avatarUrl: "/avatar.png",
  cvUrl: undefined, // Adicione um PDF sem telefone/endereço em /public para habilitar o botão.
  available: true, // TODO: confirme se está aberto a novas oportunidades
  socials: {
    github: "https://github.com/LeonardoBoni-018",
    linkedin: "https://www.linkedin.com/in/leonardo-rodrigues-boni-3751432b7/",
  },
  stats: [
    {
      value: 58,
      label: { pt: "repositórios no GitHub", en: "GitHub repositories" },
    },
    {
      value: 3,
      label: { pt: "empresas como dev", en: "companies as a dev" },
    },
  ],
}

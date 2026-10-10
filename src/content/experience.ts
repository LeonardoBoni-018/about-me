import type { Experience } from "@/lib/types"

// Fonte: currículo e LinkedIn. Ordem: mais recente primeiro (o último vira a "raiz" do git log).
export const experiences: Experience[] = [
  {
    id: "soft-line",
    kind: "work",
    company: "Soft-Line Soluções em Sistemas",
    role: { pt: "Desenvolvedor Full Stack .NET", en: "Full Stack .NET Developer" },
    start: "2026-07",
    location: { pt: "Araçatuba, SP", en: "Araçatuba, Brazil" },
    description: {
      pt: "Desenvolvimento e manutenção de sistemas com C#, ASP.NET e SQL Server.",
      en: "Building and maintaining systems with C#, ASP.NET and SQL Server.",
    },
    highlights: { pt: [], en: [] },
    tech: ["csharp", "dotnet", "sqlserver"],
  },
  {
    id: "dt-network",
    kind: "work",
    company: "DT Network",
    role: { pt: "Desenvolvedor Full Stack", en: "Full Stack Developer" },
    start: "2025-03",
    end: "2026-06",
    location: { pt: "Araçatuba, SP", en: "Araçatuba, Brazil" },
    description: {
      pt: "Desenvolvimento, manutenção e evolução de sistemas web com React, TypeScript e Node.js, com foco em performance e boa experiência de uso.",
      en: "Built, maintained and evolved web systems with React, TypeScript and Node.js, focused on performance and a good user experience.",
    },
    highlights: {
      pt: [
        "Integrei APIs em Go para comunicação com o WhatsApp via QR Code, viabilizando fluxos automatizados de mensagens.",
        "Criei workflows no n8n integrando serviços e otimizando processos internos e de atendimento.",
        "Cuidei do banco PostgreSQL: consultas, modelagem e ajustes de desempenho.",
        "Desenvolvi e testei um sistema visual para criar workflows e chatbots, com coleta e análise das respostas dos usuários.",
      ],
      en: [
        "Integrated Go APIs with WhatsApp via QR Code, enabling automated messaging flows.",
        "Built n8n workflows connecting services and streamlining internal and support processes.",
        "Managed the PostgreSQL database: queries, modeling and performance tuning.",
        "Built and tested a visual workflow and chatbot builder, with collection and analysis of user responses.",
      ],
    },
    tech: ["react", "typescript", "nodejs", "go", "whatsapp", "postgresql", "n8n"],
  },
  {
    id: "hastydev",
    kind: "work",
    company: "HastyDEV",
    role: {
      pt: "Desenvolvedor Web Front-end (aprendiz)",
      en: "Front-end Web Developer (apprentice)",
    },
    start: "2025-01",
    end: "2025-02",
    location: { pt: "Araçatuba, SP", en: "Araçatuba, Brazil" },
    description: {
      pt: "Desenvolvimento de aplicações web com React e TypeScript, com foco em componentização e qualidade do código.",
      en: "Built web applications with React and TypeScript, focused on component design and code quality.",
    },
    highlights: {
      pt: [
        "Criei e executei testes automatizados de QA com Selenium para validar funcionalidades.",
        "Participei do ciclo completo com o time: implementação, testes, correções e validação.",
      ],
      en: [
        "Wrote and ran automated QA tests with Selenium to validate features.",
        "Took part in the full cycle with the team: implementation, testing, fixes and validation.",
      ],
    },
    tech: ["react", "typescript", "selenium"],
  },
  {
    id: "ozoniobras",
    kind: "work",
    company: "OzonioBras",
    role: { pt: "Auxiliar de linha de produção", en: "Production line assistant" },
    start: "2024-02",
    end: "2025-03",
    location: { pt: "Araçatuba, SP", en: "Araçatuba, Brazil" },
    description: {
      pt: "Construção e manutenção de geradores de ozônio, da preparação da matéria-prima aos testes e envio ao cliente.",
      en: "Built and maintained ozone generators, from preparing raw materials to testing and shipping to customers.",
    },
    highlights: {
      pt: [
        "Soldagem de placas eletrônicas, montagem de componentes e verificações de funcionamento.",
        "Atenção a padrões técnicos, segurança e prazos.",
      ],
      en: [
        "Soldered electronic boards, assembled components and ran functional checks.",
        "Followed technical standards, safety practices and deadlines.",
      ],
    },
    tech: [],
  },
  {
    id: "ads-cruzeiro-do-sul",
    kind: "education",
    company: "Cruzeiro do Sul Virtual",
    role: {
      pt: "Tecnólogo em Análise e Desenvolvimento de Sistemas",
      en: "Associate degree in Systems Analysis and Development",
    },
    start: "2024-02",
    end: "2026-12",
    description: {
      pt: "Graduação EAD, cursando o 6º período (conclusão prevista para dez/2026).",
      en: "Online degree, currently in the 6th semester (expected to finish in Dec 2026).",
    },
    highlights: { pt: [], en: [] },
    tech: [],
  },
  {
    id: "raizen",
    kind: "work",
    company: "Raízen",
    role: {
      pt: "Jovem aprendiz — auxiliar de escritório",
      en: "Young apprentice — office assistant",
    },
    start: "2022-08",
    end: "2023-12",
    location: { pt: "Araçatuba, SP", en: "Araçatuba, Brazil" },
    description: {
      pt: "Programa de aprendizagem junto ao curso de Eletroeletrônica do SENAI.",
      en: "Apprenticeship program alongside SENAI's Electronics course.",
    },
    highlights: {
      pt: [
        "Manuseio e programação de CLPs e dispositivos eletrônicos programáveis.",
        "Automação industrial, lógica de controle e boas práticas de segurança.",
      ],
      en: [
        "Handled and programmed PLCs and programmable electronic devices.",
        "Industrial automation, control logic and safety practices.",
      ],
    },
    tech: [],
  },
  {
    id: "senai",
    kind: "education",
    company: "SENAI São Paulo",
    role: {
      pt: "Técnico em Eletroeletrônica",
      en: "Electronics Technician",
    },
    start: "2022-01",
    end: "2023-12",
    description: {
      pt: "Curso técnico integrado. TCC: monitoramento de compressores via ESP.",
      en: "Integrated technical course. Final project: compressor monitoring with an ESP board.",
    },
    highlights: { pt: [], en: [] },
    tech: [],
  },
]

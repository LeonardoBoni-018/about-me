# about-me — Portfólio de Leonardo Rodrigues Boni

Portfólio pessoal de um engenheiro backend (Java/Spring Boot e Go), que se percorre como uma requisição atravessando um sistema: diagrama de arquitetura vivo, trace waterfall, grafo de conhecimento, `git log`, fila de jobs e um console de API no contato. Bilíngue (PT-BR/EN), tema claro/escuro (blueprint).

## Stack

- **Next.js 16** (App Router, Cache Components, Partial Prefetching) + **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (Radix) + `cn`
- Tipografia: **Bricolage Grotesque**, **IBM Plex Sans/Mono** e **Caveat** (via `next/font`)
- **Motion** (`motion/react`, carregado sob demanda via `LazyMotion`) para animações sutis
- i18n nativo com `next/root-params` (rotas `/pt` e `/en`) + `proxy.ts` para detectar o idioma
- Formulário: **React Hook Form + Zod** + Server Action + **SMTP (nodemailer)** ou **Resend**
- Testes: **Vitest + Testing Library** (unitários) e **Playwright** (E2E, desktop e mobile)

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # opcional: só é necessário para enviar e-mails
npm run dev                  # http://localhost:3000
```

Sem e-mail configurado (SMTP ou Resend), o formulário em `npm run dev` apenas registra a
mensagem no terminal.

## Scripts

| Script              | O que faz                                       |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Servidor de desenvolvimento                     |
| `npm run build`     | Build de produção                               |
| `npm start`         | Serve o build de produção                       |
| `npm run lint`      | ESLint                                          |
| `npm run typecheck` | Gera tipos de rotas e roda `tsc`                |
| `npm run format`    | Prettier (com ordenação de classes Tailwind)    |
| `npm test`          | Testes unitários (Vitest)                       |
| `npm run test:e2e`  | Testes E2E (Playwright; faz build e sobe a app) |

Na primeira execução dos E2E, instale o navegador: `npx playwright install chromium`.

## Editando o conteúdo

Todo o conteúdo pessoal fica em `src/content/` (tipado, com versões PT/EN; procure os `TODO`).
O passo a passo — textos, foto, currículo, experiências, projetos — está em
[docs/conteudo.md](docs/conteudo.md).

## Documentação

| Documento                                  | Para quê                                   |
| ------------------------------------------ | ------------------------------------------ |
| [docs/conteudo.md](docs/conteudo.md)       | editar o conteúdo do site                  |
| [docs/arquitetura.md](docs/arquitetura.md) | rotas, i18n, tema, formulário, componentes |
| [docs/adr/](docs/adr/)                     | decisões de arquitetura e design           |
| [CHANGELOG.md](CHANGELOG.md)               | histórico de mudanças                      |

## Skills para agentes (Claude Code)

O projeto traz skills em `.claude/skills/` que guiam o desenvolvimento assistido:

| Skill             | Cobre                                                                        |
| ----------------- | ---------------------------------------------------------------------------- |
| `frontend-design` | conceito, identidade blueprint, movimento com significado, anti-"cara de IA" |
| `testing`         | Vitest, Playwright e verificação visual com screenshots                      |
| `git-workflow`    | gate antes do commit, Conventional Commits em PT-BR, branches e push         |
| `documentation`   | README, `docs/`, ADRs, CHANGELOG e comentários                               |

## Estrutura

```
src/
  app/
    [locale]/            layout raiz por idioma, home, projects/[slug], not-found, OG image
    actions/contact.ts   Server Action do formulário (Zod, honeypot, rate limit, e-mail)
    global-not-found.tsx 404 para URLs fora de qualquer rota
    sitemap.ts, robots.ts, icon.svg, globals.css (tokens de tema)
  components/
    ui/                  componentes shadcn/ui
    layout/              header, menu mobile, troca de tema e idioma, footer
    sections/            hero, about, stack, experience, projects, contact
    system/              peças do conceito: trilho, diagrama, trace, grafo, fila de jobs…
    motion/              Reveal, Stagger, ScrambleText, ScrollRevealText, Odometer, Tilt
    hand/, shared/       HandNote, CopyEmailButton
  content/               conteúdo tipado (fonte única)
  i18n/                  config de idiomas, dicionários e mensagens
  lib/                   tipos, schema de contato, tema, formatação
  proxy.ts               redireciona "/" para o idioma do visitante
tests/                   Vitest
e2e/                     Playwright
docs/                    guias e ADRs
.claude/skills/          skills do projeto
```

## Deploy (Vercel)

1. Importe o repositório na Vercel.
2. Em **Settings → Environment Variables**, cadastre as variáveis do `.env.example` marcando
   o ambiente **Production** (e **Preview**, se quiser testar em PRs): `NEXT_PUBLIC_SITE_URL`,
   `CONTACT_WHATSAPP` (celular com DDD) e as do e-mail (ver `docs/conteudo.md`).
3. **Faça um novo deploy depois de salvar as variáveis** (Deployments → ⋯ → Redeploy). A Vercel
   só aplica variáveis em builds novos, e o número do WhatsApp é pré-renderizado no build: sem
   isso, o botão continua escondido.
4. Confira o log do build: se aparecer `[whatsapp] CONTACT_WHATSAPP ausente`, a variável não
   chegou ao build.

Sitemap, robots, OG images e `hreflang` são gerados automaticamente.

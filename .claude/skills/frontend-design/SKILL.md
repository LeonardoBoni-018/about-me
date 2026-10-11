---
name: frontend-design
description: Guia de design e desenvolvimento front-end deste portfólio (conceito "ciclo de vida de uma requisição", identidade blueprint, tokens, tipografia, movimento com significado, voz do texto, regras anti-"cara de IA", convenções de componentes React/Next 16). Use SEMPRE antes de criar ou alterar qualquer UI, seção, componente, estilo, animação ou texto visível do site.
---

# Front-end: blueprint de um sistema

## 1. Conceito

O site é **um sistema backend que o visitante percorre rolando a página**. Cada seção é um salto
(hop) de uma requisição, e as animações representam fluxo de dados de verdade:

| Seção          | Hop        | Span (rastreamento)  | Interação principal                                   |
| -------------- | ---------- | -------------------- | ----------------------------------------------------- |
| Hero           | `client`   | —                    | diagrama de arquitetura vivo + trace waterfall        |
| `about`        | `gateway`  | `identity.resolve()` | texto que acende com o scroll, `GET /now`             |
| `stack`        | `service`  | `knowledge.query()`  | grafo de conhecimento interativo (hover/foco)         |
| `experience`   | `database` | `history.load()`     | trajetória como `git log`, linha desenhada no scroll  |
| `certificates` | `vault`    | `certs.verify()`     | certificados X.509 que se verificam + lista filtrável |
| `projects`     | `workers`  | `jobs.process()`     | trilho horizontal guiado pelo scroll, cards 3D        |
| `interfaces`   | `edge`     | `ui.render()`        | fronts: screenshots reais ou wireframe que se pinta   |
| `contact`      | `response` | `response.write()`   | formulário que monta a requisição e mostra a resposta |

A configuração dos hops fica em `src/components/layout/nav-items.ts`. O trilho de requisição
(`RequestRail`) acompanha o scroll com um pacote laranja.

**Regra de ouro:** toda animação precisa _significar_ algo do domínio (pacote trafegando, span
sendo medido, commit sendo gravado, resposta chegando). Movimento puramente decorativo não entra.

## 2. Antes de codar

1. Leia o componente/seção e os vizinhos — reaproveite `components/system/*`,
   `components/motion/*`, `components/ui/*`.
2. Next.js aqui é a **16.x**. Em dúvida, leia `node_modules/next/dist/docs/` (seção 8).
3. Conteúdo pessoal em `src/content/*.ts` (inclui `system.ts`, o diagrama do hero); textos de
   interface em `src/i18n/messages/{pt,en}.json`. Nunca escreva texto visível direto no JSX
   (exceção: identificadores técnicos como `GET`, `201 Created`, nomes de spans).

## 3. Identidade visual

Tokens em `src/app/globals.css`:

| Token              | Papel                                | Claro (papel técnico) | Escuro (blueprint) |
| ------------------ | ------------------------------------ | --------------------- | ------------------ |
| `background`       | fundo                                | `#f3f1ea`             | `#0a1626`          |
| `card`             | superfícies                          | `#fbfaf6`             | `#0f2036`          |
| `foreground`       | texto principal (tinta)              | `#0e2238`             | `#e6f0fa`          |
| `muted-foreground` | texto secundário (AA)                | `#4f6278`             | `#8fa6bf`          |
| `primary`          | **sinal**: pacote, estado ativo, CTA | `#b8460f`             | `#ff7a3d`          |
| `ink`              | traços de diagrama, arestas, réguas  | `#2b5a8a`             | `#9cc4e8`          |
| `success`          | respostas 2xx, status disponível     | `#1f7a50`             | `#3ddc97`          |
| `border`           | fios, grid de seção                  | `#d3d8dc`             | `#1e3654`          |

- Cores são **semânticas**: laranja = sinal/ação, verde = sucesso, `ink` = estrutura. Sem
  gradientes coloridos decorativos.
- O fundo tem grid de engenharia (`body`, linhas maiores a cada 120px). Não empilhe outras texturas.
- Profundidade por fios, réguas de cota e sombras curtas — não por glow/blur.

**Tipografia** (variáveis em `src/app/[locale]/layout.tsx`):

| Classe         | Fonte               | Uso                                               |
| -------------- | ------------------- | ------------------------------------------------- |
| `font-display` | Bricolage Grotesque | títulos, nomes de projetos, números grandes       |
| `font-sans`    | IBM Plex Sans       | corpo, UI, formulários                            |
| `font-mono`    | IBM Plex Mono       | hops, spans, métodos HTTP, rotas, JSON, metadados |
| `font-hand`    | Caveat              | anotações de engenheiro (1 por tela, no máximo)   |

## 4. Anti-"cara de IA"

**Proibido**: texto com gradiente, blobs/glow neon, glassmorphism, reflexo/holofote radial
seguindo o mouse em cards (glare), bento grid de pílulas com
ícones, typewriter de buzzwords, emojis como ícones, botões magnéticos sem propósito,
copy genérico ("soluções robustas", "apaixonado por tecnologia").

**Permitido quando carrega significado**: contadores (instrumentos/odômetros), código/JSON
(quando interativo ou explicativo), cursor/coordenadas no hero (prancheta de desenho), tilt 3D
em cards de projeto (sem reflexo; o destaque é a barra de progresso do job), scroll horizontal (fila de jobs).

## 5. Movimento

- Duração 200–900 ms, easing `[0.22, 1, 0.36, 1]`; scroll-linked com `useScroll` + `useTransform`.
- Primeiro viewport: animações CSS (`animate-fade-up` + `animationDelay`) para não atrasar o LCP.
- `import * as m from "motion/react-m"` (há `LazyMotion strict`); `motion.div` quebra.
- **Movimento reduzido**: `MotionConfig reducedMotion="user"` cobre transforms; efeitos próprios
  (scramble, pacotes SVG, trilho horizontal, tilt) checam `useReducedMotion()` e degradam para
  estático/scroll nativo.
- Interações de hover **sempre** têm equivalente por foco (teclado) e por toque (mobile).

## 6. Voz do texto

Primeira pessoa, frases curtas, concreto ("p95 de 800 ms para 120 ms"). A metáfora técnica fica
nos rótulos (hops, spans, status HTTP); o texto corrido continua humano. pt.json e en.json juntos.

## 7. Convenções de componentes

- Server Component por padrão; cliente só para interação. Cards/linhas renderizados no servidor
  e passados como `children` para wrappers cliente (trilho, tilt).
- Pastas: `ui` (shadcn), `layout`, `sections`, `system` (peças do conceito: rail, diagrama,
  trace, grafo, pipeline), `motion`, `shared`.
- Dados derivados (grafo, hashes) em `src/lib/*.ts`, puros e com teste.
- `cn()` de `@/lib/utils`; tipos em `src/lib/types.ts`; textos localizados como `Localized<T>`.
- Comentários em PT-BR explicando o porquê.

## 8. Next.js 16 neste projeto

- Root layout em `app/[locale]/layout.tsx`; idioma via `next/root-params` (`getLocale()`,
  `getDictionary()` em `src/i18n/dictionaries.ts`) — não funciona em Client Components, Server
  Actions nem Route Handlers.
- `cacheComponents: true`: `new Date()` em Server Component só dentro de `"use cache"`.
  `dynamicParams` não existe; slug inválido → `notFound()`.
- `middleware` agora é `proxy` (`src/proxy.ts`). Docs: `node_modules/next/dist/docs/01-app/`.
- Itens de grid/flex com conteúdo largo precisam de `min-w-0` (senão a página alarga no mobile).

## 9. Checklist

- [ ] Toda animação nova representa algo do domínio; nada do "Proibido".
- [ ] Hover ↔ foco ↔ toque equivalentes; movimento reduzido degradado.
- [ ] 360px, 768px, 1280px, 1536px; sem scroll horizontal da página.
- [ ] Claro e escuro; contraste AA.
- [ ] Textos nos dois idiomas.
- [ ] `npm run lint && npm run typecheck && npm test` + E2E + verificação visual (skill **testing**).

# Editando o conteúdo do site

Tudo que é pessoal fica em `src/content/`, em arquivos TypeScript tipados — o editor avisa se
faltar um campo. Textos com duas línguas usam o formato `{ pt: "...", en: "..." }`.
O conteúdo atual vem do seu currículo, do LinkedIn (exportação em PDF) e dos repositórios do
GitHub (out/2026). Os comentários `TODO` marcam textos escritos a partir desses dados que merecem
a sua revisão (bio, citação, disponibilidade).

**Privacidade:** telefone, endereço e o PDF do currículo ficam fora do site de propósito. Para
oferecer o currículo para download, gere uma versão sem esses dados.

Depois de editar, confira com `npm run dev` (http://localhost:3000) e rode `npm test` — os testes
verificam, por exemplo, se todas as tecnologias citadas existem no catálogo.

## Trocar seus dados e textos pessoais — `src/content/profile.ts`

| Campo                                  | Onde aparece                                                 |
| -------------------------------------- | ------------------------------------------------------------ |
| `intro`                                | parágrafo do topo, abaixo do nome                            |
| `bio`                                  | parágrafos da seção "Sobre" (acendem palavra a palavra)      |
| `quote`                                | citação manuscrita na seção "Sobre"                          |
| `now`                                  | resposta `GET /now`: o que você está construindo, estudando… |
| `stats`                                | odômetros da seção "Sobre" (lista de valor + rótulo)         |
| `location`, `role`, `email`, `socials` | topo, contato e rodapé                                       |
| `available`                            | mostra/esconde "Aberto a novas oportunidades"                |

Escreva em primeira pessoa, com frases curtas e exemplos concretos (veja a seção "Voz do texto"
em `.claude/skills/frontend-design/SKILL.md`).

A contagem de cursos e certificações é somada automaticamente a partir de `courses.ts`.
Use só números verificáveis em `stats` (hoje: repositórios no GitHub e empresas como dev).

## Trocar a foto

A foto atual (`public/avatar.png`) é a mesma do GitHub. Para trocar, salve outra imagem em
`public/` (quadrada, ~800×800 px) e ajuste `avatarUrl` em `profile.ts`. Ela aparece em preto e
branco e ganha cor no hover.

## Disponibilizar o currículo

1. Salve os PDFs em `public/` (ex.: `cv-pt.pdf` e `cv-en.pdf`).
2. Em `profile.ts`, defina `cvUrl: { pt: "/cv-pt.pdf", en: "/cv-en.pdf" }`.
   O link "Baixar currículo" aparece automaticamente.

## Adicionar uma experiência — `src/content/experience.ts`

Copie um item existente e ajuste. Datas no formato `"AAAA-MM"`; omita `end` no emprego atual.
`kind` é `"work"` (emprego) ou `"education"` (formação — ganha o rótulo `branch: estudos`).
`tech` usa ids do catálogo (`src/content/tech.ts`). A lista é exibida na ordem do arquivo —
mantenha o mais recente primeiro.

## Adicionar um projeto — `src/content/projects.ts`

Cada projeto gera uma página de estudo de caso em `/pt/projects/<slug>` e `/en/projects/<slug>`.

- `slug`: minúsculas e hífens, único (vira a URL).
- `language`: `"java"` ou `"go"` — define o filtro na lista de trabalhos.
- `featured: true` coloca o projeto no topo da lista.
- `problem`, `solution`, `architecture` (caixas do diagrama, em ordem), `endpoints` e `results`
  formam o estudo de caso.

## WhatsApp — variável `CONTACT_WHATSAPP`

O número **não fica no código** (o repositório pode ser público): defina-o em `.env.local`
(ignorado pelo git) e nas variáveis de ambiente da hospedagem, antes do build.

```bash
CONTACT_WHATSAPP=18999999999   # DDD + número; aceita também "(18) 99999-9999" ou "+55 ..."
```

Como funciona:

- A página mostra o número formatado (`+55 (18) 99999-9999`), gerado no servidor no build.
- O botão aponta para `/api/whatsapp`, que redireciona para o `wa.me` com uma mensagem pronta
  (texto em `contact.whatsappMessage` nos dicionários).
- A rota não é indexada (`X-Robots-Tag`, `robots.txt`), não é cacheada e tem limite de
  requisições por IP.
- Sem a variável, o botão simplesmente não aparece.

## Adicionar um curso ou certificação — `src/content/courses.ts`

Inclua `{ title, provider, date: "AAAA-MM", hours? }` mantendo a lista do mais recente para o
mais antigo (um teste verifica). Os 6 primeiros aparecem direto; o resto fica em "+ N mais".

## Ajustar o diagrama do topo — `src/content/system.ts`

Nós (`systemNodes`: rótulo, posição no viewBox 520×400, tipo e a nota que aparece ao passar o
mouse/tocar) e ligações (`systemEdges`). Um teste garante que toda ligação aponta para nós existentes.

## Ajustar as ferramentas — `src/content/skills.ts`

Cada grupo tem um título, a lista de tecnologias (a primeira fica no centro do agrupamento no
grafo) e uma `note` curta e pessoal, mostrada no painel do grafo. O tamanho de cada nó e as
ligações entre tecnologias são calculados automaticamente a partir de `projects.ts` e
`experience.ts` — quanto mais você usa algo nos projetos, maior o nó.

## Adicionar uma tecnologia — `src/content/tech.ts`

Inclua `id: "Rótulo"` no objeto `tech` e use o `id` onde quiser.

## Textos da interface — `src/i18n/messages/pt.json` e `en.json`

Menus, rótulos, mensagens do formulário e da página 404. Edite **os dois arquivos juntos**: um teste
falha se as chaves não forem as mesmas.

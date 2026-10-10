---
name: testing
description: Como escrever, rodar e depurar testes deste projeto — unitários (Vitest + Testing Library), E2E (Playwright, desktop e mobile) e verificação visual por screenshots. Use ao adicionar/alterar funcionalidades, ao corrigir bugs, antes de commits e sempre que precisar provar que uma mudança de UI funciona.
---

# Testes

## Comandos

| Objetivo                          | Comando                                                          |
| --------------------------------- | ---------------------------------------------------------------- |
| Unitários (uma vez)               | `npm test`                                                       |
| Unitários em watch                | `npm run test:watch`                                             |
| Um arquivo / um teste             | `npx vitest run tests/i18n.test.ts -t "negotiateLocale"`         |
| E2E completo (faz build + start)  | `npm run test:e2e`                                               |
| E2E de um projeto / filtro        | `npx playwright test --project=mobile -g "formulário"`           |
| Relatório/trace do Playwright     | `npx playwright show-report` / `npx playwright show-trace <zip>` |
| Navegador (1ª vez)                | `npx playwright install chromium`                                |
| Só acessibilidade (axe)           | `npx playwright test e2e/a11y.spec.ts`                           |
| Lighthouse (com servidor na 3100) | ver seção "Performance"                                          |

Gate mínimo antes de commitar: `npm run lint && npm run typecheck && npm test`.
Mudou UI, rotas, i18n ou formulário? Rode também `npm run test:e2e`.

## Unitários — `tests/**/*.test.{ts,tsx}`

Ambiente `jsdom`, setup em `tests/setup.ts` (jest-dom + cleanup), aliases `@/` resolvidos.

**O que testar aqui**

- Funções puras: `src/i18n/config.ts`, `src/lib/format.ts`, schemas Zod (`src/lib/schemas.ts`).
- Invariantes de conteúdo (`tests/content.test.ts`): slugs únicos, tecnologias existentes no
  catálogo, datas `AAAA-MM`. Ao criar um novo tipo de conteúdo, adicione invariantes.
- Paridade de dicionários pt/en (já existe) — não remova.
- Client Components com lógica (ex.: filtro de projetos): renderize com Testing Library e
  interaja com `userEvent`.

**O que NÃO testar aqui**: Server Components assíncronos e qualquer coisa que use
`next/root-params`, `next/headers` ou Server Actions — isso é coberto pelo E2E.

**Convenções**

- Descrições em PT-BR, um comportamento por `it`.
- Busque por papel/acessibilidade (`getByRole`, `getByLabelText`) antes de `getByText`; nunca por classe CSS.
- Animações (Motion) podem manter elementos no DOM durante a saída: use `findBy*` /
  `expect.poll(...)` em vez de asserções imediatas.

## E2E — `e2e/*.spec.ts`

| Arquivo                | Cobre                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `portfolio.spec.ts`    | fluxos principais: idioma, tema, diagrama, grafo, projetos, contato, 404                    |
| `interactions.spec.ts` | teclado, menu, trace, grafo (teclado/toque), fila, estudos de caso, contato, responsividade |
| `routes.spec.ts`       | HTTP puro: status de todas as rotas, 404 real, redirects, sitemap, ícones, metadados        |
| `a11y.spec.ts`         | axe-core (WCAG 2.1 A/AA + boas práticas) nos dois temas                                     |

**Sempre use `gotoReady(page, url)`** (`e2e/helpers.ts`) em vez de `page.goto` quando o teste
for interagir: ele espera o sinal `html[data-hydrated]` (definido pelo `ThemeSync`). Interagir
antes da hidratação testa o HTML estático e gera testes instáveis. Exceção: páginas fora do
layout por idioma (404 global) e testes que precisam do objeto `response`.

`playwright.config.ts` roda dois projetos (`desktop` = Desktop Chrome, `mobile` = Pixel 7),
locale `pt-BR`, e sobe a app com `npm run build && next start -p 3100`
(reaproveita um servidor já rodando na 3100 fora de CI — lembre de reiniciá-lo após mudanças!).

**Convenções**

- Seletores por papel + nome **exato** quando houver links parecidos
  (`getByRole("link", { name: "byFood", exact: true })` — o link do GitHub do card também contém o nome).
- Testes só-mobile/só-desktop: `test.skip(!isMobile, "apenas mobile")`.
- Formulário de contato: o rate limit em memória permite **3 envios por IP a cada 10 min** por
  processo do servidor. Rodar o E2E várias vezes contra o mesmo servidor gera "Muitas tentativas" —
  o teste aceita os três desfechos; para depurar o envio real, reinicie o servidor.
- Tema: o padrão segue `prefers-color-scheme` (Playwright usa `light`). Para forçar, use
  `page.emulateMedia({ colorScheme: "dark" })` ou `addInitScript(() => localStorage.setItem("theme", "dark"))`.

## Verificação visual (screenshots)

Para mudanças de layout, **olhe** o resultado — não basta o teste passar.

```bash
npm run build && npx next start -p 3100   # em background
node .claude/skills/testing/scripts/screenshots.mjs http://localhost:3100 <pasta-de-saída>
```

O script captura home (desktop, mobile, claro, escuro), página de projeto e 404, rolando a página
inteira para disparar as animações `whileInView`, e imprime erros/avisos do console. Abra os PNGs
(ferramenta Read) e confira: hierarquia, espaçamento, contraste, quebras no mobile e o checklist
da skill **frontend-design**. Salve as imagens no scratchpad, nunca no repositório.

## Armadilhas conhecidas

- **Servidor órfão no Windows:** encerrar um `npx next start` em background mata só o wrapper do
  `npx`; o `node` continua ouvindo a porta e servindo o build **antigo** (500 nos chunks após um
  rebuild). Prefira `node node_modules/next/dist/bin/next start -p 3100` e, se a porta estiver
  ocupada, veja quem é com `netstat -ano | grep :3100` antes de matar o processo (confirme que é
  um `next start` deste projeto).
- **Scroll horizontal no mobile:** item de grid/flex com conteúdo largo (tabela com `min-w`, código)
  precisa de `min-w-0`, senão a página inteira alarga e o header fixo "foge" da tela. O E2E
  `sem scroll horizontal em …` cobre as rotas principais — inclua rotas novas nele.
- **Screenshot de página inteira** com header fixo e overlay de grão: o overlay só cobre o primeiro
  viewport e o header pode aparecer sobreposto. Para conferir detalhes, capture o viewport ou o
  elemento (`locator.screenshot()`).

- **Hover + toque:** no toque, o navegador dispara `pointerenter`, `focus` e `click` quase juntos.
  Se o `click` alterna um estado que o `focus`/hover acabou de ligar, nada acontece no celular.
  Hover só com `pointerType === "mouse"` e clique que **ativa** (não alterna). Teste com
  `locator.tap()` no projeto `mobile`.
- **Validação no blur** (`mode: "onTouched"`) pode inserir a mensagem de erro entre o `mousedown`
  e o `mouseup` do botão de envio, deslocando-o — o clique se perde. Use `mode: "onSubmit"`.
- **Trilho horizontal (projetos):** no desktop, a seção fica presa e os cards andam com o scroll;
  cards fora da tela estão deslocados com `transform`. Para clicar num card distante, role até a
  posição correspondente antes.

- **Tema × troca de idioma:** ir de `/pt` para `/en` renderiza de novo o layout raiz e o
  `className` do `<html>` volta ao do servidor (sem `dark`); o script inline só roda no primeiro
  carregamento. O `ThemeSync` (`components/layout/theme-sync.tsx`) reaplica o tema — há E2E
  cobrindo. Qualquer estado guardado em classes do `<html>` precisa da mesma atenção.

- **Interação antes da hidratação** também afeta visitantes em celulares lentos: um formulário
  sem `onSubmit` ainda faria envio nativo (GET, dados na URL). Botões que dependem de JS ficam
  desabilitados até `useHydrated()`; valores digitados antes são sincronizados na montagem.
- **Handlers de foco que rolam a página** (ex.: trazer um card para a vista) devem agir só em
  foco por teclado (`:focus-visible`); no clique do mouse, rolar entre `mousedown` e `mouseup`
  faz o clique se perder.
- **Rolagem programática** (`window.scrollTo`) logo após a hidratação pode não ser observada
  pelo Motion; em testes, complete o percurso com `page.mouse.wheel` (eventos reais).
- **Regex em scripts de edição:** ao gerar código via Python/bash, `` pode virar o caractere
  de controle _backspace_. Prefira `String.raw` num arquivo `.mjs` com heredoc `'EOF'`.

## Performance (Lighthouse)

```bash
CHROME_PATH="$(node -e "console.log(require('playwright').chromium.executablePath())")"   npx lighthouse@12 http://localhost:3100/pt --throttling-method=devtools   --chrome-flags="--headless=new" --output=json --output-path=<scratchpad>/lh.json
```

- Em **localhost**, o modo padrão (simulado) superestima o LCP: os scripts terminam antes da
  primeira pintura e o modelo assume dependência. Use `--throttling-method=devtools` para o
  valor realista e compare sempre com a mesma configuração.
- Referência atual (out/2026): desktop 99/100/100/100; mobile real ≈ LCP 2,6 s, CLS 0, TBT
  ≈ 1,3 s (custo de hidratação da página interativa).
- Não envolva seções em `<Suspense>` para "quebrar" a hidratação: com a pré-renderização
  parcial, o conteúdo vira um "buraco" preenchido por script e o LCP piora (medido).

## Depurando falhas

1. Leia a mensagem inteira — o Playwright mostra o call log e gera
   `test-results/<teste>/error-context.md` com um snapshot de acessibilidade da página.
2. Falha só no mobile? Provável sobreposição (menu, header fixo) ou elemento `hidden md:block`.
3. "strict mode violation" = seletor ambíguo → refine com `exact`, `within` (`locator("#projects")`) ou papel.
4. Conteúdo invisível em screenshot = animação `whileInView` não disparou; role até o elemento.
5. Nunca "conserte" um teste afrouxando a asserção sem entender a causa; se o comportamento
   mudou de propósito, atualize o teste e diga isso na mensagem de commit.

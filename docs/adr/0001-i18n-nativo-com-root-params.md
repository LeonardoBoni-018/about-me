# 0001 — i18n nativo com `next/root-params`

- **Status:** aceito
- **Data:** 2026-10-10

## Contexto

O site precisa de PT-BR e EN com URLs próprias (`/pt`, `/en`) e páginas pré-renderizadas. O projeto
usa Next.js 16.4 com `cacheComponents` e `partialPrefetching`, que mudam como layouts e params
são renderizados.

## Decisão

Usar o i18n nativo do Next: root layout em `app/[locale]`, locale lido com `next/root-params`,
dicionários JSON carregados no servidor e `proxy.ts` para negociar o idioma em `/`.

## Alternativas consideradas

- **next-intl** — popular e completo, mas adiciona uma dependência cuja compatibilidade com
  `cacheComponents`/root params nesta versão não estava garantida; para dois idiomas e poucos
  textos, o ganho não compensa.

## Consequências

- Zero dependências de i18n e páginas 100% estáticas.
- `next/root-params` não funciona em Client Components, Server Actions e Route Handlers: textos e
  locale chegam por props/argumentos.
- Pluralização e formatação avançada, se um dia forem necessárias, terão de usar `Intl` diretamente.

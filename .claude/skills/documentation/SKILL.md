---
name: documentation
description: Como criar e manter a documentação deste projeto — README, guias em docs/, registros de decisão (ADRs), CHANGELOG e comentários no código. Use ao adicionar funcionalidades, tomar decisões de arquitetura/design, mudar comandos ou estrutura, preparar uma versão, ou quando o usuário pedir documentação.
---

# Documentação

Idioma: **PT-BR** (termos técnicos consagrados podem ficar em inglês).

## Onde cada coisa mora

| Arquivo                   | Público                            | Conteúdo                                              |
| ------------------------- | ---------------------------------- | ----------------------------------------------------- |
| `README.md`               | quem chega ao repositório          | o que é, stack, como rodar, scripts, deploy — curto   |
| `docs/conteudo.md`        | Leonardo editando o site           | passo a passo para trocar textos, projetos, foto, CV  |
| `docs/arquitetura.md`     | devs (e agentes) mexendo no código | rotas, i18n, tema, formulário, pastas, fluxo de dados |
| `docs/adr/NNNN-titulo.md` | quem pergunta "por que assim?"     | uma decisão por arquivo, imutável depois de aceita    |
| `CHANGELOG.md`            | quem acompanha versões             | formato Keep a Changelog                              |
| `CLAUDE.md`               | agentes                            | visão geral curta + ponteiros para skills e docs      |
| `.claude/skills/*`        | agentes                            | processos (front-end, testes, git, docs)              |

Não duplique: o README aponta para `docs/`; `docs/` aponta para o código. Se a mesma informação
aparece em dois lugares, um deles vira link.

## Quando atualizar

- Novo comando/script ou variável de ambiente → README (e `.env.example`).
- Nova pasta, rota ou fluxo → `docs/arquitetura.md`.
- Novo tipo de conteúdo ou campo em `src/content` → `docs/conteudo.md`.
- Decisão com alternativas descartadas (lib, padrão, design) → novo ADR.
- Mudança visível para o usuário final → entrada em `CHANGELOG.md` em "Não lançado".

## Escrevendo bem

- Comece pelo que o leitor quer fazer. Títulos como tarefas ("Trocar a foto", "Adicionar um projeto").
- Passos numerados com comandos copiáveis em blocos de código; caminhos reais do repo.
- Frases curtas, voz ativa, sem jargão desnecessário. Exemplos concretos > descrições.
- Tabelas para comparar/listar; diagramas Mermaid quando um fluxo tiver mais de 3 passos.
- Não documente o óbvio do código; documente intenção, restrições e armadilhas.
- Rode `npm run format` (o Prettier formata Markdown também).

## ADR — template

Arquivo `docs/adr/NNNN-titulo-em-kebab-case.md` (numeração sequencial, 4 dígitos):

```markdown
# NNNN — Título da decisão

- **Status:** proposto | aceito | substituído por [NNNN](NNNN-...md)
- **Data:** AAAA-MM-DD

## Contexto

Qual problema/força motivou a decisão.

## Decisão

O que foi decidido, em uma ou duas frases afirmativas.

## Alternativas consideradas

- **Opção X** — por que não.

## Consequências

O que fica mais fácil, o que fica mais difícil, o que precisa ser vigiado.
```

ADR aceito não se edita (só correções de digitação); decisões novas criam outro ADR que o substitui.

## CHANGELOG — formato

```markdown
## [Não lançado]

### Adicionado

### Alterado

### Corrigido

### Removido

## [0.2.0] — AAAA-MM-DD

...
```

Escreva do ponto de vista de quem usa o site, não de quem lê o diff.

## Comentários no código

- PT-BR, curtos, explicando o **porquê** (restrição, armadilha, decisão), não o quê.
- JSDoc (`/** … */`) em funções/componentes exportados quando o nome não bastar.
- Combine com a densidade de comentários do arquivo ao redor.

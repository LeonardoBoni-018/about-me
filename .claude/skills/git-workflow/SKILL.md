---
name: git-workflow
description: Fluxo de git deste projeto — verificações antes do commit, mensagens no padrão Conventional Commits em PT-BR, commits atômicos, branches, configuração do remoto e push para o GitHub. Use sempre que for criar commits, branches, tags, abrir PR ou fazer push.
---

# Git: commits e pushes

Repositório: `J:\Projetos\about-me`, branch principal `main`.
Autor configurado: `LeonardoBoni-018 <boni.leonardor@outlook.com>` — não altere a config de git.

## Regras de segurança

- Só faça commit/push quando o usuário pedir. Push é ação externa: **confirme antes**, a menos que
  o usuário tenha dito explicitamente para fazer push.
- Nunca: `--force` sem pedido explícito, `--no-verify`, `git reset --hard` em trabalho não salvo,
  reescrever histórico já publicado, alterar `git config`.
- Nunca commite segredos: `.env*` está no `.gitignore` (só `.env.example` é versionado). Rode
  `git diff --cached` e procure chaves/tokens antes de commitar.
- Não commite artefatos: `.next/`, `test-results/`, `playwright-report/`, screenshots.

## 1. Antes de commitar

```bash
git status --short && git diff --stat
npm run format:check || npm run format   # formata se necessário
npm run lint && npm run typecheck && npm test
# Mudou UI/rotas/i18n/formulário? também:
npm run test:e2e
```

Se algo falhar, corrija a causa (ou pare e reporte) — não commite com o gate vermelho.

## 2. Commits atômicos

Agrupe por intenção, não por arquivo. Uma mudança de design, um teste novo e uma doc podem ser
três commits. Adicione arquivos explicitamente (`git add <caminhos>`), evite `git add -A` cego.

## 3. Mensagem — Conventional Commits em PT-BR

```
<tipo>(<escopo opcional>): <resumo no imperativo, minúsculo, ≤ 72 caracteres>

<corpo opcional: o porquê da mudança e o que muda para quem usa; quebre em ~72 colunas>

<rodapé: BREAKING CHANGE, refs de issue e a linha de atribuição exigida pelo ambiente>
```

| Tipo            | Quando                                                       |
| --------------- | ------------------------------------------------------------ |
| `feat`          | nova funcionalidade/seção visível                            |
| `fix`           | correção de bug                                              |
| `style`         | visual/CSS sem mudar comportamento                           |
| `refactor`      | reorganização sem mudar comportamento                        |
| `content`       | textos, projetos, experiências em `src/content` ou mensagens |
| `test`          | testes                                                       |
| `docs`          | README, `docs/`, ADRs, CHANGELOG                             |
| `build`/`chore` | dependências, configs, scripts                               |
| `ci`            | pipelines                                                    |

Escopos comuns: `hero`, `about`, `stack`, `experience`, `projects`, `contact`, `layout`,
`i18n`, `theme`, `seo`, `deps`, `skills`.

Exemplos:

- `feat(contact): adiciona rate limit por IP na server action`
- `style(hero): troca terminal por foto estilo polaroid`
- `content(projects): adiciona estudo de caso do serviço de pagamentos`

Use HEREDOC para mensagens com várias linhas (no PowerShell, here-string `@'…'@`):

```bash
git commit -F - <<'EOF'
feat(i18n): detecta idioma pelo Accept-Language

Visitantes em "/" agora vão para /pt ou /en conforme o navegador, e a
última escolha fica salva em cookie.

Co-Authored-By: ...linha de atribuição do ambiente...
EOF
```

Depois: `git log --oneline -5` para conferir.

## 4. Branches

- Mudanças pequenas e pessoais podem ir direto na `main` **se o usuário quiser**; caso contrário,
  crie branch antes de commitar: `feat/<assunto>`, `fix/<assunto>`, `docs/<assunto>`.
- Antes de começar: `git switch main && git pull --ff-only` (quando houver remoto).

## 5. Remoto e push

Ainda **não há remoto configurado** (e o `gh` CLI não está instalado). Quando o usuário criar o
repositório no GitHub:

```bash
git remote add origin https://github.com/LeonardoBoni-018/<repo>.git
git remote -v
git push -u origin main            # primeira vez
git push                           # depois
git push -u origin feat/<assunto>  # branches
```

- Se o push for rejeitado por divergência: `git pull --rebase` e resolva conflitos; nunca force.
- PR (com `gh` instalado): `gh pr create --fill`, descrição terminando com a linha de atribuição
  do ambiente. Sem `gh`, informe ao usuário a URL de comparação do GitHub.

## 6. Tags e changelog

Ao fechar uma versão: atualize `CHANGELOG.md` (skill **documentation**), commit
`docs(changelog): versão X.Y.Z`, depois `git tag -a vX.Y.Z -m "vX.Y.Z"` e `git push --tags`
(com confirmação).

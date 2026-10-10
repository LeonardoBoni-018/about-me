# 0002 — Tema claro/escuro com script inline

- **Status:** aceito
- **Data:** 2026-10-10

## Contexto

O tema precisa ser aplicado antes da primeira pintura (sem "flash") e sem impedir a
pré-renderização estática das páginas.

## Decisão

Um script inline no `<head>` lê a escolha salva no `localStorage` (ou a preferência do sistema) e
aplica a classe `dark` no `<html>`. Os componentes não dependem do tema para renderizar: ícones e
cores trocam via CSS (`dark:`). Um hook com `useSyncExternalStore` expõe o tema a quem precisa
(ex.: toasts).

## Alternativas consideradas

- **next-themes** — resolve o mesmo problema, mas injeta o script a partir de um Client Component;
  a documentação do Next 16 recomenda o script inline direto no layout, sem dependência extra.
- **Cookie lido no servidor** — tiraria as páginas da renderização estática.

## Consequências

- Sem flash e sem dependência; `suppressHydrationWarning` no `<html>` é obrigatório.
- A troca de tema anima com View Transitions quando o navegador suporta e o usuário não pediu
  movimento reduzido.

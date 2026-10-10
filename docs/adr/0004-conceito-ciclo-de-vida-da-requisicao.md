# 0004 — Conceito "ciclo de vida de uma requisição" (blueprint)

- **Status:** aceito
- **Data:** 2026-10-10
- Substitui [0003](0003-identidade-visual-caderno-editorial.md)

## Contexto

O "caderno editorial" (ADR 0003) resolveu a cara de template, mas ficou calmo demais: pouca
interação ao rolar e ao passar o mouse, e pouco que demonstrasse conhecimento técnico. O pedido
foi um layout que fuja do padrão, chame atenção, seja intuitivo e **mostre tecnologia** — sem
voltar aos clichês (neon, gradientes, bento grid).

## Decisão

O site vira **um sistema backend que o visitante percorre rolando a página**:

- cada seção é um hop da requisição (`gateway`, `service`, `database`, `workers`, `response`),
  com span e latência no cabeçalho, e um trilho fixo com um "pacote" que acompanha o scroll;
- hero com diagrama de arquitetura vivo (pacotes trafegando, nós explicáveis, inclinação 3D) e
  um trace waterfall que funciona como índice da página;
- stack como grafo de conhecimento derivado dos projetos/experiências reais;
- trajetória como `git log`; projetos como fila de jobs com trilho horizontal guiado pelo scroll;
- contato como console de API: a requisição é montada ao vivo e a resposta chega com status HTTP.

Identidade visual de **blueprint/esquema de engenharia**: grid técnico, traços `ink`, laranja como
sinal, verde para 2xx; Bricolage Grotesque (títulos), IBM Plex Sans/Mono e Caveat para anotações.

## Alternativas consideradas

- **Manter o editorial e só adicionar animações** — animação sem conceito vira enfeite.
- **Voltar ao dark neon/terminal** — já rejeitado por parecer gerado por IA.
- **WebGL/3D pesado** — impressiona, mas custa performance e acessibilidade, e não fala de backend.

## Consequências

- Toda animação tem significado no domínio (regra registrada na skill `frontend-design`).
- Mais JavaScript no cliente (grafo, trilho, console); mitigado com `LazyMotion`, Server
  Components e dados derivados no servidor.
- Exige cuidado com toque e teclado: hover tem equivalente por foco e por toque; movimento
  reduzido degrada para estático/scroll nativo.
- O grafo e o diagrama refletem o conteúdo: mantê-los atualizados é parte de editar o site.

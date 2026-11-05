---
name: design-references
description: Onde buscar referências visuais, design systems, componentes e bibliotecas de movimento/3D (Awwwards, Refero Styles, Inspora, Siteinspire, GSAP, Motion, Three.js e outros) e como transformar uma referência em ideia própria sem copiar nem cair na "cara de IA". Use ao começar um layout novo, um protótipo, uma seção ou um projeto futuro, ou quando o usuário pedir inspiração, referências ou "ideias de sites".
---

# Referências de design para projetos

Referência serve para **entender uma decisão** (por que aquele menu funciona, por que aquela
tipografia pesa) e trazer a decisão para o nosso mundo — nunca para copiar o visual de um site.
Antes de abrir qualquer referência, saiba o que o projeto precisa dizer; depois, leia a skill
`impeccable` (regras anti-"cara de IA") e a `frontend-design` deste projeto.

## 1. Fluxo

1. **Pergunta antes do site**: qual é o modo da página (persuadir, operar, ler, experiência)?
   Quem visita, onde, em que luz? Isso decide claro/escuro e densidade — não a moda.
2. **Junte 3 a 6 referências** em fontes diferentes da tabela abaixo. Para cada uma, anote
   **uma decisão concreta** ("o menu cobre a tela e lista os projetos", "folha técnica com
   tabela de specs ao lado da imagem"), não "achei bonito".
3. **Traduza**: troque a pele da referência pela do projeto (tokens, fontes, voz). Se a
   decisão só funciona com a pele original, ela não serve.
4. **Uma ideia forte por seção**. Movimento só quando representa algo do conteúdo.
5. **Registre** no PR/commit de onde veio cada ideia (ex.: "índice retrátil ← Seasats").

## 2. Onde procurar

| Fonte                     | Endereço                                   | Para quê                                                                                                                          |
| ------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Awwwards                  | awwwards.com (Sites, Inspiration/Elements) | Sites premiados quebrados em elementos (menu, hero, galeria) com vídeo de cada um                                                 |
| Seasats (via Awwwards)    | awwwards.com/inspiration/*-seasats         | Páginas de produto como folha técnica, menu retrátil, globo com casos, rodapé grande                                              |
| Alche, Inc (via Awwwards) | awwwards.com/inspiration/*-alche-inc       | Galeria de trabalhos, widget 3D com painel de controles                                                                           |
| Refero Styles             | styles.refero.design                       | +2.000 design systems de marcas reais em DESIGN.md para colar no prompt (Claude, Cursor, v0); tem MCP oficial (doc.refero.design) |
| Refero                    | refero.design                              | Telas e fluxos reais de produtos (login, onboarding, dashboards)                                                                  |
| Inspora                   | endereço a confirmar                       | Curadoria de interfaces reais para destravar ideias antes de codar                                                                |
| Siteinspire               | siteinspire.com                            | Arquivo curado de sites, bom para tipografia e layout editorial                                                                   |
| Godly                     | godly.website                              | Sites com movimento, em vídeo                                                                                                     |
| Land-book / Lapa Ninja    | land-book.com · lapa.ninja                 | Landing pages por categoria                                                                                                       |
| Mobbin                    | mobbin.com                                 | Padrões de app (iOS, Android, web) com fluxos completos                                                                           |
| Fonts In Use / Typewolf   | fontsinuse.com · typewolf.com              | Pares tipográficos em uso real                                                                                                    |
| Codrops                   | tympanus.net/codrops                       | Tutoriais e demos de efeitos (WebGL, scroll, texto) com código                                                                    |

> Ao adicionar uma fonte nova (ex.: os sites "Aether" e "Infinite Papers" citados pelo usuário),
> confirme o endereço antes de registrar aqui.

## 3. Bibliotecas de movimento e 3D

| Biblioteca                                    | Quando usar                                                                    | Cuidados                                                                                                               |
| --------------------------------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **Motion** (`motion/react`, ex-Framer Motion) | Transições de estado em React, layout animations, presença (entrar/sair)       | Neste projeto: `import * as m from "motion/react-m"` (LazyMotion strict)                                               |
| **GSAP + ScrollTrigger** (`gsap`)             | Linha do tempo ligada ao scroll, seção presa (pin), scrub, sequências precisas | Importe sob demanda no `useEffect`; use `gsap.matchMedia()` com `prefers-reduced-motion`; sempre `revert()` no cleanup |
| **Three.js** (`three`)                        | Cena 3D com dado real (grafo, mapa, modelo do produto)                         | `import("three")` só no cliente; descarte geometrias/materiais; pause fora da tela; texto em HTML (acessível)          |
| CSS (`@keyframes`, `clip-path`, scroll-snap)  | Revelações simples, faixas horizontais, primeiro viewport                      | Preferido no LCP: não depende de JS                                                                                    |

Exemplo vivo de cada uma: `src/app/[locale]/(lab)/prototipo` (Three.js no grafo do hero, GSAP
nas folhas presas, CSS na revelação do nome e na faixa de telas).

## 4. Proibido ao traduzir uma referência

- Copiar textos, marcas, ilustrações, fotos ou o layout inteiro de um site.
- Trazer o "pacote" da moda junto: gradiente em texto, glow, glass decorativo, cards iguais
  com ícone, rótulo pequeno acima de todo título, números de seção sem função.
- Movimento que não significa nada no conteúdo, ou que não degrada com movimento reduzido.
- Fonte monoespaçada como fantasia de "técnico" — só para código, dado e medida.

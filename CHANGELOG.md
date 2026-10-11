# Changelog

Mudanças relevantes para quem visita ou mantém o site. Formato baseado em
[Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

## [Não lançado]

### Conteúdo

- Dados reais do currículo, do LinkedIn e do GitHub: trajetória (Soft-Line, DT Network,
  HastyDEV, OzonioBras, Raízen), formação (ADS na Cruzeiro do Sul, técnico no SENAI), 15 cursos
  e certificações e 7 projetos com estudos de caso escritos a partir dos repositórios.
- Foto de perfil, LinkedIn e e-mail reais; grafo de conhecimento e diagrama do topo refletindo
  as tecnologias que aparecem de fato nos projetos.

### Alterado

- Menu horizontal a partir de 1024px (com 7 seções, não cabia em tablets); abaixo disso, o
  menu recolhível.
- Contato com os quatro canais (e-mail, WhatsApp, LinkedIn e GitHub) no mesmo formato: cartão
  clicável com ícone, ação e endereço. O rodapé também ganhou ícones.
- Novo conceito "ciclo de vida de uma requisição": a página é percorrida como uma requisição
  atravessando um sistema, com identidade visual de blueprint
  ([ADR 0004](docs/adr/0004-conceito-ciclo-de-vida-da-requisicao.md)).

### Adicionado

- Seção "Certificados" (`vault` · `certs.verify()`), separada da trajetória: totais em odômetro
  (certificados, horas, emissores), os principais como certificados X.509 que se "verificam" ao
  entrar na tela, e a lista completa com filtro por área.
- Seção "Front-end" (`edge` · `ui.render()`): os fronts mais bem estruturados — Frames by Gi
  (site no ar, cliente real, com screenshots), byFood, Psyke e Agendamento (com a planta da tela
  desenhada a partir dos componentes reais). Cada web app liga à API que consome, e o estudo de
  caso da API ganhou o bloco "A outra ponta: o front-end".
- Formulário de contato envia por SMTP (ex.: Gmail com senha de app), além do Resend, e
  manda uma confirmação automática para quem escreveu, no idioma da página. O console mostra
  se a confirmação saiu.
- Botão "Conversar no WhatsApp" no contato, com mensagem pronta no idioma da página. O número
  vem de variável de ambiente (fora do repositório) e o link passa por um redirecionamento sem
  cache, sem indexação e com limite por IP.

- Trilho lateral com um pacote que acompanha o scroll e mostra a latência acumulada.
- Hero com diagrama de arquitetura interativo e trace waterfall como índice da página.
- Grafo de conhecimento interativo, calculado a partir dos projetos e experiências.
- Trajetória como `git log`, projetos como fila de jobs com trilho horizontal e cards 3D.
- Contato como console de API: requisição montada ao vivo e resposta com status HTTP
  (201/422/429/503).

### Corrigido

- O botão do WhatsApp sumia no deploy quando o build rodava sem `CONTACT_WHATSAPP`: a rota
  `/api/whatsapp` era pré-renderizada como 404 estático. Agora roda sempre em tempo de
  requisição, e o build avisa no log quando a variável falta.
- Canonical, `og:url` e sitemap apontavam para `http://localhost:3000` no deploy sem
  `NEXT_PUBLIC_SITE_URL`; agora usam o domínio de produção que a Vercel informa no build.
- Erros de envio do formulário agora indicam no log qual provedor falhou e por quê.
- Slugs de projeto inexistentes respondiam 200 ("soft 404"); agora respondem 404.
- `favicon.ico` e `apple-icon` adicionados; o ícone foi redesenhado no estilo blueprint (o
  anterior ainda tinha o degradê da primeira versão).
- Abrir a home direto numa âncora abaixo da fila de projetos (ex.: `#contact`) parava no lugar
  errado, porque a fila mudava de altura depois de carregar. A altura agora é calculada em CSS
  (sem salto de layout, CLS 0).
- Último card da fila podia ficar cortado em navegadores com barra de rolagem visível.
- Recarregar a página no meio da fila deixava os cards na posição errada até rolar de novo.
- Teclado: focar um card fora da tela traz o card para a vista; fila e tabela de endpoints
  (roláveis no celular) agora recebem foco e mostram o indicador de foco.
- Formulário: o botão só habilita depois que a página está interativa (antes, um envio
  precoce no celular recarregava a página com os dados na URL); texto digitado antes disso
  aparece na pré-visualização.
- Acessibilidade: nomes acessíveis dos nós do diagrama e dos spans do trace agora contêm o
  texto visível; região da fila com rótulo próprio (sem landmark duplicado).
- Rate limit do contato não acumula mais IPs indefinidamente na memória.
- Desempenho: grafo e bio animada sem centenas de componentes animados (menos trabalho na
  hidratação); título do hero entra sem esconder o texto (LCP).

- Trocar o idioma não reseta mais o tema escolhido (claro/escuro).
- Cards de projeto sem o reflexo em degradê no hover; o destaque agora é uma barra de progresso
  sólida no topo do card.

- O clique em "Enviar" podia se perder quando a mensagem de erro de um campo aparecia no
  momento do clique.
- No celular, tocar em um nó do diagrama não mostrava a explicação.

## [0.2.0] — 2026-10-10 (caderno editorial, substituído)

### Alterado

- Nova identidade visual "caderno editorial": papel e tinta, tipografia Fraunces + IBM Plex,
  anotações à mão, foto estilo polaroid e textos em primeira pessoa
  ([ADR 0003](docs/adr/0003-identidade-visual-caderno-editorial.md)).
- O tema agora segue a preferência do sistema quando o visitante ainda não escolheu.
- Seção "Sobre" ganhou citação e o cartão "Agora"; ferramentas, trajetória e trabalhos viraram
  listas tipográficas.
- O nome passou a fazer parte do título principal da página (melhor para SEO).

### Corrigido

- A tabela de endpoints não alarga mais a página de projeto no celular.

### Removido

- Efeitos genéricos da versão anterior (neon, gradientes, terminal, typewriter, contadores) e o
  pacote de ícones de tecnologia.

## [0.1.0] — 2026-10-10

### Adicionado

- Primeira versão do portfólio: home com Sobre, Ferramentas, Trajetória, Trabalhos e Contato;
  estudos de caso por projeto; PT-BR/EN; tema claro/escuro; formulário com Resend; SEO
  (metadados, sitemap, OG image, JSON-LD); testes unitários e E2E.

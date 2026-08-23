# EVOLVA — Soluções Digitais

Site institucional da EVOLVA. Sem build.

```
index.html         a página inteira (HTML + CSS + JS)
404.html           página de erro servida quando a rota não existe
robots.txt         libera o rastreamento e aponta o sitemap
sitemap.xml        mapa do site
site.webmanifest   ícone e cores para "adicionar à tela de início"
assets/            logos e artes da marca
assets/portfolio/  imagens dos trabalhos mostrados na seção de portfólio
```

> **Domínio:** as URLs absolutas apontam para `https://agenciaevolva.pages.dev`,
> onde o site está publicado (Cloudflare Pages). Ao migrar para um domínio
> próprio, troque em três lugares — o bloco de metadados no topo do
> `index.html`, o `sitemap.xml` e o `robots.txt`. Um `canonical` apontando para
> o endereço errado tira a página do índice do Google, e um `og:image` apontando
> para um servidor que não responde derruba a prévia do link no WhatsApp.

## Pendências que só o dono do site resolve

- [ ] **Telefone do Romero**: `+55 85 9749-8750` tem 8 dígitos — celulares no
      Brasil têm 9 (começando com 9). Se estiver faltando um dígito, o botão
      de WhatsApp dele abre conversa com número errado. Conferir e corrigir
      nos dois lugares: o card de WhatsApp na seção de contato e o
      `contactPoint` do JSON-LD.
- [ ] **Redes sociais**: o bloco "Acompanhe a EVOLVA nas redes" está com
      `hidden` porque os perfis não foram informados. Preencher os `href` e
      remover o atributo `hidden` do bloco.
- [ ] **E-mail**: o JSON-LD declara `contato@evolva.com.br` — confirmar que o
      domínio e a caixa existem; se não, trocar ou remover.
- [ ] **Valores dos planos**: são ponto de partida, não a tabela real — ver
      "Valores" abaixo.

## Como visualizar

Abra o `index.html` no navegador — clique duplo já funciona.

Para servir por HTTP (recomendado, evita restrições do `file://`):

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

Publicar no GitHub Pages: Settings → Pages → Deploy from a branch, apontando
para a raiz. Não há passo de build.

## Fundo do hero

O hero não usa foto: duas manchas de luz da paleta (`.hero__aurora`) derivam
devagar sobre o gradiente, em CSS puro — nada a baixar e nada que quebre. Se
um dia entrar arte fotográfica, basta pôr um `<img>` com `object-fit: cover`
dentro de `.hero__bg` (e o véu `.hero__scrim` segue garantindo a leitura do
texto por cima).

As artes dos quatro cards de Soluções já estão no repositório, em
`assets/solucoes/` (`midia-social`, `tecnologia-ia`, `identidade-visual` e
`performance`, todas WEBP).

A faixa em parallax logo abaixo do hero usa uma fonte separada — veja
"A faixa em parallax" mais abaixo.

## Portfólio — 9 imagens dos trabalhos

A seção "Portfólio & Valores" tem três grupos e cada um mostra três peças.
Enquanto a imagem não estiver em `assets/portfolio/`, o quadro exibe a mesma
chapa em gradiente do resto da página — nunca um ícone quebrado. O `src` de
cada `<img>` aponta para o nome exato da tabela: um arquivo salvo com outro
nome (ou em outra pasta) não entra na página, mesmo estando no repositório.

| Grupo | Arquivos |
| --- | --- |
| 01 — Social media | `social-1.webp`, `social-2.webp`, `social-3.webp` |
| 02 — Criação e desenvolvimento | `web-1.webp`, `web-2.webp`, `web-3.webp` |
| 03 — Identidade visual | `identidade-1.webp`, `identidade-2.webp`, `identidade-3.webp` |

As nove peças estão no repositório, em WEBP 1448×1086 (formato paisagem, ~4:3).

Ao trocar a imagem, ajuste também o `alt` — hoje ele descreve o tipo de peça,
não o trabalho real.

## Valores — conferir antes de publicar

> **Os preços da seção de portfólio são um ponto de partida, não a tabela da
> agência.** Antes de publicar, percorra os nove blocos `.plan` e troque
> `.plan__value` (o número), `.plan__period` (`/mês`, `/projeto`, `/hora
> técnica`) e os itens de `.plan__list` pelas entregas reais.

Cada grupo segue o mesmo par: as peças do portfólio e, logo em seguida, os
três planos. Para tirar um plano basta apagar o bloco `.plan` — o grid se
reorganiza sozinho. O destaque é a classe `plan--featured` mais o selo
`.plan__badge`; só um por grupo.

Os valores não entram nos dados estruturados de propósito: publicar preço em
JSON-LD com número provisório coloca a informação errada no Google. Depois de
fechar a tabela, dá para acrescentar `priceSpecification` em cada `Offer`.

## Logos já no repositório

- `assets/iconelogo.webp` — símbolo magnético do hero, os quatro ornamentos do
  "Quem somos", o lockup da navbar/rodapé e a marca do `404.html`.
- `assets/evolva_solucoes_digitais.webp` — wordmark "EVOLVA — Soluções
  Digitais" do lockup na navbar, no rodapé e no `404.html`. Fundo transparente,
  com o nome em branco: é arte para fundo escuro.
- `assets/evolva_solucoes_digitais-light.webp` — mesma arte com o nome em
  azul-noite (`#020513`), usada na seção clara de Serviços.
- `assets/evolva_solucoes_digitais-og.png` — cartão 1200×630 com o wordmark
  centrado sobre o fundo da marca, **só** para `og:image`/`twitter:image` e o
  `logo` do JSON-LD. Fica em PNG de propósito: o card de link do WhatsApp, do
  Facebook e do LinkedIn não renderiza WEBP de forma confiável. O fundo é
  chapado porque o nome é branco e sumiria no preview claro dessas redes.
- `assets/icon-192.png`, `assets/icon-512.png`, `assets/icon-maskable-512.png` e
  `assets/apple-touch-icon.png` — ícones quadrados gerados a partir do símbolo,
  usados pelo `site.webmanifest` e pelo `apple-touch-icon`. PNG por compatibilidade.

Fora esses, todas as artes do site estão em WEBP.

O wordmark tem fundo transparente, então entra direto, sem `mix-blend-mode`:
a versão padrão nos fundos escuros e a `-light` na seção branca de Serviços.

## Clientes e parceiros

As seis logos do carrossel ficam em `assets/carrosel_empresas/`, em WEBP com
transparência e no máximo 600px de lado (elas aparecem a ~192×96 CSS px):
`amigao`, `taberna`, `magma`, `mega-96fm`, `creativity` e
`fortaleza-regional-11`.

Elas entram na cor da marca, a 85% de opacidade, e vêm à frente no hover.
Nenhum filtro uniforme serve para esse conjunto: escala de cinza apagava as
escuras (o vermelho do Amigão) no fundo escuro, e chapar tudo em branco
(`brightness(0) invert(1)`) transformava as que são emblema preenchido — Magma
e Mega 96 — em manchas sem desenho.

A esteira roda em laço, então a lista aparece duas vezes no HTML: ao mexer nos
clientes, replique a alteração na segunda cópia (a marcada com `aria-hidden`).
Se um arquivo faltar, a peça mostra o nome do `<span>` em vez de imagem
quebrada.

## Identidade aplicada

Paleta e tipografia vêm do protótipo da marca: fundo `#020513`, azul `#1264ff`,
ciano `#22a7ff`, violeta `#7c3cff`, roxo `#b65cff`, texto `#f5f7ff`, fonte Inter
(300–900). Dois elementos da identidade foram reconstruídos em CSS — a malha de
pontos e os feixes diagonais que aparecem nas peças.

## Movimento

Símbolo magnético no hero, faixa em parallax presa ao scroll, revelação
caractere a caractere no "Quem somos", cards de solução que empilham e reduzem
de escala, e entradas escalonadas por seção. Tudo desligado sob
`prefers-reduced-motion`.

### A faixa em parallax

Quatro colunas de peças, mais altas que a faixa, deslizando em ritmos
diferentes conforme a página rola — vizinhas andam em sentidos opostos em
relação ao scroll, que é o que dá a profundidade. Três colunas abaixo de
1024px e duas abaixo de 640px, para as peças não virarem tiras.

As peças são as imagens de `assets/portfolio/` (array `PORTFOLIO_ART` no
`<script>`, hoje com 19 arquivos), embaralhadas uma vez por carregamento e
cada uma aparecendo no máximo uma vez em toda a faixa — nunca repetida. O
acervo é que dimensiona a faixa: são `peças ÷ colunas` por coluna, a sobra da
divisão fica de fora (e troca a cada carregamento, junto com o
embaralhamento), e o script dispensa colunas quando o acervo não sustenta a
altura mínima. Some mais arquivos a `PORTFOLIO_ART` para colunas mais longas.

Todas as 19 peças estão otimizadas para a medida em que aparecem: no máximo
900×900 (elas são exibidas a ~480px), somando ~1,5MB no total. Ao adicionar
peça nova, exporte nessa medida — subir a arte original de 3000px multiplica
o peso da página por 20 sem ganho visível.

A faixa é a primeira das duas superfícies claras da página — ela e Serviços.
As trocas de fundo seguem sempre o mesmo recurso: a seção clara arredonda o
topo e a escura seguinte sobe por cima dela com margem negativa e o mesmo
raio. Aqui, a faixa arredonda o topo sobre o hero e o "Quem somos" volta ao
escuro por cima dela, exatamente como Soluções faz sobre Serviços. No claro a
peça se apoia numa sombra em vez da borda azul do tema escuro.

O ajuste fica em dois atributos no HTML: `data-from` e `data-to` são a fração
da **sobra** (altura da coluna menos a altura da faixa) em que a coluna começa
e termina o percurso. Manter os dois entre 0 e 1 garante que ela nunca descubra
o fundo, seja qual for o tamanho da tela — a sobra é medida em tempo de
execução, no `measureParallax()`, e só é relida quando a janela muda.

- `data-from` menor que `data-to` (ex.: `0.10` → `0.62`): a coluna sobe mais
  rápido que a página.
- `data-from` maior que `data-to` (ex.: `0.70` → `0.16`): a coluna fica para
  trás.

A diferença entre os dois números é o tamanho do efeito; alternar o sentido
entre colunas vizinhas é o que dá o contraste. Para colunas mais longas, mexa
em `TILES_PER_COLUMN` no `<script>` e na altura de `.parallax__col img`.

O efeito original usa Lenis para suavizar a rolagem. Aqui ele ficou de fora de
propósito: é uma dependência externa num site sem build e mudaria o
comportamento de scroll da página inteira, não só desta faixa. O parallax anda
direto no scroll nativo, dentro do mesmo passe de `requestAnimationFrame` que
já servia o restante do movimento.

Serviços, peças do portfólio e planos usam a mesma entrada escalonada do resto
da página: `data-reveal` com `--rd` para o atraso. Um detalhe que economiza
horas de depuração: `transition` é shorthand, então quem declara transição
própria no card (`.service-row`, `.piece`, `.plan`) precisa repetir `opacity` e
`transform` na lista — sem isso a regra do card substitui a de `[data-reveal]`
e o escalonamento some.

A seção Serviços é uma régua editorial: uma faixa (`.service-row`) por
serviço, separadas por um fio, com índice, ícone, nome, descrição e destino.
A faixa inteira é um link — as três primeiras levam ao grupo correspondente
do portfólio (`#portfolio-*`) e as duas últimas (Tráfego e T.I., que não têm
tabela de planos) levam ao contato com `data-plan`, abrindo o WhatsApp com a
mensagem certa. Ao criar um serviço novo, siga o padrão: índice sequencial e
um destino real para a faixa. Por isso o avanço no hover das peças fica na imagem
interna, não no card: no card ele disputaria o `transform` com a entrada.

## SEO

- Título (50 caracteres) e descrição (158) dentro do tamanho que o Google exibe.
- `canonical`, `robots`, Open Graph e Twitter Card — o card de link no WhatsApp
  e no LinkedIn usa `assets/evolva_solucoes_digitais-og.png` como imagem (PNG
  de propósito, veja
  "Logos já no repositório").
- `sitemap.xml` traz a única URL da página mais um índice `image:image` com as
  39 artes exibidas. Ao trocar arte do portfólio, regenere essa lista e atualize
  o `lastmod`.
- `site.webmanifest` declara ícones quadrados de 192 e 512 px mais um `maskable`
  — sem ícone quadrado o Chrome não oferece a instalação como app.
- Dados estruturados em JSON-LD: `Organization` (com os dois `contactPoint` de
  WhatsApp que aparecem na seção de contato), `WebSite`, `WebPage` e o
  catálogo de `Service` com os cinco serviços. Ao acrescentar ou tirar um card
  na seção Serviços, mexa também nesse catálogo — o JSON-LD anunciando serviço
  que não está na página é divergência que o Google penaliza.
- Um único `<h1>`, seguido de `<h2>` por seção, `<h3>` em cada serviço, solução
  e grupo do portfólio, e `<h4>` em cada peça. Nenhuma imagem sem atributo
  `alt`.
- **Todo o conteúdo é HTML estático.** Serviços, soluções e processo já foram
  gerados por JavaScript; agora estão no HTML, junto com o portfólio e os
  valores, então o rastreador lê as cerca de 1.630 palavras da página mesmo sem
  executar script. O JavaScript cuida apenas do movimento e da faixa em
  parallax decorativa.

Só falta a imagem de compartilhamento dedicada: hoje o card de link usa o
wordmark. Se quiser algo mais rico, gere uma arte 1200×630 e troque o caminho
nas tags `og:image` e `twitter:image`.

## Onde mexer no conteúdo

Está tudo direto no HTML — serviços, soluções, portfólio, valores, processo e
textos das seções. No `<script>` sobrou apenas o array `PORTFOLIO_ART`, que
alimenta a faixa em parallax.

As seções do `index.html` estão numeradas em comentário, na ordem em que
aparecem: 1. Hero, 2. Faixa em parallax, 3. Sobre, 4. Serviços, 5. Soluções,
6. Processo, 7. Portfólio & Valores, 8. Contato, 9. Rodapé. A mesma numeração
divide o `<style>`, então dá para pular direto para o bloco certo.

## Contato e conversão

Os dois cards de WhatsApp abrem a conversa com uma mensagem padrão
pré-preenchida (`?text=` no `wa.me`). Além disso, cada botão "Contratar" dos
planos carrega um `data-plan`: o clique rola até o contato, abre o painel de
WhatsApp e troca a mensagem pré-preenchida pela do plano escolhido — o
visitante só decide com quem falar, e o atendimento já sabe qual plano
interessou. Ao criar um plano novo, dê a ele um `data-plan` com a frase que
completa "…quero falar sobre ___".

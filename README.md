# nexorasite

Site da NEXORA — Mídia Digital & Criação. Sem build.

```
index.html         a página inteira (HTML + CSS + JS)
404.html           página de erro (GitHub Pages usa automaticamente)
robots.txt         libera o rastreamento e aponta o sitemap
sitemap.xml        mapa do site
site.webmanifest   ícone e cores para "adicionar à tela de início"
assets/            logos e artes da marca
assets/portfolio/  imagens dos trabalhos mostrados na seção de portfólio
```

> **Antes de publicar:** as URLs absolutas apontam para `https://nexora.com.br`.
> Se o endereço final for outro (GitHub Pages, por exemplo), troque o domínio em
> três lugares — o bloco de metadados no topo do `index.html`, o `sitemap.xml` e
> o `robots.txt`. Um `canonical` apontando para o endereço errado tira a página
> do índice do Google.

## Como visualizar

Abra o `index.html` no navegador — clique duplo já funciona.

Para servir por HTTP (recomendado, evita restrições do `file://`):

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

Publicar no GitHub Pages: Settings → Pages → Deploy from a branch, apontando
para a raiz. Não há passo de build.

## Artes da marca — falta colocar 4 arquivos

A página já funciona sem eles: cada espaço mostra uma chapa em gradiente da
paleta. Para entrar a arte real, salve os arquivos em `assets/` com estes nomes:

| Arquivo | Qual imagem | Onde aparece |
| --- | --- | --- |
| `assets/hero.png` | ondas azul/roxo, espaço vazio à esquerda | fundo do hero |
| `assets/ai.png` | chip isométrico "IA" com servidores | card 02 — Tecnologia & IA |
| `assets/branding.png` | mockup dos cartões de visita | card 03 — Branding |
| `assets/social.png` | símbolo com onda de partículas | card 01 — Mídia Social |

A faixa em parallax logo abaixo do hero usa uma fonte separada — veja
"A faixa em parallax" mais abaixo.

## Portfólio — 21 imagens dos trabalhos

A seção "Portfólio & Valores" tem sete grupos e cada um mostra três peças.
Enquanto a imagem não estiver em `assets/portfolio/`, o quadro exibe a mesma
chapa em gradiente do resto da página — nunca um ícone quebrado. Salve os
arquivos com estes nomes (formato paisagem, algo em torno de 800×520):

| Grupo | Arquivos |
| --- | --- |
| 01 — Social media | `social-1.png`, `social-2.png`, `social-3.png` |
| 02 — Criação e desenvolvimento | `web-1.png`, `web-2.png`, `web-3.png` |
| 03 — Estratégia digital | `estrategia-1.png`, `estrategia-2.png`, `estrategia-3.png` |
| 04 — Identidade visual | `identidade-1.png`, `identidade-2.png`, `identidade-3.png` |
| 05 — Tráfego pago e anúncios | `trafego-1.png`, `trafego-2.png`, `trafego-3.png` |
| 06 — Serviços de T.I. | `ti-1.png`, `ti-2.png`, `ti-3.png` |
| 07 — Automação e IA | `automacao-1.png`, `automacao-2.png`, `automacao-3.png` |

Ao trocar a imagem, ajuste também o `alt` — hoje ele descreve o tipo de peça,
não o trabalho real.

## Valores — conferir antes de publicar

> **Os preços da seção de portfólio são um ponto de partida, não a tabela da
> agência.** Antes de publicar, percorra os 21 blocos `.plan` e troque
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

- `assets/iconelogo.png` — favicon, símbolo magnético do hero e os quatro
  ornamentos do "Quem somos" (é o único com fundo transparente).
- `assets/iconelogo.webp` + `assets/textologo.webp` — lockup na navbar e rodapé.
- `assets/textologo-light.webp` — versão escura, usada na seção clara de Serviços.

Os arquivos de wordmark têm fundo chapado, então `.logo-on-dark`
(`mix-blend-mode: screen`) derruba o preto no tema escuro e `.logo-on-light`
(`multiply`) derruba o branco na seção clara.

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
`<script>`), cada uma aparecendo no máximo uma vez em toda a faixa — nunca
repetida. A faixa tem 4 colunas × `TILES_PER_COLUMN` vagas; com 12 peças hoje
em `assets/portfolio/` e 36 vagas (4 × 9), sobram 24 vagas sem peça própria,
que caem na mesma chapa gradiente de uma arte que falha ao carregar. Some
mais arquivos a `PORTFOLIO_ART` para preencher as vagas restantes.

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
própria no card (`.service`, `.piece`, `.plan`) precisa repetir `opacity` e
`transform` na lista — sem isso a regra do card substitui a de `[data-reveal]`
e o escalonamento some. Por isso o avanço no hover das peças fica na imagem
interna, não no card: no card ele disputaria o `transform` com a entrada.

## SEO

- Título (56 caracteres) e descrição (158) dentro do tamanho que o Google exibe.
- `canonical`, `robots`, Open Graph e Twitter Card — o card de link no WhatsApp
  e no LinkedIn usa `assets/textologo.png` como imagem.
- Dados estruturados em JSON-LD: `Organization`, `WebSite`, `WebPage` e o
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
6. Portfólio & Valores, 7. Processo, 8. Contato, 9. Rodapé. A mesma numeração
divide o `<style>`, então dá para pular direto para o bloco certo.

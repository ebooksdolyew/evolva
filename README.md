# nexorasite

Site da NEXORA — Mídia Digital & Criação. Sem build.

```
index.html         a página inteira (HTML + CSS + JS)
404.html           página de erro (GitHub Pages usa automaticamente)
robots.txt         libera o rastreamento e aponta o sitemap
sitemap.xml        mapa do site
site.webmanifest   ícone e cores para "adicionar à tela de início"
assets/            logos e artes da marca
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

## Artes da marca — falta colocar 5 arquivos

A página já funciona sem eles: cada espaço mostra uma chapa em gradiente da
paleta. Para entrar a arte real, salve os arquivos em `assets/` com estes nomes:

| Arquivo | Qual imagem | Onde aparece |
| --- | --- | --- |
| `assets/hero.png` | ondas azul/roxo, espaço vazio à esquerda | fundo do hero |
| `assets/ai.png` | chip isométrico "IA" com servidores | card 02 — Tecnologia & IA |
| `assets/branding.png` | mockup dos cartões de visita | card 03 — Branding |
| `assets/social.png` | símbolo com onda de partículas | card 01 — Mídia Social |
| `assets/about.png` | símbolo com feixes diagonais | faixa deslizante |

Os cinco também alimentam a faixa deslizante logo abaixo do hero.

## Logos já no repositório

- `assets/iconelogo.png` — favicon, símbolo magnético do hero e os quatro
  ornamentos do "Quem somos" (é o único com fundo transparente).
- `assets/iconelogo.webp` + `assets/textologo.webp` — lockup na navbar e rodapé.
- `assets/textologo-light.webp` — versão escura, usada na seção clara de Serviços.

Os arquivos de wordmark têm fundo chapado, então `.logo-on-dark`
(`mix-blend-mode: screen`) derruba o preto no tema escuro e `.logo-on-light`
(`multiply`) derruba o branco na seção clara.

## Identidade aplicada

Paleta e tipografia vêm do protótipo da marca: fundo `#020513`, azul `#1264ff`,
ciano `#22a7ff`, violeta `#7c3cff`, roxo `#b65cff`, texto `#f5f7ff`, fonte Inter
(300–900). Dois elementos da identidade foram reconstruídos em CSS — a malha de
pontos e os feixes diagonais que aparecem nas peças.

## Movimento

Símbolo magnético no hero, faixa deslizante presa ao scroll, revelação
caractere a caractere no "Quem somos", cards de solução que empilham e reduzem
de escala, e entradas escalonadas por seção. Tudo desligado sob
`prefers-reduced-motion`.

## SEO

- Título (56 caracteres) e descrição (158) dentro do tamanho que o Google exibe.
- `canonical`, `robots`, Open Graph e Twitter Card — o card de link no WhatsApp
  e no LinkedIn usa `assets/textologo.png` como imagem.
- Dados estruturados em JSON-LD: `Organization`, `WebSite`, `WebPage` e o
  catálogo de `Service` com os cinco serviços.
- Um único `<h1>`, seguido de `<h2>` por seção e `<h3>` em cada serviço e
  solução. Nenhuma imagem sem atributo `alt`.
- **Todo o conteúdo é HTML estático.** Serviços, soluções e processo já foram
  gerados por JavaScript; agora estão no HTML, então o rastreador lê as 310
  palavras da página mesmo sem executar script. O JavaScript cuida apenas do
  movimento e da faixa deslizante decorativa.

Só falta a imagem de compartilhamento dedicada: hoje o card de link usa o
wordmark. Se quiser algo mais rico, gere uma arte 1200×630 e troque o caminho
nas tags `og:image` e `twitter:image`.

## Onde mexer no conteúdo

Está tudo direto no HTML — serviços, soluções, processo e textos das seções.
No `<script>` sobrou apenas o array `BRAND_ART`, que alimenta a faixa
deslizante.

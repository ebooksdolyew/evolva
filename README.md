# nexorasite

Site da NEXORA — Mídia Digital & Criação. Um arquivo só, sem build.

```
index.html    a página inteira (HTML + CSS + JS)
assets/       logos e artes da marca
```

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

## Onde mexer no conteúdo

Os textos de serviços, soluções e processo ficam nos arrays `SERVICES`,
`SOLUTIONS` e `STEPS`, no `<script>` ao final do `index.html`. O restante está
direto no HTML.

# Fontes

A **Neue Montreal** (Pangram Pangram) é a fonte do site e é licenciada, então
os arquivos não são versionados aqui.

Coloque os `.woff2` nesta pasta com estes nomes exatos:

```
NeueMontreal-Thin.woff2     → font-weight 200   (linha branca da hero)
NeueMontreal-Light.woff2    → font-weight 300
NeueMontreal-Book.woff2     → font-weight 400
NeueMontreal-Medium.woff2   → font-weight 500–600
NeueMontreal-Bold.woff2     → font-weight 700–900
```

O peso 200 é o corte mais fino da família — a Pangram Pangram chama de
**Thin**; o briefing da hero chama de **UltraLight**. O `@font-face` aceita os
dois nomes (`NeueMontreal-Thin.woff2` e, como segunda opção,
`NeueMontreal-UltraLight.woff2`): vale o primeiro que existir. É ele que
desenha o "DA ARTE DO POST".

Os `@font-face` de 300 a 900 estão declarados em `index.html` e em `404.html`;
o de 200 só em `index.html`, que é a única página com a hero. Assim que os
arquivos existirem, a fonte assume sozinha.

Quando o arquivo do peso 200 chegar, descomente também o
`<link rel="preload">` que está logo acima do `<link>` do Google Fonts em
`index.html` — enquanto o arquivo não existe, o preload só geraria um 404 por
visita.

Enquanto não existirem, o navegador cai na **Archivo variável** do Google
Fonts — escolhida por ser a única grotesca de lá com eixo de largura
(62%–125%), que é o que sustenta os títulos estendidos em branco e
condensados em azul, e o que deixa a linha branca da hero discretamente
estendida (`font-stretch: 108%`).

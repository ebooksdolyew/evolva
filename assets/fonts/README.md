# Fontes

A **Neue Montreal** (Pangram Pangram) é a fonte do site e é licenciada, então
os arquivos não são versionados aqui.

Coloque os `.woff2` nesta pasta com estes nomes exatos:

```
NeueMontreal-Light.woff2    → font-weight 300
NeueMontreal-Book.woff2     → font-weight 400
NeueMontreal-Medium.woff2   → font-weight 500–600
NeueMontreal-Bold.woff2     → font-weight 700–900
```

Os `@font-face` já estão declarados em `index.html` e em `404.html`: assim que
os arquivos existirem, a fonte assume sozinha.

Enquanto não existirem, o navegador cai na **Archivo variável** do Google
Fonts — escolhida por ser a única grotesca de lá com eixo de largura
(62%–125%), que é o que sustenta os títulos estendidos em branco e
condensados em azul.

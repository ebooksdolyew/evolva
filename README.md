# nexorasite

Landing page "Jack — 3D Creator". Um arquivo só, sem build.

```
index.html    a página inteira (HTML + CSS + JS)
assets/       logos Nexora (ícone + wordmark, webp/png)
```

## Como visualizar

Abra o `index.html` no navegador — clique duplo no arquivo já funciona.

Se quiser servir por HTTP (recomendado, evita restrições do `file://`):

```bash
python3 -m http.server 8000
# depois abra http://localhost:8000
```

Para publicar no GitHub Pages: Settings → Pages → Deploy from a branch,
apontando para a raiz do repositório. Não há passo de build.

## Onde as logos são usadas

- `assets/iconelogo.png` — favicon.
- `assets/iconelogo.webp` + `assets/textologo.webp` — lockup na navbar e no rodapé.

Os arquivos de logo vêm com fundo chapado, então a classe `.logo-on-dark`
(`mix-blend-mode: screen`) remove esse fundo preto sobre o tema escuro.

## O que precisa ser preenchido

O botão "Contact Me" do rodapé está com `href="#"` e um comentário no HTML —
troque pelo `mailto:` real ou pelo link do WhatsApp.

## Imagens externas

O retrato do herói, os GIFs do marquee, os objetos 3D do "About me" e as
imagens dos cards de projeto vêm de URLs externas (`motionsites.ai`,
`figma.site` e `images.higgs.ai`). Se algum desses domínios sair do ar, a
página mostra um bloco liso no lugar em vez de ícone de imagem quebrada —
basta trocar as URLs nos arrays `MARQUEE` / `PROJECTS` no fim do `index.html`,
ou nos `src` das tags `<img>` do herói e do "About me".

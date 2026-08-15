# nexorasite

Landing page "Jack — 3D Creator", construída com Vite + React + TypeScript,
Tailwind CSS, Framer Motion e Lucide React.

## Rodando localmente

```bash
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # typecheck + build de produção em dist/
npm run preview  # serve o build de produção
```

## Estrutura

```
index.html                  entrada do Vite (título, favicon, fonte Kanit)
assets/                     logos Nexora (ícone + wordmark, versões webp/png)
src/
  App.tsx                   wrapper escuro (#0C0C0C) e ordem das seções
  index.css                 reset global, fonte Kanit e a classe .hero-heading
  components/
    FadeIn.tsx              wrapper de entrada com whileInView
    Magnet.tsx              efeito magnético que segue o mouse
    AnimatedText.tsx        revelação caractere a caractere ligada ao scroll
    ContactButton.tsx       pílula com gradiente
    LiveProjectButton.tsx   pílula outline
  sections/
    HeroSection.tsx         navbar + título gigante + retrato magnético
    MarqueeSection.tsx      duas faixas de GIFs que deslizam com o scroll
    AboutSection.tsx        texto animado + objetos 3D nos cantos
    ServicesSection.tsx     bloco branco com os 5 serviços
    ProjectsSection.tsx     cards sticky que empilham e reduzem de escala
    FooterSection.tsx       CTA final e assinatura Nexora
```

## Onde as logos são usadas

- `assets/iconelogo.png` — favicon (referenciado em `index.html`).
- `assets/iconelogo.webp` + `assets/textologo.webp` — lockup na navbar e no rodapé.

Os arquivos de logo vêm com fundo chapado, então as classes `.logo-on-dark`
(`mix-blend-mode: screen`) e `.logo-on-light` (`multiply`) removem esse fundo
sobre o tema escuro e sobre a seção branca, respectivamente.

## Observação sobre as imagens

As imagens do marquee, do retrato, dos objetos 3D e dos cards de projeto são
carregadas de URLs externas (motionsites.ai, figma.site e images.higgs.ai). Se
algum desses domínios ficar indisponível, basta trocar as URLs pelos arquivos
próprios nos respectivos arquivos de seção.

import { useEffect, useRef, useState } from 'react';

const IMAGES = [
  'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
  'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
  'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
  'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
  'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
  'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
  'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
  'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
  'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
  'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
  'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
  'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
  'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
  'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
  'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
  'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
  'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
  'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
  'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
];

const ROW_ONE = IMAGES.slice(0, 11);
const ROW_TWO = IMAGES.slice(11);

/** Tripled so the strip stays filled while it slides in either direction. */
const triple = <T,>(items: T[]) => [...items, ...items, ...items];

function Tile({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      loading="lazy"
      className="h-[270px] w-[420px] shrink-0 rounded-2xl object-cover"
    />
  );
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const update = () => {
      const node = sectionRef.current;
      if (!node) return;
      const sectionTop = node.offsetTop;
      setOffset(
        (window.scrollY - sectionTop + window.innerHeight) * 0.3,
      );
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  const shift = offset - 200;

  return (
    <section
      ref={sectionRef}
      className="flex flex-col gap-3 overflow-hidden bg-[#0C0C0C] pb-10 pt-24 sm:pt-32 md:pt-40"
    >
      {/* The -33.333% parks each strip on its middle copy, so there is always
          a full set of tiles to reveal whichever way the scroll pulls it. */}
      <div
        className="flex w-max gap-3"
        style={{
          transform: `translateX(calc(-33.333% + ${shift}px))`,
          willChange: 'transform',
        }}
      >
        {triple(ROW_ONE).map((src, i) => (
          <Tile key={`row1-${i}`} src={src} />
        ))}
      </div>

      <div
        className="flex w-max gap-3"
        style={{
          transform: `translateX(calc(-33.333% + ${-shift}px))`,
          willChange: 'transform',
        }}
      >
        {triple(ROW_TWO).map((src, i) => (
          <Tile key={`row2-${i}`} src={src} />
        ))}
      </div>
    </section>
  );
}

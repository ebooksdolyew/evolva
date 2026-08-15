import ContactButton from '../components/ContactButton';
import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';
import iconLogo from '../../assets/iconelogo.webp';
import textLogo from '../../assets/textologo.webp';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Price', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const PORTRAIT =
  'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png';

export default function HeroSection() {
  return (
    <section
      className="relative flex h-screen flex-col"
      style={{ overflowX: 'clip' }}
    >
      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="relative z-20 flex items-center justify-between gap-3 px-4 pt-6 sm:gap-6 sm:px-6 md:px-10 md:pt-8"
      >
        <a href="#top" className="flex shrink-0 items-center gap-2 md:gap-3">
          <img
            src={iconLogo}
            alt="Nexora"
            className="h-8 w-auto md:h-10 lg:h-12"
          />
          <img
            src={textLogo}
            alt="Nexora — Mídia Digital &amp; Criação"
            className="logo-on-dark hidden h-8 w-auto sm:block md:h-10 lg:h-12"
          />
        </a>

        <ul className="flex items-center justify-between gap-3 sm:gap-8 md:gap-12 lg:gap-16">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-xs font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 sm:text-sm md:text-lg lg:text-[1.4rem]"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </FadeIn>

      <div className="relative z-20 overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading mt-6 w-full whitespace-nowrap text-center text-[14vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[15vw] md:-mt-5 md:text-[16vw] lg:text-[17.5vw]"
        >
          Hi, i&apos;m jack
        </FadeIn>
      </div>

      <div className="flex-1" />

      <div className="relative z-20 flex items-end justify-between gap-6 px-6 pb-7 md:px-10 sm:pb-8 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
          style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
        >
          a 3d creator driven by crafting striking and unforgettable projects
        </FadeIn>

        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      {/* Positioning lives on the wrapper: Framer Motion writes its own
          `transform`, which would otherwise clobber the -translate-x-1/2. */}
      <div className="absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <img
              src={PORTRAIT}
              alt="Jack, 3D creator"
              className="w-full select-none"
              draggable={false}
            />
          </Magnet>
        </FadeIn>
      </div>
    </section>
  );
}

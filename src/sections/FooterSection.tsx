import ContactButton from '../components/ContactButton';
import FadeIn from '../components/FadeIn';
import iconLogo from '../../assets/iconelogo.webp';
import textLogo from '../../assets/textologo.webp';

export default function FooterSection() {
  return (
    <footer
      id="contact"
      className="relative z-10 flex flex-col items-center gap-10 px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28"
    >
      <FadeIn
        as="h2"
        delay={0}
        y={40}
        className="hero-heading text-center font-black uppercase leading-none tracking-tight"
        style={{ fontSize: 'clamp(2.5rem, 10vw, 130px)' }}
      >
        Let&apos;s talk
      </FadeIn>

      <FadeIn delay={0.15} y={20}>
        <ContactButton href="mailto:contato@nexora.com.br" />
      </FadeIn>

      <FadeIn
        delay={0.25}
        y={20}
        className="mt-6 flex flex-col items-center gap-5 border-t border-[#D7E2EA]/15 pt-10 w-full max-w-6xl sm:flex-row sm:justify-between"
      >
        <a href="#top" className="flex items-center gap-3">
          <img src={iconLogo} alt="" className="h-8 w-auto md:h-10" />
          <img
            src={textLogo}
            alt="Nexora — Mídia Digital &amp; Criação"
            className="logo-on-dark h-7 w-auto md:h-8"
          />
        </a>

        <p className="text-center text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-50 sm:text-sm">
          © {new Date().getFullYear()} Nexora — Mídia Digital &amp; Criação
        </p>
      </FadeIn>
    </footer>
  );
}

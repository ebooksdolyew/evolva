import AboutSection from './sections/AboutSection';
import FooterSection from './sections/FooterSection';
import HeroSection from './sections/HeroSection';
import MarqueeSection from './sections/MarqueeSection';
import ProjectsSection from './sections/ProjectsSection';
import ServicesSection from './sections/ServicesSection';

export default function App() {
  return (
    <main
      id="top"
      className="min-h-screen bg-[#0C0C0C]"
      style={{ overflowX: 'clip' }}
    >
      <HeroSection />
      <MarqueeSection />
      <AboutSection />
      <ServicesSection />
      <ProjectsSection />
      <FooterSection />
    </main>
  );
}

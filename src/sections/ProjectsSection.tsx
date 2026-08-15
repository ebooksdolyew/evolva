import { motion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useRef } from 'react';
import FadeIn from '../components/FadeIn';
import LiveProjectButton from '../components/LiveProjectButton';

const cdn = (file: string) =>
  `https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2F${file}&w=1280&q=85`;

type Project = {
  number: string;
  name: string;
  category: string;
  col1: [string, string];
  col2: string;
};

const PROJECTS: Project[] = [
  {
    number: '01',
    name: 'Nextlevel Studio',
    category: 'Client',
    col1: [
      cdn('hf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png'),
      cdn('hf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png'),
    ],
    col2: cdn('hf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png'),
  },
  {
    number: '02',
    name: 'Aura Brand Identity',
    category: 'Personal',
    col1: [
      cdn('hf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png'),
      cdn('hf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png'),
    ],
    col2: cdn('hf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png'),
  },
  {
    number: '03',
    name: 'Solaris Digital',
    category: 'Client',
    col1: [
      cdn('hf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png'),
      cdn('hf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png'),
    ],
    col2: cdn('hf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png'),
  },
];

const RADIUS = 'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]';

type CardProps = {
  project: Project;
  index: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
};

function ProjectCard({
  project,
  index,
  progress,
  range,
  targetScale,
}: CardProps) {
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div className="sticky top-24 flex h-[85vh] items-start justify-center md:top-32">
      <motion.article
        style={{ scale, top: `${index * 28}px` }}
        className={`relative w-full max-w-6xl border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 ${RADIUS}`}
      >
        <div className="mb-4 flex items-center justify-between gap-4 md:mb-6">
          <div className="flex items-center gap-4 md:gap-8">
            <span
              className="hero-heading font-black leading-none"
              // The vh cap keeps the card inside its 85vh sticky slot on
              // short viewports, where the vw-based clamp alone overflows.
              style={{ fontSize: 'min(clamp(3rem, 10vw, 140px), 11vh)' }}
            >
              {project.number}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA] opacity-60 sm:text-sm">
                {project.category}
              </span>
              <h3
                className="font-medium uppercase leading-tight text-[#D7E2EA]"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {project.name}
              </h3>
            </div>
          </div>

          <LiveProjectButton className="hidden sm:inline-block" />
        </div>

        <div className="flex gap-3 md:gap-4">
          <div className="flex w-[40%] flex-col gap-3 md:gap-4">
            <img
              src={project.col1[0]}
              alt={`${project.name} preview 1`}
              loading="lazy"
              className={`w-full object-cover ${RADIUS}`}
              style={{ height: 'min(clamp(130px, 16vw, 230px), 24vh)' }}
            />
            <img
              src={project.col1[1]}
              alt={`${project.name} preview 2`}
              loading="lazy"
              className={`w-full object-cover ${RADIUS}`}
              style={{ height: 'min(clamp(160px, 22vw, 340px), 34vh)' }}
            />
          </div>

          {/* Absolute fill so the tall image matches the left column's height
              instead of driving the row height from its own aspect ratio. */}
          <div className="relative w-[60%]">
            <img
              src={project.col2}
              alt={`${project.name} preview 3`}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover ${RADIUS}`}
            />
          </div>
        </div>
      </motion.article>
    </div>
  );
}

export default function ProjectsSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative z-10 -mt-10 rounded-t-[40px] bg-[#0C0C0C] px-5 pb-20 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10"
    >
      <FadeIn
        as="h2"
        delay={0}
        y={40}
        className="hero-heading mb-10 text-center font-black uppercase leading-none tracking-tight sm:mb-14 md:mb-16"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Project
      </FadeIn>

      {PROJECTS.map((project, i) => (
        <ProjectCard
          key={project.number}
          project={project}
          index={i}
          progress={scrollYProgress}
          range={[i * (1 / PROJECTS.length), 1]}
          targetScale={1 - (PROJECTS.length - 1 - i) * 0.03}
        />
      ))}
    </section>
  );
}

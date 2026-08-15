import { motion, useScroll, useTransform } from 'framer-motion';
import type { MotionValue } from 'framer-motion';
import { useRef } from 'react';

type AnimatedTextProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
};

type CharProps = {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
};

function Char({ char, progress, range }: CharProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative inline-block">
      {/* Invisible placeholder keeps the character in the text flow… */}
      <span style={{ opacity: 0 }}>{char}</span>
      {/* …while the animated copy sits on top of it. */}
      <motion.span
        className="absolute left-0 top-0"
        style={{ opacity }}
        aria-hidden="true"
      >
        {char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({
  text,
  className,
  style,
}: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = text.split(' ');
  const totalChars = words.reduce((sum, word) => sum + word.length, 0);
  let charIndex = 0;

  return (
    <p ref={ref} className={className} style={style} aria-label={text}>
      {words.map((word, wordIndex) => {
        const chars = word.split('').map((char) => {
          const start = charIndex / totalChars;
          const end = (charIndex + 1) / totalChars;
          charIndex += 1;
          return { char, start, end };
        });

        return (
          <span key={`${word}-${wordIndex}`} className="inline-block">
            {chars.map(({ char, start, end }, i) => (
              <Char
                key={`${char}-${i}`}
                char={char}
                progress={scrollYProgress}
                range={[start, end]}
              />
            ))}
            {wordIndex < words.length - 1 ? ' ' : null}
          </span>
        );
      })}
    </p>
  );
}

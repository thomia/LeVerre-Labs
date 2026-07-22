"use client";

import { motion, Variants } from "framer-motion";

import { cn } from "@/lib/utils";

interface WordFadeInProps {
  words: string;
  className?: string;
  delay?: number;
  variants?: Variants;
  /**
   * Balise HTML à utiliser pour le rendu (par défaut "p").
   * Une page ne doit avoir qu'un seul <h1> : ne passer "h1" que pour le
   * titre principal de la page, jamais pour plusieurs instances.
   */
  as?: "h1" | "h2" | "h3" | "p" | "div";
}

function WordFadeIn({
  words,
  delay = 0.15,
  variants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * delay },
    }),
  },
  className,
  as = "p",
}: WordFadeInProps) {
  const _words = words.split(" ");
  const MotionTag = motion[as];

  return (
    <MotionTag
      variants={variants}
      initial="hidden"
      animate="visible"
      className={cn(
        "font-display text-center text-4xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-7xl md:leading-[5rem]",
        className,
      )}
    >
      {_words.map((word, i) => (
        <motion.span key={`${word}-${i}`} variants={variants} custom={i}>
          {word}{" "}
        </motion.span>
      ))}
    </MotionTag>
  );
}

export { WordFadeIn };

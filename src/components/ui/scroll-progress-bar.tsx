"use client";

import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useState } from "react";

interface ScrollProgressBarProps {
  sections?: string[];
  height?: number;
  className?: string;
}

export const ScrollProgressBar = ({ 
  sections = [],
  height = 400,
  className = ""
}: ScrollProgressBarProps) => {
  const [scrollHeight, setScrollHeight] = useState(height);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      const windowHeight = window.innerHeight;
      setScrollHeight(windowHeight * 0.6); // 60% de la hauteur de la fenêtre
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const { scrollYProgress } = useScroll();

  // Détection de la section active en fonction du scroll
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      if (latest < 0.33) {
        setActiveSection(0);
      } else if (latest < 0.66) {
        setActiveSection(1);
      } else {
        setActiveSection(2);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress]);

  // Position de la lueur en fonction du scroll
  const topPosition = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.02], [0, 1]);

  return (
    <div className={`fixed left-8 top-1/2 -translate-y-1/2 z-[100] ${className}`}>
      <div
        style={{
          height: scrollHeight + "px",
        }}
        className="relative w-[3px] bg-gradient-to-b from-transparent from-[0%] via-gray-700 to-transparent to-[99%] [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]"
      >
        {/* Lueur rouge centrée qui suit le scroll */}
        <motion.div
          style={{
            top: topPosition,
            opacity: opacityTransform,
          }}
          className="absolute left-0 w-[3px] h-32 -translate-y-1/2"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgb(255,30,90)] to-transparent blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgb(255,30,90)] to-transparent" />
        </motion.div>

        {/* Titre de la section active - positionné à côté de la barre */}
        {sections.length > 0 && (
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{
              top: topPosition,
              opacity: opacityTransform,
            }}
            className="absolute left-8 -translate-y-1/2 whitespace-nowrap pointer-events-none z-[110]"
          >
            <span className="text-3xl lg:text-4xl xl:text-5xl font-light text-[rgb(255,30,90)] drop-shadow-[0_0_12px_rgba(255,30,90,0.6)]">
              {sections[activeSection]}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
};

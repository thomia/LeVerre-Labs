"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface SectionProgressProps {
  sections: string[]
}

export function SectionProgress({ sections }: SectionProgressProps) {
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2
      const windowHeight = document.documentElement.scrollHeight

      // Calculer quelle section est active en fonction du scroll
      const sectionProgress = scrollPosition / windowHeight
      
      if (sectionProgress < 0.25) {
        setActiveSection(0)
      } else if (sectionProgress < 0.5) {
        setActiveSection(1)
      } else if (sectionProgress < 0.75) {
        setActiveSection(2)
      } else {
        setActiveSection(2)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-10">
      {sections.map((section, index) => (
        <div key={index} className="flex items-center gap-5 group">
          {/* Point */}
          <motion.div
            initial={{ scale: 1 }}
            animate={{ 
              scale: activeSection === index ? 1.5 : 1,
              backgroundColor: activeSection === index ? 'rgb(255,30,90)' : 'rgb(148 163 184)'
            }}
            transition={{ duration: 0.3 }}
            className="w-4 h-4 rounded-full flex-shrink-0"
          />
          
          {/* Label */}
          <motion.span
            animate={{ 
              opacity: activeSection === index ? 1 : 0.5,
              color: activeSection === index ? 'rgb(255,255,255)' : 'rgb(156 163 175)'
            }}
            transition={{ duration: 0.3 }}
            className="text-xl font-medium whitespace-nowrap"
          >
            {section}
          </motion.span>
        </div>
      ))}
    </div>
  )
}

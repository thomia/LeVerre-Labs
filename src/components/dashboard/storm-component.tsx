"use client"

import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { getLocalStorage, setLocalStorage, emitStorageEvent } from '@/lib/localStorage'

interface StormComponentProps {
  intensity: number;
  onIntensityChange: (intensity: number) => void;
  hideIntensityLabel?: boolean;
}

export default function StormComponent({ intensity, onIntensityChange, hideIntensityLabel = false }: StormComponentProps) {
  const intensityRef = useRef(0)
  
  // Charger l'intensité depuis localStorage
  useEffect(() => {
    // Fonction pour mettre à jour l'intensité à partir des événements
    const handleIntensityUpdate = (e: CustomEvent<{ intensity: number }>) => {
      if (e.detail && typeof e.detail.intensity === 'number' && onIntensityChange) {
        onIntensityChange(e.detail.intensity);
      }
    };

    // Écouter les événements personnalisés
    window.addEventListener('stormIntensityUpdated', handleIntensityUpdate as EventListener);

    // Nettoyage à la destruction du composant
    return () => {
      window.removeEventListener('stormIntensityUpdated', handleIntensityUpdate as EventListener);
    };
  }, [onIntensityChange]);

  // Gérer le changement d'intensité
  useEffect(() => {
    // Mettre à jour la référence de l'intensité actuelle
    intensityRef.current = Math.round(intensity);
    
    // Sauvegarder l'intensité dans localStorage pour que d'autres composants puissent y accéder
    setLocalStorage('stormIntensity', Math.round(intensity).toString());
    
    // Émettre un événement de stockage pour notifier les autres composants
    emitStorageEvent();
  }, [intensity, onIntensityChange]);
  
  // Obtenir la description de l'intensité
  const getIntensityDescription = () => {
    if (intensity < 40) return "Faible";
    if (intensity < 60) return "Modérée";
    if (intensity < 80) return "Élevée";
    return "Critique";
  }

  // Calculer le nombre de gouttes en fonction de l'intensité
  const getDropsCount = () => {
    if (intensity < 10) return 0;
    if (intensity < 30) return 3;
    if (intensity < 50) return 6;
    if (intensity < 70) return 10;
    if (intensity < 90) return 15;
    return 20;
  }

  return (
    <div className="relative">
      <motion.div 
        className="relative h-[100px] w-full max-w-[160px] flex flex-col items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Nuage d'orage - décalé vers la gauche */}
        <motion.div 
          className={`relative w-[80px] h-[40px] rounded-[50px] bg-gray-600/80 border-2 border-[#D4A017] shadow-lg ml-[-40px]`}
          initial={{ scale: 0.8 }}
          animate={{ 
            scale: [0.95, 1.05, 0.95],
            opacity: intensity < 10 ? 0 : 1
          }}
          transition={{ 
            scale: { 
              repeat: Infinity, 
              duration: 4,
              ease: "easeInOut" 
            },
            opacity: { duration: 0.5 }
          }}
        >
          {/* Forme du nuage */}
          <div className="absolute top-[-10px] left-[15px] w-[20px] h-[20px] rounded-full bg-gray-600/80 border-t-2 border-l-2 border-r-2 border-[#D4A017]"></div>
          <div className="absolute top-[-15px] left-[40px] w-[25px] h-[25px] rounded-full bg-gray-600/80 border-2 border-[#D4A017]"></div>
          <div className="absolute top-[-8px] left-[30px] w-[15px] h-[15px] rounded-full bg-gray-600/80 border-t-2 border-l-2 border-r-2 border-[#D4A017]"></div>
          
          {/* Éclairs */}
          {intensity > 30 && (
            <motion.div
              className="absolute bottom-[-5px] left-[20px] w-[2px] h-[15px] bg-[#F0C239]"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scaleY: [0.8, 1.2, 0.8]
              }}
              transition={{
                repeat: Infinity,
                duration: Math.max(0.5, 1.5 - (intensity * 0.01)),
                delay: 0.5,
                repeatDelay: Math.max(0.5, 3 - (intensity * 0.025))
              }}
            />
          )}
          
          {intensity > 50 && (
            <motion.div
              className="absolute bottom-[-8px] left-[45px] w-[3px] h-[18px] bg-[#F0C239]"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scaleY: [0.8, 1.2, 0.8]
              }}
              transition={{
                repeat: Infinity,
                duration: Math.max(0.4, 1.2 - (intensity * 0.01)),
                delay: 1.2,
                repeatDelay: Math.max(0.4, 3 - (intensity * 0.025))
              }}
            />
          )}
          
          {/* Éclair supplémentaire pour intensité élevée */}
          {intensity > 70 && (
            <motion.div
              className="absolute bottom-[-7px] left-[30px] w-[2.5px] h-[20px] bg-[#F0C239]"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scaleY: [0.8, 1.2, 0.8]
              }}
              transition={{
                repeat: Infinity,
                duration: Math.max(0.3, 1.0 - (intensity * 0.01)),
                delay: 0.8,
                repeatDelay: Math.max(0.3, 2.5 - (intensity * 0.025))
              }}
            />
          )}
          
          {/* Éclair supplémentaire pour intensité critique */}
          {intensity > 90 && (
            <motion.div
              className="absolute bottom-[-6px] left-[10px] w-[2px] h-[16px] bg-[#F0C239]"
              initial={{ opacity: 0 }}
              animate={{ 
                opacity: [0, 1, 0],
                scaleY: [0.8, 1.2, 0.8]
              }}
              transition={{
                repeat: Infinity,
                duration: Math.max(0.2, 0.8 - (intensity * 0.005)),
                delay: 0.3,
                repeatDelay: Math.max(0.2, 2 - (intensity * 0.02))
              }}
            />
          )}
          
          {/* Gouttes de pluie - distribuées sur toute la largeur du nuage */}
          {intensity >= 30 && (
            <>
              {/* Gouttes côté gauche */}
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={`raindrop-left-${index}`}
                  className="absolute w-[2px] h-[6px] bg-blue-400/80 rounded-b-full"
                  style={{
                    left: `${5 + (index * 6)}px`,
                    bottom: `-10px`,
                    opacity: 0.8,
                    height: `${Math.min(8, 4 + (intensity * 0.04))}px`
                  }}
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ 
                    y: [0, 20, 40],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: Math.max(0.5, 1.5 - (intensity * 0.01) - (index * 0.05)),
                    delay: index * 0.15,
                    ease: "easeIn"
                  }}
                />
              ))}
              
              {/* Gouttes côté droit */}
              {Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={`raindrop-right-${index}`}
                  className="absolute w-[2px] h-[6px] bg-blue-400/80 rounded-b-full"
                  style={{
                    left: `${45 + (index * 6)}px`,
                    bottom: `-10px`,
                    opacity: 0.8,
                    height: `${Math.min(8, 4 + (intensity * 0.04))}px`
                  }}
                  initial={{ y: -5, opacity: 0 }}
                  animate={{ 
                    y: [0, 20, 40],
                    opacity: [0, 1, 0]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: Math.max(0.5, 1.5 - (intensity * 0.01) - (index * 0.05)),
                    delay: (index + 6) * 0.15,
                    ease: "easeIn"
                  }}
                />
              ))}
            </>
          )}
        </motion.div>
      </motion.div>
    </div>
  )
}

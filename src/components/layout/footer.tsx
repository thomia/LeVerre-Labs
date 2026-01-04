"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative bg-gradient-to-b from-black via-gray-950 to-black border-t border-white/5">
      {/* Gradient top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgb(255,30,90)]/50 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/vitrine" className="flex items-center gap-3 group">
              <img 
                src="/photo%20video/logo_noir-removebg-preview.png" 
                alt="LeVerre Labs Logo" 
                className="h-10 w-10 object-contain brightness-0 invert group-hover:scale-110 transition-transform duration-200"
              />
              <h3 className="text-2xl font-bold">
                <span className="text-[rgb(255,30,90)] group-hover:text-[rgb(255,60,120)] transition-colors">LeVerre</span>{' '}
                <span className="text-gray-400 group-hover:text-gray-300 transition-colors">Labs</span>
              </h3>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              The Powerful Digital Ergonomic Tool. Transformez votre approche de la prévention avec une métaphore visuelle innovante.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/vitrine" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/fondements" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Fondements
                </Link>
              </li>
            </ul>
          </div>

          {/* À propos */}
          <div>
            <h4 className="text-white font-semibold mb-4">À propos</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/fondements#histoire" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Histoire
                </Link>
              </li>
              <li>
                <Link href="/fondements#approche" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Approche
                </Link>
              </li>
              <li>
                <Link href="/fondements#references" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="text-gray-400 text-sm">
                <a href="mailto:leverrelabs@gmail.com" className="hover:text-white transition-colors">
                  leverrelabs@gmail.com
                </a>
              </li>
              <li className="text-gray-400 text-sm">
                Développé avec ❤️
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} LeVerre Labs. Tous droits réservés.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom gradient accent */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
    </footer>
  )
}

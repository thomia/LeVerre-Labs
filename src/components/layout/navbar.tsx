"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Accueil', href: '/vitrine' },
    { name: 'Fondements', href: '/fondements' },
    { name: 'Statistiques', href: '/statistiques' },
    { name: 'Analyse Vidéo', href: '/analyse-video' },
    { name: 'Collaborer', href: '/collaborer' },
    // { name: 'Offres', href: '/offres' }, // Masqué temporairement
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/vitrine" className="flex items-center gap-3 group">
            <img 
              src="/photo%20video/logo_noir-removebg-preview.png" 
              alt="LeVerre Labs Logo" 
              className="h-10 w-10 object-contain brightness-0 invert group-hover:scale-110 transition-transform duration-200"
            />
            <h1 className="text-2xl font-bold">
              <span className="text-[rgb(255,30,90)] group-hover:text-[rgb(255,60,120)] transition-colors">
                LeVerre
              </span>{' '}
              <span className="text-white group-hover:text-gray-300 transition-colors">Labs</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 group"
                >
                  <span
                    className={`text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-gray-400 group-hover:text-white'
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[rgb(255,30,90)] to-transparent"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="px-6 py-4 space-y-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[rgb(255,30,90)]/10 text-white border border-[rgb(255,30,90)]/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

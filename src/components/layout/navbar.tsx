"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
            {NAV_ITEMS.map((item) =>
              'children' in item ? (
                <DesktopDropdown
                  key={item.name}
                  item={item}
                  pathname={pathname}
                  isOpen={openDropdown === item.name}
                  onOpen={() => setOpenDropdown(item.name)}
                  onClose={() => setOpenDropdown(null)}
                />
              ) : (
                <DesktopLink key={item.href} item={item} pathname={pathname} />
              )
            )}
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
              {NAV_ITEMS.map((item) =>
                'children' in item ? (
                  <div key={item.name} className="space-y-1">
                    <p className="px-4 pt-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      {item.name}
                    </p>
                    {item.children.map((child) => (
                      <MobileLink
                        key={child.href}
                        item={child}
                        pathname={pathname}
                        onClick={() => setIsMobileMenuOpen(false)}
                      />
                    ))}
                  </div>
                ) : (
                  <MobileLink
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    onClick={() => setIsMobileMenuOpen(false)}
                  />
                )
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

/* ---------- Sous-composants ---------- */

interface LienSimple {
  name: string
  href: string
}

interface MenuDeroulant {
  name: string
  children: LienSimple[]
}

function DesktopLink({ item, pathname }: { item: LienSimple; pathname: string | null }) {
  const isActive = pathname === item.href
  return (
    <Link href={item.href} className="relative px-4 py-2 group">
      <span
        className={`text-sm font-medium transition-colors ${
          isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'
        }`}
      >
        {item.name}
      </span>
      {isActive && <IndicateurActif />}
    </Link>
  )
}

interface DesktopDropdownProps {
  item: MenuDeroulant
  pathname: string | null
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

function DesktopDropdown({ item, pathname, isOpen, onOpen, onClose }: DesktopDropdownProps) {
  const isActive = item.children.some((c) => pathname === c.href)
  return (
    <div className="relative" onMouseEnter={onOpen} onMouseLeave={onClose}>
      <button type="button" className="relative flex items-center gap-1 px-4 py-2 group">
        <span
          className={`text-sm font-medium transition-colors ${
            isActive || isOpen ? 'text-white' : 'text-gray-400 group-hover:text-white'
          }`}
        >
          {item.name}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`}
        />
        {isActive && <IndicateurActif />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3"
          >
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/95 p-1.5 shadow-2xl backdrop-blur-xl">
              {item.children.map((child) => {
                const childActive = pathname === child.href
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    onClick={onClose}
                    className={`block rounded-lg px-4 py-2.5 text-sm transition-colors ${
                      childActive
                        ? 'bg-[rgb(255,30,90)]/10 text-white'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {child.name}
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MobileLink({
  item,
  pathname,
  onClick,
}: {
  item: LienSimple
  pathname: string | null
  onClick: () => void
}) {
  const isActive = pathname === item.href
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`block px-4 py-3 rounded-lg transition-colors ${
        isActive
          ? 'bg-[rgb(255,30,90)]/10 text-white border border-[rgb(255,30,90)]/20'
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {item.name}
    </Link>
  )
}

function IndicateurActif() {
  return (
    <motion.div
      layoutId="navbar-indicator"
      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[rgb(255,30,90)] to-transparent"
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
    />
  )
}

/* ---------- Contenu statique ---------- */

const NAV_ITEMS: (LienSimple | MenuDeroulant)[] = [
  { name: 'Accueil', href: '/vitrine' },
  { name: 'Fondements', href: '/fondements' },
  {
    name: 'Ressources',
    children: [
      { name: 'Statistiques nationales AT/MP', href: '/statistiques' },
      { name: 'Recherche scientifique', href: '/recherche-scientifique' },
    ],
  },
  { name: 'Collaborer', href: '/collaborer' },
]

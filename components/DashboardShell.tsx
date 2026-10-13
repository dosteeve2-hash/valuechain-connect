'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import ExampleDataBanner from '@/components/ExampleDataBanner'
import { Globe2, LayoutDashboard, ShoppingBag, FileText, Package, User, ClipboardList, ScrollText, MessageSquare, Boxes, Truck, Users2, Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard',                 label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/matching',                  label: 'Matching',        icon: Users2 },
  { href: '/catalogue',                 label: 'Catalogue',       icon: ShoppingBag },
  { href: '/produits',                  label: 'Produits',        icon: Boxes },
  { href: '/livraisons',               label: 'Livraisons',      icon: Truck },
  { href: '/dashboard/mes-offres',      label: 'Mes offres',      icon: Package },
  { href: '/devis',                     label: 'Devis',           icon: FileText },
  { href: '/dashboard/commandes',       label: 'Commandes',       icon: ClipboardList },
  { href: '/dashboard/contrats',        label: 'Contrats',        icon: ScrollText },
  { href: '/dashboard/messages',        label: 'Messages',        icon: MessageSquare },
  { href: '/dashboard/profil',          label: 'Mon profil',      icon: User },
]

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const menuBtn = useRef<HTMLButtonElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    menuBtn.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) return
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  return (
    <div className="min-h-screen lg:flex" style={{ backgroundColor: '#0A1628' }}>
      {/* Fond du tiroir (mobile) */}
      {open && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden" onClick={close} aria-hidden="true" />
      )}

      {/* SIDEBAR — tiroir sous lg, fixe au-dessus */}
      <aside id="menu-principal"
        className={`fixed inset-y-0 left-0 z-40 w-64 max-w-[85vw] flex flex-col border-r border-white/5 transition-transform duration-200 lg:static lg:z-auto lg:max-w-none lg:flex-shrink-0 lg:translate-x-0 lg:visible ${open ? 'translate-x-0' : '-translate-x-full invisible'}`}
        style={{ backgroundColor: '#060E1A' }}>
        <div className="p-4 lg:p-6 border-b border-white/5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 min-h-11">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
              <Globe2 className="w-4 h-4 text-[#0A1628]" />
            </div>
            <span className="font-bold text-white">Agro<span style={{ color: '#D4AF37' }}>Link</span></span>
          </Link>
          <button ref={closeBtn} type="button" onClick={close} aria-label="Fermer le menu"
            className="lg:hidden w-11 h-11 -mr-2 flex items-center justify-center rounded-xl text-gray-300 hover:bg-white/5">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav aria-label="Navigation principale" className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 min-h-11 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 group">
              <item.icon className="w-5 h-5 group-hover:text-[#D4AF37] transition-colors" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#0A1628]"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
              SK
            </div>
            <div>
              <div className="text-sm font-medium text-white">Seydou Konaté</div>
              <div className="text-xs" style={{ color: '#D4AF37' }}>Vendeur vérifié</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-between gap-3 px-4 sm:px-8"
          style={{ backgroundColor: 'rgba(6,14,26,0.8)', backdropFilter: 'blur(10px)' }}>
          <div className="flex items-center gap-2 min-w-0">
            <button ref={menuBtn} type="button" onClick={() => setOpen(true)} aria-label="Ouvrir le menu"
              aria-expanded={open} aria-controls="menu-principal"
              className="lg:hidden w-11 h-11 -ml-2 flex items-center justify-center rounded-xl text-gray-300 hover:bg-white/5">
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm text-gray-400 truncate">
              Bonjour, <span className="text-white font-medium">Seydou</span> 👋
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">En ligne</span>
          </div>
        </header>
        <div className="p-4 sm:p-6 lg:p-8">
          <ExampleDataBanner />
          {children}
        </div>
      </main>
    </div>
  )
}

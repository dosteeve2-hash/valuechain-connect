'use client'

import Link from 'next/link'
import { estActif } from '@/lib/navigation'
import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Globe2, LayoutDashboard, ShoppingBag, FileText, Package, User,
  ClipboardList, ScrollText, MessageSquare, Boxes, Truck, Users2, Menu, X,
} from 'lucide-react'

type EntreeNav = { href: string; label: string; icon: React.ElementType }

export const NAV_ITEMS: EntreeNav[] = [
  { href: '/dashboard',            label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/matching',             label: 'Matching',        icon: Users2 },
  { href: '/catalogue',            label: 'Catalogue',       icon: ShoppingBag },
  { href: '/produits',             label: 'Produits',        icon: Boxes },
  { href: '/livraisons',           label: 'Livraisons',      icon: Truck },
  { href: '/dashboard/mes-offres', label: 'Mes offres',      icon: Package },
  { href: '/devis',                label: 'Devis',           icon: FileText },
  { href: '/dashboard/commandes',  label: 'Commandes',       icon: ClipboardList },
  { href: '/dashboard/contrats',   label: 'Contrats',        icon: ScrollText },
  { href: '/dashboard/messages',   label: 'Messages',        icon: MessageSquare },
  { href: '/dashboard/profil',     label: 'Mon profil',      icon: User },
]

function LiensNav({ chemin, onNavigate }: { chemin: string; onNavigate?: () => void }) {
  return (
    <>
      {NAV_ITEMS.map((item) => {
        const actif = estActif(item.href, chemin)
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={actif ? 'page' : undefined}
            className={[
              'flex items-center gap-3 px-4 py-3 rounded-xl group',
              'transition-colors duration-200 motion-reduce:transition-none',
              actif
                ? 'bg-white/10 text-white font-semibold'
                : 'text-gray-400 hover:text-white hover:bg-white/5',
            ].join(' ')}
            style={actif ? { boxShadow: 'inset 3px 0 0 #D4AF37' } : undefined}
          >
            <item.icon
              className={[
                'w-5 h-5 transition-colors motion-reduce:transition-none',
                actif ? 'text-[#D4AF37]' : 'group-hover:text-[#D4AF37]',
              ].join(' ')}
            />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        )
      })}
    </>
  )
}

function Marque() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
      >
        <Globe2 className="w-4 h-4 text-[#0A1628]" />
      </div>
      <span className="font-bold text-white">
        ValueChain<span style={{ color: '#D4AF37' }}>Connect</span>
      </span>
    </Link>
  )
}

function Profil() {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-[#0A1628]"
        style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}
      >
        SK
      </div>
      <div>
        <div className="text-sm font-medium text-white">Seydou Konaté</div>
        <div className="text-xs" style={{ color: '#D4AF37' }}>Vendeur vérifié</div>
      </div>
    </div>
  )
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const chemin = usePathname() ?? ''

  /**
   * L'état retient le CHEMIN sur lequel le tiroir a été ouvert, pas un booléen.
   * Toute navigation le referme donc d'elle-même, sans effet de synchronisation —
   * `useEffect(() => setOuvert(false), [chemin])` est refusé par la règle
   * `react-hooks/set-state-in-effect`.
   */
  const [ouvertSur, setOuvertSur] = useState<string | null>(null)
  const ouvert = ouvertSur === chemin
  const fermer = useCallback(() => setOuvertSur(null), [])
  const boutonRef = useRef<HTMLButtonElement>(null)

  // Échap ferme le tiroir. Un écouteur d'événement n'est pas un état posé par un effet.
  useEffect(() => {
    if (!ouvert) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOuvertSur(null)
        boutonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [ouvert])

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0A1628' }}>
      {/* ───────── Barre latérale : à partir de 1024 px ─────────
          Onze entrées derrière une barre de 256 px : en dessous de lg, le contenu
          n'a plus la place de vivre. */}
      <aside
        className="hidden lg:flex w-64 flex-shrink-0 flex-col border-r border-white/5"
        style={{ backgroundColor: '#060E1A' }}
      >
        <div className="p-6 border-b border-white/5"><Marque /></div>
        <nav aria-label="Navigation principale" className="flex-1 p-4 space-y-1 overflow-y-auto">
          <LiensNav chemin={chemin} />
        </nav>
        <div className="p-4 border-t border-white/5"><Profil /></div>
      </aside>

      {/* Voile. `opacity` plutôt qu'un montage conditionnel : la transition a besoin
          des deux états pour s'animer. */}
      <div
        onClick={fermer}
        aria-hidden="true"
        className={[
          'lg:hidden fixed inset-0 z-40 bg-black/60',
          'transition-opacity duration-200 motion-reduce:transition-none',
          ouvert ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
      />

      {/*
        `inert` (React 19) sort tout le tiroir fermé de l'arbre d'accessibilité ET du
        parcours au clavier. Sans lui, un lecteur d'écran annoncerait deux fois chacune
        des onze destinations, et Tab irait se perdre dans un panneau invisible.
      */}
      <div
        id="tiroir-navigation"
        inert={!ouvert}
        className={[
          'lg:hidden fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] flex flex-col border-r border-white/10',
          'transition-transform duration-300 ease-out motion-reduce:transition-none',
          ouvert ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
        style={{ backgroundColor: '#060E1A' }}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between gap-2">
          <Marque />
          <button
            type="button"
            onClick={fermer}
            aria-label="Fermer le menu"
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-gray-400
                       hover:text-white hover:bg-white/5
                       transition-colors motion-reduce:transition-none
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav aria-label="Navigation principale" className="flex-1 p-4 space-y-1 overflow-y-auto">
          <LiensNav chemin={chemin} onNavigate={fermer} />
        </nav>
        <div className="p-4 border-t border-white/5"><Profil /></div>
      </div>

      {/* `min-w-0` : sans lui, un tableau large pousse le conteneur flex au lieu de
          défiler dans son propre cadre, et c'est la page entière qui part en
          défilement horizontal. */}
      <main className="flex-1 min-w-0 overflow-auto">
        <header
          className="h-16 border-b border-white/5 flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
          style={{ backgroundColor: 'rgba(6,14,26,0.8)', backdropFilter: 'blur(10px)' }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <button
              ref={boutonRef}
              type="button"
              onClick={() => setOuvertSur(ouvert ? null : chemin)}
              aria-expanded={ouvert}
              aria-controls="tiroir-navigation"
              aria-label={ouvert ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="lg:hidden inline-flex flex-shrink-0 items-center justify-center w-10 h-10 rounded-xl
                         text-gray-300 hover:text-white hover:bg-white/5
                         transition-colors motion-reduce:transition-none
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
            >
              {ouvert ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="text-sm text-gray-400 truncate">
              Bonjour, <span className="text-white font-medium">Seydou</span> 👋
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse motion-reduce:animate-none" />
            <span className="text-xs text-gray-400 hidden sm:inline">En ligne</span>
          </div>
        </header>

        {/* 32 px de marge de chaque côté sur un écran de 360 px, c'est 64 px pris
            au contenu. La marge suit la largeur. */}
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}

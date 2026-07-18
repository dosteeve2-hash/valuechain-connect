import Link from 'next/link'
import { Globe2, LayoutDashboard, ShoppingBag, FileText, Package, User, ClipboardList, Boxes, Truck } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/catalogue', label: 'Catalogue', icon: ShoppingBag },
  { href: '/produits', label: 'Produits', icon: Boxes },
  { href: '/livraisons', label: 'Livraisons', icon: Truck },
  { href: '/dashboard/offres', label: 'Mes offres', icon: Package },
  { href: '/devis', label: 'Devis', icon: FileText },
  { href: '/dashboard/commandes', label: 'Commandes', icon: ClipboardList },
  { href: '/dashboard/profil', label: 'Mon profil', icon: User },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#0A1628' }}>
      {/* SIDEBAR */}
      <aside className="w-64 flex-shrink-0 flex flex-col border-r border-white/5"
        style={{ backgroundColor: '#060E1A' }}>
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
              <Globe2 className="w-4 h-4 text-[#0A1628]" />
            </div>
            <span className="font-bold text-white">ValueChain<span style={{ color: '#D4AF37' }}>Connect</span></span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200 group">
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
      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8"
          style={{ backgroundColor: 'rgba(6,14,26,0.8)', backdropFilter: 'blur(10px)' }}>
          <div className="text-sm text-gray-400">
            Bonjour, <span className="text-white font-medium">Seydou</span> 👋
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">En ligne</span>
          </div>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Package, TrendingUp, CheckCircle, Clock, Truck,
  Filter, Search, MapPin, Calendar, FileText, ChevronRight,
  type LucideIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatFCFA } from '@/lib/fcfa'

type Statut = 'Confirmée' | 'En préparation' | 'En transit' | 'Livrée' | 'Annulée'

interface Commande {
  id: string
  produit: string
  vendeur: string
  acheteur: string
  quantite: string
  montant: number
  dateCommande: string
  dateLivraison: string
  incoterm: string
  statut: Statut
  avancement: number
}

const MOCK_COMMANDES: Commande[] = [
  {
    id: 'CMD-001',
    produit: 'Coton grade A',
    vendeur: 'Coopérative Koudougou',
    acheteur: 'Akosombo Textiles',
    quantite: '20 tonnes',
    montant: 5400000,
    dateCommande: '2026-07-11',
    dateLivraison: '2026-07-25',
    incoterm: 'FOB Lomé',
    statut: 'Confirmée',
    avancement: 60,
  },
  {
    id: 'CMD-002',
    produit: 'Beurre de karité',
    vendeur: 'Femmes Sahel SCOOP',
    acheteur: "L'Oréal Sourcing",
    quantite: '3 tonnes',
    montant: 2760000,
    dateCommande: '2026-07-09',
    dateLivraison: '2026-08-01',
    incoterm: 'FCA Ouaga',
    statut: 'En préparation',
    avancement: 30,
  },
  {
    id: 'CMD-003',
    produit: 'Sésame blanc',
    vendeur: 'AgroTrack Exports',
    acheteur: 'Sesaco Japan',
    quantite: '5 tonnes',
    montant: 2250000,
    dateCommande: '2026-07-06',
    dateLivraison: '2026-07-20',
    incoterm: 'CIF Tokyo',
    statut: 'Livrée',
    avancement: 100,
  },
  {
    id: 'CMD-004',
    produit: 'Maïs jaune',
    vendeur: 'COOPAG Nord',
    acheteur: 'Minoterie du Sahel',
    quantite: '50 tonnes',
    montant: 8750000,
    dateCommande: '2026-07-13',
    dateLivraison: '2026-07-30',
    incoterm: 'DAP Ouaga',
    statut: 'En transit',
    avancement: 75,
  },
]

const STATUT_CONFIG: Record<Statut, { color: string; bg: string; icon: LucideIcon; badge: 'green' | 'gold' | 'cyan' | 'orange' | 'red' }> = {
  Confirmée:     { color: '#D4AF37', bg: 'rgba(212,175,55,0.1)',  icon: CheckCircle, badge: 'gold' },
  'En préparation': { color: '#00BCD4', bg: 'rgba(0,188,212,0.1)',  icon: Clock,       badge: 'cyan' },
  'En transit':  { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', icon: Truck,       badge: 'orange' },
  Livrée:        { color: '#10B981', bg: 'rgba(16,185,129,0.1)', icon: Package,     badge: 'green' },
  Annulée:       { color: '#EF4444', bg: 'rgba(239,68,68,0.1)',  icon: Package,     badge: 'red' },
}

const STATUTS_FILTER: (Statut | 'Toutes')[] = ['Toutes', 'Confirmée', 'En préparation', 'En transit', 'Livrée']

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ type: 'spring' as const, delay: 0.2, duration: 0.8 }}
        className="h-full rounded-full"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
      />
    </div>
  )
}

export default function CommandesPage() {
  const [search, setSearch] = useState('')
  const [filterStatut, setFilterStatut] = useState<Statut | 'Toutes'>('Toutes')

  const filtered = MOCK_COMMANDES.filter(c => {
    const matchSearch = !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.produit.toLowerCase().includes(search.toLowerCase()) ||
      c.vendeur.toLowerCase().includes(search.toLowerCase()) ||
      c.acheteur.toLowerCase().includes(search.toLowerCase())
    const matchStatut = filterStatut === 'Toutes' || c.statut === filterStatut
    return matchSearch && matchStatut
  })

  const totalCA = MOCK_COMMANDES.reduce((sum, c) => sum + c.montant, 0)
  const nbLivrees = MOCK_COMMANDES.filter(c => c.statut === 'Livrée').length
  const nbEnCours = MOCK_COMMANDES.filter(c => c.statut !== 'Livrée' && c.statut !== 'Annulée').length

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const }}
      >
        <h1 className="text-3xl font-black text-white mb-1">Commandes</h1>
        <p className="text-gray-400">Suivi de vos transactions B2B en cours et passées</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: 'CA total', value: (totalCA / 1000000).toFixed(2) + 'M FCFA', icon: TrendingUp, color: '#D4AF37' },
          { label: 'En cours', value: nbEnCours.toString(), icon: Clock, color: '#00BCD4' },
          { label: 'Livrées', value: nbLivrees.toString(), icon: CheckCircle, color: '#10B981' },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, delay: i * 0.1 }}>
            <Card className="bg-navy-card border-white/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}>
                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <div>
                    <div className="text-2xl font-black text-white">{s.value}</div>
                    <div className="text-xs text-gray-400">{s.label}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Filtres */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, delay: 0.2 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une commande, un produit…"
            className="pl-10 h-10 border-white/10 text-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-500 self-center" />
          {STATUTS_FILTER.map(s => (
            <button
              key={s}
              onClick={() => setFilterStatut(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                filterStatut === s
                  ? 'text-[#0A1628]'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
              style={filterStatut === s ? { background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' } : {}}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Liste commandes */}
      <div className="space-y-4">
        {filtered.map((cmd, i) => {
          const cfg = STATUT_CONFIG[cmd.statut]
          const StatutIcon = cfg.icon
          return (
            <motion.div
              key={cmd.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring' as const, delay: i * 0.08 }}
            >
              <Card className="bg-navy-card border-white/10 hover:border-[#D4AF37]/20 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
                          <StatutIcon className="w-5 h-5" style={{ color: cfg.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-bold">{cmd.produit}</span>
                            <Badge variant={cfg.badge}>{cmd.statut}</Badge>
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 font-mono">{cmd.id}</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-white font-black text-lg">{formatFCFA(cmd.montant)}</div>
                        <div className="text-xs text-gray-500">{cmd.quantite}</div>
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-start gap-2">
                        <Package className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">Vendeur</div>
                          <div className="text-sm text-white font-medium">{cmd.vendeur}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">Acheteur</div>
                          <div className="text-sm text-white font-medium">{cmd.acheteur}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">Incoterm</div>
                          <div className="text-sm font-bold" style={{ color: '#00BCD4' }}>{cmd.incoterm}</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Calendar className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-gray-500">Livraison prévue</div>
                          <div className="text-sm text-white font-medium">{fmtDate(cmd.dateLivraison)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">Avancement</span>
                        <span className="text-xs font-bold" style={{ color: cfg.color }}>
                          {cmd.avancement}%
                        </span>
                      </div>
                      <ProgressBar value={cmd.avancement} color={cfg.color} />
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <FileText className="w-3.5 h-3.5" />
                        Commande du {fmtDate(cmd.dateCommande)}
                      </div>
                      <Button size="sm" variant="ghost"
                        className="text-xs text-[#D4AF37] hover:text-[#E8C84A] hover:bg-[#D4AF37]/10 gap-1">
                        Voir détails <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>Aucune commande trouvée</p>
          </div>
        )}
      </div>
    </div>
  )
}

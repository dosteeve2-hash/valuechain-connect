'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText, TrendingUp, CheckCircle,
  Package, X, Printer, ChevronRight, Plus,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatFCFA } from '@/lib/fcfa'

// ─── Types ────────────────────────────────────────────────────────────────────

type StatutContrat = 'En négociation' | 'Signé' | 'En cours' | 'Terminé'
type Role = 'producteur' | 'transformateur'

interface Contrat {
  id: string
  producteur: string
  transformateur: string
  produit: string
  quantite: number   // tonnes
  prixTonne: number  // FCFA
  statut: StatutContrat
  dateDebut: string
  dateFin: string
  etapeActuelle: number // 0-4
}

// ─── Données mock ─────────────────────────────────────────────────────────────

const MOCK_CONTRATS: Contrat[] = [
  {
    id: 'CTR-001',
    producteur: 'Coopérative Koudougou',
    transformateur: 'Minoterie du Sahel',
    produit: 'Maïs jaune',
    quantite: 50,
    prixTonne: 175000,
    statut: 'En cours',
    dateDebut: '2026-07-01',
    dateFin: '2026-09-30',
    etapeActuelle: 3,
  },
  {
    id: 'CTR-002',
    producteur: 'Femmes Sahel SCOOP',
    transformateur: "L'Oréal Sourcing",
    produit: 'Beurre de karité',
    quantite: 5,
    prixTonne: 920000,
    statut: 'Signé',
    dateDebut: '2026-07-10',
    dateFin: '2026-08-15',
    etapeActuelle: 2,
  },
  {
    id: 'CTR-003',
    producteur: 'AgroTrack Exports',
    transformateur: 'Sesaco Japan',
    produit: 'Sésame blanc',
    quantite: 8,
    prixTonne: 450000,
    statut: 'Terminé',
    dateDebut: '2026-06-01',
    dateFin: '2026-06-30',
    etapeActuelle: 4,
  },
  {
    id: 'CTR-004',
    producteur: 'COOPAG Nord',
    transformateur: 'Akosombo Textiles',
    produit: 'Coton grade A',
    quantite: 20,
    prixTonne: 270000,
    statut: 'En négociation',
    dateDebut: '2026-07-14',
    dateFin: '2026-10-31',
    etapeActuelle: 1,
  },
]

// ─── Config statuts ───────────────────────────────────────────────────────────

const STATUT_CONFIG: Record<StatutContrat, {
  color: string; bg: string; badge: 'gold' | 'cyan' | 'green' | 'orange'
}> = {
  'En négociation': { color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', badge: 'orange' },
  'Signé':          { color: '#D4AF37', bg: 'rgba(212,175,55,0.08)', badge: 'gold' },
  'En cours':       { color: '#00BCD4', bg: 'rgba(0,188,212,0.08)',  badge: 'cyan' },
  'Terminé':        { color: '#10B981', bg: 'rgba(16,185,129,0.08)', badge: 'green' },
}

// ─── Étapes timeline ─────────────────────────────────────────────────────────

const ETAPES = ['Offre', 'Négociation', 'Signature', 'Livraison', 'Paiement']

// ─── Utils ────────────────────────────────────────────────────────────────────

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Timeline contrat ─────────────────────────────────────────────────────────

function TimelineContrat({ etape }: { etape: number }) {
  return (
    <div className="flex items-center gap-0 mt-4">
      {ETAPES.map((label, i) => {
        const done = i < etape
        const active = i === etape - 1
        const isLast = i === ETAPES.length - 1
        return (
          <div key={label} className="flex items-center flex-1 min-w-0">
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border transition-all ${
                done
                  ? 'bg-[#D4AF37] border-[#D4AF37] text-[#0A1628]'
                  : active
                  ? 'bg-[#D4AF37]/20 border-[#D4AF37] text-[#D4AF37]'
                  : 'bg-white/5 border-white/15 text-white/30'
              }`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-[8px] mt-1 text-center leading-tight ${
                done || active ? 'text-white/70' : 'text-white/25'
              }`}>
                {label}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-px mx-1 mb-4 ${done ? 'bg-[#D4AF37]/60' : 'bg-white/10'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ─── Modal Nouveau contrat ────────────────────────────────────────────────────

interface FormContrat {
  producteur: string
  transformateur: string
  produit: string
  quantite: string
  prixTonne: string
  dateDebut: string
  dateFin: string
}

function ModalNouveauContrat({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<FormContrat>({
    producteur: '', transformateur: '', produit: '',
    quantite: '', prixTonne: '', dateDebut: '2026-07-14', dateFin: '',
  })

  function patch(k: keyof FormContrat, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  const valeurTotale = Number(form.quantite) * Number(form.prixTonne)

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: 'spring' as const, damping: 20 }}
        className="w-full max-w-lg bg-[#060E1A] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[#D4AF37] font-bold text-lg">Nouveau contrat</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-xs mb-1.5 block">Producteur</label>
              <input
                value={form.producteur}
                onChange={e => patch('producteur', e.target.value)}
                placeholder="Nom du producteur"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1.5 block">Transformateur</label>
              <input
                value={form.transformateur}
                onChange={e => patch('transformateur', e.target.value)}
                placeholder="Nom de l'acheteur"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
          </div>

          <div>
            <label className="text-white/50 text-xs mb-1.5 block">Produit</label>
            <input
              value={form.produit}
              onChange={e => patch('produit', e.target.value)}
              placeholder="ex: Maïs jaune, Coton grade A…"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-xs mb-1.5 block">Quantité (tonnes)</label>
              <input
                type="number" min="0"
                value={form.quantite}
                onChange={e => patch('quantite', e.target.value)}
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1.5 block">Prix / tonne (FCFA)</label>
              <input
                type="number" min="0"
                value={form.prixTonne}
                onChange={e => patch('prixTonne', e.target.value)}
                placeholder="0"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
          </div>

          {valeurTotale > 0 && (
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-white/60 text-xs">Valeur totale</span>
              <span className="text-[#D4AF37] font-bold">{formatFCFA(valeurTotale)}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/50 text-xs mb-1.5 block">Date début</label>
              <input
                type="date" value={form.dateDebut}
                onChange={e => patch('dateDebut', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1.5 block">Date fin</label>
              <input
                type="date" value={form.dateFin}
                onChange={e => patch('dateFin', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37]/50"
              />
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-[#D4AF37] text-[#0A1628] font-bold rounded-xl text-sm hover:bg-[#D4AF37]/90 transition-colors mt-2"
          >
            Créer le contrat
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

const ROLE: Role = 'producteur'

const STATUTS_FILTER: (StatutContrat | 'Tous')[] = ['Tous', 'En négociation', 'Signé', 'En cours', 'Terminé']

export default function ContratsPage() {
  const [modal, setModal] = useState(false)
  const [filtre, setFiltre] = useState<StatutContrat | 'Tous'>('Tous')

  const filtered = filtre === 'Tous'
    ? MOCK_CONTRATS
    : MOCK_CONTRATS.filter(c => c.statut === filtre)

  const actifs = MOCK_CONTRATS.filter(c => c.statut === 'En cours' || c.statut === 'Signé').length
  const volumeTotal = MOCK_CONTRATS.reduce((s, c) => s + c.quantite, 0)
  const valeurTotale = MOCK_CONTRATS.reduce((s, c) => s + c.quantite * c.prixTonne, 0)

  return (
    <>
      <div className="space-y-8">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const }}
          className="flex items-start justify-between"
        >
          <div>
            <h1 className="text-3xl font-black text-white mb-1">Contrats</h1>
            <p className="text-gray-400">Gestion des accords B2B et suivi des engagements</p>
          </div>
          {ROLE === 'producteur' && (
            <Button
              onClick={() => setModal(true)}
              className="bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-[#0A1628] font-bold gap-2"
            >
              <Plus className="w-4 h-4" /> Nouveau contrat
            </Button>
          )}
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5">
          {[
            { label: 'Contrats actifs',        value: actifs.toString(),                       icon: CheckCircle, color: '#D4AF37' },
            { label: 'Volume sous contrat',     value: volumeTotal + ' t',                     icon: Package,     color: '#00BCD4' },
            { label: 'Valeur totale',           value: (valeurTotale / 1_000_000).toFixed(1) + 'M FCFA', icon: TrendingUp, color: '#10B981' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring' as const, delay: i * 0.08 }}
            >
              <Card className="border-white/10" style={{ backgroundColor: '#0D1A2D' }}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}>
                      <s.icon className="w-5 h-5" style={{ color: s.color }} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xl font-black text-white leading-tight">{s.value}</div>
                      <div className="text-xs text-gray-400 truncate">{s.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filtres statut */}
        <div className="flex gap-2 flex-wrap">
          {STATUTS_FILTER.map(s => (
            <button
              key={s}
              onClick={() => setFiltre(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filtre === s
                  ? 'text-[#0A1628]'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
              style={filtre === s ? { background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' } : {}}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Liste contrats */}
        <div className="space-y-5">
          {filtered.map((c, i) => {
            const cfg = STATUT_CONFIG[c.statut]
            const valeur = c.quantite * c.prixTonne
            return (
              <motion.div key={c.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring' as const, delay: i * 0.07 }}
              >
                <Card className="border-white/10 hover:border-[#D4AF37]/20 transition-all duration-300"
                  style={{ backgroundColor: '#0D1A2D' }}>
                  <CardContent className="pt-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
                          <FileText className="w-5 h-5" style={{ color: cfg.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white font-bold">{c.produit}</span>
                            <Badge variant={cfg.badge}>{c.statut}</Badge>
                          </div>
                          <div className="text-xs text-gray-500 font-mono mt-0.5">{c.id}</div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-white font-black">{formatFCFA(valeur)}</div>
                        <div className="text-xs text-gray-500">{c.quantite} tonnes · {formatFCFA(c.prixTonne)}/t</div>
                      </div>
                    </div>

                    {/* Parties */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-white/5 rounded-xl px-3 py-2">
                        <div className="text-[10px] text-gray-500 mb-0.5">Producteur</div>
                        <div className="text-sm text-white font-medium truncate">{c.producteur}</div>
                      </div>
                      <div className="bg-white/5 rounded-xl px-3 py-2">
                        <div className="text-[10px] text-gray-500 mb-0.5">Transformateur</div>
                        <div className="text-sm text-white font-medium truncate">{c.transformateur}</div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                      <span>📅 Du {fmtDate(c.dateDebut)}</span>
                      <span>→ {fmtDate(c.dateFin)}</span>
                    </div>

                    {/* Timeline */}
                    <TimelineContrat etape={c.etapeActuelle} />

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                      <button
                        onClick={() => window.print()}
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        Télécharger PDF
                      </button>
                      <Button size="sm" variant="ghost"
                        className="text-xs text-[#D4AF37] hover:text-[#E8C84A] hover:bg-[#D4AF37]/10 gap-1">
                        Voir détails <ChevronRight className="w-3 h-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Aucun contrat dans cette catégorie</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && <ModalNouveauContrat onClose={() => setModal(false)} />}
      </AnimatePresence>
    </>
  )
}

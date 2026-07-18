'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Truck, X, AlertTriangle, Package, Clock,
  CheckCircle, MapPin, ArrowRight, Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/* ─── Types ──────────────────────────────────────────── */

type EtapeLivraison = 'Commande' | 'Préparation' | 'En transit' | 'Douane' | 'Livré'
type StatutLivraison = 'En cours' | 'Livré' | 'Retard' | 'Incident'
type TypeIncident = 'Retard' | 'Dommage' | 'Perdu'

interface Livraison {
  id: string
  vendeur: string
  acheteur: string
  produit: string
  quantite: string
  origine: string
  destination: string
  statut: StatutLivraison
  etapeActuelle: EtapeLivraison
  dateEstimee: string
  incoterm: string
}

interface IncidentForm {
  type: TypeIncident | ''
  description: string
  livraisonId: string
}

/* ─── Mock data ──────────────────────────────────────── */

const MOCK_LIVRAISONS: Livraison[] = [
  {
    id: 'LIV-2026-001', vendeur: 'Coopérative Sahel Grains', acheteur: 'Akosombo Textiles Ltd',
    produit: 'Coton grade A', quantite: '20 t', origine: 'Ouagadougou, BF', destination: 'Tema, Ghana',
    statut: 'En cours', etapeActuelle: 'En transit', dateEstimee: '2026-07-22', incoterm: 'CIF Tema',
  },
  {
    id: 'LIV-2026-002', vendeur: 'Femmes Sahel SCOOP', acheteur: "L'Oréal Sourcing SA",
    produit: 'Beurre de karité', quantite: '3 t', origine: 'Ouahigouya, BF', destination: 'Port de Marseille',
    statut: 'Retard', etapeActuelle: 'Douane', dateEstimee: '2026-07-15', incoterm: 'FOB Lomé',
  },
  {
    id: 'LIV-2026-003', vendeur: 'Sesaco BF SARL', acheteur: 'Sesaco Japan Corp',
    produit: 'Huile de sésame', quantite: '5 500 kg', origine: 'Bobo-Dioulasso, BF', destination: 'Osaka, Japon',
    statut: 'En cours', etapeActuelle: 'Préparation', dateEstimee: '2026-08-05', incoterm: 'EXW Bobo',
  },
  {
    id: 'LIV-2026-004', vendeur: 'IndusFoods Dakar', acheteur: 'Cargill West Africa',
    produit: 'Tomate concentrée 28%', quantite: '8 400 kg', origine: 'Dakar, Sénégal', destination: 'Abidjan, CI',
    statut: 'Livré', etapeActuelle: 'Livré', dateEstimee: '2026-07-10', incoterm: 'DDP Abidjan',
  },
  {
    id: 'LIV-2026-005', vendeur: 'BioFarm Togo', acheteur: 'EcoBrands Paris',
    produit: 'Soja décortiqué bio', quantite: '18 t', origine: 'Lomé, Togo', destination: 'Le Havre, France',
    statut: 'En cours', etapeActuelle: 'En transit', dateEstimee: '2026-07-28', incoterm: 'FOB Lomé',
  },
  {
    id: 'LIV-2026-006', vendeur: 'AgroVast CI', acheteur: 'MiNoterie du Nord',
    produit: 'Maïs blanc grain sec', quantite: '200 t', origine: 'San-Pédro, CI', destination: 'Bamako, Mali',
    statut: 'Livré', etapeActuelle: 'Livré', dateEstimee: '2026-07-02', incoterm: 'DAP Bamako',
  },
  {
    id: 'LIV-2026-007', vendeur: 'SCOOP Nord Niger', acheteur: 'FoodPro Nigeria',
    produit: 'Niébé blanc calibré', quantite: '40 t', origine: 'Zinder, Niger', destination: 'Lagos, Nigeria',
    statut: 'Incident', etapeActuelle: 'En transit', dateEstimee: '2026-07-18', incoterm: 'CIF Lagos',
  },
]

const ETAPES: EtapeLivraison[] = ['Commande', 'Préparation', 'En transit', 'Douane', 'Livré']

const ETAPE_ICONS: Record<EtapeLivraison, typeof Package> = {
  'Commande': Package,
  'Préparation': Clock,
  'En transit': Truck,
  'Douane': AlertTriangle,
  'Livré': CheckCircle,
}

const STATUT_CONFIG: Record<StatutLivraison, { variant: 'green' | 'cyan' | 'orange' | 'red'; label: string; color: string }> = {
  'Livré': { variant: 'green', label: 'Livré', color: '#22C55E' },
  'En cours': { variant: 'cyan', label: 'En cours', color: '#00BCD4' },
  'Retard': { variant: 'orange', label: 'Retard', color: '#F97316' },
  'Incident': { variant: 'red', label: 'Incident', color: '#EF4444' },
}

const STATUTS_FILTER: Array<'Tous' | StatutLivraison> = ['Tous', 'En cours', 'Livré', 'Retard', 'Incident']
const PAYS_FILTER = ['Tous', 'Burkina Faso', 'Sénégal', 'Togo', "Côte d'Ivoire", 'Niger']

const KPI_CARDS = [
  { label: 'En cours', value: '4', icon: Truck, color: '#00BCD4', sub: '3 pays impliqués' },
  { label: 'Livrées ce mois', value: '2', icon: CheckCircle, color: '#22C55E', sub: '100% conformes' },
  { label: 'Retards', value: '2', icon: AlertTriangle, color: '#F97316', sub: '1 incident signalé' },
  { label: 'Délai moyen', value: '12 j', icon: Clock, color: '#D4AF37', sub: 'vs 14 j cible' },
]

/* ─── Timeline livraison ─────────────────────────────── */

function TimelineLivraison({ livraison }: { livraison: Livraison }) {
  const etapeIdx = ETAPES.indexOf(livraison.etapeActuelle)
  const isRetard = livraison.statut === 'Retard' || livraison.statut === 'Incident'

  return (
    <div className="flex items-center gap-1 w-full">
      {ETAPES.map((etape, idx) => {
        const Icon = ETAPE_ICONS[etape]
        const done = idx < etapeIdx
        const active = idx === etapeIdx
        const pending = idx > etapeIdx

        let color = '#374151'
        let bg = 'rgba(55,65,81,0.3)'
        let border = 'rgba(55,65,81,0.5)'

        if (done) { color = '#22C55E'; bg = 'rgba(34,197,94,0.15)'; border = 'rgba(34,197,94,0.4)' }
        if (active && !isRetard) { color = '#00BCD4'; bg = 'rgba(0,188,212,0.15)'; border = 'rgba(0,188,212,0.5)' }
        if (active && isRetard) { color = '#F97316'; bg = 'rgba(249,115,22,0.15)'; border = 'rgba(249,115,22,0.5)' }

        return (
          <div key={etape} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring' as const, delay: idx * 0.08 }}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: bg, border: `2px solid ${border}` }}>
                {active && !isRetard ? (
                  <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </motion.div>
                ) : (
                  <Icon className="w-3.5 h-3.5" style={{ color: pending ? '#374151' : color }} />
                )}
              </motion.div>
              <span className="text-[9px] text-center leading-tight"
                style={{ color: pending ? '#4B5563' : color, maxWidth: 48 }}>
                {etape}
              </span>
            </div>
            {idx < ETAPES.length - 1 && (
              <motion.div className="flex-1 h-0.5 mx-1"
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ type: 'spring' as const, delay: idx * 0.08 + 0.1 }}
                style={{
                  backgroundColor: done ? '#22C55E' : 'rgba(55,65,81,0.4)',
                  transformOrigin: 'left',
                }} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─── Modal Incident ─────────────────────────────────── */

function ModalIncident({ livraisons, onClose }: { livraisons: Livraison[]; onClose: () => void }) {
  const [form, setForm] = useState<IncidentForm>({ type: '', description: '', livraisonId: '' })

  const set = (k: keyof IncidentForm) => (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value } as IncidentForm))

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50 transition-colors'
  const labelCls = 'block text-xs text-gray-400 mb-1.5 font-medium'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(6,14,26,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring' as const }}
        className="w-full max-w-md rounded-2xl border border-white/10 p-6"
        style={{ backgroundColor: '#0F2040' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <h2 className="text-white font-bold text-lg">Signaler un incident</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className={labelCls}>Livraison concernée *</label>
            <select className={inputCls} value={form.livraisonId} onChange={set('livraisonId')}>
              <option value="">Sélectionner une livraison...</option>
              {livraisons.filter(l => l.statut !== 'Livré').map(l => (
                <option key={l.id} value={l.id}>{l.id} — {l.produit} ({l.origine} → {l.destination})</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Type d&apos;incident *</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Retard', 'Dommage', 'Perdu'] as TypeIncident[]).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                  className="py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                  style={{
                    backgroundColor: form.type === t
                      ? t === 'Retard' ? 'rgba(249,115,22,0.2)' : t === 'Dommage' ? 'rgba(212,175,55,0.2)' : 'rgba(239,68,68,0.2)'
                      : 'rgba(255,255,255,0.05)',
                    color: form.type === t
                      ? t === 'Retard' ? '#F97316' : t === 'Dommage' ? '#D4AF37' : '#EF4444'
                      : '#9CA3AF',
                    border: form.type === t
                      ? t === 'Retard' ? '1px solid rgba(249,115,22,0.4)' : t === 'Dommage' ? '1px solid rgba(212,175,55,0.4)' : '1px solid rgba(239,68,68,0.4)'
                      : '1px solid rgba(255,255,255,0.1)',
                  }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={labelCls}>Description *</label>
            <textarea className={`${inputCls} resize-none h-24`}
              placeholder="Décrivez l'incident en détail : date, lieu, circonstances..."
              value={form.description} onChange={set('description')} />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1 border-white/10 text-gray-300 hover:text-white">
            Annuler
          </Button>
          <Button
            disabled={!form.livraisonId || !form.type || !form.description}
            className="flex-1 font-bold"
            style={{ backgroundColor: 'rgba(239,68,68,0.9)', color: 'white' }}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            Signaler
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────── */

export default function LivraisonsClient() {
  const [statut, setStatut] = useState<'Tous' | StatutLivraison>('Tous')
  const [pays, setPays] = useState('Tous')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [modalIncident, setModalIncident] = useState(false)

  const filtered = useMemo(() => MOCK_LIVRAISONS.filter(l => {
    const matchStatut = statut === 'Tous' || l.statut === statut
    const matchPays = pays === 'Tous' || l.origine.includes(pays) || l.destination.includes(pays)
    return matchStatut && matchPays
  }), [statut, pays])

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const }}
        className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Suivi Livraisons</h1>
          <p className="text-gray-400">{filtered.length} livraison{filtered.length > 1 ? 's' : ''} · Zone CEDEAO</p>
        </div>
        <Button onClick={() => setModalIncident(true)}
          className="font-bold flex-shrink-0"
          style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.3)' }}>
          <AlertTriangle className="w-4 h-4 mr-2" /> Signaler incident
        </Button>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {KPI_CARDS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, delay: i * 0.08 }}>
            <Card className="border-white/10" style={{ backgroundColor: '#0F2040' }}>
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
                <div className="text-xs mt-0.5" style={{ color: s.color }}>{s.sub}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* FILTRES */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ type: 'spring' as const, delay: 0.3 }}
        className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
          <Filter className="w-3 h-3" /> Filtrer par
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUTS_FILTER.map(s => (
            <button key={s} onClick={() => setStatut(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: statut === s ? (s === 'Tous' ? '#D4AF37' : `${STATUT_CONFIG[s as StatutLivraison]?.color}30`) : 'rgba(255,255,255,0.05)',
                color: statut === s ? (s === 'Tous' ? '#0A1628' : STATUT_CONFIG[s as StatutLivraison]?.color) : '#9CA3AF',
                border: statut === s ? `1px solid ${s === 'Tous' ? '#D4AF37' : STATUT_CONFIG[s as StatutLivraison]?.color}` : '1px solid rgba(255,255,255,0.1)',
              }}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {PAYS_FILTER.map(p => (
            <button key={p} onClick={() => setPays(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                backgroundColor: pays === p ? 'rgba(0,188,212,0.15)' : 'rgba(255,255,255,0.05)',
                color: pays === p ? '#00BCD4' : '#9CA3AF',
                border: pays === p ? '1px solid rgba(0,188,212,0.4)' : '1px solid rgba(255,255,255,0.1)',
              }}>
              {p}
            </button>
          ))}
        </div>
      </motion.div>

      {/* TABLEAU LIVRAISONS */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, delay: 0.4 }}>
        <Card className="border-white/10" style={{ backgroundColor: '#0F2040' }}>
          <CardHeader>
            <CardTitle className="text-white text-lg font-bold">
              Livraisons ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((livraison, i) => {
                  const cfg = STATUT_CONFIG[livraison.statut]
                  const isExpanded = expandedId === livraison.id

                  return (
                    <motion.div key={livraison.id}
                      initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }} layout
                      transition={{ type: 'spring' as const, delay: i * 0.06 }}
                      className="rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-all duration-200"
                      style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>

                      {/* ROW PRINCIPALE */}
                      <button className="w-full text-left p-4"
                        onClick={() => setExpandedId(isExpanded ? null : livraison.id)}>
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                          {/* ID + produit */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: `${cfg.color}20`, border: `1px solid ${cfg.color}30` }}>
                              <Truck className="w-5 h-5" style={{ color: cfg.color }} />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-xs text-gray-500">{livraison.id}</span>
                                <Badge variant={cfg.variant}>{cfg.label}</Badge>
                              </div>
                              <div className="text-white font-semibold text-sm truncate mt-0.5">
                                {livraison.produit} · {livraison.quantite}
                              </div>
                            </div>
                          </div>

                          {/* Origine → Destination */}
                          <div className="flex items-center gap-2 text-sm flex-shrink-0">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-300 text-xs">{livraison.origine}</span>
                            </div>
                            <ArrowRight className="w-3 h-3 text-gray-600" />
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-500" />
                              <span className="text-gray-300 text-xs">{livraison.destination}</span>
                            </div>
                          </div>

                          {/* Date estimée */}
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs text-gray-500">Date estimée</div>
                            <div className="text-white text-sm font-semibold">{livraison.dateEstimee}</div>
                          </div>
                        </div>
                      </button>

                      {/* TIMELINE DÉPLIABLE */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ type: 'spring' as const }}
                            className="overflow-hidden">
                            <div className="px-4 pb-4 pt-2 border-t border-white/5">
                              <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
                                <div>
                                  <span className="text-gray-500 text-xs">Vendeur : </span>
                                  <span className="text-gray-300">{livraison.vendeur}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 text-xs">Acheteur : </span>
                                  <span className="text-gray-300">{livraison.acheteur}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 text-xs">Incoterm : </span>
                                  <span className="text-gray-300">{livraison.incoterm}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 text-xs">Étape actuelle : </span>
                                  <span style={{ color: cfg.color }}>{livraison.etapeActuelle}</span>
                                </div>
                              </div>
                              <TimelineLivraison livraison={livraison} />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )
                })}
              </AnimatePresence>

              {filtered.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Truck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Aucune livraison ne correspond aux filtres</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* MODAL INCIDENT */}
      {modalIncident && (
        <ModalIncident livraisons={MOCK_LIVRAISONS} onClose={() => setModalIncident(false)} />
      )}
    </div>
  )
}

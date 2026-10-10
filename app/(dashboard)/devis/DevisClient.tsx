'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, TrendingUp, Clock, CheckCircle, FileText, MapPin, Search, X, Send, PhoneCall } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { formatFCFA, formatNombre } from '@/lib/fcfa'

type StatutType = 'En négociation' | 'Accepté' | 'En attente' | 'Refusé'

const INITIAL_DEVIS = [
  { id: 'DV-001', produit: 'Coton grade A', acheteur: 'Filature Ghana (démo)', pays: 'Ghana', quantite: '20 tonnes', prixPropose: 270000, prixDemande: 285000, montantTotal: 5400000, dateEnvoi: '2026-07-10', statut: 'En négociation' as StatutType, message: 'Intéressé par volume plus important si prix négociable' },
  { id: 'DV-002', produit: 'Beurre de karité', acheteur: "Acheteur cosmétique (démo)", pays: 'France', quantite: '3 tonnes', prixPropose: 920000, prixDemande: 920000, montantTotal: 2760000, dateEnvoi: '2026-07-08', statut: 'Accepté' as StatutType, message: 'Besoin certification ECOCERT confirmée' },
  { id: 'DV-003', produit: 'Sésame blanc', acheteur: 'Acheteur Japon (démo)', pays: 'Japon', quantite: '5 tonnes', prixPropose: 450000, prixDemande: 480000, montantTotal: 2250000, dateEnvoi: '2026-07-05', statut: 'En attente' as StatutType, message: '' },
  { id: 'DV-004', produit: 'Maïs blanc grain sec', acheteur: 'Ivoire Agro Distribution', pays: "Côte d'Ivoire", quantite: '100 tonnes', prixPropose: 138000, prixDemande: 145000, montantTotal: 13800000, dateEnvoi: '2026-07-12', statut: 'En négociation' as StatutType, message: 'Livraison échelonnée sur 3 mois souhaitée' },
  { id: 'DV-005', produit: 'Arachides décortiquées', acheteur: 'Dakar Nut Traders', pays: 'Sénégal', quantite: '10 tonnes', prixPropose: 375000, prixDemande: 380000, montantTotal: 3750000, dateEnvoi: '2026-07-02', statut: 'Refusé' as StatutType, message: 'Prix trop élevé pour notre budget actuel' },
  { id: 'DV-006', produit: 'Coton fibre longue', acheteur: 'Anatolia Textile Group', pays: 'Turquie', quantite: '60 tonnes', prixPropose: 300000, prixDemande: 310000, montantTotal: 18000000, dateEnvoi: '2026-07-14', statut: 'En attente' as StatutType, message: 'Vérification qualité avant confirmation' },
  { id: 'DV-007', produit: 'Sorgho rouge', acheteur: 'Sahel Food Processing', pays: 'Burkina Faso', quantite: '40 tonnes', prixPropose: 128000, prixDemande: 130000, montantTotal: 5120000, dateEnvoi: '2026-06-28', statut: 'Accepté' as StatutType, message: '' },
  { id: 'DV-008', produit: 'Riz local étuvé', acheteur: 'SONAGESS', pays: 'Burkina Faso', quantite: '30 tonnes', prixPropose: 315000, prixDemande: 320000, montantTotal: 9450000, dateEnvoi: '2026-07-15', statut: 'En négociation' as StatutType, message: 'Achat institutionnel, appel d’offres en cours' },
  { id: 'DV-009', produit: 'Engrais NPK 15-15-15', acheteur: 'Coopérative Agricole Yako', pays: 'Burkina Faso', quantite: '200 sacs', prixPropose: 21000, prixDemande: 22000, montantTotal: 4200000, dateEnvoi: '2026-07-01', statut: 'En attente' as StatutType, message: '' },
]

const STATUT_CONFIG: Record<StatutType, { label: string; color: string; bg: string; border: string; icon: typeof Clock }> = {
  'En négociation': { label: 'En négociation', color: '#F97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', icon: TrendingUp },
  'Accepté': { label: 'Accepté', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', icon: CheckCircle },
  'En attente': { label: 'En attente', color: '#00BCD4', bg: 'rgba(0,188,212,0.1)', border: 'rgba(0,188,212,0.3)', icon: Clock },
  'Refusé': { label: 'Refusé', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', icon: FileText },
}

const STATUT_FILTERS: Array<'Tous' | StatutType> = ['Tous', 'En négociation', 'Accepté', 'En attente', 'Refusé']


export default function DevisClient() {
  const [devisList, setDevisList] = useState(INITIAL_DEVIS)
  const [search, setSearch] = useState('')
  const [statutFilter, setStatutFilter] = useState<'Tous' | StatutType>('Tous')
  const [modalDevisId, setModalDevisId] = useState<string | null>(null)

  const stats = useMemo(() => {
    const enNegociation = devisList.filter(d => d.statut === 'En négociation').length
    const acceptes = devisList.filter(d => d.statut === 'Accepté').length
    const caPotentiel = devisList
      .filter(d => d.statut !== 'Refusé')
      .reduce((sum, d) => sum + d.montantTotal, 0)
    return {
      total: devisList.length,
      enNegociation,
      acceptes,
      caPotentiel,
    }
  }, [devisList])

  const STATS_DEVIS = [
    { label: 'Devis reçus', value: stats.total.toString(), icon: FileText, color: '#D4AF37' },
    { label: 'En négociation', value: stats.enNegociation.toString(), icon: TrendingUp, color: '#F97316' },
    { label: 'Acceptés', value: stats.acceptes.toString(), icon: CheckCircle, color: '#22C55E' },
    { label: 'CA potentiel', value: (stats.caPotentiel / 1000000).toFixed(1) + 'M', icon: TrendingUp, color: '#00BCD4' },
  ]

  const filtered = useMemo(() => devisList.filter(d => {
    const matchSearch = d.produit.toLowerCase().includes(search.toLowerCase()) ||
      d.acheteur.toLowerCase().includes(search.toLowerCase())
    const matchStatut = statutFilter === 'Tous' || d.statut === statutFilter
    return matchSearch && matchStatut
  }), [devisList, search, statutFilter])

  const modalDevis = devisList.find(d => d.id === modalDevisId) || null

  function accepterDevis(id: string) {
    setDevisList(prev => prev.map(d => d.id === id ? { ...d, statut: 'Accepté' as StatutType } : d))
    setModalDevisId(null)
  }

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const }}>
        <h1 className="text-3xl font-black text-white mb-1">Devis reçus</h1>
        <p className="text-gray-400">Gérez vos négociations commerciales</p>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {STATS_DEVIS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, delay: i * 0.08 }}>
            <Card className="bg-navy-card border-white/10">
              <CardContent className="pt-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}>
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
                </div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* FILTRES */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Rechercher un produit ou acheteur..." className="pl-10"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUT_FILTERS.map(s => (
            <button key={s} onClick={() => setStatutFilter(s)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: statutFilter === s ? '#D4AF37' : 'rgba(255,255,255,0.05)',
                color: statutFilter === s ? '#0A1628' : '#9CA3AF',
                border: statutFilter === s ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
              }}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* DEVIS LIST */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((devis, i) => {
            const cfg = STATUT_CONFIG[devis.statut]
            const Icon = cfg.icon
            return (
              <motion.div key={devis.id} layout
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring' as const, delay: i * 0.06 }}>
                <Card className="bg-navy-card border-white/10 hover:border-[#D4AF37]/20 transition-all duration-300">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                          <Icon className="w-6 h-6" style={{ color: cfg.color }} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="font-mono text-xs text-gray-500">{devis.id}</span>
                            <div className="px-2 py-0.5 rounded-full text-xs font-semibold"
                              style={{ backgroundColor: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                              {cfg.label}
                            </div>
                          </div>
                          <h3 className="text-white font-bold text-base">{devis.produit}</h3>
                          <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            <span>{devis.acheteur} • {devis.pays}</span>
                          </div>
                          {devis.message && (
                            <div className="mt-3 p-3 rounded-lg text-sm text-gray-300 italic"
                              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                              &ldquo;{devis.message}&rdquo;
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-black text-white">{formatFCFA(devis.montantTotal)}</div>
                          <div className="text-sm text-gray-400">{devis.quantite}</div>
                        </div>
                        <div className="text-right text-xs text-gray-500">
                          <div>Prix proposé : <span className="text-white font-semibold">{formatNombre(devis.prixPropose)} FCFA</span></div>
                          <div>Prix demandé : <span className="text-gray-300">{formatNombre(devis.prixDemande)} FCFA</span></div>
                          <div className="mt-1">Envoyé le {devis.dateEnvoi}</div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2"
                          onClick={() => setModalDevisId(devis.id)}>
                          <MessageSquare className="w-4 h-4" /> Répondre
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Aucun devis ne correspond à vos filtres</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {modalDevis && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            onClick={() => setModalDevisId(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }} transition={{ type: 'spring' as const }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 p-6"
              style={{ backgroundColor: '#0F2040' }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="font-mono text-xs text-gray-500">{modalDevis.id}</span>
                  <h3 className="text-white font-bold text-lg">{modalDevis.produit}</h3>
                </div>
                <button onClick={() => setModalDevisId(null)} className="text-gray-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 mb-6 text-sm">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{modalDevis.acheteur} • {modalDevis.pays}</span>
                </div>
                <div className="flex justify-between pt-2">
                  <span className="text-gray-400">Montant total</span>
                  <span className="text-white font-bold">{formatFCFA(modalDevis.montantTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Prix proposé</span>
                  <span className="text-white">{formatNombre(modalDevis.prixPropose)} FCFA</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button className="flex-1 gap-2 bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] font-bold"
                  disabled={modalDevis.statut === 'Accepté'}
                  onClick={() => accepterDevis(modalDevis.id)}>
                  <Send className="w-4 h-4" />
                  {modalDevis.statut === 'Accepté' ? 'Déjà accepté' : 'Accepter le devis'}
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={() => setModalDevisId(null)}>
                  <PhoneCall className="w-4 h-4" /> Contacter l&apos;acheteur
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

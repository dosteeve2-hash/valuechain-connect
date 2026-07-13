'use client'

import { motion } from 'framer-motion'
import { MessageSquare, TrendingUp, Clock, CheckCircle, FileText, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MOCK_DEVIS = [
  { id: 'DV-001', produit: 'Coton grade A', acheteur: 'Akosombo Textiles Ltd', pays: 'Ghana', quantite: '20 tonnes', prixPropose: 270000, prixDemande: 285000, montantTotal: 5400000, dateEnvoi: '2026-07-10', statut: 'En négociation', message: 'Intéressé par volume plus important si prix négociable' },
  { id: 'DV-002', produit: 'Beurre de karité', acheteur: "L'Oréal Sourcing SA", pays: 'France', quantite: '3 tonnes', prixPropose: 920000, prixDemande: 920000, montantTotal: 2760000, dateEnvoi: '2026-07-08', statut: 'Accepté', message: 'Besoin certification ECOCERT confirmée' },
  { id: 'DV-003', produit: 'Sésame blanc', acheteur: 'Sesaco Japan Corp', pays: 'Japon', quantite: '5 tonnes', prixPropose: 450000, prixDemande: 480000, montantTotal: 2250000, dateEnvoi: '2026-07-05', statut: 'En attente', message: '' },
]

type StatutType = 'En négociation' | 'Accepté' | 'En attente' | 'Refusé'

const STATUT_CONFIG: Record<StatutType, { label: string; color: string; bg: string; border: string; icon: typeof Clock }> = {
  'En négociation': { label: 'En négociation', color: '#F97316', bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.3)', icon: TrendingUp },
  'Accepté': { label: 'Accepté', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.3)', icon: CheckCircle },
  'En attente': { label: 'En attente', color: '#00BCD4', bg: 'rgba(0,188,212,0.1)', border: 'rgba(0,188,212,0.3)', icon: Clock },
  'Refusé': { label: 'Refusé', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', icon: FileText },
}

const STATS_DEVIS = [
  { label: 'Devis reçus', value: '3', icon: FileText, color: '#D4AF37' },
  { label: 'En négociation', value: '1', icon: TrendingUp, color: '#F97316' },
  { label: 'Acceptés', value: '1', icon: CheckCircle, color: '#22C55E' },
  { label: 'CA potentiel', value: '10.4M', icon: TrendingUp, color: '#00BCD4' },
]

function fmt(n: number) { return n.toLocaleString('fr') + ' FCFA' }

export default function DevisClient() {
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

      {/* DEVIS LIST */}
      <div className="space-y-4">
        {MOCK_DEVIS.map((devis, i) => {
          const cfg = STATUT_CONFIG[devis.statut as StatutType] || STATUT_CONFIG['En attente']
          const Icon = cfg.icon
          return (
            <motion.div key={devis.id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ type: 'spring' as const, delay: i * 0.1 }}>
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
                        <div className="text-2xl font-black text-white">{fmt(devis.montantTotal)}</div>
                        <div className="text-sm text-gray-400">{devis.quantite}</div>
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        <div>Prix proposé : <span className="text-white font-semibold">{devis.prixPropose.toLocaleString('fr')} FCFA</span></div>
                        <div>Prix demandé : <span className="text-gray-300">{devis.prixDemande.toLocaleString('fr')} FCFA</span></div>
                        <div className="mt-1">Envoyé le {devis.dateEnvoi}</div>
                      </div>
                      <Button variant="outline" size="sm" className="gap-2">
                        <MessageSquare className="w-4 h-4" /> Répondre
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

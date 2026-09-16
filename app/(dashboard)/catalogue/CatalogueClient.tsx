'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Search, MapPin, Star, Package, ShieldCheck, Layers, Coins, Tags } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatNombre } from '@/lib/fcfa'

type Disponibilite = 'En stock' | 'Stock limité' | 'Rupture'

const MOCK_OFFRES = [
  { id: '1', produit: 'Coton grade A', vendeur: 'Coopérative Koudougou', pays: 'Burkina Faso', categorie: 'Coton', quantite: '50 tonnes', prixUnitaire: 285000, unite: 'tonne', prixTotal: 14250000, certification: ['Organique'], note: 4.9, avis: 23, livraison: 'FOB Lomé', disponibilite: 'En stock' as Disponibilite },
  { id: '2', produit: 'Sésame blanc décortiqué', vendeur: 'AgroTrack Exports', pays: 'Burkina Faso', categorie: 'Sésame', quantite: '8 tonnes', prixUnitaire: 480000, unite: 'tonne', prixTotal: 3840000, certification: ['Non OGM'], note: 4.7, avis: 14, livraison: 'EXW Ouagadougou', disponibilite: 'Stock limité' as Disponibilite },
  { id: '3', produit: 'Beurre de karité grade A', vendeur: 'Femmes Sahel SCOOP', pays: 'Burkina Faso', categorie: 'Karité', quantite: '3 tonnes', prixUnitaire: 920000, unite: 'tonne', prixTotal: 2760000, certification: ['Fair Trade', 'ECOCERT'], note: 5.0, avis: 8, livraison: 'FCA Ouaga', disponibilite: 'En stock' as Disponibilite },
  { id: '4', produit: 'Maïs blanc grain sec', vendeur: 'Coopérative Bobo-Dioulasso', pays: 'Burkina Faso', categorie: 'Maïs', quantite: '200 tonnes', prixUnitaire: 145000, unite: 'tonne', prixTotal: 29000000, certification: [], note: 4.5, avis: 31, livraison: 'FOB Abidjan', disponibilite: 'En stock' as Disponibilite },
  { id: '5', produit: 'Arachides décortiquées', vendeur: 'SCOOP Arachide Sahel', pays: 'Sénégal', categorie: 'Arachide', quantite: '15 tonnes', prixUnitaire: 380000, unite: 'tonne', prixTotal: 5700000, certification: ['Non OGM'], note: 4.8, avis: 19, livraison: 'FOB Dakar', disponibilite: 'En stock' as Disponibilite },
  { id: '6', produit: 'Coton fibre longue', vendeur: 'SOCOMA BF', pays: 'Burkina Faso', categorie: 'Coton', quantite: '120 tonnes', prixUnitaire: 310000, unite: 'tonne', prixTotal: 37200000, certification: ['Cotonnière BF'], note: 4.9, avis: 45, livraison: 'CIF Cotonou', disponibilite: 'En stock' as Disponibilite },
  { id: '7', produit: 'Sorgho rouge', vendeur: 'Coopérative Fada N’Gourma', pays: 'Burkina Faso', categorie: 'Sorgho', quantite: '80 tonnes', prixUnitaire: 130000, unite: 'tonne', prixTotal: 10400000, certification: [], note: 4.4, avis: 12, livraison: 'EXW Fada', disponibilite: 'En stock' as Disponibilite },
  { id: '8', produit: 'Mil grain', vendeur: 'Union Coop Dori', pays: 'Burkina Faso', categorie: 'Mil', quantite: '60 tonnes', prixUnitaire: 138000, unite: 'tonne', prixTotal: 8280000, certification: [], note: 4.3, avis: 9, livraison: 'EXW Dori', disponibilite: 'Stock limité' as Disponibilite },
  { id: '9', produit: 'Riz local étuvé', vendeur: 'Coopérative Bagré', pays: 'Burkina Faso', categorie: 'Riz', quantite: '45 tonnes', prixUnitaire: 320000, unite: 'tonne', prixTotal: 14400000, certification: ['Label Riz BF'], note: 4.6, avis: 17, livraison: 'EXW Bagré', disponibilite: 'Rupture' as Disponibilite },
  { id: '10', produit: 'Engrais NPK 15-15-15', vendeur: 'AgroSupply BF', pays: 'Burkina Faso', categorie: 'Intrants', quantite: '500 sacs (50kg)', prixUnitaire: 22000, unite: 'sac', prixTotal: 11000000, certification: [], note: 4.5, avis: 27, livraison: 'EXW Ouaga', disponibilite: 'En stock' as Disponibilite },
  { id: '11', produit: 'Semences maïs hybride', vendeur: 'SODEPRA Semences', pays: 'Burkina Faso', categorie: 'Intrants', quantite: '2000 sacs', prixUnitaire: 18500, unite: 'sac', prixTotal: 37000000, certification: ['Certifié INERA'], note: 4.7, avis: 33, livraison: 'EXW Bobo', disponibilite: 'En stock' as Disponibilite },
  { id: '12', produit: 'Pulvérisateur à dos 16L', vendeur: 'EquipAgro Ouaga', pays: 'Burkina Faso', categorie: 'Équipement', quantite: '150 unités', prixUnitaire: 28000, unite: 'unité', prixTotal: 4200000, certification: [], note: 4.2, avis: 11, livraison: 'EXW Ouaga', disponibilite: 'Stock limité' as Disponibilite },
  { id: '13', produit: 'Kit tracteur motoculteur', vendeur: 'MécaSahel Équipement', pays: 'Burkina Faso', categorie: 'Équipement', quantite: '12 unités', prixUnitaire: 3200000, unite: 'unité', prixTotal: 38400000, certification: ['Garantie 2 ans'], note: 4.8, avis: 6, livraison: 'EXW Bobo', disponibilite: 'Rupture' as Disponibilite },
]

const CATEGORIES = ['Tous', 'Coton', 'Sésame', 'Karité', 'Maïs', 'Arachide', 'Sorgho', 'Mil', 'Riz', 'Intrants', 'Équipement']
const DISPONIBILITES = ['Toutes', 'En stock', 'Stock limité', 'Rupture']
const PRIX_RANGES = ['Tous', '< 100k', '100k - 500k', '> 500k']

const CAT_COLORS: Record<string, string> = {
  Coton: '#10B981', Sésame: '#F59E0B', Karité: '#D97706',
  Maïs: '#EA580C', Arachide: '#EF4444', Sorgho: '#A16207',
  Mil: '#CA8A04', Riz: '#65A30D', Intrants: '#6366F1', Équipement: '#64748B',
}

const DISPO_CONFIG: Record<Disponibilite, { color: string; badge: 'green' | 'orange' | 'red' }> = {
  'En stock': { color: '#22C55E', badge: 'green' },
  'Stock limité': { color: '#F97316', badge: 'orange' },
  'Rupture': { color: '#EF4444', badge: 'red' },
}

function StarRating({ note, avis }: { note: number; avis: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1,2,3,4,5].map(i => (
        <Star key={i} className="w-3 h-3" fill={i <= Math.round(note) ? '#D4AF37' : 'none'}
          style={{ color: '#D4AF37' }} />
      ))}
      <span className="text-xs text-gray-400 ml-1">{note} ({avis} avis)</span>
    </div>
  )
}

function inPriceRange(prix: number, range: string) {
  if (range === 'Tous') return true
  if (range === '< 100k') return prix < 100000
  if (range === '100k - 500k') return prix >= 100000 && prix <= 500000
  return prix > 500000
}

export default function CatalogueClient() {
  const [search, setSearch] = useState('')
  const [categorie, setCategorie] = useState('Tous')
  const [disponibilite, setDisponibilite] = useState('Toutes')
  const [prixRange, setPrixRange] = useState('Tous')
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const filtered = useMemo(() => MOCK_OFFRES.filter(o => {
    const matchSearch = o.produit.toLowerCase().includes(search.toLowerCase()) ||
      o.vendeur.toLowerCase().includes(search.toLowerCase())
    const matchCat = categorie === 'Tous' || o.categorie === categorie
    const matchDispo = disponibilite === 'Toutes' || o.disponibilite === disponibilite
    const matchPrix = inPriceRange(o.prixUnitaire, prixRange)
    return matchSearch && matchCat && matchDispo && matchPrix
  }), [search, categorie, disponibilite, prixRange])

  const kpis = useMemo(() => {
    const valeurTotale = MOCK_OFFRES.reduce((sum, o) => sum + o.prixTotal, 0)
    const categoriesActives = new Set(MOCK_OFFRES.map(o => o.categorie)).size
    const noteMoyenne = MOCK_OFFRES.reduce((sum, o) => sum + o.note, 0) / MOCK_OFFRES.length
    return {
      produitsActifs: MOCK_OFFRES.length,
      valeurTotale,
      categoriesActives,
      noteMoyenne,
    }
  }, [])

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {}
    MOCK_OFFRES.forEach(o => { counts[o.categorie] = (counts[o.categorie] || 0) + 1 })
    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [])

  const KPI_CARDS = [
    { label: 'Produits actifs', value: kpis.produitsActifs.toString(), icon: Package, color: '#D4AF37' },
    { label: 'Valeur totale catalogue', value: (kpis.valeurTotale / 1000000).toFixed(1) + 'M FCFA', icon: Coins, color: '#00BCD4' },
    { label: 'Catégories', value: kpis.categoriesActives.toString(), icon: Tags, color: '#D4AF37' },
    { label: 'Note moyenne', value: kpis.noteMoyenne.toFixed(1) + '/5', icon: Star, color: '#00BCD4' },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const }}>
        <h1 className="text-3xl font-black text-white mb-1">Catalogue</h1>
        <p className="text-gray-400">{filtered.length} offre{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''} sur {MOCK_OFFRES.length}</p>
      </motion.div>

      {/* KPIS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {KPI_CARDS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, delay: i * 0.08 }}>
            <Card className="bg-navy-card border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300">
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

      {/* CHART */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, delay: 0.3 }}>
        <Card className="bg-navy-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg font-bold flex items-center gap-2">
              <Layers className="w-4 h-4" style={{ color: '#D4AF37' }} />
              Répartition par catégorie
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mounted ? (
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100} paddingAngle={2}>
                    {chartData.map(entry => (
                      <Cell key={entry.name} fill={CAT_COLORS[entry.name] || '#D4AF37'} stroke="#0A1628" />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0F2040', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 12, color: '#fff' }}
                    formatter={(v) => [`${v} produit(s)`, '']}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, color: '#9CA3AF' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px]" />
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* FILTRES */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Rechercher un produit ou vendeur..." className="pl-10"
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategorie(cat)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: categorie === cat ? '#D4AF37' : 'rgba(255,255,255,0.05)',
                color: categorie === cat ? '#0A1628' : '#9CA3AF',
                border: categorie === cat ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
              }}>
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {DISPONIBILITES.map(d => (
            <button key={d} onClick={() => setDisponibilite(d)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: disponibilite === d ? '#00BCD4' : 'rgba(255,255,255,0.05)',
                color: disponibilite === d ? '#0A1628' : '#9CA3AF',
                border: disponibilite === d ? '1px solid #00BCD4' : '1px solid rgba(255,255,255,0.1)',
              }}>
              {d}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {PRIX_RANGES.map(p => (
            <button key={p} onClick={() => setPrixRange(p)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: prixRange === p ? '#D4AF37' : 'rgba(255,255,255,0.05)',
                color: prixRange === p ? '#0A1628' : '#9CA3AF',
                border: prixRange === p ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
              }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* GRID OFFRES */}
      <AnimatePresence mode="popLayout">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((offre, i) => {
            const dispoCfg = DISPO_CONFIG[offre.disponibilite]
            return (
              <motion.div key={offre.id}
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }} layout
                transition={{ type: 'spring' as const, delay: i * 0.06 }}
                className="rounded-2xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-300 group"
                style={{ backgroundColor: '#0F2040' }}>
                {/* PHOTO PLACEHOLDER */}
                <div className="h-40 relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${CAT_COLORS[offre.categorie] || '#0A1628'}33 0%, #0A1628 100%)` }}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Package className="w-12 h-12 opacity-20 text-white" />
                  </div>
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 rounded-md text-xs font-bold text-white"
                      style={{ backgroundColor: CAT_COLORS[offre.categorie] || '#D4AF37' }}>
                      {offre.categorie}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-white text-xs font-bold">{offre.quantite}</span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-white font-bold text-base group-hover:text-[#D4AF37] transition-colors">
                      {offre.produit}
                    </h3>
                    <Badge variant={dispoCfg.badge} className="shrink-0">{offre.disponibilite}</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                    <MapPin className="w-3 h-3" />
                    <span>{offre.vendeur} • {offre.pays}</span>
                  </div>
                  <StarRating note={offre.note} avis={offre.avis} />

                  {offre.certification.length > 0 && (
                    <div className="flex gap-1.5 mt-3 flex-wrap">
                      {offre.certification.map(c => (
                        <div key={c} className="flex items-center gap-1 px-2 py-0.5 rounded-full border"
                          style={{ borderColor: 'rgba(212,175,55,0.3)', backgroundColor: 'rgba(212,175,55,0.08)' }}>
                          <ShieldCheck className="w-3 h-3" style={{ color: '#D4AF37' }} />
                          <span className="text-xs" style={{ color: '#D4AF37' }}>{c}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <div className="text-xl font-black text-white">
                        {formatNombre(offre.prixUnitaire)}
                      </div>
                      <div className="text-xs text-gray-400">FCFA / {offre.unite}</div>
                    </div>
                    <Button size="sm" disabled={offre.disponibilite === 'Rupture'}
                      className="bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] font-bold text-xs disabled:opacity-40">
                      Demander un devis
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">{offre.livraison}</div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Aucune offre ne correspond à vos filtres</p>
        </div>
      )}
    </div>
  )
}

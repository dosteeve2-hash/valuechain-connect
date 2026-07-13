'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, Star, Package, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

const MOCK_OFFRES = [
  { id: '1', produit: 'Coton grade A', vendeur: 'Coopérative Koudougou', pays: 'Burkina Faso', categorie: 'Coton', quantite: '50 tonnes', prixUnitaire: 285000, unite: 'tonne', prixTotal: 14250000, certification: ['Organique'], note: 4.9, avis: 23, livraison: 'FOB Lomé' },
  { id: '2', produit: 'Sésame blanc décortiqué', vendeur: 'AgroTrack Exports', pays: 'Burkina Faso', categorie: 'Sésame', quantite: '8 tonnes', prixUnitaire: 480000, unite: 'tonne', prixTotal: 3840000, certification: ['Non OGM'], note: 4.7, avis: 14, livraison: 'EXW Ouagadougou' },
  { id: '3', produit: 'Beurre de karité grade A', vendeur: 'Femmes Sahel SCOOP', pays: 'Burkina Faso', categorie: 'Karité', quantite: '3 tonnes', prixUnitaire: 920000, unite: 'tonne', prixTotal: 2760000, certification: ['Fair Trade', 'ECOCERT'], note: 5.0, avis: 8, livraison: 'FCA Ouaga' },
  { id: '4', produit: 'Maïs blanc grain sec', vendeur: 'Coopérative Bobo-Dioulasso', pays: 'Burkina Faso', categorie: 'Maïs', quantite: '200 tonnes', prixUnitaire: 145000, unite: 'tonne', prixTotal: 29000000, certification: [], note: 4.5, avis: 31, livraison: 'FOB Abidjan' },
  { id: '5', produit: 'Arachides décortiquées', vendeur: 'SCOOP Arachide Sahel', pays: 'Sénégal', categorie: 'Arachide', quantite: '15 tonnes', prixUnitaire: 380000, unite: 'tonne', prixTotal: 5700000, certification: ['Non OGM'], note: 4.8, avis: 19, livraison: 'FOB Dakar' },
  { id: '6', produit: 'Coton fibre longue', vendeur: 'SOCOMA BF', pays: 'Burkina Faso', categorie: 'Coton', quantite: '120 tonnes', prixUnitaire: 310000, unite: 'tonne', prixTotal: 37200000, certification: ['Cotonnière BF'], note: 4.9, avis: 45, livraison: 'CIF Cotonou' },
]

const CATEGORIES = ['Tous', 'Coton', 'Sésame', 'Karité', 'Maïs', 'Arachide']
const PAYS_OPTIONS = ['Tous', 'Burkina Faso', 'Sénégal', "Côte d'Ivoire"]

const CAT_COLORS: Record<string, string> = {
  Coton: '#10B981', Sésame: '#F59E0B', Karité: '#D97706',
  Maïs: '#EA580C', Arachide: '#EF4444', Bétail: '#8B5CF6',
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

export default function CatalogueClient() {
  const [search, setSearch] = useState('')
  const [categorie, setCategorie] = useState('Tous')
  const [pays, setPays] = useState('Tous')

  const filtered = useMemo(() => MOCK_OFFRES.filter(o => {
    const matchSearch = o.produit.toLowerCase().includes(search.toLowerCase()) ||
      o.vendeur.toLowerCase().includes(search.toLowerCase())
    const matchCat = categorie === 'Tous' || o.categorie === categorie
    const matchPays = pays === 'Tous' || o.pays === pays
    return matchSearch && matchCat && matchPays
  }), [search, categorie, pays])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white mb-1">Catalogue</h1>
        <p className="text-gray-400">{filtered.length} offre{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}</p>
      </div>

      {/* FILTRES */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
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
          {PAYS_OPTIONS.map(p => (
            <button key={p} onClick={() => setPays(p)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: pays === p ? '#00BCD4' : 'rgba(255,255,255,0.05)',
                color: pays === p ? '#0A1628' : '#9CA3AF',
                border: pays === p ? '1px solid #00BCD4' : '1px solid rgba(255,255,255,0.1)',
              }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* GRID OFFRES */}
      <AnimatePresence mode="popLayout">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((offre, i) => (
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
                <h3 className="text-white font-bold text-base mb-1 group-hover:text-[#D4AF37] transition-colors">
                  {offre.produit}
                </h3>
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
                      {offre.prixUnitaire.toLocaleString('fr')}
                    </div>
                    <div className="text-xs text-gray-400">FCFA / {offre.unite}</div>
                  </div>
                  <Button size="sm" className="bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] font-bold text-xs">
                    Demander un devis
                  </Button>
                </div>
                <div className="text-xs text-gray-500 mt-2">{offre.livraison}</div>
              </div>
            </motion.div>
          ))}
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

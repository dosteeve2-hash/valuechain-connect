'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, MapPin, Package, CheckCircle2, SlidersHorizontal, Leaf, Send } from 'lucide-react'
import { formatFCFA, formatNombre, parseMontant } from '@/lib/fcfa'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Producteur {
  id: string
  nom: string
  culture: string
  quantite: number
  region: string
  prix: number
  disponible: boolean
  avatar: string
  description: string
  certification: string
}

interface OffreForm {
  quantite: string
  prixPropose: string
  message: string
  contact: string
}

// ─── 10 producteurs fictifs BF ───────────────────────────────────────────────

const PRODUCTEURS: Producteur[] = [
  {
    id: '1', nom: 'Amadou Sawadogo', culture: 'Sésame',
    quantite: 8_200, region: 'Dédougou', prix: 680, disponible: true,
    avatar: 'AS', certification: 'Biologique',
    description: 'Sésame blanc premium, certifié bio. Récolte 2026, humidité < 6 %.',
  },
  {
    id: '2', nom: 'Fatimata Traoré', culture: 'Karité',
    quantite: 3_500, region: 'Ouahigouya', prix: 950, disponible: true,
    avatar: 'FT', certification: 'Fair Trade',
    description: 'Beurre et noix de karité non raffinés, coopérative de femmes certifiée.',
  },
  {
    id: '3', nom: 'Ibrahim Compaoré', culture: 'Sorgho',
    quantite: 15_000, region: 'Koupéla', prix: 175, disponible: true,
    avatar: 'IC', certification: 'Non certifié',
    description: 'Sorgho rouge local, idéal pour brasseries et farine. Stock important.',
  },
  {
    id: '4', nom: 'Mariam Ouédraogo', culture: 'Niébé',
    quantite: 6_400, region: 'Fada N\'Gourma', prix: 420, disponible: true,
    avatar: 'MO', certification: 'Biologique',
    description: 'Niébé blanc de haute qualité, sans traitement chimique.',
  },
  {
    id: '5', nom: 'Boureima Kaboré', culture: 'Anacarde',
    quantite: 12_000, region: 'Gaoua', prix: 560, disponible: true,
    avatar: 'BK', certification: 'Non certifié',
    description: 'Noix de cajou brutes, excellente outturn. Zone forestière protégée.',
  },
  {
    id: '6', nom: 'Aïssata Diallo', culture: 'Coton',
    quantite: 45_000, region: 'Koudougou', prix: 285, disponible: true,
    avatar: 'AD', certification: 'Non certifié',
    description: 'Coton grade A, fibre longue, livraison possible depuis groupement.',
  },
  {
    id: '7', nom: 'Salif Zongo', culture: 'Sésame',
    quantite: 5_800, region: 'Tougan', prix: 710, disponible: false,
    avatar: 'SZ', certification: 'Biologique',
    description: 'Sésame noir, variété rare, certifié organique. Stock quasi épuisé.',
  },
  {
    id: '8', nom: 'Rasmata Lingani', culture: 'Karité',
    quantite: 2_100, region: 'Nouna', prix: 880, disponible: true,
    avatar: 'RL', certification: 'Fair Trade',
    description: 'Noix karité de première qualité, coopérative féminine agréée.',
  },
  {
    id: '9', nom: 'Hamidou Tapsoba', culture: 'Niébé',
    quantite: 9_300, region: 'Ziniaré', prix: 395, disponible: true,
    avatar: 'HT', certification: 'Non certifié',
    description: 'Niébé rouge local, très apprécié sur les marchés régionaux.',
  },
  {
    id: '10', nom: 'Clarisse Nikiema', culture: 'Sorgho',
    quantite: 20_000, region: 'Manga', prix: 160, disponible: true,
    avatar: 'CN', certification: 'Biologique',
    description: 'Sorgho blanc bio, culture paysanne durable, irrigué gravitaire.',
  },
]

const CULTURES = ['Toutes', ...Array.from(new Set(PRODUCTEURS.map(p => p.culture)))]
const REGIONS  = ['Toutes', ...Array.from(new Set(PRODUCTEURS.map(p => p.region)))]

const CERT_COLOR: Record<string, string> = {
  'Biologique': '#22d98a',
  'Fair Trade': '#00D4FF',
  'Non certifié': '#9ca3af',
}

function fmtKg(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)} t` : `${n} kg`
}

// ─── Animations ───────────────────────────────────────────────────────────────

const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 260, damping: 22 } },
}

// ─── Composant ────────────────────────────────────────────────────────────────

export default function MatchingPage() {
  const [recherche, setRecherche]   = useState('')
  const [culture, setCulture]       = useState('Toutes')
  const [region, setRegion]         = useState('Toutes')
  const [prixMax, setPrixMax]       = useState<number>(1000)
  const [filtersOpen, setFiltersOpen] = useState(false)

  // Modal offre
  const [selectedProd, setSelectedProd] = useState<Producteur | null>(null)
  const [form, setForm] = useState<OffreForm>({ quantite: '', prixPropose: '', message: '', contact: '' })
  const [toast, setToast] = useState(false)
  const [formError, setFormError] = useState('')

  const filtered = useMemo(() => {
    const q = recherche.toLowerCase()
    return PRODUCTEURS.filter(p => {
      if (culture !== 'Toutes' && p.culture !== culture) return false
      if (region  !== 'Toutes' && p.region  !== region)  return false
      if (p.prix > prixMax) return false
      if (q && !p.nom.toLowerCase().includes(q) && !p.culture.toLowerCase().includes(q) && !p.region.toLowerCase().includes(q)) return false
      return true
    })
  }, [recherche, culture, region, prixMax])

  const handleSubmitOffre = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!form.quantite || !form.prixPropose || !form.contact) {
      setFormError('Quantité, prix proposé et contact sont requis.')
      return
    }
    setSelectedProd(null)
    setForm({ quantite: '', prixPropose: '', message: '', contact: '' })
    setToast(true)
    setTimeout(() => setToast(false), 3000)
  }

  return (
    <div className="space-y-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring' as const }}>
        <h1 className="text-3xl font-black text-white mb-1">Matching Producteurs</h1>
        <p className="text-gray-400 text-sm">
          {filtered.length} producteur{filtered.length !== 1 ? 's' : ''} disponible{filtered.length !== 1 ? 's' : ''} au Burkina Faso
        </p>
      </motion.div>

      {/* Search + filtres */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="space-y-3">
        <div className="flex gap-3">
          {/* Recherche texte */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              placeholder="Rechercher un producteur, culture, région…"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-gray-500 outline-none focus:border-[#D4AF37]/50 transition-colors"
            />
          </div>
          {/* Toggle filtres */}
          <button
            onClick={() => setFiltersOpen(v => !v)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border"
            style={{
              background: filtersOpen ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.05)',
              borderColor: filtersOpen ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)',
              color: filtersOpen ? '#D4AF37' : '#9ca3af',
            }}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filtres
          </button>
        </div>

        {/* Panneaux filtres */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl border border-white/10 bg-white/[0.03]">
                {/* Filtre culture */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Culture</label>
                  <div className="flex flex-wrap gap-1.5">
                    {CULTURES.map(c => (
                      <button key={c} onClick={() => setCulture(c)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: culture === c ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${culture === c ? 'rgba(212,175,55,0.4)' : 'rgba(255,255,255,0.1)'}`,
                          color: culture === c ? '#D4AF37' : '#9ca3af',
                        }}
                      >{c}</button>
                    ))}
                  </div>
                </div>

                {/* Filtre région */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">Région</label>
                  <div className="flex flex-wrap gap-1.5">
                    {REGIONS.map(r => (
                      <button key={r} onClick={() => setRegion(r)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{
                          background: region === r ? 'rgba(0,212,255,0.12)' : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${region === r ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
                          color: region === r ? '#00D4FF' : '#9ca3af',
                        }}
                      >{r}</button>
                    ))}
                  </div>
                </div>

                {/* Prix max */}
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    Prix max : <span className="text-white font-bold">{formatNombre(prixMax)} FCFA/kg</span>
                  </label>
                  <input
                    type="range" min={100} max={1000} step={50} value={prixMax}
                    onChange={e => setPrixMax(Number(e.target.value))}
                    className="w-full accent-[#D4AF37]"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>100</span><span>1 000 FCFA/kg</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Grille producteurs */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-semibold">Aucun producteur trouvé</p>
          <p className="text-sm mt-1">Essayez de modifier vos filtres.</p>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer} initial="hidden" animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {filtered.map(prod => (
            <motion.div key={prod.id} variants={cardVariant}
              className="relative rounded-2xl border border-white/10 p-6 flex flex-col gap-4 transition-all duration-200 hover:border-[#D4AF37]/30 hover:-translate-y-0.5"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              {/* Dispo badge */}
              <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${prod.disponible ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-white/5'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${prod.disponible ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                {prod.disponible ? 'Disponible' : 'Épuisé'}
              </div>

              {/* Avatar + Identité */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                  style={{ background: 'linear-gradient(135deg, #0A1628, #0F2040)', border: '1px solid rgba(212,175,55,0.25)', color: '#D4AF37' }}>
                  {prod.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{prod.nom}</p>
                  <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {prod.region}, BF
                  </div>
                </div>
              </div>

              {/* Culture + quantité */}
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg text-sm font-bold"
                  style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                  {prod.culture}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  <Package className="w-3 h-3" />
                  {fmtKg(prod.quantite)} dispo.
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{prod.description}</p>

              {/* Certification */}
              <div className="flex items-center gap-1.5 text-xs font-medium"
                style={{ color: CERT_COLOR[prod.certification] ?? '#9ca3af' }}>
                <Leaf className="w-3 h-3" />
                {prod.certification}
              </div>

              {/* Prix + CTA */}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
                <div>
                  <span className="text-lg font-black text-white">
                    {formatNombre(prod.prix)}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">FCFA/kg</span>
                </div>
                <button
                  onClick={() => prod.disponible && setSelectedProd(prod)}
                  disabled={!prod.disponible}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: prod.disponible ? 'linear-gradient(135deg, #D4AF37, #E8C84A)' : '#374151', color: '#0A1628' }}
                >
                  Faire une offre
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Modal offre ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProd && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.75)' }}
            onClick={(e) => { if (e.target === e.currentTarget) setSelectedProd(null) }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 24 }}
              transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{ background: '#0A1628', border: '1px solid rgba(212,175,55,0.25)' }}
            >
              {/* Header modal */}
              <div className="px-6 py-5 border-b border-white/10"
                style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06), rgba(0,212,255,0.04))' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-white font-bold text-lg">Faire une offre</h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {selectedProd.culture} · {selectedProd.nom}
                    </p>
                  </div>
                  <button onClick={() => setSelectedProd(null)} className="p-2 rounded-lg hover:bg-white/5 text-gray-400">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-3 flex gap-3 text-xs">
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-300">
                    Stock : {fmtKg(selectedProd.quantite)}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-white/5 text-gray-300">
                    Prix affichage : {formatNombre(selectedProd.prix)} FCFA/kg
                  </span>
                </div>
              </div>

              {/* Formulaire */}
              <form onSubmit={handleSubmitOffre} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Quantité souhaitée (kg) *</label>
                    <input
                      type="number" min={1} placeholder="Ex: 2000"
                      value={form.quantite}
                      onChange={e => setForm(p => ({ ...p, quantite: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-white"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Prix proposé (FCFA/kg) *</label>
                    <input
                      type="number" min={1} placeholder={selectedProd.prix.toString()}
                      value={form.prixPropose}
                      onChange={e => setForm(p => ({ ...p, prixPropose: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-white"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                    />
                  </div>
                </div>

                {form.quantite && form.prixPropose && (() => {
                  // `Number('12,5')` vaut NaN : un utilisateur francophone tape la
                  // virgule, et le total affichait « NaN FCFA ». Les deux champs
                  // sont lus separement — multiplier un `null` donnerait 0, ce qui
                  // se lirait comme un montant nul au lieu d'une saisie invalide.
                  const q = parseMontant(form.quantite)
                  const p = parseMontant(form.prixPropose)
                  const total = q !== null && p !== null ? q * p : null
                  return (
                    <div className="px-3 py-2 rounded-xl text-xs flex justify-between"
                      style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <span className="text-gray-400">Total estimé</span>
                      <span className="font-bold" style={{ color: '#D4AF37' }}>
                        {total === null ? 'montant invalide' : formatFCFA(total)}
                      </span>
                    </div>
                  )
                })()}

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Message au producteur</label>
                  <textarea
                    rows={3} placeholder="Décrivez votre besoin, conditions de livraison souhaitées…"
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-white resize-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Votre contact (téléphone ou email) *</label>
                  <input
                    type="text" placeholder="Ex: +226 70 00 00 00"
                    value={form.contact}
                    onChange={e => setForm(p => ({ ...p, contact: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none text-white"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
                  />
                </div>

                {formError && (
                  <p className="text-xs px-3 py-2 rounded-lg text-red-400 bg-red-400/10">{formError}</p>
                )}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setSelectedProd(null)}
                    className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-400 border border-white/10 hover:border-white/20 transition-all">
                    Annuler
                  </button>
                  <button type="submit"
                    className="flex-1 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', color: '#0A1628' }}>
                    <Send className="w-4 h-4" />
                    Envoyer la demande
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast succès */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold shadow-2xl"
            style={{ background: '#D4AF37', color: '#0A1628' }}
          >
            <CheckCircle2 className="w-4 h-4" />
            Demande envoyée ✓
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

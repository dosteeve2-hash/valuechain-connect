'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, X, Package, MapPin, ChevronDown,
  Plus, ShoppingCart, TrendingUp, Users, ClipboardList,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/* ─── Types ──────────────────────────────────────────── */

type Categorie = 'Céréales' | 'Légumineuses' | 'Oléagineux' | 'Tubercules' | 'Produits transformés'
type Disponibilite = 'Disponible' | 'Stock limité' | 'Rupture'

interface Produit {
  id: string
  nom: string
  initiales: string
  categorie: Categorie
  fournisseur: string
  prixUnitaire: number
  unite: 'tonne' | 'kg' | 'unité'
  stock: number
  paysOrigine: string
  disponibilite: Disponibilite
}

interface NouveauProduit {
  nom: string
  categorie: Categorie | ''
  prixUnitaire: string
  unite: 'tonne' | 'kg' | 'unité'
  stock: string
  paysOrigine: string
  description: string
}

/* ─── Mock data ──────────────────────────────────────── */

const MOCK_PRODUITS: Produit[] = [
  { id: 'P-001', nom: 'Mil Perlé Premium', initiales: 'MP', categorie: 'Céréales', fournisseur: 'Coopérative Sahel Grains', prixUnitaire: 195000, unite: 'tonne', stock: 85, paysOrigine: 'Burkina Faso', disponibilite: 'Disponible' },
  { id: 'P-002', nom: 'Sorgho Rouge Séché', initiales: 'SR', categorie: 'Céréales', fournisseur: 'AgroVast CI', prixUnitaire: 185000, unite: 'tonne', stock: 120, paysOrigine: "Côte d'Ivoire", disponibilite: 'Disponible' },
  { id: 'P-003', nom: 'Niébé Blanc Calibré', initiales: 'NB', categorie: 'Légumineuses', fournisseur: 'SCOOP Nord Niger', prixUnitaire: 420000, unite: 'tonne', stock: 40, paysOrigine: 'Niger', disponibilite: 'Disponible' },
  { id: 'P-004', nom: 'Soja Décortiqué Bio', initiales: 'SD', categorie: 'Légumineuses', fournisseur: 'BioFarm Togo', prixUnitaire: 380000, unite: 'tonne', stock: 18, paysOrigine: 'Togo', disponibilite: 'Stock limité' },
  { id: 'P-005', nom: 'Huile de Sésame Vierge', initiales: 'HS', categorie: 'Oléagineux', fournisseur: 'Sesaco BF SARL', prixUnitaire: 1250, unite: 'kg', stock: 5500, paysOrigine: 'Burkina Faso', disponibilite: 'Disponible' },
  { id: 'P-006', nom: 'Beurre de Karité Brut', initiales: 'BK', categorie: 'Oléagineux', fournisseur: 'Femmes Sahel SCOOP', prixUnitaire: 920, unite: 'kg', stock: 3200, paysOrigine: 'Burkina Faso', disponibilite: 'Disponible' },
  { id: 'P-007', nom: 'Igname Séchée Flocon', initiales: 'IF', categorie: 'Tubercules', fournisseur: 'Agri-Process Ghana', prixUnitaire: 640000, unite: 'tonne', stock: 22, paysOrigine: 'Ghana', disponibilite: 'Stock limité' },
  { id: 'P-008', nom: 'Manioc Farine Fine', initiales: 'MF', categorie: 'Tubercules', fournisseur: 'Transformateurs Abidjan', prixUnitaire: 520000, unite: 'tonne', stock: 0, paysOrigine: "Côte d'Ivoire", disponibilite: 'Rupture' },
  { id: 'P-009', nom: 'Tomate Concentrée 28%', initiales: 'TC', categorie: 'Produits transformés', fournisseur: 'IndusFoods Dakar', prixUnitaire: 1800, unite: 'kg', stock: 8400, paysOrigine: 'Sénégal', disponibilite: 'Disponible' },
  { id: 'P-010', nom: 'Farine de Mil Précuite', initiales: 'FM', categorie: 'Produits transformés', fournisseur: 'Moulin du Sahel', prixUnitaire: 420, unite: 'kg', stock: 12000, paysOrigine: 'Mali', disponibilite: 'Disponible' },
  { id: 'P-011', nom: 'Maïs Blanc Grain Sec', initiales: 'MB', categorie: 'Céréales', fournisseur: 'Coopérative Bobo', prixUnitaire: 145000, unite: 'tonne', stock: 200, paysOrigine: 'Burkina Faso', disponibilite: 'Disponible' },
  { id: 'P-012', nom: 'Arachides Décortiquées', initiales: 'AD', categorie: 'Oléagineux', fournisseur: 'SCOOP Arachide Sahel', prixUnitaire: 380000, unite: 'tonne', stock: 15, paysOrigine: 'Sénégal', disponibilite: 'Stock limité' },
]

const CATEGORIES: Array<'Toutes' | Categorie> = ['Toutes', 'Céréales', 'Légumineuses', 'Oléagineux', 'Tubercules', 'Produits transformés']
const PAYS = ['Tous', 'Burkina Faso', "Côte d'Ivoire", 'Niger', 'Sénégal', 'Ghana', 'Togo', 'Mali']
const DISPOS: Array<'Toutes' | Disponibilite> = ['Toutes', 'Disponible', 'Stock limité', 'Rupture']

const CAT_COLORS: Record<Categorie, string> = {
  'Céréales': '#F59E0B',
  'Légumineuses': '#10B981',
  'Oléagineux': '#D97706',
  'Tubercules': '#8B5CF6',
  'Produits transformés': '#00BCD4',
}

const DISPO_CONFIG: Record<Disponibilite, { variant: 'green' | 'orange' | 'red'; label: string }> = {
  'Disponible': { variant: 'green', label: 'Disponible' },
  'Stock limité': { variant: 'orange', label: 'Stock limité' },
  'Rupture': { variant: 'red', label: 'Rupture' },
}

const KPI_CARDS = [
  { label: 'Produits actifs', value: '10', icon: Package, color: '#D4AF37', sub: '+2 ce mois' },
  { label: 'Fournisseurs', value: '12', icon: Users, color: '#00BCD4', sub: '6 pays CEDEAO' },
  { label: 'Commandes en cours', value: '7', icon: ClipboardList, color: '#D4AF37', sub: '3 en transit' },
  { label: 'CA plateforme', value: '284.5M FCFA', icon: TrendingUp, color: '#00BCD4', sub: '+22% vs juillet' },
]

const UNITES: Array<'tonne' | 'kg' | 'unité'> = ['tonne', 'kg', 'unité']

function fmt(n: number) { return n.toLocaleString('fr') }

/* ─── Image placeholder dorée ────────────────────────── */

function ProduitAvatar({ initiales, categorie }: { initiales: string; categorie: Categorie }) {
  const color = CAT_COLORS[categorie]
  return (
    <div className="h-36 flex items-center justify-center relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${color}22 0%, #0A1628 100%)` }}>
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl"
        style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', color: '#0A1628' }}>
        {initiales}
      </div>
      <div className="absolute top-3 left-3">
        <span className="px-2 py-1 rounded-md text-xs font-bold text-white"
          style={{ backgroundColor: color }}>
          {categorie}
        </span>
      </div>
    </div>
  )
}

/* ─── Modal Commander ─────────────────────────────────── */

function ModalCommander({ produit, onClose }: { produit: Produit; onClose: () => void }) {
  const [qty, setQty] = useState('')

  const total = Number(qty) * produit.prixUnitaire

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(6,14,26,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring' as const }}
        className="w-full max-w-md rounded-2xl border border-white/10 p-6"
        style={{ backgroundColor: '#0F2040' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">Commander</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 rounded-xl mb-6"
          style={{ backgroundColor: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.15)' }}>
          <div className="text-white font-bold">{produit.nom}</div>
          <div className="text-sm text-gray-400 mt-1">{produit.fournisseur} • {produit.paysOrigine}</div>
          <div className="text-lg font-black mt-2" style={{ color: '#D4AF37' }}>
            {fmt(produit.prixUnitaire)} FCFA / {produit.unite}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Stock disponible : {fmt(produit.stock)} {produit.unite}{produit.stock > 1 ? 's' : ''}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">
            Quantité souhaitée ({produit.unite}s)
          </label>
          <Input type="number" min="1" max={produit.stock}
            placeholder={`Max ${fmt(produit.stock)}`}
            value={qty} onChange={e => setQty(e.target.value)}
            className="bg-white/5 border-white/10 text-white placeholder-gray-500" />
        </div>
        {Number(qty) > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="p-3 rounded-xl mb-4"
            style={{ backgroundColor: 'rgba(0,188,212,0.08)', border: '1px solid rgba(0,188,212,0.2)' }}>
            <div className="text-sm text-gray-300">Montant total estimé</div>
            <div className="text-xl font-black" style={{ color: '#00BCD4' }}>
              {fmt(total)} FCFA
            </div>
          </motion.div>
        )}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1 border-white/10 text-gray-300 hover:text-white">
            Annuler
          </Button>
          <Button disabled={!qty || Number(qty) <= 0 || Number(qty) > produit.stock}
            className="flex-1 font-bold"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', color: '#0A1628' }}>
            <ShoppingCart className="w-4 h-4 mr-2" />
            Confirmer la commande
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Modal Ajouter produit ──────────────────────────── */

function ModalAjoutProduit({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<NouveauProduit>({
    nom: '', categorie: '', prixUnitaire: '', unite: 'tonne',
    stock: '', paysOrigine: '', description: '',
  })

  const set = (k: keyof NouveauProduit) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value } as NouveauProduit))

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]/50 transition-colors'
  const labelCls = 'block text-xs text-gray-400 mb-1.5 font-medium'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      style={{ backgroundColor: 'rgba(6,14,26,0.85)', backdropFilter: 'blur(8px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring' as const }}
        className="w-full max-w-lg rounded-2xl border border-white/10 p-6 my-4"
        style={{ backgroundColor: '#0F2040' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white font-bold text-lg">Ajouter un produit</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Nom du produit *</label>
            <input className={inputCls} placeholder="Ex: Mil Perlé Premium" value={form.nom} onChange={set('nom')} />
          </div>
          <div>
            <label className={labelCls}>Catégorie *</label>
            <select className={inputCls} value={form.categorie} onChange={set('categorie')}>
              <option value="">Sélectionner...</option>
              {(['Céréales', 'Légumineuses', 'Oléagineux', 'Tubercules', 'Produits transformés'] as Categorie[]).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Prix unitaire (FCFA) *</label>
              <input className={inputCls} type="number" placeholder="Ex: 285000" value={form.prixUnitaire} onChange={set('prixUnitaire')} />
            </div>
            <div>
              <label className={labelCls}>Unité *</label>
              <select className={inputCls} value={form.unite} onChange={set('unite')}>
                {UNITES.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Stock disponible *</label>
              <input className={inputCls} type="number" placeholder="Ex: 50" value={form.stock} onChange={set('stock')} />
            </div>
            <div>
              <label className={labelCls}>Pays d&apos;origine *</label>
              <input className={inputCls} placeholder="Ex: Burkina Faso" value={form.paysOrigine} onChange={set('paysOrigine')} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea className={`${inputCls} resize-none h-20`} placeholder="Caractéristiques, certifications, incoterms..."
              value={form.description} onChange={set('description')} />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <Button variant="outline" onClick={onClose} className="flex-1 border-white/10 text-gray-300 hover:text-white">
            Annuler
          </Button>
          <Button disabled={!form.nom || !form.categorie || !form.prixUnitaire || !form.stock}
            className="flex-1 font-bold"
            style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', color: '#0A1628' }}>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter le produit
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────── */

export default function ProduitsClient() {
  const [search, setSearch] = useState('')
  const [categorie, setCategorie] = useState<'Toutes' | Categorie>('Toutes')
  const [pays, setPays] = useState('Tous')
  const [dispo, setDispo] = useState<'Toutes' | Disponibilite>('Toutes')
  const [showFiltres, setShowFiltres] = useState(false)
  const [modalAjout, setModalAjout] = useState(false)
  const [modalCommander, setModalCommander] = useState<Produit | null>(null)

  const filtered = useMemo(() => MOCK_PRODUITS.filter(p => {
    const matchSearch = p.nom.toLowerCase().includes(search.toLowerCase()) ||
      p.fournisseur.toLowerCase().includes(search.toLowerCase())
    const matchCat = categorie === 'Toutes' || p.categorie === categorie
    const matchPays = pays === 'Tous' || p.paysOrigine === pays
    const matchDispo = dispo === 'Toutes' || p.disponibilite === dispo
    return matchSearch && matchCat && matchPays && matchDispo
  }), [search, categorie, pays, dispo])

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const }}
        className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Catalogue Produits</h1>
          <p className="text-gray-400">{filtered.length} produit{filtered.length > 1 ? 's' : ''} · Marchés CEDEAO</p>
        </div>
        <Button onClick={() => setModalAjout(true)}
          className="font-bold flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', color: '#0A1628' }}>
          <Plus className="w-4 h-4 mr-2" /> Ajouter produit
        </Button>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {KPI_CARDS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, delay: i * 0.08 }}>
            <Card className="border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300"
              style={{ backgroundColor: '#0F2040' }}>
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, delay: 0.3 }}
        className="space-y-3">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Rechercher un produit ou fournisseur..."
              className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-500"
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setShowFiltres(f => !f)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: showFiltres ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.05)',
              color: showFiltres ? '#D4AF37' : '#9CA3AF',
              border: showFiltres ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(255,255,255,0.1)',
            }}>
            Filtres <ChevronDown className={`w-4 h-4 transition-transform ${showFiltres ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {showFiltres && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} transition={{ type: 'spring' as const }}
              className="overflow-hidden">
              <div className="space-y-3 pt-1">
                {/* Catégories */}
                <div className="flex gap-2 flex-wrap">
                  {CATEGORIES.map(cat => (
                    <button key={cat} onClick={() => setCategorie(cat)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        backgroundColor: categorie === cat ? '#D4AF37' : 'rgba(255,255,255,0.05)',
                        color: categorie === cat ? '#0A1628' : '#9CA3AF',
                        border: categorie === cat ? '1px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                      }}>
                      {cat}
                    </button>
                  ))}
                </div>
                {/* Pays */}
                <div className="flex gap-2 flex-wrap">
                  {PAYS.map(p => (
                    <button key={p} onClick={() => setPays(p)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        backgroundColor: pays === p ? '#00BCD4' : 'rgba(255,255,255,0.05)',
                        color: pays === p ? '#0A1628' : '#9CA3AF',
                        border: pays === p ? '1px solid #00BCD4' : '1px solid rgba(255,255,255,0.1)',
                      }}>
                      {p}
                    </button>
                  ))}
                </div>
                {/* Disponibilité */}
                <div className="flex gap-2 flex-wrap">
                  {DISPOS.map(d => (
                    <button key={d} onClick={() => setDispo(d)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                      style={{
                        backgroundColor: dispo === d ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
                        color: dispo === d ? '#22C55E' : '#9CA3AF',
                        border: dispo === d ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.1)',
                      }}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* GRILLE PRODUITS */}
      <AnimatePresence mode="popLayout">
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((produit, i) => (
            <motion.div key={produit.id}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }} layout
              transition={{ type: 'spring' as const, delay: i * 0.05 }}
              className="rounded-2xl border border-white/10 overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-300 group"
              style={{ backgroundColor: '#0F2040' }}>

              <ProduitAvatar initiales={produit.initiales} categorie={produit.categorie} />

              <div className="p-5">
                <div className="flex items-start justify-between mb-1 gap-2">
                  <h3 className="text-white font-bold text-sm group-hover:text-[#D4AF37] transition-colors leading-tight">
                    {produit.nom}
                  </h3>
                  <Badge variant={DISPO_CONFIG[produit.disponibilite].variant} className="flex-shrink-0 text-xs">
                    {DISPO_CONFIG[produit.disponibilite].label}
                  </Badge>
                </div>

                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-3">
                  <MapPin className="w-3 h-3" />
                  <span>{produit.fournisseur}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 p-3 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Prix unitaire</div>
                    <div className="text-white font-black text-base">{fmt(produit.prixUnitaire)}</div>
                    <div className="text-xs text-gray-400">FCFA / {produit.unite}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Stock</div>
                    <div className="text-white font-black text-base">{fmt(produit.stock)}</div>
                    <div className="text-xs text-gray-400">{produit.unite}{produit.stock > 1 ? 's' : ''} dispos</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: '#D4AF37' }}>
                  </div>
                  <span className="text-xs text-gray-400">{produit.paysOrigine}</span>
                </div>

                <Button
                  disabled={produit.disponibilite === 'Rupture'}
                  onClick={() => setModalCommander(produit)}
                  className="w-full font-bold text-sm"
                  style={produit.disponibilite !== 'Rupture'
                    ? { background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', color: '#0A1628' }
                    : {}}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {produit.disponibilite === 'Rupture' ? 'Rupture de stock' : 'Commander'}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Aucun produit ne correspond à vos critères</p>
        </div>
      )}

      {/* MODALS */}
      {modalAjout && <ModalAjoutProduit onClose={() => setModalAjout(false)} />}
      {modalCommander && <ModalCommander produit={modalCommander} onClose={() => setModalCommander(null)} />}
    </div>
  )
}

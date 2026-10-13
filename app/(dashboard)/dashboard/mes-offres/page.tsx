'use client'

import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package, Plus, Eye, FileText, Edit3, Power, PowerOff,
  X, MapPin, Tag, Loader2, Search, TrendingUp,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formatNombre } from '@/lib/fcfa'

interface Offre {
  id: string
  produit: string
  quantite: string
  prix: number
  unite: string
  origine: string
  certification: string
  vues: number
  devis: number
  statut: 'Actif' | 'Inactif'
  description: string
}

const MOCK_OFFRES_INIT: Offre[] = [
  {
    id: '1', produit: 'Coton grade A', quantite: '50 tonnes', prix: 285000,
    unite: 'tonne', origine: 'Koudougou, BF', certification: 'Organique',
    vues: 234, devis: 4, statut: 'Actif',
    description: 'Coton longue fibre de haute qualité, récolte 2026. Disponible dès août.',
  },
  {
    id: '2', produit: 'Sésame blanc', quantite: '8 tonnes', prix: 480000,
    unite: 'tonne', origine: 'Dédougou, BF', certification: 'Non certifié',
    vues: 189, devis: 3, statut: 'Actif',
    description: 'Sésame blanc décortiqué, humidité < 8%, export-ready.',
  },
  {
    id: '3', produit: 'Beurre de karité', quantite: '3 tonnes', prix: 920000,
    unite: 'tonne', origine: 'Ouahigouya, BF', certification: 'Fair Trade',
    vues: 424, devis: 5, statut: 'Actif',
    description: 'Beurre de karité non raffiné, certifié Fair Trade, conditionné en fûts 200L.',
  },
]

interface ModalFormProps {
  offre?: Offre | null
  onClose: () => void
  onSave: (offre: Omit<Offre, 'id' | 'vues' | 'devis'>) => void
}

function ModalForm({ offre, onClose, onSave }: ModalFormProps) {
  const [form, setForm] = useState({
    produit: offre?.produit ?? '',
    quantite: offre?.quantite ?? '',
    prix: offre?.prix ?? 0,
    unite: offre?.unite ?? 'tonne',
    origine: offre?.origine ?? '',
    certification: offre?.certification ?? 'Non certifié',
    statut: (offre?.statut ?? 'Actif') as 'Actif' | 'Inactif',
    description: offre?.description ?? '',
  })
  const [saving, setSaving] = useState(false)

  function update(field: keyof typeof form, val: string | number) {
    setForm(prev => ({ ...prev, [field]: val }))
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    onSave(form)
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring' as const }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 p-4 sm:p-6"
        style={{ backgroundColor: '#0F2040', zIndex: 51 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">
            {offre ? 'Modifier l\'offre' : 'Nouvelle offre'}
          </h3>
          <button onClick={onClose} aria-label="Fermer" className="w-11 h-11 -mr-2 flex items-center justify-center text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Produit *</label>
            <Input value={form.produit} onChange={e => update('produit', e.target.value)}
              placeholder="Coton grade A" required className="border-white/10 text-white h-10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Quantité *</label>
              <Input value={form.quantite} onChange={e => update('quantite', e.target.value)}
                placeholder="50 tonnes" required className="border-white/10 text-white h-10" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Prix/unité (FCFA) *</label>
              <Input type="number" value={form.prix || ''}
                onChange={e => update('prix', Number(e.target.value))}
                placeholder="285000" required className="border-white/10 text-white h-10" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Origine</label>
              <Input value={form.origine} onChange={e => update('origine', e.target.value)}
                placeholder="Koudougou, BF" className="border-white/10 text-white h-10" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">Certification</label>
              <select value={form.certification} onChange={e => update('certification', e.target.value)}
                className="flex h-10 w-full rounded-md border border-white/10 bg-secondary px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                style={{ backgroundColor: 'rgba(15,32,64,0.8)' }}>
                {['Non certifié', 'Organique', 'Fair Trade', 'ECOCERT', 'ISO 22000'].map(c => (
                  <option key={c} value={c} className="bg-[#0A1628]">{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Description</label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)}
              rows={3} placeholder="Décrivez votre offre…"
              className="w-full rounded-md border border-white/10 bg-secondary px-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] resize-none"
              style={{ backgroundColor: 'rgba(15,32,64,0.8)' }} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onClose}
              className="flex-1 border border-white/10 text-gray-300">
              Annuler
            </Button>
            <Button type="submit" disabled={saving}
              className="flex-1 bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] font-bold">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement…</> : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default function MesOffresPage() {
  const [offres, setOffres] = useState<Offre[]>(MOCK_OFFRES_INIT)
  const [showModal, setShowModal] = useState(false)
  const [editOffre, setEditOffre] = useState<Offre | null>(null)
  const [search, setSearch] = useState('')

  const filtered = offres.filter(o =>
    !search ||
    o.produit.toLowerCase().includes(search.toLowerCase()) ||
    o.origine.toLowerCase().includes(search.toLowerCase())
  )

  function toggleStatut(id: string) {
    setOffres(prev => prev.map(o =>
      o.id === id ? { ...o, statut: o.statut === 'Actif' ? 'Inactif' : 'Actif' } : o
    ))
  }

  function openEdit(offre: Offre) {
    setEditOffre(offre)
    setShowModal(true)
  }

  function openNew() {
    setEditOffre(null)
    setShowModal(true)
  }

  function handleSave(data: Omit<Offre, 'id' | 'vues' | 'devis'>) {
    if (editOffre) {
      setOffres(prev => prev.map(o => o.id === editOffre.id ? { ...o, ...data } : o))
    } else {
      const newOffre: Offre = {
        ...data,
        id: Date.now().toString(),
        vues: 0,
        devis: 0,
      }
      setOffres(prev => [...prev, newOffre])
    }
    setShowModal(false)
  }

  const nbActives = offres.filter(o => o.statut === 'Actif').length
  const totalVues = offres.reduce((s, o) => s + o.vues, 0)
  const totalDevis = offres.reduce((s, o) => s + o.devis, 0)

  return (
    <>
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const }}
          className="flex flex-wrap items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">Mes offres</h1>
            <p className="text-gray-400">Gérez vos offres de vente sur la marketplace</p>
          </div>
          <Button onClick={openNew}
            className="bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] font-bold gap-2">
            <Plus className="w-4 h-4" /> Nouvelle offre
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Offres actives', value: nbActives.toString(), icon: Package, color: '#D4AF37' },
            { label: 'Vues totales', value: formatNombre(totalVues), icon: Eye, color: '#00BCD4' },
            { label: 'Devis reçus', value: totalDevis.toString(), icon: FileText, color: '#D4AF37' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring' as const, delay: i * 0.08 }}>
              <Card className="bg-navy-card border-white/10">
                <CardContent className="pt-5 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}>
                      <s.icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <div>
                      <div className="text-xl font-black text-white">{s.value}</div>
                      <div className="text-xs text-gray-400">{s.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher une offre…"
            className="pl-10 h-10 border-white/10 text-white" />
        </div>

        {/* Offres */}
        <div className="space-y-4">
          <AnimatePresence>
            {filtered.map((offre, i) => (
              <motion.div key={offre.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: 'spring' as const, delay: i * 0.07 }}
                layout>
                <Card className={`bg-navy-card border-white/10 transition-all duration-300 ${
                  offre.statut === 'Inactif' ? 'opacity-60' : 'hover:border-[#D4AF37]/20'
                }`}>
                  <CardContent className="pt-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{
                            background: offre.statut === 'Actif' ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.05)',
                            border: `1px solid ${offre.statut === 'Actif' ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.08)'}`,
                          }}>
                          <Package className="w-5 h-5" style={{ color: offre.statut === 'Actif' ? '#D4AF37' : '#6B7280' }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-white font-bold">{offre.produit}</span>
                            <Badge variant={offre.statut === 'Actif' ? 'green' : 'secondary'}>
                              {offre.statut}
                            </Badge>
                            <Badge variant="gold">{offre.certification}</Badge>
                          </div>
                          <p className="text-gray-400 text-sm leading-relaxed mb-3 line-clamp-2">
                            {offre.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400">
                            <div className="flex items-center gap-1">
                              <Tag className="w-3 h-3" />
                              {offre.quantite} · {formatNombre(offre.prix)} FCFA/{offre.unite}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {offre.origine}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {offre.vues} vues
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              {offre.devis} devis
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button size="sm" variant="ghost" aria-label={`Modifier ${offre.produit}`}
                          onClick={() => openEdit(offre)}
                          className="h-11 w-11 sm:h-8 sm:w-auto px-3 text-gray-400 hover:text-white hover:bg-white/5">
                          <Edit3 className="w-3.5 h-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" aria-label={`${offre.statut === 'Actif' ? 'Désactiver' : 'Activer'} ${offre.produit}`}
                          onClick={() => toggleStatut(offre.id)}
                          className={`h-11 w-11 sm:h-8 sm:w-auto px-3 transition-colors ${
                            offre.statut === 'Actif'
                              ? 'text-red-400 hover:text-red-300 hover:bg-red-500/10'
                              : 'text-green-400 hover:text-green-300 hover:bg-green-500/10'
                          }`}
                          title={offre.statut === 'Actif' ? 'Désactiver' : 'Activer'}
                        >
                          {offre.statut === 'Actif'
                            ? <PowerOff className="w-3.5 h-3.5" />
                            : <Power className="w-3.5 h-3.5" />
                          }
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="mb-4">Aucune offre trouvée</p>
              <Button onClick={openNew}
                className="bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] font-bold gap-2">
                <Plus className="w-4 h-4" /> Créer votre première offre
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <ModalForm
            offre={editOffre}
            onClose={() => setShowModal(false)}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </>
  )
}

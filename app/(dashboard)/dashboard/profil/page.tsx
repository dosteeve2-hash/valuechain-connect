'use client'

import { motion } from 'framer-motion'

import {
  MapPin, Phone, Mail, Calendar, Users, Star,
  ShieldCheck, Package, TrendingUp, Award, Edit3, ExternalLink,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatFCFA, formatNombre } from '@/lib/fcfa'

const MOCK_PROFIL = {
  nom: 'Coopérative Koudougou',
  type: 'Producteur',
  pays: 'Burkina Faso',
  telephone: '+226 25 33 44 55',
  email: 'contact@coop-koudougou.bf',
  anneeCreation: 2018,
  membres: 247,
  certifications: ['Organique ECOCERT', 'Fair Trade'],
  produits: ['Coton', 'Sésame', 'Karité'],
  note: 4.9,
  avis: 23,
  transactionsTotal: 5,
  caTotal: 18750000,
  description: 'Coopérative agricole réunissant 247 producteurs de la région du Centre-Ouest du Burkina Faso. Nous pratiquons une agriculture biologique certifiée et garantissons une traçabilité complète de nos produits, du champ à l\'exportation. Membres actifs du réseau FORGE Afrika depuis 2022.',
}

const TRANSACTIONS = [
  { id: 'CMD-003', produit: 'Sésame blanc', acheteur: 'Sesaco Japan', montant: 2250000, date: '2026-07-06', statut: 'Livrée' },
  { id: 'CMD-001', produit: 'Coton grade A', acheteur: 'Akosombo Textiles', montant: 5400000, date: '2026-07-11', statut: 'En cours' },
  { id: 'CMD-F04', produit: 'Beurre de karité', acheteur: "L'Oréal Sourcing", montant: 4100000, date: '2026-05-22', statut: 'Livrée' },
]

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function ProfilPage() {
  const initiales = MOCK_PROFIL.nom
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Mon profil</h1>
          <p className="text-gray-400">Gérez votre identité sur ValueChain Connect</p>
        </div>
        <Button
          variant="outline"
          className="gap-2 border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
        >
          <Edit3 className="w-4 h-4" /> Modifier
        </Button>
      </motion.div>

      {/* Profile Header Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, delay: 0.1 }}
      >
        <Card className="bg-navy-card border-white/10 overflow-hidden">
          <div className="h-24 relative" style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(0,188,212,0.1))',
          }}>
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #D4AF37 0%, transparent 60%)' }} />
          </div>
          <CardContent className="relative pb-6">
            {/* Avatar */}
            <div className="-mt-10 mb-4 flex items-end justify-between">
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-black text-[#0A1628] border-4 border-[#0A1628]"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
                {initiales}
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4"
                      style={{ color: i < Math.floor(MOCK_PROFIL.note) ? '#D4AF37' : '#374151', fill: i < Math.floor(MOCK_PROFIL.note) ? '#D4AF37' : 'transparent' }} />
                  ))}
                </div>
                <span className="text-white font-bold">{MOCK_PROFIL.note}</span>
                <span className="text-gray-400 text-sm">({MOCK_PROFIL.avis} avis)</span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">{MOCK_PROFIL.nom}</h2>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="gold">{MOCK_PROFIL.type}</Badge>
                  <Badge variant="green">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Vérifié
                  </Badge>
                </div>
                <p className="text-gray-400 text-sm max-w-xl leading-relaxed">
                  {MOCK_PROFIL.description}
                </p>
              </div>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/5">
              {[
                { icon: MapPin, label: 'Pays', value: MOCK_PROFIL.pays },
                { icon: Phone, label: 'Téléphone', value: MOCK_PROFIL.telephone },
                { icon: Mail, label: 'Email', value: MOCK_PROFIL.email },
                { icon: Calendar, label: 'Membre depuis', value: MOCK_PROFIL.anneeCreation.toString() },
              ].map(item => (
                <div key={item.label} className="flex items-start gap-2">
                  <item.icon className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500">{item.label}</div>
                    <div className="text-sm text-white font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Stats clés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, delay: 0.2 }}>
          <Card className="bg-navy-card border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-white text-base font-bold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" style={{ color: '#D4AF37' }} />
                Statistiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'CA total', value: formatFCFA(MOCK_PROFIL.caTotal), color: '#D4AF37' },
                { label: 'Transactions', value: MOCK_PROFIL.transactionsTotal.toString(), color: '#00BCD4' },
                { label: 'Membres coopérative', value: formatNombre(MOCK_PROFIL.membres), color: '#D4AF37' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between p-3 rounded-xl"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <span className="text-gray-400 text-sm">{s.label}</span>
                  <span className="font-bold text-sm" style={{ color: s.color }}>{s.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, delay: 0.25 }}>
          <Card className="bg-navy-card border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-white text-base font-bold flex items-center gap-2">
                <Award className="w-4 h-4" style={{ color: '#D4AF37' }} />
                Certifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {MOCK_PROFIL.certifications.map(cert => (
                <div key={cert} className="flex items-center gap-3 p-3 rounded-xl border border-[#D4AF37]/20"
                  style={{ backgroundColor: 'rgba(212,175,55,0.05)' }}>
                  <ShieldCheck className="w-5 h-5 flex-shrink-0" style={{ color: '#D4AF37' }} />
                  <span className="text-sm text-white font-medium">{cert}</span>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full text-gray-400 hover:text-white mt-2 text-xs gap-1">
                <ExternalLink className="w-3 h-3" /> Vérifier les certificats
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Produits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, delay: 0.3 }}>
          <Card className="bg-navy-card border-white/10 h-full">
            <CardHeader>
              <CardTitle className="text-white text-base font-bold flex items-center gap-2">
                <Package className="w-4 h-4" style={{ color: '#00BCD4' }} />
                Produits traités
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {MOCK_PROFIL.produits.map(p => (
                  <Badge key={p} variant="cyan" className="text-sm px-3 py-1">{p}</Badge>
                ))}
              </div>
              <div className="mt-4 p-3 rounded-xl border border-white/5"
                style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Users className="w-3.5 h-3.5" />
                  <span>{MOCK_PROFIL.membres} producteurs membres</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Historique transactions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, delay: 0.35 }}>
        <Card className="bg-navy-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-base font-bold">
              Historique des transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {TRANSACTIONS.map((t) => (
                <div key={t.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-[#D4AF37]/20 transition-all"
                  style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <Package className="w-4 h-4" style={{ color: '#D4AF37' }} />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{t.produit}</div>
                      <div className="text-gray-500 text-xs">{t.acheteur} • {fmtDate(t.date)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-white font-bold text-sm">{formatFCFA(t.montant)}</div>
                      <div className="text-gray-500 text-xs font-mono">{t.id}</div>
                    </div>
                    <Badge variant={t.statut === 'Livrée' ? 'green' : 'gold'}>{t.statut}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

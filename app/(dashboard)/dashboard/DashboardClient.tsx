'use client'

import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { TrendingUp, Eye, FileText, Package, Star, ArrowUpRight, Send, CheckCircle2, Clock, XCircle, Coins, ArrowRight, Users2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { formatFCFA, formatNombre } from '@/lib/fcfa'

const MOCK_STATS = {
  offresActives: 3, vuesTotal: 847, devisReçus: 12,
  transactionsTotal: 5, revenuTotal: 18750000, noteMoyenne: 4.8,
}

const MOCK_CHART = [
  { mois: 'Fév', ventes: 2100000 }, { mois: 'Mar', ventes: 3400000 },
  { mois: 'Avr', ventes: 2800000 }, { mois: 'Mai', ventes: 4200000 },
  { mois: 'Jun', ventes: 3900000 }, { mois: 'Jul', ventes: 2350000 },
]

const MOCK_OFFRES = [
  { id: '1', produit: 'Coton grade A', quantite: '50 tonnes', prix: 285000, unite: 'tonne', origine: 'Koudougou, BF', certification: 'Organique', vues: 234, devis: 4, statut: 'Actif' },
  { id: '2', produit: 'Sésame blanc', quantite: '8 tonnes', prix: 480000, unite: 'tonne', origine: 'Dédougou, BF', certification: 'Non certifié', vues: 189, devis: 3, statut: 'Actif' },
  { id: '3', produit: 'Beurre de karité', quantite: '3 tonnes', prix: 920000, unite: 'tonne', origine: 'Ouahigouya, BF', certification: 'Fair Trade', vues: 424, devis: 5, statut: 'Actif' },
]

const STAT_CARDS = [
  { label: 'Offres actives', value: MOCK_STATS.offresActives.toString(), icon: Package, color: '#D4AF37', sub: '+1 ce mois' },
  { label: 'Vues totales', value: formatNombre(MOCK_STATS.vuesTotal), icon: Eye, color: '#00BCD4', sub: '+124 cette semaine' },
  { label: 'Devis reçus', value: MOCK_STATS.devisReçus.toString(), icon: FileText, color: '#D4AF37', sub: '3 en attente' },
  { label: 'Revenu total', value: (MOCK_STATS.revenuTotal / 1000000).toFixed(1) + 'M FCFA', icon: TrendingUp, color: '#00BCD4', sub: '+18% vs mois dernier' },
]

// ─── Données acheteur mock ───────────────────────────────────────────────────

const MOCK_ACHETEUR_STATS = [
  { label: 'Demandes envoyées', value: '18',          icon: Send,          color: '#D4AF37', sub: '+3 ce mois' },
  { label: 'En attente réponse', value: '5',          icon: Clock,         color: '#00D4FF', sub: 'Délai moy. 2j' },
  { label: 'Acceptées',          value: '11',         icon: CheckCircle2,  color: '#22d98a', sub: '61% de succès' },
  { label: 'Total XOF engagé',   value: '6,2M FCFA',  icon: Coins,         color: '#D4AF37', sub: '3 contrats actifs' },
]

const MOCK_TIMELINE = [
  { id: '1', type: 'accepted', culture: 'Sésame', producteur: 'A. Sawadogo', date: 'Il y a 2h',  montant: 1_360_000, color: '#22d98a', icon: CheckCircle2 },
  { id: '2', type: 'sent',     culture: 'Niébé',  producteur: 'M. Ouédraogo', date: 'Hier',      montant: 756_000,   color: '#D4AF37',  icon: Send },
  { id: '3', type: 'pending',  culture: 'Karité', producteur: 'F. Traoré',   date: 'Il y a 3j',  montant: 998_500,   color: '#00D4FF',  icon: Clock },
  { id: '4', type: 'accepted', culture: 'Coton',  producteur: 'A. Diallo',   date: 'Il y a 5j',  montant: 2_280_000, color: '#22d98a', icon: CheckCircle2 },
  { id: '5', type: 'rejected', culture: 'Sorgho', producteur: 'H. Tapsoba', date: 'Il y a 8j',  montant: 480_000,   color: '#ef4444',  icon: XCircle },
]


export default function DashboardClient() {
  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const }}>
        <h1 className="text-3xl font-black text-white mb-1">Tableau de bord</h1>
        <p className="text-gray-400">Vos performances du mois de juillet 2026</p>
      </motion.div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
        {STAT_CARDS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, delay: i * 0.08 }}>
            <Card className="bg-navy-card border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${s.color}20`, border: `1px solid ${s.color}30` }}>
                    <s.icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                </div>
                <div className="text-2xl font-black text-white mb-1">{s.value}</div>
                <div className="text-xs text-gray-400 mb-1">{s.label}</div>
                <div className="text-xs" style={{ color: s.color }}>{s.sub}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* CHART */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, delay: 0.35 }}>
        <Card className="bg-navy-card border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg font-bold">Volume des ventes — 6 derniers mois</CardTitle>
            <p className="text-gray-400 text-sm mt-1">Chiffre d&apos;affaires mensuel en FCFA</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={MOCK_CHART} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="mois" tick={{ fill: '#9CA3AF', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#9CA3AF', fontSize: 11 }} axisLine={false} tickLine={false}
                  tickFormatter={(v: number) => `${(v / 1000000).toFixed(1)}M`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0F2040', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 12, color: '#fff' }}
                  formatter={(v: number) => [formatFCFA(v), 'Ventes']}
                />
                <Bar dataKey="ventes" fill="#D4AF37" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>

      {/* OFFRES ACTIVES */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, delay: 0.45 }}>
        <Card className="bg-navy-card border-white/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white text-lg font-bold">Offres actives</CardTitle>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" style={{ color: '#D4AF37' }} />
                <span className="text-sm font-bold" style={{ color: '#D4AF37' }}>{MOCK_STATS.noteMoyenne}/5</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {MOCK_OFFRES.map((offre) => (
                <div key={offre.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 hover:border-[#D4AF37]/20 transition-all duration-200"
                  style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #0A1628, #0F2040)', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <Package className="w-5 h-5" style={{ color: '#D4AF37' }} />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{offre.produit}</div>
                      <div className="text-gray-400 text-xs mt-0.5">{offre.quantite} • {offre.origine}</div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-6 text-sm">
                    <div className="text-right">
                      <div className="text-white font-bold">{formatNombre(offre.prix)}</div>
                      <div className="text-gray-400 text-xs">FCFA/{offre.unite}</div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /><span className="text-xs">{offre.vues}</span></div>
                      <div className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /><span className="text-xs">{offre.devis}</span></div>
                    </div>
                    <Badge variant="gold">{offre.certification}</Badge>
                    <Badge variant="green">{offre.statut}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      {/* ── Stats acheteur ─────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, delay: 0.55 }}>
        <div className="flex items-center gap-3 mb-5">
          <Users2 className="w-5 h-5" style={{ color: '#D4AF37' }} />
          <h2 className="text-white font-bold text-lg">Activité acheteur</h2>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {MOCK_ACHETEUR_STATS.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring' as const, delay: 0.6 + i * 0.07 }}>
              <Card className="bg-navy-card border-white/10 hover:border-[#D4AF37]/30 transition-all duration-300">
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${s.color}18`, border: `1px solid ${s.color}28` }}>
                      <s.icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-green-400 opacity-60" />
                  </div>
                  <div className="text-2xl font-black text-white mb-0.5">{s.value}</div>
                  <div className="text-xs text-gray-400 mb-1">{s.label}</div>
                  <div className="text-xs font-medium" style={{ color: s.color }}>{s.sub}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Timeline activités récentes + CTA ──────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, delay: 0.7 }}
        className="grid lg:grid-cols-3 gap-6">

        {/* Timeline */}
        <div className="lg:col-span-2">
          <Card className="bg-navy-card border-white/10 h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-base font-bold">Activités récentes</CardTitle>
                <span className="text-xs text-gray-500">{MOCK_TIMELINE.length} dernières</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_TIMELINE.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                    style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: `${item.color}15`, border: `1px solid ${item.color}25` }}>
                      <item.icon className="w-4 h-4" style={{ color: item.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">
                        {item.culture} — <span className="font-normal text-gray-400">{item.producteur}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.date}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold font-mono" style={{ color: item.color }}>
                        {formatNombre(item.montant)}
                      </p>
                      <p className="text-xs text-gray-500">FCFA</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Matching */}
        <div className="flex flex-col gap-4">
          <Card className="flex-1 border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all duration-300 overflow-hidden relative"
            style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(0,212,255,0.04))' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10"
              style={{ background: '#D4AF37', transform: 'translate(30%, -30%)' }} />
            <CardContent className="pt-8 pb-6 flex flex-col items-start gap-4 relative">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
                <Users2 className="w-6 h-6 text-[#0A1628]" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg leading-tight mb-1">
                  Trouvez vos producteurs
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  10+ producteurs vérifiés au Burkina Faso. Sésame, Karité, Coton, Niébé et plus.
                </p>
              </div>
              <Link href="/matching"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-110 mt-auto"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)', color: '#0A1628' }}>
                Découvrir les offres
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardContent>
          </Card>

          {/* Mini stat engagé */}
          <Card className="border-white/10 bg-navy-card">
            <CardContent className="pt-5 pb-4">
              <p className="text-xs text-gray-400 mb-1">Total engagé YTD</p>
              <p className="text-2xl font-black" style={{ color: '#D4AF37' }}>6,2M FCFA</p>
              <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: '62%', background: 'linear-gradient(90deg, #D4AF37, #E8C84A)' }} />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">62% de l&apos;objectif annuel</p>
            </CardContent>
          </Card>
        </div>
      </motion.div>

    </div>
  )
}

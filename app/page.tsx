'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  TrendingUp, ShieldCheck, Globe2, ArrowRight,
  Package, Users, BarChart3, Star, ChevronRight,
  Wheat, Droplets, Leaf, Beef, SproutIcon, CircleDot
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { hoverScale } from '@/lib/animations'

const CATEGORIES = [
  { name: 'Coton', emoji: '🌿', icon: Leaf, volume: '2.1M tonnes/an', color: 'from-emerald-900/40 to-emerald-800/20', border: 'border-emerald-700/30' },
  { name: 'Sésame', emoji: '🌾', icon: Wheat, volume: '890K tonnes/an', color: 'from-yellow-900/40 to-yellow-800/20', border: 'border-yellow-700/30' },
  { name: 'Karité', emoji: '🫧', icon: Droplets, volume: '180K tonnes/an', color: 'from-amber-900/40 to-amber-800/20', border: 'border-amber-700/30' },
  { name: 'Maïs', emoji: '🌽', icon: SproutIcon, volume: '12M tonnes/an', color: 'from-orange-900/40 to-orange-800/20', border: 'border-orange-700/30' },
  { name: 'Arachide', emoji: '🥜', icon: CircleDot, volume: '4.2M tonnes/an', color: 'from-red-900/40 to-red-800/20', border: 'border-red-700/30' },
  { name: 'Bétail', emoji: '🐄', icon: Beef, volume: '320K têtes/an', color: 'from-purple-900/40 to-purple-800/20', border: 'border-purple-700/30' },
]

const STATS = [
  { label: 'Offres actives', value: '47', suffix: '', icon: Package },
  { label: 'Acheteurs vérifiés', value: '23', suffix: '', icon: ShieldCheck },
  { label: 'Pays couverts', value: '15', suffix: '', icon: Globe2 },
  { label: 'FCFA transactés', value: '2.4M', suffix: '', icon: TrendingUp },
]

const STEPS = [
  { step: '01', title: 'Lister votre production', desc: 'Créez votre offre en quelques minutes. Qualité, quantité, certification, conditions de livraison.', icon: Package, color: '#D4AF37' },
  { step: '02', title: 'Trouver des partenaires', desc: 'Parcourez le catalogue et filtrez par catégorie, pays, certification. Demandez un devis.', icon: Users, color: '#00BCD4' },
  { step: '03', title: 'Transacter en sécurité', desc: 'Négociez, validez et finalisez vos transactions B2B dans un environnement sécurisé.', icon: BarChart3, color: '#D4AF37' },
]

function CountUp({ end, duration = 2000 }: { end: string; duration?: number }) {
  const [display, setDisplay] = useState('0')
  useEffect(() => {
    const num = parseFloat(end.replace('M', ''))
    const isM = end.includes('M')
    const steps = 60
    const inc = num / steps
    let current = 0
    let step = 0
    const timer = setInterval(() => {
      step++
      current = Math.min(current + inc, num)
      if (isM) setDisplay(current.toFixed(1) + 'M')
      else setDisplay(Math.round(current).toString())
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [end, duration])
  return <>{display}</>
}

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A1628' }}>
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5" style={{ backgroundColor: 'rgba(10,22,40,0.95)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' }}>
              <Globe2 className="w-4 h-4 text-[#0A1628]" />
            </div>
            <span className="font-bold text-lg text-white">ValueChain<span style={{ color: '#D4AF37' }}>Connect</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/catalogue">
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">Catalogue</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] font-semibold">Accéder</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#D4AF37' }} />
          <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: '#00BCD4' }} />
        </div>
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring' as const, duration: 0.6 }}>
            <Badge className="mb-6 px-4 py-1.5 text-sm border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-[#D4AF37]">
              🌍 Zone CEDEAO — 15 pays
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
          >
            Connectez votre production<br />
            <span style={{ background: 'linear-gradient(135deg, #D4AF37, #00BCD4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              aux marchés de la CEDEAO
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, duration: 0.7, delay: 0.2 }}
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            La marketplace B2B de référence pour connecter producteurs, coopératives et transformateurs à travers les 15 pays de la CEDEAO.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring' as const, duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/dashboard">
              <Button size="xl" className="bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] font-bold shadow-lg gap-2 glow-gold">
                Je suis Producteur <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/catalogue">
              <Button size="xl" variant="cyan" className="font-bold gap-2 glow-cyan">
                Je suis Transformateur <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-6 border-y border-white/5" style={{ background: 'rgba(15,32,64,0.5)' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ type: 'spring' as const, delay: i * 0.1 }} className="text-center">
              <stat.icon className="w-6 h-6 mx-auto mb-2" style={{ color: '#D4AF37' }} />
              <div className="text-4xl font-black text-white">
                <CountUp end={stat.value} />
              </div>
              <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ type: 'spring' as const }} className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Comment ça marche</h2>
            <p className="text-gray-400 text-lg">3 étapes pour démarrer vos échanges commerciaux</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <motion.div key={s.step} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ type: 'spring' as const, delay: i * 0.15 }}
                {...hoverScale}
                className="relative p-8 rounded-2xl border border-white/10 bg-navy-card hover:border-[#D4AF37]/30 transition-colors cursor-default">
                <div className="text-6xl font-black opacity-10 text-white absolute top-4 right-6">{s.step}</div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${s.color}20`, border: `1px solid ${s.color}40` }}>
                  <s.icon className="w-6 h-6" style={{ color: s.color }} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-24 px-6" style={{ background: 'rgba(15,32,64,0.3)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ type: 'spring' as const }} className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">Catégories disponibles</h2>
            <p className="text-gray-400 text-lg">Les principales commodités agricoles de la zone CEDEAO</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.name} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ type: 'spring' as const, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { type: 'spring' as const, stiffness: 300 } }}
                className={`p-6 rounded-2xl bg-gradient-to-br ${cat.color} border ${cat.border} cursor-pointer`}>
                <div className="text-4xl mb-3">{cat.emoji}</div>
                <h3 className="text-lg font-bold text-white mb-1">{cat.name}</h3>
                <p className="text-sm text-gray-400">{cat.volume}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ type: 'spring' as const }}
            className="p-12 rounded-3xl border border-[#D4AF37]/20"
            style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(0,188,212,0.08))' }}>
            <div className="text-5xl mb-6">🌍</div>
            <h2 className="text-4xl font-black text-white mb-4">Rejoignez l&apos;écosystème FORGE Afrika</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              ValueChain Connect est la clé de voûte du commerce agricole B2B en Afrique de l&apos;Ouest. Rejoignez des centaines de producteurs et transformateurs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="xl" className="bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] font-bold gap-2">
                  Démarrer maintenant <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/catalogue">
                <Button size="xl" variant="outline" className="border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37]/10 font-semibold gap-2">
                  <Star className="w-5 h-5" /> Voir le catalogue
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 px-6 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© 2026 ValueChain Connect — FORGE Afrika Ecosystem • Zone CEDEAO</p>
      </footer>
    </div>
  )
}

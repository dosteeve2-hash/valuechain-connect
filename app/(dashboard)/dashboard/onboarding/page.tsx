'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  Globe2, User, Package, FileText, CheckCircle,
  Search, Send, ClipboardList, ArrowRight, Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type Role = 'producteur' | 'transformateur'

const STEPS: Record<Role, {
  numero: number
  titre: string
  desc: string
  icon: LucideIcon
  action: string
  href: string
  color: string
}[]> = {
  producteur: [
    {
      numero: 1,
      titre: 'Créer votre profil',
      desc: 'Renseignez les informations de votre coopérative ou exploitation : pays, certifications, membres, spécialités.',
      icon: User,
      action: 'Compléter mon profil',
      href: '/dashboard/profil',
      color: '#D4AF37',
    },
    {
      numero: 2,
      titre: 'Lister vos produits',
      desc: 'Publiez vos offres : type de produit, quantité disponible, prix/tonne, incoterm souhaité.',
      icon: Package,
      action: 'Créer une offre',
      href: '/dashboard/mes-offres',
      color: '#00BCD4',
    },
    {
      numero: 3,
      titre: 'Recevoir des devis',
      desc: 'Les acheteurs vous envoient des demandes de devis. Comparez, négociez, acceptez.',
      icon: FileText,
      action: 'Voir les devis',
      href: '/devis',
      color: '#D4AF37',
    },
    {
      numero: 4,
      titre: 'Conclure des ventes',
      desc: 'Finalisez vos transactions B2B et suivez l\'avancement de vos commandes en temps réel.',
      icon: CheckCircle,
      action: 'Mes commandes',
      href: '/dashboard/commandes',
      color: '#10B981',
    },
  ],
  transformateur: [
    {
      numero: 1,
      titre: 'Créer votre profil',
      desc: 'Présentez votre entreprise : secteur, capacité de transformation, pays d\'opération, certifications.',
      icon: User,
      action: 'Compléter mon profil',
      href: '/dashboard/profil',
      color: '#00BCD4',
    },
    {
      numero: 2,
      titre: 'Explorer le catalogue',
      desc: 'Parcourez les offres de producteurs vérifiés. Filtrez par produit, pays, certification, prix.',
      icon: Search,
      action: 'Explorer le catalogue',
      href: '/catalogue',
      color: '#D4AF37',
    },
    {
      numero: 3,
      titre: 'Envoyer des devis',
      desc: 'Contactez directement les producteurs avec vos exigences : volumes, qualité, délais, conditions.',
      icon: Send,
      action: 'Envoyer un devis',
      href: '/devis',
      color: '#00BCD4',
    },
    {
      numero: 4,
      titre: 'Gérer vos commandes',
      desc: 'Suivez l\'état de vos commandes, incoterms, dates de livraison et l\'avancement en temps réel.',
      icon: ClipboardList,
      action: 'Mes commandes',
      href: '/dashboard/commandes',
      color: '#10B981',
    },
  ],
}

const ROLE_CONFIG = {
  producteur: {
    emoji: '🌾',
    label: 'Producteur',
    color: '#D4AF37',
    bg: 'rgba(212,175,55,0.1)',
    border: 'border-[#D4AF37]/30',
  },
  transformateur: {
    emoji: '🏭',
    label: 'Transformateur',
    color: '#00BCD4',
    bg: 'rgba(0,188,212,0.1)',
    border: 'border-[#00BCD4]/30',
  },
}

export default function OnboardingPage() {
  // Détection du rôle (côté client : email ou querystring)
  // En mode démo, on commence par demander le rôle
  const [role, setRole] = useState<Role | null>(null)
  const [currentStep, setCurrentStep] = useState(0)

  if (!role) {
    return (
      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const }}
        >
          <h1 className="text-3xl font-black text-white mb-1">Bienvenue sur ValueChain Connect 🌍</h1>
          <p className="text-gray-400">Quel est votre rôle sur la plateforme ?</p>
        </motion.div>

        {/* Demo banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring' as const, delay: 0.1 }}
          className="flex items-center gap-3 p-4 rounded-xl border"
          style={{
            backgroundColor: 'rgba(212,175,55,0.06)',
            borderColor: 'rgba(212,175,55,0.2)',
          }}
        >
          <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: '#D4AF37' }} />
          <div>
            <div className="text-sm font-semibold" style={{ color: '#D4AF37' }}>Mode démo actif</div>
            <div className="text-xs text-gray-400">
              Explorez toutes les fonctionnalités avec des données simulées.
              Aucune donnée réelle n&apos;est créée.
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {(Object.entries(ROLE_CONFIG) as [Role, typeof ROLE_CONFIG[Role]][]).map(([key, cfg], i) => (
            <motion.button
              key={key}
              onClick={() => setRole(key)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring' as const, delay: 0.2 + i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-8 rounded-2xl border-2 text-left transition-all duration-200 ${cfg.border}`}
              style={{ background: cfg.bg }}
            >
              <div className="text-5xl mb-4">{cfg.emoji}</div>
              <div className="text-2xl font-black text-white mb-2">{cfg.label}</div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {key === 'producteur'
                  ? 'Vous produisez des matières premières et souhaitez vendre directement aux transformateurs.'
                  : 'Vous transformez ou exportez des matières premières et souhaitez sourcer des producteurs qualifiés.'
                }
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold" style={{ color: cfg.color }}>
                Continuer <ArrowRight className="w-4 h-4" />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="text-center">
          <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            Passer et aller au tableau de bord →
          </Link>
        </div>
      </div>
    )
  }

  const cfg = ROLE_CONFIG[role]
  const steps = STEPS[role]

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{cfg.emoji}</span>
          <h1 className="text-3xl font-black text-white">Guide {cfg.label}</h1>
        </div>
        <p className="text-gray-400">4 étapes pour démarrer sur ValueChain Connect</p>
      </motion.div>

      {/* Demo banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, delay: 0.1 }}
        className="flex items-center gap-3 p-4 rounded-xl border"
        style={{ backgroundColor: 'rgba(212,175,55,0.06)', borderColor: 'rgba(212,175,55,0.2)' }}
      >
        <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: '#D4AF37' }} />
        <div className="flex-1">
          <span className="text-sm font-semibold" style={{ color: '#D4AF37' }}>Mode démo · </span>
          <span className="text-xs text-gray-400">Toutes les fonctionnalités sont simulées avec des données d&apos;exemple.</span>
        </div>
        <Button size="sm" variant="ghost"
          className="text-xs text-gray-400 hover:text-white"
          onClick={() => setRole(null)}>
          Changer de rôle
        </Button>
      </motion.div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => (
          <div key={s.numero} className="flex items-center gap-2 flex-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-300 cursor-pointer"
              style={{
                background: i <= currentStep ? cfg.color : 'rgba(255,255,255,0.1)',
                color: i <= currentStep ? '#0A1628' : '#6B7280',
              }}
              onClick={() => setCurrentStep(i)}
            >
              {i < currentStep ? <CheckCircle className="w-4 h-4" /> : s.numero}
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-0.5 transition-all duration-300"
                style={{ background: i < currentStep ? cfg.color : 'rgba(255,255,255,0.1)' }} />
            )}
          </div>
        ))}
      </div>

      {/* Étapes */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {steps.map((step, i) => {
            const StepIcon = step.icon
            const isActive = i === currentStep
            const isDone = i < currentStep

            return (
              <motion.div
                key={step.numero}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring' as const, delay: i * 0.07 }}
              >
                <div
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${
                    isActive ? '' : isDone ? 'opacity-70' : 'opacity-50'
                  }`}
                  style={{
                    backgroundColor: isActive ? `${step.color}08` : 'rgba(15,32,64,0.4)',
                    borderColor: isActive ? `${step.color}50` : isDone ? `${step.color}20` : 'rgba(255,255,255,0.08)',
                  }}
                  onClick={() => setCurrentStep(i)}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{
                        background: `${step.color}15`,
                        border: `1px solid ${step.color}30`,
                      }}>
                      {isDone
                        ? <CheckCircle className="w-6 h-6" style={{ color: '#10B981' }} />
                        : <StepIcon className="w-6 h-6" style={{ color: step.color }} />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-bold">{step.titre}</span>
                        {isDone && <CheckCircle className="w-4 h-4 text-green-400" />}
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed mb-3">{step.desc}</p>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 4 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: 'spring' as const }}
                          className="flex items-center gap-3"
                        >
                          <Link href={step.href}>
                            <Button size="sm"
                              className="font-semibold gap-1 text-[#0A1628]"
                              style={{ backgroundColor: step.color }}>
                              {step.action} <ArrowRight className="w-3.5 h-3.5" />
                            </Button>
                          </Link>
                          {i < steps.length - 1 && (
                            <Button size="sm" variant="ghost"
                              className="text-gray-400 hover:text-white text-xs"
                              onClick={e => { e.stopPropagation(); setCurrentStep(i + 1) }}>
                              Passer cette étape →
                            </Button>
                          )}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* CTA Dashboard */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'spring' as const, delay: 0.5 }}
        className="pt-4 flex items-center justify-between"
      >
        <Link href="/dashboard">
          <Button variant="outline" className="border-white/10 text-gray-300 hover:text-white gap-2">
            <Globe2 className="w-4 h-4" />
            Aller au tableau de bord
          </Button>
        </Link>
        {currentStep === steps.length - 1 && (
          <Link href="/dashboard">
            <Button className="bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] font-bold gap-2">
              Terminer et démarrer <CheckCircle className="w-4 h-4" />
            </Button>
          </Link>
        )}
      </motion.div>
    </div>
  )
}

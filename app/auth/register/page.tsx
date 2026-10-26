'use client'

import { useState, type FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Loader2, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

type Role = 'producteur' | 'transformateur'

const ROLES = [
  {
    id: 'producteur' as Role,
    emoji: '🌾',
    title: 'Producteur',
    subtitle: 'Coopérative / Agriculteur',
    desc: 'Vous produisez des matières premières agricoles et souhaitez trouver des acheteurs directs en CEDEAO.',
    perks: ['Lister vos offres', 'Recevoir des devis', 'Négocier directement'],
    color: '#D4AF37',
    border: 'border-[#D4AF37]/30',
    bg: 'rgba(212,175,55,0.06)',
    bgHover: 'rgba(212,175,55,0.12)',
  },
  {
    id: 'transformateur' as Role,
    emoji: '🏭',
    title: 'Transformateur',
    subtitle: 'Industriel / Exportateur',
    desc: 'Vous achetez des matières premières pour les transformer ou les exporter. Sourcez directement auprès des producteurs.',
    perks: ['Explorer le catalogue', 'Envoyer des devis', 'Gérer vos commandes'],
    color: '#00BCD4',
    border: 'border-[#00BCD4]/30',
    bg: 'rgba(0,188,212,0.06)',
    bgHover: 'rgba(0,188,212,0.12)',
  },
]

const PAYS_CEDEAO = [
  'Bénin', 'Burkina Faso', 'Cabo Verde', 'Côte d\'Ivoire', 'Gambie', 'Ghana',
  'Guinée', 'Guinée-Bissau', 'Libéria', 'Mali', 'Mauritanie', 'Niger',
  'Nigeria', 'Sénégal', 'Sierra Leone', 'Togo',
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    nom: '',
    email: '',
    password: '',
    pays: 'Burkina Faso',
    telephone: '',
  })

  function handleField(field: keyof typeof form, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleRegister(e: FormEvent) {
    e.preventDefault()
    if (!selectedRole) return
    setLoading(true)
    setError('')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const isDemo = !supabaseUrl || supabaseUrl === 'your_supabase_project_url'

    if (isDemo) {
      // Mode démo : simuler l'inscription
      await new Promise(r => setTimeout(r, 1000))
      router.push('/dashboard/onboarding')
      return
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          role: selectedRole,
          nom: form.nom,
          pays: form.pays,
          telephone: form.telephone,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard/onboarding')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: '#0A1628' }}>

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ background: '#D4AF37' }} />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ background: '#00BCD4' }} />
      </div>

      <div className="w-full max-w-2xl relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <Image src="/brand/logo-sombre.svg" alt="ValueChain Connect" width={395} height={88} className="h-11 w-auto" />
          </Link>

          {/* Progress steps */}
          <div className="flex items-center justify-center gap-3 mt-4">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                  step === s
                    ? 'text-[#0A1628]'
                    : step > s
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-gray-500'
                }`} style={step === s ? { background: 'linear-gradient(135deg, #D4AF37, #E8C84A)' } : {}}>
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                {s < 2 && <div className={`w-12 h-0.5 transition-all duration-300 ${step > 1 ? 'bg-[#D4AF37]' : 'bg-white/10'}`} />}
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-sm mt-3">
            {step === 1 ? 'Choisissez votre rôle' : 'Créez votre compte'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: 'spring' as const, duration: 0.4 }}
            >
              <h2 className="text-2xl font-black text-white text-center mb-6">
                Qui êtes-vous ?
              </h2>
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {ROLES.map(role => (
                  <motion.button
                    key={role.id}
                    onClick={() => setSelectedRole(role.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-2xl border-2 text-left transition-all duration-200 ${role.border}`}
                    style={{
                      background: selectedRole === role.id ? role.bgHover : role.bg,
                      boxShadow: selectedRole === role.id ? `0 0 20px ${role.color}25` : 'none',
                    }}
                  >
                    <div className="text-4xl mb-3">{role.emoji}</div>
                    <div className="text-xl font-black text-white mb-0.5">{role.title}</div>
                    <div className="text-sm mb-3" style={{ color: role.color }}>{role.subtitle}</div>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">{role.desc}</p>
                    <ul className="space-y-1">
                      {role.perks.map(perk => (
                        <li key={perk} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ background: role.color }} />
                          {perk}
                        </li>
                      ))}
                    </ul>
                    {selectedRole === role.id && (
                      <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: role.color }}>
                        <CheckCircle className="w-3.5 h-3.5" /> Sélectionné
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!selectedRole}
                className="w-full h-12 bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] font-bold text-base"
              >
                Continuer →
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ type: 'spring' as const, duration: 0.4 }}
            >
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors text-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Retour
              </button>

              <div className="rounded-2xl border border-white/10 p-8"
                style={{ backgroundColor: 'rgba(15,32,64,0.8)', backdropFilter: 'blur(12px)' }}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-2xl">
                    {ROLES.find(r => r.id === selectedRole)?.emoji}
                  </span>
                  <div>
                    <div className="text-white font-bold">
                      {ROLES.find(r => r.id === selectedRole)?.title}
                    </div>
                    <div className="text-xs text-gray-400">
                      {ROLES.find(r => r.id === selectedRole)?.subtitle}
                    </div>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Nom / Raison sociale *
                      </label>
                      <Input
                        value={form.nom}
                        onChange={e => handleField('nom', e.target.value)}
                        placeholder="Coopérative Koudougou"
                        required
                        className="h-11 border-white/10 text-white"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Email *
                      </label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={e => handleField('email', e.target.value)}
                        placeholder="contact@coop-koudougou.bf"
                        required
                        className="h-11 border-white/10 text-white"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Mot de passe *
                      </label>
                      <Input
                        type="password"
                        value={form.password}
                        onChange={e => handleField('password', e.target.value)}
                        placeholder="8 caractères minimum"
                        required
                        minLength={8}
                        className="h-11 border-white/10 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Pays *
                      </label>
                      <select
                        value={form.pays}
                        onChange={e => handleField('pays', e.target.value)}
                        required
                        className="flex h-11 w-full rounded-md border border-white/10 bg-secondary px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                        style={{ backgroundColor: 'rgba(15,32,64,0.8)' }}
                      >
                        {PAYS_CEDEAO.map(p => (
                          <option key={p} value={p} className="bg-[#0A1628]">{p}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">
                        Téléphone
                      </label>
                      <Input
                        type="tel"
                        value={form.telephone}
                        onChange={e => handleField('telephone', e.target.value)}
                        placeholder="+226 25 33 44 55"
                        className="h-11 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] font-bold text-base mt-2"
                  >
                    {loading ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Création du compte…</>
                    ) : (
                      'Créer mon compte 🌍'
                    )}
                  </Button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Déjà inscrit ?{' '}
          <Link href="/auth/login"
            className="font-semibold hover:underline"
            style={{ color: '#D4AF37' }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  )
}

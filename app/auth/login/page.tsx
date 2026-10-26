'use client'

import { Suspense, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'

const DEMO_ACCOUNTS = [
  {
    emoji: '🌾',
    role: 'Producteur',
    email: 'producteur@demo.com',
    password: 'Demo2026!',
    desc: 'Coopérative agricole / Vendeur',
    color: '#D4AF37',
  },
  {
    emoji: '🏭',
    role: 'Transformateur',
    email: 'transformateur@demo.com',
    password: 'Demo2026!',
    desc: 'Industriel / Acheteur',
    color: '#00BCD4',
  },
]

// ─── Contenu du formulaire (isolé pour useSearchParams) ───────────────────────

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const isDemo = !supabaseUrl || supabaseUrl === 'your_supabase_project_url'

    if (isDemo) {
      const demoAccount = DEMO_ACCOUNTS.find(
        a => a.email === email && a.password === password
      )
      if (demoAccount) {
        await new Promise(r => setTimeout(r, 800))
        router.push('/dashboard/onboarding')
        return
      } else {
        setError('En mode démo, utilisez un des comptes démo ci-dessous.')
        setLoading(false)
        return
      }
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect.'
        : authError.message)
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  function fillDemo(account: typeof DEMO_ACCOUNTS[0]) {
    setEmail(account.email)
    setPassword(account.password)
    setError('')
  }

  return (
    <div className="min-h-screen overflow-x-hidden flex items-center justify-center px-4"
      style={{ backgroundColor: '#0A1628' }}>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ background: '#D4AF37' }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ background: '#00BCD4' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring' as const, duration: 0.6 }}
        className="w-full max-w-md relative"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <Image src="/brand/logo-sombre.svg" alt="ValueChain Connect" width={395} height={88} className="h-11 w-auto" />
          </Link>
          <h1 className="text-xl font-bold text-white mt-2">Bon retour 👋</h1>
          <p className="text-gray-400 text-sm mt-1">Connectez-vous à votre espace B2B</p>
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-500 text-center mb-3 uppercase tracking-wider">
            Comptes démo disponibles
          </p>
          <div className="grid grid-cols-2 gap-3">
            {DEMO_ACCOUNTS.map((acc) => (
              <motion.button
                key={acc.role}
                onClick={() => fillDemo(acc)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-xl text-left transition-all duration-200 border"
                style={{
                  backgroundColor: `${acc.color}08`,
                  borderColor: `${acc.color}30`,
                }}
              >
                <div className="text-2xl mb-1">{acc.emoji}</div>
                <div className="font-semibold text-white text-sm">Démo {acc.role}</div>
                <div className="text-xs text-gray-500 mt-0.5">{acc.desc}</div>
                <div className="mt-2 text-xs font-mono break-all" style={{ color: acc.color }}>
                  {acc.email}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 p-8"
          style={{ backgroundColor: 'rgba(15,32,64,0.8)', backdropFilter: 'blur(12px)' }}>

          <form onSubmit={handleLogin} className="space-y-4">
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

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Adresse email
              </label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                className="h-11 bg-navy-light border-white/10 text-white placeholder:text-gray-600
                  focus-visible:ring-[#D4AF37] focus-visible:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="h-11 bg-navy-light border-white/10 text-white placeholder:text-gray-600
                    focus-visible:ring-[#D4AF37] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#D4AF37] text-[#0A1628] hover:bg-[#E8C84A] font-bold text-base"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Connexion…</>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-gray-500 text-sm">
          Pas encore inscrit ?{' '}
          <Link href="/auth/register"
            className="font-semibold hover:underline transition-colors"
            style={{ color: '#D4AF37' }}>
            Choisissez votre rôle →
          </Link>
        </p>
      </motion.div>
    </div>
  )
}

// ─── Page exportée avec Suspense ──────────────────────────────────────────────

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0A1628' }}>
        <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  )
}

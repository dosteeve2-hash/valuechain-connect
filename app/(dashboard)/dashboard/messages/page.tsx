'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Search } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string
  auteur: 'moi' | 'eux'
  texte: string
  heure: string
  lu: boolean
}

interface Conversation {
  id: string
  nom: string
  role: string
  initiales: string
  couleur: string
  dernier: string
  heure: string
  nonLus: number
  messages: Message[]
}

// ─── Données mock ─────────────────────────────────────────────────────────────

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    nom: 'Amadou Traoré',
    role: 'Acheteur · Minoterie du Sahel',
    initiales: 'AT',
    couleur: '#D4AF37',
    dernier: 'Quand pouvez-vous livrer les 50t ?',
    heure: '14:32',
    nonLus: 2,
    messages: [
      { id: 'm1', auteur: 'eux', texte: 'Bonjour, j\'ai bien reçu votre offre pour le maïs.', heure: '09:10', lu: true },
      { id: 'm2', auteur: 'moi', texte: 'Bonjour Amadou ! Oui, nous pouvons honorer 50 tonnes de maïs jaune grade A.', heure: '09:45', lu: true },
      { id: 'm3', auteur: 'eux', texte: 'Excellent. Le prix de 175 000 FCFA/tonne vous convient toujours ?', heure: '10:02', lu: true },
      { id: 'm4', auteur: 'moi', texte: 'Tout à fait. Nous pouvons signer le contrat cette semaine.', heure: '10:15', lu: true },
      { id: 'm5', auteur: 'eux', texte: 'Quand pouvez-vous livrer les 50t ?', heure: '14:32', lu: false },
    ],
  },
  {
    id: '2',
    nom: 'Fatoumata Diallo',
    role: 'Acheteur · cosmétique (démo)',
    initiales: 'FD',
    couleur: '#00BCD4',
    dernier: 'Les certificats bio sont requis.',
    heure: '11:15',
    nonLus: 1,
    messages: [
      { id: 'm1', auteur: 'eux', texte: 'Bonjour, concernant le contrat CTR-002 sur le karité…', heure: '08:30', lu: true },
      { id: 'm2', auteur: 'moi', texte: 'Bonjour Fatoumata. Que souhaitez-vous savoir ?', heure: '08:55', lu: true },
      { id: 'm3', auteur: 'eux', texte: 'Les certificats bio sont requis.', heure: '11:15', lu: false },
    ],
  },
  {
    id: '3',
    nom: 'Moussa Coulibaly',
    role: 'Vendeur · AgroTrack Exports',
    initiales: 'MC',
    couleur: '#10B981',
    dernier: 'Paiement reçu, merci !',
    heure: 'Hier',
    nonLus: 0,
    messages: [
      { id: 'm1', auteur: 'eux', texte: 'Le sésame est prêt à l\'expédition.', heure: 'Hier 16:00', lu: true },
      { id: 'm2', auteur: 'moi', texte: 'Parfait, virement effectué ce matin.', heure: 'Hier 16:45', lu: true },
      { id: 'm3', auteur: 'eux', texte: 'Paiement reçu, merci !', heure: 'Hier 17:20', lu: true },
    ],
  },
  {
    id: '4',
    nom: 'Issouf Kaboré',
    role: 'Acheteur · filature, Ghana (démo)',
    initiales: 'IK',
    couleur: '#F59E0B',
    dernier: 'On étudie votre proposition.',
    heure: 'Lun',
    nonLus: 0,
    messages: [
      { id: 'm1', auteur: 'moi', texte: 'Bonjour Issouf, je vous propose 20 tonnes de coton grade A à 270 000 FCFA/t.', heure: 'Lun 10:00', lu: true },
      { id: 'm2', auteur: 'eux', texte: 'On étudie votre proposition.', heure: 'Lun 14:30', lu: true },
    ],
  },
]

// ─── Composant bulle message ──────────────────────────────────────────────────

function Bulle({ msg }: { msg: Message }) {
  const isMoi = msg.auteur === 'moi'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring' as const, damping: 20 }}
      className={`flex ${isMoi ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div className={`max-w-[72%] ${isMoi ? 'order-2' : 'order-1'}`}>
        <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isMoi
            ? 'bg-[#D4AF37] text-[#0A1628] font-medium rounded-br-sm'
            : 'bg-white/8 text-white border border-white/10 rounded-bl-sm'
        }`}>
          {msg.texte}
        </div>
        <div className={`text-[10px] text-gray-500 mt-1 ${isMoi ? 'text-right' : 'text-left'}`}>
          {msg.heure}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Avatar initiales ─────────────────────────────────────────────────────────

function Avatar({ initiales, couleur, size = 'md' }: { initiales: string; couleur: string; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-11 h-11 text-sm'
  return (
    <div
      className={`${dim} rounded-full flex items-center justify-center font-bold text-[#0A1628] flex-shrink-0`}
      style={{ background: `linear-gradient(135deg, ${couleur}, ${couleur}cc)` }}
    >
      {initiales}
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function MessagesPage() {
  const [convActive, setConvActive] = useState<Conversation>(MOCK_CONVERSATIONS[0])
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS)
  const [recherche, setRecherche] = useState('')
  const [saisie, setSaisie] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll en bas à chaque changement de conversation / message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [convActive.id, convActive.messages.length])

  function ouvrirConversation(conv: Conversation) {
    // Marquer les messages comme lus
    const updated = conversations.map(c =>
      c.id === conv.id
        ? { ...c, nonLus: 0, messages: c.messages.map(m => ({ ...m, lu: true })) }
        : c
    )
    setConversations(updated)
    setConvActive({ ...conv, nonLus: 0, messages: conv.messages.map(m => ({ ...m, lu: true })) })
  }

  function envoyer() {
    if (!saisie.trim()) return
    const nouveau: Message = {
      id: `m${Date.now()}`,
      auteur: 'moi',
      texte: saisie.trim(),
      heure: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      lu: true,
    }
    const convMaj = { ...convActive, messages: [...convActive.messages, nouveau], dernier: saisie.trim() }
    setConvActive(convMaj)
    setConversations(cs => cs.map(c => c.id === convActive.id ? convMaj : c))
    setSaisie('')
  }

  const convFiltrees = conversations.filter(c =>
    c.nom.toLowerCase().includes(recherche.toLowerCase()) ||
    c.role.toLowerCase().includes(recherche.toLowerCase())
  )

  const totalNonLus = conversations.reduce((s, c) => s + c.nonLus, 0)

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-0 rounded-2xl overflow-hidden border border-white/10">

      {/* ── Sidebar conversations ── */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r border-white/10" style={{ backgroundColor: '#060E1A' }}>
        {/* Header sidebar */}
        <div className="p-4 border-b border-white/5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-white font-bold text-lg">Messages</h2>
            {totalNonLus > 0 && (
              <span className="bg-[#D4AF37] text-[#0A1628] text-xs font-bold px-2 py-0.5 rounded-full">
                {totalNonLus}
              </span>
            )}
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
              placeholder="Rechercher…"
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#D4AF37]/40"
            />
          </div>
        </div>

        {/* Liste conversations */}
        <div className="flex-1 overflow-y-auto">
          {convFiltrees.map(conv => {
            const active = conv.id === convActive.id
            return (
              <button
                key={conv.id}
                onClick={() => ouvrirConversation(conv)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 transition-colors text-left border-b border-white/5 ${
                  active ? 'bg-[#D4AF37]/10' : 'hover:bg-white/5'
                }`}
              >
                <div className="relative">
                  <Avatar initiales={conv.initiales} couleur={conv.couleur} size="sm" />
                  {conv.nonLus > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#D4AF37] text-[#0A1628] text-[9px] font-bold rounded-full flex items-center justify-center">
                      {conv.nonLus}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className={`text-sm font-semibold truncate ${active ? 'text-[#D4AF37]' : 'text-white'}`}>
                      {conv.nom}
                    </span>
                    <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2">{conv.heure}</span>
                  </div>
                  <div className="text-[10px] text-gray-500 truncate mb-0.5">{conv.role}</div>
                  <div className={`text-xs truncate ${conv.nonLus > 0 ? 'text-white font-medium' : 'text-gray-500'}`}>
                    {conv.dernier}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Zone conversation ── */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: '#0A1628' }}>
        {/* Header conversation */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/10"
          style={{ backgroundColor: 'rgba(6,14,26,0.8)', backdropFilter: 'blur(10px)' }}>
          <Avatar initiales={convActive.initiales} couleur={convActive.couleur} />
          <div>
            <div className="text-white font-bold">{convActive.nom}</div>
            <div className="text-xs text-gray-400">{convActive.role}</div>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-gray-400">En ligne</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AnimatePresence initial={false}>
            {convActive.messages.map(msg => (
              <Bulle key={msg.id} msg={msg} />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Saisie */}
        <div className="px-6 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <input
              value={saisie}
              onChange={e => setSaisie(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); envoyer() } }}
              placeholder="Écrire un message…"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#D4AF37]/50 transition-colors"
            />
            <button
              onClick={envoyer}
              disabled={!saisie.trim()}
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: saisie.trim() ? 'linear-gradient(135deg, #D4AF37, #E8C84A)' : 'rgba(255,255,255,0.05)' }}
            >
              <Send className="w-4 h-4 text-[#0A1628]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

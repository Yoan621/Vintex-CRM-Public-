'use client'

import { useState } from 'react'
import { Eye, EyeOff, Copy, RefreshCw, Check, User, Key, Chrome } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import { TimePeriod } from '@/components/shared/TimeFilter'
import { AccountOption } from '@/components/dashboard/AccountSelector'

function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return 'vtx_' + Array.from({ length: 40 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function ParametresPage() {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('month')
  const [selectedAccount, setSelectedAccount] = useState<AccountOption>('all')

  // Compte
  const [username, setUsername] = useState('Yoan Duclaux')
  const [email, setEmail] = useState('yoan.tavel@gmail.com')
  const [vintedAccount, setVintedAccount] = useState('@truthshop')

  // Clé API
  const [apiKey, setApiKey] = useState(() => generateApiKey())
  const [isKeyVisible, setIsKeyVisible] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [regenerating, setRegenerating] = useState(false)

  // Extension
  const [crmUrl, setCrmUrl] = useState('http://localhost:3002')
  const [copiedConfig, setCopiedConfig] = useState(false)

  function handleCopyKey() {
    navigator.clipboard.writeText(apiKey)
    setCopiedKey(true)
    setTimeout(() => setCopiedKey(false), 2000)
  }

  function handleRegenerate() {
    setRegenerating(true)
    setTimeout(() => {
      setApiKey(generateApiKey())
      setIsKeyVisible(false)
      setRegenerating(false)
    }, 600)
  }

  function handleCopyConfig() {
    const config = JSON.stringify(
      {
        crmUrl,
        apiKey,
        vintedAccount,
      },
      null,
      2
    )
    navigator.clipboard.writeText(config)
    setCopiedConfig(true)
    setTimeout(() => setCopiedConfig(false), 2000)
  }

  const maskedKey = apiKey.slice(0, 8) + '••••••••••••••••••••••••••••••••' + apiKey.slice(-4)

  return (
    <div className="min-h-screen">
      <DashboardHeader
        title="Paramètres"
        timePeriod={timePeriod}
        onTimePeriodChange={setTimePeriod}
        selectedAccount={selectedAccount}
        onAccountChange={setSelectedAccount}
      />

      <div className="max-w-3xl mx-auto px-8 py-8 space-y-6">

        {/* Section Mon Compte */}
        <section className="bg-[#0E0E0E] rounded-xl border border-[#1A1A1A]">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1A1A1A]">
            <div className="p-2 rounded-full bg-primary shadow-[0_4px_16px_rgba(0,60,243,0.4)]">
              <User className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-[15px] font-semibold text-foreground tracking-tight">Mon Compte</h2>
          </div>

          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">
                Nom d'utilisateur
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-[#18181b] border border-[#27272a] rounded-[10px] px-4 py-2.5 text-[14px] text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,60,243,0.15)] transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">
                Adresse e-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#18181b] border border-[#27272a] rounded-[10px] px-4 py-2.5 text-[14px] text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,60,243,0.15)] transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">
                Compte Vinted
              </label>
              <input
                type="text"
                value={vintedAccount}
                onChange={e => setVintedAccount(e.target.value)}
                placeholder="@pseudo"
                className="w-full bg-[#18181b] border border-[#27272a] rounded-[10px] px-4 py-2.5 text-[14px] text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,60,243,0.15)] transition-all duration-200"
              />
            </div>
            <div className="pt-1">
              <button className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-[10px] text-[14px] font-semibold shadow-[0_4px_16px_rgba(0,60,243,0.4)] hover:translate-y-[-1px] hover:shadow-[0_4px_20px_rgba(0,60,243,0.5)] transition-all duration-250">
                Sauvegarder
              </button>
            </div>
          </div>
        </section>

        {/* Section Clé API */}
        <section className="bg-[#0E0E0E] rounded-xl border border-[#1A1A1A]">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1A1A1A]">
            <div className="p-2 rounded-full bg-primary shadow-[0_4px_16px_rgba(0,60,243,0.4)]">
              <Key className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-[15px] font-semibold text-foreground tracking-tight">Clé API</h2>
          </div>

          <div className="px-6 py-5 space-y-4">
            <p className="text-[13px] text-foreground/50">
              Utilisez cette clé pour connecter l'extension Chrome à votre CRM. Ne la partagez pas.
            </p>

            {/* Affichage clé */}
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-[#18181b] border border-[#27272a] rounded-[10px] px-4 py-2.5 font-mono text-[13px] text-foreground/80 truncate select-all">
                {isKeyVisible ? apiKey : maskedKey}
              </div>

              {/* Révéler */}
              <button
                onClick={() => setIsKeyVisible(v => !v)}
                title={isKeyVisible ? 'Masquer' : 'Révéler'}
                className="w-10 h-10 bg-[#18181b] border border-[#27272a] rounded-[10px] flex items-center justify-center text-foreground/60 hover:bg-primary hover:border-primary hover:text-white hover:shadow-[0_4px_16px_rgba(0,60,243,0.4)] transition-all duration-250 flex-shrink-0"
              >
                {isKeyVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>

              {/* Copier */}
              <button
                onClick={handleCopyKey}
                title="Copier la clé"
                className="w-10 h-10 bg-[#18181b] border border-[#27272a] rounded-[10px] flex items-center justify-center text-foreground/60 hover:bg-primary hover:border-primary hover:text-white hover:shadow-[0_4px_16px_rgba(0,60,243,0.4)] transition-all duration-250 flex-shrink-0"
              >
                {copiedKey ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Regénérer */}
            <button
              onClick={handleRegenerate}
              disabled={regenerating}
              className="flex items-center gap-2 bg-[#18181b] border border-[#27272a] hover:border-primary/50 text-foreground/70 hover:text-foreground px-4 py-2.5 rounded-[10px] text-[13px] font-medium transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${regenerating ? 'animate-spin' : ''}`} />
              Regénérer la clé
            </button>

            <p className="text-[11px] text-foreground/30">
              Regénérer invalidera immédiatement l'ancienne clé. Pensez à mettre à jour votre extension.
            </p>
          </div>
        </section>

        {/* Section Extension Chrome */}
        <section className="bg-[#0E0E0E] rounded-xl border border-[#1A1A1A]">
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#1A1A1A]">
            <div className="p-2 rounded-full bg-primary shadow-[0_4px_16px_rgba(0,60,243,0.4)]">
              <Chrome className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-[15px] font-semibold text-foreground tracking-tight">Extension Chrome</h2>
          </div>

          <div className="px-6 py-5 space-y-4">
            <p className="text-[13px] text-foreground/50">
              Copiez cette configuration et collez-la dans les options de l'extension Vintex CRM.
            </p>

            <div>
              <label className="block text-[12px] font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">
                URL du CRM
              </label>
              <input
                type="text"
                value={crmUrl}
                onChange={e => setCrmUrl(e.target.value)}
                className="w-full bg-[#18181b] border border-[#27272a] rounded-[10px] px-4 py-2.5 text-[14px] text-foreground placeholder-foreground/30 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,60,243,0.15)] transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">
                Clé API
              </label>
              <div className="w-full bg-[#18181b] border border-[#27272a] rounded-[10px] px-4 py-2.5 font-mono text-[13px] text-foreground/40 truncate">
                {maskedKey}
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-medium text-foreground/50 mb-1.5 uppercase tracking-wider">
                Compte Vinted
              </label>
              <div className="w-full bg-[#18181b] border border-[#27272a] rounded-[10px] px-4 py-2.5 text-[14px] text-foreground/60">
                {vintedAccount || '—'}
              </div>
            </div>

            {/* Copier la config */}
            <button
              onClick={handleCopyConfig}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-[10px] text-[14px] font-semibold shadow-[0_4px_16px_rgba(0,60,243,0.4)] hover:translate-y-[-1px] hover:shadow-[0_4px_20px_rgba(0,60,243,0.5)] transition-all duration-250"
            >
              {copiedConfig ? (
                <>
                  <Check className="w-4 h-4" />
                  Copié !
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copier la config
                </>
              )}
            </button>
          </div>
        </section>

      </div>
    </div>
  )
}

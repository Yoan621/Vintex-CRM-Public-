'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Eye, EyeOff, Copy, Check, Trash2, Plus, LogOut,
  Users, Activity, Key, RefreshCw, X, Shield, Menu
} from 'lucide-react'
import { useSidebar } from '@/contexts/SidebarContext'

interface ExtensionConfig {
  id: string
  vintedAccount: string
  apiKey: string
  isActive: boolean
  lastSyncVentes: string | null
  lastSyncAchats: string | null
  createdAt: string
  updatedAt: string
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(date: string | null): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  }).format(new Date(date))
}

function maskKey(key: string): string {
  return key.slice(0, 8) + '••••••••••••••••••••••••' + key.slice(-4)
}

// ─── Login ───────────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState('')
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        onLogin()
      } else {
        setError('Mot de passe incorrect.')
      }
    } catch {
      setError('Erreur de connexion. Vérifiez que le serveur est démarré.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1f23] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_20px_rgba(0,60,243,0.5)] mb-4">
            VC
          </div>
          <h1 className="text-[20px] font-semibold text-foreground tracking-tight">Back Office Admin</h1>
          <p className="text-[13px] text-foreground/40 mt-1">Accès restreint — Vintex CRM</p>
        </div>

        {/* Card */}
        <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-xl p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-[14px] font-medium text-foreground/70">Authentification</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-foreground/40 uppercase tracking-wider mb-1.5">
                Mot de passe admin
              </label>
              <div className="relative">
                <input
                  type={visible ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  autoFocus
                  required
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-[10px] px-4 py-2.5 pr-10 text-[14px] text-foreground placeholder-foreground/20 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,60,243,0.15)] transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setVisible(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/70 transition-colors"
                >
                  {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-[8px] px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-primary text-white py-2.5 rounded-[10px] text-[14px] font-semibold shadow-[0_4px_16px_rgba(0,60,243,0.4)] hover:translate-y-[-1px] hover:shadow-[0_4px_20px_rgba(0,60,243,0.5)] transition-all duration-250 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : null}
              Accéder
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Modale Nouvelle Clé ─────────────────────────────────────────────────────

function NewKeyModal({ onClose, onCreated }: { onClose: () => void; onCreated: (config: ExtensionConfig) => void }) {
  const [vintedAccount, setVintedAccount] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState<ExtensionConfig | null>(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/configs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vintedAccount: vintedAccount.startsWith('@') ? vintedAccount : `@${vintedAccount}` }),
      })

      const data = await res.json()
      if (res.ok) {
        setCreated(data.config)
        onCreated(data.config)
      } else {
        setError(data.error || 'Erreur lors de la création.')
      }
    } catch {
      setError('Erreur réseau.')
    } finally {
      setLoading(false)
    }
  }

  function copyKey() {
    if (!created) return
    navigator.clipboard.writeText(created.apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
      <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-full bg-primary shadow-[0_4px_14px_rgba(0,60,243,0.4)]">
              <Key className="w-4 h-4 text-white" />
            </div>
            <span className="text-[14px] font-semibold text-foreground">Générer une clé API</span>
          </div>
          <button onClick={onClose} className="text-foreground/40 hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          {!created ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-foreground/40 uppercase tracking-wider mb-1.5">
                  Compte Vinted
                </label>
                <input
                  type="text"
                  value={vintedAccount}
                  onChange={e => setVintedAccount(e.target.value)}
                  placeholder="@pseudo"
                  autoFocus
                  required
                  className="w-full bg-[#18181b] border border-[#27272a] rounded-[10px] px-4 py-2.5 text-[14px] text-foreground placeholder-foreground/20 focus:outline-none focus:border-primary focus:shadow-[0_0_0_3px_rgba(0,60,243,0.15)] transition-all duration-200"
                />
              </div>

              {error && (
                <p className="text-[13px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-[8px] px-3 py-2">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-[#18181b] border border-[#27272a] text-foreground/60 hover:text-foreground py-2.5 rounded-[10px] text-[14px] font-medium transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading || !vintedAccount.trim()}
                  className="flex-1 bg-primary text-white py-2.5 rounded-[10px] text-[14px] font-semibold shadow-[0_4px_16px_rgba(0,60,243,0.4)] hover:translate-y-[-1px] transition-all duration-250 disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 flex items-center justify-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                  Générer
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="bg-success/10 border border-success/25 rounded-[10px] px-4 py-3 text-[13px] text-success">
                ✅ Clé générée pour <strong>{created.vintedAccount}</strong>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-foreground/40 uppercase tracking-wider mb-1.5">
                  Clé API — copiez-la maintenant, elle ne sera plus affichée
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-[#18181b] border border-[#27272a] rounded-[10px] px-3 py-2.5 font-mono text-[12px] text-foreground/80 truncate">
                    {created.apiKey}
                  </div>
                  <button
                    onClick={copyKey}
                    className="w-10 h-10 bg-[#18181b] border border-[#27272a] rounded-[10px] flex items-center justify-center text-foreground/60 hover:bg-primary hover:border-primary hover:text-white transition-all duration-250 flex-shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-[#18181b] border border-[#27272a] text-foreground/60 hover:text-foreground py-2.5 rounded-[10px] text-[14px] font-medium transition-all duration-200"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { toggleCollapse } = useSidebar()
  const [configs, setConfigs] = useState<ExtensionConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewKey, setShowNewKey] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  const fetchConfigs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/configs')
      if (res.ok) {
        const data = await res.json()
        setConfigs(data.configs)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchConfigs() }, [fetchConfigs])

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    onLogout()
  }

  async function handleRevoke(id: string) {
    setRevokingId(id)
    try {
      const res = await fetch(`/api/admin/configs/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setConfigs(prev => prev.map(c => c.id === id ? { ...c, isActive: false } : c))
      }
    } finally {
      setRevokingId(null)
    }
  }

  function toggleKeyVisibility(id: string) {
    setVisibleKeys(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function copyKey(id: string, key: string) {
    navigator.clipboard.writeText(key)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function handleCreated(config: ExtensionConfig) {
    setConfigs(prev => [config, ...prev])
  }

  const activeCount = configs.filter(c => c.isActive).length
  const lastSync = configs
    .flatMap(c => [c.lastSyncVentes, c.lastSyncAchats])
    .filter(Boolean)
    .sort()
    .at(-1) ?? null

  return (
    <div className="min-h-screen bg-[#1a1f23]">
      {/* Header */}
      <div className="bg-black border-b border-[#1A1A1A] sticky top-0 z-40">
        <div className="flex items-center justify-between px-8 h-[60px]">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleCollapse}
              className="w-9 h-9 bg-[#18181b] border border-transparent rounded-[10px] flex items-center justify-center text-white hover:bg-[#003CF3] hover:shadow-[0_4px_16px_rgba(0,60,243,0.4)] hover:scale-105 transition-all duration-250"
              title="Réduire/Étendre la barre latérale"
            >
              <Menu className="w-[18px] h-[18px]" />
            </button>
            <div className="flex items-center gap-2 text-[15px] font-medium text-foreground/70">
              <span>Back Office</span>
              <span className="text-foreground/30">/</span>
              <span className="text-foreground">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchConfigs}
              className="w-9 h-9 bg-[#18181b] border border-[#27272a] rounded-[10px] flex items-center justify-center text-foreground/50 hover:bg-primary hover:border-primary hover:text-white hover:shadow-[0_4px_14px_rgba(0,60,243,0.4)] transition-all duration-250"
              title="Rafraîchir"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => setShowNewKey(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-[10px] text-[13px] font-semibold shadow-[0_4px_14px_rgba(0,60,243,0.4)] hover:translate-y-[-1px] hover:shadow-[0_4px_20px_rgba(0,60,243,0.5)] transition-all duration-250"
            >
              <Plus className="w-4 h-4" />
              Générer une clé
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-[#18181b] border border-[#27272a] text-foreground/60 hover:text-foreground px-4 py-2 rounded-[10px] text-[13px] font-medium transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">

        {/* Stats globales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-xl p-5 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-full bg-primary shadow-[0_4px_16px_rgba(0,60,243,0.4)]">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[12px] text-foreground/40 uppercase tracking-wider mb-0.5">Utilisateurs actifs</p>
                <p className="text-[32px] font-bold text-success leading-none">{activeCount}</p>
                <p className="text-[11px] text-foreground/30 mt-1">{configs.length} total</p>
              </div>
            </div>
          </div>

          <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-xl p-5 hover:border-primary/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-full bg-primary shadow-[0_4px_16px_rgba(0,60,243,0.4)]">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[12px] text-foreground/40 uppercase tracking-wider mb-0.5">Dernière sync globale</p>
                <p className="text-[15px] font-semibold text-foreground">{formatDate(lastSync)}</p>
                <p className="text-[11px] text-foreground/30 mt-1">Toutes extensions confondues</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tableau */}
        <div className="bg-[#0E0E0E] border border-[#1A1A1A] rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#1A1A1A]">
            <div className="flex items-center gap-3">
              <div className="p-1.5 rounded-full bg-primary shadow-[0_4px_12px_rgba(0,60,243,0.4)]">
                <Key className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-[14px] font-semibold text-foreground">Clés API des extensions</h2>
            </div>
            <span className="text-[12px] text-foreground/30">{configs.length} entrée{configs.length > 1 ? 's' : ''}</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-6 h-6 text-primary animate-spin" />
            </div>
          ) : configs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-foreground/30">
              <Key className="w-8 h-8 mb-3" />
              <p className="text-[14px]">Aucune clé générée</p>
              <p className="text-[12px] mt-1">Cliquez sur "Générer une clé" pour commencer</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1A1A1A]">
                    {['Compte Vinted', 'Clé API', 'Sync Ventes', 'Sync Achats', 'Statut', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[11px] font-medium text-foreground/30 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {configs.map((config, i) => {
                    const isVisible = visibleKeys.has(config.id)
                    const isCopied = copiedId === config.id
                    const isRevoking = revokingId === config.id

                    return (
                      <tr
                        key={config.id}
                        className={`border-b border-[#1A1A1A] last:border-0 transition-colors ${!config.isActive ? 'opacity-50' : 'hover:bg-white/[0.02]'}`}
                      >
                        {/* Compte Vinted */}
                        <td className="px-5 py-4">
                          <span className="text-[14px] font-medium text-foreground">{config.vintedAccount}</span>
                        </td>

                        {/* Clé API */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[12px] text-foreground/60">
                              {isVisible ? config.apiKey : maskKey(config.apiKey)}
                            </span>
                            <button
                              onClick={() => toggleKeyVisibility(config.id)}
                              className="text-foreground/30 hover:text-foreground/70 transition-colors flex-shrink-0"
                              title={isVisible ? 'Masquer' : 'Révéler'}
                            >
                              {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => copyKey(config.id, config.apiKey)}
                              className="text-foreground/30 hover:text-foreground/70 transition-colors flex-shrink-0"
                              title="Copier"
                            >
                              {isCopied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </td>

                        {/* Sync Ventes */}
                        <td className="px-5 py-4">
                          <span className="text-[13px] text-foreground/50">{formatDate(config.lastSyncVentes)}</span>
                        </td>

                        {/* Sync Achats */}
                        <td className="px-5 py-4">
                          <span className="text-[13px] text-foreground/50">{formatDate(config.lastSyncAchats)}</span>
                        </td>

                        {/* Statut */}
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[12px] font-medium border ${
                            config.isActive
                              ? 'bg-success/10 text-success border-success/20'
                              : 'bg-foreground/5 text-foreground/40 border-foreground/10'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${config.isActive ? 'bg-success' : 'bg-foreground/30'}`} />
                            {config.isActive ? 'Actif' : 'Révoqué'}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          {config.isActive && (
                            <button
                              onClick={() => handleRevoke(config.id)}
                              disabled={isRevoking}
                              className="flex items-center gap-1.5 text-[12px] text-foreground/40 hover:text-red-400 transition-colors disabled:opacity-40"
                              title="Révoquer cette clé"
                            >
                              {isRevoking
                                ? <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                : <Trash2 className="w-3.5 h-3.5" />
                              }
                              Révoquer
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showNewKey && (
        <NewKeyModal
          onClose={() => setShowNewKey(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Vérifie si une session est déjà active
    fetch('/api/admin/configs')
      .then(res => setAuthenticated(res.ok))
      .catch(() => setAuthenticated(false))
  }, [])

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-[#1a1f23] flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
      </div>
    )
  }

  if (!authenticated) {
    return <LoginScreen onLogin={() => setAuthenticated(true)} />
  }

  return <AdminDashboard onLogout={() => setAuthenticated(false)} />
}

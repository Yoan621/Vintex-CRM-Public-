'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, useScroll, useTransform, type Variants } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  Package,
  TrendingUp,
  RefreshCw,
  Zap,
  Shield,
  Check,
  X,
  Phone,
  Star,
  ChevronDown,
  TrendingDown,
  Clock,
  AlertCircle,
} from 'lucide-react'

// ─── Variants ────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// ─── Section avec fade-in au scroll ──────────────────────────────────────────

function Section({
  children,
  className = '',
  id,
  style,
}: {
  children: React.ReactNode
  className?: string
  id?: string
  style?: React.CSSProperties
}) {
  return (
    <motion.section
      id={id}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  { icon: BarChart3, title: 'Comptabilité automatique', desc: 'CA, marges, ROI en temps réel. Exports en un clic, zéro Excel.' },
  { icon: Package, title: "Bordereaux d'envoi", desc: 'Colissimo, Mondial Relay, Chronopost. Générez et imprimez sans quitter le CRM.' },
  { icon: TrendingUp, title: 'Stats avancées', desc: 'Articles les plus rentables, délai moyen, évolution mensuelle. Tout en un graphe.' },
  { icon: RefreshCw, title: 'Synchro Vinted auto', desc: "Extension Chrome qui importe vos ventes dès qu'elles tombent. Aucune saisie manuelle." },
  { icon: Zap, title: 'Gestion des Boosts', desc: 'Planifiez, analysez le ROI de vos boosts. Stoppez ceux qui ne convertissent pas.' },
  { icon: Shield, title: 'Données sécurisées', desc: 'Hébergement FR, chiffrement TLS. Vos données vous appartiennent, toujours.' },
]

const reviews = [
  { name: 'Marie L.', role: 'Revendeuse Pro — 200+ ventes/mois', text: "En 3 mois j'ai triplé mon CA. L'automatisation des bordereaux seule vaut l'abonnement.", stars: 5 },
  { name: 'Thomas R.', role: 'Full-time Reseller', text: 'Interface ultra-intuitive, synchro Vinted parfaite. Je gère 300 ventes/mois sans effort.', stars: 5 },
  { name: 'Sophie M.', role: 'Side-hustle → Full-time', text: "Enfin un outil pensé pour Vinted ! Les stats m'ont aidé à doubler ma marge en 6 semaines.", stars: 5 },
]

const plans = [
  {
    name: 'Starter',
    price: '9',
    desc: 'Pour démarrer proprement',
    features: ["Jusqu'à 50 ventes/mois", 'Statistiques de base', 'Synchro Vinted', 'Support email'],
    popular: false,
    cta: 'Commencer',
  },
  {
    name: 'Pro',
    price: '19',
    desc: 'Pour les vendeurs actifs',
    features: ['Ventes illimitées', 'Stats avancées & exports', 'Gestion des boosts', 'Bordereaux automatiques', 'Support prioritaire', '3 comptes Vinted'],
    popular: true,
    cta: 'Essayer 14j gratuit',
  },
  {
    name: 'Business',
    price: '39',
    desc: 'Pour les équipes & pros',
    features: ['Tout Pro inclus', 'Comptes illimités', 'API & intégrations', 'Onboarding dédié', 'SLA garanti', 'Facturation automatique'],
    popular: false,
    cta: 'Contacter les ventes',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const dashboardRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: heroScroll } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const { scrollYProgress: dashScroll } = useScroll({ target: dashboardRef, offset: ['start end', 'end start'] })

  const heroOpacity = useTransform(heroScroll, [0, 0.85], [1, 0])
  const heroScale = useTransform(heroScroll, [0, 0.85], [1, 0.97])
  const dashY = useTransform(dashScroll, [0, 1], ['4%', '-4%'])

  return (
    <div
      className="text-white overflow-x-hidden"
      style={{ background: '#0d1829', fontFamily: 'var(--font-manrope), var(--font-inter-tight), sans-serif' }}
    >

      {/* ═══════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════ */}
      <motion.div
        ref={heroRef}
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="relative min-h-screen flex flex-col"
      >
        {/* Video background */}
        <div className="absolute inset-0 overflow-hidden">
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#0d1829]/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1829]/30 via-transparent to-[#0d1829]" />
          {/* Ambient glow top-left */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-[#003CF3]/12 rounded-full blur-[100px] -translate-y-1/3" />
        </div>

        {/* ── Navbar ── */}
        <nav className="relative z-20 flex items-center justify-between px-6 md:px-14 py-5">
          {/* Logo image */}
          <div className="flex items-center">
            <Image
              src="/logolp.png"
              alt="VintexCRM"
              width={220}
              height={56}
              className="h-14 w-auto object-contain"
              priority
            />
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Fonctionnalités', 'Témoignages', 'Tarifs'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-white/55 hover:text-white transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="hidden md:inline-flex items-center px-4 py-2 rounded-lg border border-white/15 text-sm text-white/70 hover:text-white hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
              style={{ fontFamily: 'var(--font-cabin)' }}
            >
              Connexion
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#003CF3] text-white text-sm font-semibold hover:bg-[#0030CC] hover:shadow-[0_0_22px_rgba(0,60,243,0.55)] transition-all duration-200"
              style={{ fontFamily: 'var(--font-cabin)' }}
            >
              Essayer gratuitement
            </Link>
          </div>
        </nav>

        {/* ── Hero content ── */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 pt-6 pb-20">

          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#003CF3]/40 bg-[#003CF3]/10 backdrop-blur-sm text-sm text-[#89ABFF] mb-7"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#003CF3] animate-pulse" />
            Le CRM n°1 pour les vendeurs Vinted 🚀
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.18, ease: 'easeOut' }}
            className="text-5xl md:text-[68px] lg:text-[80px] font-normal text-white max-w-4xl leading-[1.06] mb-5"
            style={{ fontFamily: 'var(--font-instrument)' }}
          >
            Arrêtez de perdre du temps.{' '}
            <span className="italic" style={{ color: '#5B8EFF' }}>
              Commencez à scaler.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg md:text-xl text-white/50 max-w-xl mb-10 leading-relaxed"
          >
            Automatisez votre gestion, générez vos bordereaux et multipliez
            votre chiffre d'affaires sur Vinted.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center gap-4 mb-20"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#003CF3] text-white font-semibold text-base hover:bg-[#0030CC] hover:shadow-[0_0_32px_rgba(0,60,243,0.55)] hover:-translate-y-0.5 transition-all duration-200"
              style={{ fontFamily: 'var(--font-cabin)' }}
            >
              Démarrer l'essai gratuit
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 bg-white/5 backdrop-blur-sm text-white font-medium text-base hover:bg-white/10 hover:border-white/30 transition-all duration-200"
              style={{ fontFamily: 'var(--font-cabin)' }}
            >
              <Phone className="w-4 h-4 text-white/50" />
              Voir la démo
            </button>
          </motion.div>

          {/* ── Dashboard 3D preview ── */}
          <motion.div
            ref={dashboardRef}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease: 'easeOut' }}
            className="relative w-full max-w-5xl mx-auto"
            style={{ perspective: '1200px' }}
          >
            <motion.div
              style={{ y: dashY }}
              className="relative"
              animate={{ rotateX: [2, 0, 2] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* Ambient glow behind dashboard */}
              <div className="absolute -inset-6 bg-[#003CF3]/18 rounded-3xl blur-3xl" />
              <div className="absolute -inset-1 bg-gradient-to-b from-[#003CF3]/25 to-transparent rounded-3xl blur-xl" />

              {/* Frame */}
              <div
                className="relative rounded-2xl overflow-hidden bg-[#0a1221]"
                style={{
                  border: '1px solid rgba(0,60,243,0.45)',
                  boxShadow: '0 0 80px rgba(0,60,243,0.25), 0 40px 80px rgba(0,0,0,0.6)',
                  transform: 'rotateX(4deg)',
                }}
              >
                {/* Browser chrome bar */}
                <div className="flex items-center gap-2 px-4 py-2.5 bg-[#0a0f1a] border-b border-white/5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
                  <div className="flex-1 mx-4 h-5 rounded-md bg-white/5 flex items-center px-3">
                    <span className="text-white/30 text-xs">app.vintexcrm.com/dashboard</span>
                  </div>
                </div>
                <Image
                  src="/dashboard-preview.png"
                  alt="VintexCRM Dashboard"
                  width={1280}
                  height={720}
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#0d1829] to-transparent" />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/25"
        >
          <span className="text-[10px] tracking-widest uppercase font-medium">Découvrir</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════════════
          SOCIAL PROOF STRIP
      ═══════════════════════════════════════════════════════════════ */}
      <div className="border-y border-white/5 bg-[#16233D]/60 py-5 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-12 gap-y-3">
          {[
            ['1 200+', 'vendeurs actifs'],
            ['4.9 / 5', 'note moyenne'],
            ['2.4M€', 'de ventes gérées'],
            ['98%', 'de satisfaction'],
          ].map(([val, label]) => (
            <div key={label} className="flex items-center gap-2 text-sm">
              <span className="font-bold text-white text-base" style={{ fontFamily: 'var(--font-manrope)' }}>{val}</span>
              <span className="text-white/40">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          COMPARAISON
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="fonctionnalités" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-[#5B8EFF] text-sm font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-cabin)' }}>
              Pourquoi choisir VINTEXCRM ?
            </p>
            <h2 className="text-4xl md:text-5xl font-normal" style={{ fontFamily: 'var(--font-instrument)' }}>
              Avant vs. Après
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Avant — Gestion manuelle */}
            <motion.div
              variants={fadeUp}
              whileHover={{ scale: 0.98, rotate: -0.5 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="rounded-2xl border border-red-900/25 bg-red-950/8 p-8 cursor-default group"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-red-900/25 flex items-center justify-center">
                  <X className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <p className="text-xs text-red-400/60 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'var(--font-cabin)' }}>Avant</p>
                  <h3 className="text-base font-semibold text-white/75">Gestion Manuelle</h3>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                {[
                  ['Perte de temps', "2-3h/jour sur Excel et les messageries", Clock],
                  ['Erreurs compta', 'TVA mal calculée, marges faussées', AlertCircle],
                  ['Stress constant', 'Bordereaux oubliés, litiges non suivis', TrendingDown],
                  ['Croissance bloquée', "Impossible de scaler sans s'épuiser", X],
                ].map(([title, detail, Icon]) => (
                  <li key={title as string} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-red-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-red-400/70" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/60">{title as string}</p>
                      <p className="text-xs text-white/30 mt-0.5">{detail as string}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 rounded-xl border border-red-900/30 text-red-400/60 text-sm font-medium cursor-default transition-colors duration-300 group-hover:border-red-500/40 group-hover:text-red-400/80" style={{ fontFamily: 'var(--font-cabin)' }}>
                Je perds du temps et de l'argent
              </button>
            </motion.div>

            {/* Après — VINTEXCRM */}
            <motion.div
              variants={fadeUp}
              whileHover={{ scale: 1.03, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="rounded-2xl p-8 relative overflow-hidden cursor-pointer group"
              style={{
                border: '1px solid rgba(0,60,243,0.45)',
                background: 'rgba(0,60,243,0.07)',
                boxShadow: '0 0 48px rgba(0,60,243,0.12)',
              }}
            >
              <div className="absolute top-0 right-0 w-56 h-56 bg-[#003CF3]/12 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100" />

              <div className="flex items-center gap-3 mb-6 relative">
                <div className="w-9 h-9 rounded-xl bg-[#003CF3]/25 flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#5B8EFF]" />
                </div>
                <div>
                  <p className="text-xs text-[#5B8EFF]/70 uppercase tracking-wider mb-0.5" style={{ fontFamily: 'var(--font-cabin)' }}>Après</p>
                  <h3 className="text-base font-semibold text-white">Avec VINTEXCRM</h3>
                </div>
                <span className="ml-auto text-xs px-2.5 py-1 rounded-full bg-[#003CF3]/20 text-[#5B8EFF] border border-[#003CF3]/30 font-medium">
                  Recommandé ⚡
                </span>
              </div>
              <ul className="space-y-4 mb-8 relative">
                {[
                  ['Gestion en 15 min/jour', 'Tout est automatisé, 0 saisie manuelle', TrendingUp],
                  ['Compta impeccable', 'CA, marge, ROI calculés en temps réel', BarChart3],
                  ['Zéro stress', 'Bordereaux auto, litiges trackés, alertes', Check],
                  ['Croissance illimitée 📈', 'Scalez sans embaucher ni vous épuiser', Zap],
                ].map(([title, detail, Icon]) => (
                  <li key={title as string} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-[#003CF3]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-3.5 h-3.5 text-[#5B8EFF]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/85">{title as string}</p>
                      <p className="text-xs text-white/40 mt-0.5">{detail as string}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <Link
                href="/dashboard"
                className="relative flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#003CF3] text-white text-sm font-semibold hover:bg-[#0030CC] hover:shadow-[0_0_24px_rgba(0,60,243,0.5)] transition-all duration-200"
                style={{ fontFamily: 'var(--font-cabin)' }}
              >
                J'optimise mon temps maintenant
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          FONCTIONNALITÉS
      ═══════════════════════════════════════════════════════════════ */}
      <Section className="py-28 px-6" style={{ background: '#0f1e35' } as React.CSSProperties}>
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-[#5B8EFF] text-sm font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-cabin)' }}>
              Fonctionnalités
            </p>
            <h2 className="text-4xl md:text-5xl font-normal" style={{ fontFamily: 'var(--font-instrument)' }}>
              Tout ce dont vous avez besoin
            </h2>
            <p className="mt-4 text-white/45 max-w-lg mx-auto text-base">
              Un outil complet pensé par des revendeurs, pour des revendeurs.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="group rounded-2xl border border-white/5 p-7 hover:border-[#003CF3]/35 transition-all duration-300"
                style={{ background: '#16233D' }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-[#003CF3]/25"
                  style={{ background: 'rgba(0,60,243,0.12)', border: '1px solid rgba(0,60,243,0.2)' }}>
                  <Icon className="w-5 h-5 text-[#003CF3]" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-white/45 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          TÉMOIGNAGES
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="témoignages" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-[#5B8EFF] text-sm font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-cabin)' }}>
              Témoignages
            </p>
            <h2 className="text-4xl md:text-5xl font-normal" style={{ fontFamily: 'var(--font-instrument)' }}>
              Ils ont scalé avec nous
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {reviews.map(({ name, role, text, stars }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className="rounded-2xl border border-white/5 p-7 hover:border-[#003CF3]/20 transition-all duration-300"
                style={{ background: '#16233D' }}
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#003CF3] text-[#003CF3]" />
                  ))}
                </div>
                <p className="text-sm text-white/65 leading-relaxed mb-5">"{text}"</p>
                <div>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs text-white/35 mt-0.5">{role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════════════════════════ */}
      <Section id="tarifs" className="py-28 px-6" style={{ background: '#0f1e35' } as React.CSSProperties}>
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-[#5B8EFF] text-sm font-semibold uppercase tracking-widest mb-3" style={{ fontFamily: 'var(--font-cabin)' }}>
              Tarifs
            </p>
            <h2 className="text-4xl md:text-5xl font-normal" style={{ fontFamily: 'var(--font-instrument)' }}>
              Simple et transparent
            </h2>
            <p className="mt-4 text-white/40">Sans engagement. Résiliable en 1 clic.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 items-center">
            {plans.map(({ name, price, desc, features: planFeatures, popular, cta }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className={`relative rounded-2xl p-8 transition-all duration-300 ${popular ? 'scale-105 z-10' : ''}`}
                style={
                  popular
                    ? { background: 'rgba(0,60,243,0.08)', border: '2px solid transparent' }
                    : { background: '#16233D', border: '1px solid rgba(255,255,255,0.07)' }
                }
              >
                {/* Animated glowing border for Pro */}
                {popular && (
                  <>
                    <div className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: 'linear-gradient(#16233D, #16233D) padding-box, linear-gradient(135deg, #003CF3, #5B8EFF, #003CF3) border-box',
                        border: '2px solid transparent',
                        boxShadow: '0 0 48px rgba(0,60,243,0.22)',
                      }}
                    />
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span
                        className="inline-block px-4 py-1.5 rounded-full text-white text-xs font-bold uppercase tracking-wider"
                        style={{ background: '#003CF3', boxShadow: '0 0 16px rgba(0,60,243,0.6)', fontFamily: 'var(--font-cabin)' }}
                      >
                        ⚡ Populaire
                      </span>
                    </div>
                  </>
                )}

                <div className="relative mb-6">
                  <h3 className="text-lg font-semibold text-white mb-1">{name}</h3>
                  <p className="text-sm text-white/40">{desc}</p>
                </div>

                <div className="relative flex items-baseline gap-1 mb-7">
                  <span className="text-5xl font-bold text-white" style={{ fontFamily: 'var(--font-manrope)' }}>{price}€</span>
                  <span className="text-white/35 text-sm">/mois</span>
                </div>

                <ul className="relative space-y-3 mb-8">
                  {planFeatures.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/65">
                      <Check className="w-4 h-4 text-[#003CF3] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard"
                  className={`relative flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    popular
                      ? 'bg-[#003CF3] text-white hover:bg-[#0030CC] hover:shadow-[0_0_24px_rgba(0,60,243,0.5)]'
                      : 'border border-white/12 text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                  style={{ fontFamily: 'var(--font-cabin)' }}
                >
                  {cta}
                  {popular && <ArrowRight className="w-4 h-4" />}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA FINAL
      ═══════════════════════════════════════════════════════════════ */}
      <Section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            variants={fadeUp}
            className="relative rounded-3xl p-14 overflow-hidden"
            style={{
              border: '1px solid rgba(0,60,243,0.3)',
              background: 'rgba(0,60,243,0.05)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#003CF3]/10 via-transparent to-transparent pointer-events-none" />
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-[#003CF3]/10 rounded-full blur-3xl pointer-events-none" />

            <p className="relative text-[#5B8EFF] text-sm font-semibold uppercase tracking-widest mb-4" style={{ fontFamily: 'var(--font-cabin)' }}>
              Prêt à scaler ?
            </p>
            <h2
              className="relative text-4xl md:text-5xl font-normal text-white mb-5"
              style={{ fontFamily: 'var(--font-instrument)' }}
            >
              Commencez gratuitement aujourd'hui
            </h2>
            <p className="relative text-white/45 mb-8 max-w-md mx-auto">
              14 jours d'essai gratuit. Aucune carte bancaire requise. Setup en 2 minutes.
            </p>
            <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#003CF3] text-white font-semibold hover:bg-[#0030CC] hover:shadow-[0_0_32px_rgba(0,60,243,0.55)] hover:-translate-y-0.5 transition-all duration-200"
                style={{ fontFamily: 'var(--font-cabin)' }}
              >
                Créer mon compte gratuit
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-sm text-white/30">Aucun engagement · Résiliation en 1 clic</p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ─── Footer ─── */}
      <footer className="border-t py-10 px-6 text-center text-sm" style={{ borderColor: 'rgba(255,255,255,0.05)', background: '#0a1221' }}>
        <div className="flex items-center justify-center mb-4">
          <Image src="/logolp.png" alt="VintexCRM" width={120} height={30} className="h-8 w-auto object-contain opacity-60" />
        </div>
        <p className="text-white/25">© 2026 Vintex CRM. Tous droits réservés.</p>
      </footer>

    </div>
  )
}

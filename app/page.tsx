import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Bell,
  Check,
  ChevronDown,
  LayoutDashboard,
  Zap,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      {/* ───── HEADER ───── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(26,31,35,0.7)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(233,233,233,0.08)' }}>
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="VintexCRM" width={32} height={32} className="rounded-md" />
          <span className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>VintexCRM</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(233,233,233,0.6)' }}>Fonctionnalités</Link>
          <Link href="#pricing" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(233,233,233,0.6)' }}>Tarifs</Link>
          <Link href="#faq" className="text-sm transition-colors hover:text-white" style={{ color: 'rgba(233,233,233,0.6)' }}>FAQ</Link>
          <Link href="/dashboard" className="text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors"
            style={{ background: 'var(--primary)', color: '#fff' }}>
            Se connecter
          </Link>
        </nav>
      </header>

      {/* ───── HERO ───── */}
      <section className="min-h-screen flex items-center pt-20 px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left – text */}
            <div className="flex-1 text-center lg:text-left">
              {/* Badge */}
              <span className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full mb-6"
                style={{ background: 'rgba(0,60,243,0.12)', color: '#3FA8FF', border: '1px solid rgba(0,60,243,0.25)' }}>
                <Zap className="w-3.5 h-3.5" />
                Nouveau : Automatisation des tâches repensée
              </span>

              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight text-gradient-primary mb-6">
                Gagnez des heures chaque semaine grâce à VintexCRM.
              </h1>

              <p className="text-lg max-w-xl mx-auto lg:mx-0 mb-8" style={{ color: 'rgba(233,233,233,0.6)' }}>
                Un CRM tout-en-un qui automatise vos tâches répétitives et vous donne une vue claire sur votre chiffre d'affaires, vos bénéfices et votre ROI — en un seul endroit.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-soft-lg"
                  style={{ background: 'var(--primary)' }}>
                  Essayer VintexCRM gratuitement
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="#features" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
                  style={{ background: 'rgba(233,233,233,0.08)', color: 'var(--foreground)', border: '1px solid rgba(233,233,233,0.15)' }}>
                  Voir la démo
                </Link>
              </div>

              <p className="mt-6 text-xs" style={{ color: 'rgba(233,233,233,0.35)' }}>
                Aucune carte bancaire requise – Gratuit pendant 30 jours
              </p>
            </div>

            {/* Right – fake dashboard */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none">
              <div className="rounded-2xl p-5 shadow-soft-lg" style={{ background: 'var(--dark)', border: '1px solid rgba(233,233,233,0.08)' }}>
                {/* Mini header bar */}
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="ml-3 text-xs font-medium" style={{ color: 'rgba(233,233,233,0.4)' }}>Dashboard – VintexCRM</span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,60,243,0.1)', border: '1px solid rgba(0,60,243,0.2)' }}>
                    <p className="text-xs" style={{ color: 'rgba(233,233,233,0.5)' }}>CA mensuel</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>12 450 €</p>
                    <p className="text-xs text-green-400">↑ 23.5%</p>
                  </div>
                  <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(139,61,255,0.1)', border: '1px solid rgba(139,61,255,0.2)' }}>
                    <p className="text-xs" style={{ color: 'rgba(233,233,233,0.5)' }}>Bénéfices</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>3 820 €</p>
                    <p className="text-xs text-green-400">↑ 18.2%</p>
                  </div>
                  <div className="rounded-xl p-3 text-center" style={{ background: 'rgba(0,217,142,0.1)', border: '1px solid rgba(0,217,142,0.2)' }}>
                    <p className="text-xs" style={{ color: 'rgba(233,233,233,0.5)' }}>ROI</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>312%</p>
                    <p className="text-xs text-green-400">↑ 4.1%</p>
                  </div>
                </div>

                {/* Fake chart bar */}
                <div className="rounded-xl p-4 mb-4" style={{ background: 'rgba(233,233,233,0.03)', border: '1px solid rgba(233,233,233,0.06)' }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(233,233,233,0.5)' }}>Chiffre d'affaires – 6 derniers mois</p>
                  <div className="flex items-end gap-1.5 h-16">
                    {[35, 52, 41, 68, 78, 92].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 5 ? 'var(--primary)' : 'rgba(0,60,243,0.3)' }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-1.5">
                    {['J', 'F', 'M', 'A', 'M', 'J'].map((m, i) => (
                      <span key={i} className="flex-1 text-center text-xs" style={{ color: 'rgba(233,233,233,0.3)' }}>{m}</span>
                    ))}
                  </div>
                </div>

                {/* Recent orders */}
                <div className="rounded-xl p-4" style={{ background: 'rgba(233,233,233,0.03)', border: '1px solid rgba(233,233,233,0.06)' }}>
                  <p className="text-xs font-semibold mb-3" style={{ color: 'rgba(233,233,233,0.5)' }}>Dernières commandes</p>
                  {[
                    { item: 'Veste vintage denim', price: '68 €', status: 'Expédié' },
                    { item: 'Sneakers Nike retro', price: '120 €', status: 'En cours' },
                    { item: 'Sac à main cuir', price: '45 €', status: 'Payé' },
                  ].map((order, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <span className="text-xs" style={{ color: 'var(--foreground)' }}>{order.item}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold" style={{ color: 'var(--foreground)' }}>{order.price}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{
                          background: order.status === 'Expédié' ? 'rgba(0,217,142,0.15)' : order.status === 'En cours' ? 'rgba(0,102,255,0.15)' : 'rgba(233,233,233,0.1)',
                          color: order.status === 'Expédié' ? '#00D98E' : order.status === 'En cours' ? '#3FA8FF' : 'rgba(233,233,233,0.6)',
                        }}>{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FEATURES / BÉNÉFICES ───── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--primary)' }}>Fonctionnalités</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
              Tout ce qu'il vous faut pour réussir
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: <BarChart3 className="w-5 h-5" />, title: 'Suivi automatique du CA', desc: "Visualisez votre chiffre d\u2019affaires en temps réel avec des graphiques clairs et des comparaisons mensuelles." },
              { icon: <TrendingUp className="w-5 h-5" />, title: 'Vue claire sur vos bénéfices', desc: 'Calculez automatiquement vos marges, bénéfices et ROI pour chaque vente et optimiser votre stratégie.' },
              { icon: <ShoppingCart className="w-5 h-5" />, title: 'Gestion des commandes & stock', desc: 'Centralisez toutes vos commandes, suivez votre inventaire et évitez les ruptures de stock.' },
              { icon: <Bell className="w-5 h-5" />, title: 'Rappels & tâches automatisées', desc: 'Ne plus oublier une tâche. Configurez des rappels automatiques et gagnez du temps au quotidien.' },
            ].map((feat, i) => (
              <div key={i} className="rounded-2xl p-6 transition-all hover:translate-y-[-2px]"
                style={{ background: 'var(--dark)', border: '1px solid rgba(233,233,233,0.08)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'rgba(0,60,243,0.12)', color: '#3FA8FF' }}>
                  {feat.icon}
                </div>
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--foreground)' }}>{feat.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(233,233,233,0.5)' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── COMMENT ÇA MARCHE ───── */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--primary)' }}>Processus</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
              Comment ça marche ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(0,60,243,0.4), transparent)' }} />

            {[
              { step: '01', title: 'Connectez vos comptes', desc: 'Liez vos comptes Vinted et autres marketplaces en quelques clics. VintexCRM récupère toutes vos données automatiquement.' },
              { step: '02', title: 'Centralisez vos données', desc: 'Toutes vos ventes, achats et stocks sont regroupés dans un tableau de bord unifié et facile à lire.' },
              { step: '03', title: 'Automatisez vos tâches', desc: 'Laissez VintexCRM gérer les rappels, les calculs et les suivis — vous vous concentrez sur ce qui compte.' },
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center text-center relative z-10">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-extrabold mb-5 shadow-soft-md"
                  style={{ background: 'var(--dark)', border: '1px solid rgba(0,60,243,0.3)', color: '#3FA8FF' }}>
                  {s.step}
                </div>
                <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--foreground)' }}>{s.title}</h3>
                <p className="text-xs leading-relaxed max-w-xs" style={{ color: 'rgba(233,233,233,0.5)' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── PREUVE SOCIALE / CHIFFRES ───── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--primary)' }}>Résultats</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
              Des résultats concrets
            </h2>
            <p className="text-sm mt-3 max-w-xl mx-auto" style={{ color: 'rgba(233,233,233,0.5)' }}>
              Chiffres moyens observés chez nos utilisateurs après 3 mois d'utilisation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { value: '12 450 €', label: 'Gérés par mois en moyenne', gradient: 'bg-gradient-blue' },
              { value: '+23.5 %', label: 'De chiffre d\'affaires gagné', gradient: 'bg-gradient-green' },
              { value: '+18.2 %', label: 'De bénéfices supplémentaires', gradient: 'bg-gradient-violet' },
            ].map((kpi, i) => (
              <div key={i} className={`${kpi.gradient} rounded-2xl p-8 text-center shadow-soft-md`}>
                <p className="text-4xl font-extrabold text-white mb-2">{kpi.value}</p>
                <p className="text-sm text-white/70">{kpi.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FAQ ───── */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--primary)' }}>FAQ</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: 'var(--foreground)' }}>
              Questions fréquentes
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {[
              { q: 'L\'essai gratuit est-il vraiment sans engagement ?', a: 'Oui, absolument. Aucune carte bancaire requise. Vous pouvez utiliser VintexCRM pendant 30 jours sans limite, puis décider de continuer ou de partir sans aucune conséquence.' },
              { q: 'Mes données sont-elles en sécurité ?', a: 'Toutes vos données sont chiffrées en transit (TLS 1.3) et au repos (AES-256). Nous ne partageons jamais vos informations avec des tiers.' },
              { q: 'Puis-je annuler mon abonnement à tout moment ?', a: 'Oui, vous pouvez annuler en un seul clic depuis votre espace personnel. Pas de période d\'engagement, pas de frais cachés.' },
              { q: 'Quelles plateformes sont supportées ?', a: 'VintexCRM supporte actuellement Vinted. D\'autres marketplaces (Leboncoin, eBay, etc.) seront ajoutées prochainement.' },
            ].map((item, i) => (
              <details key={i} className="group rounded-xl overflow-hidden" style={{ background: 'var(--dark)', border: '1px solid rgba(233,233,233,0.08)' }}>
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none">
                  <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{item.q}</span>
                  <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 flex-shrink-0 ml-4" style={{ color: 'rgba(233,233,233,0.4)' }} />
                </summary>
                <div className="px-6 pb-4 text-xs leading-relaxed" style={{ color: 'rgba(233,233,233,0.5)' }}>{item.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ───── FOOTER ───── */}
      <footer className="py-12 px-6" style={{ borderTop: '1px solid rgba(233,233,233,0.08)' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="VintexCRM" width={24} height={24} className="rounded" />
            <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>VintexCRM</span>
          </div>

          <nav className="flex gap-6">
            {[
              { label: 'Fonctionnalités', href: '#features' },
              { label: 'Tarifs', href: '#pricing' },
              { label: 'FAQ', href: '#faq' },
              { label: 'Contact', href: 'mailto:contact@vintexcrm.com' },
            ].map((link, i) => (
              <Link key={i} href={link.href} className="text-xs transition-colors hover:text-white" style={{ color: 'rgba(233,233,233,0.45)' }}>
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-xs text-center" style={{ color: 'rgba(233,233,233,0.3)' }}>
            Aucune carte bancaire requise – Annulation en 1 clic
          </p>
        </div>
      </footer>
    </div>
  )
}

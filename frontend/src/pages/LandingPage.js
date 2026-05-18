import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MagnifyingGlassIcon, BellAlertIcon, CurrencyDollarIcon,
  LockClosedIcon, CpuChipIcon, ChartBarIcon,
  CheckIcon, EnvelopeIcon, ArrowRightIcon,
  Bars3Icon, XMarkIcon, PlayIcon,
} from '@heroicons/react/24/outline';
import { ChartPieIcon } from '@heroicons/react/24/solid';

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: 'Accueil', href: '#hero' },
    { label: 'Fonctionnalités', href: '#features' },
    { label: 'Comment ça marche', href: '#how' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Témoignages', href: '#testimonials' },
  ];

  const features = [
    { icon: MagnifyingGlassIcon, title: 'Scan Intelligent', desc: 'Identifie automatiquement tous vos abonnements en analysant vos emails en quelques secondes.' },
    { icon: CurrencyDollarIcon, title: 'Économies Réelles', desc: 'Repérez facilement les abonnements oubliés pour réduire vos dépenses inutiles.' },
    { icon: BellAlertIcon, title: 'Alertes Renouvellement', desc: 'Ne soyez plus jamais surpris par un renouvellement. Recevez des notifications avant chaque échéance.' },
  ];

  const steps = [
    { num: '1', icon: LockClosedIcon, title: 'Connexion sécurisée', desc: 'Connectez votre boîte mail en toute sécurité via OAuth. Vos identifiants ne sont jamais stockés.' },
    { num: '2', icon: CpuChipIcon, title: 'Scan automatique', desc: "Notre algorithme analyse vos emails et détecte automatiquement les factures d'abonnements." },
    { num: '3', icon: ChartBarIcon, title: 'Gestion connectée', desc: 'Visualisez vos dépenses, identifiez les doublons et suivez vos abonnements au même endroit.' },
  ];

  const plans = [
    { name: 'Starter', price: '0', period: '/mois', desc: 'Parfait pour commencer', cta: 'Commencer', outline: true, features: ['Scan 1 boîte mail', "Jusqu'à 10 abonnements", 'Rapports basiques'] },
    { name: 'Pro', price: '9,99', period: '/mois', desc: 'Pour une visibilité totale des abonnements', cta: 'Essayer Pro', outline: false, popular: true, features: ['Scan multi boîtes', 'Abonnements illimités', 'Alertes personnalisées', 'Aide à la résiliation'] },
    { name: 'Enterprise', price: '19,99', period: '/mois', desc: 'Toutes les fonctionnalités Pro', cta: 'Nous contacter', outline: true, features: ["Toutes les fonctionnalités Pro", 'Support dédié', 'Exports en masse', 'API entreprise'] },
  ];

  return (
    <div className="bg-brand-surface font-sans text-brand-on-surface antialiased">
      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-violet to-brand-indigo flex items-center justify-center">
              <ChartPieIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-brand-indigo">Sub<span className="text-brand-violet">Track</span></span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="text-sm font-semibold text-brand-on-surface-variant hover:text-brand-violet transition-colors tracking-wide uppercase">{l.label}</a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-brand-on-surface-variant hover:text-brand-violet transition-colors">Login</Link>
            <Link to="/register" className="px-5 py-2.5 rounded-full bg-brand-violet text-white text-sm font-semibold hover:bg-brand-violet-container transition-colors shadow-md">Get Started</Link>
          </div>

          <button className="lg:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-brand-outline-variant px-6 py-4 space-y-3">
            {navLinks.map(l => (
              <a key={l.label} href={l.href} className="block text-sm font-semibold text-brand-on-surface-variant">{l.label}</a>
            ))}
            <div className="flex gap-3 pt-3 border-t border-brand-outline-variant">
              <Link to="/login" className="flex-1 text-center py-2 text-sm font-semibold border border-brand-outline-variant rounded-full">Login</Link>
              <Link to="/register" className="flex-1 text-center py-2 text-sm font-semibold bg-brand-violet text-white rounded-full">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section id="hero" className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-brand-violet/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-brand-violet-container/5 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block mb-6 px-4 py-1.5 rounded-full bg-brand-violet/10 text-brand-violet text-xs font-semibold tracking-widest uppercase">✨ Nouveau</span>
          <h1 className="text-4xl sm:text-5xl lg:text-[64px] font-bold leading-[1.1] tracking-tight text-brand-indigo max-w-4xl mx-auto">
            Reprenez le contrôle sur vos <span className="text-brand-violet">abonnements</span> cachés
          </h1>
          <p className="mt-6 text-lg text-brand-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Scanner votre boîte mail en un clic pour identifier tous vos abonnements payants et reprendre la main sur vos dépenses.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" className="group px-8 py-3.5 rounded-full bg-brand-violet text-white font-semibold shadow-lg shadow-brand-violet/25 hover:shadow-xl hover:shadow-brand-violet/30 hover:bg-brand-violet-container transition-all flex items-center gap-2">
              Essayer gratuitement <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="px-8 py-3.5 rounded-full border-2 border-brand-indigo text-brand-indigo font-semibold hover:bg-brand-indigo hover:text-white transition-all flex items-center gap-2">
              <PlayIcon className="w-5 h-5" /> Voir la démo
            </button>
          </div>

          {/* Dashboard mockup */}
          <div className="mt-16 max-w-3xl mx-auto animate-fade-in-up">
            <div className="bg-white rounded-2xl shadow-brand-high border border-brand-outline-variant/30 p-6 relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-violet text-white text-xs font-semibold rounded-full shadow-md">✦ Aperçu du dashboard</div>
              <div className="flex items-center gap-4 mb-5 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-violet to-brand-indigo flex items-center justify-center"><EnvelopeIcon className="w-5 h-5 text-white" /></div>
                <div className="text-left">
                  <p className="font-bold text-brand-indigo text-sm">Dépenses Mensuelles</p>
                  <p className="text-xs text-brand-on-surface-variant">Total détecté : <span className="font-bold text-brand-violet">142,50 €</span></p>
                </div>
              </div>
              {[
                { name: 'Netflix Premium', price: '€13,99', color: 'bg-red-500' },
                { name: 'Spotify Duo', price: '€14,99', color: 'bg-emerald-500' },
                { name: 'AWS Resources', price: '€47,20', color: 'bg-amber-500' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${s.color} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>{s.name[0]}</div>
                    <span className="text-sm font-medium text-brand-on-surface">{s.name}</span>
                  </div>
                  <span className="text-sm font-bold text-brand-on-surface">{s.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-brand-violet tracking-widest uppercase mb-3">Des fonctionnalités uniques</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-indigo max-w-2xl mx-auto">Simplifiez la gestion de vos finances grâce à des outils intelligents</h2>
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-brand p-8 shadow-brand-low hover:shadow-brand-high transition-all duration-300 group text-center">
                <div className="w-14 h-14 rounded-2xl bg-brand-violet/10 text-brand-violet flex items-center justify-center mx-auto mb-5 group-hover:bg-brand-violet group-hover:text-white transition-colors">
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-brand-indigo mb-2">{f.title}</h3>
                <p className="text-sm text-brand-on-surface-variant leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-24 lg:py-32 bg-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-brand-violet tracking-widest uppercase mb-3">Comment ça marche ?</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-indigo">Un processus simple et sécurisé</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((s, i) => (
              <div key={i} className="relative">
                <div className="w-12 h-12 rounded-full bg-brand-violet text-white flex items-center justify-center text-lg font-bold mb-5">{s.num}</div>
                <h3 className="text-lg font-bold text-brand-indigo mb-2">{s.title}</h3>
                <p className="text-sm text-brand-on-surface-variant leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 text-center">
          <p className="text-sm font-semibold text-brand-violet tracking-widest uppercase mb-3">Des tarifs adaptés à vos besoins</p>
          <h2 className="text-3xl lg:text-4xl font-bold text-brand-indigo mb-16">Commencez gratuitement, passez à la vitesse supérieure quand vous êtes prêt.</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((p, i) => (
              <div key={i} className={`rounded-brand p-8 text-left transition-all duration-300 relative ${p.popular ? 'bg-brand-indigo text-white shadow-brand-high scale-105 ring-2 ring-brand-violet' : 'bg-white shadow-brand-low hover:shadow-brand-high'}`}>
                {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-brand-violet text-white text-xs font-semibold rounded-full">Populaire</span>}
                <h3 className={`text-lg font-bold mb-1 ${p.popular ? 'text-white' : 'text-brand-indigo'}`}>{p.name}</h3>
                <p className={`text-sm mb-5 ${p.popular ? 'text-slate-300' : 'text-brand-on-surface-variant'}`}>{p.desc}</p>
                <div className="flex items-end gap-1 mb-6">
                  <span className={`text-4xl font-extrabold ${p.popular ? 'text-white' : 'text-brand-indigo'}`}>{p.price}€</span>
                  <span className={`text-sm mb-1 ${p.popular ? 'text-slate-300' : 'text-brand-on-surface-variant'}`}>{p.period}</span>
                </div>
                <Link to="/register" className={`block text-center py-3 rounded-full font-semibold text-sm transition-all mb-6 ${p.popular ? 'bg-brand-violet text-white hover:bg-brand-violet-container' : 'border-2 border-brand-indigo text-brand-indigo hover:bg-brand-indigo hover:text-white'}`}>{p.cta}</Link>
                <ul className="space-y-3">
                  {p.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm">
                      <CheckIcon className={`w-5 h-5 flex-shrink-0 ${p.popular ? 'text-brand-violet-dim' : 'text-brand-violet'}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-24 lg:py-32">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="bg-gradient-to-r from-brand-violet to-brand-violet-container rounded-2xl p-12 lg:p-16 text-center text-white shadow-brand-glow">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Prêt à optimiser vos dépenses ?</h2>
            <p className="text-white/80 max-w-xl mx-auto mb-8">Rejoignez des milliers d'utilisateurs qui économisent en moyenne 240€ par an grâce à SubTrack.</p>
            <Link to="/register" className="inline-block px-8 py-3.5 rounded-full bg-white text-brand-violet font-bold hover:bg-slate-100 transition-colors shadow-lg">
              Essayer gratuitement maintenant
            </Link>
            <p className="mt-4 text-white/60 text-sm">Gratuit • 3 minutes • Sans carte bancaire</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-brand-indigo text-white py-16">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-brand-violet flex items-center justify-center"><ChartPieIcon className="w-5 h-5 text-white" /></div>
                <span className="text-lg font-bold">SubTrack</span>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">Votre assistant intelligent pour reprendre le contrôle de vos abonnements.</p>
            </div>
            {[
              { title: 'Produit', links: ['Fonctionnalités', 'Comment ça marche', 'API & Documentation'] },
              { title: 'Support', links: ['Help Center', 'FAQ', 'Contact Us'] },
              { title: 'Légal', links: ['Privacy Policy', 'Terms of Service', 'Mentions légales'] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((l, j) => (
                    <li key={j}><a href="/" className="text-sm text-slate-400 hover:text-white transition-colors">{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-slate-500">
            © 2026 SubTrack. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

import React, { useState } from 'react';
import {
  Smartphone,
  Wifi,
  Zap,
  Tv,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Lock,
  ArrowDownLeft,
  Receipt,
  FileCheck2,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ThemeToggle } from '../common/ThemeToggle';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onExploreService: (service: 'airtime' | 'data' | 'electricity' | 'cable') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onExploreService }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copied, setCopied] = useState(false);

  const faqs = [
    {
      q: 'How do I fund my Voltiva wallet?',
      a: 'Transfer to your dedicated Wema Bank virtual account from any Nigerian banking app — GTBank, Access, Zenith, Kuda, OPay, and others. Balance is credited in seconds. You can also use debit card checkout via Paystack.'
    },
    {
      q: 'How fast are airtime, data, and electricity token deliveries?',
      a: 'Telco airtime and data bundles are credited within 3–5 seconds of payment. Prepaid electricity STS tokens (20-digit) are generated immediately on screen and sent via SMS — before you close the confirmation page.'
    },
    {
      q: 'What happens if a transaction fails or my meter does not credit?',
      a: 'If the upstream Telco or Disco provider times out, our reconciliation engine attempts a secondary verification. If still unfulfilled, your wallet balance is reversed immediately. You can raise a dispute ticket and get 24/7 priority resolution.'
    },
    {
      q: 'Can I top up for someone else?',
      a: 'Yes. Enter any third-party phone number, meter number, or DStv/GOtv smartcard. Save frequent recipients to your Beneficiaries list for 1-click repeat recharges.'
    },
    {
      q: 'Are there any hidden fees?',
      a: 'None. Airtime and data are free — airtime gets you an additional 2% cashback. Electricity payments carry a regulated NERC utility charge of ₦100. Cable TV renewals have a ₦50 gateway fee. That is the complete list.'
    },
    {
      q: 'Is my payment data secure?',
      a: 'Voltiva enforces 256-bit TLS bank-grade encryption, a 4-digit Transaction PIN for all debits, and Firestore role-based security rules. No card credentials are stored on our servers.'
    }
  ];

  // Single orchestrated entrance: hero text stagger only
  const heroVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05,
      }
    }
  };
  const heroChild = {
    hidden: { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };
  const heroMockup = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] } }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText('9018472910');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[--volt-surface] text-[--volt-text] transition-colors duration-200 overflow-x-hidden w-full max-w-full">

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-[--volt-panel]/90 dark:bg-[#0d1117]/90 backdrop-blur-md border-b border-[--volt-line] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between">

          {/* Logo — the V mark is the brand's only distinct visual element; no decorative tagline pill */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[--volt-charge] flex items-center justify-center font-display font-black text-[#0d1117] text-lg leading-none select-none">
              V
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-[--volt-text]">Voltiva</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-[13px] font-semibold text-[--volt-muted]">
            <a href="#services" className="hover:text-[--volt-text] transition-colors">Services</a>
            <a href="#how-it-works" className="hover:text-[--volt-text] transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-[--volt-text] transition-colors">Fees</a>
            <a href="#faq" className="hover:text-[--volt-text] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              id="nav-login-btn"
              onClick={() => onOpenAuth('login')}
              className="px-4 py-2 rounded-md text-[13px] font-semibold text-[--volt-text] hover:bg-[--volt-line] transition-colors cursor-pointer"
            >
              Log in
            </button>
            <button
              id="nav-signup-btn"
              onClick={() => onOpenAuth('signup')}
              className="px-4 py-2.5 rounded-md bg-[--volt-charge] text-[#0d1117] text-[13px] font-bold transition-all cursor-pointer hover:opacity-90"
            >
              Create account
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-16 border-b border-[--volt-line]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: Copy — left-aligned, financial and direct */}
            <motion.div
              variants={heroVariants}
              initial="hidden"
              animate="visible"
              className="space-y-7"
            >
              <motion.h1
                variants={heroChild}
                className="font-display font-black text-[2.75rem] sm:text-[3.5rem] leading-[1.05] tracking-tight text-[--volt-text] max-w-[18ch]"
              >
                Every Nigerian utility payment. One place.
              </motion.h1>

              <motion.p
                variants={heroChild}
                className="text-[1rem] text-[--volt-subtext] leading-[1.7] max-w-[55ch]"
              >
                Fund your wallet once. Recharge airtime with instant cashback, buy high-speed data bundles, generate prepaid electricity tokens, and renew cable subscriptions — all from a single dashboard.
              </motion.p>

              <motion.div variants={heroChild} className="flex flex-col sm:flex-row gap-3">
                <button
                  id="hero-get-started-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="px-7 py-3.5 rounded-md bg-[--volt-charge] text-[#0d1117] font-bold text-[0.9375rem] transition-all cursor-pointer hover:opacity-90 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  Open free account
                </button>
                <a
                  href="#preview"
                  className="px-7 py-3.5 rounded-md bg-transparent text-[--volt-text] border border-[--volt-line] font-semibold text-[0.9375rem] flex items-center gap-2 hover:border-[--volt-charge]/40 transition-colors w-full sm:w-auto justify-center"
                >
                  See the dashboard
                </a>
              </motion.div>

              {/* Trust line — plain text, no icons, no cards */}
              <motion.p variants={heroChild} className="text-[0.8125rem] text-[--volt-muted] leading-relaxed">
                Free to sign up · 2% cashback on airtime · Wema Bank virtual account · 256-bit TLS encryption
              </motion.p>
            </motion.div>

            {/* Right: Product mockup — the real UI, not a phone frame */}
            <motion.div
              id="preview"
              variants={heroMockup}
              initial="hidden"
              animate="visible"
              className="w-full"
            >
              <div className="rounded-xl bg-[--volt-panel] dark:bg-[#111827] border border-[--volt-line] overflow-hidden shadow-2xl">
                {/* Mock browser chrome */}
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[--volt-line] bg-[--volt-surface] dark:bg-[#0d1117]">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/70"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/70"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-[--volt-charge]/70"></div>
                  <span className="ml-3 font-display text-[11px] text-[--volt-muted] hidden sm:inline">voltiva.app/dashboard</span>
                  <div className="ml-auto flex items-center gap-1.5 text-[--volt-charge]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[--volt-charge] animate-pulse"></span>
                    <span className="text-[11px] font-semibold text-[--volt-muted]">99.99% uptime</span>
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-4">
                  {/* Balance card — the number is the hero */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="md:col-span-2 bg-[#0d1117] rounded-lg p-5 flex flex-col justify-between min-h-[130px]">
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Available balance</span>
                        <div className="font-display text-[2rem] sm:text-[2.5rem] font-black text-white mt-1.5 leading-none">₦48,500.00</div>
                      </div>
                      <div className="flex items-center gap-2 pt-4 border-t border-white/10 mt-4">
                        <span className="px-3 py-1.5 rounded bg-[--volt-charge] text-[#0d1117] font-bold text-[12px]">Fund wallet</span>
                        <span className="px-3 py-1.5 rounded bg-white/10 text-slate-300 font-semibold text-[12px]">History</span>
                      </div>
                    </div>
                    <div className="bg-[--volt-surface] dark:bg-[#0d1117]/60 rounded-lg p-4 border border-[--volt-line] space-y-2">
                      <span className="text-[11px] font-semibold text-[--volt-charge] uppercase tracking-wide">Wema Bank (Voltiva)</span>
                      <div>
                        <p className="font-display text-[1.1rem] font-bold text-[--volt-text] tracking-widest">9018472910</p>
                        <p className="text-[11px] text-[--volt-muted] mt-0.5">Auto-credited in seconds</p>
                      </div>
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 text-[11px] font-semibold text-[--volt-muted] hover:text-[--volt-text] transition-colors cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-[--volt-charge]" /> : <Copy className="w-3 h-3" />}
                        {copied ? 'Copied' : 'Copy number'}
                      </button>
                    </div>
                  </div>

                  {/* Quick actions — electricity gets amber, rest get charge-green */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Airtime', sub: '2% back', icon: Smartphone, color: 'text-[--volt-charge]', bg: 'bg-[--volt-charge]/10', service: 'airtime' as const },
                      { label: 'Data', sub: 'SME rates', icon: Wifi, color: 'text-[--volt-charge]', bg: 'bg-[--volt-charge]/10', service: 'data' as const },
                      { label: 'Electricity', sub: 'Instant token', icon: Zap, color: 'text-[--volt-amber]', bg: 'bg-[--volt-amber]/10', service: 'electricity' as const },
                      { label: 'Cable TV', sub: 'DStv & GOtv', icon: Tv, color: 'text-[--volt-charge]', bg: 'bg-[--volt-charge]/10', service: 'cable' as const },
                    ].map(({ label, sub, icon: Icon, color, bg, service }) => (
                      <button
                        key={label}
                        onClick={() => onExploreService(service)}
                        className="p-3 rounded-lg bg-[--volt-surface] dark:bg-[#0d1117]/60 border border-[--volt-line] text-left hover:border-[--volt-charge]/40 transition-colors cursor-pointer"
                      >
                        <div className={`w-8 h-8 rounded-md ${bg} ${color} flex items-center justify-center mb-2`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <p className="font-bold text-[12px] text-[--volt-text] leading-none">{label}</p>
                        <p className={`text-[10px] font-semibold mt-0.5 ${color}`}>{sub}</p>
                      </button>
                    ))}
                  </div>

                  {/* Sample transactions */}
                  <div className="rounded-lg border border-[--volt-line] overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-2.5 border-b border-[--volt-line] bg-[--volt-surface] dark:bg-[#0d1117]/40">
                      <span className="font-semibold text-[12px] text-[--volt-text]">Recent transactions</span>
                      <span className="text-[11px] text-[--volt-muted]">Live</span>
                    </div>
                    <div className="divide-y divide-[--volt-line]">
                      <div className="flex items-center justify-between px-4 py-3 text-[12px]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-[--volt-charge]/10 flex items-center justify-center">
                            <Smartphone className="w-3.5 h-3.5 text-[--volt-charge]" />
                          </div>
                          <div>
                            <p className="font-semibold text-[--volt-text]">MTN Airtime · 08149823411</p>
                            <p className="text-[11px] text-[--volt-muted]">Today, 11:02 AM</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-bold text-[--volt-text]">₦2,000</p>
                          <span className="text-[10px] font-bold text-[--volt-charge]">Successful</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3 text-[12px]">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-md bg-[--volt-amber]/10 flex items-center justify-center">
                            <Zap className="w-3.5 h-3.5 text-[--volt-amber]" />
                          </div>
                          <div>
                            <p className="font-semibold text-[--volt-text]">EKEDC Prepaid Meter</p>
                            <p className="text-[11px] text-[--volt-muted]">Token: 4892-0194-8261-9034</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-display font-bold text-[--volt-text]">₦15,100</p>
                          <span className="text-[10px] font-bold text-[--volt-charge]">Successful</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Trust bar — plain text, no icon-card grid ────────────────────── */}
      <section className="border-b border-[--volt-line] bg-[--volt-panel] dark:bg-[#111827]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-[13px]">
            {[
              ['3–5 second fulfillment', 'on every top-up'],
              ['256-bit TLS', 'bank-grade encryption'],
              ['24/7 availability', 'weekends & holidays'],
              ['PDF receipts', 'downloadable instantly'],
              ['Zero ghosting', 'dispute desk with priority SLA'],
            ].map(([title, sub]) => (
              <div key={title} className="space-y-0.5">
                <p className="font-bold text-[--volt-text] text-[13px] leading-snug">{title}</p>
                <p className="text-[12px] text-[--volt-muted] leading-snug">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <section id="services" className="py-20 sm:py-24 border-b border-[--volt-line]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-[55ch]">
            <h2 className="font-display text-[2rem] sm:text-[2.25rem] font-bold leading-[1.15] text-[--volt-text]">
              Four utilities. One wallet. No switching between apps.
            </h2>
            <p className="mt-3 text-[1rem] text-[--volt-subtext] leading-[1.7]">
              Direct integrations into Nigerian Telcos, NERC Discos, and Multichoice satellite networks — no middlemen, no markup.
            </p>
          </div>

          {/* Service cards — electricity gets amber, rest get charge-green. No identical hover-lift. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: Smartphone,
                label: 'Airtime',
                body: 'Recharge MTN, Airtel, Glo, and 9mobile with 2% cashback credited to your wallet on every recharge.',
                cta: 'Recharge a number',
                accentText: 'text-[--volt-charge]',
                accentBg: 'bg-[--volt-charge]/10',
                accentBorder: 'hover:border-[--volt-charge]/40',
                service: 'airtime' as const,
                badge: '2% cashback',
              },
              {
                icon: Wifi,
                label: 'Data bundles',
                body: 'Daily, weekly, and monthly SME plans for phones, home routers, and business modems at wholesale rates.',
                cta: 'Browse plans',
                accentText: 'text-[--volt-charge]',
                accentBg: 'bg-[--volt-charge]/10',
                accentBorder: 'hover:border-[--volt-charge]/40',
                service: 'data' as const,
                badge: 'Wholesale rates',
              },
              {
                icon: Zap,
                label: 'Electricity',
                body: 'Prepaid and postpaid accounts across IKEDC, EKEDC, AEDC, IBEDC, PHED, EEDC, and KEDCO. Token on screen in seconds.',
                cta: 'Pay your meter',
                accentText: 'text-[--volt-amber]',
                accentBg: 'bg-[--volt-amber]/10',
                accentBorder: 'hover:border-[--volt-amber]/40',
                service: 'electricity' as const,
                badge: 'STS token instant',
              },
              {
                icon: Tv,
                label: 'Cable TV',
                body: 'Decoder reactivation and bouquet upgrades for DStv, GOtv, and StarTimes. Ownership verified before payment.',
                cta: 'Renew subscription',
                accentText: 'text-[--volt-charge]',
                accentBg: 'bg-[--volt-charge]/10',
                accentBorder: 'hover:border-[--volt-charge]/40',
                service: 'cable' as const,
                badge: 'DStv, GOtv, StarTimes',
              },
            ].map(({ icon: Icon, label, body, cta, accentText, accentBg, accentBorder, service, badge }) => (
              <div
                key={label}
                className={`bg-[--volt-panel] dark:bg-[#1a2234] border border-[--volt-line] rounded-lg p-6 flex flex-col justify-between ${accentBorder} transition-colors group`}
              >
                <div className="space-y-4">
                  <div className={`w-10 h-10 rounded-md ${accentBg} ${accentText} flex items-center justify-center`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display text-[1.0625rem] font-bold text-[--volt-text]">{label}</h3>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${accentBg} ${accentText}`}>{badge}</span>
                    </div>
                    <p className="text-[0.875rem] text-[--volt-subtext] leading-[1.65]">{body}</p>
                  </div>
                </div>
                <button
                  onClick={() => onExploreService(service)}
                  className={`mt-6 text-[13px] font-bold ${accentText} hover:underline underline-offset-2 text-left cursor-pointer`}
                >
                  {cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works — numbered list, NOT identical cards ─────────────── */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-[--volt-panel] dark:bg-[#111827]/50 border-b border-[--volt-line]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-[50ch] mb-12">
            <h2 className="font-display text-[2rem] sm:text-[2.25rem] font-bold leading-[1.15] text-[--volt-text]">
              Three steps from wallet to paid
            </h2>
          </div>

          {/* Steps as a numbered list — content IS sequential, numbers earn their place */}
          <div className="space-y-0 divide-y divide-[--volt-line] max-w-3xl">
            {[
              {
                n: '01',
                title: 'Fund your wallet',
                body: 'Transfer to your dedicated Wema Bank virtual account from any Nigerian mobile banking app. Balance reflects in seconds — no refresh needed.',
              },
              {
                n: '02',
                title: 'Pick a service and enter the details',
                body: 'Choose Airtime, Data, Electricity, or Cable TV. Select from your saved beneficiaries or type in a phone number, meter number, or smartcard ID.',
              },
              {
                n: '03',
                title: 'Authorize with your PIN — done',
                body: 'Enter your 4-digit Transaction PIN. Your service is fulfilled in 3 seconds and a verifiable electronic receipt is available to download immediately.',
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="flex gap-6 sm:gap-10 py-9 first:pt-0 last:pb-0">
                <span className="font-display font-black text-[2rem] sm:text-[2.75rem] leading-none text-[--volt-line] dark:text-[#1e2d3d] shrink-0 select-none w-[3rem] sm:w-[4rem] text-right">
                  {n}
                </span>
                <div className="space-y-2 pt-1">
                  <h3 className="font-display text-[1.125rem] font-bold text-[--volt-text] leading-snug">{title}</h3>
                  <p className="text-[0.9375rem] text-[--volt-subtext] leading-[1.65] max-w-[52ch]">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing — ruled table, not identical cards ─────────────────────── */}
      <section id="pricing" className="py-20 sm:py-24 border-b border-[--volt-line]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="max-w-[50ch]">
            <h2 className="font-display text-[2rem] sm:text-[2.25rem] font-bold leading-[1.15] text-[--volt-text]">
              Honest fees
            </h2>
            <p className="mt-3 text-[1rem] text-[--volt-subtext] leading-[1.7]">
              No monthly subscription. No hidden markups. Two services are entirely free.
            </p>
          </div>

          <div className="max-w-3xl border border-[--volt-line] rounded-lg overflow-hidden">
            <table className="w-full text-[0.875rem]">
              <thead>
                <tr className="bg-[--volt-surface] dark:bg-[#0d1117]/60 border-b border-[--volt-line]">
                  <th className="text-left px-5 py-3 font-semibold text-[--volt-muted] text-[12px] uppercase tracking-wide">Service</th>
                  <th className="text-left px-5 py-3 font-semibold text-[--volt-muted] text-[12px] uppercase tracking-wide">Fee</th>
                  <th className="text-left px-5 py-3 font-semibold text-[--volt-muted] text-[12px] uppercase tracking-wide hidden sm:table-cell">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[--volt-line] bg-[--volt-panel] dark:bg-[#1a2234]">
                <tr className="hover:bg-[--volt-surface] dark:hover:bg-[#111827]/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Smartphone className="w-4 h-4 text-[--volt-charge] shrink-0" />
                      <span className="font-semibold text-[--volt-text]">Airtime top-up</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-display font-bold text-[--volt-charge]">Free + 2% back</span>
                  </td>
                  <td className="px-5 py-4 text-[--volt-muted] hidden sm:table-cell">You pay ₦980 for ₦1,000 airtime</td>
                </tr>
                <tr className="hover:bg-[--volt-surface] dark:hover:bg-[#111827]/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Wifi className="w-4 h-4 text-[--volt-charge] shrink-0" />
                      <span className="font-semibold text-[--volt-text]">Data bundles</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-display font-bold text-[--volt-text]">Free</span>
                  </td>
                  <td className="px-5 py-4 text-[--volt-muted] hidden sm:table-cell">Wholesale SME rates from ₦300/GB, zero markup</td>
                </tr>
                <tr className="hover:bg-[--volt-surface] dark:hover:bg-[#111827]/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Zap className="w-4 h-4 text-[--volt-amber] shrink-0" />
                      <span className="font-semibold text-[--volt-text]">Electricity</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-display font-bold text-[--volt-text]">₦100</span>
                  </td>
                  <td className="px-5 py-4 text-[--volt-muted] hidden sm:table-cell">NERC-regulated utility gateway charge</td>
                </tr>
                <tr className="hover:bg-[--volt-surface] dark:hover:bg-[#111827]/60 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <Tv className="w-4 h-4 text-[--volt-charge] shrink-0" />
                      <span className="font-semibold text-[--volt-text]">Cable TV</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-display font-bold text-[--volt-text]">₦50</span>
                  </td>
                  <td className="px-5 py-4 text-[--volt-muted] hidden sm:table-cell">Standard DStv, GOtv, StarTimes processing fee</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <section id="faq" className="py-20 sm:py-24 border-b border-[--volt-line] bg-[--volt-panel] dark:bg-[#111827]/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <h2 className="font-display text-[2rem] font-bold text-[--volt-text] leading-[1.15]">
            Common questions
          </h2>

          <div className="divide-y divide-[--volt-line]">
            {faqs.map((f, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full py-5 text-left font-semibold text-[0.9375rem] text-[--volt-text] flex items-center justify-between gap-4 cursor-pointer hover:text-[--volt-charge] transition-colors"
                >
                  <span>{f.q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-[--volt-charge] shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-[--volt-muted] shrink-0" />
                  }
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-[0.9375rem] text-[--volt-subtext] leading-[1.7] max-w-[60ch]">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA — bold thing: the one full-bleed dark band ───────────────── */}
      <section className="bg-[#0d1117] py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="font-display font-black text-[2.25rem] sm:text-[3rem] text-white leading-[1.1] tracking-tight">
            Open your Voltiva account <span className="text-[--volt-charge]">in under 60 seconds.</span>
          </h2>
          <p className="text-[1rem] text-slate-400 max-w-[45ch] mx-auto leading-[1.7]">
            Free signup. No maintenance fees. Your first airtime recharge pays you back.
          </p>
          <button
            onClick={() => onOpenAuth('signup')}
            className="mt-2 px-8 py-4 rounded-md bg-[--volt-charge] text-[#0d1117] font-bold text-[1rem] cursor-pointer hover:opacity-90 transition-opacity inline-block"
          >
            Create your account
          </button>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="bg-[--volt-panel] dark:bg-[#0d1117] border-t border-[--volt-line] py-12 text-[0.8125rem] text-[--volt-muted]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[--volt-charge] flex items-center justify-center font-display font-black text-[#0d1117] text-sm">
                V
              </div>
              <span className="font-display text-[1.125rem] font-bold text-[--volt-text]">Voltiva</span>
            </div>
            <p className="text-[0.8125rem] text-[--volt-muted] leading-relaxed">
              Everyday Nigerian utility payments — airtime, data, electricity, cable TV — from one wallet.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[--volt-text] mb-3">Services</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onExploreService('airtime')} className="hover:text-[--volt-charge] transition-colors cursor-pointer">Buy Airtime</button></li>
              <li><button onClick={() => onExploreService('data')} className="hover:text-[--volt-charge] transition-colors cursor-pointer">Buy Data</button></li>
              <li><button onClick={() => onExploreService('electricity')} className="hover:text-[--volt-charge] transition-colors cursor-pointer">Pay Electricity</button></li>
              <li><button onClick={() => onExploreService('cable')} className="hover:text-[--volt-charge] transition-colors cursor-pointer">Cable TV</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[--volt-text] mb-3">Company</h4>
            <ul className="space-y-2">
              <li><a href="#how-it-works" className="hover:text-[--volt-charge] transition-colors">How it works</a></li>
              <li><a href="#pricing" className="hover:text-[--volt-charge] transition-colors">Fees &amp; limits</a></li>
              <li><span className="text-[--volt-line] dark:text-[#1e2d3d] cursor-not-allowed">Privacy policy</span></li>
              <li><span className="text-[--volt-line] dark:text-[#1e2d3d] cursor-not-allowed">Terms of service</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[--volt-text] mb-3">Support</h4>
            <p className="mb-1">help@voltiva.ng</p>
            <p className="mb-4">Lekki Phase 1, Lagos</p>
            <div className="flex items-center gap-1.5 text-[--volt-charge] text-[12px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TLS encrypted</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-[--volt-line] text-[11px] text-[--volt-muted]">
          © {new Date().getFullYear()} Voltiva Technologies Ltd. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

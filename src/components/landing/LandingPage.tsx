import React, { useState } from 'react';
import { 
  Smartphone, 
  Wifi, 
  Zap, 
  Tv, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Check, 
  Copy, 
  ChevronDown, 
  ChevronUp,
  Menu,
  X,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatNaira } from '../../utils/formatters';
import { ThemeToggle } from '../common/ThemeToggle';
import { useApp } from '../../context/AppContext';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onExploreService: (service: 'airtime' | 'data' | 'electricity' | 'cable') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onExploreService }) => {
  const { user, setActiveView, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [copiedToken, setCopiedToken] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  
  // Interactive Hero Demo State
  const [demoService, setDemoService] = useState<'airtime' | 'electricity' | 'data' | 'cable'>('airtime');
  const [demoAmount, setDemoAmount] = useState<number>(2000);
  const [demoNetwork, setDemoNetwork] = useState<string>('MTN');

  const demoCashback = Math.round(demoAmount * 0.02);
  const demoTotalToPay = demoAmount - demoCashback;

  const faqs = [
    {
      q: 'How do I fund my Voltiva wallet?',
      a: 'Instantly. Once registered, you receive a dedicated Wema Bank virtual account number. Any bank transfer sent from GTBank, Access, Zenith, Kuda, OPay, Moniepoint, or any banking app reflects in your Voltiva balance within 3 seconds with zero manual approval.'
    },
    {
      q: 'How fast are airtime, data, and electricity tokens delivered?',
      a: 'Every transaction is automated via direct Telco and NERC Disco API rails. Airtime and data bundles reflect on your SIM card within 3 to 5 seconds. Prepaid 20-digit STS electricity tokens appear instantly on-screen and arrive via SMS before you leave the page.'
    },
    {
      q: 'What happens if a network or Disco provider experiences downtime?',
      a: 'Our smart reconciliation engine tests provider latency in real-time. If an upstream Telco or Disco times out, your funds are reversed back to your Voltiva wallet automatically with zero ghosting, and you can generate an instant priority support ticket.'
    },
    {
      q: 'Can I pay utility bills and buy airtime for others?',
      a: 'Yes. You can recharge any family member, friend, tenant, or client. Save their phone numbers, meter IDs, or smartcards in your Beneficiaries list to complete future recurring top-ups in just one click.'
    },
    {
      q: 'Are there any hidden subscription charges or wallet fees?',
      a: 'Absolutely none. Wallet creation and holding funds are 100% free. Airtime and data top-ups have zero fees plus an instant 2% cashback. Electricity payments carry a standard statutory NERC charge of ₦100, and TV bouquet renewals have a ₦50 processing charge.'
    },
    {
      q: 'Is my personal and financial information secure?',
      a: 'Voltiva complies with strict security standards using 256-bit TLS bank-grade encryption, role-based Firestore security rules, and mandatory 4-digit Transaction PIN authorization for debits. Debit card processing is handled directly by licensed PCI-DSS processors (Paystack).'
    }
  ];

  const handleCopyAccount = () => {
    navigator.clipboard.writeText('9018472910');
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleCopyToken = () => {
    navigator.clipboard.writeText('4892-0194-8261-9034');
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 transition-colors duration-200 overflow-x-hidden w-full max-w-full selection:bg-emerald-500/20 selection:text-emerald-500">
      
      {/* ── Dynamic Atmospheric Mesh Background ─────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/4 -right-40 w-96 h-96 bg-teal-500/10 dark:bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-emerald-600/5 dark:bg-emerald-500/8 rounded-full blur-3xl" />
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-[#070a12]/80 backdrop-blur-md border-b border-slate-200/70 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center font-display font-black text-slate-950 text-lg sm:text-xl shadow-md shadow-emerald-500/25 select-none shrink-0">
              V
            </div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">Voltiva</span>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live VTU
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#services" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Services</a>
            <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#preview" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Live Demo</a>
            <a href="#pricing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Pricing & Fees</a>
            <a href="#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">FAQ</a>
          </nav>

          {/* Desktop Auth & Theme Controls */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  id="nav-dashboard-btn"
                  onClick={() => setActiveView('dashboard')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold tracking-wide transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] flex items-center gap-1.5 cursor-pointer"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Go to Dashboard</span>
                </button>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <button
                  id="nav-login-btn"
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Log In
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => onOpenAuth('signup')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-extrabold tracking-wide transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] cursor-pointer"
                >
                  Create Account
                </button>
              </>
            )}
          </div>

          {/* Mobile Right Controls: Clean & Uncompressed */}
          <div className="md:hidden flex items-center gap-1.5">
            <ThemeToggle />

            {user ? (
              <button
                onClick={() => setActiveView('dashboard')}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            ) : (
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Log In
              </button>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-0.5"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-slate-200/80 dark:border-white/5 bg-white/95 dark:bg-[#070a12]/95 backdrop-blur-xl px-4 py-4 space-y-3 overflow-hidden shadow-xl"
            >
              <nav className="flex flex-col space-y-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                <a 
                  href="#services" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Services
                </a>
                <a 
                  href="#how-it-works" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  How It Works
                </a>
                <a 
                  href="#preview" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Live Demo Calculator
                </a>
                <a 
                  href="#pricing" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Pricing & Fees
                </a>
                <a 
                  href="#faq" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-1.5 px-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  FAQ
                </a>
              </nav>

              <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex flex-col gap-2">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setActiveView('dashboard');
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Go to Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        logout();
                      }}
                      className="w-full py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out ({user.fullName})</span>
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('login');
                      }}
                      className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs text-center cursor-pointer"
                    >
                      Log In
                    </button>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenAuth('signup');
                      }}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-xs text-center cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO SECTION ────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Core Value Proposition */}
            <div className="lg:col-span-6 space-y-7 text-center lg:text-left">
              
              {/* Live Status Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-900/80 backdrop-blur-md border border-emerald-500/20 shadow-sm text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>Next-Gen Nigerian VTU · Instant 2% Cashback</span>
              </div>

              {/* Dynamic Headline */}
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08]">
                Everyday payments.<br />
                <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  Fulfilled at electric speed.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Fund your wallet once via dedicated Wema virtual bank inward. Recharge airtime with instant 2% cashback, buy high-speed SME data, generate prepaid electricity tokens, and renew cable TV in 3 seconds.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1">
                {user ? (
                  <button
                    id="hero-get-started-btn"
                    onClick={() => setActiveView('dashboard')}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] cursor-pointer"
                  >
                    <span>Go to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    id="hero-get-started-btn"
                    onClick={() => onOpenAuth('signup')}
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.02] cursor-pointer"
                  >
                    <span>Open Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <a
                  href="#preview"
                  className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-white/10 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm hover:border-emerald-500/30"
                >
                  <span>Test Live Calculator</span>
                </a>
              </div>

              {/* Trust Micro-Metrics */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Free Virtual Bank Inward</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>3-Second Dispensation</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zero Failed Reversals</span>
                </div>
              </div>
            </div>

            {/* Right Column: Rich Interactive Live Terminal Mockup */}
            <div id="preview" className="lg:col-span-6 w-full">
              <div className="relative rounded-3xl bg-white/95 dark:bg-[#0e1626]/95 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-2xl p-5 sm:p-7 glow-card">
                
                {/* Window Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 font-mono text-[11px] text-slate-400 hidden sm:inline">voltiva.app/terminal</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>99.99% Gateway Rails Live</span>
                  </div>
                </div>

                {/* Interactive Demo Content */}
                <div className="space-y-5 pt-4">
                  
                  {/* Balance & Virtual Bank Ribbon */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0d1728] to-emerald-950 p-4 text-white shadow-md relative overflow-hidden">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                      <div className="relative flex justify-between items-start">
                        <div>
                          <span className="text-[11px] font-semibold text-emerald-400/90 uppercase tracking-wider">Available Balance</span>
                          <div className="font-display text-3xl font-black text-white mt-1">₦48,500.00</div>
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                          Tier 2 KYC
                        </span>
                      </div>
                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
                        <span className="text-slate-400">Cashback Saved This Month:</span>
                        <span className="font-mono font-bold text-emerald-400">+₦3,420.00</span>
                      </div>
                    </div>

                    {/* Dedicated Virtual Account */}
                    <div className="rounded-2xl bg-slate-100 dark:bg-slate-900/90 p-4 border border-slate-200/80 dark:border-white/5 space-y-1.5 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Wema Virtual Bank</span>
                        <p className="font-mono text-base font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">9018472910</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Instant Inward Credit</p>
                      </div>
                      <button
                        onClick={handleCopyAccount}
                        className="w-full py-1 px-2 rounded-lg bg-white dark:bg-slate-800 text-[11px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-1 hover:border-emerald-500 transition-colors cursor-pointer"
                      >
                        {copiedAccount ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedAccount ? 'Copied!' : 'Copy Account'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Service Simulator Switcher */}
                  <div>
                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                      <span>Interactive Live Simulator</span>
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Try clicking amounts</span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => setDemoService('airtime')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          demoService === 'airtime'
                            ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                        <span className="text-xs block">Airtime</span>
                      </button>

                      <button
                        onClick={() => setDemoService('data')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          demoService === 'data'
                            ? 'bg-blue-500/15 border-blue-500 text-blue-700 dark:text-blue-300 font-bold shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <Wifi className="w-4 h-4 mx-auto mb-1 text-blue-500" />
                        <span className="text-xs block">Data</span>
                      </button>

                      <button
                        onClick={() => setDemoService('electricity')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          demoService === 'electricity'
                            ? 'bg-amber-500/15 border-amber-500 text-amber-700 dark:text-amber-300 font-bold shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <Zap className="w-4 h-4 mx-auto mb-1 text-amber-500" />
                        <span className="text-xs block">Power</span>
                      </button>

                      <button
                        onClick={() => setDemoService('cable')}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          demoService === 'cable'
                            ? 'bg-purple-500/15 border-purple-500 text-purple-700 dark:text-purple-300 font-bold shadow-sm'
                            : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                        }`}
                      >
                        <Tv className="w-4 h-4 mx-auto mb-1 text-purple-500" />
                        <span className="text-xs block">Cable TV</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic Simulator Details */}
                  {demoService === 'airtime' && (
                    <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200/80 dark:border-white/5 space-y-3">
                      {/* Network selection */}
                      <div className="flex items-center justify-between gap-2">
                        {['MTN', 'AIRTEL', 'GLO', '9MOBILE'].map((net) => (
                          <button
                            key={net}
                            onClick={() => setDemoNetwork(net)}
                            className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all cursor-pointer ${
                              demoNetwork === net
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-sm'
                                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {net}
                          </button>
                        ))}
                      </div>

                      {/* Quick Amounts */}
                      <div className="flex items-center gap-2">
                        {[1000, 2000, 5000, 10000].map((amt) => (
                          <button
                            key={amt}
                            onClick={() => setDemoAmount(amt)}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                              demoAmount === amt
                                ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                            }`}
                          >
                            {formatNaira(amt, false)}
                          </button>
                        ))}
                      </div>

                      {/* Cashback math display */}
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <span className="text-slate-500 dark:text-slate-400">Recharge Value: </span>
                          <span className="font-mono font-bold text-slate-900 dark:text-white">{formatNaira(demoAmount)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">You Pay Only: </span>
                          <span className="font-mono font-black text-emerald-600 dark:text-emerald-400 text-sm">{formatNaira(demoTotalToPay)}</span>
                          <span className="block text-[10px] text-emerald-500 font-bold">(Saved {formatNaira(demoCashback)} instant)</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {demoService === 'electricity' && (
                    <div className="rounded-2xl bg-amber-500/5 border border-amber-500/20 p-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-700 dark:text-amber-300">EKEDC Prepaid STS Token Generator</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">Verified</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-500/30 flex items-center justify-between">
                        <span className="font-mono text-sm font-bold tracking-widest text-slate-900 dark:text-white">
                          4892-0194-8261-9034
                        </span>
                        <button
                          onClick={handleCopyToken}
                          className="px-2 py-1 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px] font-bold flex items-center gap-1 hover:bg-amber-500/30 transition-colors"
                        >
                          {copiedToken ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedToken ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Tokens generate and dispatch via SMS within 3 seconds of PIN authorization.</p>
                    </div>
                  )}

                  {(demoService === 'data' || demoService === 'cable') && (
                    <div className="rounded-2xl bg-blue-500/5 border border-blue-500/20 p-4 space-y-2 text-xs">
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                        <span>{demoService === 'data' ? 'SME 5G High-Speed Bundle' : 'DStv Compact Plus Bouquet'}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">{demoService === 'data' ? '₦300/GB' : '₦19,800/mo'}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                        {demoService === 'data'
                          ? 'Wholesale direct SME telco tariffs delivered instantly to mobile devices and routers.'
                          : 'Smartcard owner name verified on-screen before payment with instant satellite reactivation.'}
                      </p>
                    </div>
                  )}

                  {/* Primary Exploration Action */}
                  <button
                    onClick={() => onExploreService(demoService)}
                    className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-950 text-xs font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 dark:hover:bg-emerald-400 transition-colors cursor-pointer shadow-md"
                  >
                    <span>Launch {demoService.toUpperCase()} Recharge Module</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST METRICS STRIP ─────────────────────────────────────────── */}
      <section className="py-12 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md border-y border-slate-200/80 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                3–5<span className="text-emerald-500">s</span>
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Instant Dispensation</p>
              <p className="text-[11px] text-slate-500">Airtime, data & tokens delivered live</p>
            </div>

            <div className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                2.0%
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Permanent Cashback</p>
              <p className="text-[11px] text-slate-500">On every single Telco recharge</p>
            </div>

            <div className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                99.99<span className="text-emerald-500">%</span>
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Automated Uptime</p>
              <p className="text-[11px] text-slate-500">24/7 weekend and holiday uptime</p>
            </div>

            <div className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                ₦0.00
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Zero Inward Fees</p>
              <p className="text-[11px] text-slate-500">Free dedicated virtual bank account</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES ECOSYSTEM ─────────────────────────────────────── */}
      <section id="services" className="py-20 sm:py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Complete Utility Suite
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              Four vital everyday utilities. One unified wallet.
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
              No switching between different bank apps or waiting for slow USSD codes. Connect directly with major Nigerian Telcos, electricity Discos, and Multichoice decoders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Airtime Card */}
            <div 
              onClick={() => onExploreService('airtime')}
              className="group relative rounded-3xl bg-white dark:bg-[#0f172a] p-7 border border-slate-200/80 dark:border-white/5 hover:border-emerald-500/40 shadow-lg hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Instant Top-Up</span>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-1">Airtime Recharge</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Recharge MTN, Airtel, Glo, and 9mobile in seconds with an automatic 2% cashback discount credited straight back to your wallet.
                </p>
                
                {/* Telco Pill Ribbon */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-400/20 text-yellow-700 dark:text-yellow-300">MTN</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/20 text-red-700 dark:text-red-300">Airtel</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">Glo</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-lime-500/20 text-lime-700 dark:text-lime-300">9mobile</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-500">
                <span>Buy Airtime</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Data Card */}
            <div 
              onClick={() => onExploreService('data')}
              className="group relative rounded-3xl bg-white dark:bg-[#0f172a] p-7 border border-slate-200/80 dark:border-white/5 hover:border-blue-500/40 shadow-lg hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wifi className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">High-Speed 5G</span>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-1">Broadband Data</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Affordable daily, weekly, monthly, and SME wholesale data plans for mobile phones, modems, routers, and corporate modems.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-700 dark:text-blue-300">SME Wholesale</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">From ₦300/GB</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-500">
                <span>Browse Data Plans</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Electricity Card */}
            <div 
              onClick={() => onExploreService('electricity')}
              className="group relative rounded-3xl bg-white dark:bg-[#0f172a] p-7 border border-slate-200/80 dark:border-white/5 hover:border-amber-500/40 shadow-lg hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">NERC Verified Discos</span>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-1">Electricity Bills</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Instant prepaid STS meter token generation and postpaid bill settlement across IKEDC, EKEDC, AEDC, IBEDC, PHED, EEDC, and KEDCO.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-700 dark:text-amber-300">20-Digit STS</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">All 11 Discos</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:text-amber-500">
                <span>Pay Disco Meter</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Cable TV Card */}
            <div 
              onClick={() => onExploreService('cable')}
              className="group relative rounded-3xl bg-white dark:bg-[#0f172a] p-7 border border-slate-200/80 dark:border-white/5 hover:border-purple-500/40 shadow-lg hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Tv className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">Instant Reactivation</span>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white mt-1">Cable TV Renewal</h3>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Renew or upgrade DStv, GOtv, and StarTimes packages. Smartcard owner name is verified in real-time before debiting your wallet.
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300">DStv · GOtv</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">StarTimes</span>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:text-purple-500">
                <span>Renew Decoder</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (Connected 3-Step Flow) ────────────────────────── */}
      <section id="how-it-works" className="py-20 sm:py-28 bg-white dark:bg-[#0b101c] border-y border-slate-200/80 dark:border-white/5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Frictionless Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              Three steps to settled bills
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Designed for speed, clarity, and zero ambiguity from deposit to verified receipt.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="rounded-3xl bg-slate-50 dark:bg-[#0f172a] p-8 border border-slate-200/80 dark:border-white/5 space-y-5 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 font-display font-black text-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                01
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Fund your wallet</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Deposit via your dedicated Wema Bank virtual account from any mobile banking app, or check out with debit card via Paystack. Funds reflect automatically in under 5 seconds.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Zero bank inward deduction</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl bg-slate-50 dark:bg-[#0f172a] p-8 border border-slate-200/80 dark:border-white/5 space-y-5 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-display font-black text-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
                02
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Choose utility & enter details</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Select Airtime, Data, Electricity, or Cable TV. Pick from your saved frequent beneficiaries or enter a new phone number, meter number, or smartcard IUC.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-teal-600 dark:text-teal-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Automated meter & account validation</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl bg-slate-50 dark:bg-[#0f172a] p-8 border border-slate-200/80 dark:border-white/5 space-y-5 shadow-sm relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-500 to-cyan-400 text-slate-950 font-display font-black text-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                03
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Authorize with PIN & receive receipt</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Input your secure 4-digit PIN. Your transaction dispenses in 3 seconds alongside a verifiable digital PDF receipt and instant SMS delivery.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Instant downloadable PDF receipt</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING & FEES TRANSPARENCY ─────────────────────────────────── */}
      <section id="pricing" className="py-20 sm:py-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Clear & Honest Pricing
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              Honest fees, zero hidden deductions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              We publish our complete fee schedule openly. No maintenance charges, no monthly platform fees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="rounded-3xl bg-white dark:bg-[#0f172a] p-7 border border-slate-200/80 dark:border-white/5 space-y-4 shadow-sm hover:border-emerald-500/40 transition-all">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Airtime Top-Up</span>
              <div className="font-display text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                FREE + 2% Cashback
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Pay ₦980 for ₦1,000 airtime across MTN, Airtel, Glo, and 9mobile. Cashback settles instantly.
              </p>
              <div className="pt-2 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> ₦0 Platform Surcharge
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-[#0f172a] p-7 border border-slate-200/80 dark:border-white/5 space-y-4 shadow-sm hover:border-blue-500/40 transition-all">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">5G Broadband Data</span>
              <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                Wholesale Tariffs
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Direct wholesale SME telco prices from ₦300/GB with zero markup over network carrier rates.
              </p>
              <div className="pt-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Instant Volume Activation
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-[#0f172a] p-7 border border-slate-200/80 dark:border-white/5 space-y-4 shadow-sm hover:border-amber-500/40 transition-all">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Prepaid Electricity</span>
              <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                ₦100 Utility Fee
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Statutory NERC utility gateway fee. Instant 20-digit STS meter token on-screen and via free SMS.
              </p>
              <div className="pt-2 text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> All Discos (Prepaid/Postpaid)
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-[#0f172a] p-7 border border-slate-200/80 dark:border-white/5 space-y-4 shadow-sm hover:border-purple-500/40 transition-all">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Cable TV Renewal</span>
              <div className="font-display text-2xl font-extrabold text-slate-900 dark:text-white">
                ₦50 Processing
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Standard Multichoice processing charge. Verified account holder matching before confirmation.
              </p>
              <div className="pt-2 text-[11px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> DStv, GOtv, StarTimes
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS ─────────────────────────────────── */}
      <section id="faq" className="py-20 sm:py-28 bg-white/70 dark:bg-[#0b101c]/70 backdrop-blur-md border-y border-slate-200/80 dark:border-white/5 transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Clear Answers
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">Everything you need to know before settling your daily bills with Voltiva.</p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/5 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 text-left font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <span>{f.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>
                
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3 overflow-hidden"
                    >
                      {f.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOLD FINAL CALL TO ACTION ───────────────────────────────────── */}
      <section className="py-20 sm:py-28 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-950 via-[#091522] to-emerald-950 p-8 sm:p-14 text-center space-y-6 shadow-2xl border border-emerald-500/30 overflow-hidden">
            
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-0 left-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative space-y-4 max-w-2xl mx-auto">
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold tracking-wider uppercase inline-block">
                Ready in under 60 seconds
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-tight">
                Stop overpaying for your daily Nigerian utilities.
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Join thousands of verified Nigerians enjoying automated wallet funding, permanent 2% airtime cashback, and zero failed transactions.
              </p>
            </div>

            <div className="relative pt-2">
              <button
                onClick={() => user ? setActiveView('dashboard') : onOpenAuth('signup')}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-sm inline-flex items-center gap-2.5 shadow-xl shadow-emerald-500/30 hover:scale-[1.03] transition-all cursor-pointer"
              >
                <span>{user ? 'Go to Your Dashboard' : 'Create Your Free Account Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="bg-white dark:bg-[#070a12] border-t border-slate-200/80 dark:border-white/5 py-12 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center font-display font-black text-slate-950 text-base shadow-md">
                V
              </div>
              <span className="font-display text-xl font-black text-slate-900 dark:text-white">Voltiva</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Everyday payments made effortless. Direct, high-speed VTU infrastructure for airtime, data, electricity, and cable TV in Nigeria.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Utility Services</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onExploreService('airtime')} className="hover:text-emerald-600 dark:hover:text-white transition-colors cursor-pointer">Buy Airtime (2% Cashback)</button></li>
              <li><button onClick={() => onExploreService('data')} className="hover:text-emerald-600 dark:hover:text-white transition-colors cursor-pointer">Buy High-Speed Data</button></li>
              <li><button onClick={() => onExploreService('electricity')} className="hover:text-emerald-600 dark:hover:text-white transition-colors cursor-pointer">Prepaid Electricity Tokens</button></li>
              <li><button onClick={() => onExploreService('cable')} className="hover:text-emerald-600 dark:hover:text-white transition-colors cursor-pointer">Cable TV Renewal (DStv/GOtv)</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Company & Info</h4>
            <ul className="space-y-2">
              <li><a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-emerald-600 dark:hover:text-white transition-colors">Fees & Limitations</a></li>
              <li><span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="text-slate-400 dark:text-slate-600 cursor-not-allowed">Terms of Service</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Security & Rails</h4>
            <p className="mb-1">Operations: help@voltiva.ng</p>
            <p className="mb-3">Lekki Phase 1, Lagos, Nigeria</p>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>256-bit TLS Encrypted & Protected</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-200/80 dark:border-white/5 text-center text-slate-400 dark:text-slate-500 text-[11px]">
          © {new Date().getFullYear()} Voltiva Technologies Ltd. All rights reserved. Built for Nigerian digital commerce.
        </div>
      </footer>
    </div>
  );
};

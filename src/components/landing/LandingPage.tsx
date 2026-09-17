import React, { useState } from 'react';
import { 
  Smartphone, 
  Wifi, 
  Zap, 
  Tv, 
  ShieldCheck, 
  ZapOff, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Lock, 
  Sparkles,
  ArrowDownLeft,
  Receipt,
  FileCheck2,
  Check,
  Percent
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { formatNaira } from '../../utils/formatters';
import { ThemeToggle } from '../common/ThemeToggle';

interface LandingPageProps {
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onExploreService: (service: 'airtime' | 'data' | 'electricity' | 'cable') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth, onExploreService }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I fund my Voltiva wallet?',
      a: 'You can fund your Voltiva wallet instantly using your dedicated Wema Bank virtual account from any Nigerian banking app (GTBank, Access, Zenith, Kuda, OPay, etc.), or via automated debit card checkout powered by Paystack.'
    },
    {
      q: 'How fast are airtime, data, and bill token deliveries?',
      a: 'Transactions are processed in real-time. Telco airtime and data bundles are credited within 3–5 seconds, and 20-digit prepaid electricity STS meter tokens are generated immediately on screen and via SMS.'
    },
    {
      q: 'What happens if a transaction fails or my meter does not credit?',
      a: 'If an upstream Telco or Disco provider times out, our automated reconciliation engine attempts a secondary verification. If unfulfilled, your wallet balance is immediately reversed, and you can generate an instant dispute ticket with 24/7 priority resolution.'
    },
    {
      q: 'Can I buy airtime or pay utility bills for other people?',
      a: 'Yes. You can enter any third-party recipient phone number, meter number, or DStv/GOtv smartcard. You can also save them to your "Beneficiaries" list for instant 1-click repeat recharges.'
    },
    {
      q: 'Are there any hidden fees or subscription charges?',
      a: 'None. Airtime and data top-ups are 100% free with an additional 2% instant cashback on Telco recharges. Electricity bill payments incur a standard NERC utility service charge of ₦100, and TV bouquet renewals have a ₦50 processing charge.'
    },
    {
      q: 'Is my payment information and transaction data secure?',
      a: 'Voltiva enforces 256-bit TLS bank-grade encryption, 4-digit Transaction PIN authorization for all debits, and automated role-based Firestore security rules. No debit card credentials are ever stored on our servers.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 selection:bg-emerald-500/20 selection:text-emerald-500 transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0b0f17]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 font-display text-xl shadow-lg shadow-emerald-500/20">
              V
            </div>
            <div>
              <span className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">Voltiva</span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-widest text-emerald-700 dark:text-emerald-400 ml-2 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Fintech VTU
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <a href="#services" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Services</a>
            <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How It Works</a>
            <a href="#preview" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Product Experience</a>
            <a href="#pricing" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Pricing & Fees</a>
            <a href="#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">FAQ</a>
          </nav>

          {/* Auth Actions & Theme Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              id="nav-login-btn"
              onClick={() => onOpenAuth('login')}
              className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Log In
            </button>
            <button
              id="nav-signup-btn"
              onClick={() => onOpenAuth('signup')}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-extrabold tracking-wide transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              Create Account
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Next-Generation VTU Infrastructure for Nigeria</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
              Your everyday payments. <br />
              <span className="text-emerald-600 dark:text-emerald-400">One simple platform.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
              Recharge airtime with instant cashback, buy SME high-speed data bundles, generate prepaid electricity tokens, and renew cable TV subscriptions from one high-speed dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
              <motion.button
                id="hero-get-started-btn"
                onClick={() => onOpenAuth('signup')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/25 cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>

              <a
                href="#preview"
                className="w-full sm:w-auto px-7 py-3.5 sm:py-4 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <span>Explore Live App Experience</span>
              </a>
            </div>
          </motion.div>

          {/* HERO VISUAL: Real Interactive Product Interface Mockup */}
          <motion.div 
            id="preview" 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mt-14 sm:mt-16 max-w-5xl mx-auto"
          >
            <div className="relative rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-2xl overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10 transition-colors">
              {/* Product UI Mockup Top Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="ml-2 font-mono text-[11px] text-slate-400 dark:text-slate-500 hidden sm:inline">voltiva.app/dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] font-semibold">99.99% Telco Gateway Uptime</span>
                </div>
              </div>

              {/* Realistic Mock Dashboard Content */}
              <div className="space-y-6">
                {/* Balance + Virtual Account strip */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 bg-slate-900 text-white border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Available Wallet Balance</span>
                      <div className="font-display text-3xl sm:text-4xl font-black text-white mt-2">₦48,500.00</div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800">
                      <span className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-extrabold text-xs">
                        Fund Wallet
                      </span>
                      <span className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-semibold text-xs">
                        History
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-2">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Dedicated Bank Inward</span>
                    <p className="text-xs text-slate-900 dark:text-white font-semibold">Wema Bank (Voltiva Pay)</p>
                    <p className="font-mono text-lg font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">9018472910</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Auto-credited in seconds</p>
                  </div>
                </div>

                {/* Quick actions row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <motion.div 
                    onClick={() => onExploreService('airtime')}
                    whileHover={{ y: -2 }}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer shadow-xs"
                  >
                    <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Buy Airtime</h5>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">2% Cashback</p>
                  </motion.div>

                  <motion.div 
                    onClick={() => onExploreService('data')}
                    whileHover={{ y: -2 }}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 transition-all cursor-pointer shadow-xs"
                  >
                    <Wifi className="w-5 h-5 text-blue-600 dark:text-blue-400 mb-2" />
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Buy Data</h5>
                    <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">SME & Direct</p>
                  </motion.div>

                  <motion.div 
                    onClick={() => onExploreService('electricity')}
                    whileHover={{ y: -2 }}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500 transition-all cursor-pointer shadow-xs"
                  >
                    <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 mb-2" />
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Electricity</h5>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">Instant Token</p>
                  </motion.div>

                  <motion.div 
                    onClick={() => onExploreService('cable')}
                    whileHover={{ y: -2 }}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 transition-all cursor-pointer shadow-xs"
                  >
                    <Tv className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
                    <h5 className="font-bold text-xs text-slate-900 dark:text-white">Cable TV</h5>
                    <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">DStv & GOtv</p>
                  </motion.div>
                </div>

                {/* Recent sample transactions preview */}
                <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900 dark:text-white">Recent Transactions</span>
                    <span className="text-slate-500 dark:text-slate-400">Updated Live</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-200 dark:border-slate-800/60 text-xs">
                      <div className="flex items-center gap-2 truncate mr-2">
                        <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span className="text-slate-800 dark:text-slate-200 truncate">MTN Airtime Top-up to 08149823411</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-slate-900 dark:text-white font-bold">₦2,000.00</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">Successful</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-1.5 text-xs">
                      <div className="flex items-center gap-2 truncate mr-2">
                        <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="text-slate-800 dark:text-slate-200 truncate">EKEDC Prepaid Meter (Token: 4892-0194-8261-9034)</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-slate-900 dark:text-white font-bold">₦15,100.00</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">Successful</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TRUST VALUES SECTION */}
      <section className="py-14 sm:py-16 bg-white dark:bg-[#0f172a]/50 border-b border-slate-200 dark:border-slate-800/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center md:text-left">
            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 dark:text-emerald-400">
                <Clock className="w-5 h-5" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Fast Transactions</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dispensations fulfill in 3–5 seconds</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 dark:text-emerald-400">
                <Lock className="w-5 h-5" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Secure Payments</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">256-bit TLS bank-grade encryption</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">24/7 Access</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Automated weekend & holiday top-ups</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 dark:text-emerald-400">
                <FileCheck2 className="w-5 h-5" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Instant Receipts</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Downloadable official PDF/print receipts</p>
            </div>

            <div className="space-y-1 col-span-2 md:col-span-1">
              <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Reliable Support</h4>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Dedicated dispute desk with zero ghosting</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SERVICES ECOSYSTEM */}
      <section id="services" className="py-20 sm:py-24 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Fintech Utility Suite</span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white">
              Essential everyday utilities, engineered with speed.
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Direct integration into Nigerian Telcos, NERC electricity Discos, and Multichoice satellite networks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Airtime */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-emerald-500/50 transition-all group shadow-xs"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Smartphone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Instant Airtime</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Recharge MTN, Airtel, Glo, and 9mobile with instant 2% cashback discount credited back to your wallet.
                </p>
              </div>
              <button
                onClick={() => onExploreService('airtime')}
                className="mt-6 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors cursor-pointer"
              >
                <span>Recharge Phone Line</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Data */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-blue-500/50 transition-all group shadow-xs"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wifi className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Internet Data</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  High-speed daily, weekly, monthly, and SME data bundles for home routers, mobile phones, and business modems.
                </p>
              </div>
              <button
                onClick={() => onExploreService('data')}
                className="mt-6 flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors cursor-pointer"
              >
                <span>Browse Data Plans</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Electricity */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-amber-500/50 transition-all group shadow-xs"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Electricity Bills</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Pay prepaid and postpaid accounts across IKEDC, EKEDC, AEDC, IBEDC, PHED, EEDC, and KEDCO with instant STS tokens.
                </p>
              </div>
              <button
                onClick={() => onExploreService('electricity')}
                className="mt-6 flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-colors cursor-pointer"
              >
                <span>Pay Disco Meter</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>

            {/* Cable TV */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-7 flex flex-col justify-between hover:border-purple-500/50 transition-all group shadow-xs"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Tv className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Cable Subscriptions</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Instant decoder reactivation and bouquet upgrades for DStv, GOtv, and StarTimes with verified owner details.
                </p>
              </div>
              <button
                onClick={() => onExploreService('cable')}
                className="mt-6 flex items-center gap-2 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors cursor-pointer"
              >
                <span>Renew Decoder</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (3 Simple Steps) */}
      <section id="how-it-works" className="py-20 sm:py-24 bg-slate-100/70 dark:bg-[#0f172a]/30 border-b border-slate-200 dark:border-slate-800/60 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Frictionless Workflow</span>
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">How Voltiva Works</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">Three straightforward steps to settle your everyday recurring bills.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 relative space-y-3 shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black font-display text-lg flex items-center justify-center">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Fund your wallet</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Deposit through your automated dedicated Wema virtual account or debit card. Balance reflects immediately with zero hidden fees.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 relative space-y-3 shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black font-display text-lg flex items-center justify-center">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Choose a service</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Select Airtime, Data, Electricity, or Cable TV. Pick from your saved frequent beneficiaries or enter new account numbers.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -3 }}
              className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 relative space-y-3 shadow-xs"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-black font-display text-lg flex items-center justify-center">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pay and receive receipt</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Authorize payment with your secure 4-digit PIN. Your service is fulfilled in 3 seconds alongside a verifiable electronic receipt.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PRICING & FEES */}
      <section id="pricing" className="py-20 sm:py-24 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Transparent Economics</span>
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Clear, Honest Fees</h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">No unexpected charges, no maintenance fees, and instant cashback on airtime.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Airtime Top-Up</span>
              <div className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400">FREE + 2% Cashback</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">You pay ₦980 for ₦1,000 airtime across all Nigerian Telco lines.</p>
            </div>

            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Broadband Data</span>
              <div className="text-2xl font-bold font-display text-slate-900 dark:text-white">Direct Tariff Rates</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Wholesale SME data plans from ₦300/GB with zero service markup.</p>
            </div>

            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Prepaid Electricity</span>
              <div className="text-2xl font-bold font-display text-slate-900 dark:text-white">₦100 Utility Fee</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Regulated NERC utility gateway fee. Instant 20-digit STS meter token.</p>
            </div>

            <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-3 shadow-xs">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">Cable TV Bouquet</span>
              <div className="text-2xl font-bold font-display text-slate-900 dark:text-white">₦50 Gateway Fee</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">Standard DStv, GOtv, and StarTimes subscription processing fee.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-24 border-b border-slate-200 dark:border-slate-800/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Got Questions?</span>
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-5 text-left font-semibold text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{f.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/60 pt-3 overflow-hidden"
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

      {/* FINAL CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 border border-emerald-500/30 p-8 sm:p-12 text-center space-y-6 shadow-xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              Ready to simplify your everyday payments?
            </h2>
            <p className="text-sm text-slate-300 max-w-xl mx-auto">
              Open your free Voltiva account in under 60 seconds and experience fast, dependable Nigerian VTU payments.
            </p>
            <motion.button
              onClick={() => onOpenAuth('signup')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm inline-flex items-center gap-2 shadow-xl shadow-emerald-500/20 cursor-pointer"
            >
              <span>Create your account</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800/80 py-12 text-xs text-slate-600 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-slate-950 font-display text-base">
                V
              </div>
              <span className="font-display text-xl font-bold text-slate-900 dark:text-white">Voltiva</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Everyday payments, made effortless. Designed for trust, speed, and simplicity in the Nigerian fintech market.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Services</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onExploreService('airtime')} className="hover:text-emerald-600 dark:hover:text-white cursor-pointer">Buy Airtime</button></li>
              <li><button onClick={() => onExploreService('data')} className="hover:text-emerald-600 dark:hover:text-white cursor-pointer">Buy Internet Data</button></li>
              <li><button onClick={() => onExploreService('electricity')} className="hover:text-emerald-600 dark:hover:text-white cursor-pointer">Pay Electricity Bill</button></li>
              <li><button onClick={() => onExploreService('cable')} className="hover:text-emerald-600 dark:hover:text-white cursor-pointer">Cable TV Subscription</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Company & Legal</h4>
            <ul className="space-y-2">
              <li><a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-white">How It Works</a></li>
              <li><a href="#pricing" className="hover:text-emerald-600 dark:hover:text-white">Fees & Limits</a></li>
              <li><span className="text-slate-400 dark:text-slate-500 cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="text-slate-400 dark:text-slate-500 cursor-not-allowed">Terms of Service</span></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 dark:text-white mb-3">Support & Security</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">24/7 Operations Desk: help@voltiva.ng</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Lekki Phase 1, Lagos, Nigeria</p>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>TLS Encrypted & Secured</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-200 dark:border-slate-900 text-center text-slate-400 dark:text-slate-500 text-[11px]">
          © {new Date().getFullYear()} Voltiva Technologies Ltd. All rights reserved. Built for the Nigerian digital economy.
        </div>
      </footer>
    </div>
  );
};


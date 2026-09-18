import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Smartphone, 
  Wifi, 
  Zap, 
  Tv, 
  Wallet as WalletIcon, 
  History, 
  Users, 
  Bell, 
  HelpCircle, 
  Settings, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X,
  ArrowDownLeft,
  ChevronRight,
  Sparkles,
  Lock,
  UserCheck,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from './context/AppContext';
import { ActiveView } from './types';
import { formatNaira } from './utils/formatters';
import { ThemeToggle } from './components/common/ThemeToggle';

// Views
import { LandingPage } from './components/landing/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { AirtimePurchase } from './components/vtu/AirtimePurchase';
import { DataPurchase } from './components/vtu/DataPurchase';
import { ElectricityBill } from './components/vtu/ElectricityBill';
import { CableTvSubscription } from './components/vtu/CableTvSubscription';
import { WalletView } from './components/wallet/WalletView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { BeneficiariesView } from './components/beneficiaries/BeneficiariesView';
import { NotificationsView } from './components/notifications/NotificationsView';
import { SupportView } from './components/support/SupportView';
import { SettingsView } from './components/settings/SettingsView';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { FundWalletModal } from './components/wallet/FundWalletModal';

export function AppContent() {
  const { 
    user, 
    wallet, 
    activeView, 
    setActiveView, 
    notifications, 
    logout,
    isAdmin,
    loginAsDemoAdmin,
    loginAsDemoCustomer 
  } = useApp();

  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [quickPayOpen, setQuickPayOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [fundModalOpen, setFundModalOpen] = useState<boolean>(false);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLandingExplore = (service: 'airtime' | 'data' | 'electricity' | 'cable') => {
    if (!user) {
      handleOpenAuth('login');
      return;
    }
    setActiveView(service);
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'airtime', label: 'Buy Airtime', icon: Smartphone, badge: '2% back' },
    { id: 'data', label: 'Buy Data', icon: Wifi },
    { id: 'electricity', label: 'Electricity Bill', icon: Zap },
    { id: 'cable', label: 'Cable TV', icon: Tv },
    { id: 'wallet', label: 'My Wallet', icon: WalletIcon },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'beneficiaries', label: 'Beneficiaries', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadNotificationsCount },
    { id: 'support', label: 'Support & Help', icon: HelpCircle },
    { id: 'settings', label: 'Security & Roles', icon: Settings },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Ledger', icon: ShieldCheck, badge: 'Admin' });
  }

  // If user explicitly navigated to landing view or has no active session
  if (activeView === 'landing' || !user) {
    return (
      <>
        <LandingPage
          onOpenAuth={handleOpenAuth}
          onExploreService={handleLandingExplore}
        />
        <AuthModal
          isOpen={authModalOpen}
          initialMode={authMode}
          onClose={() => setAuthModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070a12] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200 overflow-x-hidden w-full max-w-full selection:bg-emerald-500/20 selection:text-emerald-500">
      
      {/* ── Mobile Top Header ────────────────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-30 bg-white/95 dark:bg-[#090d16]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-white/5 px-4 py-2.5 h-14 flex items-center justify-between shadow-2xs">
        {/* Left: Brand Identity & User Greeting */}
        <div 
          onClick={() => setActiveView('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer min-w-0"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 font-display text-sm shadow-sm shrink-0">
            V
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display text-base font-bold text-slate-900 dark:text-white leading-none">Voltiva</span>
              {isAdmin && (
                <span className="px-1.5 py-0.5 rounded text-[8px] font-black bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 uppercase tracking-wider">
                  Admin
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[130px] leading-tight mt-0.5">
              Hi, {user?.fullName.split(' ')[0] || 'Customer'}
            </span>
          </div>
        </div>

        {/* Right: Quick Controls & Profile Menu Trigger */}
        <div className="flex items-center gap-1.5 shrink-0">
          <ThemeToggle />

          <button
            onClick={() => setActiveView('notifications')}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Notifications"
            aria-label="View notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            )}
          </button>

          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer ml-0.5"
            aria-label="Open menu and profile"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs ring-1 ring-emerald-500/30">
              {user?.fullName.charAt(0) || 'U'}
            </div>
          </button>
        </div>
      </header>

      {/* ── Desktop Persistent Sidebar ──────────────────────────────────── */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col justify-between bg-white dark:bg-[#0c1322] border-r border-slate-200/80 dark:border-white/5 shrink-0 sticky top-0 h-screen p-4 overflow-y-auto transition-colors duration-200 shadow-sm">
        <div className="space-y-5">
          
          {/* Brand & Theme Toggle */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div 
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 font-display text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                V
              </div>
              <div>
                <span className="font-display text-xl font-extrabold tracking-tight text-slate-900 dark:text-white block">Voltiva</span>
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Fast Nigerian VTU</span>
              </div>
            </div>

            <ThemeToggle />
          </div>

          {/* Authorization & Role Status Banner */}
          <div className="px-3.5 py-2.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <div>
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 block">Administrator</span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400">Full Ledger Access</span>
                  </div>
                </>
              ) : (
                <>
                  <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 block">Verified Customer</span>
                    <span className="text-[9px] text-emerald-600 dark:text-emerald-400">Tier 2 KYC</span>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => {
                if (isAdmin) {
                  loginAsDemoCustomer();
                } else {
                  loginAsDemoAdmin();
                }
              }}
              title={isAdmin ? "Switch to Customer test view" : "Switch to Admin test view"}
              className="text-[10px] px-2 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>{isAdmin ? "Customer" : "Admin"}</span>
            </button>
          </div>

          {/* Quick Balance Preview in Sidebar */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-[#0e1726] to-emerald-950 text-white shadow-md space-y-2.5 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-medium">Wallet Balance</span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active
              </span>
            </div>
            <div className="font-display text-xl font-black text-white">
              {formatNaira(wallet?.availableBalance || 0)}
            </div>
            <button
              id="sidebar-fund-wallet-btn"
              onClick={() => setFundModalOpen(true)}
              className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm hover:scale-[1.01]"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Fund Balance</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveView(item.id as ActiveView)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold shadow-md shadow-emerald-500/20'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-slate-950 text-white' : 'bg-emerald-500 text-slate-950'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: User & Landing switch */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-white/5 space-y-2 text-xs">
          <button
            onClick={() => setActiveView('landing')}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-between text-xs transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
              <span>Public Landing Page</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.fullName.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate text-xs">{user?.fullName}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 p-3 sm:p-5 md:p-6 lg:p-8 pb-28 md:pb-8 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {activeView === 'dashboard' && <DashboardOverview />}
              {activeView === 'airtime' && <AirtimePurchase />}
              {activeView === 'data' && <DataPurchase />}
              {activeView === 'electricity' && <ElectricityBill />}
              {activeView === 'cable' && <CableTvSubscription />}
              {activeView === 'wallet' && <WalletView />}
              {activeView === 'transactions' && <TransactionsView />}
              {activeView === 'beneficiaries' && <BeneficiariesView />}
              {activeView === 'notifications' && <NotificationsView />}
              {activeView === 'support' && <SupportView />}
              {activeView === 'settings' && <SettingsView />}

              {/* Protected Admin Route */}
              {activeView === 'admin' && (
                isAdmin ? (
                  <AdminDashboard />
                ) : (
                  <div className="max-w-xl mx-auto py-16 px-6 text-center space-y-6">
                    <div className="w-16 h-16 rounded-3xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center border border-purple-500/20 shadow-sm">
                      <Lock className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                        Administrator Access Required
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        The System Ledger and Gateway Reconciliation console are restricted to authorized administrators. Your current session is authenticated with role: <span className="font-mono font-semibold text-emerald-600">{user?.role || 'user'}</span>.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => loginAsDemoAdmin()}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Authorize as Admin (Census Okoi)</span>
                      </button>
                      <button
                        onClick={() => setActiveView('dashboard')}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  </div>
                )
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── Mobile Fixed Bottom Navigation Bar ────────────────────────────── */}
      <nav 
        aria-label="Mobile bottom navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0c1322]/95 backdrop-blur-xl border-t border-slate-200/90 dark:border-white/10 px-3 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] flex items-center justify-around"
      >
        <button
          id="mobile-bottom-nav-home"
          onClick={() => setActiveView('dashboard')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeView === 'dashboard'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>

        <button
          id="mobile-bottom-nav-wallet"
          onClick={() => setActiveView('wallet')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeView === 'wallet'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <WalletIcon className="w-5 h-5" />
          <span className="text-[10px]">Wallet</span>
        </button>

        {/* Central Quick Pay Action */}
        <button
          id="mobile-bottom-nav-quickpay"
          onClick={() => setQuickPayOpen(true)}
          className="flex flex-col items-center -mt-5 cursor-pointer group"
          aria-label="Quick Pay & Services"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform ring-4 ring-white dark:ring-[#070a12]">
            <Zap className="w-6 h-6 fill-slate-950" />
          </div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Quick Pay</span>
        </button>

        <button
          id="mobile-bottom-nav-history"
          onClick={() => setActiveView('transactions')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeView === 'transactions'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <History className="w-5 h-5" />
          <span className="text-[10px]">History</span>
        </button>

        <button
          id="mobile-bottom-nav-menu"
          onClick={() => setMobileNavOpen(true)}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            mobileNavOpen
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
          aria-label="Open full menu"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px]">Menu</span>
        </button>
      </nav>

      {/* ── Mobile Slide-in Navigation Drawer ────────────────────────── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 300 }}
              className="relative w-4/5 max-w-xs bg-white dark:bg-[#0c1322] border-r border-slate-200 dark:border-white/10 h-full flex flex-col justify-between p-4 z-10 overflow-y-auto shadow-2xl"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-sm">
                      V
                    </div>
                    <span className="font-display text-lg font-bold text-slate-900 dark:text-white">Voltiva</span>
                  </div>
                  <button
                    onClick={() => setMobileNavOpen(false)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Role & Switcher */}
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isAdmin ? (
                      <>
                        <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        <div>
                          <span className="text-xs font-bold text-purple-700 dark:text-purple-300 block">Administrator</span>
                          <span className="text-[9px] text-slate-500">Full Access</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <div>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Verified Customer</span>
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400">Tier 2 KYC</span>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (isAdmin) loginAsDemoCustomer();
                      else loginAsDemoAdmin();
                    }}
                    className="text-[10px] px-2 py-1 rounded bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className="w-2.5 h-2.5" />
                    <span>{isAdmin ? "Customer" : "Admin"}</span>
                  </button>
                </div>

                {/* Quick Balance Preview */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Wallet Balance</span>
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active
                    </span>
                  </div>
                  <div className="font-display text-lg font-black text-white">
                    {formatNaira(wallet?.availableBalance || 0)}
                  </div>
                  <button
                    onClick={() => {
                      setMobileNavOpen(false);
                      setFundModalOpen(true);
                    }}
                    className="w-full py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5" />
                    <span>Fund Balance</span>
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1 text-xs font-semibold">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        id={`mobile-drawer-nav-${item.id}`}
                        onClick={() => {
                          setActiveView(item.id as ActiveView);
                          setMobileNavOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold shadow-sm'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                        {item.count !== undefined && item.count > 0 && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isActive ? 'bg-slate-950 text-white' : 'bg-emerald-500 text-slate-950'
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Footer */}
              <div className="pt-3 border-t border-slate-200 dark:border-white/5 space-y-2 text-xs">
                <button
                  onClick={() => {
                    setActiveView('landing');
                    setMobileNavOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 flex items-center justify-between text-xs cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Public Landing Page</span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-white/5">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0">
                      {user?.fullName.charAt(0) || 'U'}
                    </div>
                    <div className="overflow-hidden min-w-0">
                      <p className="font-semibold text-slate-900 dark:text-white truncate text-xs">{user?.fullName}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setMobileNavOpen(false);
                      logout();
                    }}
                    title="Log out"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ── Quick Pay Services Sheet ──────────────────────────────────────── */}
      <AnimatePresence>
        {quickPayOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setQuickPayOpen(false)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-full bg-white dark:bg-[#0f172a] rounded-t-3xl border-t border-slate-200 dark:border-white/10 p-5 z-10 shadow-2xl safe-bottom space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">Quick Pay Services</h3>
                  <p className="text-[11px] text-slate-500">Choose a service to recharge instantly</p>
                </div>
                <button
                  onClick={() => setQuickPayOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={() => {
                    setActiveView('airtime');
                    setQuickPayOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/5 hover:border-emerald-500/50 flex flex-col items-start gap-2 transition-all cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Buy Airtime</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">2% cashback</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveView('data');
                    setQuickPayOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/5 hover:border-emerald-500/50 flex flex-col items-start gap-2 transition-all cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Buy Data</span>
                    <span className="text-[10px] text-slate-500">SME & Direct bundles</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveView('electricity');
                    setQuickPayOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/5 hover:border-emerald-500/50 flex flex-col items-start gap-2 transition-all cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Electricity Bill</span>
                    <span className="text-[10px] text-slate-500">Prepaid STS token</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setActiveView('cable');
                    setQuickPayOpen(false);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-white/5 hover:border-emerald-500/50 flex flex-col items-start gap-2 transition-all cursor-pointer text-left"
                >
                  <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">Cable TV</span>
                    <span className="text-[10px] text-slate-500">DStv, GOtv, StarTimes</span>
                  </div>
                </button>
              </div>

              <button
                onClick={() => {
                  setQuickPayOpen(false);
                  setFundModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-500" />
                <span>Fund Wallet with Dedicated Wema Account</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Global Modals */}
      <FundWalletModal
        isOpen={fundModalOpen}
        onClose={() => setFundModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return <AppContent />;
}


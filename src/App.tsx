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
  User,
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
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [fundModalOpen, setFundModalOpen] = useState<boolean>(false);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLandingExplore = (service: 'airtime' | 'data' | 'electricity' | 'cable') => {
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
  if (activeView === 'landing' || (!user && activeView !== 'dashboard')) {
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200 overflow-x-hidden w-full max-w-full">
      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-30 bg-white/90 dark:bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div 
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 font-display text-sm shadow-xs">
              V
            </div>
            <span className="font-display text-lg font-bold text-slate-900 dark:text-white">Voltiva</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Role Indicator */}
          {isAdmin ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Admin
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
              Customer
            </span>
          )}

          <ThemeToggle />

          <button
            onClick={() => setActiveView('notifications')}
            className="relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900"></span>
            )}
          </button>

          <button
            onClick={() => setFundModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-xs"
          >
            Fund
          </button>
        </div>
      </header>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col justify-between bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800/80 shrink-0 sticky top-0 h-screen p-4 overflow-y-auto transition-colors duration-200 shadow-xs">
        <div className="space-y-5">
          {/* Brand & Theme Toggle */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div 
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 font-display text-xl shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                V
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-tight text-slate-900 dark:text-white block">Voltiva</span>
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">Fast Nigerian VTU</span>
              </div>
            </div>

            <ThemeToggle />
          </div>

          {/* Authorization & Role Status Banner */}
          <div className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <div>
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 block">Administrator</span>
                    <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono">Full Ledger Access</span>
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
              className="text-[10px] px-2 py-1 rounded bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              <span>{isAdmin ? "Customer" : "Admin"}</span>
            </button>
          </div>

          {/* Quick Balance Preview in Sidebar */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-medium">Wallet Balance</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">● Active</span>
            </div>
            <div className="font-display text-xl font-black text-slate-900 dark:text-white">
              {formatNaira(wallet?.availableBalance || 0)}
            </div>
            <button
              id="sidebar-fund-wallet-btn"
              onClick={() => setFundModalOpen(true)}
              className="w-full py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 hover:text-slate-950 text-emerald-600 dark:text-emerald-300 dark:bg-emerald-500/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-500/20"
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
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/15'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400 dark:text-slate-400'}`} />
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
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 space-y-2 text-xs">
          <button
            onClick={() => setActiveView('landing')}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 flex items-center justify-between text-xs transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
              <span>Public Landing Page</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/50">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-slate-800 dark:text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user?.fullName.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white truncate text-xs">{user?.fullName}</p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileNavOpen(false)} 
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs"
            />
            <motion.div 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative w-72 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between z-10 overflow-y-auto shadow-2xl"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center font-black text-slate-950 font-display text-lg">
                      V
                    </div>
                    <span className="font-display text-xl font-bold text-slate-900 dark:text-white">Voltiva</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ThemeToggle />
                    <button 
                      onClick={() => setMobileNavOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Mobile Balance */}
                <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Balance</span>
                  <div className="font-display text-2xl font-black text-slate-900 dark:text-white mt-1">
                    {formatNaira(wallet?.availableBalance || 0)}
                  </div>
                </div>

                <nav className="space-y-1 text-xs font-semibold">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveView(item.id as ActiveView);
                          setMobileNavOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <button
                  onClick={() => {
                    setActiveView('landing');
                    setMobileNavOpen(false);
                  }}
                  className="w-full py-2.5 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl bg-slate-100 dark:bg-slate-900 cursor-pointer"
                >
                  Go to Public Landing Page
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area with Protected Route Access Controls */}
      <main className="flex-1 min-w-0 p-3 sm:p-5 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
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

              {/* Protected Admin Route with crisp RBAC Guard */}
              {activeView === 'admin' && (
                isAdmin ? (
                  <AdminDashboard />
                ) : (
                  <div className="max-w-xl mx-auto py-16 px-6 text-center space-y-6">
                    <div className="w-16 h-16 rounded-3xl bg-purple-500/10 text-purple-600 dark:text-purple-400 mx-auto flex items-center justify-center border border-purple-500/20 shadow-xs">
                      <Lock className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white">
                        Administrator Access Required
                      </h2>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        The System Ledger and Gateway Reconciliation console are restricted to authorized administrators (such as <span className="font-mono font-semibold text-slate-900 dark:text-white">censusokoi515@gmail.com</span>). Your current session is authenticated with role: <span className="font-mono font-semibold text-emerald-600">{user?.role || 'user'}</span>.
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => loginAsDemoAdmin()}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
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

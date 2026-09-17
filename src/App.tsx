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
  User,
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
    { id: 'dashboard',      label: 'Dashboard',         icon: LayoutDashboard },
    { id: 'airtime',        label: 'Buy Airtime',        icon: Smartphone, badge: '2% back' },
    { id: 'data',           label: 'Buy Data',           icon: Wifi },
    { id: 'electricity',    label: 'Electricity',        icon: Zap },
    { id: 'cable',          label: 'Cable TV',           icon: Tv },
    { id: 'wallet',         label: 'My Wallet',          icon: WalletIcon },
    { id: 'transactions',   label: 'Transactions',       icon: History },
    { id: 'beneficiaries',  label: 'Beneficiaries',      icon: Users },
    { id: 'notifications',  label: 'Notifications',      icon: Bell, count: unreadNotificationsCount },
    { id: 'support',        label: 'Support',            icon: HelpCircle },
    { id: 'settings',       label: 'Security & Roles',   icon: Settings },
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Ledger', icon: ShieldCheck, badge: 'Admin' });
  }

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
    <div className="min-h-screen bg-[--volt-surface] text-[--volt-text] flex flex-col md:flex-row transition-colors duration-200 overflow-x-hidden w-full max-w-full">

      {/* ── Mobile Top Header ────────────────────────────────────────────── */}
      <header className="md:hidden sticky top-0 z-30 bg-[--volt-panel]/95 dark:bg-[#0d1117]/95 backdrop-blur-md border-b border-[--volt-line] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open navigation menu"
            className="p-2 rounded-md text-[--volt-muted] hover:text-[--volt-text] hover:bg-[--volt-line] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveView('dashboard')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-md bg-[--volt-charge] flex items-center justify-center font-display font-black text-[#0d1117] text-sm">
              V
            </div>
            <span className="font-display text-base font-bold text-[--volt-text]">Voltiva</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={() => setActiveView('notifications')}
            className="relative p-2 rounded-md text-[--volt-muted] hover:text-[--volt-text] hover:bg-[--volt-line] transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[--volt-charge]"></span>
            )}
          </button>

          <button
            onClick={() => setFundModalOpen(true)}
            className="px-3 py-1.5 rounded-md bg-[--volt-charge] text-[#0d1117] text-[12px] font-bold transition-opacity hover:opacity-90"
          >
            Fund
          </button>
        </div>
      </header>

      {/* ── Desktop Sidebar — navigation only, no duplicate widgets ─────── */}
      <aside className="hidden md:flex md:w-60 lg:w-64 flex-col justify-between bg-[--volt-panel] dark:bg-[#0d1117] border-r border-[--volt-line] shrink-0 sticky top-0 h-screen p-4 overflow-y-auto transition-colors duration-200">
        <div className="space-y-6">

          {/* Brand */}
          <div className="flex items-center justify-between px-1 pt-1">
            <button
              onClick={() => setActiveView('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-md bg-[--volt-charge] flex items-center justify-center font-display font-black text-[#0d1117] text-base">
                V
              </div>
              <span className="font-display text-[1.0625rem] font-bold text-[--volt-text]">Voltiva</span>
            </button>
            <ThemeToggle />
          </div>

          {/* Role indicator — compact, no card chrome */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-[12px]">
              {isAdmin ? (
                <>
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span className="font-semibold text-purple-400">Administrator</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-[--volt-charge]" />
                  <span className="font-semibold text-[--volt-charge]">Verified</span>
                </>
              )}
            </div>
            <button
              onClick={() => { if (isAdmin) loginAsDemoCustomer(); else loginAsDemoAdmin(); }}
              title={isAdmin ? 'Switch to Customer view' : 'Switch to Admin view'}
              className="text-[11px] px-2 py-1 rounded-sm bg-[--volt-line] hover:bg-[--volt-muted]/30 text-[--volt-muted] hover:text-[--volt-text] font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-2.5 h-2.5" />
              {isAdmin ? 'Customer' : 'Admin'}
            </button>
          </div>

          {/* Navigation */}
          <nav className="space-y-0.5 text-[13px] font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveView(item.id as ActiveView)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[--volt-charge] text-[#0d1117] font-bold'
                      : 'text-[--volt-muted] hover:text-[--volt-text] hover:bg-[--volt-line]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-[#0d1117]/20 text-[#0d1117]'
                        : 'bg-[--volt-charge]/15 text-[--volt-charge]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-[#0d1117] text-white' : 'bg-[--volt-charge] text-[#0d1117]'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer: user identity + logout only */}
        <div className="pt-4 border-t border-[--volt-line] space-y-3">
          {/* Fund wallet shortcut */}
          <button
            id="sidebar-fund-wallet-btn"
            onClick={() => setFundModalOpen(true)}
            className="w-full py-2 px-3 rounded-md bg-[--volt-charge]/10 hover:bg-[--volt-charge] hover:text-[#0d1117] text-[--volt-charge] text-[12px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-[--volt-charge]/20"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            Fund Wallet
          </button>

          <div className="flex items-center justify-between p-2 rounded-md border border-[--volt-line]">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-md bg-[--volt-charge]/20 text-[--volt-charge] flex items-center justify-center font-bold text-[12px] shrink-0">
                {user?.fullName.charAt(0) || 'U'}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="font-semibold text-[--volt-text] truncate text-[12px] leading-tight">{user?.fullName}</p>
                <p className="text-[11px] text-[--volt-muted] truncate leading-tight">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Log out"
              className="p-1.5 rounded-md text-[--volt-muted] hover:text-rose-500 hover:bg-[--volt-line] transition-colors shrink-0 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Mobile Drawer Navigation ─────────────────────────────────────── */}
      <AnimatePresence>
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={() => setMobileNavOpen(false)}
              className="fixed inset-0 bg-[#0d1117]/80 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative w-64 bg-[--volt-panel] dark:bg-[#0d1117] border-r border-[--volt-line] p-4 flex flex-col justify-between z-10 overflow-y-auto"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-[--volt-charge] flex items-center justify-center font-display font-black text-[#0d1117] text-sm">
                      V
                    </div>
                    <span className="font-display text-base font-bold text-[--volt-text]">Voltiva</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ThemeToggle />
                    <button
                      onClick={() => setMobileNavOpen(false)}
                      className="p-1 text-[--volt-muted] hover:text-[--volt-text] cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <nav className="space-y-0.5 text-[13px] font-semibold">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => { setActiveView(item.id as ActiveView); setMobileNavOpen(false); }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[--volt-charge] text-[#0d1117] font-bold'
                            : 'text-[--volt-muted] hover:text-[--volt-text] hover:bg-[--volt-line]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className="w-4 h-4 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[--volt-charge]/15 text-[--volt-charge]">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-[--volt-line]">
                <div className="flex items-center justify-between p-2 rounded-md border border-[--volt-line]">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-7 h-7 rounded-md bg-[--volt-charge]/20 text-[--volt-charge] flex items-center justify-center font-bold text-[12px] shrink-0">
                      {user?.fullName.charAt(0) || 'U'}
                    </div>
                    <p className="font-semibold text-[--volt-text] truncate text-[12px]">{user?.fullName}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setMobileNavOpen(false); }}
                    title="Log out"
                    className="p-1.5 rounded-md text-[--volt-muted] hover:text-rose-500 hover:bg-[--volt-line] transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 p-3 sm:p-5 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {activeView === 'dashboard'    && <DashboardOverview />}
              {activeView === 'airtime'      && <AirtimePurchase />}
              {activeView === 'data'         && <DataPurchase />}
              {activeView === 'electricity'  && <ElectricityBill />}
              {activeView === 'cable'        && <CableTvSubscription />}
              {activeView === 'wallet'       && <WalletView />}
              {activeView === 'transactions' && <TransactionsView />}
              {activeView === 'beneficiaries' && <BeneficiariesView />}
              {activeView === 'notifications' && <NotificationsView />}
              {activeView === 'support'      && <SupportView />}
              {activeView === 'settings'     && <SettingsView />}

              {activeView === 'admin' && (
                isAdmin ? (
                  <AdminDashboard />
                ) : (
                  <div className="max-w-xl mx-auto py-16 px-6 text-center space-y-6">
                    <div className="w-14 h-14 rounded-xl bg-purple-500/10 text-purple-500 mx-auto flex items-center justify-center border border-purple-500/20">
                      <Lock className="w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="font-display text-[1.5rem] font-bold text-[--volt-text]">
                        Administrator access required
                      </h2>
                      <p className="text-[0.875rem] text-[--volt-subtext] leading-relaxed max-w-[45ch] mx-auto">
                        The ledger and gateway reconciliation console are restricted to authorized administrators. Your current session role is{' '}
                        <span className="font-bold text-[--volt-charge]">{user?.role || 'user'}</span>.
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                      <button
                        onClick={() => loginAsDemoAdmin()}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Authorize as Admin
                      </button>
                      <button
                        onClick={() => setActiveView('dashboard')}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-md bg-[--volt-line] hover:bg-[--volt-muted]/20 text-[--volt-text] font-semibold text-[13px] transition-colors cursor-pointer"
                      >
                        Back to Dashboard
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

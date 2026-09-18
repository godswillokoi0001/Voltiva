import React, { useState } from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowDownLeft, 
  Smartphone, 
  Wifi, 
  Zap, 
  Tv, 
  Users, 
  History, 
  Copy, 
  Check, 
  Building2, 
  TrendingUp, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNaira, formatDateTime } from '../../utils/formatters';
import { StatusBadge, ProviderBadge, ServiceIcon } from '../common/Badges';
import { FundWalletModal } from '../wallet/FundWalletModal';
import { ReceiptModal } from '../common/ReceiptModal';

export const DashboardOverview: React.FC = () => {
  const { wallet, transactions, beneficiaries, setActiveView, selectedReceiptTx, setSelectedReceiptTx } = useApp();
  const [isFundOpen, setIsFundOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showBalance, setShowBalance] = useState<boolean>(true);

  const recentTransactions = transactions.slice(0, 5);

  const handleCopyAccount = () => {
    if (wallet?.virtualAccountNumber) {
      navigator.clipboard.writeText(wallet.virtualAccountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const quickServices = [
    {
      id: 'airtime',
      title: 'Buy Airtime',
      desc: '2% instant cashback',
      icon: Smartphone,
      gradient: 'from-emerald-500/15 to-teal-500/10 text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      badge: '2% back',
      badgeColor: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
    },
    {
      id: 'data',
      title: 'Buy Data',
      desc: 'SME & direct bundles',
      icon: Wifi,
      gradient: 'from-blue-500/15 to-cyan-500/10 text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
      badge: 'Wholesale',
      badgeColor: 'bg-blue-500/15 text-blue-700 dark:text-blue-300'
    },
    {
      id: 'electricity',
      title: 'Pay Electricity',
      desc: 'Instant STS meter token',
      icon: Zap,
      gradient: 'from-amber-500/15 to-orange-500/10 text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-500/20 text-amber-600 dark:text-amber-400',
      badge: 'All Discos',
      badgeColor: 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
    },
    {
      id: 'cable',
      title: 'Cable TV',
      desc: 'DStv, GOtv & StarTimes',
      icon: Tv,
      gradient: 'from-purple-500/15 to-pink-500/10 text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-500/20 text-purple-600 dark:text-purple-400',
      badge: 'Auto-active',
      badgeColor: 'bg-purple-500/15 text-purple-700 dark:text-purple-300'
    },
  ];

  return (
    <div className="space-y-7 w-full max-w-full overflow-x-hidden">
      
      {/* ── Top Balance & Virtual Bank Showcase ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        
        {/* Main Wallet Balance Card (8 cols on large screens) */}
        <div className="lg:col-span-8 rounded-3xl bg-gradient-to-br from-slate-950 via-[#0d1728] to-emerald-950 text-white p-6 sm:p-8 relative overflow-hidden shadow-xl flex flex-col justify-between min-h-[220px]">
          {/* Ambient Lighting Orbs */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative space-y-4">
            {/* Card Header Row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <WalletIcon className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Primary Spending Wallet</span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-slate-300 transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
                  title={showBalance ? 'Hide balance' : 'Show balance'}
                >
                  {showBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline text-[11px]">{showBalance ? 'Hide' : 'Show'}</span>
                </button>
                <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Tier 2 Verified
                </span>
              </div>
            </div>

            {/* Live Balance Display */}
            <div>
              <div className="font-display text-4xl sm:text-5xl font-black text-white tracking-tight flex items-baseline gap-2">
                {showBalance ? formatNaira(wallet?.availableBalance || 0) : '₦••••••••'}
              </div>
              <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ready for instant airtime, high-speed data, disco tokens & TV renewals</span>
              </p>
            </div>
          </div>

          {/* Action Button Row */}
          <div className="relative mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-3">
            <button
              id="dash-fund-wallet-btn"
              onClick={() => setIsFundOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-extrabold text-xs transition-all shadow-lg shadow-emerald-500/25 hover:scale-[1.02] cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" /> 
              <span>Fund Wallet</span>
            </button>
            <button
              onClick={() => setActiveView('transactions')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs transition-colors cursor-pointer border border-white/10"
            >
              <History className="w-4 h-4" /> 
              <span>View Statements</span>
            </button>
          </div>
        </div>

        {/* Dedicated Virtual Bank Card (4 cols on large screens) */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-[#0f172a] p-6 sm:p-7 border border-slate-200/80 dark:border-white/5 shadow-md flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Dedicated Bank Inward</span>
            </div>
            <h4 className="text-base font-bold font-display text-slate-900 dark:text-white">Direct Transfer Deposit</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Transfer to this dedicated account from GTBank, Access, Zenith, OPay, Kuda, or any bank for instant auto-credit.
            </p>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200/80 dark:border-white/5 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Bank Name:</span>
              <span className="font-bold text-slate-900 dark:text-white">{wallet?.virtualBankName || 'Wema Bank'}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium block">Account Number:</span>
              <div className="flex items-center justify-between mt-1 gap-2">
                <span className="font-mono text-xl font-black tracking-widest text-emerald-600 dark:text-emerald-400 truncate">
                  {wallet?.virtualAccountNumber || '9018472910'}
                </span>
                <button
                  id="dash-copy-acct-btn"
                  onClick={handleCopyAccount}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Utility Services Grid ─────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Quick Payment Services
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Instant fulfillment</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
          {quickServices.map((service) => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                id={`quick-action-${service.id}`}
                onClick={() => setActiveView(service.id as any)}
                className="group p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/5 hover:border-emerald-500/40 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all text-left cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${service.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${service.badgeColor}`}>
                      {service.badge}
                    </span>
                  </div>
                  <h4 className="font-bold font-display text-slate-900 dark:text-white text-sm sm:text-base">
                    {service.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {service.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>Recharge</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Two Column Row: Transactions & Beneficiaries ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6">
        
        {/* Recent Transactions (8 cols) */}
        <div className="lg:col-span-8 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/5 shadow-md overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">Recent Transactions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Latest top-ups and bill payments processed on your account</p>
            </div>
            <button
              onClick={() => setActiveView('transactions')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-white/5">
            {recentTransactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No transactions yet. Click any quick service above to start.
              </div>
            ) : (
              recentTransactions.map((tx) => (
                <div 
                  key={tx.id} 
                  onClick={() => setSelectedReceiptTx(tx)}
                  className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer group gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <ServiceIcon serviceType={tx.serviceType} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                        {tx.description}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                        <span>{formatDateTime(tx.createdAt)}</span>
                        <span>•</span>
                        <span className="font-mono truncate max-w-[150px]">{tx.recipient}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-1 shrink-0">
                    <div className="font-display font-black text-sm sm:text-base text-slate-900 dark:text-white">
                      {formatNaira(tx.totalPaid)}
                    </div>
                    <StatusBadge status={tx.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Beneficiaries (4 cols) */}
        <div className="lg:col-span-4 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200/80 dark:border-white/5 p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" />
                <h3 className="text-base font-bold font-display text-slate-900 dark:text-white">Beneficiaries</h3>
              </div>
              <button
                onClick={() => setActiveView('beneficiaries')}
                className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {beneficiaries.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    if (b.type === 'phone') setActiveView('airtime');
                    else if (b.type === 'meter') setActiveView('electricity');
                    else setActiveView('cable');
                  }}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all flex items-center justify-between cursor-pointer gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-xs">
                      {b.type === 'phone' && <Smartphone className="w-4 h-4 text-emerald-500" />}
                      {b.type === 'meter' && <Zap className="w-4 h-4 text-amber-500" />}
                      {b.type === 'smartcard' && <Tv className="w-4 h-4 text-purple-500" />}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate">{b.name}</h5>
                      <span className="text-[11px] font-mono text-slate-500 truncate block">{b.accountIdentifier}</span>
                    </div>
                  </div>
                  <ProviderBadge provider={b.provider} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveView('beneficiaries')}
            className="w-full mt-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs transition-colors cursor-pointer"
          >
            + Add New Beneficiary
          </button>
        </div>
      </div>

      <FundWalletModal isOpen={isFundOpen} onClose={() => setIsFundOpen(false)} />
      {selectedReceiptTx && (
        <ReceiptModal
          transaction={selectedReceiptTx}
          onClose={() => setSelectedReceiptTx(null)}
        />
      )}
    </div>
  );
};


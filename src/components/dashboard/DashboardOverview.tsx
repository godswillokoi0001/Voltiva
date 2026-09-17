import React, { useState } from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Smartphone, 
  Wifi, 
  Zap, 
  Tv, 
  Users, 
  History, 
  CheckCircle2, 
  FileText,
  Copy,
  Check,
  Building2,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { formatNaira, formatDateTime } from '../../utils/formatters';
import { StatusBadge, ProviderBadge, ServiceIcon } from '../common/Badges';
import { FundWalletModal } from '../wallet/FundWalletModal';
import { ReceiptModal } from '../common/ReceiptModal';

export const DashboardOverview: React.FC = () => {
  const { wallet, transactions, beneficiaries, setActiveView, selectedReceiptTx, setSelectedReceiptTx } = useApp();
  const [isFundOpen, setIsFundOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const recentTransactions = transactions.slice(0, 5);

  const handleCopyAccount = () => {
    if (wallet?.virtualAccountNumber) {
      navigator.clipboard.writeText(wallet.virtualAccountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden">
      {/* Wallet Balance Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        {/* Main Balance Canvas */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:col-span-2 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/90 text-white border border-slate-800/80 rounded-3xl p-6 md:p-8 relative overflow-hidden flex flex-col justify-between shadow-lg"
        >
          {/* Subtle Ambient Accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <WalletIcon className="w-4 h-4 text-emerald-400" />
                <span>Primary Spending Wallet</span>
              </div>
              <span className="text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                Active & Tier 2 Verified
              </span>
            </div>

            <div className="mt-4">
              <div className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight break-all">
                {formatNaira(wallet?.availableBalance || 0)}
              </div>
              <p className="text-xs text-slate-300 mt-1.5 max-w-md">
                Available for instant airtime, high-speed data, disco electricity, and TV bouquet renewal.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
            <motion.button
              id="dash-fund-wallet-btn"
              onClick={() => setIsFundOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4 stroke-[2.5]" /> Fund Wallet
            </motion.button>
            <motion.button
              onClick={() => setActiveView('transactions')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700/80 transition-colors cursor-pointer"
            >
              <History className="w-4 h-4" /> View Statements
            </motion.button>
          </div>
        </motion.div>

        {/* Dedicated Account Quick Box */}
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.08 }}
          className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 flex flex-col justify-between shadow-xs transition-colors duration-200"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              <Building2 className="w-4 h-4" /> Dedicated Virtual Bank
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Direct Transfer Deposit</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Transfer to this dedicated account from any Nigerian mobile bank app for instant auto-credit.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 mt-4">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Bank:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{wallet?.virtualBankName || 'Wema Bank'}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Account Number:</span>
              <div className="flex items-center justify-between mt-0.5 gap-2">
                <span className="font-mono text-lg font-bold tracking-wider text-emerald-600 dark:text-emerald-400 truncate">
                  {wallet?.virtualAccountNumber || '9018472910'}
                </span>
                <button
                  id="dash-copy-acct-btn"
                  onClick={handleCopyAccount}
                  className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Action Ecosystem Grid */}
      <div>
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Quick Payment Services</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          <motion.button
            id="quick-action-airtime"
            onClick={() => setActiveView('airtime')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-all text-left group cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-3">Buy Airtime</h4>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">2% Instant Cashback</p>
          </motion.button>

          <motion.button
            id="quick-action-data"
            onClick={() => setActiveView('data')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-all text-left group cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Wifi className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-3">Buy Data</h4>
            <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">SME & Direct Bundles</p>
          </motion.button>

          <motion.button
            id="quick-action-electricity"
            onClick={() => setActiveView('electricity')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-all text-left group cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-3">Pay Electricity</h4>
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">Instant Prepaid STS Token</p>
          </motion.button>

          <motion.button
            id="quick-action-cable"
            onClick={() => setActiveView('cable')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:bg-slate-50 dark:hover:bg-slate-900/80 transition-all text-left group cursor-pointer shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Tv className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-3">Cable TV</h4>
            <p className="text-xs text-purple-600 dark:text-purple-400 font-semibold mt-0.5">DStv, GOtv & StarTimes</p>
          </motion.button>
        </div>
      </div>

      {/* Two Column Layout: Recent Transactions + Frequent Beneficiaries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
        {/* Recent Transactions List */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs transition-colors duration-200">
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Latest debits and top-ups processed on your account</p>
            </div>
            <button
              onClick={() => setActiveView('transactions')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {recentTransactions.map((tx) => (
              <div 
                key={tx.id} 
                onClick={() => setSelectedReceiptTx(tx)}
                className="p-3.5 sm:p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <ServiceIcon serviceType={tx.serviceType} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                      {tx.description}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 font-mono flex-wrap">
                      <span>{formatDateTime(tx.createdAt)}</span>
                      <span>•</span>
                      <span className="truncate max-w-[140px]">{tx.recipient}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1 shrink-0">
                  <div className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                    {formatNaira(tx.totalPaid)}
                  </div>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Beneficiaries Quick Access */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-xs transition-colors duration-200">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span>Quick Beneficiaries</span>
              </h3>
              <button
                onClick={() => setActiveView('beneficiaries')}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold cursor-pointer"
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
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 hover:border-emerald-500/40 transition-all flex items-center justify-between cursor-pointer gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0">
                      {b.type === 'phone' && <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />}
                      {b.type === 'meter' && <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />}
                      {b.type === 'smartcard' && <Tv className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate">{b.name}</h5>
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 truncate block">{b.accountIdentifier}</span>
                    </div>
                  </div>
                  <ProviderBadge provider={b.provider} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveView('beneficiaries')}
            className="w-full mt-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors cursor-pointer"
          >
            Add New Beneficiary
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

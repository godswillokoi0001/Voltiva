import React, { useState } from 'react';
import { 
  Wallet as WalletIcon, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Building2, 
  Copy, 
  Check, 
  ShieldCheck, 
  CreditCard,
  History,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNaira, formatDateTime } from '../../utils/formatters';
import { FundWalletModal } from './FundWalletModal';
import { StatusBadge, ServiceIcon } from '../common/Badges';

export const WalletView: React.FC = () => {
  const { wallet, transactions, setSelectedReceiptTx } = useApp();
  const [isFundOpen, setIsFundOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const walletFundingTransactions = transactions.filter(t => t.serviceType === 'wallet_funding');

  const handleCopy = () => {
    if (wallet?.virtualAccountNumber) {
      navigator.clipboard.writeText(wallet.virtualAccountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white">Wallet & Balances</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Manage your central Voltiva wallet, bank transfer channels, and funding history.</p>
        </div>
        <button
          id="wallet-fund-top-btn"
          onClick={() => setIsFundOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors self-start sm:self-auto cursor-pointer shadow-lg shadow-emerald-500/10"
        >
          <ArrowDownLeft className="w-4 h-4" /> Fund Wallet
        </button>
      </div>

      {/* Balances Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Available Balance */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 relative overflow-hidden shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Available Balance</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <WalletIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 font-display text-3xl font-extrabold text-slate-900 dark:text-white">
            {formatNaira(wallet?.availableBalance || 0)}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Ready for instant bill settlement</span>
          </div>
        </div>

        {/* Pending Ledger */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Balance</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 font-display text-3xl font-bold text-slate-800 dark:text-slate-300">
            {formatNaira(wallet?.pendingBalance || 0)}
          </div>
          <p className="mt-4 text-xs text-slate-500">Unsettled transfers or reversals</p>
        </div>

        {/* Daily Tier Limit */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Daily Spending Limit</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 font-display text-3xl font-bold text-slate-800 dark:text-slate-300">
            {formatNaira(wallet?.dailyTransactionLimit || 500000, false)}
          </div>
          <p className="mt-4 text-xs text-slate-500">Tier 2 KYC Account Verified</p>
        </div>
      </div>

      {/* Virtual Dedicated Account Card */}
      <div className="bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-[#0f172a] dark:to-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" /> Dedicated Virtual Bank Account
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Instant Automated Bank Inward</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every deposit sent to this Wema account from GTBank, Access, Zenith, OPay, Moniepoint, or any Nigerian bank will automatically fund your Voltiva balance in under 5 seconds.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 space-y-2 min-w-[280px] shadow-xs">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Bank:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{wallet?.virtualBankName || 'Wema Bank'}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Account Name:</span>
              <span className="font-mono text-slate-700 dark:text-slate-200">{wallet?.accountName || 'VOLTIVA / TUNDE ADELEKE'}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-mono text-xl font-black tracking-widest text-emerald-600 dark:text-emerald-400">
                {wallet?.virtualAccountNumber || '9018472910'}
              </span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs text-slate-700 dark:text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Funding Activity History */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Wallet Inward Deposits</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">{walletFundingTransactions.length} records</span>
        </div>

        {walletFundingTransactions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 dark:text-slate-400">
            No deposits logged yet. Click "Fund Wallet" to add funds.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {walletFundingTransactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <ArrowDownLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{tx.description}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">{formatDateTime(tx.createdAt)}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <div className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                    +{formatNaira(tx.amount)}
                  </div>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <FundWalletModal isOpen={isFundOpen} onClose={() => setIsFundOpen(false)} />
    </div>
  );
};

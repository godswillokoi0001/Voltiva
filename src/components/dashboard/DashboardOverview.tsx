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
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { formatNaira, formatDateTime } from '../../utils/formatters';
import { StatusBadge, ProviderBadge, ServiceIcon } from '../common/Badges';
import { FundWalletModal } from '../wallet/FundWalletModal';
import { ReceiptModal } from '../common/ReceiptModal';

// Quick-action service definitions — electricity gets amber, rest get charge-green.
// Color encodes category, not decoration.
const QUICK_ACTIONS = [
  {
    id: 'airtime',
    label: 'Buy Airtime',
    sub: '2% instant cashback',
    icon: Smartphone,
    iconColor: 'text-[--volt-charge]',
    iconBg: 'bg-[--volt-charge]/10',
    borderHover: 'hover:border-[--volt-charge]/40',
  },
  {
    id: 'data',
    label: 'Buy Data',
    sub: 'SME & direct bundles',
    icon: Wifi,
    iconColor: 'text-[--volt-charge]',
    iconBg: 'bg-[--volt-charge]/10',
    borderHover: 'hover:border-[--volt-charge]/40',
  },
  {
    id: 'electricity',
    label: 'Pay Electricity',
    sub: 'Instant prepaid token',
    icon: Zap,
    iconColor: 'text-[--volt-amber]',
    iconBg: 'bg-[--volt-amber]/10',
    borderHover: 'hover:border-[--volt-amber]/40',
  },
  {
    id: 'cable',
    label: 'Cable TV',
    sub: 'DStv, GOtv & StarTimes',
    icon: Tv,
    iconColor: 'text-[--volt-charge]',
    iconBg: 'bg-[--volt-charge]/10',
    borderHover: 'hover:border-[--volt-charge]/40',
  },
] as const;

// Single orchestrated load sequence for the dashboard.
// Staggered at mount once — no hover-lift on every card.
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.04 }
  }
};
const itemVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }
};

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5 w-full max-w-full overflow-x-hidden"
    >
      {/* ── Wallet + Virtual Account ─────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Balance — the number is the hero, no gradient decorations */}
        <div className="lg:col-span-2 bg-[#0d1117] text-white rounded-xl p-6 md:p-7 flex flex-col justify-between min-h-[180px] relative overflow-hidden">
          {/* Subtle ambient: a single right-edge wash tied to the charge color */}
          <div className="absolute inset-y-0 right-0 w-[40%] bg-gradient-to-l from-[--volt-charge]/5 to-transparent pointer-events-none" />

          <div className="relative">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-3">
              <WalletIcon className="w-3.5 h-3.5 text-[--volt-charge]" />
              <span>Primary spending wallet</span>
              <span className="ml-auto text-[11px] font-bold bg-[--volt-charge]/20 text-[--volt-charge] border border-[--volt-charge]/30 px-2 py-0.5 rounded-full">
                Active · Tier 2
              </span>
            </div>
            <div className="font-display text-[2.5rem] sm:text-[3rem] font-black text-white tracking-tight leading-none break-all">
              {formatNaira(wallet?.availableBalance || 0)}
            </div>
            <p className="text-[0.8125rem] text-slate-400 mt-2 leading-relaxed max-w-[45ch]">
              Available for airtime, data, electricity tokens, and cable subscriptions.
            </p>
          </div>

          <div className="relative mt-5 pt-5 border-t border-white/10 flex flex-wrap gap-2">
            <button
              id="dash-fund-wallet-btn"
              onClick={() => setIsFundOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-[--volt-charge] hover:opacity-90 text-[#0d1117] font-bold text-[13px] transition-opacity cursor-pointer"
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              Fund Wallet
            </button>
            <button
              onClick={() => setActiveView('transactions')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-[13px] transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              Statements
            </button>
          </div>
        </div>

        {/* Virtual Account */}
        <div className="bg-[--volt-panel] dark:bg-[#1a2234] border border-[--volt-line] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[--volt-charge] mb-2">
              <Building2 className="w-3.5 h-3.5" />
              Dedicated Virtual Bank
            </div>
            <h4 className="text-[0.875rem] font-bold text-[--volt-text] mb-1">Direct Transfer Deposit</h4>
            <p className="text-[0.8125rem] text-[--volt-subtext] leading-relaxed">
              Transfer from any Nigerian bank app — balance lands instantly.
            </p>
          </div>

          <div className="mt-4 p-4 rounded-lg bg-[--volt-surface] dark:bg-[#0d1117]/60 border border-[--volt-line] space-y-3">
            <div className="flex justify-between text-[13px]">
              <span className="text-[--volt-muted]">Bank</span>
              <span className="font-semibold text-[--volt-text]">{wallet?.virtualBankName || 'Wema Bank'}</span>
            </div>
            <div>
              <p className="text-[11px] text-[--volt-muted] mb-1">Account number</p>
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-[1.25rem] font-bold tracking-wider text-[--volt-charge]">
                  {wallet?.virtualAccountNumber || '9018472910'}
                </span>
                <button
                  id="dash-copy-acct-btn"
                  onClick={handleCopyAccount}
                  className="px-2.5 py-1 rounded-md bg-[--volt-line] hover:bg-[--volt-muted]/30 text-[13px] font-medium text-[--volt-muted] hover:text-[--volt-text] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-3 h-3 text-[--volt-charge]" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants}>
        <h3 className="text-[12px] font-bold text-[--volt-muted] uppercase tracking-wide mb-3">Payment services</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ id, label, sub, icon: Icon, iconColor, iconBg, borderHover }) => (
            <button
              key={id}
              id={`quick-action-${id}`}
              onClick={() => setActiveView(id as any)}
              className={`p-4 rounded-lg bg-[--volt-panel] dark:bg-[#1a2234] border border-[--volt-line] ${borderHover} text-left cursor-pointer transition-colors`}
            >
              <div className={`w-9 h-9 rounded-md ${iconBg} ${iconColor} flex items-center justify-center mb-3`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
              <h4 className="font-bold text-[--volt-text] text-[0.875rem] leading-snug">{label}</h4>
              <p className={`text-[12px] font-semibold mt-0.5 ${iconColor}`}>{sub}</p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Transactions + Beneficiaries ─────────────────────────────────── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Recent Transactions */}
        <div className="lg:col-span-2 bg-[--volt-panel] dark:bg-[#1a2234] border border-[--volt-line] rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[--volt-line] flex items-center justify-between">
            <div>
              <h3 className="text-[0.875rem] font-bold text-[--volt-text]">Recent transactions</h3>
              <p className="text-[12px] text-[--volt-muted] mt-0.5">Latest debits and top-ups on your account</p>
            </div>
            <button
              onClick={() => setActiveView('transactions')}
              className="text-[13px] text-[--volt-charge] hover:underline underline-offset-2 font-semibold flex items-center gap-1 cursor-pointer"
            >
              View all
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[--volt-line]">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedReceiptTx(tx)}
                className="px-4 py-3.5 flex items-center justify-between hover:bg-[--volt-surface] dark:hover:bg-[#111827]/60 transition-colors cursor-pointer gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[--volt-surface] dark:bg-[#0d1117]/60 flex items-center justify-center shrink-0">
                    <ServiceIcon serviceType={tx.serviceType} />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-semibold text-[--volt-text] truncate leading-snug">
                      {tx.description}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[--volt-muted] flex-wrap">
                      <span>{formatDateTime(tx.createdAt)}</span>
                      <span className="text-[--volt-line] dark:text-[#1e2d3d]">·</span>
                      <span className="truncate max-w-[130px]">{tx.recipient}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right space-y-1 shrink-0">
                  <div className="font-display font-bold text-[0.875rem] text-[--volt-text]">
                    {formatNaira(tx.totalPaid)}
                  </div>
                  <StatusBadge status={tx.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Saved Beneficiaries */}
        <div className="bg-[--volt-panel] dark:bg-[#1a2234] border border-[--volt-line] rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[0.875rem] font-bold text-[--volt-text] flex items-center gap-2">
                <Users className="w-4 h-4 text-[--volt-charge]" />
                Quick beneficiaries
              </h3>
              <button
                onClick={() => setActiveView('beneficiaries')}
                className="text-[12px] text-[--volt-charge] hover:underline underline-offset-2 font-semibold cursor-pointer"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2">
              {beneficiaries.slice(0, 4).map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    if (b.type === 'phone') setActiveView('airtime');
                    else if (b.type === 'meter') setActiveView('electricity');
                    else setActiveView('cable');
                  }}
                  className="p-3 rounded-lg bg-[--volt-surface] dark:bg-[#0d1117]/60 border border-[--volt-line] hover:border-[--volt-charge]/30 transition-colors flex items-center justify-between cursor-pointer gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-[--volt-line] dark:bg-[#1e2d3d] flex items-center justify-center shrink-0">
                      {b.type === 'phone'     && <Smartphone className="w-3.5 h-3.5 text-[--volt-charge]" />}
                      {b.type === 'meter'     && <Zap        className="w-3.5 h-3.5 text-[--volt-amber]" />}
                      {b.type === 'smartcard' && <Tv         className="w-3.5 h-3.5 text-[--volt-charge]" />}
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-[13px] font-semibold text-[--volt-text] truncate leading-snug">{b.name}</h5>
                      <span className="text-[11px] text-[--volt-muted] truncate block">{b.accountIdentifier}</span>
                    </div>
                  </div>
                  <ProviderBadge provider={b.provider} />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveView('beneficiaries')}
            className="w-full mt-4 py-2.5 rounded-lg border border-[--volt-line] bg-[--volt-surface] dark:bg-[#0d1117]/40 hover:bg-[--volt-line] text-[--volt-text] font-semibold text-[13px] transition-colors cursor-pointer"
          >
            Add beneficiary
          </button>
        </div>
      </motion.div>

      <FundWalletModal isOpen={isFundOpen} onClose={() => setIsFundOpen(false)} />
      {selectedReceiptTx && (
        <ReceiptModal
          transaction={selectedReceiptTx}
          onClose={() => setSelectedReceiptTx(null)}
        />
      )}
    </motion.div>
  );
};

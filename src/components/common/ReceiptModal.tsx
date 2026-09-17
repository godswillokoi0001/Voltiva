import React from 'react';
import { 
  Download, 
  Share2, 
  X, 
  CheckCircle, 
  ShieldCheck, 
  Copy, 
  Zap, 
  FileText 
} from 'lucide-react';
import { Transaction } from '../../types';
import { formatNaira, formatDateTime } from '../../utils/formatters';
import { StatusBadge, ProviderBadge } from './Badges';

interface ReceiptModalProps {
  transaction: Transaction | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ transaction, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!transaction) return null;

  const copyToken = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div id="receipt-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        id="receipt-modal-container" 
        className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100 my-8"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">Official Electronic Receipt</span>
          </div>
          <button 
            id="receipt-close-btn"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 md:p-8 space-y-6">
          {/* Brand Logo & Tag */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center font-black text-slate-950 font-display text-lg">
                  V
                </div>
                <span className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Voltiva</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Everyday payments, made effortless.</p>
            </div>
            <div className="text-right">
              <StatusBadge status={transaction.status} />
              <p className="text-xs text-slate-500 mt-1 font-mono">{formatDateTime(transaction.createdAt)}</p>
            </div>
          </div>

          {/* Amount Box */}
          <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center space-y-1 shadow-xs">
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400">Total Amount Paid</span>
            <div className="text-3xl font-display font-extrabold text-slate-900 dark:text-white">
              {formatNaira(transaction.totalPaid)}
            </div>
            {transaction.discount > 0 && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                Included instant cashback savings: -{formatNaira(transaction.discount)}
              </p>
            )}
          </div>

          {/* Electricity Token Highlight (If Applicable) */}
          {transaction.token && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" /> STS Prepaid Electricity Token
                </span>
                <button 
                  onClick={() => copyToken(transaction.token!)}
                  className="text-xs text-amber-600 dark:text-amber-300 hover:text-amber-700 dark:hover:text-amber-100 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <Copy className="w-3 h-3" /> {copied ? 'Copied!' : 'Copy Token'}
                </button>
              </div>
              <div className="font-mono text-xl font-bold tracking-widest text-slate-900 dark:text-white mt-1 text-center py-2 bg-slate-100 dark:bg-black/40 rounded-lg select-all border border-amber-500/20">
                {transaction.token}
              </div>
              {transaction.units && (
                <p className="text-xs text-slate-600 dark:text-slate-300 text-center mt-1 font-medium">Estimated Units: {transaction.units}</p>
              )}
            </div>
          )}

          {/* Transaction Metadata Grid */}
          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800/80 text-sm">
            <div className="flex justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400">Service / Product</span>
              <span className="font-medium text-slate-900 dark:text-white capitalize">{transaction.serviceType.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400">Provider</span>
              <ProviderBadge provider={transaction.provider} />
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400">Recipient Account / Phone</span>
              <span className="font-mono font-medium text-slate-700 dark:text-slate-200">{transaction.recipient}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400">Transaction Reference</span>
              <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{transaction.reference}</span>
            </div>
            {transaction.providerReference && (
              <div className="flex justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400">Provider Ref / Session ID</span>
                <span className="font-mono text-xs text-slate-600 dark:text-slate-300">{transaction.providerReference}</span>
              </div>
            )}
            <div className="flex justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400">Payment Channel</span>
              <span className="font-medium text-slate-700 dark:text-slate-200 capitalize">{transaction.paymentMethod.replace('_', ' ')}</span>
            </div>
            {transaction.fee > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-slate-500 dark:text-slate-400">Service Fee</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{formatNaira(transaction.fee)}</span>
              </div>
            )}
          </div>

          {/* Support Guarantee Footer */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Verified & Guaranteed by Voltiva</span>
            </div>
            <span>Support: help@voltiva.ng</span>
          </div>
        </div>

        {/* Action Buttons (Print / Share) */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3 no-print">
          <button
            id="receipt-print-btn"
            onClick={printReceipt}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium text-sm transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download / Print
          </button>
          <button
            id="receipt-share-btn"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `Voltiva Receipt - ${transaction.reference}`,
                  text: `Payment Receipt: ${formatNaira(transaction.totalPaid)} for ${transaction.description}`,
                  url: window.location.href,
                }).catch(() => {});
              } else {
                navigator.clipboard.writeText(`Voltiva Receipt: ${transaction.reference} | ${transaction.description} | ${formatNaira(transaction.totalPaid)}`);
                alert('Receipt details copied to clipboard');
              }
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors cursor-pointer shadow-xs"
          >
            <Share2 className="w-4 h-4" /> Share Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

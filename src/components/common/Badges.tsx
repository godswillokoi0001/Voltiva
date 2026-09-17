import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RefreshCw, 
  Smartphone, 
  Wifi, 
  Zap, 
  Tv, 
  Wallet, 
  ArrowDownLeft 
} from 'lucide-react';
import { TransactionStatus, VTUServiceType } from '../../types';

export const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
  switch (status) {
    case 'successful':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          Successful
        </span>
      );
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
          <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          Pending
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30">
          <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
          Failed
        </span>
      );
    case 'reversed':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
          <RefreshCw className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
          Reversed
        </span>
      );
    default:
      return null;
  }
};

export const ServiceIcon: React.FC<{ serviceType: VTUServiceType | 'wallet_funding' | 'wallet_transfer'; className?: string }> = ({ serviceType, className = "w-4 h-4" }) => {
  switch (serviceType) {
    case 'airtime':
      return <Smartphone className={`${className} text-emerald-400`} />;
    case 'data':
      return <Wifi className={`${className} text-blue-400`} />;
    case 'electricity':
      return <Zap className={`${className} text-amber-400`} />;
    case 'cable':
      return <Tv className={`${className} text-purple-400`} />;
    case 'wallet_funding':
      return <ArrowDownLeft className={`${className} text-teal-400`} />;
    default:
      return <Wallet className={`${className} text-slate-400`} />;
  }
};

export const ProviderBadge: React.FC<{ provider: string }> = ({ provider }) => {
  const p = provider.toUpperCase();
  let bg = 'bg-slate-800 text-slate-200 border-slate-700';

  if (p === 'MTN') bg = 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30';
  else if (p === 'AIRTEL') bg = 'bg-red-500/15 text-red-400 border-red-500/30';
  else if (p === 'GLO') bg = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  else if (p === '9MOBILE') bg = 'bg-lime-500/15 text-lime-400 border-lime-500/30';
  else if (p.includes('DSTV') || p.includes('GOTV')) bg = 'bg-sky-500/15 text-sky-400 border-sky-500/30';
  else if (p.includes('EDC') || p.includes('ELECTRIC')) bg = 'bg-amber-500/15 text-amber-400 border-amber-500/30';

  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wider border ${bg}`}>
      {provider}
    </span>
  );
};

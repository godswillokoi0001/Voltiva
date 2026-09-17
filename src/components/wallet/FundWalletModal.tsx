import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  CreditCard, 
  Building2, 
  Copy, 
  Check, 
  ShieldCheck, 
  X, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatNaira } from '../../utils/formatters';

interface FundWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FundWalletModal: React.FC<FundWalletModalProps> = ({ isOpen, onClose }) => {
  const { wallet, fundWallet } = useApp();
  const [method, setMethod] = useState<'card_paystack' | 'flutterwave' | 'bank_transfer'>('bank_transfer');
  const [amount, setAmount] = useState<string>('5000');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const quickAmounts = [1000, 2000, 5000, 10000, 20000, 50000];

  const handleCopyAccount = () => {
    if (wallet?.virtualAccountNumber) {
      navigator.clipboard.writeText(wallet.virtualAccountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFundSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 100) {
      setError('Minimum funding amount is ₦100');
      return;
    }

    if (method === 'bank_transfer') {
      // Bank transfer is manual via their banking app, simulate confirmation
      setIsProcessing(true);
      setTimeout(async () => {
        await fundWallet(numAmount, 'bank_transfer');
        setIsProcessing(false);
        onClose();
      }, 1200);
      return;
    }

    setIsProcessing(true);
    try {
      await fundWallet(numAmount, method);
      setIsProcessing(false);
      onClose();
    } catch {
      setIsProcessing(false);
      setError('Payment gateway timeout. Please retry or use Bank Transfer.');
    }
  };

  return (
    <div id="fund-wallet-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div 
        id="fund-wallet-dialog"
        className="relative w-full max-w-lg bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 md:p-8 text-slate-900 dark:text-slate-100"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Fund Wallet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Add money securely to your Voltiva balance</p>
          </div>
          <button 
            id="fund-modal-close"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Method Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 mt-5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <button
            id="method-bank-transfer"
            type="button"
            onClick={() => setMethod('bank_transfer')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              method === 'bank_transfer'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" /> Dedicated Virtual Bank
          </button>
          <button
            id="method-card-paystack"
            type="button"
            onClick={() => setMethod('card_paystack')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              method === 'card_paystack'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" /> Debit Card / Paystack
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {method === 'bank_transfer' ? (
          <div className="mt-6 space-y-5">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-emerald-500/30 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">Automated Inward Account</span>
                <span className="text-[11px] font-semibold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">Instant Credit</span>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Bank Name</p>
                <p className="font-semibold text-slate-900 dark:text-white">{wallet?.virtualBankName || 'Wema Bank'}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Account Number</p>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono text-xl font-bold tracking-widest text-emerald-600 dark:text-emerald-400">{wallet?.virtualAccountNumber || '9018472910'}</span>
                  <button
                    id="copy-virtual-account-btn"
                    onClick={handleCopyAccount}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Beneficiary Name</p>
                <p className="text-xs font-mono font-medium text-slate-700 dark:text-slate-300">{wallet?.accountName || 'VOLTIVA / USER'}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Transfer funds from any Nigerian banking app to this dedicated account. Your Voltiva wallet balance will be credited automatically within seconds.
            </p>

            <form onSubmit={handleFundSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Or simulate test deposit amount (₦)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono text-lg focus:outline-none focus:border-emerald-500"
                  min="100"
                  placeholder="5000"
                  required
                />
              </div>

              <button
                id="confirm-test-transfer-btn"
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                {isProcessing ? 'Verifying incoming deposit...' : 'Confirm Test Inward Transfer'}
              </button>
            </form>
          </div>
        ) : (
          <form onSubmit={handleFundSubmit} className="mt-6 space-y-5">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">Enter Amount (₦)</label>
              <input
                id="fund-amount-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono text-lg focus:outline-none focus:border-emerald-500"
                min="100"
                placeholder="5000"
                required
              />
            </div>

            {/* Quick Amount Chips */}
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mb-2 block">Quick Top-up Suggestions</span>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAmount(q.toString())}
                    className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      amount === q.toString()
                        ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {formatNaira(q, false)}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Zero transaction fees on wallet deposits. Secured by 256-bit TLS bank-grade encryption.</span>
            </div>

            <button
              id="proceed-paystack-btn"
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
              {isProcessing ? 'Connecting to Gateway...' : `Proceed to Pay ${formatNaira(parseFloat(amount) || 0)}`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Smartphone, 
  Check, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Users, 
  ShieldCheck, 
  Sparkles,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NetworkProvider, Beneficiary } from '../../types';
import { formatNaira, validateNigerianPhone } from '../../utils/formatters';
import { ReceiptModal } from '../common/ReceiptModal';
import confetti from 'canvas-confetti';

const NETWORKS: { id: NetworkProvider; name: string; discount: string; color: string; badge: string }[] = [
  { id: 'MTN', name: 'MTN NG', discount: '2% Cashback', color: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300', badge: 'bg-yellow-400 text-slate-950' },
  { id: 'AIRTEL', name: 'Airtel', discount: '2% Cashback', color: 'border-red-500/50 bg-red-500/10 text-red-400', badge: 'bg-red-500 text-white' },
  { id: 'GLO', name: 'Glo Mobile', discount: '3% Cashback', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400', badge: 'bg-emerald-500 text-slate-950' },
  { id: '9MOBILE', name: '9mobile', discount: '2.5% Cashback', color: 'border-lime-500/50 bg-lime-500/10 text-lime-400', badge: 'bg-lime-500 text-slate-950' },
];

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export const AirtimePurchase: React.FC = () => {
  const { wallet, executeVTUPurchase, beneficiaries, selectedReceiptTx, setSelectedReceiptTx } = useApp();

  const [network, setNetwork] = useState<NetworkProvider>('MTN');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('1000');
  const [transactionPin, setTransactionPin] = useState<string>('1234');
  const [saveBeneficiary, setSaveBeneficiary] = useState<boolean>(false);
  const [beneficiaryName, setBeneficiaryName] = useState<string>('');
  
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const phoneBeneficiaries = beneficiaries.filter(b => b.type === 'phone');

  const handleSelectBeneficiary = (b: Beneficiary) => {
    setPhoneNumber(b.accountIdentifier);
    if (['MTN', 'AIRTEL', 'GLO', '9MOBILE'].includes(b.provider.toUpperCase())) {
      setNetwork(b.provider.toUpperCase() as NetworkProvider);
    }
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateNigerianPhone(phoneNumber)) {
      setError('Please enter a valid 11-digit Nigerian phone number (e.g. 08149823411).');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 50 || numAmount > 100000) {
      setError('Airtime amount must be between ₦50 and ₦100,000.');
      return;
    }

    const discountAmount = Math.round(numAmount * 0.02);
    const payable = numAmount - discountAmount;

    if (wallet && wallet.availableBalance < payable) {
      setError(`Insufficient wallet balance. You have ${formatNaira(wallet.availableBalance)}, but need ${formatNaira(payable)}.`);
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmPurchase = async () => {
    setError(null);
    setIsProcessing(true);

    const numAmount = parseFloat(amount);
    const result = await executeVTUPurchase({
      serviceType: 'airtime',
      provider: network,
      recipient: phoneNumber,
      amount: numAmount,
      transactionPin,
      saveAsBeneficiary: saveBeneficiary,
      beneficiaryName: beneficiaryName || `${network} ${phoneNumber.slice(-4)}`,
    });

    setIsProcessing(false);
    if (result.success && result.transaction) {
      setShowConfirm(false);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
      setSelectedReceiptTx(result.transaction);
    } else {
      setError(result.error || 'Transaction failed. Please check details and try again.');
    }
  };

  const numAmount = parseFloat(amount) || 0;
  const cashbackDiscount = Math.round(numAmount * 0.02);
  const totalPayable = Math.max(0, numAmount - cashbackDiscount);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-xs uppercase tracking-wider">
            <Smartphone className="w-4 h-4" />
            <span>Virtual Top-Up Service</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VTpass Gateway Active</span>
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">Buy Instant Airtime</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Recharge any Nigerian network with instant 2% cashback discount via VTpass.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
        <form onSubmit={handlePreSubmit} className="space-y-6">
          {/* Network Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
              Select Mobile Network
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {NETWORKS.map((n) => (
                <button
                  id={`select-network-${n.id.toLowerCase()}`}
                  key={n.id}
                  type="button"
                  onClick={() => setNetwork(n.id)}
                  className={`relative p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    network === n.id
                      ? `${n.color} ring-2 ring-emerald-500/40 font-bold shadow-xs`
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-semibold">{n.name}</span>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">{n.discount}</span>
                  {network === n.id && (
                    <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Beneficiaries Quick Pick */}
          {phoneBeneficiaries.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Saved Beneficiaries</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {phoneBeneficiaries.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectBeneficiary(b)}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">{b.name}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">{b.accountIdentifier}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Recipient Phone Number
            </label>
            <div className="relative">
              <input
                id="airtime-phone-input"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="08012345678"
                maxLength={13}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono text-base focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
              <span className="absolute right-3.5 top-3.5 text-xs text-slate-400">Nigeria (+234)</span>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Recharge Amount (₦)
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">Min: ₦50 | Max: ₦100,000</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-3 text-lg font-mono text-slate-400">₦</span>
              <input
                id="airtime-amount-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="1000"
                min="50"
                max="100000"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-4 py-3 text-slate-900 dark:text-white font-mono text-xl font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Quick Amounts */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {QUICK_AMOUNTS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setAmount(q.toString())}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  amount === q.toString()
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {formatNaira(q, false)}
              </button>
            ))}
          </div>

          {/* Save Beneficiary Checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveBeneficiary}
                onChange={(e) => setSaveBeneficiary(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300">Save this phone number as a frequent beneficiary</span>
            </label>

            {saveBeneficiary && (
              <div className="mt-3">
                <input
                  type="text"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="e.g. Mum MTN or Bro 9mobile"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}
          </div>

          {/* Price Breakdown Banner */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Face Value:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{formatNaira(numAmount)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Instant Cashback (2%):
              </span>
              <span className="font-mono">-{formatNaira(cashbackDiscount)}</span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
              <span>You Pay from Wallet:</span>
              <span className="font-mono text-emerald-600 dark:text-emerald-400">{formatNaira(totalPayable)}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            id="airtime-submit-btn"
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-500/10"
          >
            <span>Continue to Confirmation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Confirmation Modal with PIN entry */}
      {showConfirm && (
        <div id="airtime-confirm-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 md:p-7 text-slate-900 dark:text-slate-100 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Confirm Airtime Recharge</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Review your transaction details carefully</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Network Provider:</span>
                <span className="font-bold text-slate-900 dark:text-white">{network}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Phone Number:</span>
                <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">{phoneNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Airtime Value:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{formatNaira(numAmount)}</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold">
                <span className="text-slate-700 dark:text-slate-300">Total Deducted:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{formatNaira(totalPayable)}</span>
              </div>
            </div>

            {/* PIN Entry */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Enter 4-digit Transaction PIN
              </label>
              <input
                id="airtime-pin-input"
                type="password"
                maxLength={4}
                value={transactionPin}
                onChange={(e) => setTransactionPin(e.target.value)}
                placeholder="1234"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center font-mono text-xl tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
              <p className="text-[11px] text-slate-500 text-center mt-1">Default demo PIN is 1234</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={isProcessing}
                className="w-1/2 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="airtime-confirm-pay-btn"
                type="button"
                onClick={handleConfirmPurchase}
                disabled={isProcessing}
                className="w-1/2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                {isProcessing ? 'Dispensing...' : 'Pay & Top-up'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Receipt Modal */}
      {selectedReceiptTx && (
        <ReceiptModal
          transaction={selectedReceiptTx}
          onClose={() => setSelectedReceiptTx(null)}
        />
      )}
    </div>
  );
};

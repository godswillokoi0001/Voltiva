import React, { useState } from 'react';
import { 
  Tv, 
  Check, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Users, 
  Lock,
  UserCheck,
  Tv2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CableProvider, Beneficiary, CablePackage } from '../../types';
import { CABLE_PACKAGES } from '../../data/catalog';
import { vtuProvider } from '../../services/vtuService';
import { formatNaira } from '../../utils/formatters';
import { ReceiptModal } from '../common/ReceiptModal';
import confetti from 'canvas-confetti';

const PROVIDERS: { id: CableProvider; name: string; color: string }[] = [
  { id: 'DSTV', name: 'DStv Multichoice', color: 'border-sky-500/50 bg-sky-500/10 text-sky-400' },
  { id: 'GOTV', name: 'GOtv Nigeria', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' },
  { id: 'STARTIMES', name: 'StarTimes Digital', color: 'border-orange-500/50 bg-orange-500/10 text-orange-400' },
];

export const CableTvSubscription: React.FC = () => {
  const { wallet, executeVTUPurchase, beneficiaries, selectedReceiptTx, setSelectedReceiptTx } = useApp();

  const [provider, setProvider] = useState<CableProvider>('DSTV');
  const [smartcardNumber, setSmartcardNumber] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<CablePackage | null>(null);
  const [transactionPin, setTransactionPin] = useState<string>('1234');
  const [saveBeneficiary, setSaveBeneficiary] = useState<boolean>(false);
  const [beneficiaryName, setBeneficiaryName] = useState<string>('');

  // Verification
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifiedCustomerName, setVerifiedCustomerName] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const cableBeneficiaries = beneficiaries.filter(b => b.type === 'smartcard');
  const packages = CABLE_PACKAGES.filter(p => p.provider === provider);

  const handleVerifySmartcard = async () => {
    if (!smartcardNumber || smartcardNumber.length < 9) {
      setVerificationError('Enter a valid 10 or 11-digit Smartcard/IUC number.');
      return;
    }
    setVerificationError(null);
    setIsVerifying(true);
    const res = await vtuProvider.verifySmartcardNumber(provider, smartcardNumber);
    setIsVerifying(false);
    if (res.isValid && res.customerName) {
      setVerifiedCustomerName(res.customerName);
    } else {
      setVerifiedCustomerName(null);
      setVerificationError(res.errorMessage || 'Smartcard/IUC verification failed.');
    }
  };

  const handleSelectBeneficiary = (b: Beneficiary) => {
    setSmartcardNumber(b.accountIdentifier);
    if (['DSTV', 'GOTV', 'STARTIMES'].includes(b.provider.toUpperCase())) {
      setProvider(b.provider.toUpperCase() as CableProvider);
    }
    setVerifiedCustomerName(null);
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!verifiedCustomerName) {
      setError('Please click "Verify Decoder" to confirm the smartcard account owner.');
      return;
    }

    if (!selectedPackage) {
      setError('Please select a TV bouquet/package to activate.');
      return;
    }

    const totalRequired = selectedPackage.price + 50; // ₦50 processing fee
    if (wallet && wallet.availableBalance < totalRequired) {
      setError(`Insufficient wallet balance. Total is ${formatNaira(totalRequired)}, available is ${formatNaira(wallet.availableBalance)}.`);
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPackage) return;
    setError(null);
    setIsProcessing(true);

    const result = await executeVTUPurchase({
      serviceType: 'cable',
      provider,
      recipient: smartcardNumber,
      amount: selectedPackage.price,
      planName: selectedPackage.name,
      transactionPin,
      saveAsBeneficiary: saveBeneficiary,
      beneficiaryName: beneficiaryName || `${provider} Decoder ${smartcardNumber.slice(-4)}`,
    });

    setIsProcessing(false);
    if (result.success && result.transaction) {
      setShowConfirm(false);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
      setSelectedReceiptTx(result.transaction);
    } else {
      setError(result.error || 'Cable subscription renewal failed. Please retry.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-xs uppercase tracking-wider">
            <Tv className="w-4 h-4" />
            <span>Pay TV & Satellite Renewal</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full">
            <Tv className="w-3.5 h-3.5" />
            <span>VTpass TV Gateway</span>
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">Cable TV Subscription</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Instant decoder reconnection and package renewal via VTpass MultiChoice & StarTimes APIs.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
        <form onSubmit={handlePreSubmit} className="space-y-6">
          {/* Provider Tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
              Select TV Provider
            </label>
            <div className="grid grid-cols-3 gap-3">
              {PROVIDERS.map((p) => (
                <button
                  id={`cable-provider-${p.id.toLowerCase()}`}
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setProvider(p.id);
                    setSelectedPackage(null);
                    setVerifiedCustomerName(null);
                  }}
                  className={`relative p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    provider === p.id
                      ? `${p.color} ring-2 ring-purple-500/40 font-bold shadow-xs`
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-semibold">{p.name}</span>
                  {provider === p.id && (
                    <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Beneficiaries Pick */}
          {cableBeneficiaries.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Saved Decoders</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {cableBeneficiaries.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectBeneficiary(b)}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500/50 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">{b.name}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">{b.accountIdentifier}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Smartcard with Verify */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Smartcard / IUC / UIC Number
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="cable-smartcard-input"
                type="text"
                value={smartcardNumber}
                onChange={(e) => {
                  setSmartcardNumber(e.target.value);
                  setVerifiedCustomerName(null);
                  setVerificationError(null);
                }}
                placeholder="e.g. 1029384756"
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono text-base focus:outline-none focus:border-purple-500"
                required
              />
              <button
                id="verify-smartcard-btn"
                type="button"
                onClick={handleVerifySmartcard}
                disabled={isVerifying || !smartcardNumber}
                className="px-5 py-3 rounded-xl bg-purple-500/15 border border-purple-500/40 hover:bg-purple-500/25 text-purple-700 dark:text-purple-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
              >
                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                <span>{isVerifying ? 'Checking...' : 'Verify Decoder'}</span>
              </button>
            </div>

            {verificationError && (
              <p className="text-xs text-rose-500 dark:text-rose-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {verificationError}
              </p>
            )}

            {verifiedCustomerName && (
              <div className="mt-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Check className="w-4 h-4" /> Customer Account Name:
                </div>
                <p className="font-mono text-slate-900 dark:text-white text-sm font-semibold mt-0.5">{verifiedCustomerName}</p>
              </div>
            )}
          </div>

          {/* Package Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
              Select Package / Bouquet
            </label>
            <div className="space-y-2.5">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    selectedPackage?.id === pkg.id
                      ? 'border-purple-500 bg-purple-500/10 dark:bg-purple-500/15 ring-1 ring-purple-500 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 dark:text-white text-base">{pkg.name}</span>
                      <span className="text-[11px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-mono">
                        {pkg.channels}+ Channels
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{pkg.description}</p>
                  </div>
                  <div className="font-mono text-base font-extrabold text-purple-600 dark:text-purple-400">
                    {formatNaira(pkg.price)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save Beneficiary */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveBeneficiary}
                onChange={(e) => setSaveBeneficiary(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-purple-500 focus:ring-purple-500"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300">Save decoder for quick 1-click renewal</span>
            </label>

            {saveBeneficiary && (
              <div className="mt-3">
                <input
                  type="text"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="e.g. Living Room TV or Master Bedroom"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            )}
          </div>

          {/* Fee & Summary */}
          {selectedPackage && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Bouquet Price:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{formatNaira(selectedPackage.price)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Gateway Service Fee:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">₦50.00</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="font-mono text-purple-600 dark:text-purple-400">{formatNaira(selectedPackage.price + 50)}</span>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            id="cable-submit-btn"
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-purple-600/10"
          >
            <span>Proceed to Confirmation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selectedPackage && (
        <div id="cable-confirm-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 md:p-7 text-slate-900 dark:text-slate-100 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-2 border border-purple-500/20">
                <Tv2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Confirm Cable Subscription</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Signals are reactivated within 5 minutes</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Provider:</span>
                <span className="font-bold text-slate-900 dark:text-white">{provider}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Customer Name:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{verifiedCustomerName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Decoder Smartcard:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{smartcardNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Package:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{selectedPackage.name}</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold">
                <span className="text-slate-700 dark:text-slate-300">Total Deducted:</span>
                <span className="font-mono text-purple-600 dark:text-purple-400">{formatNaira(selectedPackage.price + 50)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> Enter 4-digit Transaction PIN
              </label>
              <input
                id="cable-pin-input"
                type="password"
                maxLength={4}
                value={transactionPin}
                onChange={(e) => setTransactionPin(e.target.value)}
                placeholder="1234"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center font-mono text-xl tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-purple-500"
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
                id="cable-confirm-pay-btn"
                type="button"
                onClick={handleConfirmPurchase}
                disabled={isProcessing}
                className="w-1/2 py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tv className="w-4 h-4" />}
                {isProcessing ? 'Reconnecting...' : 'Pay & Reactivate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedReceiptTx && (
        <ReceiptModal
          transaction={selectedReceiptTx}
          onClose={() => setSelectedReceiptTx(null)}
        />
      )}
    </div>
  );
};

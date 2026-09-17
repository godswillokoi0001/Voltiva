import React, { useState } from 'react';
import { 
  Zap, 
  Check, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Users, 
  Lock,
  UserCheck,
  Building
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ElectricityProvider, Beneficiary } from '../../types';
import { ELECTRICITY_PROVIDERS_LIST } from '../../data/catalog';
import { vtuProvider } from '../../services/vtuService';
import { formatNaira } from '../../utils/formatters';
import { ReceiptModal } from '../common/ReceiptModal';
import confetti from 'canvas-confetti';

export const ElectricityBill: React.FC = () => {
  const { wallet, executeVTUPurchase, beneficiaries, selectedReceiptTx, setSelectedReceiptTx } = useApp();

  const [provider, setProvider] = useState<ElectricityProvider>('IKEDC');
  const [meterType, setMeterType] = useState<'prepaid' | 'postpaid'>('prepaid');
  const [meterNumber, setMeterNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('5000');
  const [transactionPin, setTransactionPin] = useState<string>('1234');
  const [saveBeneficiary, setSaveBeneficiary] = useState<boolean>(false);
  const [beneficiaryName, setBeneficiaryName] = useState<string>('');

  // Meter verification states
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifiedName, setVerifiedName] = useState<string | null>(null);
  const [verifiedAddress, setVerifiedAddress] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const meterBeneficiaries = beneficiaries.filter(b => b.type === 'meter');

  const handleVerifyMeter = async () => {
    if (!meterNumber || meterNumber.length < 10) {
      setVerificationError('Enter a valid 11-digit meter number to verify.');
      return;
    }
    setVerificationError(null);
    setIsVerifying(true);
    const res = await vtuProvider.verifyMeterNumber(provider, meterNumber, meterType);
    setIsVerifying(false);
    if (res.isValid && res.customerName) {
      setVerifiedName(res.customerName);
      setVerifiedAddress(res.address || null);
    } else {
      setVerifiedName(null);
      setVerificationError(res.errorMessage || 'Meter number could not be verified with the Disco server.');
    }
  };

  const handleSelectBeneficiary = (b: Beneficiary) => {
    setMeterNumber(b.accountIdentifier);
    if (b.provider && ELECTRICITY_PROVIDERS_LIST.some(p => p.code === b.provider)) {
      setProvider(b.provider as ElectricityProvider);
    }
    if (b.metadata?.meterType) {
      setMeterType(b.metadata.meterType);
    }
    // Auto verify
    setVerifiedName(null);
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!verifiedName) {
      setError('Please click "Verify Meter" to validate account ownership before making payment.');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 1000) {
      setError('Minimum electricity recharge amount is ₦1,000.');
      return;
    }

    const totalRequired = numAmount + 100; // ₦100 convenience fee
    if (wallet && wallet.availableBalance < totalRequired) {
      setError(`Insufficient wallet balance. Total with convenience fee is ${formatNaira(totalRequired)}, available is ${formatNaira(wallet.availableBalance)}.`);
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmPurchase = async () => {
    setError(null);
    setIsProcessing(true);

    const numAmount = parseFloat(amount);
    const result = await executeVTUPurchase({
      serviceType: 'electricity',
      provider,
      recipient: meterNumber,
      amount: numAmount,
      meterType,
      transactionPin,
      saveAsBeneficiary: saveBeneficiary,
      beneficiaryName: beneficiaryName || `${provider} Meter ${meterNumber.slice(-4)}`,
    });

    setIsProcessing(false);
    if (result.success && result.transaction) {
      setShowConfirm(false);
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
      setSelectedReceiptTx(result.transaction);
    } else {
      setError(result.error || 'Disco meter vending failed. Please retry.');
    }
  };

  const numAmount = parseFloat(amount) || 0;
  const convenienceFee = 100;
  const totalPayable = numAmount + convenienceFee;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>NERC Regulated Electricity Distribution</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
            <Zap className="w-3.5 h-3.5" />
            <span>VTpass Disco Gateway</span>
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">Pay Electricity Bill</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Generate instant STS prepaid tokens or settle postpaid electricity utility bills via VTpass.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 md:p-8 space-y-6 shadow-xs">
        <form onSubmit={handlePreSubmit} className="space-y-6">
          {/* Provider Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Select Electricity Distribution Company (DISCO)
            </label>
            <div className="relative">
              <select
                id="disco-provider-select"
                value={provider}
                onChange={(e) => {
                  setProvider(e.target.value as ElectricityProvider);
                  setVerifiedName(null);
                }}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {ELECTRICITY_PROVIDERS_LIST.map((p) => (
                  <option key={p.code} value={p.code} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {p.name} — {p.coverage}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Meter Type Switcher */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Meter Type
            </label>
            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMeterType('prepaid');
                  setVerifiedName(null);
                }}
                className={`py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  meterType === 'prepaid'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Prepaid (Instant Token)
              </button>
              <button
                type="button"
                onClick={() => {
                  setMeterType('postpaid');
                  setVerifiedName(null);
                }}
                className={`py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  meterType === 'postpaid'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Postpaid (Monthly Bill)
              </button>
            </div>
          </div>

          {/* Beneficiaries Pick */}
          {meterBeneficiaries.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>Saved Meter Numbers</span>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {meterBeneficiaries.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => handleSelectBeneficiary(b)}
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">{b.name}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">{b.accountIdentifier}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Meter Number with Verify Action */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Meter / Account Number
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="meter-number-input"
                type="text"
                value={meterNumber}
                onChange={(e) => {
                  setMeterNumber(e.target.value);
                  setVerifiedName(null);
                  setVerificationError(null);
                }}
                placeholder="Enter 11-digit meter number"
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono text-base focus:outline-none focus:border-amber-500"
                required
              />
              <button
                id="verify-meter-btn"
                type="button"
                onClick={handleVerifyMeter}
                disabled={isVerifying || !meterNumber}
                className="px-5 py-3 rounded-xl bg-amber-500/15 border border-amber-500/40 hover:bg-amber-500/25 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer shrink-0"
              >
                {isVerifying ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserCheck className="w-4 h-4" />}
                <span>{isVerifying ? 'Validating...' : 'Verify Meter'}</span>
              </button>
            </div>

            {verificationError && (
              <p className="text-xs text-rose-500 dark:text-rose-400 mt-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> {verificationError}
              </p>
            )}

            {/* Verification Success Box */}
            {verifiedName && (
              <div className="mt-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Check className="w-4 h-4" /> Validated Account Owner:
                </div>
                <p className="font-mono text-slate-900 dark:text-white text-sm font-semibold">{verifiedName}</p>
                {verifiedAddress && <p className="text-slate-500 dark:text-slate-400">{verifiedAddress}</p>}
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Recharge Amount (₦)
              </label>
              <span className="text-xs text-slate-500 dark:text-slate-400">Min: ₦1,000</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-3 text-lg font-mono text-slate-400">₦</span>
              <input
                id="electricity-amount-input"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="5000"
                min="1000"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-4 py-3 text-slate-900 dark:text-white font-mono text-xl font-bold focus:outline-none focus:border-amber-500"
                required
              />
            </div>
          </div>

          {/* Save Beneficiary */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveBeneficiary}
                onChange={(e) => setSaveBeneficiary(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300">Save meter for fast one-click bill payment</span>
            </label>

            {saveBeneficiary && (
              <div className="mt-3">
                <input
                  type="text"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="e.g. Home Meter or Lekki Flat"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            )}
          </div>

          {/* Fee & Summary */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Token Units Value:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{formatNaira(numAmount)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>NERC Standard Utility Fee:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">{formatNaira(convenienceFee)}</span>
            </div>
            <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between text-sm font-bold text-slate-900 dark:text-white">
              <span>Total Deducted:</span>
              <span className="font-mono text-amber-600 dark:text-amber-400">{formatNaira(totalPayable)}</span>
            </div>
          </div>

          {/* Submit */}
          <button
            id="electricity-submit-btn"
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/10"
          >
            <span>Proceed to Confirmation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div id="electricity-confirm-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 md:p-7 text-slate-900 dark:text-slate-100 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-2 border border-amber-500/20">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Confirm Electricity Payment</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Token will be generated on confirmation</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Disco Provider:</span>
                <span className="font-bold text-slate-900 dark:text-white">{provider}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Customer Name:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">{verifiedName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Meter Number:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{meterNumber} ({meterType})</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold">
                <span className="text-slate-700 dark:text-slate-300">Total Payable:</span>
                <span className="font-mono text-amber-600 dark:text-amber-400">{formatNaira(totalPayable)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Enter 4-digit Transaction PIN
              </label>
              <input
                id="electricity-pin-input"
                type="password"
                maxLength={4}
                value={transactionPin}
                onChange={(e) => setTransactionPin(e.target.value)}
                placeholder="1234"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center font-mono text-xl tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
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
                id="electricity-confirm-pay-btn"
                type="button"
                onClick={handleConfirmPurchase}
                disabled={isProcessing}
                className="w-1/2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {isProcessing ? 'Generating Token...' : 'Pay & Dispense'}
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

import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  Check, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Users, 
  Lock,
  Calendar,
  Sparkles,
  RefreshCw,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NetworkProvider, Beneficiary, DataBundlePlan } from '../../types';
import { DATA_PLANS } from '../../data/catalog';
import { formatNaira, validateNigerianPhone } from '../../utils/formatters';
import { ReceiptModal } from '../common/ReceiptModal';
import { fetchVTpassVariations, VTpassVariation } from '../../services/vtuService';
import confetti from 'canvas-confetti';

const NETWORKS: { id: NetworkProvider; name: string; color: string; serviceID: string }[] = [
  { id: 'MTN', name: 'MTN Data', color: 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300', serviceID: 'mtn-data' },
  { id: 'AIRTEL', name: 'Airtel Data', color: 'border-red-500/50 bg-red-500/10 text-red-400', serviceID: 'airtel-data' },
  { id: 'GLO', name: 'Glo Data', color: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400', serviceID: 'glo-data' },
  { id: '9MOBILE', name: '9mobile Data', color: 'border-lime-500/50 bg-lime-500/10 text-lime-400', serviceID: 'etisalat-data' },
];

export const DataPurchase: React.FC = () => {
  const { wallet, executeVTUPurchase, beneficiaries, selectedReceiptTx, setSelectedReceiptTx } = useApp();

  const [network, setNetwork] = useState<NetworkProvider>('MTN');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<DataBundlePlan | null>(null);
  const [transactionPin, setTransactionPin] = useState<string>('1234');
  const [saveBeneficiary, setSaveBeneficiary] = useState<boolean>(false);
  const [beneficiaryName, setBeneficiaryName] = useState<string>('');

  const [vtpassVariations, setVtpassVariations] = useState<VTpassVariation[]>([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState<boolean>(false);
  const [useLiveVTpassPlans, setUseLiveVTpassPlans] = useState<boolean>(true);

  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const phoneBeneficiaries = beneficiaries.filter(b => b.type === 'phone');

  // Load live VTpass variations whenever network changes
  useEffect(() => {
    let isMounted = true;
    const loadLivePlans = async () => {
      setIsLoadingPlans(true);
      const networkConfig = NETWORKS.find(n => n.id === network);
      if (!networkConfig) return;

      const variations = await fetchVTpassVariations(networkConfig.serviceID);
      if (isMounted) {
        setVtpassVariations(variations);
        setIsLoadingPlans(false);
      }
    };

    loadLivePlans();
    return () => {
      isMounted = false;
    };
  }, [network]);

  // Convert VTpass variations to DataBundlePlan format
  const dynamicVTpassPlans: DataBundlePlan[] = vtpassVariations.map(v => {
    const lowerName = v.name.toLowerCase();
    let category: 'daily' | 'weekly' | 'monthly' | 'special' = 'monthly';
    let validity = '30 Days';

    if (lowerName.includes('day') || lowerName.includes('24 hrs') || lowerName.includes('48 hrs')) {
      category = 'daily';
      validity = lowerName.includes('2 day') || lowerName.includes('48 hrs') ? '2 Days' : '1 Day';
    } else if (lowerName.includes('week') || lowerName.includes('7 day') || lowerName.includes('14 day')) {
      category = 'weekly';
      validity = lowerName.includes('14 day') ? '14 Days' : '7 Days';
    } else if (lowerName.includes('night') || lowerName.includes('weekend') || lowerName.includes('sme')) {
      category = 'special';
      validity = lowerName.includes('weekend') ? 'Weekend' : 'Night';
    }

    // Extract data volume allowance
    const match = v.name.match(/(\d+(\.\d+)?\s*(MB|GB|TB))/i);
    const dataAllowance = match ? match[0] : v.name.split('-')[0].trim();
    const price = parseFloat(v.variation_amount) || 500;

    return {
      id: v.variation_code,
      network,
      name: v.name,
      category: category as any,
      validity,
      dataAllowance,
      price,
      cashback: Math.round(price * 0.02),
    };
  });

  // Decide plan list: prefer VTpass live variations if available, else catalog
  const catalogFallbackPlans = DATA_PLANS.filter(p => p.network === network);
  const activePlansSource = (dynamicVTpassPlans.length > 0 && useLiveVTpassPlans) 
    ? dynamicVTpassPlans 
    : catalogFallbackPlans;

  // Filter by category
  const filteredPlans = activePlansSource.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

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
      setError('Please enter a valid 11-digit Nigerian phone number.');
      return;
    }

    if (!selectedPlan) {
      setError('Please select an active data bundle plan from the list below.');
      return;
    }

    if (wallet && wallet.availableBalance < selectedPlan.price) {
      setError(`Insufficient wallet balance. Plan costs ${formatNaira(selectedPlan.price)}, but your available balance is ${formatNaira(wallet.availableBalance)}.`);
      return;
    }

    setShowConfirm(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPlan) return;
    setError(null);
    setIsProcessing(true);

    const result = await executeVTUPurchase({
      serviceType: 'data',
      provider: network,
      recipient: phoneNumber,
      amount: selectedPlan.price,
      planId: selectedPlan.id,
      packageCode: selectedPlan.id,
      planName: `${selectedPlan.name} (${selectedPlan.dataAllowance})`,
      transactionPin,
      saveAsBeneficiary: saveBeneficiary,
      beneficiaryName: beneficiaryName || `${network} Data ${phoneNumber.slice(-4)}`,
    });

    setIsProcessing(false);
    if (result.success && result.transaction) {
      setShowConfirm(false);
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {}
      setSelectedReceiptTx(result.transaction);
    } else {
      setError(result.error || 'Data bundle provisioning failed. Please retry.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-xs uppercase tracking-wider">
            <Wifi className="w-4 h-4" />
            <span>High-Speed Broadband Bundles</span>
          </div>

          {/* VTpass Live Sync Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>VTpass Connected ({dynamicVTpassPlans.length} Live Plans)</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white mt-1">Buy Internet Data</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Direct SME and Direct-to-Device data bundles provisioned via VTpass Gateway.</p>
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
          {/* Network Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2.5">
              Select Network
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {NETWORKS.map((n) => (
                <button
                  id={`data-network-${n.id.toLowerCase()}`}
                  key={n.id}
                  type="button"
                  onClick={() => {
                    setNetwork(n.id);
                    setSelectedPlan(null);
                  }}
                  className={`relative p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                    network === n.id
                      ? `${n.color} ring-2 ring-blue-500/40 font-bold shadow-xs`
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-semibold">{n.name}</span>
                  <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-1">VTpass Direct</span>
                  {network === n.id && (
                    <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Beneficiaries Pick */}
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
                    className="shrink-0 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-slate-900 dark:text-white">{b.name}</span>
                    <span className="font-mono text-slate-500 dark:text-slate-400 text-[11px]">{b.accountIdentifier}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recipient Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <input
              id="data-phone-input"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="08012345678"
              maxLength={13}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white font-mono text-base focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {/* Category Tabs */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Validity Duration
              </label>
              {isLoadingPlans && (
                <span className="text-[11px] text-blue-500 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Syncing VTpass plans...
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
              {(['daily', 'weekly', 'monthly', 'all'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setSelectedPlan(null);
                  }}
                  className={`py-2 text-xs font-bold capitalize rounded-lg transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Plans' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Plans Grid */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Choose Data Plan ({network})
              </label>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {filteredPlans.length} plans available
              </span>
            </div>

            {isLoadingPlans ? (
              <div className="p-8 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center space-y-2">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500 mx-auto" />
                <p className="text-xs text-slate-500 dark:text-slate-400">Loading {network} variations from VTpass sandbox...</p>
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400">No {activeCategory} plans found for {network}.</p>
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className="text-xs text-blue-500 font-semibold mt-1 hover:underline cursor-pointer"
                >
                  Show all {network} plans
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {filteredPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedPlan?.id === plan.id
                        ? 'border-blue-500 bg-blue-500/10 dark:bg-blue-500/15 ring-1 ring-blue-500 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{plan.dataAllowance}</span>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded flex items-center gap-1 font-mono">
                          <Calendar className="w-3 h-3" /> {plan.validity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1" title={plan.name}>
                        {plan.name}
                      </p>
                    </div>
                    <div className="text-right shrink-0 ml-2">
                      <span className="font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatNaira(plan.price)}
                      </span>
                      {plan.cashback > 0 && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-300 flex items-center justify-end gap-0.5 font-medium">
                          <Sparkles className="w-2.5 h-2.5" /> ₦{plan.cashback} cash
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Beneficiary */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={saveBeneficiary}
                onChange={(e) => setSaveBeneficiary(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 text-blue-500 focus:ring-blue-500"
              />
              <span className="text-xs text-slate-700 dark:text-slate-300">Save as frequent data recipient</span>
            </label>

            {saveBeneficiary && (
              <div className="mt-3">
                <input
                  type="text"
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="e.g. My iPad or Cousin"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            id="data-submit-btn"
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-blue-600/10"
          >
            <span>Proceed to Confirmation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && selectedPlan && (
        <div id="data-confirm-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 md:p-7 text-slate-900 dark:text-slate-100 space-y-5">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2 border border-blue-500/20">
                <Wifi className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Confirm Data Subscription</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">VTpass Gateway will provision bundle immediately</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Network:</span>
                <span className="font-bold text-slate-900 dark:text-white">{network}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Recipient Phone:</span>
                <span className="font-mono font-medium text-blue-600 dark:text-blue-400">{phoneNumber}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Plan:</span>
                <span className="font-semibold text-slate-900 dark:text-white line-clamp-1">{selectedPlan.name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200 dark:border-slate-800/60">
                <span className="text-slate-500 dark:text-slate-400">Variation Code:</span>
                <span className="font-mono text-slate-600 dark:text-slate-400">{selectedPlan.id}</span>
              </div>
              <div className="flex justify-between py-1 text-sm font-bold">
                <span className="text-slate-700 dark:text-slate-300">Amount:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{formatNaira(selectedPlan.price)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Enter 4-digit Transaction PIN
              </label>
              <input
                id="data-pin-input"
                type="password"
                maxLength={4}
                value={transactionPin}
                onChange={(e) => setTransactionPin(e.target.value)}
                placeholder="1234"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-center font-mono text-xl tracking-widest text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
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
                id="data-confirm-pay-btn"
                type="button"
                onClick={handleConfirmPurchase}
                disabled={isProcessing}
                className="w-1/2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {isProcessing ? 'Processing...' : 'Pay & Activate'}
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

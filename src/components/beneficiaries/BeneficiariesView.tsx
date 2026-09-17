import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Smartphone, 
  Zap, 
  Tv, 
  Search, 
  X, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Beneficiary, BeneficiaryType } from '../../types';
import { ProviderBadge } from '../common/Badges';

export const BeneficiariesView: React.FC = () => {
  const { beneficiaries, saveBeneficiary, deleteBeneficiary, setActiveView } = useApp();
  const [activeTab, setActiveTab] = useState<BeneficiaryType | 'all'>('all');
  const [search, setSearch] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // Add Beneficiary Form state
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<BeneficiaryType>('phone');
  const [provider, setProvider] = useState<string>('MTN');
  const [accountIdentifier, setAccountIdentifier] = useState<string>('');

  const filtered = beneficiaries.filter((b) => {
    const matchesTab = activeTab === 'all' || b.type === activeTab;
    const matchesSearch = 
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.accountIdentifier.toLowerCase().includes(search.toLowerCase()) ||
      b.provider.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !accountIdentifier) return;

    saveBeneficiary({
      name,
      type,
      provider,
      accountIdentifier,
    });

    setName('');
    setAccountIdentifier('');
    setShowAddModal(false);
  };

  const handleUseBeneficiary = (b: Beneficiary) => {
    if (b.type === 'phone') {
      setActiveView('airtime');
    } else if (b.type === 'meter') {
      setActiveView('electricity');
    } else {
      setActiveView('cable');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white">Saved Beneficiaries</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Manage frequently used numbers, meters, and decoders for lightning-fast top-ups.</p>
        </div>
        <button
          id="open-add-beneficiary-btn"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Add Beneficiary
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto overflow-x-auto">
          {(['all', 'phone', 'meter', 'smartcard'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer shrink-0 ${
                activeTab === tab
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab === 'all' ? 'All Records' : tab === 'phone' ? 'Phone Lines' : tab === 'meter' ? 'Meters' : 'Decoders'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saved..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((b) => (
          <div
            key={b.id}
            className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 rounded-2xl p-5 space-y-4 transition-all shadow-xs"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                  {b.type === 'phone' && <Smartphone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                  {b.type === 'meter' && <Zap className="w-5 h-5 text-amber-500 dark:text-amber-400" />}
                  {b.type === 'smartcard' && <Tv className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{b.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <ProviderBadge provider={b.provider} />
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteBeneficiary(b.id)}
                title="Delete Beneficiary"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 font-mono text-sm text-slate-700 dark:text-slate-200">
              {b.accountIdentifier}
            </div>

            <button
              onClick={() => handleUseBeneficiary(b)}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <span>Instant Recharge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl space-y-2 shadow-xs">
            <Users className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">No beneficiaries found</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Save frequent recipients during checkout or add one above.</p>
          </div>
        )}
      </div>

      {/* Add Beneficiary Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Add New Beneficiary</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as BeneficiaryType)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white"
                >
                  <option value="phone">Phone Line (Airtime / Data)</option>
                  <option value="meter">Electricity Meter</option>
                  <option value="smartcard">Cable Decoder (Smartcard)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Service Provider
                </label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-semibold"
                >
                  {type === 'phone' && (
                    <>
                      <option value="MTN">MTN</option>
                      <option value="AIRTEL">Airtel</option>
                      <option value="GLO">Glo</option>
                      <option value="9MOBILE">9mobile</option>
                    </>
                  )}
                  {type === 'meter' && (
                    <>
                      <option value="IKEDC">Ikeja Electric (IKEDC)</option>
                      <option value="EKEDC">Eko Electricity (EKEDC)</option>
                      <option value="AEDC">Abuja Electric (AEDC)</option>
                      <option value="IBEDC">Ibadan Electric (IBEDC)</option>
                    </>
                  )}
                  {type === 'smartcard' && (
                    <>
                      <option value="DSTV">DStv</option>
                      <option value="GOTV">GOtv</option>
                      <option value="STARTIMES">StarTimes</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Beneficiary Nickname / Label
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Mum MTN or Apartment Meter"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Account Number / Phone / Smartcard
                </label>
                <input
                  type="text"
                  value={accountIdentifier}
                  onChange={(e) => setAccountIdentifier(e.target.value)}
                  placeholder={type === 'phone' ? '08012345678' : 'Enter 10 or 11 digits'}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs mt-2 transition-colors cursor-pointer shadow-xs"
              >
                Save Beneficiary
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

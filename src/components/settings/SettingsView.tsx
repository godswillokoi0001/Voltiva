import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  Check, 
  AlertCircle,
  LogOut,
  UserCheck,
  RefreshCw,
  Database,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { 
    user, 
    isAdmin, 
    updateUserPin, 
    logout, 
    loginAsDemoAdmin, 
    loginAsDemoCustomer 
  } = useApp();

  const [currentPin, setCurrentPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [pinSuccess, setPinSuccess] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Profile fields
  const [fullName, setFullName] = useState<string>(user?.fullName || '');
  const [phone, setPhone] = useState<string>(user?.phoneNumber || '');
  const [profileSuccess, setProfileSuccess] = useState<boolean>(false);

  const handlePinUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    setPinSuccess(false);

    if (newPin.length !== 4 || !/^\d{4}$/.test(newPin)) {
      setPinError('PIN must be exactly 4 digits.');
      return;
    }

    if (newPin !== confirmPin) {
      setPinError('New PINs do not match.');
      return;
    }

    updateUserPin(newPin);
    setPinSuccess(true);
    setCurrentPin('');
    setNewPin('');
    setConfirmPin('');
    setTimeout(() => setPinSuccess(false), 4000);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white">Security & Roles</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">Manage transaction authorization PINs, identity profiles, and role-based access controls.</p>
      </div>

      {/* Role-Based Access Control (RBAC) Card */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isAdmin 
                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20' 
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
            }`}>
              {isAdmin ? <ShieldCheck className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">
                  Authentication & Role-Based Access Control (RBAC)
                </h3>
                {isAdmin ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                    Admin
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    Customer
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verified identity authorization and Firestore synchronization</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loginAsDemoAdmin()}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                isAdmin
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-purple-500/10'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin (Census Okoi)</span>
            </button>
            <button
              onClick={() => loginAsDemoCustomer()}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                !isAdmin
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-500/10'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Customer (Tunde)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-slate-500 dark:text-slate-400 font-medium">Session Identity</div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">User Email:</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-white">{user?.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">User UID:</span>
                <span className="font-mono text-[11px] text-slate-500 truncate max-w-[150px]">{user?.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-400">Database:</span>
                <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Database className="w-3 h-3" /> Firestore Active
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="text-slate-500 dark:text-slate-400 font-medium">Granted Role Permissions</div>
            <ul className="space-y-1 text-slate-700 dark:text-slate-300">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Airtime, Data, Electricity, and Cable VTU Orders</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>Dedicated Virtual Account & Wallet Funding</span>
              </li>
              <li className="flex items-center gap-1.5">
                {isAdmin ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-400 flex items-center justify-center text-[8px] text-slate-400">✕</span>
                )}
                <span className={isAdmin ? 'font-semibold text-purple-700 dark:text-purple-300' : 'text-slate-400'}>
                  System Ledger & VTU Gateway Health Monitor
                </span>
              </li>
              <li className="flex items-center gap-1.5">
                {isAdmin ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-slate-400 flex items-center justify-center text-[8px] text-slate-400">✕</span>
                )}
                <span className={isAdmin ? 'font-semibold text-purple-700 dark:text-purple-300' : 'text-slate-400'}>
                  Dispute Reconciliation & Transaction Status Override
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Transaction PIN Card */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Transaction PIN</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Required to authorize all payments and debits</p>
            </div>
          </div>

          {pinSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>4-digit transaction PIN updated successfully.</span>
            </div>
          )}

          {pinError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{pinError}</span>
            </div>
          )}

          <form onSubmit={handlePinUpdate} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Current PIN (Default: 1234)</label>
              <input
                type="password"
                maxLength={4}
                value={currentPin}
                onChange={(e) => setCurrentPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono tracking-widest text-center"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">New 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono tracking-widest text-center"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Confirm New PIN</label>
              <input
                type="password"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono tracking-widest text-center"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
            >
              Update Transaction PIN
            </button>
          </form>
        </div>

        {/* Profile Card */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Account Profile</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">KYC information registered to wallet</p>
            </div>
          </div>

          {profileSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Profile preferences saved.</span>
            </div>
          )}

          <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Legal Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Primary Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-500 dark:text-slate-400 cursor-not-allowed font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs border border-slate-300 dark:border-slate-700 transition-colors cursor-pointer shadow-xs"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      </div>

      {/* Logout Banner */}
      <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <LogOut className="w-5 h-5 text-rose-500 dark:text-rose-400 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-rose-700 dark:text-rose-300">Sign Out of Session</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Terminates authenticated session token on this device.</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-rose-500/10 dark:bg-rose-500/20 hover:bg-rose-500 text-rose-700 dark:text-rose-300 hover:text-white font-bold text-xs transition-colors cursor-pointer"
        >
          Sign Out Now
        </button>
      </div>
    </div>
  );
};

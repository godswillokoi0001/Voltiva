import React, { useState } from 'react';
import { 
  Bell, 
  CheckCheck, 
  Smartphone, 
  Zap, 
  Wallet, 
  ShieldAlert, 
  Sparkles,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationItem } from '../../types';
import { formatDateTime } from '../../utils/formatters';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useApp();
  const [activeCategory, setActiveCategory] = useState<'all' | 'transaction' | 'wallet' | 'promo'>('all');

  const filtered = notifications.filter(n => {
    if (activeCategory === 'all') return true;
    return n.category === activeCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transaction':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'wallet':
        return <Wallet className="w-4 h-4 text-teal-400" />;
      case 'promo':
        return <Sparkles className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Real-time alerts for VTU dispensations, wallet deposits, and system events.</p>
        </div>
        <button
          onClick={markAllNotificationsRead}
          className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold self-start sm:self-auto cursor-pointer"
        >
          <CheckCheck className="w-4 h-4" /> Mark all as read
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {(['all', 'transaction', 'wallet', 'promo'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold capitalize transition-all shrink-0 cursor-pointer ${
              activeCategory === cat
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Alerts' : cat === 'transaction' ? 'Purchases' : cat === 'wallet' ? 'Wallet Deposits' : 'Promos & Perks'}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/60 shadow-xs">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 dark:text-slate-400">
            No notifications in this category.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-5 flex items-start gap-4 transition-colors cursor-pointer ${
                item.isRead ? 'bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800/30' : 'bg-emerald-500/5 hover:bg-emerald-500/10'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                {getCategoryIcon(item.category)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-semibold ${item.isRead ? 'text-slate-700 dark:text-slate-300' : 'text-slate-900 dark:text-white font-bold'}`}>
                    {item.title}
                  </h4>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{formatDateTime(item.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.message}</p>
              </div>
              {!item.isRead && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-2"></span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

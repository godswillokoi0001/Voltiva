import React, { useState } from 'react';
import { 
  HelpCircle, 
  MessageSquare, 
  Send, 
  FileText, 
  PhoneCall, 
  AlertTriangle, 
  Clock, 
  Plus, 
  CheckCircle2, 
  X 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SupportTicket } from '../../types';
import { formatDateTime } from '../../utils/formatters';

export const SupportView: React.FC = () => {
  const { supportTickets, createSupportTicket, replySupportTicket, transactions } = useApp();

  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(supportTickets[0] || null);
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');

  // New ticket state
  const [subject, setSubject] = useState<string>('');
  const [category, setCategory] = useState<SupportTicket['category']>('airtime_failed');
  const [relatedTx, setRelatedTx] = useState<string>('');
  const [initialMessage, setInitialMessage] = useState<string>('');

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !initialMessage) return;

    createSupportTicket({
      subject,
      category,
      relatedTransactionRef: relatedTx || undefined,
      priority: 'medium',
      initialMessage,
    });

    setSubject('');
    setInitialMessage('');
    setRelatedTx('');
    setShowNewModal(false);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeTicket) return;

    replySupportTicket(activeTicket.id, replyText);
    setReplyText('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-display text-slate-900 dark:text-white">Support & Resolution Desk</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">Direct 24/7 ticket resolution for airtime, data delays, and meter token inquiries.</p>
        </div>
        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors self-start sm:self-auto cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Open New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tickets Sidebar */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-4 space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-2">Your Open & Resolved Cases</h3>
          {supportTickets.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 p-4 text-center">No active dispute cases.</p>
          ) : (
            <div className="space-y-2">
              {supportTickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setActiveTicket(t)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    activeTicket?.id === t.id
                      ? 'border-emerald-500 bg-emerald-500/10'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{t.ticketNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      t.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">{t.subject}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-mono">{formatDateTime(t.updatedAt)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Conversation Pane */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800/80 rounded-2xl flex flex-col h-[520px] shadow-xs">
          {activeTicket ? (
            <>
              {/* Ticket Top bar */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">{activeTicket.subject}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="font-mono">{activeTicket.ticketNumber}</span>
                    {activeTicket.relatedTransactionRef && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-mono font-semibold">Ref: {activeTicket.relatedTransactionRef}</span>
                    )}
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                  activeTicket.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                }`}>
                  {activeTicket.status}
                </span>
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {activeTicket.messages.map((m, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col max-w-md ${
                      m.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                    }`}
                  >
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        m.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {m.text}
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                      {m.sender === 'agent' ? 'Voltiva Resolution Bot/Agent' : 'You'} • {formatDateTime(m.timestamp)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="p-3 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type a follow-up response or details..."
                  className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Send
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 dark:text-slate-500">
              <MessageSquare className="w-8 h-8 mb-2" />
              <p className="text-xs">Select a ticket from the left or open a new inquiry.</p>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-900 dark:text-slate-100 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">Open Support Ticket</h3>
              <button onClick={() => setShowNewModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white"
                >
                  <option value="airtime_failed">Airtime Debit Without Delivery</option>
                  <option value="data_delay">Data Bundle Delay</option>
                  <option value="electricity_token">Prepaid Electricity Token Issue</option>
                  <option value="cable_renewal">Cable TV Decoder Not Reactivated</option>
                  <option value="wallet_funding">Wallet Funding Not Reflected</option>
                  <option value="other">General Account Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Issue Summary / Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. MTN ₦2,000 topup not credited"
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Related Transaction Reference (Optional)
                </label>
                <select
                  value={relatedTx}
                  onChange={(e) => setRelatedTx(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white font-mono"
                >
                  <option value="">None / Not Applicable</option>
                  {transactions.map((tx) => (
                    <option key={tx.id} value={tx.reference}>
                      {tx.reference} — {tx.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Explanation
                </label>
                <textarea
                  rows={4}
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  placeholder="Please describe what happened, including phone numbers or meter numbers involved..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

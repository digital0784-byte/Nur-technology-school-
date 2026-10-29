import React, { useState } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { PaymentSubmission, GradePricingConfig, PaymentAccountConfig } from '../../types/payment';
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  DollarSign,
  Edit3,
  Save,
  Clock,
  Search,
  Filter,
  CreditCard,
  Building2,
  FileCheck,
  Phone,
  Eye,
  AlertCircle,
} from 'lucide-react';

export const AdminBillingVerificationView: React.FC = () => {
  const {
    allSubmissions,
    pricing,
    accounts,
    approvePayment,
    rejectPayment,
    updatePricing,
    updateAccounts,
    auditLogs,
    refreshState,
  } = useSubscription();

  const { isSuperAdmin, currentUser } = useAuth();
  const { t, language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'submissions' | 'pricing' | 'accounts' | 'audit'>('submissions');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState<PaymentSubmission | null>(null);
  const [rejectReason, setRejectReason] = useState('የትራንዛክሽን ቁጥሩ በባንኩ አልተገኘም (Invalid FT Number)');
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);

  // Editable pricing state
  const [editPricing, setEditPricing] = useState<GradePricingConfig>(pricing);
  const [pricingSavedMessage, setPricingSavedMessage] = useState(false);

  // Editable accounts state
  const [editAccounts, setEditAccounts] = useState<PaymentAccountConfig[]>(accounts);
  const [accountsSavedMessage, setAccountsSavedMessage] = useState(false);

  if (!isSuperAdmin) {
    return (
      <div className="p-8 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 text-center space-y-3 max-w-lg mx-auto my-8">
        <ShieldCheck className="w-12 h-12 text-amber-600 mx-auto" />
        <h2 className="text-lg font-black text-slate-900 dark:text-white">ይህ ሞጁል ለዋና አስተዳዳሪ ብቻ የተፈቀደ ነው</h2>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Super Admin Email: mejennur669@gmail.com (Nuriye Ahmed Adem)
        </p>
      </div>
    );
  }

  // Filter submissions
  const filteredSubmissions = allSubmissions.filter((sub) => {
    const matchesFilter = filterStatus === 'ALL' || sub.status === filterStatus;
    const matchesSearch =
      sub.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.transactionRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.studentEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sub.studentPhone && sub.studentPhone.includes(searchQuery));
    return matchesFilter && matchesSearch;
  });

  const handleApprove = (paymentId: string) => {
    approvePayment(paymentId);
  };

  const handleConfirmReject = () => {
    if (showRejectModal) {
      rejectPayment(showRejectModal, rejectReason);
      setShowRejectModal(null);
    }
  };

  const handleSavePricing = (e: React.FormEvent) => {
    e.preventDefault();
    updatePricing(editPricing);
    setPricingSavedMessage(true);
    setTimeout(() => setPricingSavedMessage(false), 3000);
  };

  const handleSaveAccounts = (e: React.FormEvent) => {
    e.preventDefault();
    updateAccounts(editAccounts);
    setAccountsSavedMessage(true);
    setTimeout(() => setAccountsSavedMessage(false), 3000);
  };

  const pendingCount = allSubmissions.filter((s) => s.status === 'PENDING').length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Banner */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-600/80 text-[11px] font-bold uppercase mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Super Admin Billing ERP
          </div>
          <h1 className="text-xl sm:text-2xl font-black">
            የክፍያ ማረጋገጫና ተመን ቁጥጥር ማዕከል (Verification Center)
          </h1>
          <p className="text-xs text-slate-300">
            Nuriye Ahmed Adem (0910097862) • Telebirr, CBE Birr, CBE, Dashen, Abyssinia
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 font-black text-xs animate-pulse">
              {pendingCount} ክፍያዎች ማረጋገጫ በመጠባበቅ ላይ
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'submissions'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          የተማሪዎች ክፍያዎች ({allSubmissions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pricing')}
          className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pricing'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          የዋጋ ተመን ቅንብር (Grade Tier Pricing)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('accounts')}
          className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'accounts'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          የባንክ ሂሳቦች (5 Verified Accounts)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 font-bold text-xs sm:text-sm border-b-2 transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          የኦዲት መዝገብ (Audit Logs)
        </button>
      </div>

      {/* Tab 1: Submissions Management */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          {/* Filters & Search */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-between items-center">
            <div className="flex gap-1.5 w-full sm:w-auto overflow-x-auto">
              {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                    filterStatus === st
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {st === 'ALL'
                    ? 'ሁሉም'
                    : st === 'PENDING'
                    ? `መጠባበቅ ላይ (${allSubmissions.filter((s) => s.status === 'PENDING').length})`
                    : st === 'APPROVED'
                    ? 'የፀደቁ'
                    : 'ውድቅ የተደረጉ'}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="በስም ወይም በFT ኮድ ፈልግ..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          {/* Submissions Table */}
          <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">ተማሪ (Student)</th>
                  <th className="p-3">ክፍል</th>
                  <th className="p-3">የመክፈያ ባንክ</th>
                  <th className="p-3">FT Reference</th>
                  <th className="p-3">መጠን</th>
                  <th className="p-3">ሁኔታ</th>
                  <th className="p-3 text-right">እርምጃዎች (Actions)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-slate-500">
                      ምንም ዓይነት የክፍያ መዝገብ አልተገኘም።
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition">
                      <td className="p-3">
                        <div className="font-extrabold text-slate-900 dark:text-white">{sub.studentName}</div>
                        <div className="text-[10px] text-slate-400">{sub.studentEmail} • {sub.studentPhone}</div>
                      </td>
                      <td className="p-3 font-semibold">{sub.grade}ኛ ክፍል</td>
                      <td className="p-3">
                        <span className="font-bold uppercase text-indigo-600 dark:text-indigo-400">
                          {sub.paymentGateway}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px] font-bold">
                          {sub.transactionRef}
                        </span>
                      </td>
                      <td className="p-3 font-black text-emerald-600">{sub.amount} ETB</td>
                      <td className="p-3">
                        {sub.status === 'APPROVED' ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[10px]">
                            ✓ APPROVED
                          </span>
                        ) : sub.status === 'REJECTED' ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold text-[10px]">
                            ✕ REJECTED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold text-[10px] animate-pulse">
                            ⏳ PENDING
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {sub.status === 'PENDING' ? (
                          <div className="flex gap-1.5 justify-end">
                            <button
                              type="button"
                              onClick={() => handleApprove(sub.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              ያጽድቁ (Approve)
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowRejectModal(sub.id)}
                              className="px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs transition"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              ውድቅ (Reject)
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            {sub.reviewedAt ? `በ ${sub.reviewedAt.split('T')[0]} ተጠናቋል` : 'ተጠናቋል'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Pricing Configuration */}
      {activeTab === 'pricing' && (
        <form onSubmit={handleSavePricing} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-2xl">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-indigo-600" />
              የትምህርት ደረጃዎች ወርሃዊ የክፍያ ተመን (30-Day Billing Cycle)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ዋጋዎች በስርዓቱ እና በFirestore ህጎች ላይ ራስ-ሰር ይተገበራሉ።
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                9ኛ ክፍል (Grade 9) ተመን (ETB)
              </label>
              <input
                type="number"
                min={0}
                value={editPricing.grade9}
                onChange={(e) => setEditPricing({ ...editPricing, grade9: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                10ኛ ክፍል (Grade 10) ተመን (ETB)
              </label>
              <input
                type="number"
                min={0}
                value={editPricing.grade10}
                onChange={(e) => setEditPricing({ ...editPricing, grade10: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                11ኛ ክፍል (Grade 11) ተመን (ETB)
              </label>
              <input
                type="number"
                min={0}
                value={editPricing.grade11}
                onChange={(e) => setEditPricing({ ...editPricing, grade11: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                12ኛ ክፍል (Grade 12) ተመን (ETB)
              </label>
              <input
                type="number"
                min={0}
                value={editPricing.grade12}
                onChange={(e) => setEditPricing({ ...editPricing, grade12: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                ነጠላ አሳይመንት / ፈተና (Single Assignment)
              </label>
              <input
                type="number"
                min={0}
                value={editPricing.singleAssignment}
                onChange={(e) => setEditPricing({ ...editPricing, singleAssignment: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                የፈቃድ ቆይታ (Billing Cycle Days)
              </label>
              <input
                type="number"
                disabled
                value={editPricing.billingCycleDays}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-xs font-mono font-bold opacity-75"
              />
            </div>
          </div>

          {pricingSavedMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              የዋጋ ተመን በተሳካ ሁኔታ ተሻሽሏል!
            </div>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
          >
            <Save className="w-4 h-4" />
            ተመኑን አዘምን (Save Pricing Changes)
          </button>
        </form>
      )}

      {/* Tab 3: Accounts Configuration */}
      {activeTab === 'accounts' && (
        <form onSubmit={handleSaveAccounts} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 max-w-3xl">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-600" />
              የባንክ እና የሞባይል ገንዘብ መቀበያ አካውንቶች
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              የሂሳብ ቁጥሮችን እና የUSSD ኮዶችን እዚህ ማስተካከል ይችላሉ።
            </p>
          </div>

          <div className="space-y-4">
            {editAccounts.map((acc, idx) => (
              <div key={acc.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center justify-between">
                  <span>{acc.name.am}</span>
                  <span className="font-mono text-[10px] text-slate-400 uppercase">{acc.id}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">የሂሳብ ባለቤት ስም</label>
                    <input
                      type="text"
                      value={acc.accountName}
                      onChange={(e) => {
                        const copy = [...editAccounts];
                        copy[idx].accountName = e.target.value;
                        setEditAccounts(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">የስልክ ወይም የሂሳብ ቁጥር</label>
                    <input
                      type="text"
                      value={acc.accountNumberOrPhone}
                      onChange={(e) => {
                        const copy = [...editAccounts];
                        copy[idx].accountNumberOrPhone = e.target.value;
                        setEditAccounts(copy);
                      }}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">USSD መደወያ ኮድ (ካለ)</label>
                    <input
                      type="text"
                      value={acc.ussdCode || ''}
                      onChange={(e) => {
                        const copy = [...editAccounts];
                        copy[idx].ussdCode = e.target.value;
                        setEditAccounts(copy);
                      }}
                      placeholder="ለምሳሌ: *127#"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {accountsSavedMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              የባንክ አካውንቶች መረጃ በተሳካ ሁኔታ ተሻሽሏል!
            </div>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition"
          >
            <Save className="w-4 h-4" />
            የአካውንት መረጃዎችን አዘምን (Save Accounts)
          </button>
        </form>
      )}

      {/* Tab 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-indigo-600" />
              የክፍያና የተመን ለውጥ ኦዲት መዝገብ (Immutable Audit Trail)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ማንኛውም የክፍያ ማፅደቅ፣ ውድቅ ማድረግ ወይም የተመን ለውጥ እዚህ በቋሚነት ይመዘገባል።
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">ሰዓትና ቀን</th>
                  <th className="p-3">ፈፃሚ (Actor)</th>
                  <th className="p-3">እርምጃ (Action)</th>
                  <th className="p-3">ዝርዝር መግለጫ (Details)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-[11px]">
                {auditLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="p-3 text-slate-500 whitespace-nowrap">
                      {log.timestamp.replace('T', ' ').slice(0, 19)}
                    </td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">{log.actor}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3 text-slate-700 dark:text-slate-300 font-sans text-xs">
                      {log.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-600" />
              ክፍያውን ውድቅ የማድረጊያ ምክንያት ይምረጡ
            </h3>

            <div className="space-y-2">
              {[
                'የትራንዛክሽን ቁጥሩ በባንኩ አልተገኘም (Invalid FT Number)',
                'የተከፈለው መጠን ካስፈለገው ያነሰ ነው (Insufficient Amount)',
                'የተሳሳተ የባንክ አካውንት ላይ የተላከ ነው (Wrong Account Transfer)',
                'ደረሰኙ ደብዛዛ ነው ወይም አይነበብም (Illegible Slip)',
              ].map((reason, idx) => (
                <label key={idx} className="flex items-center gap-2 text-xs cursor-pointer p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800">
                  <input
                    type="radio"
                    name="reason"
                    checked={rejectReason === reason}
                    onChange={() => setRejectReason(reason)}
                    className="text-rose-600 focus:ring-rose-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 justify-end pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowRejectModal(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
              >
                ሰርዝ (Cancel)
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                ውድቅ አድርግ (Confirm Reject)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

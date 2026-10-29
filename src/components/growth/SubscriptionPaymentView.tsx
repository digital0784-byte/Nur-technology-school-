import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSubscription } from '../../context/SubscriptionContext';
import { useLanguage } from '../../context/LanguageContext';
import { FirebaseService } from '../../services/firebaseService';
import { PaymentGatewayId } from '../../types/payment';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Loader2,
  Check,
  Clock,
  PhoneCall,
  Copy,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const SubscriptionPaymentView: React.FC = () => {
  const { isAuthenticated, currentUser, activeGrade } = useAuth();
  const {
    status,
    subscription,
    currentGradePrice,
    accounts,
    submitPayment,
    refreshState,
    superAdminContact,
  } = useSubscription();
  const { t, language } = useLanguage();

  const [selectedPlan, setSelectedPlan] = useState<'grade_month' | 'semester' | 'year'>('grade_month');
  const [provider, setProvider] = useState<PaymentGatewayId>('telebirr');
  const [phone, setPhone] = useState('');
  const [refNo, setRefNo] = useState('');
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{ id: string } | null>(null);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Grade-tiered pricing matching the MoE Curriculum standard
  const plans = [
    {
      id: 'grade_month',
      title: `${activeGrade}ኛ ክፍል ወርሃዊ መደበኛ / Grade ${activeGrade} Monthly`,
      price: currentGradePrice,
      duration: '30 Days',
      popular: true,
      tag: 'የክፍልዎ ተመን (Grade Tier)',
    },
    {
      id: 'semester',
      title: 'የሙሉ ሴሚስተር / Full Semester Pass',
      price: currentGradePrice * 4 - 50,
      duration: 'Semester Pass',
      tag: 'ቅናሽ (Discount)',
    },
    {
      id: 'year',
      title: 'የዓመት ሙሉ / Full Year VIP',
      price: currentGradePrice * 8,
      duration: 'Yearly Pass',
      tag: 'ልዩ ፓኬጅ (VIP)',
    },
  ];

  const cur = plans.find((p) => p.id === selectedPlan) || plans[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleVerify = async () => {
    setError('');
    if (!isAuthenticated) {
      setError('መጀመሪያ ይግቡ / Please log in first.');
      return;
    }
    if (refNo.trim().length < 4 || phone.trim().length < 9) {
      setError('የስልክ ቁጥርና የግብይት ቁጥር (FT Transaction ID) በትክክል ያስገቡ / Enter a valid phone number and transaction ID.');
      return;
    }
    setProcessing(true);
    try {
      // 1. Submit through SubscriptionContext to update local app state
      const res = await submitPayment(provider, refNo.trim(), phone.trim());

      // 2. Submit to FirebaseService for live Firestore record
      const id = await FirebaseService.submitPaymentRequest({
        provider: provider.toUpperCase(),
        transactionId: refNo.trim(),
        amount: cur.price,
        phone: phone.trim(),
        plan: cur.duration,
      });

      setReceipt({ id: res.submission?.id || id });
      refreshState();
    } catch (e: any) {
      console.error(e);
      setError('ጥያቄው አልተላከም፣ እባክዎ እንደገና ይሞክሩ / Could not submit, please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600/80 text-[11px] font-bold uppercase mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            {t('mod_subscription_payment')} • Grade {activeGrade}
          </div>
          <h1 className="text-xl sm:text-2xl font-black">የ{activeGrade}ኛ ክፍል የትምህርት ክፍያና ምዝገባ</h1>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mt-1">
            ማንኛውም ተማሪ እንደ ክፍሉ ደረጃ መጀመሪያ ላይ ክፍያ መፈፀም አለበት። ክፍያው በዋና አስተዳዳሪ ቼክ እስከሚደረግ ድረስ ሲስተሙ በመጠባበቅ ላይ (Pending) ይሆናል።
          </p>
        </div>
      </div>

      {/* PENDING NOTIFICATION BANNER IF STATUS IS PENDING */}
      {status === 'PENDING' && (
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-300 dark:border-amber-700 shadow-md space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-200 dark:bg-amber-900 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-amber-700 dark:text-amber-300 animate-spin" />
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200 text-[11px] font-extrabold uppercase">
                  Pending (በመረጋገጥ ላይ)
                </span>
                <span className="text-xs text-amber-800 dark:text-amber-300 font-bold">
                  {activeGrade}ኛ ክፍል • {currentGradePrice} ETB
                </span>
              </div>
              <h3 className="font-extrabold text-sm sm:text-base text-amber-950 dark:text-amber-100">
                ክፍያዎ በመረጋገጥ ላይ ነው (Pending Verification)
              </h3>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                ያስገቡት የክፍያ ማረጋገጫ (FT ቁጥር) በዋና አስተዳዳሪ {superAdminContact.name} እየተፈተሸ ነው። ክፍያው ቼክ እስከሚደረግ ድረስ ሲስተሙ በመጠባበቅ ላይ (Pending) ነው።
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-amber-200 dark:border-amber-800/60 text-xs">
            <button
              type="button"
              onClick={refreshState}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" /> ሁኔታውን በድጋሚ ፈትሽ (Refresh Status)
            </button>
            <a
              href={`tel:${superAdminContact.phone}`}
              className="text-amber-900 dark:text-amber-200 font-bold flex items-center gap-1 hover:underline"
            >
              <PhoneCall className="w-3.5 h-3.5" /> ለፈጣን ማረጋገጫ፡ {superAdminContact.phone} (ኑርዬ አህመድ አደም)
            </a>
          </div>
        </div>
      )}

      {/* Pricing Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => {
          const isSelected = selectedPlan === p.id;
          return (
            <div
              key={p.id}
              onClick={() => setSelectedPlan(p.id as any)}
              className={`p-5 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-white dark:bg-slate-900 ring-2 ring-emerald-500/20 shadow-md'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-emerald-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400">{p.duration}</span>
                  {p.tag && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                      {p.tag}
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">{p.title}</h3>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                  {p.price} <span className="text-xs font-bold text-slate-400">ETB</span>
                </div>
              </div>
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>{isSelected ? '✓ የተመረጠ' : 'ይምረጡ'}</span>
                {isSelected && <Check className="w-4 h-4" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment Gateway Accounts & Submission Box */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              የመክፈያ ባንክ ወይም መተግበሪያ ይምረጡ (5 Verified Accounts):
            </h3>
            <span className="text-xs font-bold text-emerald-600">ባለቤት፡ Nuriye Ahmed Adem</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {accounts.map((acc) => {
              const isSelected = provider === acc.id;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setProvider(acc.id)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                  }`}
                >
                  <span className="text-xs font-black block truncate text-slate-900 dark:text-white">
                    {acc.name[language] || acc.name.am}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block truncate mt-0.5">
                    {acc.accountNumberOrPhone}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Account Instructions Card */}
        {(() => {
          const acc = accounts.find((a) => a.id === provider) || accounts[0];
          return (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">የተመረጠው የክፍያ መረጃ፡</span>
                <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                  {acc.name[language] || acc.name.am}: {acc.accountNumberOrPhone}
                </span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  የሂሳብ ስም፡ <strong className="text-slate-800 dark:text-slate-200">{acc.accountName}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(acc.accountNumberOrPhone, acc.id)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-bold flex items-center gap-1.5 cursor-pointer text-slate-700 dark:text-slate-200 text-xs shrink-0"
              >
                {copiedId === acc.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedId === acc.id ? 'ኮፒ ተደርጓል!' : 'ቁጥሩን ኮፒ አድርግ'}
              </button>
            </div>
          );
        })()}

        {/* Submission Form */}
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                የከፈሉበት ስልክ ቁጥር / Sender Phone:
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0910000000"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                የትራንዛክሽን ቁጥር / FT Reference Code:
              </label>
              <input
                type="text"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                placeholder="ለምሳሌ፡ FT26049281 ወይም CBE-9981240"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm focus:ring-2 focus:ring-emerald-500 outline-none uppercase font-mono"
              />
            </div>
          </div>

          {error && (
            <div role="alert" className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 text-xs text-red-800 dark:text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            disabled={processing}
            onClick={handleVerify}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
            {t('verify_payment')} ({cur.price} ETB)
          </button>
        </div>

        {receipt && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> ጥያቄዎ ተልኳል፤ ሲስተሙ ቼክ እስከሚደረግ ድረስ በPending ሁኔታ ይቆያል።
            </span>
            <span className="font-mono">{receipt.id.slice(0, 10)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

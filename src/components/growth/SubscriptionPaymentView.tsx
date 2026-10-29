import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { FirebaseService } from '../../services/firebaseService';
import { CreditCard, ShieldCheck, CheckCircle, Loader2, Check } from 'lucide-react';

export const SubscriptionPaymentView: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [selectedPlan, setSelectedPlan] = useState<'month' | 'semester' | 'year'>('semester');
  const [provider, setProvider] = useState<'Telebirr' | 'CBE'>('Telebirr');
  const [phone, setPhone] = useState('');
  const [refNo, setRefNo] = useState('');
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<{ id: string } | null>(null);
  const [error, setError] = useState('');

  const plans = [
    { id: 'month', title: 'የ1 ወር መደበኛ / 1 Month Pass', price: 199, duration: '1 Month' },
    { id: 'semester', title: 'የሙሉ ሴሚስተር / Full Semester Pass', price: 499, duration: 'Semester Pass', popular: true },
    { id: 'year', title: 'የዓመት ሙሉ / Full Year VIP', price: 899, duration: 'Yearly Pass' },
  ];
  const cur = plans.find((p) => p.id === selectedPlan) || plans[1];

  const handleVerify = async () => {
    setError('');
    if (!isAuthenticated) {
      setError('መጀመሪያ ይግቡ / Please log in first.');
      return;
    }
    if (refNo.trim().length < 6 || phone.trim().length < 9) {
      setError('የስልክ ቁጥርና የግብይት ቁጥር (Transaction ID) በትክክል ያስገቡ / Enter a valid phone number and transaction ID.');
      return;
    }
    setProcessing(true);
    try {
      const id = await FirebaseService.submitPaymentRequest({
        provider,
        transactionId: refNo,
        amount: cur.price,
        phone,
        plan: cur.duration,
      });
      setReceipt({ id });
    } catch (e) {
      console.error(e);
      setError('ጥያቄው አልተላከም፣ እንደገና ይሞክሩ / Could not submit, please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white shadow-md">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-700 text-[11px] font-bold uppercase mb-1">
          <CreditCard className="w-3.5 h-3.5" />
          {t('mod_subscription_payment')}
        </div>
        <h1 className="text-xl sm:text-2xl font-black">{t('mod_subscription_payment')}</h1>
        <p className="text-xs sm:text-sm text-emerald-100">{t('mod_subscription_payment_sub')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((p) => (
          <div
            key={p.id}
            onClick={() => setSelectedPlan(p.id as any)}
            className={`p-6 rounded-3xl border cursor-pointer transition-all flex flex-col justify-between ${
              selectedPlan === p.id ? 'border-emerald-500 bg-white dark:bg-slate-900 ring-2 ring-emerald-500/20' : 'bg-slate-50 dark:bg-slate-900/60'
            }`}
          >
            <div>
              <div className="text-xs uppercase font-bold text-slate-400">{p.duration}</div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white mt-1">{p.title}</h3>
              <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
                {p.price} <span className="text-xs font-bold text-slate-400">ETB</span>
              </div>
            </div>
            <div className="pt-4 border-t mt-3 flex items-center justify-between text-xs font-bold text-emerald-600">
              <span>{selectedPlan === p.id ? '✓ የተመረጠ' : 'ይምረጡ'}</span>
              {selectedPlan === p.id && <Check className="w-4 h-4" />}
            </div>
          </div>
        ))}
      </div>

      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-black text-sm text-slate-900 dark:text-white">የክፍያ ዘዴ / Gateway:</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setProvider('Telebirr')}
            className={`p-3 rounded-xl border text-left text-xs font-bold cursor-pointer ${
              provider === 'Telebirr' ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200' : 'border-slate-200'
            }`}
          >
            ቴሌብር (Telebirr)
          </button>
          <button
            type="button"
            onClick={() => setProvider('CBE')}
            className={`p-3 rounded-xl border text-left text-xs font-bold cursor-pointer ${
              provider === 'CBE' ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200' : 'border-slate-200'
            }`}
          >
            ንግድ ባንክ (CBE)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="ስልክ ቁጥር / Phone (09...)"
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
          />
          <input
            type="text"
            value={refNo}
            onChange={(e) => setRefNo(e.target.value)}
            placeholder="የግብይት ቁጥር / Transaction ID"
            className="px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-sm"
          />
        </div>
        {error && <div role="alert" className="text-xs text-red-700 dark:text-red-300">{error}</div>}

        <button
          type="button"
          disabled={processing}
          onClick={handleVerify}
          className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
          {t('verify_payment')} ({cur.price} ETB)
        </button>

        {receipt && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-xs text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" /> ጥያቄዎ ተልኳል፤ አስተዳዳሪው ካረጋገጠ በኋላ ፕሪሚየም ይነቃል። / Request sent — Premium activates once an admin verifies it.
            </span>
            <span className="font-mono">{receipt.id.slice(0, 8)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

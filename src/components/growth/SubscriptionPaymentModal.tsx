import React, { useState } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { PaymentGatewayId } from '../../types/payment';
import { authFetch } from '../../services/apiClient';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  PhoneCall,
  Loader2,
  Sparkles,
  Lock,
  Send,
  MessageSquare,
} from 'lucide-react';

interface SubscriptionPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItemTitle?: string;
  singlePriceETB?: number;
}

export const SubscriptionPaymentModal: React.FC<SubscriptionPaymentModalProps> = ({
  isOpen,
  onClose,
  targetItemTitle,
  singlePriceETB = 57,
}) => {
  const {
    accounts,
    currentGradePrice,
    submitPayment,
    refreshState,
    superAdminContact,
  } = useSubscription();

  const { currentUser, activeGrade } = useAuth();
  const { language } = useLanguage();

  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayId>('telebirr');
  const [transactionRef, setTransactionRef] = useState('');
  const [phone, setPhone] = useState('');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeAccount = accounts.find((a) => a.id === selectedGateway) || accounts[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRef = transactionRef.trim();
    const cleanPhone = (phone || '0910000000').trim();

    if (!cleanRef || cleanRef.length < 3) {
      setSubmitError('እባክዎ ትክክለኛ የግብይት ማረጋገጫ (FT Reference) ያስገቡ።');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    const res = await submitPayment(
      selectedGateway,
      cleanRef,
      cleanPhone
    );

    // Notify backend server directly
    try {
      await authFetch('/api/payment/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: currentUser.id,
          studentName: currentUser.name,
          studentEmail: currentUser.email,
          studentPhone: cleanPhone,
          grade: activeGrade,
          amount: singlePriceETB || currentGradePrice,
          paymentGateway: selectedGateway,
          transactionRef: cleanRef,
          plan: targetItemTitle || `Grade ${activeGrade} Access`,
        }),
      });
    } catch (err) {
      console.warn('Backend payment notify error:', err);
    }

    setIsSubmitting(false);
    if (res.success) {
      setSubmitSuccess(true);
      refreshState();
    } else {
      setSubmitError(res.error || 'ክፍያውን ማረጋገጥ አልተቻለም።');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-2xl p-6 space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            የክፍያ ማረጋገጫ (Direct Telebirr & CBE Payment)
          </div>
          <h3 className="text-xl font-black text-white">
            {targetItemTitle || `የ ${activeGrade}ኛ ክፍል ፕሪሚየም ፍቃድ`}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            ወርሃዊ ተመን: <b>{currentGradePrice} ETB</b> | ፕሪሚየም ማዕከል / ነጠላ ጥቅል: <b>{singlePriceETB} ETB</b>
          </p>
        </div>

        {submitSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-center space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase">
                ✓ Delivered to Super Admin
              </span>
              <h4 className="text-lg font-black text-white mt-1">
                የትራንዛክሽን ቁጥርህ (FT: {transactionRef}) ወደ ዋና አስተዳዳሪ ተልኳል!
              </h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed mt-1">
                የላኩት የግብይት ማረጋገጫ ቁጥር ወደ ዋና አስተዳዳሪ <b>{superAdminContact.name} ({superAdminContact.phone})</b> ገቢ ሆኗል።
                በጥቂት ደቂቃዎች ውስጥ ተረጋግጦ ፈቃድዎ ይነቃል።
              </p>
            </div>

            {/* Quick Action Buttons to contact Admin */}
            <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 text-left">
              <span className="text-[11px] font-bold text-slate-400 block">
                ለበለጠ ፍጥነት ወደ አድሚን በቀጥታ ይላኩ:
              </span>
              <div className="flex flex-wrap gap-2">
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent('https://service-9-12-nur-ai-school-erp.ai.studio')}&text=${encodeURIComponent(
                    `ሰላም አድሚን (ኑርዬ)፣ የክፍያ ማረጋገጫ ልኬያለሁ፦\n• ተማሪ፦ ${currentUser.name}\n• ክፍል፦ ${activeGrade}ኛ ክፍል\n• መንገድ፦ ${selectedGateway.toUpperCase()}\n• FT ቁጥር፦ ${transactionRef}\n• ስልክ፦ ${phone || '09...'}\nእባክዎ ፈቃዴን ያጽድቁ።`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  በቴሌግራም ላክ
                </a>
                <a
                  href={`sms:${superAdminContact.phone}?body=${encodeURIComponent(
                    `ሰላም ኑርዬ፣ የክፍያ ማረጋገጫ FT ቁጥር፦ ${transactionRef}፣ ተማሪ፦ ${currentUser.name}፣ ስልክ፦ ${phone || ''}`
                  )}`}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  በSMS ላክ (0910097862)
                </a>
                <a
                  href={`tel:${superAdminContact.phone}`}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  ደውል (0910097862)
                </a>
              </div>
            </div>

            <button
              onClick={onClose}
              className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition"
            >
              ተመለስ (Close)
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Gateway Selector Tabs */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">የክፍያ መንገድ ይምረጡ:</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {accounts.map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => setSelectedGateway(acc.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      selectedGateway === acc.id
                        ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-800/80 border-slate-700/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[11px] font-bold truncate">
                      {acc.name[language] || acc.name.am}
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-mono">
                      {acc.accountNumberOrPhone}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Account Card & Instructions */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400">የተቀባይ ስም:</span>
                  <div className="text-sm font-bold text-amber-300">{activeAccount.accountName}</div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">የሂሳብ ቁጥር:</span>
                  <div className="text-sm font-mono font-bold text-white flex items-center gap-1.5">
                    <span>{activeAccount.accountNumberOrPhone}</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeAccount.accountNumberOrPhone, activeAccount.id)}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      title="ኮፒ አድርግ"
                    >
                      {copiedAccount === activeAccount.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-2">
                {activeAccount.instructions[language] || activeAccount.instructions.am}
              </p>
            </div>

            {/* Transaction Ref and Phone input */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-300">
                  የግብይት ማረጋገጫ ቁጥር (FT Reference / Trx ID) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FT2409829X..."
                  value={transactionRef}
                  onChange={(e) => setTransactionRef(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">የከፋዩ ስልክ ቁጥር (Phone Number)</label>
                <input
                  type="tel"
                  placeholder="09..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {submitError && (
              <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-xs text-rose-300">
                {submitError}
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  እየተላከ ነው...
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  ክፍያውን አረጋግጥ እና ፍቃድ አግብር (Submit Reference)
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

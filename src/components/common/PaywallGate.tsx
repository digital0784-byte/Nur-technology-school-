import React, { useState } from 'react';
import { useSubscription } from '../../context/SubscriptionContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { PaymentGatewayId } from '../../types/payment';
import {
  Lock,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Copy,
  Check,
  PhoneCall,
  ArrowRight,
  FileText,
  Sparkles,
} from 'lucide-react';

interface PaywallGateProps {
  children: React.ReactNode;
  moduleTitle?: string;
  allowFreePreview?: boolean;
  freePreviewNode?: React.ReactNode;
}

export const PaywallGate: React.FC<PaywallGateProps> = ({
  children,
  moduleTitle,
  allowFreePreview = false,
  freePreviewNode,
}) => {
  const {
    status,
    isUnlocked,
    subscription,
    accounts,
    currentGradePrice,
    submitPayment,
    refreshState,
    superAdminContact,
  } = useSubscription();

  const { currentUser, isSuperAdmin, activeGrade } = useAuth();
  const { t, language } = useLanguage();

  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayId>('telebirr');
  const [transactionRef, setTransactionRef] = useState('');
  const [phone, setPhone] = useState(currentUser.email.startsWith('09') ? currentUser.email : '0910000000');
  const [receiptUrl, setReceiptUrl] = useState('');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // If user is unlocked (Super Admin or Active Subscription), render child component directly
  if (isUnlocked) {
    return (
      <div className="relative">
        {/* Subtle VIP / Super Admin indicator badge */}
        <div className="mb-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {isSuperAdmin
                ? '🛡️ Super Admin Permanent Access (Nuriye Ahmed Adem)'
                : `✓ ${t('pay_status_active')} (${subscription.daysRemaining} ${t('days_remaining')})`}
            </span>
          </div>
          <span className="font-mono text-[10px] opacity-75">
            {activeGrade}ኛ ክፍል • {currentGradePrice} ETB/Month
          </span>
        </div>
        {children}
      </div>
    );
  }

  // Handle account number copy
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(id);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  // Handle payment submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      setSubmitError(t('enter_ft_ref') || 'እባክዎ የትራንዛክሽን ቁጥር ያስገቡ');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    const res = await submitPayment(selectedGateway, transactionRef.trim(), phone, receiptUrl);
    setSubmitting(false);

    if (res.success) {
      setShowSubmitModal(false);
      setTransactionRef('');
    } else {
      setSubmitError(res.error || 'Failed to submit payment');
    }
  };

  // Case 1: Status is PENDING
  if (status === 'PENDING') {
    return (
      <div className="max-w-2xl mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 shadow-xl space-y-6 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-600 mx-auto flex items-center justify-center ring-8 ring-amber-50 dark:ring-amber-900/20">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
            {t('pay_status_pending')}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            ክፍያዎ በመረጋገጥ ላይ ነው (Verification Pending)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            ያስገቡት የክፍያ ማረጋገጫ (FT ቁጥር) በዋና አስተዳዳሪ {superAdminContact.name} እየተፈተሸ ነው። በአጭር ደቂቃዎች ውስጥ ተረጋግጦ ይከፈትልዎታል።
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">የተማሪ ስም፡</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{currentUser.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">የክፍል ደረጃ፡</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">{activeGrade}ኛ ክፍል</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">የተከፈለው መጠን፡</span>
            <span className="font-bold text-emerald-600">{currentGradePrice} ETB</span>
          </div>
          {subscription.activePaymentId && (
            <div className="flex justify-between">
              <span className="text-slate-500">የትራንዛክሽን መለያ፡</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">{subscription.activePaymentId}</span>
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={refreshState}
            className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition"
          >
            <Clock className="w-4 h-4" />
            ሁኔታውን በድጋሚ ፈትሽ (Refresh Status)
          </button>

          <a
            href={`tel:${superAdminContact.phone}`}
            className="px-5 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
          >
            <PhoneCall className="w-4 h-4" />
            ለፈጣን ማረጋገጫ ይደውሉ ({superAdminContact.phone})
          </a>
        </div>
      </div>
    );
  }

  // Case 2: Status is REJECTED
  if (status === 'REJECTED') {
    return (
      <div className="max-w-2xl mx-auto my-8 p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-rose-200 dark:border-rose-900 shadow-xl space-y-6 text-center animate-in fade-in">
        <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 mx-auto flex items-center justify-center ring-8 ring-rose-50 dark:ring-rose-900/20">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300 font-bold text-xs uppercase tracking-wider">
            {t('pay_status_rejected')}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            ያስገቡት ክፍያ ውድቅ ተደርጓል
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
            ምክንያት፡ {subscription.rejectionReason || 'የተሳሳተ የትራንዛክሽን ኮድ ወይም ያልተሟላ ክፍያ። እባክዎ ትክክለኛውን ኮድ በማስገባት በድጋሚ ይሞክሩ።'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSubmitModal(true)}
          className="px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md inline-flex items-center gap-2 transition"
        >
          {t('resubmit_payment')}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Case 3: Status is NONE or EXPIRED -> The Full Paywall Gate
  const activeAccountObj = accounts.find((a) => a.id === selectedGateway) || accounts[0];

  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto my-6">
      {/* Free Preview Snippet if provided */}
      {allowFreePreview && freePreviewNode && (
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 opacity-70 pointer-events-none filter blur-[0.5px]">
          {freePreviewNode}
        </div>
      )}

      {/* Paywall Container */}
      <div className="rounded-3xl bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
            {moduleTitle ? `${moduleTitle} • ` : ''}{t('paywall_gate_title')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            የ{activeGrade}ኛ ክፍል ሙሉ የመማሪያ ፈቃድ ያግኙ
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
            {t('paywall_gate_desc')}
          </p>

          {/* Pricing Highlight */}
          <div className="inline-flex items-baseline gap-2 px-5 py-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200 mt-2">
            <span className="text-xs font-bold uppercase">{activeGrade}ኛ ክፍል ወርሃዊ ተመን፡</span>
            <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {currentGradePrice}
            </span>
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">ETB / 30 ቀናት</span>
          </div>
        </div>

        {/* 5 Ethiopian Verified Bank Gateways Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
              የመክፈያ ባንክ ይምረጡ (5 Verified Ethiopian Gateways):
            </h3>
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">
              ባለቤት፡ Nuriye Ahmed Adem
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {accounts.map((acc) => {
              const isSelected = selectedGateway === acc.id;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setSelectedGateway(acc.id)}
                  className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-xs font-black block truncate text-slate-900 dark:text-white">
                      {acc.name[language] || acc.name.am}
                    </span>
                    <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                      {acc.methodType === 'ussd_and_app' ? acc.ussdCode : 'የሂሳብ ቁጥር'}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="mt-2 text-right">
                      <span className="inline-block w-2 h-2 rounded-full bg-indigo-600" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Account Details & 1-Click Copy Box */}
        {activeAccountObj && (
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-slate-800/70 border border-slate-300 dark:border-slate-700 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500">
                  የተመረጠው የክፍያ አካውንት (Nuriye Ahmed Adem)
                </span>
                <div className="text-lg sm:text-xl font-mono font-black text-slate-900 dark:text-white tracking-wider">
                  {activeAccountObj.accountNumberOrPhone}
                </div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  ስም፡ {activeAccountObj.accountName} {activeAccountObj.ussdCode && `• ፈጣን መደወያ፡ ${activeAccountObj.ussdCode}`}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(activeAccountObj.accountNumberOrPhone, activeAccountObj.id)}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  {copiedAccount === activeAccountObj.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      {t('copied_notice')}
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      {t('copy_number')}
                    </>
                  )}
                </button>

                {activeAccountObj.ussdCode && (
                  <a
                    href={`tel:${encodeURIComponent(activeAccountObj.ussdCode)}`}
                    className="px-3 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center gap-1"
                  >
                    ደውል ({activeAccountObj.ussdCode})
                  </a>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200 dark:border-slate-700 pt-2.5">
              💡 {activeAccountObj.instructions[language] || activeAccountObj.instructions.am}
            </p>
          </div>
        )}

        {/* Verification Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              ክፍያውን ፈጽመዋል? የግብይት ቁጥሩን (FT Code) እዚህ ያስገቡ፡
            </h4>
            <span className="text-xs font-bold text-emerald-600">
              የሚከፈለው፡ {currentGradePrice} ETB
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                የትራንዛክሽን ቁጥር / FT Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder="ለምሳሌ: FT26049281 ወይም TXN-99820..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
                የከፋዩ ስልክ ቁጥር
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 dark:text-slate-300 mb-1">
              {t('upload_receipt_optional')}
            </label>
            <input
              type="text"
              value={receiptUrl}
              onChange={(e) => setReceiptUrl(e.target.value)}
              placeholder="የደረሰኝ ምስል ሊንክ ወይም የካሜራ ስናፕሾት ዩአርኤል (አማራጭ)"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          {submitError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-300 text-rose-700 dark:text-rose-300 text-xs font-semibold">
              ⚠️ {submitError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              {submitting ? 'በማስገባት ላይ...' : `ክፍያውን አስረክብ (${currentGradePrice} ETB / 30 ቀናት)`}
            </button>

            <a
              href={`tel:${superAdminContact.phone}`}
              className="px-4 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-50 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-600" />
              አስተዳዳሪን ያግኙ ({superAdminContact.phone})
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { GradeLevel } from '../types';
import { X, Lock, ShieldCheck, UserCheck, GraduationCap } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginAsStudent, loginAsSuperAdmin, completeOnboarding } = useAuth();
  const { t } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(10);
  const [studentName, setStudentName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === 'mejennur669@gmail.com') {
      loginAsSuperAdmin();
      onClose();
      return;
    }
    completeOnboarding(selectedGrade, studentName || 'ተማሪ (Student)');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              {mode === 'login' ? 'መግቢያ / Account Login' : 'አዲስ ምዝገባ / Student Registration'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-bold text-slate-700 dark:text-slate-300">ሙሉ ስም / Full Name:</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Almaz Tadesse"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">ኢሜይል / Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. mejennur669@gmail.com or student@nur.edu.et"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 dark:text-slate-300">የይለፍ ቃል / Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
            />
          </div>

          {/* One-time Grade Picker */}
          <div className="space-y-1.5 pt-1">
            <label className="font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>የክፍል ደረጃ መቆለፊያ (Grade Selection):</span>
              <span className="text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3" /> Strictly Locked
              </span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[9, 10, 11, 12].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setSelectedGrade(lvl as GradeLevel)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    selectedGrade === lvl
                      ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                      : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Grade {lvl}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all mt-2"
          >
            {mode === 'login' ? 'ይግቡ / Enter System' : 'ይመዝገቡ / Confirm Registration'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
            >
              {mode === 'login' ? 'አዲስ ተጠቃሚ ነዎት? ይመዝገቡ' : 'መለያ አለዎት? ይግቡ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

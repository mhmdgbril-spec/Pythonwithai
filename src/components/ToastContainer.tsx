import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ToastNotification } from '../types';
import { 
  Zap, 
  CheckCircle2, 
  Trophy, 
  Award, 
  Check, 
  Info, 
  X,
  Sparkles
} from 'lucide-react';

interface Props {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<Props> = ({ toasts, onDismiss }) => {
  return (
    <aside 
      aria-live="polite" 
      aria-label="تنبيهات المنصة"
      className="fixed bottom-24 left-6 z-50 flex flex-col-reverse gap-3 max-w-sm w-full pointer-events-none"
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => {
          let bgClass = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white';
          let icon = <Info className="w-5 h-5 text-blue-500" />;

          if (toast.type === 'xp') {
            bgClass = 'bg-gradient-to-r from-amber-50 to-white dark:from-slate-900 dark:to-slate-850 border-amber-300/80 dark:border-amber-700/50 shadow-amber-500/10';
            icon = (
              <div className="p-2 rounded-xl bg-amber-500 text-white shadow-sm flex items-center justify-center">
                <Zap className="w-4 h-4 fill-white" />
              </div>
            );
          } else if (toast.type === 'lesson_complete') {
            bgClass = 'bg-gradient-to-r from-emerald-50 to-white dark:from-slate-900 dark:to-slate-850 border-emerald-300/80 dark:border-emerald-700/50 shadow-emerald-500/10';
            icon = (
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            );
          } else if (toast.type === 'level_up') {
            bgClass = 'bg-gradient-to-r from-purple-50 to-white dark:from-slate-900 dark:to-slate-850 border-purple-300/80 dark:border-purple-700/50 shadow-purple-500/10';
            icon = (
              <div className="p-2 rounded-xl bg-purple-600 text-white shadow-sm flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
            );
          } else if (toast.type === 'badge') {
            bgClass = 'bg-gradient-to-r from-rose-50 to-white dark:from-slate-900 dark:to-slate-850 border-rose-300/80 dark:border-rose-700/50 shadow-rose-500/10';
            icon = (
              <div className="p-2 rounded-xl bg-rose-600 text-white shadow-sm flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            );
          } else if (toast.type === 'success') {
            bgClass = 'bg-gradient-to-r from-emerald-50 to-white dark:from-slate-900 dark:to-slate-850 border-emerald-300/80 dark:border-emerald-700/50';
            icon = (
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-sm flex items-center justify-center">
                <Check className="w-4 h-4" />
              </div>
            );
          }

          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 450, damping: 30 }}
              className={`pointer-events-auto p-4 rounded-2xl border shadow-lg ${bgClass} relative overflow-hidden backdrop-blur-md`}
              role="status"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {icon}
                </div>

                <div className="flex-1 text-right">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{toast.title}</span>
                      {toast.type === 'xp' && (
                        <span className="inline-flex items-center gap-0.5 text-[11px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full">
                          <Sparkles className="w-3 h-3" />
                          +{toast.xpAmount || 25} XP
                        </span>
                      )}
                    </h4>

                    <button
                      onClick={() => onDismiss(toast.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                      aria-label="إغلاق التنبيه"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                    {toast.message}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </aside>
  );
};

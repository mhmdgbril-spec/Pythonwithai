import React from 'react';
import { TabType, ColorThemeId } from '../types';
import { COLOR_THEMES } from '../utils/theme';
import { Heart, School, Code, Palette } from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  onNavigateTab: (tab: TabType) => void;
  onOpenThemeModal: () => void;
  currentTheme: ColorThemeId;
  soundEnabled: boolean;
}

export const Footer: React.FC<Props> = ({
  onNavigateTab,
  onOpenThemeModal,
  currentTheme,
  soundEnabled
}) => {
  const theme = COLOR_THEMES[currentTheme] || COLOR_THEMES.emerald;

  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-right">
          {/* Brand and Teacher Credit */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: theme.primary }}
              />
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Hero of Python — منصة بطل بايثون والتقنية الرقمية
              </span>
              <span className="text-xs text-slate-400">· إصدار 2026</span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              إعداد وتدريس: <strong className="text-slate-700 dark:text-slate-200">أ/ محمد جبريل</strong> · معلم التقنية الرقمية والحاسب الآلي
            </p>
            <p className="text-[11px] text-slate-400">
              مدارس النخبة العلمية الأهلية بالدمام · المملكة العربية السعودية
            </p>
          </div>

          {/* Quick Footer Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onNavigateTab('path');
              }}
              className="hover:text-emerald-600 transition"
            >
              مسار التعلّم
            </button>
            <span>·</span>
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onNavigateTab('book');
              }}
              className="hover:text-emerald-600 transition"
            >
              كتاب الذكاء الاصطناعي
            </button>
            <span>·</span>
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onNavigateTab('playground');
              }}
              className="hover:text-emerald-600 transition"
            >
              المختبر التفاعلي
            </button>
            <span>·</span>
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onNavigateTab('coverage');
              }}
              className="hover:text-emerald-600 transition"
            >
              التغطية والمنهج
            </button>
            <span>·</span>
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onNavigateTab('exam');
              }}
              className="hover:text-emerald-600 transition"
            >
              الامتحان والشهادة
            </button>
            <span>·</span>
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onOpenThemeModal();
              }}
              className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>تبديل ألوان المنصة</span>
            </button>
          </div>
        </div>

        {/* License Notice */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>
            الكود البرمجي للمنصة برخصة MIT مفتوحة المصدر، ومحتوى الدروس والأنشطة التعليمية برخصة المشاع الإبداعي CC BY-SA 4.0.
          </p>
          <div className="flex items-center gap-1">
            <span>صُنع بشغف لطلابنا في</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">مدارس النخبة العلمية بالدمام</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

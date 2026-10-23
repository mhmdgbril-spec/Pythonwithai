import React from 'react';
import { ColorThemeId } from '../types';
import { COLOR_THEMES } from '../utils/theme';
import { X, Check, Palette, Sparkles } from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ColorThemeId;
  onSelectTheme: (themeId: ColorThemeId) => void;
  soundEnabled: boolean;
}

export const ColorThemeModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  soundEnabled
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden transition-all duration-300"
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h2 id="theme-modal-title" className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                تخصيص مظهر وألوان المنصة
                <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                  إضافات التصميم
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                اختر النسق اللوني الأنسب لك — يتم تطبيق التغيير فورًا وحفظه على جهازك
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playSound('click', soundEnabled);
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            aria-label="إغلاق نافذة الألوان"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Theme grid */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(COLOR_THEMES).map((theme) => {
              const isSelected = currentTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    playSound('success', soundEnabled);
                    onSelectTheme(theme.id);
                  }}
                  className={`relative p-5 rounded-2xl text-right transition-all duration-200 flex flex-col justify-between border-2 ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div>
                    {/* Color Swatch Circles */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        {theme.previewColors.map((color, i) => (
                          <span
                            key={i}
                            className="w-5 h-5 rounded-full shadow-sm border border-white dark:border-slate-900 inline-block"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                          <Check className="w-3.5 h-3.5" />
                          المظهر المفعّل
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1 flex items-center justify-between">
                      {theme.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {theme.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {theme.nameEn}
                    </span>
                    <span 
                      className="text-xs px-2.5 py-1 rounded-lg font-medium text-white shadow-sm"
                      style={{ backgroundColor: theme.primary }}
                    >
                      معاينة اللون
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 mt-4">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
              <strong>ملاحظة تربوية من أ/ محمد جبريل:</strong> تم تصميم هذه الألوان خصيصًا لتوفير أقصى درجات التباين المريح للنظر أثناء البرمجة المعملية في مدارس النخبة العلمية، سواء في البيئة المضيئة أو الوضع الليلي.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 flex justify-end">
          <button
            onClick={() => {
              playSound('click', soundEnabled);
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl font-semibold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm hover:shadow"
          >
            تم واكتمال
          </button>
        </div>
      </div>
    </div>
  );
};

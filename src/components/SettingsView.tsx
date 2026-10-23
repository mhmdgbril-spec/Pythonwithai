import React from 'react';
import { AppSettings, ColorThemeId, StudentProfile, DisplayMode } from '../types';
import { COLOR_THEMES } from '../utils/theme';
import { 
  Palette, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  EyeOff, 
  Download, 
  Upload, 
  Trash2, 
  Check, 
  Keyboard, 
  ShieldAlert,
  Sparkles,
  Sliders
} from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  student: StudentProfile;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
  soundEnabled: boolean;
}

export const SettingsView: React.FC<Props> = ({
  settings,
  onUpdateSettings,
  student,
  onExportData,
  onImportData,
  onResetData,
  soundEnabled
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn pb-16">
      {/* Page Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          الإعدادات وتخصيص المظهر
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          اضبط تجربة التعلّم وتصميم الواجهة كما تحب — كل شيء يُحفظ تلقائيًا على جهازك بأمان
        </p>
      </div>

      {/* 1. Theme Selection (Design Additions for color palette switching) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>ألوان وهوية المنصة (إضافات التصميم)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  تبديل الألوان
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                اختر النسق اللوني المفضل لديك — صُممت اللوحات خصيصًا لتناسب راحة العين
              </p>
            </div>
          </div>
        </div>

        {/* Color Palette Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Object.values(COLOR_THEMES).map((theme) => {
            const isSelected = settings.theme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  playSound('success', soundEnabled);
                  onUpdateSettings({ theme: theme.id });
                }}
                className={`p-4 rounded-2xl text-right border-2 transition flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      {theme.previewColors.map((c, i) => (
                        <span
                          key={i}
                          className="w-4 h-4 rounded-full border border-white dark:border-slate-800"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {theme.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {theme.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[10px] font-mono text-slate-400">
                  {theme.nameEn}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Display Mode (Light / Dark / System) */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          نمط العرض (الوضع النهاري والليلي)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'light', label: 'فاتح (نهاري)', icon: Sun },
            { id: 'dark', label: 'داكن دافئ (ليلي)', icon: Moon },
            { id: 'system', label: 'حسب إعدادات النظام', icon: Sparkles }
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = settings.displayMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  playSound('click', soundEnabled);
                  onUpdateSettings({ displayMode: mode.id as DisplayMode });
                }}
                className={`p-4 rounded-2xl flex items-center justify-between border-2 transition ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20 font-bold text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs">
                  <Icon className="w-4 h-4 text-emerald-500" />
                  <span>{mode.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Font Size Slider */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-emerald-500" />
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">حجم الخط</h2>
              <p className="text-xs text-slate-500">تحكم بحجم نصوص المنصة لقراءة مريحة</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800">
            {settings.fontSizePercent}%
          </span>
        </div>

        <input
          type="range"
          min="85"
          max="125"
          step="5"
          value={settings.fontSizePercent}
          onChange={(e) => onUpdateSettings({ fontSizePercent: parseInt(e.target.value, 10) })}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>صغير (85%)</span>
          <span>افتراضي (100%)</span>
          <span>كبير (125%)</span>
        </div>
      </div>

      {/* 4. Accessibility and Sound Switches */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          خيارات التعلّم والتفاعل
        </h2>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
          {/* Calm Mode */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                الوضع الهادئ (Calm Mode)
              </div>
              <div className="text-xs text-slate-500">
                يخفي نقاط الخبرة والأوسمة والاحتفالات — تعلّم صافٍ بدون إغراءات
              </div>
            </div>
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onUpdateSettings({ calmMode: !settings.calmMode });
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.calmMode ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.calmMode ? 'translate-x-0' : '-translate-x-6'
              }`} />
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                المؤثرات الصوتية التفاعلية
              </div>
              <div className="text-xs text-slate-500">
                تشغيل نغمات نجاح خفيفة ومحفزة عند حل التمارين وتشغيل الكود
              </div>
            </div>
            <button
              onClick={() => {
                const nextVal = !settings.soundEnabled;
                onUpdateSettings({ soundEnabled: nextVal });
                playSound('click', nextVal);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                settings.soundEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                settings.soundEnabled ? 'translate-x-0' : '-translate-x-6'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* 5. Data Management: Backup & Export / Import */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          بياناتك وتقدّمك الدراسي
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          تقدّمك في الدروس والتمارين والامتحان يُحفظ محليًا. يمكنك تصدير نسخة احتياطية لنقلها لجهاز معمل آخر.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              playSound('click', soundEnabled);
              onExportData();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>تصدير تقدّمي (ملف JSON)</span>
          </button>

          <label className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 cursor-pointer transition">
            <Upload className="w-4 h-4 text-emerald-500" />
            <span>استيراد ملف تقدّم</span>
            <input
              type="file"
              accept=".json"
              onChange={onImportData}
              className="hidden"
            />
          </label>

          <button
            onClick={() => {
              playSound('click', soundEnabled);
              onResetData();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition"
          >
            <Trash2 className="w-4 h-4" />
            <span>إعادة تعيين وبدء من الصفر</span>
          </button>
        </div>
      </div>

      {/* 6. Keyboard Shortcuts reference */}
      <div className="rounded-3xl p-6 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
          <Keyboard className="w-4 h-4 text-emerald-500" />
          <span>اختصارات لوحة المفاتيح السريعة:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono">Ctrl + Enter</kbd> : تشغيل الكود في المحرر</div>
          <div><kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono">Esc</kbd> : إغلاق النوافذ المنبثقة</div>
        </div>
      </div>
    </div>
  );
};

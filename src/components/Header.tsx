import React from 'react';
import { TabType, ColorThemeId, StudentProfile } from '../types';
import { COLOR_THEMES } from '../utils/theme';
import { 
  Palette, 
  Sun, 
  Moon, 
  Terminal, 
  Award, 
  BookOpen, 
  BookText,
  FileCheck2, 
  Compass, 
  GraduationCap, 
  Settings, 
  Flame, 
  Zap,
  User,
  School
} from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  currentTheme: ColorThemeId;
  onOpenThemeModal: () => void;
  isDark: boolean;
  onToggleDark: () => void;
  student: StudentProfile;
  onOpenProfile: () => void;
  soundEnabled: boolean;
}

export const Header: React.FC<Props> = ({
  activeTab,
  onSelectTab,
  currentTheme,
  onOpenThemeModal,
  isDark,
  onToggleDark,
  student,
  onOpenProfile,
  soundEnabled
}) => {
  const theme = COLOR_THEMES[currentTheme] || COLOR_THEMES.emerald;

  const navItems: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'لوحتي', icon: Compass },
    { id: 'path', label: 'مسار التعلّم', icon: BookOpen },
    { id: 'book', label: 'كتاب AI وبايثون', icon: BookText },
    { id: 'playground', label: 'المختبر', icon: Terminal },
    { id: 'coverage', label: 'التغطية', icon: FileCheck2 },
    { id: 'sources', label: 'المصادر', icon: School },
    { id: 'exam', label: 'الامتحان', icon: GraduationCap },
    { id: 'capstone', label: 'الكابستون', icon: Award },
    { id: 'settings', label: 'الإعدادات', icon: Settings }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Top micro bar for school and teacher announcement */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-[11px] py-1 px-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-emerald-300">Hero of Python — منصة بطل بايثون والتقنية الرقمية</span>
          <span className="text-slate-400 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden sm:inline">إشراف وتدريس: أ/ محمد جبريل</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <span className="hidden md:inline">مدارس النخبة العلمية الأهلية بالدمام</span>
          <span className="text-amber-400 font-medium">دفعة 2026</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <button
            onClick={() => {
              playSound('click', soundEnabled);
              onSelectTab('dashboard');
            }}
            className="flex items-center gap-3 text-right group focus:outline-none"
            aria-label="الرئيسية - Hero of Python"
          >
            <div 
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform group-hover:scale-105"
              style={{ backgroundColor: theme.primary }}
            >
              Py
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white">
                  Hero of Python
                </span>
                <span 
                  className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white shadow-xs"
                  style={{ backgroundColor: theme.primary }}
                >
                  بطل بايثون
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
                أ/ محمد جبريل · النخبة العلمية بالدمام
              </p>
            </div>
          </button>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60" aria-label="أقسام المنصة">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    playSound('click', soundEnabled);
                    onSelectTab(item.id);
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm ring-1 ring-slate-200 dark:ring-slate-700'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500' : ''}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action Tools: Palette Switcher, Dark Mode, Student XP, Profile */}
          <div className="flex items-center gap-2">
            {/* Color Palette Switcher Button */}
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onOpenThemeModal();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition"
              title="تغيير ألوان ومظهر الموقع"
              aria-label="تبديل ألوان الموقع"
            >
              <Palette className="w-4 h-4 text-emerald-500" />
              <span className="hidden sm:inline">ألوان المنصة</span>
              {/* Active swatch dot */}
              <span 
                className="w-3 h-3 rounded-full shadow-xs border border-white dark:border-slate-900"
                style={{ backgroundColor: theme.primary }}
              />
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onToggleDark();
              }}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition"
              title={isDark ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن'}
              aria-label="تبديل الوضع الليلي والنهاري"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Student Stats Pill (XP & Streak) */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="flex items-center gap-1 font-bold text-amber-600 dark:text-amber-400" title="أيام التفاعل المتتالية">
                <Flame className="w-3.5 h-3.5 fill-amber-500" />
                {student.streakDays}
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400" title="نقاط الخبرة XP">
                <Zap className="w-3.5 h-3.5 fill-emerald-500" />
                {student.xp} XP
              </span>
            </div>

            {/* Student Profile Trigger */}
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onOpenProfile();
              }}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 transition"
              aria-label="الملف الشخصي للطالب"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                {student.name.charAt(0) || <User className="w-3.5 h-3.5" />}
              </div>
              <span className="text-xs font-semibold hidden md:inline max-w-[100px] truncate">
                {student.name}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Horizontal Scroll */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 dark:border-slate-800 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  playSound('click', soundEnabled);
                  onSelectTab(item.id);
                }}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

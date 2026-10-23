import { ColorThemeId, ThemeConfig } from '../types';

export const COLOR_THEMES: Record<ColorThemeId, ThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: 'الزمرد النخبوي (الأخضر الملكي)',
    nameEn: 'Elite Emerald',
    description: 'الهوية الرسمية لمدارس النخبة العلمية الأهلية بالدمام — وقار وتميّز أكاديمي',
    primary: '#059669', // emerald-600
    primaryLight: '#34d399',
    primaryDark: '#064e3b',
    accent: '#f59e0b', // amber-500
    bgLight: '#f8fafc',
    cardLight: '#ffffff',
    borderLight: '#e2e8f0',
    badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800',
    gradientClass: 'from-emerald-600 to-teal-700',
    previewColors: ['#059669', '#0d9488', '#f59e0b']
  },
  cobalt: {
    id: 'cobalt',
    name: 'الأزرق السيبراني (الكوبالت والتقنية)',
    nameEn: 'Cyber Cobalt',
    description: 'طابع هندسي عصري يحاكي بيئات التطوير السحابية والأمن السيبراني',
    primary: '#2563eb', // blue-600
    primaryLight: '#60a5fa',
    primaryDark: '#1e3a8a',
    accent: '#06b6d4', // cyan-500
    bgLight: '#f8fafc',
    cardLight: '#ffffff',
    borderLight: '#e2e8f0',
    badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-300 dark:border-blue-800',
    gradientClass: 'from-blue-600 to-indigo-700',
    previewColors: ['#2563eb', '#4f46e5', '#06b6d4']
  },
  violet: {
    id: 'violet',
    name: 'البنفسجي الإبداعي (الذكاء الاصطناعي)',
    nameEn: 'Creative Violet',
    description: 'مزيج فاخر يلهم الابتكار وأبحاث الذكاء الاصطناعي والخوارزميات الذكية',
    primary: '#7c3aed', // violet-600
    primaryLight: '#a78bfa',
    primaryDark: '#4c1d95',
    accent: '#ec4899', // pink-500
    bgLight: '#faf5ff',
    cardLight: '#ffffff',
    borderLight: '#f3e8ff',
    badgeClass: 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-300 dark:border-purple-800',
    gradientClass: 'from-purple-600 to-violet-800',
    previewColors: ['#7c3aed', '#9333ea', '#ec4899']
  },
  amber: {
    id: 'amber',
    name: 'الكهرمان الذهبي (طاقة وإشراق)',
    nameEn: 'Golden Amber',
    description: 'ألوان دافئة مريحة للعين، تعزز التركيز الذهني والنشاط البرمجي',
    primary: '#d97706', // amber-600
    primaryLight: '#fbbf24',
    primaryDark: '#78350f',
    accent: '#ea580c', // orange-600
    bgLight: '#fffbeb',
    cardLight: '#ffffff',
    borderLight: '#fef3c7',
    badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-300 dark:border-amber-800',
    gradientClass: 'from-amber-600 to-orange-700',
    previewColors: ['#d97706', '#f59e0b', '#ea580c']
  },
  ruby: {
    id: 'ruby',
    name: 'الياقوت العصري (الحماسة والإنجاز)',
    nameEn: 'Modern Ruby',
    description: 'نغمة قوية وملفتة لمحبي التحديات والتطبيقات التنافسية وبناء المشاريع',
    primary: '#e11d48', // rose-600
    primaryLight: '#fb7185',
    primaryDark: '#881337',
    accent: '#f43f5e',
    bgLight: '#fff1f2',
    cardLight: '#ffffff',
    borderLight: '#ffe4e6',
    badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-300 dark:border-rose-800',
    gradientClass: 'from-rose-600 to-red-700',
    previewColors: ['#e11d48', '#f43f5e', '#be123c']
  },
  sepia: {
    id: 'sepia',
    name: 'الورقي الكلاسيكي (نمط القراءة والكتب)',
    nameEn: 'Classic Sepia',
    description: 'محاكاة لصفحات الكتب الورقية الأصيلة — أقصى درجات الراحة للقراءة المطوّلة',
    primary: '#b45309', // amber-700
    primaryLight: '#d97706',
    primaryDark: '#451a03',
    accent: '#78350f',
    bgLight: '#fcfbf7',
    cardLight: '#f7f4ec',
    borderLight: '#e7dfcf',
    badgeClass: 'bg-amber-100/80 text-amber-900 dark:bg-stone-800 dark:text-amber-200 border border-amber-300',
    gradientClass: 'from-amber-700 to-stone-800',
    previewColors: ['#b45309', '#d97706', '#f5f0e6']
  }
};

/**
 * Apply theme to document element
 */
export function applyTheme(themeId: ColorThemeId, mode: 'light' | 'dark' | 'system', fontSize: number = 100) {
  const root = document.documentElement;
  
  // Set theme data attribute
  root.setAttribute('data-theme', themeId);
  
  // Handle dark / light
  const isDark = 
    mode === 'dark' || 
    (mode === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  
  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  
  // Set font size
  root.style.fontSize = `${fontSize}%`;
  
  // Set dynamic CSS properties based on theme
  const theme = COLOR_THEMES[themeId] || COLOR_THEMES.emerald;
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-primary-light', theme.primaryLight);
  root.style.setProperty('--color-primary-dark', theme.primaryDark);
  root.style.setProperty('--color-accent', theme.accent);
}

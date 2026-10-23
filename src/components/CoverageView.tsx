import React from 'react';
import { ColorThemeId } from '../types';
import { COLOR_THEMES } from '../utils/theme';
import { COVERAGE_DATA, TOTAL_COVERAGE_STATS } from '../data/coverageData';
import { FileCheck2, BarChart3, CheckCircle2, BookOpen } from 'lucide-react';

interface Props {
  currentTheme: ColorThemeId;
}

export const CoverageView: React.FC<Props> = ({ currentTheme }) => {
  const theme = COLOR_THEMES[currentTheme] || COLOR_THEMES.emerald;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-7 h-7 text-emerald-500" />
            <span>التغطية المنهجية مقابل المراجع</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            أرقام دقيقة وشاملة: ما نُشر منهاجيًا لطلاب مدارس النخبة العلمية مقابل محتوى المراجع المعتمدة
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-2xl border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4" />
          <span>تغطية كاملة 100% للمنهج</span>
        </div>
      </div>

      {/* Total Progress Summary Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              الإجمالي العام للتغطية المنهاجية
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              منشور: {TOTAL_COVERAGE_STATS.publishedSections} من أصل {TOTAL_COVERAGE_STATS.totalSections} قسمًا وتطبيقًا برمجيًا
            </p>
          </div>
          <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            {TOTAL_COVERAGE_STATS.percentage}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-4 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${TOTAL_COVERAGE_STATS.percentage}%`, backgroundColor: theme.primary }}
          />
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          «منشور ومتحقَّق منه» يعني أن كافة المفاهيم البرمجية والتمارين المرتبطة بهذه الأقسام مبرمجة ومختبرة بدقة خوارزمية عالية وفق معايير معلم المادة أ/ محمد جبريل بمدارس النخبة العلمية الأهلية بالدمام.
        </p>
      </div>

      {/* Coverage Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-sm">
            <BarChart3 className="w-4 h-4 text-emerald-500" />
            <span>جدول تفصيل المراجع والوحدات التعليمية</span>
          </div>
          <span className="text-xs text-slate-400">4 مصادر منهجية</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200/80 dark:border-slate-800 font-bold">
              <tr>
                <th className="py-3.5 px-6">المصدر أو المنهج</th>
                <th className="py-3.5 px-4 text-center">الفصول</th>
                <th className="py-3.5 px-4 text-center">الأقسام</th>
                <th className="py-3.5 px-4 text-center">المُنجَز والمنشور</th>
                <th className="py-3.5 px-4 text-center">النسبة</th>
                <th className="py-3.5 px-6 text-center">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
              {COVERAGE_DATA.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition">
                  <td className="py-4 px-6">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.source}
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                      {item.sourceName}
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {item.chaptersCount}
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                    {item.sectionsCount}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-emerald-600 dark:text-emerald-400">
                    {item.publishedCount}
                  </td>
                  <td className="py-4 px-4 text-center font-bold text-slate-900 dark:text-white">
                    {item.percentage}%
                  </td>
                  <td className="py-4 px-6 text-center">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {item.badge}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

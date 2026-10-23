import React from 'react';
import { ColorThemeId } from '../types';
import { COLOR_THEMES } from '../utils/theme';
import { EDUCATIONAL_SOURCES, TEACHER_PROFILE } from '../data/sourcesData';
import { School, BookOpen, ExternalLink, ShieldCheck, HeartHandshake, MapPin } from 'lucide-react';

interface Props {
  currentTheme: ColorThemeId;
}

export const SourcesView: React.FC<Props> = ({ currentTheme }) => {
  const theme = COLOR_THEMES[currentTheme] || COLOR_THEMES.emerald;

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <School className="w-7 h-7 text-emerald-500" />
            <span>المصادر والحقوق والاعتماد الأكاديمي</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            نبني المحتوى على أرقى المناهج والمراجع العالمية المعتمدة ونحترم الملكية الفكرية والتراخيص بدقة
          </p>
        </div>
      </div>

      {/* Teacher Profile & School Spotlight Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-2xl shadow-inner text-amber-300">
              مج
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-emerald-200 font-bold">
                إشراف وتدريس
              </span>
              <h2 className="text-2xl font-black">{TEACHER_PROFILE.name}</h2>
              <p className="text-xs text-emerald-100 mt-0.5">{TEACHER_PROFILE.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
            <MapPin className="w-4 h-4 text-emerald-300" />
            <span>{TEACHER_PROFILE.school}</span>
          </div>
        </div>

        <p className="text-sm text-emerald-50 leading-relaxed border-t border-white/15 pt-4">
          {TEACHER_PROFILE.bio}
        </p>

        <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3">
          <HeartHandshake className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-white leading-relaxed">
            <strong>رسالة الأستاذ للطلبة:</strong> "{TEACHER_PROFILE.messageToStudents}"
          </p>
        </div>
      </div>

      {/* Educational Sources List */}
      <div className="space-y-4">
        <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-500" />
          <span>المراجع الأكاديمية والكتب المصدرية</span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {EDUCATIONAL_SOURCES.map((source) => (
            <div
              key={source.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-mono">
                    {source.code}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {source.titleAr}
                  </h3>
                </div>

                <a
                  href={source.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  <span>{source.license}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="text-slate-400 font-medium">الدور في المنصة:</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {source.role}
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 font-medium">المؤلف والترجمة:</div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                    {source.author} {source.translator ? `— الترجمة: ${source.translator}` : ''}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {source.description}
              </p>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                <p>{source.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

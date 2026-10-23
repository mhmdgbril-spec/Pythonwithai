import React, { useState } from 'react';
import { ColorThemeId, StudentProfile } from '../types';
import { COLOR_THEMES } from '../utils/theme';
import { CAPSTONE_CHECKLIST_ITEMS, CAPSTONE_PROJECT_IDEAS } from '../data/capstoneProjects';
import { PythonRuntime } from '../utils/pythonRunner';
import { 
  Award, 
  CheckSquare, 
  Square, 
  Sparkles, 
  Play, 
  Terminal, 
  BookOpen, 
  FolderGit2,
  CheckCircle2
} from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  student: StudentProfile;
  currentTheme: ColorThemeId;
  onToggleCapstoneItem: (itemId: string) => void;
  soundEnabled: boolean;
}

export const CapstoneView: React.FC<Props> = ({
  student,
  currentTheme,
  onToggleCapstoneItem,
  soundEnabled
}) => {
  const theme = COLOR_THEMES[currentTheme] || COLOR_THEMES.emerald;
  const runner = new PythonRuntime();

  const [activeProject, setActiveProject] = useState(CAPSTONE_PROJECT_IDEAS[0]);
  const [projectOutput, setProjectOutput] = useState<string | null>(null);

  const completedCount = student.capstoneCompletedItems.length;
  const isFullyComplete = completedCount === CAPSTONE_CHECKLIST_ITEMS.length;

  const handleRunStarter = () => {
    playSound('click', soundEnabled);
    const res = runner.execute(activeProject.starterCode);
    setProjectOutput(res.output || res.error || '');
    playSound('success', soundEnabled);
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-7 h-7 text-emerald-500" />
            <span>مشروع الكابستون العملي (Capstone Project)</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            مشروع التخرج البرمجي الفردي — تطبيق متكامل يجمع كل ما تعلمته في بايثون وهندسة البرمجيات
          </p>
        </div>

        {/* Completion Progress Badge */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-semibold">مراحل الإنجاز المكتملة</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
              الأدوات: {completedCount}/{CAPSTONE_CHECKLIST_ITEMS.length}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
            {Math.round((completedCount / CAPSTONE_CHECKLIST_ITEMS.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              قائمة معايير الجودة والتحقق (Engineering Checklist)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              مقتبس من ملحق المشاريع في هندسة البرمجيات — علّم الأدوات المكتملة فعليًا في مشروعك
            </p>
          </div>
          {isFullyComplete && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
              <CheckCircle2 className="w-4 h-4" />
              أكملت كافة معايير الكابستون!
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CAPSTONE_CHECKLIST_ITEMS.map((item) => {
            const isChecked = student.capstoneCompletedItems.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => {
                  playSound('click', soundEnabled);
                  onToggleCapstoneItem(item.id);
                }}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3.5 ${
                  isChecked
                    ? 'border-emerald-500/60 bg-emerald-500/5 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40'
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-emerald-600 dark:text-emerald-400 focus:outline-none"
                  aria-label={isChecked ? `إلغاء تحديد ${item.title}` : `تحديد ${item.title}`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <Square className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">{item.category}</span>
                    <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 px-2 py-0.5 rounded-full">
                      مطلوب
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                    المُخرَج: {item.deliverable}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Capstone Project Ideas */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <FolderGit2 className="w-6 h-6 text-emerald-500" />
          <div>
            <h2 className="font-bold text-base text-slate-900 dark:text-white">
              أفكار مشاريع مقترحة من أ/ محمد جبريل لطلاب النخبة العلمية
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              يمكنك اختيار إحدى هذه الأفكار أو ابتكار فكرة تخدم مدرستك ومجتمعك
            </p>
          </div>
        </div>

        {/* Project Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CAPSTONE_PROJECT_IDEAS.map((proj) => {
            const isSelected = activeProject.id === proj.id;
            return (
              <button
                key={proj.id}
                onClick={() => {
                  playSound('click', soundEnabled);
                  setActiveProject(proj);
                  setProjectOutput(null);
                }}
                className={`p-4 rounded-2xl text-right border-2 transition ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800/40'
                }`}
              >
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {proj.badge}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-2">
                  {proj.title}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Active Project Details and Live Code */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {activeProject.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {activeProject.description}
              </p>
            </div>

            <button
              onClick={handleRunStarter}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs"
              style={{ backgroundColor: theme.primary }}
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>تشغيل الكود الهيكلي (Starter Code)</span>
            </button>
          </div>

          <div className="rounded-2xl bg-slate-950 p-4 text-emerald-400 font-mono text-xs overflow-x-auto" dir="ltr">
            <pre>{activeProject.starterCode}</pre>
          </div>

          {projectOutput !== null && (
            <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 font-mono text-xs text-emerald-300" dir="ltr">
              <div className="text-[10px] text-slate-500 font-sans mb-1">خرْج المشروع:</div>
              <pre className="whitespace-pre-wrap">{projectOutput}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

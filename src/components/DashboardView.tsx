import React from 'react';
import { StudentProfile, ColorThemeId } from '../types';
import { COLOR_THEMES } from '../utils/theme';
import { 
  Play, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Lock, 
  ArrowLeft, 
  Terminal, 
  GraduationCap, 
  Trophy, 
  Clock, 
  BookMarked,
  BookText,
  Quote
} from 'lucide-react';
import { CURRICULUM_CHAPTERS } from '../data/curriculumData';
import { TEACHER_PROFILE } from '../data/sourcesData';
import { playSound } from '../utils/sound';
import { Icon3D } from './Icon3D';
import { DailyChallengeCard } from './DailyChallengeCard';
import { DailyChallenge } from '../utils/dailyChallenge';

interface Props {
  student: StudentProfile;
  currentTheme: ColorThemeId;
  onOpenLesson: (lessonId: string) => void;
  onNavigateTab: (tab: any) => void;
  soundEnabled: boolean;
  onCompleteDailyChallenge: (challenge: DailyChallenge, dateKey: string) => void;
}

export const DashboardView: React.FC<Props> = ({
  student,
  currentTheme,
  onOpenLesson,
  onNavigateTab,
  soundEnabled,
  onCompleteDailyChallenge
}) => {
  const theme = COLOR_THEMES[currentTheme] || COLOR_THEMES.emerald;

  // Find next uncompleted lesson
  const allLessons = CURRICULUM_CHAPTERS.flatMap(ch => ch.lessons);
  const nextLesson = allLessons.find(l => !student.completedLessons.includes(l.id)) || allLessons[0];
  
  // Completed counts
  const part1Lessons = allLessons.filter(l => l.part === 1);
  const part2Lessons = allLessons.filter(l => l.part === 2);
  const completedPart1Count = part1Lessons.filter(l => student.completedLessons.includes(l.id)).length;
  const completedPart2Count = part2Lessons.filter(l => student.completedLessons.includes(l.id)).length;

  const part1Percentage = Math.round((completedPart1Count / Math.max(1, part1Lessons.length)) * 100);
  const part2Percentage = Math.round((completedPart2Count / Math.max(1, part2Lessons.length)) * 100);

  // Today's suggested lessons (first 2 uncompleted)
  const todaysLessons = allLessons.filter(l => !student.completedLessons.includes(l.id)).slice(0, 2);
  if (todaysLessons.length === 0) {
    todaysLessons.push(allLessons[0], allLessons[1]);
  }

  // Determine time-based greeting in Arabic
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'صباح الخير والهمّة العالية' : 'مساء الخير والتألّق';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{greeting}، {student.name} 👋</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 flex items-center gap-2">
            <span>مسارك التعليمي في لغة بايثون والتقنية الرقمية</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">مدارس النخبة العلمية الأهلية بالدمام</span>
          </p>
        </div>

        {/* Level & Streak Quick Badges */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400">
            <Flame className="w-4 h-4 fill-amber-500" />
            <div className="text-right">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">الحماس اليومي</div>
              <div className="font-bold text-xs tabular-nums" data-testid="dashboard-streak-count">{student.streakDays} أيام متواصلة</div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400">
            <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <div className="text-right">
              <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-none">مستواك الحالي</div>
              <div className="font-bold text-xs tabular-nums">المستوى {student.level}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Challenge System (24-Hour Rotating Mission in Welcome Screen) */}
      <DailyChallengeCard
        student={student}
        currentTheme={currentTheme}
        soundEnabled={soundEnabled}
        onCompleteDailyChallenge={onCompleteDailyChallenge}
      />

      {/* Primary Action Row: Resume Lesson + XP Gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Next Lesson Card (Col span 2) */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="absolute top-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              أكمل من حيث توقفت
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {nextLesson.estimatedMinutes} دقائق
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              الفصل {nextLesson.number} · الدرس #{nextLesson.globalNumber}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              {nextLesson.title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {nextLesson.whyItMatters}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>درسك القادم جاهز — خطوة صغيرة كل يوم تصنع فارقًا كبيرًا</span>
            </div>

            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onOpenLesson(nextLesson.id);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: theme.primary }}
            >
              <span>أكمل الدرس الآن</span>
              <Play className="w-4 h-4 fill-white" />
            </button>
          </div>
        </div>

        {/* Student XP & Level Gauge Card */}
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">نقاط الخبرة والإتقان</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              المستوى {student.level}
            </span>
          </div>

          <div className="py-6 flex flex-col items-center justify-center">
            {/* Circular Progress Gauge */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100 dark:text-slate-800"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={301.59}
                  strokeDashoffset={301.59 - (301.59 * (student.xp % 100)) / 100}
                  strokeLinecap="round"
                  style={{ color: theme.primary }}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white">
                  {student.xp}
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                  XP إجمالي
                </span>
              </div>
            </div>

            <div className="text-center mt-3">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                {100 - (student.xp % 100)} نقطة للارتقاء إلى المستوى {student.level + 1}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                تُمنح النقاط بحل التحديات وتشغيل الأكواد البرمجية
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>الدروس المنجزة</span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {student.completedLessons.length} من {allLessons.length}
            </span>
          </div>
        </div>
      </div>

      {/* Curriculum Path Progress Bars: Part 1 & Part 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Part 1: Python */}
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                الجزء الأول: أساسيات بايثون وهندسة البرمجيات
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                من أول سطر طباعة إلى الدوال وهياكل البيانات والشرط والحلقات
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-xl">
              {part1Percentage}%
            </span>
          </div>

          <div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${part1Percentage}%`, backgroundColor: theme.primary }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>{completedPart1Count} درس مكتمل من {part1Lessons.length}</span>
              <span>مفتوح ومتاح للجميع</span>
            </div>
          </div>
        </div>

        {/* Part 2: AI & Machine Learning */}
        <div className="rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  الجزء الثاني: الذكاء الاصطناعي وتعلم الآلة
                </h3>
                <span className="text-[10px] font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  متقدم
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                الشبكات العصبية، معالجة اللغات، والتقنيات الرقمية المتقدمة
              </p>
            </div>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2.5 py-1 rounded-xl">
              {part2Percentage}%
            </span>
          </div>

          <div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full bg-purple-600 transition-all duration-700 ease-out"
                style={{ width: `${part2Percentage}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-2">
              <span>{completedPart2Count} درس مكتمل من {part2Lessons.length}</span>
              <span className="flex items-center gap-1 text-slate-400">
                <Lock className="w-3 h-3" />
                يُفتح بالتقدم في الجزء الأول
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Textbook Showcase Banner */}
      <div className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 text-white overflow-hidden shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 max-w-3xl">
          <Icon3D name="book" size="lg" className="flex-shrink-0" />
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span 
                className="px-3 py-0.5 rounded-full text-[11px] font-bold text-white shadow-xs flex items-center gap-1.5"
                style={{ backgroundColor: theme.primary }}
              >
                <BookText className="w-3.5 h-3.5" />
                كتاب 1447هـ / 2026م (213 صفحة)
              </span>
              <span className="text-xs text-amber-400 font-semibold">14 وحدة بأيقونات 3D + 123 سؤال تفاعلي + الملاحق</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              كتاب الذكاء الاصطناعي بلغة بايثون للمرحلة الثانوية
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              تصفح محتويات الكتاب المدرسي كاملة من المقدمة والقاعدة الذهبية حتى الملحقين (أ) و(ب)، طبّق 42+ كود بايثون مباشرة في الطرفية، وحل جميع الـ 123 سؤال تقويم تفاعلي.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            playSound('click', soundEnabled);
            onNavigateTab('book');
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-900 bg-white hover:bg-slate-100 transition shadow-md hover:scale-[1.02] active:scale-[0.98] flex-shrink-0"
        >
          <BookText className="w-4 h-4 text-emerald-600" />
          <span>تصفح الكتاب والأسئلة التفاعلية</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Today's Study Plan + Teacher Mohamed Gabriel's Message */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Plan (2 Columns) */}
        <div className="lg:col-span-2 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🌱</span>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  خطة اليوم المقترحة
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  اقتراحنا لك: درسان في اليوم — لا تستعجل، الفهم والتطبيق أولًا!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onNavigateTab('path');
              }}
              className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
            >
              عرض المسار كاملاً
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todaysLessons.map((lesson, idx) => {
              const isCompleted = student.completedLessons.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                        {lesson.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        <span>الفصل {lesson.number}</span>
                        <span>·</span>
                        <span>{lesson.estimatedMinutes} دقائق</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      playSound('click', soundEnabled);
                      onOpenLesson(lesson.id);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                    }`}
                  >
                    {isCompleted ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>أعد الدرس</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>ابدأ الدرس</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Teacher Mohamed Gabriel Card */}
        <div className="rounded-3xl p-6 bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/40 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-md">
                مج
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900 dark:text-white">
                  {TEACHER_PROFILE.name}
                </h4>
                <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                  {TEACHER_PROFILE.role}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  {TEACHER_PROFILE.school}
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-emerald-100 dark:border-emerald-900/40 relative">
              <Quote className="w-4 h-4 text-emerald-500 absolute top-2 right-2 opacity-30" />
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed pr-3 italic">
                "{TEACHER_PROFILE.messageToStudents}"
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-emerald-100 dark:border-emerald-900/50 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onNavigateTab('playground');
              }}
              className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              <Terminal className="w-4 h-4" />
              <span>المختبر التفاعلي</span>
            </button>
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onNavigateTab('exam');
              }}
              className="flex items-center gap-1.5 font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600"
            >
              <GraduationCap className="w-4 h-4" />
              <span>الامتحان والشهادة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

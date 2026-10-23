import React, { useState } from 'react';
import { StudentProfile, ColorThemeId } from '../types';
import { COLOR_THEMES } from '../utils/theme';
import { CURRICULUM_CHAPTERS } from '../data/curriculumData';
import { 
  CheckCircle2, 
  Play, 
  Clock, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Award,
  BookOpen
} from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  student: StudentProfile;
  currentTheme: ColorThemeId;
  onOpenLesson: (lessonId: string) => void;
  soundEnabled: boolean;
}

export const LearningPathView: React.FC<Props> = ({
  student,
  currentTheme,
  onOpenLesson,
  soundEnabled
}) => {
  const theme = COLOR_THEMES[currentTheme] || COLOR_THEMES.emerald;
  const [activePartFilter, setActivePartFilter] = useState<'all' | 1 | 2>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedChapters, setExpandedChapters] = useState<Record<string, boolean>>({
    ch1: true,
    ch2: true,
    ch3: true,
    ch4: true,
    ch_ai_1: true
  });

  const toggleChapter = (chId: string) => {
    playSound('click', soundEnabled);
    setExpandedChapters(prev => ({
      ...prev,
      [chId]: !prev[chId]
    }));
  };

  const filteredChapters = CURRICULUM_CHAPTERS.filter(ch => {
    if (activePartFilter !== 'all' && ch.part !== activePartFilter) return false;
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const matchesTitle = ch.title.toLowerCase().includes(query);
    const matchesDesc = ch.description.toLowerCase().includes(query);
    const matchesLessons = ch.lessons.some(l => 
      l.title.toLowerCase().includes(query) || l.subtitle.toLowerCase().includes(query)
    );
    return matchesTitle || matchesDesc || matchesLessons;
  });

  const allLessons = CURRICULUM_CHAPTERS.flatMap(c => c.lessons);
  const totalCompleted = student.completedLessons.length;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-emerald-500" />
            <span>مسار التعلّم المتكامل</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            خطتك مفصّلة على دروس تفاعلية صغيرة مُرتّبة بعناية — أنت تتحكّم في وتيرتك بدعم أ/ محمد جبريل
          </p>
        </div>

        {/* Total Completion Progress Badge */}
        <div className="flex items-center gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-semibold">إجمالي الإنجاز</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {totalCompleted} من {allLessons.length} درسًا
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs">
            {Math.round((totalCompleted / Math.max(1, allLessons.length)) * 100)}%
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-100/70 dark:bg-slate-900/60 p-2 sm:p-2.5 rounded-2xl border border-slate-200/60 dark:border-slate-800">
        {/* Part Filters */}
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <button
            onClick={() => {
              playSound('click', soundEnabled);
              setActivePartFilter('all');
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition ${
              activePartFilter === 'all'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            جميع الأجزاء
          </button>
          <button
            onClick={() => {
              playSound('click', soundEnabled);
              setActivePartFilter(1);
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition ${
              activePartFilter === 1
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            الجزء الأول: بايثون
          </button>
          <button
            onClick={() => {
              playSound('click', soundEnabled);
              setActivePartFilter(2);
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activePartFilter === 2
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-500" />
            الجزء الثاني: الذكاء الاصطناعي
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن درس أو موضوع..."
            className="w-full pl-4 pr-9 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        </div>
      </div>

      {/* Chapters Accordion List */}
      <div className="space-y-6">
        {filteredChapters.map((chapter) => {
          const isExpanded = !!expandedChapters[chapter.id];
          const completedInChapter = chapter.lessons.filter(l => student.completedLessons.includes(l.id)).length;
          const isChapterComplete = completedInChapter === chapter.lessons.length && chapter.lessons.length > 0;

          return (
            <div
              key={chapter.id}
              className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden transition-all duration-200"
            >
              {/* Chapter Header */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full p-5 sm:p-6 text-right flex items-center justify-between hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-4">
                  <div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-base shadow-xs ${
                      chapter.part === 2 
                        ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {chapter.number}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400">
                        {chapter.part === 1 ? 'الجزء الأول · بايثون' : 'الجزء الثاني · الذكاء الاصطناعي'}
                      </span>
                      {isChapterComplete && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          مكتمل 100%
                        </span>
                      )}
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                      {chapter.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                      {chapter.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 hidden sm:inline">
                    {completedInChapter}/{chapter.lessons.length} درسًا
                  </span>
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>

              {/* Lessons List in Chapter */}
              {isExpanded && (
                <div className="p-4 sm:p-6 pt-0 border-t border-slate-100 dark:border-slate-800/80">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {chapter.lessons.map((lesson) => {
                      const isCompleted = student.completedLessons.includes(lesson.id);
                      return (
                        <div
                          key={lesson.id}
                          className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                            isCompleted
                              ? 'bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/20'
                              : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[11px] font-semibold text-slate-400">
                                الدرس #{lesson.globalNumber}
                              </span>
                              <span className="flex items-center gap-1 text-[11px] text-slate-500">
                                <Clock className="w-3 h-3" />
                                {lesson.estimatedMinutes} دقائق
                              </span>
                            </div>

                            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                              {lesson.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {lesson.subtitle}
                            </p>
                          </div>

                          <div className="mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              {lesson.exercises.reduce((sum, e) => sum + e.xp, 0)} XP
                            </span>

                            <button
                              onClick={() => {
                                playSound('click', soundEnabled);
                                onOpenLesson(lesson.id);
                              }}
                              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                                isCompleted
                                  ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                              }`}
                            >
                              {isCompleted ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>مُنجز (مراجعة)</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-white" />
                                  <span>ابدأ التعلّم</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

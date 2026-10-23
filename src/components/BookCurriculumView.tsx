import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Copy,
  Check,
  Download,
  ExternalLink,
  Lightbulb,
  AlertTriangle,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';
import {
  BOOK_CHAPTERS,
  BOOK_METADATA,
  BOOK_INTRO,
  BOOK_APPENDICES,
  BookQuestion,
  BookCodeSnippet
} from '../data/bookChaptersData';
import { ColorThemeId, StudentProfile } from '../types';
import { COLOR_THEMES } from '../utils/theme';
import { PythonRuntime } from '../utils/pythonRunner';
import { playSound } from '../utils/sound';
import { Icon3D } from './Icon3D';
import confetti from 'canvas-confetti';

interface Props {
  currentTheme: ColorThemeId;
  student: StudentProfile;
  soundEnabled: boolean;
  onExercisePassed?: (xp: number, exerciseTitle: string, exerciseId: string) => void;
  onSelectBookUnit?: (unitId: string) => void;
}

export const BookCurriculumView: React.FC<Props> = ({
  currentTheme,
  soundEnabled,
  onExercisePassed,
  onSelectBookUnit
}) => {
  const theme = COLOR_THEMES[currentTheme] || COLOR_THEMES.emerald;
  const runner = new PythonRuntime();

  // Selected Unit & Navigation State
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit-1');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'codes' | 'questions' | 'projects' | 'summary'>('content');
  const [showIntroSection, setShowIntroSection] = useState<boolean>(true);

  // Interactive Code State
  const [userCodes, setUserCodes] = useState<Record<string, string>>({});
  const [codeOutputs, setCodeOutputs] = useState<Record<string, { text: string; error?: boolean }>>({});
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);

  // Interactive Questions State: { [chapterId]: { [questionId]: selectedLetter } }
  const [answers, setAnswers] = useState<Record<string, Record<string, 'أ' | 'ب' | 'ج' | 'د'>>>({});

  const currentChapter = BOOK_CHAPTERS.find(c => c.id === selectedUnitId) || BOOK_CHAPTERS[0];

  React.useEffect(() => {
    onSelectBookUnit?.(selectedUnitId);
  }, [selectedUnitId, onSelectBookUnit]);

  // Total counts across all 14 units
  const totalBookQuestions = BOOK_CHAPTERS.reduce((acc, ch) => acc + ch.questions.length, 0);
  const totalBookCodes = BOOK_CHAPTERS.reduce((acc, ch) => acc + ch.codeSnippets.length, 0);

  // Filtered chapters for the unit cards grid
  const filteredChapters = BOOK_CHAPTERS.filter(ch => {
    if (gradeFilter === 'all') return true;
    if (gradeFilter === 'first') return ch.gradeLevel.includes('الأول الثانوي');
    if (gradeFilter === 'second') return ch.gradeLevel.includes('الثاني الثانوي');
    if (gradeFilter === 'third') return ch.gradeLevel.includes('الثالث الثانوي');
    if (gradeFilter === 'enrichment') return ch.gradeLevel.includes('إثرائية');
    return true;
  });

  // Handle Code Execution
  const handleRunCode = (snippet: BookCodeSnippet) => {
    playSound('click', soundEnabled);
    const codeToRun = userCodes[snippet.id] ?? snippet.code;
    const res = runner.execute(codeToRun);
    setCodeOutputs(prev => ({
      ...prev,
      [snippet.id]: {
        text: res.output,
        error: !res.success
      }
    }));

    if (res.success) {
      playSound('success', soundEnabled);
    } else {
      playSound('error', soundEnabled);
    }
  };

  // Run all code snippets in the active chapter
  const handleRunAllChapterCodes = () => {
    playSound('click', soundEnabled);
    const nextOutputs: Record<string, { text: string; error?: boolean }> = {};
    currentChapter.codeSnippets.forEach(snippet => {
      const codeToRun = userCodes[snippet.id] ?? snippet.code;
      const res = runner.execute(codeToRun);
      nextOutputs[snippet.id] = {
        text: res.output,
        error: !res.success
      };
    });
    setCodeOutputs(prev => ({ ...prev, ...nextOutputs }));
    playSound('success', soundEnabled);
  };

  // Reset Code
  const handleResetCode = (snippet: BookCodeSnippet) => {
    playSound('click', soundEnabled);
    setUserCodes(prev => ({ ...prev, [snippet.id]: snippet.code }));
    setCodeOutputs(prev => ({ ...prev, [snippet.id]: { text: '' } }));
  };

  // Copy Code
  const handleCopyCode = (snippet: BookCodeSnippet) => {
    const code = userCodes[snippet.id] ?? snippet.code;
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(snippet.id);
    playSound('click', soundEnabled);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  // Answer a Question
  const handleSelectAnswer = (q: BookQuestion, letter: 'أ' | 'ب' | 'ج' | 'د') => {
    playSound('click', soundEnabled);
    const prevChapterAnswers = answers[currentChapter.id] || {};
    const updatedChapterAnswers = {
      ...prevChapterAnswers,
      [q.id]: letter
    };

    setAnswers(prev => ({
      ...prev,
      [currentChapter.id]: updatedChapterAnswers
    }));

    if (letter === q.correctLetter) {
      playSound('success', soundEnabled);
      if (onExercisePassed) {
        onExercisePassed(15, `سؤال ${q.questionNumber} - ${currentChapter.title}`, `book-q-${q.id}`);
      }
      // Check if all questions in this chapter are now answered correctly
      const allCorrectNow = currentChapter.questions.every(
        quest => updatedChapterAnswers[quest.id] === quest.correctLetter
      );
      if (allCorrectNow) {
        confetti({ particleCount: 70, spread: 65, origin: { y: 0.65 } });
      }
    } else {
      playSound('error', soundEnabled);
    }
  };

  // Reset Chapter Quiz
  const handleResetQuiz = () => {
    playSound('click', soundEnabled);
    setAnswers(prev => ({ ...prev, [currentChapter.id]: {} }));
  };

  // Calculate Quiz Score for Current Chapter
  const chapterAnswers = answers[currentChapter.id] || {};
  const answeredCount = Object.keys(chapterAnswers).length;
  const correctCount = currentChapter.questions.filter(q => chapterAnswers[q.id] === q.correctLetter).length;
  const totalQuestions = currentChapter.questions.length;

  return (
    <div className="space-y-8 pb-16">
      {/* 1. Hero Banner: 3D Book Presentation */}
      <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 border border-slate-800 text-white overflow-hidden shadow-2xl">
        <div className="absolute top-0 end-0 -mt-12 -me-12 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 -mb-12 -ms-12 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 max-w-4xl">
            <div className="flex-shrink-0">
              <Icon3D name="book" size="xl" />
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="px-3 py-1 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5"
                  style={{ backgroundColor: theme.primary }}
                >
                  الكتاب المدرسي المعتمد {BOOK_METADATA.year}
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800/90 text-amber-300 border border-slate-700/70 flex items-center gap-1.5">
                  {BOOK_METADATA.school}
                </span>
                <span className="px-3 py-1 rounded-xl text-xs font-semibold bg-slate-800/90 text-emerald-300 border border-slate-700/70">
                  213 صفحة كاملة
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                {BOOK_METADATA.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                إعداد وتدريس: <strong className="text-white font-bold">{BOOK_METADATA.author}</strong> — {BOOK_METADATA.role}.
                تم نقل محتوى الكتاب بالكامل (المقدمة، القاعدة الذهبية، 14 وحدة دراسية، الجداول، التنبيهات، {totalBookCodes} كود بايثون تفاعلي، {totalBookQuestions} سؤال تقويم، والملحقين أ و ب) بتصميم ثلاثي الأبعاد.
              </p>

              {/* Quick Stats Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold text-slate-200">
                  14 وحدة تعليمية (أيقونات 3D)
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-[11px] font-bold text-emerald-300">
                  {totalBookCodes} كود بايثون حي قابل للتشغيل
                </span>
                <span className="px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-[11px] font-bold text-amber-300">
                  {totalBookQuestions} سؤال اختيار من متعدد تفاعلي
                </span>
                <span className="px-3 py-1 rounded-lg bg-purple-500/15 border border-purple-500/30 text-[11px] font-bold text-purple-300">
                  الملحق (أ) 22 مكتبة + الملحق (ب) 8 حلول
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                setShowIntroSection(prev => !prev);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition"
            >
              <span>{showIntroSection ? 'إخفاء مقدمة الكتاب' : 'عرض مقدمة الكتاب والقاعدة الذهبية'}</span>
              {showIntroSection ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <a
              href={BOOK_METADATA.pdfPath}
              download="الذكاء_الاصطناعي_بايثون_محمد_جبريل.pdf"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-white text-slate-900 hover:bg-slate-100 transition shadow-md"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>تحميل الكتاب PDF</span>
            </a>

            <a
              href="https://colab.research.google.com/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
              title="فتح Google Colab لتجارب الذكاء الاصطناعي السحابية"
            >
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>Google Colab</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Book Introduction, Golden Rule & How To Use Table (Pages 2 - 7) */}
      {showIntroSection && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Introduction & Golden Rule (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div className="flex items-center gap-3.5">
              <Icon3D name="school" size="md" />
              <div>
                <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  الصفحات 2 - 7 من الكتاب المدرسي
                </span>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  {BOOK_INTRO.title}
                </h2>
              </div>
            </div>

            <div className="space-y-2.5">
              {BOOK_INTRO.paragraphs.map((p, idx) => (
                <p key={idx} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>

            {/* Golden Rule Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start gap-4">
              <Icon3D name="golden-rule" size="md" className="flex-shrink-0" />
              <div className="space-y-1.5">
                <h3 className="text-sm font-black text-amber-800 dark:text-amber-300">
                  القاعدة الذهبية في الكتاب المدرسي (ص 7):
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">
                  «{BOOK_INTRO.goldenRule}»
                </p>
              </div>
            </div>
          </div>

          {/* How to Use This Book Table (5 cols) */}
          <div className="lg:col-span-5 rounded-3xl p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center gap-3">
              <Icon3D name="target" size="md" />
              <div>
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400">
                  خارطة العناصر التعليمية (ص 7)
                </span>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  كيف تستخدم هذا الكتاب؟
                </h3>
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    {BOOK_INTRO.howToUseTable.headers.map((h, i) => (
                      <th key={i} className="px-3.5 py-2.5">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {BOOK_INTRO.howToUseTable.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`px-3.5 py-2.5 ${
                            cIdx === 0
                              ? 'font-bold text-slate-900 dark:text-white'
                              : 'text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>إشراف: {BOOK_METADATA.author}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">Hero of Python · 2026</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Grade Level Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 px-2">تصفية حسب المرحلة:</span>
          {[
            { id: 'all', label: 'جميع الوحدات (14 وحدة)' },
            { id: 'first', label: 'الأول الثانوي (الوحدات 1 - 4)' },
            { id: 'second', label: 'الثاني الثانوي (الوحدات 5 - 7)' },
            { id: 'third', label: 'الثالث الثانوي (الوحدات 8 - 10)' },
            { id: 'enrichment', label: 'الوحدات الإثرائية (الوحدات 11 - 14)' }
          ].map(filter => {
            const isActive = gradeFilter === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => {
                  playSound('click', soundEnabled);
                  setGradeFilter(filter.id);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
                style={{ backgroundColor: isActive ? theme.primary : undefined }}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <span className="text-[11px] font-semibold text-slate-400 px-2">
          اختر أي وحدة أدناه لاستعراض الشرح والأكواد والأسئلة
        </span>
      </div>

      {/* 4. 3D Chapter Cards Grid (Interactive Tabs for all 14 Units) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {filteredChapters.map(ch => {
          const isSelected = ch.id === selectedUnitId;
          const chAns = answers[ch.id] || {};
          const chCorrect = ch.questions.filter(q => chAns[q.id] === q.correctLetter).length;

          return (
            <button
              key={ch.id}
              onClick={() => {
                playSound('click', soundEnabled);
                setSelectedUnitId(ch.id);
                setActiveSubTab('content');
              }}
              className={`group text-right p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-white dark:bg-slate-850 border-2 shadow-md -translate-y-0.5'
                  : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-850 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
              style={{ borderColor: isSelected ? theme.primary : undefined }}
            >
              <div className="flex items-start justify-between gap-2 w-full">
                <Icon3D name={ch.iconName} size="sm" />
                <span
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${
                    isSelected
                      ? 'text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  }`}
                  style={{ backgroundColor: isSelected ? theme.primary : undefined }}
                >
                  وحدة {ch.unitNumber}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-2 leading-snug">
                  {ch.title}
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  {ch.pageRange} · {ch.gradeLevel}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 w-full">
                <span>{ch.codeSnippets.length} أكواد</span>
                <span className={chCorrect > 0 ? 'font-bold text-emerald-600 dark:text-emerald-400' : ''}>
                  {chCorrect > 0 ? `${chCorrect}/${ch.questions.length} ✓` : `${ch.questions.length} أسئلة`}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 5. Active Chapter Details Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Chapter Header Info with Large 3D Icon */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-start sm:items-center gap-4">
            <Icon3D name={currentChapter.iconName} size="lg" className="flex-shrink-0" />
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold">
                  الوحدة {currentChapter.unitNumber} من 14
                </span>
                <span>·</span>
                <span>{currentChapter.pageRange} في الكتاب المدرسي</span>
                <span>·</span>
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {currentChapter.gradeLevel}
                </span>
                {currentChapter.englishTitle && (
                  <>
                    <span>·</span>
                    <span className="font-mono text-[11px] text-slate-400" dir="ltr">
                      {currentChapter.englishTitle}
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {currentChapter.arabicTitle}
              </h2>
            </div>
          </div>

          {/* Sub Navigation Within the Chapter with 3D Mini Icons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            {[
              { id: 'content', label: `الشرح والمفاهيم (${currentChapter.sections.length})`, icon3d: 'theory' },
              { id: 'codes', label: `الأكواد الحية (${currentChapter.codeSnippets.length})`, icon3d: 'code' },
              { id: 'questions', label: `الأسئلة التفاعلية (${currentChapter.questions.length})`, icon3d: 'quiz' },
              { id: 'projects', label: `المشاريع (${currentChapter.projects.length})`, icon3d: 'project' },
              { id: 'summary', label: 'الملخص', icon3d: 'summary' }
            ].map(tab => {
              const active = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSound('click', soundEnabled);
                    setActiveSubTab(tab.id as any);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                    active
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  style={{ color: active ? theme.primary : undefined }}
                >
                  <Icon3D name={tab.icon3d} size="sm" className="scale-75 -m-1.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SubTab 1: Theory & Content */}
        {activeSubTab === 'content' && (
          <div className="space-y-6">
            {/* Unit Objectives */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-start gap-4">
              <Icon3D name="target" size="md" className="flex-shrink-0" />
              <div className="space-y-2.5 flex-1">
                <h3 className="text-sm font-black text-slate-900 dark:text-white">
                  أهداف الوحدة التعليمية (في نهاية هذه الوحدة سيكون الطالب قادراً على أن):
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                  {currentChapter.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="leading-relaxed">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Sections Content */}
            <div className="space-y-6">
              {currentChapter.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-4 shadow-2xs"
                >
                  <div className="flex flex-wrap items-center gap-2.5">
                    {sec.badge && (
                      <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                        {sec.badge}
                      </span>
                    )}
                    <h3 className="font-black text-base sm:text-lg text-slate-900 dark:text-white">
                      {sec.title}
                    </h3>
                  </div>

                  {sec.paragraphs &&
                    sec.paragraphs.map((p, pIdx) => (
                      <p key={pIdx} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {p}
                      </p>
                    ))}

                  {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                    <ul className="space-y-2 pt-1">
                      {sec.bulletPoints.map((bp, bIdx) => (
                        <li key={bIdx} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="leading-relaxed">{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Render Table if exists in the section */}
                  {sec.tableData && (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 mt-4">
                      <table className="w-full text-right text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-800">
                          <tr>
                            {sec.tableData.headers.map((h, hIdx) => (
                              <th key={hIdx} className="px-4 py-3">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {sec.tableData.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-4 py-2.5 text-slate-600 dark:text-slate-300 font-mono">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Render Callout Box (Tip / Warning / Discussion) */}
                  {sec.callout && (
                    <div
                      className={`mt-4 p-4 rounded-2xl border flex items-start gap-3 ${
                        sec.callout.type === 'warning'
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-900 dark:text-rose-200'
                          : sec.callout.type === 'discussion'
                          ? 'bg-purple-500/10 border-purple-500/30 text-purple-900 dark:text-purple-200'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                      }`}
                    >
                      <div className="mt-0.5 flex-shrink-0">
                        {sec.callout.type === 'warning' ? (
                          <AlertTriangle className="w-5 h-5 text-rose-500" />
                        ) : sec.callout.type === 'discussion' ? (
                          <MessageSquare className="w-5 h-5 text-purple-500" />
                        ) : (
                          <Lightbulb className="w-5 h-5 text-amber-500" />
                        )}
                      </div>
                      <div className="space-y-1 text-xs leading-relaxed">
                        <div className="font-black">
                          {sec.callout.title}
                        </div>
                        <p className="opacity-90">{sec.callout.text}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Action Bar to switch to Codes or Quiz */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                هل أتممت قراءة الشرح النظري للوحدة {currentChapter.unitNumber}؟ انتقل للتطبيق العملي والتقويم:
              </span>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  onClick={() => {
                    playSound('click', soundEnabled);
                    setActiveSubTab('codes');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-90"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>تطبيق الأكواد الحية ({currentChapter.codeSnippets.length})</span>
                </button>
                <button
                  onClick={() => {
                    playSound('click', soundEnabled);
                    setActiveSubTab('questions');
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>حل أسئلة الوحدة ({currentChapter.questions.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SubTab 2: Runnable Codes and Simulators */}
        {activeSubTab === 'codes' && (
          <div className="space-y-8">
            <div className="p-5 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <Icon3D name="code" size="md" className="flex-shrink-0" />
                <div className="text-xs text-blue-950 dark:text-blue-200 space-y-1">
                  <strong className="text-sm block font-black">
                    مختبر تشغيل أكواد الكتاب التفاعلي ({currentChapter.codeSnippets.length} أمثلة برمجية):
                  </strong>
                  <span>
                    يمكنك تعديل أي كود أدناه والضغط على "تشغيل الكود الآن" لتنفيذه مباشرة ورؤية النتيجة الفورية، أو تشغيل جميع أكواد الوحدة دفعة واحدة.
                  </span>
                </div>
              </div>

              <button
                onClick={handleRunAllChapterCodes}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition hover:opacity-90 flex-shrink-0"
                style={{ backgroundColor: theme.primary }}
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>تشغيل جميع أكواد الوحدة</span>
              </button>
            </div>

            {currentChapter.codeSnippets.map((snippet, sIdx) => {
              const currentCode = userCodes[snippet.id] ?? snippet.code;
              const output = codeOutputs[snippet.id];

              return (
                <div
                  key={snippet.id}
                  className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 overflow-hidden shadow-xs space-y-3"
                >
                  <div className="px-6 pt-5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
                          كود #{sIdx + 1}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                          {snippet.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {snippet.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleCopyCode(snippet)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition"
                        title="نسخ الكود"
                      >
                        {copiedSnippetId === snippet.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedSnippetId === snippet.id ? 'تم النسخ' : 'نسخ'}</span>
                      </button>

                      <button
                        onClick={() => handleResetCode(snippet)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
                        title="إعادة تعيين الكود"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Terminal Installation Command if required */}
                  {snippet.terminalCommand && (
                    <div className="px-6 py-2 bg-slate-900 text-[11px] font-mono text-emerald-400 flex items-center justify-between" dir="ltr">
                      <span className="flex items-center gap-1.5">
                        <span className="text-slate-500">$</span>
                        {snippet.terminalCommand}
                      </span>
                      <span className="text-slate-400 text-[10px] font-sans" dir="rtl">
                        أمر تثبيت المكتبة في الطرفية
                      </span>
                    </div>
                  )}

                  {/* Editable Code Editor */}
                  <div className="px-6">
                    <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden text-left" dir="ltr">
                      <textarea
                        value={currentCode}
                        onChange={e => setUserCodes(prev => ({ ...prev, [snippet.id]: e.target.value }))}
                        rows={Math.min(15, Math.max(5, currentCode.split('\n').length + 1))}
                        className="w-full bg-slate-950 text-slate-100 p-4 font-mono text-xs sm:text-sm focus:outline-none resize-y leading-relaxed"
                        style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'plaintext' }}
                        dir="ltr"
                        spellCheck="false"
                      />
                    </div>
                  </div>

                  {/* Execution Bar */}
                  <div className="px-6 pb-4 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleRunCode(snippet)}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-xs transition hover:opacity-90"
                      style={{ backgroundColor: theme.primary }}
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>تشغيل الكود الآن</span>
                    </button>

                    <span className="text-[11px] text-slate-400">
                      محرك Python التفاعلي المدمج
                    </span>
                  </div>

                  {/* Live Terminal Output */}
                  {output && output.text && (
                    <div className="mx-6 mb-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 text-left font-mono text-xs" dir="ltr">
                      <div className="text-[10px] text-slate-400 mb-1.5 font-sans flex items-center justify-between" dir="rtl">
                        <span>نتيجة التنفيذ الفوري في الطرفية (Live Output):</span>
                        {output.error ? (
                          <span className="text-rose-400 font-bold">حدث خطأ أثناء التنفيذ</span>
                        ) : (
                          <span className="text-emerald-400 font-bold">تم التنفيذ بنجاح ✓</span>
                        )}
                      </div>
                      <pre className={`whitespace-pre-wrap leading-relaxed ${output.error ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {output.text}
                      </pre>
                    </div>
                  )}

                  {/* Expected Output Reference */}
                  <div className="mx-6 mb-5 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 text-xs text-slate-500">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      الناتج الموثق في الكتاب المدرسي:
                    </span>
                    <pre className="font-mono text-[11px] text-slate-600 dark:text-slate-400 mt-1.5 text-left" dir="ltr">
                      {snippet.expectedOutput}
                    </pre>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SubTab 3: Interactive Multiple Choice Questions */}
        {activeSubTab === 'questions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-start sm:items-center gap-3.5">
                <Icon3D name="quiz" size="md" className="flex-shrink-0" />
                <div>
                  <h3 className="font-black text-sm sm:text-base text-amber-900 dark:text-amber-300">
                    أسئلة التقويم المعتمدة في نهاية الوحدة ({currentChapter.questions.length} سؤال اختيار من متعدد)
                  </h3>
                  <p className="text-xs text-amber-800 dark:text-amber-400 mt-0.5">
                    أجب عن أسئلة الكتاب واكسب 15 XP عن كل إجابة صحيحة مع تغذية راجعة وشرح تربوي فوري.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-amber-500/30 text-amber-700 dark:text-amber-400">
                  النتيجة: {correctCount} / {totalQuestions} صحيحة
                </span>
                {answeredCount > 0 && (
                  <button
                    onClick={handleResetQuiz}
                    className="flex items-center gap-1 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة المحاولة</span>
                  </button>
                )}
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              {currentChapter.questions.map(q => {
                const selectedLetter = chapterAnswers[q.id];
                const isAnswered = !!selectedLetter;
                const isCorrect = selectedLetter === q.correctLetter;

                return (
                  <div
                    key={q.id}
                    className={`p-6 rounded-3xl border transition-all ${
                      isAnswered
                        ? isCorrect
                          ? 'border-emerald-300 dark:border-emerald-700/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-rose-300 dark:border-rose-700/60 bg-rose-50/40 dark:bg-rose-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-start gap-3">
                        <span
                          className="w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: theme.primary }}
                        >
                          {q.questionNumber}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-relaxed">
                          {q.question}
                        </h4>
                      </div>

                      {isAnswered && (
                        <div className="flex-shrink-0">
                          {isCorrect ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              صحيحة (+15 XP)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white">
                              <XCircle className="w-3.5 h-3.5" />
                              إجابة خاطئة
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map(opt => {
                        const isThisSelected = selectedLetter === opt.letter;
                        const isThisCorrect = opt.letter === q.correctLetter;

                        let btnStyle =
                          'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300';
                        if (isAnswered) {
                          if (isThisCorrect) {
                            btnStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-xs font-bold';
                          } else if (isThisSelected && !isThisCorrect) {
                            btnStyle = 'bg-rose-600 text-white border-rose-600 font-bold';
                          } else {
                            btnStyle = 'opacity-50 border-slate-200 dark:border-slate-800 text-slate-400';
                          }
                        }

                        return (
                          <button
                            key={opt.letter}
                            onClick={() => handleSelectAnswer(q, opt.letter)}
                            disabled={isAnswered}
                            className={`p-3.5 rounded-2xl border text-right transition-all flex items-center justify-between text-xs sm:text-sm ${btnStyle}`}
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center font-bold text-xs">
                                {opt.letter}
                              </span>
                              <span>{opt.text}</span>
                            </span>

                            {isAnswered && isThisCorrect && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation after answer */}
                    {isAnswered && (
                      <div className="mt-4 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        <strong className="text-emerald-700 dark:text-emerald-400">الشرح والتفسير التربوي: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SubTab 4: Projects */}
        {activeSubTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Icon3D name="project" size="md" />
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  مشاريع وتطبيقات الوحدة العملية:
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  مشاريع تطبيقية من الكتاب المدرسي لترسيخ المهارات البرمجية وبناء معرض أعمال الطالب
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentChapter.projects.map((proj, pIdx) => (
                <div
                  key={pIdx}
                  className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 space-y-3"
                >
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                    مشروع تطبيقي #{pIdx + 1}
                  </span>
                  <h4 className="font-bold text-base text-slate-900 dark:text-white">{proj.title}</h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SubTab 5: Summary */}
        {activeSubTab === 'summary' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-2">
              <Icon3D name="summary" size="md" />
              <div>
                <h3 className="font-black text-base text-slate-900 dark:text-white">
                  ملخص الوحدة وأهم النقاط المستفادة:
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  مراجعة سريعة لأهم المفاهيم والقواعد البرمجية الواردة في {currentChapter.title}
                </p>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-3">
              {currentChapter.summary.map((sumItem, sIdx) => (
                <div key={sIdx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {sumItem}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. Complete Book Appendices (Appendix A: 22 Libraries Table + Appendix B: 8 Troubleshooting Items) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-950 border border-slate-800 text-white space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <Icon3D name="appendix" size="lg" />
            <div>
              <span className="text-xs font-bold text-amber-400">
                الصفحات 209 - 213 في الكتاب المدرسي
              </span>
              <h3 className="font-black text-lg sm:text-xl text-white">
                {BOOK_APPENDICES.title}
              </h3>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-slate-800 text-xs text-slate-300 border border-slate-700 self-start sm:self-center">
            مرجع شامل لجميع مكتبات وأخطاء بايثون
          </span>
        </div>

        <div className="space-y-6">
          {BOOK_APPENDICES.sections.map((app, aIdx) => (
            <div key={aIdx} className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {app.badge}
                </span>
                <h4 className="font-black text-base text-white">{app.title}</h4>
              </div>

              {app.content && <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{app.content}</p>}

              {app.command && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-emerald-400">
                    الأمر الموحد لتثبيت كافة مكتبات الكتاب دفعة واحدة:
                  </span>
                  <div
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 select-all overflow-x-auto text-left"
                    dir="ltr"
                  >
                    $ {app.command}
                  </div>
                </div>
              )}

              {/* Full 22-Library Table in Appendix A */}
              {app.librariesTable && (
                <div className="overflow-x-auto rounded-2xl border border-slate-800 mt-3">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-900 text-slate-200 font-bold border-b border-slate-800">
                      <tr>
                        {app.librariesTable.headers.map((h, hIdx) => (
                          <th key={hIdx} className="px-4 py-3">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      {app.librariesTable.rows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-900/50">
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`px-4 py-2.5 ${
                                cIdx === 1
                                  ? 'font-mono text-emerald-400 text-left'
                                  : cIdx === 0
                                  ? 'font-bold text-white font-mono'
                                  : 'text-slate-300'
                              }`}
                              dir={cIdx === 1 ? 'ltr' : undefined}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Built-in Libraries list */}
              {app.builtinLibraries && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold text-amber-300">
                    مكتبات مدمجة مع لغة بايثون (لا تحتاج إلى pip install):
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {app.builtinLibraries.map((lib: string, lIdx: number) => (
                      <span
                        key={lIdx}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-[11px] font-mono border border-slate-700"
                      >
                        {lib}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Troubleshooting items in Appendix B */}
              {app.troubleshooting && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {app.troubleshooting.map((tb, tIdx) => (
                    <div
                      key={tIdx}
                      className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5"
                    >
                      <div className="font-bold text-xs text-rose-400 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-md bg-rose-500/20 text-rose-300 flex items-center justify-center text-[10px]">
                          {tIdx + 1}
                        </span>
                        <span>{tb.issue}</span>
                      </div>
                      {tb.cause && (
                        <p className="text-[11px] text-amber-300/90">
                          <strong>السبب: </strong>
                          {tb.cause}
                        </p>
                      )}
                      <p className="text-xs text-slate-300 leading-relaxed">
                        <strong className="text-emerald-400">الحل: </strong>
                        {tb.solution}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

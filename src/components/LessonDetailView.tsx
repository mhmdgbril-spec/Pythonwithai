import React, { useState } from 'react';
import { Lesson, StudentProfile, ColorThemeId } from '../types';
import { COLOR_THEMES } from '../utils/theme';
import { PythonRuntime } from '../utils/pythonRunner';
import confetti from 'canvas-confetti';
import { 
  ArrowRight, 
  CheckCircle2, 
  Lightbulb, 
  Play, 
  RotateCcw, 
  Eye, 
  Terminal, 
  Clock, 
  ChevronRight, 
  ChevronLeft,
  Award,
  Sparkles,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  lesson: Lesson;
  student: StudentProfile;
  currentTheme: ColorThemeId;
  onBackToPath: () => void;
  onCompleteLesson: (lessonId: string, earnedXp: number) => void;
  onNavigateLesson: (targetLessonId: string) => void;
  prevLessonId?: string;
  nextLessonId?: string;
  soundEnabled: boolean;
  onExercisePassed?: (xp: number, exerciseTitle: string, exerciseId: string) => void;
}

export const LessonDetailView: React.FC<Props> = ({
  lesson,
  student,
  currentTheme,
  onBackToPath,
  onCompleteLesson,
  onNavigateLesson,
  prevLessonId,
  nextLessonId,
  soundEnabled,
  onExercisePassed
}) => {
  const theme = COLOR_THEMES[currentTheme] || COLOR_THEMES.emerald;
  const runner = new PythonRuntime();

  // State for predict first
  const [showPredictionAnswer, setShowPredictionAnswer] = useState(false);

  // State for solved example
  const [exampleOutput, setExampleOutput] = useState<string | null>(null);
  const [isExampleRunning, setIsExampleRunning] = useState(false);

  // State for exercises
  const [exerciseCodes, setExerciseCodes] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    lesson.exercises.forEach(ex => {
      initial[ex.id] = ex.initialCode || '';
    });
    return initial;
  });

  const [exerciseOutputs, setExerciseOutputs] = useState<Record<string, { text: string; error?: string }>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>({});
  const [exerciseStatus, setExerciseStatus] = useState<Record<string, { passed: boolean; message: string }>>({});

  // Free playground state
  const [playgroundCode, setPlaygroundCode] = useState(lesson.freePlaygroundDefaultCode || 'print("مرحبًا بكم في المختبر!")');
  const [playgroundOutput, setPlaygroundOutput] = useState<string | null>(null);

  const isLessonAlreadyCompleted = student.completedLessons.includes(lesson.id);

  // Run solved example
  const handleRunExample = () => {
    playSound('click', soundEnabled);
    setIsExampleRunning(true);
    setTimeout(() => {
      const res = runner.execute(lesson.solvedExample.code);
      setExampleOutput(res.output || res.error || '');
      setIsExampleRunning(false);
      playSound('success', soundEnabled);
    }, 200);
  };

  // Run specific exercise
  const handleRunExercise = (exerciseId: string) => {
    playSound('click', soundEnabled);
    const code = exerciseCodes[exerciseId] || '';
    const res = runner.execute(code);
    setExerciseOutputs(prev => ({
      ...prev,
      [exerciseId]: {
        text: res.output,
        error: res.error
      }
    }));
  };

  // Verify exercise
  const handleVerifyExercise = (exIndex: number) => {
    playSound('click', soundEnabled);
    const ex = lesson.exercises[exIndex];
    const code = exerciseCodes[ex.id] || '';
    const res = runner.execute(code);

    // Update outputs
    setExerciseOutputs(prev => ({
      ...prev,
      [ex.id]: {
        text: res.output,
        error: res.error
      }
    }));

    let isPassed = false;
    if (ex.testFunction) {
      const result = ex.testFunction(res.output, code);
      setExerciseStatus(prev => ({ ...prev, [ex.id]: result }));
      isPassed = result.passed;
      if (result.passed) {
        playSound('success', soundEnabled);
      } else {
        playSound('error', soundEnabled);
      }
    } else if (ex.expectedOutput) {
      const passed = res.output.trim() === ex.expectedOutput.trim();
      isPassed = passed;
      setExerciseStatus(prev => ({
        ...prev,
        [ex.id]: {
          passed,
          message: passed ? 'إجابة نموذجية وصحيحة تمامًا! أحسنت' : `الناتج المتوقع هو: ${ex.expectedOutput}`
        }
      }));
      if (passed) {
        playSound('success', soundEnabled);
      } else {
        playSound('error', soundEnabled);
      }
    }

    if (isPassed && onExercisePassed) {
      onExercisePassed(ex.xp, ex.title, ex.id);
    }
  };

  // Reveal hint
  const handleRevealNextHint = (exId: string, totalHints: number) => {
    playSound('click', soundEnabled);
    setRevealedHints(prev => {
      const current = prev[exId] || 0;
      return {
        ...prev,
        [exId]: Math.min(current + 1, totalHints)
      };
    });
  };

  // Complete entire lesson
  const handleMarkComplete = () => {
    playSound('complete', soundEnabled);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    const earnedXp = lesson.exercises.reduce((sum, e) => sum + e.xp, 0) || 50;
    onCompleteLesson(lesson.id, earnedXp);
  };

  // Count how many exercises verified
  const passedExercisesCount = lesson.exercises.filter(ex => exerciseStatus[ex.id]?.passed).length;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 animate-fadeIn">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <button
          onClick={() => {
            playSound('click', soundEnabled);
            onBackToPath();
          }}
          className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition"
        >
          <ArrowRight className="w-4 h-4" />
          <span>رجوع إلى مسار التعلّم</span>
        </button>

        <div className="flex items-center gap-2">
          {prevLessonId && (
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onNavigateLesson(prevLessonId);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <ChevronRight className="w-4 h-4" />
              <span>الدرس السابق</span>
            </button>
          )}

          <div className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            {passedExercisesCount}/{lesson.exercises.length} مكتمل ✓
          </div>

          {nextLessonId && (
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onNavigateLesson(nextLessonId);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <span>الدرس التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Lesson Header Title */}
      <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>الفصل {lesson.number}</span>
          <span>·</span>
          <span>الدرس #{lesson.globalNumber}</span>
          <span>·</span>
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            {lesson.estimatedMinutes} دقائق
          </span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          {lesson.title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          {lesson.subtitle}
        </p>
      </div>

      {/* Section 1: Why it matters */}
      <div className="p-5 sm:p-6 rounded-3xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-200 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-amber-900 dark:text-amber-300 mb-1">
              لماذا هذا المفهوم مهم للمبرمج؟
            </h3>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {lesson.whyItMatters}
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Predict First (توقّع أولًا) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400">
              توقّع أولاً قبل الشرح
            </span>
            <span className="text-xs text-slate-400">تمرين ذهني خوارزمي</span>
          </div>
        </div>

        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          {lesson.predictFirst.question}
        </p>

        {/* Code Snippet Box */}
        <div className="rounded-2xl bg-slate-950 p-4 text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner text-left" dir="ltr">
          <pre className="text-left font-mono" dir="ltr" style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'plaintext' }}>{lesson.predictFirst.code}</pre>
        </div>

        {/* Reveal Answer Button */}
        {!showPredictionAnswer ? (
          <button
            onClick={() => {
              playSound('click', soundEnabled);
              setShowPredictionAnswer(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            <Eye className="w-4 h-4 text-emerald-500" />
            <span>اكشف الإجابة والتحليل الآن</span>
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 animate-fadeIn">
            <div className="font-bold text-emerald-700 dark:text-emerald-400">
              💡 الإجابة الصحيحة: {lesson.predictFirst.answer}
            </div>
            <p className="leading-relaxed">
              {lesson.predictFirst.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Section 3: Concepts & Theory */}
      <div className="space-y-4">
        {lesson.theorySections.map((sec, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-lg">
                {sec.badge}
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {sec.heading}
              </h3>
            </div>
            {sec.paragraphs.map((p, pIdx) => (
              <p key={pIdx} className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Section 4: Solved Example */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400">
              مثال محلول عملي
            </span>
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {lesson.solvedExample.title}
            </h3>
          </div>

          <button
            onClick={handleRunExample}
            disabled={isExampleRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-90 transition disabled:opacity-50"
            style={{ backgroundColor: theme.primary }}
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>{isExampleRunning ? 'جارٍ التشغيل...' : 'شغّل المثال'}</span>
          </button>
        </div>

        <div className="rounded-2xl bg-slate-950 p-4 text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto" dir="ltr">
          <pre>{lesson.solvedExample.code}</pre>
        </div>

        {exampleOutput !== null && (
          <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800 font-mono text-xs text-white space-y-1" dir="ltr">
            <div className="text-[10px] text-slate-500 font-sans uppercase">خرْج البرنامج (Terminal Output):</div>
            <pre className="text-emerald-400 whitespace-pre-wrap">{exampleOutput || 'لا يوجد ناتج نصي'}</pre>
          </div>
        )}

        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {lesson.solvedExample.explanation}
        </p>
      </div>

      {/* Section 5: Guided Interactive Exercises */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              تحديات الإتقان البرمجية
            </h2>
          </div>
          <span className="text-xs text-slate-500">
            حل التمارين واضغط تحقّق لاحتساب نقاط الخبرة
          </span>
        </div>

        {lesson.exercises.map((ex, exIdx) => {
          const currentCode = exerciseCodes[ex.id] || '';
          const currentOut = exerciseOutputs[ex.id];
          const status = exerciseStatus[ex.id];
          const revealedHintCount = revealedHints[ex.id] || 0;

          return (
            <div
              key={ex.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
                      تحدي {exIdx + 1}
                    </span>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                      +{ex.xp} XP
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mt-1">
                    {ex.title}
                  </h3>
                </div>

                {status?.passed && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-4 h-4" />
                    تم الاجتياز بنجاح!
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {ex.instruction}
              </p>

              {/* Code Editor Box */}
              <div className="space-y-2">
                <div className="relative rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
                  <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                      محرر بايثون التفاعلي
                    </span>
                    <span>اختصار: تشغيل</span>
                  </div>
                  <textarea
                    value={currentCode}
                    onChange={(e) => {
                      const val = e.target.value;
                      setExerciseCodes(prev => ({ ...prev, [ex.id]: val }));
                    }}
                    rows={4}
                    className="w-full bg-slate-950 text-slate-100 p-4 focus:outline-none resize-y leading-relaxed selection:bg-emerald-500/30"
                    style={{ fontFamily: "'Cairo', 'JetBrains Mono', monospace" }}
                    dir="ltr"
                    spellCheck="false"
                  />
                </div>

                {/* Editor Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRunExercise(ex.id)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white transition"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>تشغيل الكود</span>
                    </button>
                    <button
                      onClick={() => {
                        playSound('click', soundEnabled);
                        setExerciseCodes(prev => ({ ...prev, [ex.id]: ex.initialCode || '' }));
                        setExerciseOutputs(prev => ({ ...prev, [ex.id]: { text: '' } }));
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                      title="إعادة تعيين الكود الأصلي"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => handleVerifyExercise(exIdx)}
                    className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold text-white shadow-sm hover:shadow transition"
                    style={{ backgroundColor: theme.primary }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تحقّق من الحل</span>
                  </button>
                </div>
              </div>

              {/* Output / Terminal Window */}
              {currentOut && (currentOut.text || currentOut.error) && (
                <div className="rounded-2xl bg-slate-950 p-4 font-mono text-xs space-y-1.5 border border-slate-800" dir="ltr">
                  <div className="text-[10px] text-slate-500">مخرجات الطرفية:</div>
                  {currentOut.text && (
                    <pre className="text-emerald-400 whitespace-pre-wrap">{currentOut.text}</pre>
                  )}
                  {currentOut.error && (
                    <pre className="text-rose-400 whitespace-pre-wrap">{currentOut.error}</pre>
                  )}
                </div>
              )}

              {/* Status Message */}
              {status && (
                <div
                  className={`p-3.5 rounded-2xl text-xs font-semibold flex items-start gap-2.5 ${
                    status.passed
                      ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/20'
                  }`}
                >
                  {status.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                  )}
                  <p className="leading-relaxed">{status.message}</p>
                </div>
              )}

              {/* Hints Ladder (سلّم التلميحات) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5" />
                    سلّم التلميحات الذكي
                  </span>
                  {revealedHintCount < ex.hints.length && (
                    <button
                      onClick={() => handleRevealNextHint(ex.id, ex.hints.length)}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      اكشف التلميح {revealedHintCount + 1}
                    </button>
                  )}
                </div>

                {revealedHintCount > 0 && (
                  <div className="space-y-2">
                    {ex.hints.slice(0, revealedHintCount).map((hint, hIdx) => (
                      <div
                        key={hIdx}
                        className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300"
                      >
                        <strong>تلميح {hIdx + 1}:</strong> {hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Section 6: Free Playground */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
              ملعب بايثون الحرّ
            </span>
            <span className="text-xs text-slate-400">لا قيود ولا اختبارات هنا — استكشف بفضولك</span>
          </div>

          <button
            onClick={() => {
              playSound('click', soundEnabled);
              const res = runner.execute(playgroundCode);
              setPlaygroundOutput(res.output || res.error || '');
            }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs"
            style={{ backgroundColor: theme.primary }}
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>تشغيل</span>
          </button>
        </div>

        <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden font-mono text-xs">
          <textarea
            value={playgroundCode}
            onChange={(e) => setPlaygroundCode(e.target.value)}
            rows={4}
            className="w-full bg-slate-950 text-slate-100 p-4 focus:outline-none resize-y leading-relaxed"
            style={{ fontFamily: "'Cairo', 'JetBrains Mono', monospace" }}
            dir="ltr"
            spellCheck="false"
          />
        </div>

        {playgroundOutput !== null && (
          <div className="rounded-2xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-emerald-400" dir="ltr">
            <pre className="whitespace-pre-wrap">{playgroundOutput || 'تم التنفيذ بدون مخرجات'}</pre>
          </div>
        )}
      </div>

      {/* Completion Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-emerald-950/40 border-2 border-emerald-500/30 text-center space-y-4">
        <div className="inline-flex p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            {isLessonAlreadyCompleted ? 'لقد أتممت هذا الدرس بنجاح سابقًا!' : 'أنهيت مفاهيم الدرس؟'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto mt-1">
            اضغط على زر الإكمال لحفظ تقدمك الدراسي، احتساب نقاط الخبرة في ملفك الشخصي، والمتابعة نحو الدرس القادم.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={handleMarkComplete}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: theme.primary }}
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>{isLessonAlreadyCompleted ? 'تأكيد الإنجاز مجددًا' : 'أكملت الدرس بنجاح 🎉'}</span>
          </button>

          {nextLessonId && (
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onNavigateLesson(nextLessonId);
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
            >
              <span>الانتقال للدرس التالي</span>
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

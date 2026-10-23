import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Clock,
  Flame,
  Sparkles,
  Terminal,
  ChevronDown,
  ChevronUp,
  Code2,
  Award,
  Calendar
} from 'lucide-react';
import { ColorThemeId, StudentProfile } from '../types';
import { COLOR_THEMES } from '../utils/theme';
import {
  DAILY_CHALLENGES_POOL,
  DailyChallenge,
  getDayKey,
  getDailyChallengeForDate,
  getTimeUntilNextChallenge,
  validateDailyChallengeSubmission
} from '../utils/dailyChallenge';
import { defaultPythonRunner } from '../utils/pythonRunner';
import { playSound } from '../utils/sound';
import { Icon3D } from './Icon3D';

interface DailyChallengeCardProps {
  student: StudentProfile;
  currentTheme: ColorThemeId;
  soundEnabled: boolean;
  onCompleteDailyChallenge: (challenge: DailyChallenge, dateKey: string) => void;
}

export const DailyChallengeCard: React.FC<DailyChallengeCardProps> = ({
  student,
  currentTheme,
  soundEnabled,
  onCompleteDailyChallenge
}) => {
  const theme = COLOR_THEMES[currentTheme] || COLOR_THEMES.emerald;

  // Official today challenge based on 24h cycle
  const [now, setNow] = useState<Date>(() => new Date());
  const todayKey = getDayKey(now);
  const officialChallenge = getDailyChallengeForDate(now);

  // Allow student to also preview/practice other days if desired, defaulting to today's official challenge
  const [selectedChallengeId, setSelectedChallengeId] = useState<string>(officialChallenge.id);
  const activeChallenge =
    DAILY_CHALLENGES_POOL.find(c => c.id === selectedChallengeId) || officialChallenge;
  const isOfficialToday = activeChallenge.id === officialChallenge.id;

  // Sync if midnight rolls over while page is open
  useEffect(() => {
    setSelectedChallengeId(officialChallenge.id);
  }, [officialChallenge.id]);

  // Live 24-hour countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const countdown = getTimeUntilNextChallenge(now);

  // Completion status
  const completedList = student.completedDailyChallenges || [];
  const isTodayCompleted =
    student.lastDailyChallengeDate === todayKey ||
    completedList.includes(todayKey) ||
    completedList.includes(`${todayKey}:${officialChallenge.id}`);

  const isSelectedChallengeCompleted = isOfficialToday
    ? isTodayCompleted
    : completedList.includes(activeChallenge.id);

  // Workbench state
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [code, setCode] = useState<string>(activeChallenge.starterCode);
  const [output, setOutput] = useState<string>('');
  const [execError, setExecError] = useState<string | undefined>(undefined);
  const [validationState, setValidationState] = useState<{
    checked: boolean;
    passed: boolean;
    feedback: string;
  }>({ checked: false, passed: false, feedback: '' });
  const [revealedHintsCount, setRevealedHintsCount] = useState<number>(0);

  // Reset editor when switching challenges
  useEffect(() => {
    setCode(activeChallenge.starterCode);
    setOutput('');
    setExecError(undefined);
    setValidationState({ checked: false, passed: false, feedback: '' });
    setRevealedHintsCount(0);
  }, [activeChallenge.id, activeChallenge.starterCode]);

  const handleRunAndVerify = () => {
    playSound('click', soundEnabled);
    const result = defaultPythonRunner.execute(code);
    setOutput(result.output);
    setExecError(result.error);

    const validation = validateDailyChallengeSubmission(
      activeChallenge,
      code,
      result.output,
      result.success,
      result.error
    );

    setValidationState({
      checked: true,
      passed: validation.passed,
      feedback: validation.feedback
    });

    if (validation.passed) {
      playSound('success', soundEnabled);
      onCompleteDailyChallenge(activeChallenge, todayKey);
    }
  };

  const handleResetCode = () => {
    playSound('click', soundEnabled);
    setCode(activeChallenge.starterCode);
    setOutput('');
    setExecError(undefined);
    setValidationState({ checked: false, passed: false, feedback: '' });
  };

  const handleShowHint = () => {
    playSound('click', soundEnabled);
    setRevealedHintsCount(prev => Math.min(activeChallenge.hints.length, prev + 1));
  };

  const handleFillSolution = () => {
    playSound('click', soundEnabled);
    setCode(activeChallenge.solutionCode);
  };

  return (
    <section
      aria-label="نظام التحدي اليومي"
      data-testid="daily-challenge-card"
      className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
    >
      {/* Top Banner Header */}
      <div className="p-6 sm:p-7 border-b border-slate-100 dark:border-slate-800/80 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          <Icon3D name={isTodayCompleted ? 'trophy' : 'rocket'} size="md" className="shrink-0 mt-0.5" />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="font-bold text-emerald-700 dark:text-emerald-400">
                نظام التحدي اليومي (24 ساعة)
              </span>
              <span aria-hidden="true">·</span>
              <span>التحدي #{activeChallenge.dayNumber} من 14</span>
              <span aria-hidden="true">·</span>
              <span>{activeChallenge.category}</span>
              <span aria-hidden="true">·</span>
              <span>المستوى: {activeChallenge.difficulty}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {activeChallenge.title}
              </h2>
              {isSelectedChallengeCompleted ? (
                <span
                  data-testid="daily-challenge-status-completed"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>مكتمل اليوم</span>
                </span>
              ) : (
                <span
                  data-testid="daily-challenge-status-active"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400"
                >
                  <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>مهمة اليوم متاحة</span>
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              {activeChallenge.unitReference} — مهمة برمجية يومية واحدة تتجدد تلقائياً كل 24 ساعة لتعزيز الاستمرارية.
            </p>
          </div>
        </div>

        {/* Right Controls: 24h Countdown + XP Reward + Collapse Button */}
        <div className="flex flex-wrap items-center gap-4 shrink-0">
          {/* 24-hour Live Countdown */}
          <div
            data-testid="daily-challenge-countdown"
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70"
          >
            <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
            <div className="text-right">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
                يتجدد التحدي خلال
              </div>
              <div className="font-mono font-bold text-sm text-slate-900 dark:text-white tabular-nums tracking-wider mt-1">
                {countdown.formatted}
              </div>
            </div>
          </div>

          {/* Reward Summary */}
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70">
            <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-right">
              <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-none">
                مكافأة الاستمرارية
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white tabular-nums mt-1">
                +{activeChallenge.xpReward} XP · +1 يوم حماس
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playSound('click', soundEnabled);
              setIsExpanded(prev => !prev);
            }}
            aria-expanded={isExpanded}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition whitespace-nowrap shrink-0"
          >
            <span>{isExpanded ? 'طيّ مساحة التحدي' : 'فتح مساحة التحدي'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expandable Two-Zone Sandbox Workbench */}
      {isExpanded && (
        <div className="p-6 sm:p-7 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Right Zone (in RTL): Mission Brief, Goal, Hints, and Day Selector (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>وصف المهمة البرمجية اليومية</span>
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeChallenge.prompt}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                المطلوب تحقيقه للنجاح:
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeChallenge.goalDescription}
              </p>
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">المخرجات المتوقعة:</span>
                <code
                  dir="ltr"
                  className="font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  {activeChallenge.expectedOutput.replace(/\n/g, ' ↵ ')}
                </code>
              </div>
            </div>

            {/* Interactive Hints & Learning Support */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  data-testid="daily-challenge-hint-btn"
                  onClick={handleShowHint}
                  disabled={revealedHintsCount >= activeChallenge.hints.length}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 disabled:opacity-50 transition whitespace-nowrap shrink-0"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>
                    {revealedHintsCount === 0
                      ? 'عرض تلميح ذكي'
                      : revealedHintsCount < activeChallenge.hints.length
                      ? 'تلميح إضافي'
                      : 'تم عرض كل التلميحات'}
                  </span>
                </button>

                <button
                  type="button"
                  data-testid="daily-challenge-solution-btn"
                  onClick={handleFillSolution}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition whitespace-nowrap shrink-0"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>إدراج الحل النموذجي</span>
                </button>
              </div>

              {revealedHintsCount > 0 && (
                <div
                  data-testid="daily-challenge-hints-box"
                  className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/50 space-y-1.5"
                >
                  {activeChallenge.hints.slice(0, revealedHintsCount).map((hint, idx) => (
                    <p key={idx} className="text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                      {idx + 1}. {hint}
                    </p>
                  ))}
                </div>
              )}
            </div>

            {/* Day Selector for Exploring Archive / Practice Challenges */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <label
                htmlFor="daily-challenge-selector"
                className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>تصفح بنك التحديات اليومية (14 يومًا):</span>
              </label>
              <select
                id="daily-challenge-selector"
                value={activeChallenge.id}
                onChange={e => setSelectedChallengeId(e.target.value)}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {DAILY_CHALLENGES_POOL.map(item => {
                  const isTodayItem = item.id === officialChallenge.id;
                  return (
                    <option key={item.id} value={item.id}>
                      اليوم {item.dayNumber}: {item.title} {isTodayItem ? ' (تحدي اليوم الحالي ★)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Left Zone (in RTL): Interactive Python Code Editor + Terminal Output (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 text-slate-100">
              {/* Editor Top Bar */}
              <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>daily_challenge_{activeChallenge.dayNumber}.py</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetCode}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800 transition whitespace-nowrap shrink-0"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>إعادة ضبط</span>
                  </button>
                </div>
              </div>

              {/* Code Textarea */}
              <div className="p-3">
                <label htmlFor="daily-challenge-code-editor" className="sr-only">
                  محرر كود التحدي اليومي
                </label>
                <textarea
                  id="daily-challenge-code-editor"
                  data-testid="daily-challenge-editor"
                  dir="ltr"
                  rows={6}
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  spellCheck={false}
                  className="w-full bg-slate-950 text-emerald-300 font-mono text-sm leading-relaxed p-2 focus:outline-none resize-y"
                />
              </div>

              {/* Action Bar inside Editor Container */}
              <div className="px-4 py-3 bg-slate-900/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-slate-400">
                  اكتب كود بايثون ثم اضغط على زر التحقق الفوري
                </span>
                <button
                  type="button"
                  data-testid="daily-challenge-run-btn"
                  onClick={handleRunAndVerify}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm hover:opacity-95 transition whitespace-nowrap shrink-0"
                  style={{ backgroundColor: theme.primary }}
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>تشغيل والتحقق من الحل</span>
                </button>
              </div>
            </div>

            {/* Terminal Output & Validation Result */}
            {(output || execError || validationState.checked) && (
              <div
                data-testid="daily-challenge-result-box"
                className="rounded-2xl p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span>مخرجات التنفيذ (Output):</span>
                  <span className="font-mono text-[11px] text-slate-400">Python 3.x Client Runtime</span>
                </div>

                {execError ? (
                  <pre
                    dir="rtl"
                    className="p-3 rounded-xl bg-red-950/90 text-red-200 font-mono text-xs whitespace-pre-wrap leading-relaxed"
                  >
                    {execError}
                  </pre>
                ) : (
                  <pre
                    dir="ltr"
                    data-testid="daily-challenge-output"
                    className="p-3 rounded-xl bg-slate-900 text-emerald-300 font-mono text-xs whitespace-pre-wrap leading-relaxed min-h-[42px]"
                  >
                    {output || '(لا توجد مخرجات مطبوعة)'}
                  </pre>
                )}

                {validationState.checked && (
                  <div
                    data-testid="daily-challenge-feedback"
                    className={`p-3.5 rounded-xl border text-xs font-semibold flex items-start gap-2.5 ${
                      validationState.passed
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                        : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    }`}
                  >
                    <CheckCircle2
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        validationState.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'
                      }`}
                    />
                    <div className="space-y-1">
                      <div>{validationState.feedback}</div>
                      {validationState.passed && (
                        <div className="text-[11px] opacity-90">
                          تم توثيق إنجاز التحدي اليومي في سجلّك التدريبي بنجاح!
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

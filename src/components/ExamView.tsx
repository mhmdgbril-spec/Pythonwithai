import React, { useState, useEffect } from 'react';
import { ColorThemeId, StudentProfile, ExamQuestion } from '../types';
import { COLOR_THEMES } from '../utils/theme';
import { getRandomExamQuestions } from '../data/examQuestions';
import confetti from 'canvas-confetti';
import { 
  GraduationCap, 
  Clock, 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Play, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  student: StudentProfile;
  currentTheme: ColorThemeId;
  onSaveExamResult: (score: number, passed: boolean) => void;
  onViewCertificate: () => void;
  soundEnabled: boolean;
}

export const ExamView: React.FC<Props> = ({
  student,
  currentTheme,
  onSaveExamResult,
  onViewCertificate,
  soundEnabled
}) => {
  const theme = COLOR_THEMES[currentTheme] || COLOR_THEMES.emerald;

  const [isExamStarted, setIsExamStarted] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  // Timer loop
  useEffect(() => {
    if (!isExamStarted || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isExamStarted, isSubmitted]);

  const handleStartExam = () => {
    playSound('click', soundEnabled);
    const qList = getRandomExamQuestions(10);
    setQuestions(qList);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setTimeLeft(20 * 60);
    setIsSubmitted(false);
    setIsExamStarted(true);
  };

  const handleSelectOption = (qId: number, optIndex: number) => {
    if (isSubmitted) return;
    playSound('click', soundEnabled);
    setSelectedAnswers(prev => ({ ...prev, [qId]: optIndex }));
  };

  const handleSubmitExam = () => {
    playSound('click', soundEnabled);
    let correctCount = 0;
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const scorePercentage = Math.round((correctCount / Math.max(1, questions.length)) * 100);
    setFinalScore(scorePercentage);
    setIsSubmitted(true);

    const passed = scorePercentage >= 80;
    onSaveExamResult(scorePercentage, passed);

    if (passed) {
      playSound('levelUp', soundEnabled);
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } else {
      playSound('error', soundEnabled);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // If exam has not started yet
  if (!isExamStarted) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn pb-12">
        <div className="text-center space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-sm">
            <GraduationCap className="w-9 h-9" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">
            امتحان بايثون والتقنية الرقمية المعتمد
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            اختبار تقييمي شامل بإشراف أ/ محمد جبريل — يقيس إتقانك للأساسيات البرمجية وهياكل البيانات والتفكير الخوارزمي
          </p>
        </div>

        {/* Previous Best Score Notice */}
        {student.examScore !== undefined && (
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  أعلى نتيجة سابقة لك: {student.examScore}%
                </h3>
                <p className="text-xs text-slate-500">
                  {student.examPassed ? '🎉 لقد اجتزت الامتحان بنجاح وحصلت على الشهادة!' : 'تحتاج 80% أو أعلى للحصول على الشهادة المعتمدة'}
                </p>
              </div>
            </div>

            {student.examPassed && (
              <button
                onClick={() => {
                  playSound('click', soundEnabled);
                  onViewCertificate();
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs"
                style={{ backgroundColor: theme.primary }}
              >
                <FileText className="w-4 h-4" />
                <span>عرض الشهادة</span>
              </button>
            )}
          </div>
        )}

        {/* Rules Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-500" />
            <span>قواعد وإرشادات الامتحان</span>
          </h3>

          <ul className="space-y-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">1</span>
              <span><strong>الوقت المخصص:</strong> 20 دقيقة للإجابة على 10 أسئلة تسحب عشوائيًا من بنك الأسئلة المعتمد.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">2</span>
              <span><strong>نوع الأسئلة:</strong> اختيار من متعدد (اختيار إجابة واحدة صحيحة) — لا توجد علامات سلبية للإجابات الخاطئة.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">3</span>
              <span><strong>معيار النجاح والشهادة:</strong> الحصول على نسبة <strong>80% أو أعلى</strong> يفتح فورًا شهادة الإنجاز الرسمية الموقعة باسم أ/ محمد جبريل بمدارس النخبة العلمية.</span>
            </li>
          </ul>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <button
              onClick={handleStartExam}
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-transform hover:scale-105 mx-auto"
              style={{ backgroundColor: theme.primary }}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>ابدأ محاولة الامتحان الآن</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If exam has been submitted: Results Screen
  if (isSubmitted) {
    const passed = finalScore >= 80;
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fadeIn pb-12">
        <div className={`p-8 rounded-3xl text-center space-y-4 border-2 shadow-lg ${
          passed 
            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-950 dark:text-emerald-200'
            : 'bg-rose-500/10 border-rose-500/40 text-rose-950 dark:text-rose-200'
        }`}>
          <div className="inline-flex p-4 rounded-3xl bg-white dark:bg-slate-900 shadow-md">
            {passed ? (
              <CheckCircle2 className="w-12 h-12 text-emerald-500" />
            ) : (
              <XCircle className="w-12 h-12 text-rose-500" />
            )}
          </div>

          <div>
            <h2 className="text-3xl font-black">
              {passed ? 'مبارك! اجتزت الامتحان بتفوق 🎓' : 'محاولة جيدة — تحتاج مراجعة بسيطة'}
            </h2>
            <div className="text-4xl font-black mt-2">
              {finalScore}%
            </div>
            <p className="text-xs sm:text-sm mt-2 opacity-80">
              {passed 
                ? 'لقد استوفيت متطلبات الاعتماد الأكاديمي بنجاح واكتسبت شهادة الإنجاز الرسمية!'
                : 'معيار الاجتياز هو 80% — يمكنك مراجعة الأسئلة وتكرار المحاولة في أي وقت.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            {passed && (
              <button
                onClick={() => {
                  playSound('click', soundEnabled);
                  onViewCertificate();
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition"
              >
                <Award className="w-4 h-4" />
                <span>عرض وتحميل الشهادة الرسمية</span>
              </button>
            )}

            <button
              onClick={handleStartExam}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-xs bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة المحاولة بأسئلة جديدة</span>
            </button>
          </div>
        </div>

        {/* Detailed Review of Each Question */}
        <div className="space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            مراجعة تفصيلية لإجاباتك مع التفسير العلمي:
          </h3>

          {questions.map((q, idx) => {
            const userChoice = selectedAnswers[q.id];
            const isCorrect = userChoice === q.correctAnswer;

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    السؤال {idx + 1} · {q.topic}
                  </span>
                  <span className={`text-xs font-bold flex items-center gap-1 ${
                    isCorrect ? 'text-emerald-600' : 'text-rose-600'
                  }`}>
                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    {isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
                  </span>
                </div>

                <p className="font-semibold text-sm text-slate-900 dark:text-white">
                  {q.question}
                </p>

                {q.codeSnippet && (
                  <div className="p-3 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto" dir="ltr">
                    <pre>{q.codeSnippet}</pre>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {q.options.map((opt, oIdx) => {
                    const isSelected = userChoice === oIdx;
                    const isCorrectAnswer = q.correctAnswer === oIdx;

                    let badgeColor = 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-800';
                    if (isCorrectAnswer) {
                      badgeColor = 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                    } else if (isSelected && !isCorrect) {
                      badgeColor = 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300';
                    }

                    return (
                      <div
                        key={oIdx}
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${badgeColor}`}
                      >
                        <span>{opt}</span>
                        {isCorrectAnswer && <span className="text-[10px] text-emerald-600 font-bold">✓ الصحيحة</span>}
                        {isSelected && !isCorrect && <span className="text-[10px] text-rose-600">اختيارك ✗</span>}
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-800">
                  <strong>التفسير:</strong> {q.explanation}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Active Exam View
  const currentQ = questions[currentIndex];
  const userChoice = selectedAnswers[currentQ?.id];

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Timer & Progress Bar Header */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-semibold uppercase">الوقت المتبقي</div>
            <div className={`font-mono text-base font-black ${timeLeft < 180 ? 'text-rose-500 animate-pulse' : 'text-slate-800 dark:text-white'}`}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>

        {/* Question Counter */}
        <div className="text-left">
          <div className="text-[11px] text-slate-400 font-semibold">التقدم في الأسئلة</div>
          <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
            السؤال {currentIndex + 1} من {questions.length}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            الموضوع: {currentQ.topic}
          </span>
          <span className="text-xs text-slate-400">
            سؤال {currentIndex + 1} / {questions.length}
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
          {currentQ.question}
        </h2>

        {/* Code Snippet if present */}
        {currentQ.codeSnippet && (
          <div className="rounded-2xl bg-slate-950 p-4 text-emerald-400 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner" dir="ltr">
            <pre>{currentQ.codeSnippet}</pre>
          </div>
        )}

        {/* Options List */}
        <div className="space-y-3 pt-2">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = userChoice === optIdx;
            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(currentQ.id, optIdx)}
                className={`w-full p-4 rounded-2xl text-right flex items-center justify-between border-2 transition-all duration-150 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-500/5 dark:bg-emerald-950/20 text-slate-900 dark:text-white font-bold ring-2 ring-emerald-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-sm">{opt}</span>
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs ${
                  isSelected 
                    ? 'border-emerald-500 bg-emerald-500 text-white' 
                    : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {isSelected && '✓'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Next / Previous & Submit Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              playSound('click', soundEnabled);
              setCurrentIndex(prev => Math.max(0, prev - 1));
            }}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition"
          >
            السؤال السابق
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1));
              }}
              className="px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-xs transition"
              style={{ backgroundColor: theme.primary }}
            >
              السؤال التالي
            </button>
          ) : (
            <button
              onClick={handleSubmitExam}
              className="px-8 py-2.5 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition"
            >
              إنهاء الامتحان وتسليم الإجابات
            </button>
          )}
        </div>
      </div>

      {/* Question Selector Numbers Grid */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        {questions.map((q, idx) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const isCurrent = currentIndex === idx;
          return (
            <button
              key={q.id}
              onClick={() => {
                playSound('click', soundEnabled);
                setCurrentIndex(idx);
              }}
              className={`w-8 h-8 rounded-xl font-bold text-xs transition ${
                isCurrent
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : isAnswered
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
};

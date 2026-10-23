import React, { useState, useEffect } from 'react';
import { ColorThemeId } from '../types';
import { COLOR_THEMES } from '../utils/theme';
import { PythonRuntime } from '../utils/pythonRunner';
import { 
  Play, 
  Terminal, 
  RotateCcw, 
  Copy, 
  Download, 
  Check, 
  Sparkles, 
  Code2, 
  FileCode,
  Trash2
} from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  currentTheme: ColorThemeId;
  soundEnabled: boolean;
}

const TEMPLATES = [
  {
    id: 'hello',
    name: 'أول برنامج ترحيبي',
    category: 'مبتدئ',
    code: `# برنامج ترحيبي لطلاب مدارس النخبة العلمية بالدمام
# إشراف: أ/ محمد جبريل

name = "طالب النخبة المبدع"
print(f"أهلاً بك يا {name} في مختبر بايثون التفاعلي!")
print("جاهز لاكتشاف عالم التقنية الرقمية؟ 🚀")
`
  },
  {
    id: 'grades',
    name: 'حساب درجات ومعدلات الطلاب',
    category: 'هياكل بيانات',
    code: `# نظام حساب معدل درجات مادة التقنية الرقمية
grades = [92, 98, 85, 100, 94]

def analyze_grades(scores):
    average = sum(scores) / len(scores)
    highest = max(scores)
    lowest = min(scores)
    return average, highest, lowest

avg, high, low = analyze_grades(grades)
print("=== تقرير درجات النخبة العلمية ===")
print("عدد الاختبارات:", len(grades))
print("المعدل العام:", round(avg, 2))
print("أعلى درجة:", high)
print("أدنى درجة:", low)
`
  },
  {
    id: 'fibonacci',
    name: 'متتالية فيبوناتشي التكرارية',
    category: 'خوارزميات',
    code: `# توليد متتالية فيبوناتشي
def fibonacci(n):
    sequence = [0, 1]
    while len(sequence) < n:
        next_val = sequence[-1] + sequence[-2]
        sequence.append(next_val)
    return sequence

result = fibonacci(10)
print("أول 10 أرقام في متتالية فيبوناتشي:")
print(result)
`
  },
  {
    id: 'ai-classifier',
    name: 'مصنف ذكاء اصطناعي مبسط',
    category: 'ذكاء اصطناعي',
    code: `# مصنف إحصائي مبسط لتقدير سلوك الطلاب
def predict_mastery_level(solved_exercises, exam_score):
    # خلية عصبية بأوزان نسبية
    weights = [0.4, 0.6]
    bias = -10
    total = (solved_exercises * weights[0]) + (exam_score * weights[1]) + bias
    
    if total >= 60:
        return "🌟 متميز مؤهل لكابستون الذكاء الاصطناعي"
    elif total >= 40:
        return "👍 متقدم يسير بخطى واثقة"
    return "📚 يحتاج مزيدًا من التمارين المعملية"

print(predict_mastery_level(50, 92))
`
  }
];

export const PlaygroundView: React.FC<Props> = ({ currentTheme, soundEnabled }) => {
  const theme = COLOR_THEMES[currentTheme] || COLOR_THEMES.emerald;
  const runner = new PythonRuntime();

  const [code, setCode] = useState(TEMPLATES[0].code);
  const [output, setOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [copied, setCopied] = useState(false);

  // Keyboard shortcut: Press R to run (outside textarea if needed or general)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        runCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code]);

  const runCode = () => {
    playSound('click', soundEnabled);
    setIsRunning(true);
    setError(null);

    setTimeout(() => {
      const res = runner.execute(code);
      setOutput(res.output);
      setError(res.error || null);
      setExecutionTime(res.executionTimeMs);
      setIsRunning(false);

      if (res.success) {
        playSound('success', soundEnabled);
      } else {
        playSound('error', soundEnabled);
      }
    }, 150);
  };

  const handleCopyCode = () => {
    playSound('click', soundEnabled);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    playSound('click', soundEnabled);
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'nokhba_python_program.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearOutput = () => {
    playSound('click', soundEnabled);
    setOutput('');
    setError(null);
    setExecutionTime(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-7 h-7 text-emerald-500" />
            <span>المختبر التفاعلي (Python IDE)</span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            محرر بايثون احترافي فوري بدون خوادم خارجية — اكتب وشغّل واختبر أفكارك مباشرة
          </p>
        </div>

        {/* Template Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-slate-400 whitespace-nowrap hidden sm:inline">
            قوالب جاهزة:
          </span>
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => {
                playSound('click', soundEnabled);
                setCode(tpl.code);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-300 whitespace-nowrap transition"
            >
              {tpl.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Code Editor on Top/Left, Terminal on Bottom/Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Editor Box */}
        <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl flex flex-col h-[520px]">
          {/* Editor Header Bar */}
          <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="font-mono text-slate-300 font-semibold">main.py</span>
              <span className="text-[10px] text-slate-500">· لغة بايثون 3</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="نسخ الكود"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="تحميل كملف .py"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Textarea */}
          <div className="relative flex-1 p-4 font-mono text-xs sm:text-sm">
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-full bg-transparent text-emerald-300 focus:outline-none resize-none leading-relaxed selection:bg-emerald-500/30"
              style={{ fontFamily: "'Cairo', 'JetBrains Mono', monospace" }}
              dir="ltr"
              spellCheck="false"
              placeholder="# اكتب كود بايثون هنا..."
            />
          </div>

          {/* Editor Bottom Controls */}
          <div className="bg-slate-900/90 px-5 py-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono">Ctrl+Enter</kbd>
              <span>للتشغيل السريع</span>
            </div>

            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-md hover:shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
              style={{ backgroundColor: theme.primary }}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isRunning ? 'جارٍ المعالجة...' : 'تشغيل الكود الآن'}</span>
            </button>
          </div>
        </div>

        {/* Terminal / Output Box */}
        <div className="rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden shadow-xl flex flex-col h-[520px]">
          {/* Terminal Header */}
          <div className="bg-slate-900 px-5 py-3 border-b border-slate-800 flex items-center justify-between text-slate-400 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-slate-300 font-semibold">الطرفية (Console Output)</span>
            </div>

            <div className="flex items-center gap-3">
              {executionTime !== null && (
                <span className="text-[11px] font-mono text-slate-400">
                  {executionTime} ms
                </span>
              )}
              <button
                onClick={handleClearOutput}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                title="مسح مخرجات الشاشة"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="flex-1 p-5 font-mono text-xs sm:text-sm overflow-y-auto space-y-3" dir="ltr">
            {!output && !error ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 text-center font-sans space-y-2">
                <Terminal className="w-10 h-10 stroke-1 opacity-50" />
                <p className="text-xs">المخرجات ستظهر هنا عند الضغط على زر التشغيل</p>
                <p className="text-[11px] text-slate-700">مفسر بايثون جاهز للتنفيذ الفوري</p>
              </div>
            ) : (
              <>
                {output && (
                  <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed">
                    {output}
                  </pre>
                )}
                {error && (
                  <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-900/60 text-rose-300 font-sans text-xs space-y-1" dir="rtl">
                    <pre className="font-mono text-xs text-rose-400 whitespace-pre-wrap" dir="ltr">
                      {error}
                    </pre>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Terminal Footer Info */}
          <div className="bg-slate-900/60 px-5 py-2.5 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between font-sans">
            <span>منصة النخبة العلمية · أ/ محمد جبريل</span>
            <span className="text-emerald-400 font-mono">Python 3.12 (Browser Runtime)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

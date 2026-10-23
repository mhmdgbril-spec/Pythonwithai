import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  Sparkles,
  Play,
  Copy,
  Check,
  Trash2,
  Code2,
  Maximize2,
  Minimize2,
  BookOpen,
  Lightbulb,
  Terminal
} from 'lucide-react';
import type { ColorThemeId, Lesson, StudentProfile, TabType } from '../types';
import type { BookChapter } from '../data/bookChaptersData';
import { COLOR_THEMES } from '../utils/theme';
import { PythonRuntime } from '../utils/pythonRunner';
import { playSound } from '../utils/sound';
import {
  buildAssistantContext,
  getQuickPromptsForContext,
  parseMessageSegments,
  buildLocalEducationalFallback,
  type ChatMessage
} from '../utils/aiAssistantUtils';

interface Props {
  activeTab: TabType;
  activeLesson: Lesson | null;
  activeBookChapter: BookChapter | null;
  student: StudentProfile;
  currentTheme: ColorThemeId;
  soundEnabled: boolean;
}

export const PythonAiAssistant: React.FC<Props> = ({
  activeTab,
  activeLesson,
  activeBookChapter,
  student,
  currentTheme,
  soundEnabled
}) => {
  const theme = COLOR_THEMES[currentTheme] || COLOR_THEMES.emerald;
  const runnerRef = useRef(new PythonRuntime());

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [showCodeAttachment, setShowCodeAttachment] = useState(false);
  const [attachedCode, setAttachedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [codeOutputs, setCodeOutputs] = useState<Record<string, { output: string; success: boolean }>>({});

  const contextInfo = buildAssistantContext({
    activeTab,
    activeLesson,
    activeBookChapter
  });

  const quickPrompts = getQuickPromptsForContext(contextInfo);

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: [
        `مرحباً بك يا **${student.name}** في **مساعد بايثون الذكي** (Gemini AI)! 🤖🐍`,
        `أنا مرافقك البرمجي في منصة **بطل بايثون** بمدارس النخبة العلمية الأهلية بالدمام (إشراف أ/ محمد جبريل).`,
        'يمكنك سؤالي عن أي مفهوم في الدرس الحالي، أو طلب أمثلة برمجية إضافية، أو لصق كود بايثون لأشرحه لك وأساعدك في تصحيح أخطائه!\n\n```python\nprint("مرحباً بك في مساعد بايثون الذكي!")\n```'
      ].join('\n\n'),
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      contextLabel: 'ترحيب المنصة',
      source: 'gemini'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  const handleToggleOpen = () => {
    playSound('click', soundEnabled);
    setIsOpen(prev => !prev);
  };

  const handleClearChat = () => {
    playSound('click', soundEnabled);
    setCodeOutputs({});
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `تم بدء محادثة جديدة! نحن الآن في سياق **${contextInfo.contextTitle}**. كيف يمكنني مساعدتك برمجياً اليوم؟`,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        contextLabel: contextInfo.contextBadge,
        source: 'gemini'
      }
    ]);
  };

  const handleAttachSampleCode = () => {
    playSound('click', soundEnabled);
    setShowCodeAttachment(true);
    if (contextInfo.sampleCode && !attachedCode.trim()) {
      setAttachedCode(contextInfo.sampleCode);
    }
  };

  const handleRunSnippet = (key: string, code: string) => {
    playSound('click', soundEnabled);
    const result = runnerRef.current.execute(code);
    setCodeOutputs(prev => ({
      ...prev,
      [key]: {
        output: result.output,
        success: result.success
      }
    }));
    if (result.success) {
      playSound('success', soundEnabled);
    } else {
      playSound('error', soundEnabled);
    }
  };

  const handleCopySnippet = (key: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sendMessage = async (promptText: string) => {
    const trimmed = promptText.trim();
    if (!trimmed || isLoading) return;

    playSound('click', soundEnabled);

    const codeToInclude = showCodeAttachment && attachedCode.trim() ? attachedCode.trim() : undefined;
    const displayContent = codeToInclude
      ? `${trimmed}\n\n\`\`\`python\n${codeToInclude}\n\`\`\``
      : trimmed;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: displayContent,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
      contextLabel: contextInfo.contextBadge
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (showCodeAttachment) {
      setShowCodeAttachment(false);
      setAttachedCode('');
    }
    setIsLoading(true);

    try {
      const response = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          codeContext: codeToInclude,
          history: messages.slice(-6).map(m => ({ role: m.role, content: m.content })),
          context: contextInfo,
          studentName: student.name
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const replyContent =
        typeof data.reply === 'string' && data.reply.trim()
          ? data.reply
          : buildLocalEducationalFallback(trimmed, contextInfo);

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        contextLabel: contextInfo.contextBadge,
        source: data.source || 'gemini'
      };

      setMessages(prev => [...prev, assistantMsg]);
      playSound('success', soundEnabled);
    } catch {
      const fallbackReply = buildLocalEducationalFallback(trimmed, contextInfo);
      const assistantMsg: ChatMessage = {
        id: `ai-fallback-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        contextLabel: contextInfo.contextBadge,
        source: 'local-tutor'
      };
      setMessages(prev => [...prev, assistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Corner Button */}
      <div className="fixed bottom-5 left-5 z-50 flex flex-col items-start gap-2" dir="rtl">
        {!isOpen && (
          <button
            type="button"
            onClick={handleToggleOpen}
            aria-label="فتح مساعد بايثون الذكي"
            data-testid="ai-assistant-fab"
            className={`group relative flex items-center gap-3 pl-5 pr-3.5 py-3 rounded-2xl bg-gradient-to-r ${theme.gradientClass} text-white shadow-2xl shadow-emerald-950/30 hover:scale-[1.03] active:scale-95 transition-all duration-200 border border-white/25 cursor-pointer`}
          >
            {/* 3D Isometric Robot & Python Assistant SVG Badge */}
            <div className="relative w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/30 shadow-inner shrink-0">
              <svg viewBox="0 0 64 64" className="w-8 h-8 drop-shadow-md" aria-hidden="true">
                <defs>
                  <linearGradient id="aiBotHead" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                  <linearGradient id="aiBotAccent" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fde047" />
                    <stop offset="100%" stopColor="#f59e0b" />
                  </linearGradient>
                </defs>
                {/* Antenna */}
                <line x1="32" y1="6" x2="32" y2="14" stroke="#fde047" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="32" cy="6" r="4" fill="url(#aiBotAccent)" />
                {/* 3D Head Shell */}
                <rect x="12" y="14" width="40" height="32" rx="10" fill="url(#aiBotHead)" stroke="#ffffff" strokeWidth="2" />
                {/* Screen Visor */}
                <rect x="17" y="20" width="30" height="16" rx="6" fill="#0f172a" />
                {/* Glowing Eyes */}
                <circle cx="25" cy="28" r="3.5" fill="#34d399" />
                <circle cx="39" cy="28" r="3.5" fill="#34d399" />
                {/* Friendly Smile */}
                <path d="M 26 40 Q 32 44 38 40" stroke="#fde047" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                {/* Side Ears */}
                <rect x="7" y="24" width="4" height="12" rx="2" fill="url(#aiBotAccent)" />
                <rect x="53" y="24" width="4" height="12" rx="2" fill="url(#aiBotAccent)" />
              </svg>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-300 border-2 border-slate-900 animate-pulse" />
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight">
                  مساعد بايثون الذكي
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-white/20 text-white">
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-white/90 font-medium line-clamp-1 max-w-[190px]">
                اسألني عن: {contextInfo.contextTitle}
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Chat Drawer / Window */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="نافذة مساعد بايثون الذكي"
          data-testid="ai-assistant-dialog"
          dir="rtl"
          className={`fixed z-50 transition-all duration-200 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 shadow-2xl rounded-3xl overflow-hidden ${
            isExpanded
              ? 'inset-3 sm:inset-6 md:inset-10'
              : 'bottom-4 left-4 right-4 sm:right-auto sm:w-[440px] h-[630px] max-h-[88vh]'
          }`}
        >
          {/* Top Gradient Header */}
          <div className={`bg-gradient-to-r ${theme.gradientClass} text-white px-4 py-3.5 flex items-center justify-between shrink-0`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/25 shrink-0">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-base">مساعد بايثون الذكي</h2>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/20 border border-white/20">
                    Gemini
                  </span>
                </div>
                <p className="text-xs text-white/85">
                  توضيحات برمجية فورية • إشراف أ/ محمد جبريل
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                aria-label="مسح المحادثة"
                title="بدء محادثة جديدة"
                className="p-2 rounded-xl hover:bg-white/15 text-white/90 transition cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(prev => !prev)}
                aria-label={isExpanded ? 'تصغير النافذة' : 'تكبير النافذة'}
                title={isExpanded ? 'تصغير النافذة' : 'تكبير النافذة'}
                className="hidden sm:flex p-2 rounded-xl hover:bg-white/15 text-white/90 transition cursor-pointer"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                type="button"
                onClick={handleToggleOpen}
                aria-label="إغلاق مساعد بايثون الذكي"
                title="إغلاق"
                className="p-2 rounded-xl hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Lesson / Unit Context Banner */}
          <div className="px-4 py-2.5 bg-slate-100/90 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700/70 flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="truncate">
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 ml-1.5">
                  {contextInfo.contextBadge}:
                </span>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate">
                  {contextInfo.contextTitle}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAttachSampleCode}
              className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition cursor-pointer"
            >
              <Code2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>إرفاق كود</span>
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60 dark:bg-slate-950/50">
            {/* Contextual Quick Prompts */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3 shadow-xs">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>أسئلة سريعة مقترحة حول المحتوى الحالي:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    disabled={isLoading}
                    onClick={() => sendMessage(prompt)}
                    className="text-right text-xs font-medium px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/50 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 border border-slate-200/70 dark:border-slate-700 transition cursor-pointer disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation History */}
            {messages.map(msg => {
              const isUser = msg.role === 'user';
              const segments = parseMessageSegments(msg.content);

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[92%] rounded-2xl px-4 py-3 shadow-xs ${
                      isUser
                        ? `bg-gradient-to-r ${theme.gradientClass} text-white rounded-tr-xs`
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-slate-800 rounded-tl-xs'
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex items-center justify-between gap-3 mb-1.5 text-[11px] opacity-80">
                      <span className="font-bold">
                        {isUser ? `👨‍💻 ${student.name}` : '🤖 مساعد بايثون الذكي'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Message Body with Text & Interactive Python Code Blocks */}
                    <div className="space-y-2.5 text-sm leading-relaxed">
                      {segments.map((seg, sIdx) => {
                        const snippetKey = `${msg.id}-code-${sIdx}`;
                        if (seg.type === 'code') {
                          const runState = codeOutputs[snippetKey];
                          return (
                            <div
                              key={snippetKey}
                              className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 text-slate-100 my-2"
                              dir="ltr"
                            >
                              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
                                <span className="font-mono text-emerald-400 font-bold">
                                  python
                                </span>
                                <div className="flex items-center gap-1.5" dir="rtl">
                                  <button
                                    type="button"
                                    onClick={() => handleRunSnippet(snippetKey, seg.content)}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition cursor-pointer"
                                  >
                                    <Play className="w-3 h-3" />
                                    <span>تشغيل الكود</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleCopySnippet(snippetKey, seg.content)}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] transition cursor-pointer"
                                  >
                                    {copiedKey === snippetKey ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span>تم النسخ</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>نسخ</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              </div>

                              <pre dir="ltr" className="p-3 text-xs font-mono overflow-x-auto leading-relaxed text-left">
                                <code dir="ltr">{seg.content}</code>
                              </pre>

                              {runState && (
                                <div
                                  className={`px-3 py-2 border-t text-xs font-mono ${
                                    runState.success
                                      ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-200'
                                      : 'bg-rose-950/60 border-rose-800/60 text-rose-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 text-[11px] font-bold mb-1" dir="rtl">
                                    <Terminal className="w-3.5 h-3.5" />
                                    <span>مخرجات التشغيل الفوري:</span>
                                  </div>
                                  <pre dir="ltr" className="whitespace-pre-wrap text-left">{runState.output}</pre>
                                </div>
                              )}
                            </div>
                          );
                        }

                        // Render inline **bold** and `code` tokens cleanly
                        const parts = seg.content.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
                        return (
                          <div key={sIdx} className="whitespace-pre-line">
                            {parts.map((part, pIdx) => {
                              if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
                                return (
                                  <strong key={pIdx} className="font-extrabold">
                                    {part.slice(2, -2)}
                                  </strong>
                                );
                              }
                              if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
                                return (
                                  <code
                                    key={pIdx}
                                    dir="ltr"
                                    className={`px-1.5 py-0.5 mx-0.5 rounded font-mono text-xs ${
                                      isUser
                                        ? 'bg-white/20 text-white'
                                        : 'bg-slate-100 dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-slate-200/70 dark:border-slate-700'
                                    }`}
                                  >
                                    {part.slice(1, -1)}
                                  </code>
                                );
                              }
                              return <React.Fragment key={pIdx}>{part}</React.Fragment>;
                            })}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-end">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>يقوم مساعد بايثون الذكي بتجهيز الشرح والمثال البرمجي...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Optional Attached Code Box */}
          {showCodeAttachment && (
            <div className="px-4 py-2.5 bg-slate-900 text-slate-100 border-t border-slate-700 shrink-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-emerald-400">
                  أرفق كود بايثون لشرحه أو اكتشاف الأخطاء فيه:
                </span>
                <button
                  type="button"
                  onClick={() => setShowCodeAttachment(false)}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  إخفاء
                </button>
              </div>
              <textarea
                dir="ltr"
                rows={3}
                value={attachedCode}
                onChange={e => setAttachedCode(e.target.value)}
                placeholder='print("اكتب أو الصق كود بايثون هنا...")'
                className="w-full rounded-xl bg-slate-950 border border-slate-700 p-2.5 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={handleFormSubmit}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="اكتب سؤالك البرمجي حول الدرس الحالي..."
              aria-label="اكتب سؤالك البرمجي"
              disabled={isLoading}
              className="flex-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="إرسال السؤال"
              className={`px-4 py-2.5 rounded-xl bg-gradient-to-r ${theme.gradientClass} text-white font-bold text-sm flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer transition`}
            >
              <span>إرسال</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

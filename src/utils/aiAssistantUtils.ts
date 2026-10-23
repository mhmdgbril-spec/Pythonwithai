import type { Lesson, TabType } from '../types';
import type { BookChapter } from '../data/bookChaptersData';

export interface AssistantContextInfo {
  activeTab: TabType;
  contextTitle: string;
  contextSubtitle: string;
  contextBadge: string;
  keyTopics: string[];
  sampleCode?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  contextLabel?: string;
  source?: 'gemini' | 'local-tutor';
}

export interface MessageSegment {
  type: 'text' | 'code';
  content: string;
  language?: string;
}

const TAB_LABELS: Record<TabType, string> = {
  dashboard: 'لوحة الإنجاز الرئيسية',
  path: 'مسار التعلم التفاعلي (15 درساً)',
  book: 'الكتاب التفاعلي (الذكاء الاصطناعي ببايثون)',
  playground: 'مختبر بايثون الحر (Playground)',
  coverage: 'مصفوفة تغطية المنهج',
  sources: 'المصادر والمراجع المعتمدة',
  exam: 'الاختبار النهائي المعتمد',
  capstone: 'مشروع التخرج (الكابستون)',
  settings: 'إعدادات المنصة'
};

/**
 * Builds structured context metadata based on the student's current view, active lesson, or active book unit.
 */
export function buildAssistantContext(params: {
  activeTab: TabType;
  activeLesson?: Lesson | null;
  activeBookChapter?: BookChapter | null;
}): AssistantContextInfo {
  const { activeTab, activeLesson, activeBookChapter } = params;

  if (activeLesson) {
    const headings = activeLesson.theorySections.map(s => s.heading);
    return {
      activeTab: 'path',
      contextTitle: `الدرس ${activeLesson.globalNumber}: ${activeLesson.title}`,
      contextSubtitle: activeLesson.subtitle,
      contextBadge: `درس تفاعلي #${activeLesson.globalNumber}`,
      keyTopics: headings.length > 0 ? headings : [activeLesson.title],
      sampleCode: activeLesson.solvedExample?.code || activeLesson.predictFirst?.code
    };
  }

  if (activeTab === 'book' && activeBookChapter) {
    return {
      activeTab: 'book',
      contextTitle: `${activeBookChapter.title}: ${activeBookChapter.arabicTitle}`,
      contextSubtitle: `الصفحات ${activeBookChapter.pageRange} • ${activeBookChapter.gradeLevel}`,
      contextBadge: `الكتاب التفاعلي • وحدة ${activeBookChapter.unitNumber}`,
      keyTopics: activeBookChapter.objectives.slice(0, 4),
      sampleCode: activeBookChapter.codeSnippets[0]?.code
    };
  }

  return {
    activeTab,
    contextTitle: TAB_LABELS[activeTab] || 'منصة بطل بايثون',
    contextSubtitle: 'منصة بطل بايثون والتقنية الرقمية — مدارس النخبة العلمية الأهلية بالدمام',
    contextBadge: 'مساعد بايثون العام',
    keyTopics: [
      'أساسيات بايثون والمتغيرات والطباعة print()',
      'الجمل الشرطية if/else والحلقات التكرارية for/while',
      'الدوال البرمجية القوائم والقواميس',
      'تطبيقات الذكاء الاصطناعي وتعلم الآلة بلغة بايثون'
    ]
  };
}

/**
 * Generates contextual Arabic quick-prompts tailored to the current lesson or book chapter.
 */
export function getQuickPromptsForContext(context: AssistantContextInfo): string[] {
  if (context.activeTab === 'path' && context.contextBadge.startsWith('درس تفاعلي')) {
    return [
      `اشرح لي فكرة "${context.contextTitle}" ببساطة مع مثال عملي`,
      'ما الأخطاء الشائعة التي يقع فيها الطلاب في هذا الدرس؟',
      'أعطني تمريناً إضافياً قصيراً مع الحل لأختبر فهمي',
      'اشرح لي الكود الموجود في المثال المحلول خطوة بخطوة'
    ];
  }

  if (context.activeTab === 'book') {
    return [
      `لخّص لي أهم مفاهيم "${context.contextTitle}" في نقاط واضحة`,
      'اشرح لي كيف نطبّق فكرة هذه الوحدة برمجياً بلغة بايثون',
      'أعطني سؤالين للمراجعة السريعة حول هذه الوحدة مع الإجابة',
      'ما علاقة هذه الوحدة بتطبيقات الذكاء الاصطناعي الحديثة؟'
    ];
  }

  if (context.activeTab === 'playground') {
    return [
      'أعطني فكرة برنامج بايثون ممتع يمكنني تجربته الآن في المختبر',
      'كيف أستخدم الحلقات التكرارية for و while مع أمثلة؟',
      'ما الفرق بين القائمة List والقاموس Dictionary في بايثون؟',
      'ساعدني في اكتشاف سبب خطأ SyntaxError أو IndentationError'
    ];
  }

  return [
    'اشرح لي أساسيات الطباعة والمتغيرات في بايثون مع مثال',
    'كيف تعمل الجمل الشرطية if / elif / else في بايثون؟',
    'اشرح لي الحلقات التكرارية for و range() بطريقة مبسطة',
    'كيف تُستخدم لغة بايثون في الذكاء الاصطناعي وتعلم الآلة؟'
  ];
}

/**
 * Builds the system instruction passed to Gemini so it acts as a supportive Arabic Python tutor.
 */
export function buildSystemInstruction(
  context: AssistantContextInfo,
  studentName?: string
): string {
  const topicsList = context.keyTopics.join(' | ');
  const codeBlock = context.sampleCode
    ? `\nمثال الكود المرتبط بالدرس الحالي:\n\`\`\`python\n${context.sampleCode}\n\`\`\``
    : '';

  return [
    'أنت "مساعد بايثون الذكي" في منصة "بطل بايثون والتقنية الرقمية" بمدارس النخبة العلمية الأهلية بالدمام (إعداد وإشراف أ/ محمد جبريل).',
    `اسم الطالب الحالي: ${studentName || 'طالب النخبة المتميز'}.`,
    `السياق الدراسي الحالي للطالب: ${context.contextTitle} (${context.contextSubtitle}).`,
    `المحاور الأساسية للدرس الحالي: ${topicsList}.${codeBlock}`,
    'قواعد الإجابة التربوية:',
    '1. أجب باللغة العربية الفصحى الواضحة والمشجعة لطلاب المرحلة الثانوية.',
    '2. ادعم شرحك دائماً بأمثلة برمجية قابلة للتشغيل بلغة بايثون داخل بلوك كود ```python ... ``` باستخدام دالة print() لتظهر النتيجة بوضوح.',
    '3. اشرح الكود سطراً بسطر باختصار ووضوح، ونبّه الطالب إلى الأخطاء الشائعة مثل المسافات البادئة (Indentation) أو نسيان النقطتين (:).',
    '4. اجعل الإجابة منظمة ومباشرة دون إطالة مملة.'
  ].join('\n');
}

/**
 * Parses a message string into alternating text and fenced code segments.
 */
export function parseMessageSegments(content: string): MessageSegment[] {
  if (!content || !content.trim()) {
    return [];
  }

  const segments: MessageSegment[] = [];
  const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      const textChunk = content.slice(lastIndex, match.index).trim();
      if (textChunk) {
        segments.push({ type: 'text', content: textChunk });
      }
    }

    const lang = (match[1] || 'python').toLowerCase();
    const code = match[2].trim();
    if (code) {
      segments.push({
        type: 'code',
        language: lang,
        content: code
      });
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    const remaining = content.slice(lastIndex).trim();
    if (remaining) {
      segments.push({ type: 'text', content: remaining });
    }
  }

  return segments.length > 0 ? segments : [{ type: 'text', content: content.trim() }];
}

/**
 * Generates an accurate, context-aware Arabic educational response if offline or fallback is needed.
 */
export function buildLocalEducationalFallback(
  question: string,
  context: AssistantContextInfo
): string {
  const q = question.toLowerCase();

  if (q.includes('if') || q.includes('شرط') || q.includes('مقارن')) {
    return [
      `أهلاً بك يا بطل بايثون! في سياق **${context.contextTitle}**، تُستخدم الجمل الشرطية \`if / elif / else\` لاتخاذ القرارات بناءً على تحقق شرط معين:`,
      '```python\nscore = 92\nif score >= 90:\n    print("ممتاز - بطل بايثون!")\nelif score >= 75:\n    print("جيد جداً")\nelse:\n    print("واصل التدريب والمحاولة")\n```',
      '💡 **تذكّر دائماً:** نضع نقطتين رأسيتين `:` في نهاية سطر `if` و `else`، ونترك مسافة بادئة (4 مسافات) للأسطر التابعة للشرط.'
    ].join('\n\n');
  }

  if (q.includes('for') || q.includes('while') || q.includes('حلق') || q.includes('تكرار') || q.includes('range')) {
    return [
      `سؤال رائع! الحلقات التكرارية في بايثون تتيح لنا تنفيذ الأوامر عدة مرات دون تكرار كتابة الكود يدوياً. إليك مثالاً عملياً باستخدام \`for\` و \`range()\`:`,
      '```python\nfor step in range(1, 6):\n    print("الخطوة رقم:", step)\nprint("اكتمل التكرار بنجاح!")\n```',
      '💡 **ملاحظة مهمة:** الدالة `range(1, 6)` تبدأ من الرقم `1` وتتوقف قبل الرقم `6` (أي تطبع الأرقام من 1 إلى 5).'
    ].join('\n\n');
  }

  if (q.includes('قائم') || q.includes('list') || q.includes('قاموس') || q.includes('dict')) {
    return [
      'في لغة بايثون، نستخدم **القوائم (Lists)** لتخزين عناصر مرتبة بين أقواس مربعة `[]`، ونستخدم **القواميس (Dictionaries)** لتخزين أزواج (مفتاح: قيمة) بين أقواس معقوفة `{}`:',
      '```python\n# مثال على قائمة (List)\nskills = ["Python", "AI", "Data Science"]\nprint("المهارة الأولى:", skills[0])\nprint("عدد المهارات:", len(skills))\n\n# مثال على قاموس (Dictionary)\nstudent = {"name": "أحمد", "level": 3}\nprint("اسم الطالب:", student["name"])\n```',
      'جرب الضغط على زر **تشغيل الكود** بالأسفل لرؤية النتيجة الفورية!'
    ].join('\n\n');
  }

  const sample = context.sampleCode || 'name = "بطل بايثون"\nlevel = 1\nprint("مرحباً بك:", name)\nprint("المستوى الحالي:", level)';
  const topicsText = context.keyTopics.map((t, idx) => `${idx + 1}. ${t}`).join('\n');

  return [
    `مرحباً بك في **مساعد بايثون الذكي**! نحن الآن في سياق: **${context.contextTitle}**.`,
    `أهم النقاط والمفاهيم التي يركز عليها هذا الجزء:\n${topicsText}`,
    `إليك مثالاً برمجياً تطبيقياً يمكنك تشغيله وتعديله مباشرة:\n\`\`\`python\n${sample}\n\`\`\``,
    '💡 **نصيحة برمجية:** يمكنك الضغط على زر **"تشغيل الكود"** أسفل المثال لرؤية المخرجات مباشرة، أو سؤالي عن أي دالة مثل `print()` أو `if` أو `for`!'
  ].join('\n\n');
}

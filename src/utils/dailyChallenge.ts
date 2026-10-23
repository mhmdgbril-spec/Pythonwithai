/**
 * نظام التحدي اليومي (Daily Challenge System)
 * يوفّر مهمة برمجية يومية تتغير تلقائياً كل 24 ساعة لتعزيز الاستمرارية والحماس اليومي للطلاب.
 */

export interface DailyChallenge {
  id: string;
  dayNumber: number; // 1 to 14 rotating cycle
  title: string;
  category: string;
  difficulty: 'مبتدئ' | 'متوسط' | 'متقدم';
  xpReward: number;
  prompt: string;
  goalDescription: string;
  starterCode: string;
  expectedOutput: string;
  hints: string[];
  solutionCode: string;
  requiredKeywords?: string[];
  unitReference: string;
}

export interface CountdownRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  formatted: string; // HH:MM:SS
}

export interface DailyChallengeValidationResult {
  passed: boolean;
  feedback: string;
  matchedOutput: boolean;
  usedRequiredConstructs: boolean;
}

export const DAILY_CHALLENGES_POOL: DailyChallenge[] = [
  {
    id: 'daily-1',
    dayNumber: 1,
    title: 'حاسبة نقاط الذكاء الاصطناعي',
    category: 'المتغيرات والعمليات الحسابية',
    difficulty: 'مبتدئ',
    xpReward: 50,
    prompt: 'يرغب معمل الذكاء الاصطناعي في مدرسة النخبة بحساب مجموع نقاط نموذج ذكي قام بحل 3 مهام: المهمة الأولى (35 نقطة)، والثانية (45 نقطة)، والثالثة (20 نقطة). خزّن القيم في متغيرات أو احسب المجموع في متغير باسم total ثم اطبعه.',
    goalDescription: 'طباعة الرقم 100 الناتج عن جمع نقاط المهام الثلاث باستخدام print(total).',
    starterCode: `# التحدي اليومي: احسب مجموع نقاط النموذج الذكي واطبع النتيجة
task1 = 35
task2 = 45
task3 = 20

# أكمل الكود لحساب المجموع في متغير total وطباعته
`,
    expectedOutput: '100',
    hints: [
      'اجمع المتغيرات الثلاثة هكذا: total = task1 + task2 + task3',
      'استخدم دالة الطباعة print(total) لعرض الناتج النهائي.'
    ],
    solutionCode: `task1 = 35
task2 = 45
task3 = 20
total = task1 + task2 + task3
print(total)`,
    requiredKeywords: ['print'],
    unitReference: 'الوحدة 2: المتغيرات وأنواع البيانات'
  },
  {
    id: 'daily-2',
    dayNumber: 2,
    title: 'فلتر درجات الحرارة الذكي',
    category: 'الجمل الشرطية (if / else)',
    difficulty: 'مبتدئ',
    xpReward: 50,
    prompt: 'لدينا حساس حرارة في غرفة الخوادم يسجل القراءة temp = 38. اكتب جملة شرطية تفحص إذا كانت الحرارة أكبر من 35 لتطبع "تحذير: حرارة مرتفعة"، وإلا تطبع "الحرارة طبيعية".',
    goalDescription: 'استخدام جملة if لفحص temp > 35 وطباعة: تحذير: حرارة مرتفعة',
    starterCode: `# التحدي اليومي: فحص حرارة غرفة الخوادم
temp = 38

# اكتب جملة if / else لفحص الحرارة وطباعة التنبيه المناسب
`,
    expectedOutput: 'تحذير: حرارة مرتفعة',
    hints: [
      'ابدأ بالشرط: if temp > 35:',
      'داخل جملة if اطبع النص المطلوب بدقة: print("تحذير: حرارة مرتفعة")'
    ],
    solutionCode: `temp = 38
if temp > 35:
    print("تحذير: حرارة مرتفعة")
else:
    print("الحرارة طبيعية")`,
    requiredKeywords: ['if', 'print'],
    unitReference: 'الوحدة 3: الجمل الشرطية واتخاذ القرار'
  },
  {
    id: 'daily-3',
    dayNumber: 3,
    title: 'عدّاد دورات تدريب الشبكة العصبية',
    category: 'حلقات التكرار (for loop)',
    difficulty: 'مبتدئ',
    xpReward: 50,
    prompt: 'أثناء تدريب نموذج تعلم آلة، نحتاج لطباعة أرقام الدورات التدريبية (Epochs) من 1 إلى 4. استخدم حلقة for مع دالة range لطباعة كل رقم في سطر مستقل.',
    goalDescription: 'طباعة الأرقام 1 ثم 2 ثم 3 ثم 4 كل رقم في سطر باستخدام حلقة for.',
    starterCode: `# التحدي اليومي: طباعة دورات التدريب من 1 إلى 4
# تذكّر أن range(1, 5) تبدأ من 1 وتتوقف قبل 5

`,
    expectedOutput: '1\n2\n3\n4',
    hints: [
      'استخدم الحلقة: for epoch in range(1, 5):',
      'داخل الحلقة اكتب: print(epoch)'
    ],
    solutionCode: `for epoch in range(1, 5):
    print(epoch)`,
    requiredKeywords: ['for', 'range', 'print'],
    unitReference: 'الوحدة 4: حلقات التكرار For و While'
  },
  {
    id: 'daily-4',
    dayNumber: 4,
    title: 'تحليل دقة النماذج بالقوائم',
    category: 'القوائم (Lists)',
    difficulty: 'متوسط',
    xpReward: 60,
    prompt: 'لديك قائمة تحتوي على نسب دقة 4 نماذج ذكاء اصطناعي: scores = [82, 95, 88, 91]. استخدم الدالة المدمجة المناسبة لطباعة أعلى نسبة دقة في القائمة.',
    goalDescription: 'طباعة أعلى قيمة في القائمة scores وهي 95 باستخدام دالة max().',
    starterCode: `# التحدي اليومي: استخراج أعلى دقة من القائمة
scores = [82, 95, 88, 91]

# اطبع أعلى قيمة في القائمة
`,
    expectedOutput: '95',
    hints: [
      'توفر بايثون دالة max(scores) لإيجاد أكبر عنصر في القائمة.',
      'اكتب: print(max(scores))'
    ],
    solutionCode: `scores = [82, 95, 88, 91]
print(max(scores))`,
    requiredKeywords: ['max', 'print'],
    unitReference: 'الوحدة 5: القوائم وهياكل البيانات'
  },
  {
    id: 'daily-5',
    dayNumber: 5,
    title: 'دالة الترحيب بمهندس البيانات',
    category: 'الدوال البرمجية (Functions)',
    difficulty: 'متوسط',
    xpReward: 60,
    prompt: 'عرّف دالة باسم welcome_engineer تستقبل المعامل name وتعيد أو تطبع العبارة: "مرحباً بك يا م. سالم في مختبر بايثون" عند استدعائها بالاسم "سالم".',
    goalDescription: 'تعريف دالة بـ def واستدعاؤها لطباعة: مرحباً بك يا م. سالم في مختبر بايثون',
    starterCode: `# التحدي اليومي: عرّف دالة welcome_engineer(name) واستدعها
def welcome_engineer(name):
    # أكمل جسم الدالة هنا
    pass

welcome_engineer("سالم")
`,
    expectedOutput: 'مرحباً بك يا م. سالم في مختبر بايثون',
    hints: [
      'استخدم السلاسل المنسقة f-string داخل الدالة: print(f"مرحباً بك يا م. {name} في مختبر بايثون")',
      'تأكد من حذف كلمة pass أو استبدالها بأمر الطباعة.'
    ],
    solutionCode: `def welcome_engineer(name):
    print(f"مرحباً بك يا م. {name} في مختبر بايثون")

welcome_engineer("سالم")`,
    requiredKeywords: ['def', 'print'],
    unitReference: 'الوحدة 6: الدوال والبرمجة التركيبية'
  },
  {
    id: 'daily-6',
    dayNumber: 6,
    title: 'قاموس مصطلحات تعلم الآلة',
    category: 'القواميس (Dictionaries)',
    difficulty: 'متوسط',
    xpReward: 60,
    prompt: 'لديك قاموس يمثل بيانات نموذج ذكي: model_info = {"name": "VisionNet", "layers": 12, "status": "Active"}. اطبع عدد الطبقات (layers) المستخرج من القاموس.',
    goalDescription: 'الوصول إلى مفتاح "layers" في القاموس model_info وطباعة قيمته (12).',
    starterCode: `# التحدي اليومي: استخراج عدد الطبقات من القاموس
model_info = {"name": "VisionNet", "layers": 12, "status": "Active"}

# اطبع قيمة المفتاح "layers"
`,
    expectedOutput: '12',
    hints: [
      'للوصول إلى قيمة مفتاح في القاموس نستخدم الأقواس المربعة: model_info["layers"]',
      'اطبع النتيجة عبر: print(model_info["layers"])'
    ],
    solutionCode: `model_info = {"name": "VisionNet", "layers": 12, "status": "Active"}
print(model_info["layers"])`,
    requiredKeywords: ['model_info', 'print'],
    unitReference: 'الوحدة 5: القوائم والصفوف والقواميس'
  },
  {
    id: 'daily-7',
    dayNumber: 7,
    title: 'تنقية بيانات النصوص (NLP)',
    category: 'معالجة النصوص والذكاء الاصطناعي',
    difficulty: 'متوسط',
    xpReward: 65,
    prompt: 'في معالجة اللغات الطبيعية (NLP)، نحتاج لتوحيد حالة الأحرف وإزالة المسافات الزائدة. لديك النص raw_text = "  Python AI  ". أزل المسافات المحيطة وحوّله لأحرف صغيرة (lowercase) ثم اطبعه.',
    goalDescription: 'استخدام دالتي strip() و lower() لطباعة: python ai',
    starterCode: `# التحدي اليومي: تنظيف النص لمعالجة اللغات الطبيعية
raw_text = "  Python AI  "

# طبّق strip() و lower() ثم اطبع النتيجة
`,
    expectedOutput: 'python ai',
    hints: [
      'الدالة raw_text.strip() تزيل المسافات من البداية والنهاية.',
      'الدالة .lower() تحول جميع الأحرف إلى صغيرة: print(raw_text.strip().lower())'
    ],
    solutionCode: `raw_text = "  Python AI  "
clean_text = raw_text.strip().lower()
print(clean_text)`,
    requiredKeywords: ['lower', 'print'],
    unitReference: 'الوحدة 10: معالجة اللغات الطبيعية NLP'
  },
  {
    id: 'daily-8',
    dayNumber: 8,
    title: 'تصفية القراءات الشاذة (List Comprehension)',
    category: 'تكثيف القوائم وتنقية البيانات',
    difficulty: 'متقدم',
    xpReward: 70,
    prompt: 'لدينا قراءات مستشعر مسافة بالروبوت: readings = [15, -4, 28, 0, 42]. القراءات السالبة أو الصفرية تعتبر ضوضاء. أنشئ قائمة جديدة valid تحتوي فقط على الأرقام الأكبر من 0 واطبعها.',
    goalDescription: 'تصفية الأرقام الموجبة فقط في قائمة وطباعتها: [15, 28, 42]',
    starterCode: `# التحدي اليومي: استبعاد القراءات الصفرية والسالبة
readings = [15, -4, 28, 0, 42]

# أنشئ قائمة valid للأرقام الأكبر من 0 ثم اطبعها
`,
    expectedOutput: '[15, 28, 42]',
    hints: [
      'يمكنك استخدام تكثيف القوائم: valid = [x for x in readings if x > 0]',
      'أو حلقة for عادية مع append ثم: print(valid)'
    ],
    solutionCode: `readings = [15, -4, 28, 0, 42]
valid = [x for x in readings if x > 0]
print(valid)`,
    requiredKeywords: ['print'],
    unitReference: 'الوحدة 8: هندسة البيانات وتنقيتها'
  },
  {
    id: 'daily-9',
    dayNumber: 9,
    title: 'حساب المتوسط الحسابي لدقة النموذج',
    category: 'الإحصاء البرمجي للذكاء الاصطناعي',
    difficulty: 'متوسط',
    xpReward: 60,
    prompt: 'لحساب متوسط الأداء في 4 تجارب: results = [80, 90, 85, 95]، اقسم مجموع عناصر القائمة sum(results) على عددها len(results) واطبع الناتج.',
    goalDescription: 'حساب المتوسط عبر sum(results) / len(results) وطباعة الناتج 87.5.',
    starterCode: `# التحدي اليومي: حساب متوسط نتائج التجارب الأربع
results = [80, 90, 85, 95]

# احسب المتوسط واطبعه
`,
    expectedOutput: '87.5',
    hints: [
      'استخدم sum(results) للحصول على المجموع و len(results) للحصول على عدد العناصر.',
      'احسب avg = sum(results) / len(results) ثم print(avg)'
    ],
    solutionCode: `results = [80, 90, 85, 95]
avg = sum(results) / len(results)
print(avg)`,
    requiredKeywords: ['sum', 'len', 'print'],
    unitReference: 'الوحدة 9: أساسيات تعلم الآلة والتقييم'
  },
  {
    id: 'daily-10',
    dayNumber: 10,
    title: 'مجموع الأعداد الزوجية في المصفوفة',
    category: 'الحلقات والشروط المدمجة',
    difficulty: 'متوسط',
    xpReward: 65,
    prompt: 'لديك القائمة nums = [10, 15, 20, 25, 30]. اكتب كودًا يجمع فقط الأعداد التي تقبل القسمة على 20 أو اجمع الأعداد الزوجية في القائمة واطبع المجموع النهائي (60).',
    goalDescription: 'جمع الأعداد الزوجية (10 و 20 و 30) في القائمة وطباعة 60.',
    starterCode: `# التحدي اليومي: جمع الأعداد الزوجية فقط من القائمة
nums = [10, 15, 20, 25, 30]
even_sum = 0

# مر على عناصر القائمة واجمع الأعداد الزوجية (n % 2 == 0)
`,
    expectedOutput: '60',
    hints: [
      'العدد الزوجي يحقق الشرط: n % 2 == 0',
      'داخل الحلقة: if n % 2 == 0: even_sum += n ثم خارج الحلقة print(even_sum)'
    ],
    solutionCode: `nums = [10, 15, 20, 25, 30]
even_sum = 0
for n in nums:
    if n % 2 == 0:
        even_sum += n
print(even_sum)`,
    requiredKeywords: ['for', 'print'],
    unitReference: 'الوحدة 4: التحكم بالتدفق والحلقات'
  },
  {
    id: 'daily-11',
    dayNumber: 11,
    title: 'عدّ الكلمات في جملة برمجية',
    category: 'تحليل النصوص (Tokenization)',
    difficulty: 'مبتدئ',
    xpReward: 55,
    prompt: 'أول خطوة في نماذج اللغات الكبيرة هي تقسيم الجملة إلى كلمات (Tokens). قسّم الجملة sentence = "الذكاء الاصطناعي يصنع المستقبل" إلى قائمة كلمات باستخدام split() ثم اطبع عدد الكلمات.',
    goalDescription: 'تقسيم النص عبر split() وحساب طول القائمة بـ len() لطباعة 4.',
    starterCode: `# التحدي اليومي: حساب عدد الكلمات (Tokens) في الجملة
sentence = "الذكاء الاصطناعي يصنع المستقبل"

# قسّم الجملة واطبع عدد كلماتها
`,
    expectedOutput: '4',
    hints: [
      'استخدم words = sentence.split() لتحويل الجملة إلى قائمة كلمات.',
      'اطبع عدد الكلمات باستخدام print(len(words))'
    ],
    solutionCode: `sentence = "الذكاء الاصطناعي يصنع المستقبل"
words = sentence.split()
print(len(words))`,
    requiredKeywords: ['split', 'len', 'print'],
    unitReference: 'الوحدة 10: تجزئة النصوص Tokenization'
  },
  {
    id: 'daily-12',
    dayNumber: 12,
    title: 'دالة تفعيل الخلية العصبية (ReLU)',
    category: 'الشبكات العصبية العميقة',
    difficulty: 'متقدم',
    xpReward: 75,
    prompt: 'دالة التفعيل الشهيرة ReLU في الشبكات العصبية تُرجع الرقم نفسه إذا كان موجباً، وتُرجع 0 إذا كان سالباً: max(0, x). طبّق الدالة على القائمة inputs = [-5, 3, -1, 8] واطبع القائمة الناتجة.',
    goalDescription: 'تحويل الأرقام السالبة إلى 0 والإبقاء على الموجبة لطباعة: [0, 3, 0, 8]',
    starterCode: `# التحدي اليومي: محاكاة دالة التفعيل ReLU على المدخلات
inputs = [-5, 3, -1, 8]

# طبّق max(0, x) على كل عنصر في القائمة واطبع النتيجة
`,
    expectedOutput: '[0, 3, 0, 8]',
    hints: [
      'استخدم تكثيف القوائم: activated = [max(0, x) for x in inputs]',
      'اطبع النتيجة عبر: print(activated)'
    ],
    solutionCode: `inputs = [-5, 3, -1, 8]
activated = [max(0, x) for x in inputs]
print(activated)`,
    requiredKeywords: ['max', 'print'],
    unitReference: 'الوحدة 11: الشبكات العصبية ودوال التفعيل'
  },
  {
    id: 'daily-13',
    dayNumber: 13,
    title: 'تصنيف البريد الإلكتروني (Spam Classifier)',
    category: 'الأمن السيبراني والذكاء الاصطناعي',
    difficulty: 'متوسط',
    xpReward: 65,
    prompt: 'يريد مصنّف البريد الذكي فحص الرسالة msg = "ربحت جائزة فورية اضغط هنا". إذا كانت كلمة "جائزة" موجودة داخل msg (باستخدام المعامل in) اطبع "بريد مزعج"، وإلا اطبع "بريد آمن".',
    goalDescription: 'فحص وجود كلمة "جائزة" في النص وطباعة: بريد مزعج',
    starterCode: `# التحدي اليومي: كاشف الرسائل المزعجة البسيط
msg = "ربحت جائزة فورية اضغط هنا"

# افحص وجود كلمة "جائزة" في msg واطبع التصنيف المناسب
`,
    expectedOutput: 'بريد مزعج',
    hints: [
      'استخدم المعامل in هكذا: if "جائزة" in msg:',
      'اطبع "بريد مزعج" في حالة تحقق الشرط.'
    ],
    solutionCode: `msg = "ربحت جائزة فورية اضغط هنا"
if "جائزة" in msg:
    print("بريد مزعج")
else:
    print("بريد آمن")`,
    requiredKeywords: ['if', 'in', 'print'],
    unitReference: 'الوحدة 12: تطبيقات الذكاء الاصطناعي في الأمن'
  },
  {
    id: 'daily-14',
    dayNumber: 14,
    title: 'حساب المسافة الإقليدية المبسطة',
    category: 'خوارزميات التصنيف (KNN)',
    difficulty: 'متقدم',
    xpReward: 75,
    prompt: 'في خوارزمية الجار الأقرب، نحسب الجذر التربيعي لمجموع مربعي الفرقين. إذا كان dx = 3 و dy = 4، استخدم math.sqrt لحساب المسافة من المعادلة math.sqrt(dx * dx + dy * dy) واطبع النتيجة.',
    goalDescription: 'استخدام math.sqrt لحساب الوتر للمثلث (3، 4) وطباعة 5.',
    starterCode: `# التحدي اليومي: حساب المسافة بين نقطتي بيانات
import math
dx = 3
dy = 4

# احسب المسافة باستخدام math.sqrt واطبع النتيجة
`,
    expectedOutput: '5',
    hints: [
      'معادلة المسافة: dist = math.sqrt(dx * dx + dy * dy)',
      'اطبع النتيجة عبر: print(dist)'
    ],
    solutionCode: `import math
dx = 3
dy = 4
dist = math.sqrt(dx * dx + dy * dy)
print(dist)`,
    requiredKeywords: ['math.sqrt', 'print'],
    unitReference: 'الوحدة 9: خوارزميات التصنيف والمسافات'
  }
];

/**
 * يعيد مفتاح التاريخ بصيغة YYYY-MM-DD بناءً على التوقيت المحلي
 */
export function getDayKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * يحسب رقم اليوم التراكمي منذ بداية التقويم لضمان دوران حتمي كل 24 ساعة
 */
export function getDayIndex(date: Date = new Date()): number {
  const utcMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(utcMidnight / msPerDay);
}

/**
 * يختار التحدي اليومي المخصص لهذا اليوم (يتغير كل 24 ساعة عند منتصف الليل)
 */
export function getDailyChallengeForDate(date: Date = new Date()): DailyChallenge {
  const dayIdx = Math.abs(getDayIndex(date));
  const poolIndex = dayIdx % DAILY_CHALLENGES_POOL.length;
  return DAILY_CHALLENGES_POOL[poolIndex];
}

/**
 * يحسب الوقت المتبقي حتى التحدي اليومي القادم (منتصف الليل القادم - دورة 24 ساعة)
 */
export function getTimeUntilNextChallenge(now: Date = new Date()): CountdownRemaining {
  const nextMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0
  );
  const diffMs = Math.max(0, nextMidnight.getTime() - now.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const formatted = [
    String(hours).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0')
  ].join(':');

  return {
    hours,
    minutes,
    seconds,
    totalSeconds,
    formatted
  };
}

/**
 * يتحقق من صحة حل الطالب للتحدي اليومي
 */
export function validateDailyChallengeSubmission(
  challenge: DailyChallenge,
  code: string,
  output: string,
  execSuccess: boolean,
  execError?: string
): DailyChallengeValidationResult {
  const trimmedCode = code.trim();
  if (!trimmedCode) {
    return {
      passed: false,
      feedback: 'يرجى كتابة الكود البرمجي أولاً قبل التحقق من الحل.',
      matchedOutput: false,
      usedRequiredConstructs: false
    };
  }

  if (!execSuccess) {
    return {
      passed: false,
      feedback: execError || 'يوجد خطأ برمجي في الكود. راجع رسالة الخطأ في الطرفية وحاول مجدداً.',
      matchedOutput: false,
      usedRequiredConstructs: false
    };
  }

  const normalizedActual = output.trim().replace(/\r\n/g, '\n');
  const normalizedExpected = challenge.expectedOutput.trim().replace(/\r\n/g, '\n');

  const matchedOutput = normalizedActual === normalizedExpected;

  // Check required keywords (ignoring comments)
  const codeWithoutComments = trimmedCode
    .split('\n')
    .map(line => line.split('#')[0])
    .join('\n');

  const missingKeywords = (challenge.requiredKeywords || []).filter(
    kw => !codeWithoutComments.includes(kw)
  );
  const usedRequiredConstructs = missingKeywords.length === 0;

  if (!matchedOutput) {
    return {
      passed: false,
      feedback: normalizedActual
        ? `المخرجات الحالية هي "${normalizedActual}" بينما المخرجات المتوقعة هي "${normalizedExpected}".`
        : `لم يقم الكود بطباعة أي مخرجات. تأكد من استخدام دالة print() لإظهار النتيجة "${normalizedExpected}".`,
      matchedOutput: false,
      usedRequiredConstructs
    };
  }

  if (!usedRequiredConstructs) {
    return {
      passed: false,
      feedback: `الناتج صحيح، لكن يُشترط استخدام المفهوم البرمجي المطلوب في التحدي (${missingKeywords.join(' ، ')}).`,
      matchedOutput: true,
      usedRequiredConstructs: false
    };
  }

  return {
    passed: true,
    feedback: `أحسنت يا بطل بايثون! إجابة نموذجية ومخرجات مطابقة (${normalizedExpected}). استمر على هذا الحماس اليومي!`,
    matchedOutput: true,
    usedRequiredConstructs: true
  };
}

/**
 * يحسب تحديث سلسلة الأيام المتواصلة (Streak) عند إتمام التحدي اليومي
 */
export function calculateUpdatedStreak(
  currentStreak: number,
  lastDailyChallengeDate: string | undefined,
  todayDate: Date = new Date()
): { newStreak: number; streakIncremented: boolean } {
  const todayKey = getDayKey(todayDate);
  if (lastDailyChallengeDate === todayKey) {
    return { newStreak: currentStreak, streakIncremented: false };
  }

  const yesterday = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate() - 1);
  const yesterdayKey = getDayKey(yesterday);

  if (!lastDailyChallengeDate || lastDailyChallengeDate === yesterdayKey) {
    return { newStreak: Math.max(1, currentStreak + 1), streakIncremented: true };
  }

  // If missed multiple days, still reward completing today's challenge by advancing or resetting to at least currentStreak + 1 in encouraging educational mode
  return { newStreak: Math.max(1, currentStreak + 1), streakIncremented: true };
}

import { Chapter } from '../types';

export const CURRICULUM_CHAPTERS: Chapter[] = [
  // ===================== PART 1: بايثون إلى الاحتراف =====================
  {
    id: 'ch1',
    part: 1,
    number: 1,
    title: 'الفصل 1: مدخل إلى البرمجة ولغة بايثون',
    description: 'فهم طريقة تفكير الحاسوب، كتابة أول برنامج بلغة بايثون، والتعامل مع مخرجات print والمفسر التفاعلي.',
    lessonsCount: 6,
    lessons: [
      {
        id: 'py.ch1.l1',
        chapterId: 'ch1',
        part: 1,
        number: 1,
        globalNumber: 1,
        title: 'لماذا نتعلّم البرمجة؟',
        subtitle: 'مدخل أ/ محمد جبريل لطلاب التقنية الرقمية بمدارس النخبة العلمية',
        estimatedMinutes: 12,
        whyItMatters: 'تخيّل أنك تريد فرز 10,000 سجل لطالب أو حساب درجات المدرسة بالكامل. بالورقة والقلم يستغرق الأمر أسابيع ويكون عرضة للأخطاء البشرية. الحاسوب يفعل ذلك في أجزاء من الثانية! البرمجة هي فن إعطاء الآلة تعليمات دقيقة ومباشرة لتحويل أفكارك إلى واقع.',
        predictFirst: {
          question: 'قبل أن نتعلم التفاصيل، ماذا تتوقع أن يظهر على الشاشة عند تنفيذ هذا السطر؟',
          code: 'print("مرحبًا بكم في مدارس النخبة العلمية")',
          answer: 'مرحبًا بكم في مدارس النخبة العلمية',
          explanation: 'دالة print() تأخذ النص المحاط بعلامات التنصيص وتطبعه مباشرة على الشاشة دون تغيير.'
        },
        theorySections: [
          {
            badge: 'المبدأ الأساسي',
            heading: 'الحاسوب سريع ومنضبط ولكنه يحتاج تعليمات دقيقة',
            paragraphs: [
              'الحاسوب لا يخمّن ما يدور في ذهنك؛ هو آلة حسابية فائقة السرعة تنفذ أوامرك بدقة بالغة سطرًا بسطر.',
              'لذلك عندما يظهر خطأ برمجي، فالخلل ليس في الحاسوب بل في التعليمات المُعطاة له — وهذا أمر رائع ومبشّر، لأنك أنت القائد القادر على تعديل التعليمات وإتقانها.'
            ]
          },
          {
            badge: 'لماذا بايثون؟',
            heading: 'لغة بايثون: وضوح التعبير وقوة التطبيق',
            paragraphs: [
              'تمتاز لغة بايثون بقربها الشديد من اللغة الطبيعية الإنجليزية، وخلوها من التعقيدات التركيبية الزائدة.',
              'تُستخدم بايثون اليوم في كبرى المؤسسات والجامعات العالمية: في تطوير الويب، الأتمتة، تحليل البيانات، والأهم من ذلك: الذكاء الاصطناعي وتعلم الآلة.'
            ]
          }
        ],
        solvedExample: {
          title: 'مثال تطبيقي: أول أمرين في بايثون',
          code: `# أول برنامج لطلاب النخبة العلمية
print("أنا أتعلم بايثون مع أ/ محمد جبريل")
print(10 + 25)`,
          explanation: 'السطر الأول يطبع الجملة الترحيبية، والسطر الثاني يحسب عملية الجمع 10+25 فيطبع الناتج 35 مباشرة.'
        },
        exercises: [
          {
            id: 'ex-1-1',
            type: 'code',
            title: 'التحدي 1: اكتب سطر طباعة ترحيبي',
            instruction: 'استخدم دالة print لطباعة اسمك ومدرستك (أو أي جملة ترحيبية تريدها).',
            initialCode: '# اكتب كودك هنا:\nprint("مدرستي هي النخبة العلمية")',
            expectedOutput: 'مدرستي هي النخبة العلمية',
            testFunction: (out) => ({
              passed: out.trim().length > 0,
              message: out.trim().length > 0 ? 'رائع! قمت بتنفيذ أمر الطباعة بنجاح' : 'يجب أن يظهر ناتج على الشاشة بعد تشغيل الكود'
            }),
            hints: [
              'تذكر أن دالة الطباعة تُكتب بأحرف صغيرة: print()',
              'ضع النص المراد طباعته داخل علامتي تنصيص "نص" أو \'نص\'',
              'مثال: print("مرحبًا بكم")'
            ],
            solution: 'print("مدرستي هي النخبة العلمية")',
            xp: 20
          },
          {
            id: 'ex-1-2',
            type: 'predict',
            title: 'التحدي 2: توقّع خرْج الكود الرياضي',
            instruction: 'اقرأ الكود التالي بدون تشغيله واكتب القيمة الناتجة:',
            initialCode: 'x = 8\ny = x * 2\nprint(y + 4)',
            expectedOutput: '20',
            testFunction: (out) => ({
              passed: out.trim() === '20',
              message: out.trim() === '20' ? 'إجابة صحيحة وممتازة! 8 * 2 = 16، ثم 16 + 4 = 20' : 'حاول مرة أخرى: 8 ضرب 2 يساوي 16، ثم نضيف 4'
            }),
            hints: [
              'احسب قيمة y أولًا: 8 * 2',
              'ثم اجمع 4 إلى ناتج y'
            ],
            solution: '20',
            xp: 20
          },
          {
            id: 'ex-1-3',
            type: 'fix',
            title: 'التحدي 3: أصلح خطأ في سطر الطباعة',
            instruction: 'الكود أدناه يحتوي على خطأ في الأقواس. قم بإصلاحه ليعمل بشكل سليم ويطبع كلمة Python.',
            initialCode: 'print "Python"',
            expectedOutput: 'Python',
            testFunction: (out) => ({
              passed: out.trim() === 'Python',
              message: out.trim() === 'Python' ? 'أحسنت! في بايثون 3، دالة print تتطلب أقواس ()' : 'تأكد من إحاطة الكلمة بالأقواس: print("Python")'
            }),
            hints: [
              'في بايثون 3، الأقواس إلزامية حول مدخلات الدالة print',
              'الصيغة الصحيحة: print("...")'
            ],
            solution: 'print("Python")',
            xp: 25
          }
        ],
        freePlaygroundPrompt: 'جرّب كتابة عدة أسطر طباعة، واحسب ناتج عمرك أو مساحة مستطيل طوله 7 وعرضه 5.',
        freePlaygroundDefaultCode: `# مساحة مستطيل
طول = 7
عرض = 5
المساحة = طول * عرض
print("المساحة =")
print(المساحة)`
      },
      {
        id: 'py.ch1.l2',
        chapterId: 'ch1',
        part: 1,
        number: 2,
        globalNumber: 2,
        title: 'بنية الحاسوب وكيف يفكر المعالج',
        subtitle: 'المعالج (CPU)، الذاكرة العشوائية (RAM)، ووحدات التخزين الثانوية',
        estimatedMinutes: 15,
        whyItMatters: 'معرفة كيف يتحرك الكود بين الرام والمعالج تجعلك مبرمجًا يكتب أكوادًا سريعة واقتصادية في استهلاك الموارد بدلاً من مجرد كاتب نصوص.',
        predictFirst: {
          question: 'أين تُخزّن المتغيرات أثناء تشغيل البرنامج؟',
          code: 'name = "سالم"',
          answer: 'في الذاكرة العشوائية (RAM)',
          explanation: 'المتغيرات المؤقتة تعيش في ذاكرة الوصول العشوائي RAM وتُمحى فور إغلاق البرنامج.'
        },
        theorySections: [
          {
            badge: 'المكونات الثلاثة',
            heading: 'المعالج، الذاكرة السريعة، والتخزين الدائم',
            paragraphs: [
              'المعالج (CPU): هو عقل الحاسوب، يطرح ويسأل باستمرار "ما التعليمة التالية؟".',
              'الذاكرة الرئيسية (RAM): سريعة جدًا وتفقد محتوياتها عند انقطاع الكهرباء. هنا يعيش كودك ومتغيراتك أثناء التشغيل.',
              'التخزين الثانوي (SSD / Hard Drive): بطيء نسبيًا ولكنه دائم، يحتفظ بملفات الكود والبيانات للمستقبل.'
            ]
          }
        ],
        solvedExample: {
          title: 'مثال: المتغيرات في الذاكرة',
          code: `a = 100
b = 200
print(a + b)`,
          explanation: 'المعالج حجز موقعين في الذاكرة باسم a و b، ثم جلبهما وجمعهما في مسجلات الحساب.'
        },
        exercises: [
          {
            id: 'ex-1-4',
            type: 'code',
            title: 'تخزين متغيرات متعددة وطباعتها',
            instruction: 'أنشئ متغيرين: الأول اسمه students_count وقيمته 40، والثاني teachers_count وقيمته 3، ثم اطبع مجموعهما.',
            initialCode: 'students_count = 40\nteachers_count = 3\n# اطبع المجموع هنا:',
            expectedOutput: '43',
            testFunction: (out) => ({
              passed: out.includes('43'),
              message: out.includes('43') ? 'ممتاز! تم جمع المتغيرين بنجاح' : 'المجموع يجب أن يساوي 43'
            }),
            hints: ['اكتب: print(students_count + teachers_count)'],
            solution: 'students_count = 40\nteachers_count = 3\nprint(students_count + teachers_count)',
            xp: 20
          }
        ]
      },
      {
        id: 'py.ch1.l3',
        chapterId: 'ch1',
        part: 1,
        number: 3,
        globalNumber: 3,
        title: 'المتغيرات والأنواع الأساسية',
        subtitle: 'الأعداد الصحيحة (int)، العشرية (float)، والنصوص (str)',
        estimatedMinutes: 15,
        whyItMatters: 'كل معلومة في العالم الرقمي لها نوع محدد: رقم هاتف، درجة امتحان، اسم طالب، أو حالة نجاح. التمييز بين الأنواع يمنع الأخطاء الكارثية في البرامج.',
        predictFirst: {
          question: 'ما هو ناتج print("5" + "5") مقارنة بـ print(5 + 5)؟',
          code: 'print("5" + "5")\nprint(5 + 5)',
          answer: '55 ثم 10',
          explanation: 'بين علامات التنصيص هو نص (str) فيتم دمجهما بجانب بعضهما، أما بدونها فهما أرقام رياضية فيتم جمعهما.'
        },
        theorySections: [
          {
            badge: 'أنواع البيانات',
            heading: 'الأنواع الشائعة في بايثون',
            paragraphs: [
              'int: عدد صحيح مثل 25، -7، 0.',
              'float: عدد عشري مثل 3.14، 99.5.',
              'str: سلسلة نصية محاطة بعلامات تنصيص مثل "النخبة".',
              'bool: قيمة منطقية إما True أو False.'
            ]
          }
        ],
        solvedExample: {
          title: 'دالة type() لفحص نوع المتغير',
          code: `x = 42
name = "أحمد"
print(type(x))
print(type(name))`,
          explanation: 'دالة type تخبرنا بنوع القيمة المخزنة داخل المتغير.'
        },
        exercises: [
          {
            id: 'ex-1-5',
            type: 'code',
            title: 'تحويل نوع البيانات (Type Casting)',
            instruction: 'حوّل النص "150" إلى عدد صحيح واجمعه مع 50 واطبع الناتج.',
            initialCode: 'text_num = "150"\n# حوّله باستخدام int() ثم اجمعه مع 50:',
            expectedOutput: '200',
            testFunction: (out) => ({
              passed: out.includes('200'),
              message: out.includes('200') ? 'إجابة رائعة! تم التحويل بنجاح' : 'تأكد من استخدام int(text_num) + 50'
            }),
            hints: ['استخدم int(text_num) لتحويل السلسلة النصية إلى رقم.'],
            solution: 'text_num = "150"\nresult = int(text_num) + 50\nprint(result)',
            xp: 25
          }
        ]
      }
    ]
  },
  {
    id: 'ch2',
    part: 1,
    number: 2,
    title: 'الفصل 2: اتخاذ القرارات والجمل الشرطية',
    description: 'جمل if و elif و else، العمليات المنطقية، ومقارنة القيم لتوجيه مسار البرنامج.',
    lessonsCount: 5,
    lessons: [
      {
        id: 'py.ch2.l1',
        chapterId: 'ch2',
        part: 1,
        number: 1,
        globalNumber: 7,
        title: 'الشرط if والتنفيذ المشروط',
        subtitle: 'كيف تجعل برنامجك ذكيًا يتخذ قرارات حسب الظروف',
        estimatedMinutes: 14,
        whyItMatters: 'بدون الشروط، سيعمل البرنامج دائمًا بنفس الطريقة المملة. الشروط هي ما يسمح لتطبيقات البنوك بالتحقق من رصيدك، ولتطبيق مدرستي بتحديد هل الطالب ناجح أم يحتاج مساندة.',
        predictFirst: {
          question: 'هل سيتم تنفيذ أمر الطباعة في هذا الكود؟',
          code: 'score = 92\nif score >= 90:\n    print("تقدير ممتاز")',
          answer: 'نعم، سيطبع "تقدير ممتاز"',
          explanation: 'لأن قيمة score هي 92 وهي أكبر من أو تساوي 90، فالشرط صحيح (True).'
        },
        theorySections: [
          {
            badge: 'المسافة البادئة (Indentation)',
            heading: 'سر بايثون الأنيق: المسافات البادئة',
            paragraphs: [
              'في بايثون، لا نستخدم الأقواس المعقوفة {} لتحديد كتل الأوامر مثل لغات C++ و Java.',
              'بل نستخدم النقطتين الرأسيتين (:) في نهاية سطر الشرط، متبوعة بمسافة بادئة (4 مسافات أو Tab) للأسطر التابعة للشرط.'
            ]
          }
        ],
        solvedExample: {
          title: 'مثال: نظام تقدير الطلاب',
          code: `grade = 85
if grade >= 90:
    print("ممتاز")
elif grade >= 80:
    print("جيد جدًا")
else:
    print("ناجح")`,
          explanation: 'يتحقق المفسر من الشروط بالترتيب، وحين يجد الشرط الأول الصحيح ينفذه ويتجاهل الباقي.'
        },
        exercises: [
          {
            id: 'ex-2-1',
            type: 'code',
            title: 'تحديد هل العدد زوجي أم فردي',
            instruction: 'اكتب كودًا يفحص المتغير num. إذا كان باقي قسمته على 2 يساوي صفر (num % 2 == 0) اطبع "زوجي"، وإلا اطبع "فردي".',
            initialCode: 'num = 14\n# اكتب شرط if و else هنا:',
            expectedOutput: 'زوجي',
            testFunction: (out) => ({
              passed: out.includes('زوجي'),
              message: out.includes('زوجي') ? 'إجابة ذكية وممتازة!' : 'تأكد من استخدام عامل باقي القسمة %'
            }),
            hints: [
              'استخدم عامل باقي القسمة: num % 2 == 0',
              'لا تنس النقطتين : والمسافة البادئة'
            ],
            solution: 'num = 14\nif num % 2 == 0:\n    print("زوجي")\nelse:\n    print("فردي")',
            xp: 25
          }
        ]
      }
    ]
  },
  {
    id: 'ch3',
    part: 1,
    number: 3,
    title: 'الفصل 3: التكرار والحلقات البرمجية (Loops)',
    description: 'حلقات for و while، دالة range، والتحكم بالحلقات عبر break و continue.',
    lessonsCount: 6,
    lessons: [
      {
        id: 'py.ch3.l1',
        chapterId: 'ch3',
        part: 1,
        number: 1,
        globalNumber: 15,
        title: 'حلقات for ودالة range',
        subtitle: 'أتمتة العمليات المكررة بكل سهولة',
        estimatedMinutes: 15,
        whyItMatters: 'لا أحد يحب تكرار كتابة السطر نفسه 100 مرة! حلقات التكرار تمكّنك من معالجة ملايين السجلات في لمح البصر بنفس المجهود الذهني.',
        predictFirst: {
          question: 'ما هي الأرقام التي ستُطبع عند تشغيل range(1, 4)؟',
          code: 'for i in range(1, 4):\n    print(i)',
          answer: '1 و 2 و 3 (الرقم الأخير 4 غير مشمول)',
          explanation: 'في بايثون، دالة range(بداية, نهاية) تبدأ من رقم البداية وتقف قبل رقم النهاية بواحد.'
        },
        theorySections: [
          {
            badge: 'قاعدة ذهبية',
            heading: 'كيف تعمل حلقة for في بايثون',
            paragraphs: [
              'تأخذ حلقة for عنصرًا من المتتالية في كل دورة وتضعه في المتغير المؤقت.',
              'تستمر الحلقة حتى انتهاء جميع عناصر المتتالية دون الحاجة لعداد يدوي.'
            ]
          }
        ],
        solvedExample: {
          title: 'مثال: جمع الأرقام من 1 إلى 5',
          code: `total = 0
for i in range(1, 6):
    total = total + i
print(total)`,
          explanation: 'الحلقة تجمع 1+2+3+4+5 فيكون الناتج 15.'
        },
        exercises: [
          {
            id: 'ex-3-1',
            type: 'code',
            title: 'طباعة جدول ضرب العدد 5',
            instruction: 'استخدم حلقة for مع range(1, 6) لطباعة نواتج ضرب 5 في كل رقم من 1 إلى 5.',
            initialCode: 'for i in range(1, 6):\n    # اطبع 5 * i هنا:',
            expectedOutput: '5\n10\n15\n20\n25',
            testFunction: (out) => ({
              passed: out.includes('5') && out.includes('25'),
              message: out.includes('25') ? 'ممتاز! جدول الضرب كُتب بشكل سليم' : 'تأكد من طباعة 5 * i داخل الحلقة'
            }),
            hints: ['اكتب داخل الحلقة: print(5 * i)'],
            solution: 'for i in range(1, 6):\n    print(5 * i)',
            xp: 25
          }
        ]
      }
    ]
  },
  {
    id: 'ch4',
    part: 1,
    number: 4,
    title: 'الفصل 4: الدوال البرمجية (Functions)',
    description: 'تعريف الدوال بكلمة def، المعاملات، القيم المعادة return، وإعادة استخدام الكود بكفاءة.',
    lessonsCount: 5,
    lessons: [
      {
        id: 'py.ch4.l1',
        chapterId: 'ch4',
        part: 1,
        number: 1,
        globalNumber: 22,
        title: 'بناء الدوال المخصصة وإعادة استخدامها',
        subtitle: 'تنظيم الشيفرة البرمجية وفق أفضل ممارسات هندسة البرمجيات',
        estimatedMinutes: 16,
        whyItMatters: 'المبرمج المحترف لا يكرر نفسه (مبدأ DRY: Don\'t Repeat Yourself). تحويل المنطق المتكرر إلى دوال يجعل البرنامج منظمًا، سهل القراءة، ومحصنًا ضد الأخطاء.',
        predictFirst: {
          question: 'ماذا يطبع هذا الكود؟',
          code: 'def square(n):\n    return n * n\n\nprint(square(6))',
          answer: '36',
          explanation: 'الدالة square أخذت الرقم 6، وضربته في نفسه ثم أعادت الناتج 36 بواسطة كلمة return.'
        },
        theorySections: [
          {
            badge: 'مفهوم الدالة',
            heading: 'المدخلات والمخرجات',
            paragraphs: [
              'الدالة مثل مصنع صغير: تستقبل مواد خام (Parameters)، تقوم بالمعالجة، ثم تُخرج منتجًا نهائيًا (Return Value).',
              'يمكنك استدعاء الدالة مئات المرات بمدخلات مختلفة دون إعادة كتابة المنطق.'
            ]
          }
        ],
        solvedExample: {
          title: 'مثال: دالة حساب التقدير',
          code: `def get_status(score):
    if score >= 60:
        return "اجتاز"
    return "يحتاج مراجعة"

print(get_status(75))`,
          explanation: 'الدالة تفحص الدرجة وتعيد النص المناسب.'
        },
        exercises: [
          {
            id: 'ex-4-1',
            type: 'code',
            title: 'دالة حساب مساحة الدائرة',
            instruction: 'أنشئ دالة باسم circle_area(radius) تعيد 3.14 * radius * radius، ثم اطبع ناتج circle_area(10).',
            initialCode: 'def circle_area(radius):\n    # اكتب كود الحساب والإرجاع هنا:\n    pass\n\nprint(circle_area(10))',
            expectedOutput: '314',
            testFunction: (out) => ({
              passed: out.includes('314'),
              message: out.includes('314') ? 'أحسنت صنعًا! الدالة تعمل بدقة' : 'الناتج لنصف قطر 10 يجب أن يكون 314'
            }),
            hints: ['اكتب return 3.14 * radius * radius'],
            solution: 'def circle_area(radius):\n    return 3.14 * radius * radius\n\nprint(circle_area(10))',
            xp: 30
          }
        ]
      }
    ]
  },
  // ===================== PART 2: الذكاء الاصطناعي والتقنية الرقمية =====================
  {
    id: 'ch_ai_1',
    part: 2,
    number: 5,
    title: 'الجزء الثاني: مدخل إلى الذكاء الاصطناعي وتعلم الآلة',
    description: 'مفاهيم الذكاء الاصطناعي، الفرق بين البرمجة التقليدية وتعلم الآلة، ونماذج التصنيف التنبؤية.',
    lessonsCount: 4,
    lessons: [
      {
        id: 'ai.ch1.l1',
        chapterId: 'ch_ai_1',
        part: 2,
        number: 1,
        globalNumber: 101,
        title: 'ما هو الذكاء الاصطناعي وكيف يتعلم النموذج؟',
        subtitle: 'وحدة الذكاء الاصطناعي - منهج التقنية الرقمية بإشراف أ/ محمد جبريل',
        estimatedMinutes: 18,
        whyItMatters: 'في البرمجة التقليدية نكتب القواعد بأنفسنا. في تعلم الآلة (Machine Learning)، نعطي الحاسوب البيانات والأمثلة، وهو يستنتج القواعد بنفسه! هذا هو المحرك لتقنيات مثل القيادة الذاتية والترجمة الآلية والتعرف على الوجوه.',
        predictFirst: {
          question: 'ما هو الفرق الجوهري بين البرمجة الكلاسيكية وتعلم الآلة؟',
          code: '# كلاسيكي: بيانات + قواعد -> نتائج\n# تعلم آلة: بيانات + نتائج -> قواعد!',
          answer: 'تعلم الآلة يستخرج القواعد والنماذج من البيانات بدلاً من كتابتها يدويًا',
          explanation: 'النموذج يحلل الأنماط الإحصائية ليتعلم التنبؤ بالمدخلات الجديدة.'
        },
        theorySections: [
          {
            badge: 'مقارنة محورية',
            heading: 'البرمجة التقليدية مقابل تعلم الآلة',
            paragraphs: [
              'البرمجة التقليدية: مبرمج يكتب شروط if/else لكل حالة ممكنة. هذا مستحيل مثلًا لتمييز صور القطط لأن زوايا التصوير والإضاءة لا نهائية.',
              'تعلم الآلة: نغذي النموذج بآلاف الصور، فيتعلم الأوزان الرياضية (Weights) التي تميز الخصائص بصورة تلقائية.'
            ]
          },
          {
            badge: 'الشبكات العصبية الاصطناعية',
            heading: 'محاكاة الخلايا العصبية الدماغية',
            paragraphs: [
              'تتكون الشبكة العصبية من طبقة مدخلات (Input Layer)، طبقات خفية (Hidden Layers)، وطبقة مخرجات (Output Layer).',
              'كل اتصال بين خليتين له وزن رياضي يتم تعديله عبر خوارزمية الانتشار العكسي (Backpropagation).'
            ]
          }
        ],
        solvedExample: {
          title: 'نموذج بايثون مبسط: مصنف ذكي للدرجات',
          code: `# مصنف إحصائي أولي مستوحى من الذكاء الاصطناعي
def ai_predict_readiness(study_hours, attendance_rate):
    score = (study_hours * 5) + (attendance_rate * 0.5)
    if score >= 60:
        return "جاهز للاختبار بنجاح 🚀"
    return "يحتاج خطة دعم إضافية 📚"

print(ai_predict_readiness(8, 85))`,
          explanation: 'دالة خطية تحاكي الخلية العصبية (Perceptron) بحساب المجموع الموزون وتمريره لدالة تنشيط.'
        },
        exercises: [
          {
            id: 'ex-ai-1',
            type: 'code',
            title: 'بناء خلية عصبية مبسطة (Perceptron)',
            instruction: 'اكتب دالة باسم neuron(x1, x2, w1, w2, bias) تحسب الناتج: (x1 * w1) + (x2 * w2) + bias. ثم اطبع ناتج neuron(2, 3, 0.5, 1.0, -1).',
            initialCode: 'def neuron(x1, x2, w1, w2, bias):\n    # اكتب معادلة الخلية العصبية هنا:\n    pass\n\nprint(neuron(2, 3, 0.5, 1.0, -1))',
            expectedOutput: '3',
            testFunction: (out) => ({
              passed: out.includes('3'),
              message: out.includes('3') ? 'مذهل! لقد قمت ببرمجة أول خلية عصبية رياضية في بايثون' : 'الناتج يجب أن يكون 3.0'
            }),
            hints: [
              'المعادلة هي: (x1 * w1) + (x2 * w2) + bias',
              '2*0.5 = 1، و 3*1.0 = 3، والمجموع 4 - 1 = 3'
            ],
            solution: 'def neuron(x1, x2, w1, w2, bias):\n    return (x1 * w1) + (x2 * w2) + bias\n\nprint(neuron(2, 3, 0.5, 1.0, -1))',
            xp: 40
          }
        ]
      }
    ]
  }
];

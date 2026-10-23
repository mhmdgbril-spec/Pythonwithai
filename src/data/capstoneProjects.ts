import { CapstoneProjectItem } from '../types';

export const CAPSTONE_CHECKLIST_ITEMS: CapstoneProjectItem[] = [
  {
    id: 'cap-1',
    title: 'مقترح المشروع (Project Proposal)',
    description: 'تحديد المشكلة الحقيقية، الفئة المستهدفة في المدرسة أو المجتمع، نطاق العمل، ومعايير القبول والنجاح.',
    category: 'التخطيط والتحليل',
    deliverable: 'ملف مقترح مختصر (Problem Statement & Scope)',
    required: true
  },
  {
    id: 'cap-2',
    title: 'النظام الهيكلي الأولي (Skeletal Prototype)',
    description: 'بناء هيكل بايثون البرمجي الأولي: الواجهات والدوال الرئيسية جوفاء بدون تفاصيل، مع التحقق من ترابط الوحدات.',
    category: 'الهندسة المعمارية',
    deliverable: 'ملف main.py بهياكل الدوال وتمرير المعاملات',
    required: true
  },
  {
    id: 'cap-3',
    title: 'المنتج القابل للحياة (Viable MVP)',
    description: 'المسار الأساسي للمستخدم يعمل بشكل متكامل من البداية حتى النهاية، مع معالجة المدخلات الخاطئة.',
    category: 'التطوير البرمجي',
    deliverable: 'كود يعمل بنجاح بدون أخطاء Runtime',
    required: true
  },
  {
    id: 'cap-4',
    title: 'حزمة الاختبارات والتحقق (Test Suite)',
    description: 'تطبيق اختبارات تلقائية على الدوال الحسابية والمنطقية للتأكد من دقة المخرجات في جميع الحالات الحدية.',
    category: 'ضمان الجودة (QA)',
    deliverable: 'مجموعة دوال اختبارية assert / test functions خضراء',
    required: true
  },
  {
    id: 'cap-5',
    title: 'دليل التوثيق والتشغيل (README Documentation)',
    description: 'توثيق واضح باللغة العربية يشرح: ما هو المشروع، كيفية تشغيله، المتطلبات، وأمثلة على المدخلات والمخرجات.',
    category: 'التوثيق والنشر',
    deliverable: 'ملف README.md منسق بوضوح',
    required: true
  },
  {
    id: 'cap-6',
    title: 'العرض والمناقشة مع المعلم (Capstone Presentation)',
    description: 'عرض عملي حي للبرنامج أمام أ/ محمد جبريل وزملائك في معامل التقنية بمدارس النخبة العلمية.',
    category: 'المناقشة والتقييم',
    deliverable: 'عرض تقديمي وتطبيق عملي مدته 5 دقائق',
    required: true
  }
];

export interface CapstoneProjectTemplate {
  id: string;
  title: string;
  badge: string;
  description: string;
  suggestedBy: string;
  starterCode: string;
}

export const CAPSTONE_PROJECT_IDEAS: CapstoneProjectTemplate[] = [
  {
    id: 'proj-school-system',
    title: 'نظام إدارة درجات وسلوك الطلاب الذكي',
    badge: 'إداري مدرسي',
    description: 'برنامج بايثون تفاعلي يستقبل درجات الطلاب في مواد التقنية الرقمية، يحسب المتوسط والانحراف المعياري، ويصدر تقرير تفوق.',
    suggestedBy: 'أ/ محمد جبريل - مدارس النخبة العلمية بالدمام',
    starterCode: `# مشروع نظام إدارة درجات طلاب النخبة العلمية
# إعداد الطالب: [اسم الطالب]
# إشراف: أ/ محمد جبريل

students = [
    {"name": "عبدالله الشمري", "scores": [95, 98, 92]},
    {"name": "محمد القحطاني", "scores": [88, 90, 85]},
    {"name": "فيصل الدوسري", "scores": [100, 96, 99]}
]

def calculate_average(scores):
    return sum(scores) / len(scores)

print("=== تقرير درجات التقنية الرقمية ===")
for student in students:
    avg = calculate_average(student["scores"])
    status = "🌟 متفوق مع مرتبة الشرف" if avg >= 95 else "✅ مجتاز بتميز"
    print(f"الطالب: {student['name']} | المعدل: {round(avg, 1)}% | الحالة: {status}")
`
  },
  {
    id: 'proj-ai-sentiment',
    title: 'محلل مشاعر نصوص الطلاب وآرائهم',
    badge: 'ذكاء اصطناعي',
    description: 'تطبيق ذكي يعتمد على تحليل الكلمات المفتاحية والأوزان الشعورية لتقييم انطباعات الطلاب حول التجارب المعملية.',
    suggestedBy: 'وحدة الذكاء الاصطناعي - أ/ محمد جبريل',
    starterCode: `# محلل المشاعر النصي في بايثون
positive_words = ["رائع", "ممتع", "مفيد", "ممتاز", "سهل", "أحببت"]
negative_words = ["صعب", "ممل", "غير واضح", "بطيء", "مشكلة"]

def analyze_feedback(text):
    words = text.split()
    pos_count = sum(1 for w in words if w in positive_words)
    neg_count = sum(1 for w in words if w in negative_words)
    
    if pos_count > neg_count:
        return "إيجابي ومحفز 😊"
    elif neg_count > pos_count:
        return "يحتاج مراجعة وتبسيط 🧐"
    return "محايد ⚖️"

feedback = "درس بايثون اليوم كان ممتع ومفيد للغاية"
print("النص:", feedback)
print("النتيجة:", analyze_feedback(feedback))
`
  },
  {
    id: 'proj-cyber-quiz',
    title: 'نظام تشفير الرسائل وفحص قوة كلمات المرور',
    badge: 'أمن سيبراني',
    description: 'تطبيق يدمج خوارزمية قيصر (Caesar Cipher) لتشفير وفك تشفير الرسائل مع مقياس أمان لكلمات المرور المدرسية.',
    suggestedBy: 'أ/ محمد جبريل - مدارس النخبة العلمية بالدمام',
    starterCode: `# محاكي أمان الحسابات والتشفير
def check_password_strength(password):
    score = 0
    if len(password) >= 8: score += 1
    if any(c.isupper() for c in password): score += 1
    if any(c.islower() for c in password): score += 1
    if any(c.isdigit() for c in password): score += 1
    return "قوية وآمنة 🛡️" if score >= 3 else "ضعيفة، يرجى تعزيزها ⚠️"

test_pwd = "Nokhba2026Secure!"
print("فحص كلمة المرور:", test_pwd)
print("مستوى الأمان:", check_password_strength(test_pwd))
`
  }
];

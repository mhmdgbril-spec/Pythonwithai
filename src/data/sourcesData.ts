export interface EducationalSource {
  id: string;
  code: string;
  title: string;
  titleAr: string;
  role: string;
  author: string;
  translator?: string;
  license: string;
  licenseUrl: string;
  description: string;
  notes: string;
}

export const EDUCATIONAL_SOURCES: EducationalSource[] = [
  {
    id: 'py4e',
    code: 'PY4E',
    title: 'Python for Everybody: Exploring Data Using Python 3',
    titleAr: 'بايثون للجميع — استكشاف البيانات باستخدام بايثون 3',
    role: 'المرجع الأساسي المنهجي للجزء الأول (أساسيات بايثون وهياكل البيانات)',
    author: 'Dr. Charles Severance (د. تشارلز سيفرانس)',
    translator: 'فريق Electronics Go (إلكترونيكس جو)',
    license: 'CC BY-NC-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-nc-sa/3.0/',
    description: 'الكتاب الأوسع انتشارًا عالميًا لتعليم بايثون بأسلوب تدريجي ممتع يركز على التطبيق العملي والتعامل مع البيانات.',
    notes: 'اعتمدنا الترتيب التربوي لفصول الكتاب مع صياغة كافة التمارين والأمثلة بصورة أصلية ومطورة لتناسب طلاب المرحلة الثانوية.'
  },
  {
    id: 'moe-digital-tech',
    code: 'MOE-KSA',
    title: 'Digital Technology Curriculum - Secondary Track',
    titleAr: 'منهج التقنية الرقمية — مسارات المرحلة الثانوية (المملكة العربية السعودية)',
    role: 'المعيار الوطني والتربوي المعتمد في مدارس النخبة العلمية الأهلية بالدمام',
    author: 'وزارة التعليم بالمملكة العربية السعودية',
    license: 'حقوق النشر محفوظة لوزارة التعليم',
    licenseUrl: 'https://moe.gov.sa',
    description: 'المنهج الدراسي الحديث الذي يشمل الخوارزميات، البرمجة بلغة بايثون، الذكاء الاصطناعي، الأمن السيبراني، وهندسة البرمجيات.',
    notes: 'إشراف وتطبيق الأستاذ محمد جبريل، معلم التقنية الرقمية بمدارس النخبة العلمية الأهلية بالدمام.'
  },
  {
    id: 'swe-book',
    code: 'SWE',
    title: 'Engineering Software Products',
    titleAr: 'هندسة المنتجات البرمجية — أفضل الممارسات المهنية',
    role: 'مرجع منهجيات تطوير البرمجيات ومشاريع الكابستون',
    author: 'Ian Sommerville (إيان سمرفيل)',
    license: 'مرجع أكاديمي للاقتباس المعرفي المنهجي',
    licenseUrl: 'https://iansommerville.com',
    description: 'دليل مهني يشرح منهجيات التطوير الرشيق (Agile & Scrum)، وتصميم واجهات البرمجة، وبناء مشاريع التخرج المصغرة.',
    notes: 'مستفاد منه في هيكلة خطوات مشروع التخرج (الكابستون) للطلاب.'
  }
];

export const TEACHER_PROFILE = {
  name: 'أ/ محمد جبريل',
  role: 'معلم التقنية الرقمية والحاسب الآلي',
  school: 'مدارس النخبة العلمية الأهلية بالدمام',
  location: 'الدمام، المنطقة الشرقية، المملكة العربية السعودية',
  bio: 'معلم خبير وموجه تقني شغوف بنقل مهارات البرمجة الحديثة والذكاء الاصطناعي والتفكير الحوسبي إلى عقول بناة المستقبل من طلاب مدارس النخبة العلمية.',
  messageToStudents: 'أبنائي وبناتي طلبة مدارس النخبة العلمية: البرمجة ليست مجرد كتابة سطور صماء، بل هي أداة التفكير الإبداعي وحل المشكلات وصناعة المستقبل الرقمي لوطننا المعطاء. خطوة صغيرة كل يوم تصنع فارقًا عظيمًا في مسيرتكم.'
};

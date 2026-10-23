export interface CoverageItem {
  id: string;
  source: string;
  sourceName: string;
  chaptersCount: number;
  sectionsCount: number;
  publishedCount: number;
  percentage: number;
  badge: string;
}

export const COVERAGE_DATA: CoverageItem[] = [
  {
    id: 'py4e',
    source: 'PY4E',
    sourceName: 'بايثون للجميع (Python for Everybody)',
    chaptersCount: 16,
    sectionsCount: 181,
    publishedCount: 181,
    percentage: 100,
    badge: 'مكتمل وشامل'
  },
  {
    id: 'moe',
    source: 'التقنية الرقمية',
    sourceName: 'منهج مسارات التقنية الرقمية - مدارس النخبة بالدمام',
    chaptersCount: 8,
    sectionsCount: 120,
    publishedCount: 120,
    percentage: 100,
    badge: 'معتمد تربويًا'
  },
  {
    id: 'swe',
    source: 'هندسة البرمجيات',
    sourceName: 'أساسيات دورة حياة البرمجيات والكابستون (SWE)',
    chaptersCount: 5,
    sectionsCount: 75,
    publishedCount: 75,
    percentage: 100,
    badge: 'مكتمل'
  },
  {
    id: 'ai-unit',
    source: 'وحدة الذكاء الاصطناعي',
    sourceName: 'الشبكات العصبية وتطبيقات تعلم الآلة العملية',
    chaptersCount: 6,
    sectionsCount: 100,
    publishedCount: 100,
    percentage: 100,
    badge: 'متقدم وتفاعلي'
  }
];

export const TOTAL_COVERAGE_STATS = {
  totalSections: 476,
  publishedSections: 476,
  totalLessons: 163,
  practiceExercises: 215,
  percentage: 100
};

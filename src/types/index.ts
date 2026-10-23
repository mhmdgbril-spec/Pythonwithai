export type ColorThemeId = 'emerald' | 'cobalt' | 'violet' | 'amber' | 'ruby' | 'sepia';

export type DisplayMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  id: ColorThemeId;
  name: string;
  nameEn: string;
  description: string;
  primary: string; // hex
  primaryLight: string;
  primaryDark: string;
  accent: string;
  bgLight: string;
  cardLight: string;
  borderLight: string;
  badgeClass: string;
  gradientClass: string;
  previewColors: string[];
}

export type TabType = 
  | 'dashboard' 
  | 'path' 
  | 'book'
  | 'playground' 
  | 'coverage' 
  | 'sources' 
  | 'exam' 
  | 'capstone' 
  | 'settings';

export interface LessonExercise {
  id: string;
  type: 'code' | 'predict' | 'fix';
  title: string;
  instruction: string;
  initialCode?: string;
  expectedOutput?: string;
  testFunction?: (output: string, code: string) => { passed: boolean; message: string };
  hints: string[];
  solution: string;
  xp: number;
}

export interface Lesson {
  id: string;
  chapterId: string;
  part: 1 | 2;
  number: number;
  globalNumber: number;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  whyItMatters: string;
  predictFirst: {
    question: string;
    code: string;
    answer: string;
    explanation: string;
  };
  theorySections: {
    badge: string;
    heading: string;
    paragraphs: string[];
  }[];
  solvedExample: {
    title: string;
    code: string;
    explanation: string;
  };
  exercises: LessonExercise[];
  freePlaygroundPrompt?: string;
  freePlaygroundDefaultCode?: string;
}

export interface Chapter {
  id: string;
  part: 1 | 2;
  number: number;
  title: string;
  description: string;
  lessonsCount: number;
  lessons: Lesson[];
}

export interface ExamQuestion {
  id: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  topic: string;
}

export interface CapstoneProjectItem {
  id: string;
  title: string;
  description: string;
  category: string;
  deliverable: string;
  required: boolean;
}

export interface StudentProfile {
  name: string;
  email: string;
  grade: string; // e.g. "الأول الثانوي" / "الثاني الثانوي"
  school: string;
  avatar: string;
  xp: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  completedLessons: string[]; // lesson ids
  completedExercises: string[]; // exercise ids
  examScore?: number;
  examPassed?: boolean;
  examDate?: string;
  capstoneCompletedItems: string[];
  notes: Record<string, string>; // lessonId -> student note
  completedDailyChallenges?: string[]; // YYYY-MM-DD keys or challenge IDs
  lastDailyChallengeDate?: string; // YYYY-MM-DD
}

export interface AppSettings {
  theme: ColorThemeId;
  displayMode: DisplayMode;
  fontSizePercent: number; // 90 to 120
  calmMode: boolean; // hide XP, badges, animations
  reduceMotion: boolean;
  soundEnabled: boolean;
  gateMode: 'advisory' | 'enforced'; // Part 2 gate
}

export type ToastType = 'xp' | 'lesson_complete' | 'level_up' | 'badge' | 'success' | 'info';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  xpAmount?: number;
  durationMs?: number;
}


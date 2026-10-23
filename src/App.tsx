import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TabType, ColorThemeId, StudentProfile, AppSettings, ToastNotification } from './types';
import { COLOR_THEMES, applyTheme } from './utils/theme';
import { CURRICULUM_CHAPTERS } from './data/curriculumData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { DashboardView } from './components/DashboardView';
import { LearningPathView } from './components/LearningPathView';
import { LessonDetailView } from './components/LessonDetailView';
import { PlaygroundView } from './components/PlaygroundView';
import { CoverageView } from './components/CoverageView';
import { SourcesView } from './components/SourcesView';
import { ExamView } from './components/ExamView';
import { CapstoneView } from './components/CapstoneView';
import { SettingsView } from './components/SettingsView';
import { ColorThemeModal } from './components/ColorThemeModal';
import { AuthModal } from './components/AuthModal';
import { CertificateModal } from './components/CertificateModal';
import { ToastContainer } from './components/ToastContainer';
import { BookCurriculumView } from './components/BookCurriculumView';
import { PythonAiAssistant } from './components/PythonAiAssistant';
import { BOOK_CHAPTERS } from './data/bookChaptersData';
import { DailyChallenge, calculateUpdatedStreak, getDailyChallengeForDate } from './utils/dailyChallenge';

const DEFAULT_STUDENT: StudentProfile = {
  name: 'طالب النخبة المتميز',
  email: 'student@alnokhba.edu.sa',
  grade: 'الأول الثانوي — مسار علوم الحاسب',
  school: 'مدارس النخبة العلمية الأهلية بالدمام',
  avatar: '👨‍💻',
  xp: 40,
  level: 1,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessons: [],
  completedExercises: [],
  capstoneCompletedItems: ['cap-1'],
  notes: {},
  completedDailyChallenges: []
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'emerald',
  displayMode: 'light',
  fontSizePercent: 100,
  calmMode: false,
  reduceMotion: false,
  soundEnabled: true,
  gateMode: 'advisory'
};

export default function App() {
  // Load settings from localStorage or defaults
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('nokhba_python_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  // Load student profile from localStorage or defaults
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem('nokhba_python_student');
      if (saved) return { ...DEFAULT_STUDENT, ...JSON.parse(saved) };
    } catch {
      // fallback
    }
    return DEFAULT_STUDENT;
  });

  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeBookUnitId, setActiveBookUnitId] = useState<string>('unit-1');

  // Modals state
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCertificateModalOpen, setIsCertificateModalOpen] = useState(false);

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const showToast = (toast: Omit<ToastNotification, 'id'>) => {
    if (settings.calmMode) return; // respect calm mode
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastNotification = { ...toast, id };
    setToasts(prev => [newToast, ...prev.slice(0, 3)]);

    const duration = toast.durationMs || 4500;
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Apply theme whenever settings change
  useEffect(() => {
    applyTheme(settings.theme, settings.displayMode, settings.fontSizePercent);
    try {
      localStorage.setItem('nokhba_python_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Persist student profile whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('nokhba_python_student', JSON.stringify(student));
    } catch {
      // ignore
    }
  }, [student]);

  // Toggle dark mode
  const handleToggleDark = () => {
    setSettings(prev => ({
      ...prev,
      displayMode: prev.displayMode === 'dark' ? 'light' : 'dark'
    }));
  };

  // Open a specific lesson
  const handleOpenLesson = (lessonId: string) => {
    setActiveLessonId(lessonId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Close lesson and return to path
  const handleBackToPath = () => {
    setActiveLessonId(null);
    setActiveTab('path');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle exercise passed with XP toast
  // Handle exercise passed with XP toast
  const handleExercisePassed = (xp: number, exerciseTitle: string, exerciseId: string) => {
    const alreadyCompleted = student.completedExercises.includes(exerciseId);

    if (alreadyCompleted) {
      showToast({
        title: 'تأكيد صحة الحل البرمجي! ✓',
        message: `كود سليم وصحيح لتحدي "${exerciseTitle}". واصل تميزك يا بطل بايثون!`,
        type: 'success',
        durationMs: 3500
      });
      return;
    }

    const newXp = student.xp + xp;
    const newLevel = Math.floor(newXp / 100) + 1;
    const leveledUp = newLevel > student.level;

    if (leveledUp) {
      showToast({
        title: '🌟 ارتقاء إلى مستوى جديد!',
        message: `تهانينا يا بطل بايثون! لقد ارتقيت إلى المستوى ${newLevel} بفضل إتقانك للتمارين البرمجية.`,
        type: 'level_up',
        durationMs: 5500
      });
    } else {
      showToast({
        title: 'نقاط خبرة جديدة مكتسبة!',
        message: `أحسنت! أتقنت "${exerciseTitle}" بنجاح في مادة التقنية الرقمية.`,
        type: 'xp',
        xpAmount: xp,
        durationMs: 4000
      });
    }

    setStudent(prev => ({
      ...prev,
      xp: newXp,
      level: newLevel,
      completedExercises: [...prev.completedExercises, exerciseId]
    }));
  };

  // Complete lesson
  const handleCompleteLesson = (lessonId: string, earnedXp: number) => {
    const lessonObj = CURRICULUM_CHAPTERS.flatMap(c => c.lessons).find(l => l.id === lessonId);
    const lessonTitle = lessonObj?.title || 'الدرس';
    const alreadyCompleted = student.completedLessons.includes(lessonId);

    const newCompleted = alreadyCompleted
      ? student.completedLessons
      : [...student.completedLessons, lessonId];
    
    const newXp = alreadyCompleted ? student.xp : student.xp + earnedXp;
    const newLevel = Math.floor(newXp / 100) + 1;
    const leveledUp = newLevel > student.level;

    if (leveledUp) {
      showToast({
        title: '🌟 ارتقاء في المستوى الأكاديمي!',
        message: `مبارك! صعدت إلى المستوى ${newLevel} في منصة Hero of Python!`,
        type: 'level_up',
        durationMs: 5500
      });
    } else if (alreadyCompleted) {
      showToast({
        title: '✨ مراجعة الدرس مكتملة!',
        message: `تم تثبيت مهارات درس "${lessonTitle}" بنجاح في مادة التقنية الرقمية.`,
        type: 'lesson_complete',
        xpAmount: 0,
        durationMs: 4000
      });
    } else {
      showToast({
        title: '🎉 إتمام درس بنجاح!',
        message: `أحسنت يا بطل! أتممت بنجاح درس "${lessonTitle}" وحصلت على ${earnedXp} نقطة خبرة.`,
        type: 'lesson_complete',
        xpAmount: earnedXp,
        durationMs: 5000
      });
    }

    setStudent(prev => ({
      ...prev,
      xp: newXp,
      level: newLevel,
      completedLessons: newCompleted
    }));
  };

  // Toggle capstone checklist item
  const handleToggleCapstoneItem = (itemId: string) => {
    const exists = student.capstoneCompletedItems.includes(itemId);
    const updated = exists
      ? student.capstoneCompletedItems.filter(id => id !== itemId)
      : [...student.capstoneCompletedItems, itemId];

    if (!exists) {
      showToast({
        title: 'معلم هندسي مكتمل!',
        message: 'تم تسجيل إنجاز مرحلة جديدة في مشروع الكابستون بنجاح.',
        type: 'badge',
        durationMs: 3500
      });
    }

    setStudent(prev => ({
      ...prev,
      capstoneCompletedItems: updated
    }));
  };

  // Save exam results
  const handleSaveExamResult = (score: number, passed: boolean) => {
    setStudent(prev => {
      if (passed) {
        showToast({
          title: '🎓 اجتياز الامتحان المعتمد!',
          message: `إنجاز باهر! حققت نسبة ${score}% وفتحت شهادة Hero of Python الرسمية الموقعة باسم أ/ محمد جبريل!`,
          type: 'level_up',
          xpAmount: 150,
          durationMs: 6500
        });
      }

      const newXp = prev.xp + (passed ? 150 : 25);
      return {
        ...prev,
        examScore: Math.max(prev.examScore || 0, score),
        examPassed: prev.examPassed || passed,
        examDate: new Date().toLocaleDateString('ar-SA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        xp: newXp,
        level: Math.floor(newXp / 100) + 1
      };
    });
  };

  // Complete Daily Challenge (24h rotating system)
  const handleCompleteDailyChallenge = (challenge: DailyChallenge, dateKey: string) => {
    const completedList = student.completedDailyChallenges || [];
    const officialToday = getDailyChallengeForDate(new Date());
    const isOfficialToday = challenge.id === officialToday.id;
    const recordKey = isOfficialToday ? dateKey : challenge.id;

    if (
      completedList.includes(recordKey) ||
      (isOfficialToday && student.lastDailyChallengeDate === dateKey)
    ) {
      showToast({
        title: 'تأكيد اجتياز التحدي اليومي! ✓',
        message: `أحسنت! كودك للتحدي "${challenge.title}" سليم تماماً. يتجدد التحدي القادم مع بداية اليوم الجديد.`,
        type: 'success',
        durationMs: 4000
      });
      return;
    }

    const earnedXp = challenge.xpReward;
    const newXp = student.xp + earnedXp;
    const newLevel = Math.floor(newXp / 100) + 1;
    const { newStreak } = isOfficialToday
      ? calculateUpdatedStreak(student.streakDays, student.lastDailyChallengeDate, new Date())
      : { newStreak: student.streakDays };

    showToast({
      title: '🔥 إنجاز التحدي اليومي المتجدد!',
      message: `رائع يا بطل! حللت تحدي "${challenge.title}" وحصلت على +${earnedXp} XP وارتفع حماس الاستمرارية إلى ${newStreak} أيام!`,
      type: 'xp',
      xpAmount: earnedXp,
      durationMs: 5000
    });

    setStudent(prev => ({
      ...prev,
      xp: newXp,
      level: newLevel,
      streakDays: newStreak,
      lastDailyChallengeDate: isOfficialToday ? dateKey : prev.lastDailyChallengeDate,
      completedDailyChallenges: Array.from(
        new Set([...(prev.completedDailyChallenges || []), recordKey, challenge.id])
      )
    }));
  };

  // Export data as JSON
  const handleExportData = () => {
    const data = {
      student,
      settings,
      exportDate: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nokhba_python_backup_${student.name.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import data from JSON file
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.student) setStudent(parsed.student);
        if (parsed.settings) setSettings(parsed.settings);
        showToast({
          title: 'تم استيراد البيانات بنجاح',
          message: 'تم استعادة ملفك الشخصي وتقدّمك الدراسي.',
          type: 'success'
        });
      } catch {
        showToast({
          title: 'خطأ في قراءة الملف',
          message: 'تأكد من اختيار ملف نسخ احتياطي صالح بصيغة JSON.',
          type: 'info'
        });
      }
    };
    reader.readAsText(file);
  };

  // Reset all student data
  const handleResetData = () => {
    setStudent(DEFAULT_STUDENT);
    setSettings(DEFAULT_SETTINGS);
    localStorage.removeItem('nokhba_python_student');
    localStorage.removeItem('nokhba_python_settings');
    setActiveTab('dashboard');
    setActiveLessonId(null);
    showToast({
      title: 'تمت إعادة ضبط البيانات',
      message: 'تمت استعادة الإعدادات الافتراضية بنجاح.',
      type: 'info'
    });
  };

  // Find active lesson if activeLessonId is set
  const allLessons = CURRICULUM_CHAPTERS.flatMap(ch => ch.lessons);
  const activeLesson = activeLessonId ? allLessons.find(l => l.id === activeLessonId) : null;
  const activeLessonIndex = activeLesson ? allLessons.findIndex(l => l.id === activeLesson.id) : -1;
  const prevLessonId = activeLessonIndex > 0 ? allLessons[activeLessonIndex - 1].id : undefined;
  const nextLessonId = activeLessonIndex >= 0 && activeLessonIndex < allLessons.length - 1 ? allLessons[activeLessonIndex + 1].id : undefined;

  const isDark = settings.displayMode === 'dark';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors selection:bg-emerald-500/20">
      {/* Header with Navigation and Teacher Attribution */}
      <Header
        activeTab={activeLessonId ? 'path' : activeTab}
        onSelectTab={(tab) => {
          setActiveLessonId(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentTheme={settings.theme}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        isDark={isDark}
        onToggleDark={handleToggleDark}
        student={student}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        soundEnabled={settings.soundEnabled}
      />

      {/* Main Content Area with Smooth Motion Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8 overflow-hidden" id="main">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLessonId ? `lesson-${activeLessonId}` : activeTab}
            initial={{ opacity: 0, y: settings.reduceMotion ? 0 : 12, scale: settings.reduceMotion ? 1 : 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: settings.reduceMotion ? 0 : -12, scale: settings.reduceMotion ? 1 : 0.995 }}
            transition={{
              duration: settings.reduceMotion ? 0.05 : 0.28,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="w-full"
          >
            {activeLesson ? (
              <LessonDetailView
                lesson={activeLesson}
                student={student}
                currentTheme={settings.theme}
                onBackToPath={handleBackToPath}
                onCompleteLesson={handleCompleteLesson}
                onNavigateLesson={handleOpenLesson}
                prevLessonId={prevLessonId}
                nextLessonId={nextLessonId}
                soundEnabled={settings.soundEnabled}
                onExercisePassed={handleExercisePassed}
              />
            ) : (
              <>
                {activeTab === 'dashboard' && (
                  <DashboardView
                    student={student}
                    currentTheme={settings.theme}
                    onOpenLesson={handleOpenLesson}
                    onNavigateTab={(tab) => {
                      setActiveTab(tab);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    soundEnabled={settings.soundEnabled}
                    onCompleteDailyChallenge={handleCompleteDailyChallenge}
                  />
                )}

                {activeTab === 'path' && (
                  <LearningPathView
                    student={student}
                    currentTheme={settings.theme}
                    onOpenLesson={handleOpenLesson}
                    soundEnabled={settings.soundEnabled}
                  />
                )}

                {activeTab === 'book' && (
                  <BookCurriculumView
                    currentTheme={settings.theme}
                    student={student}
                    soundEnabled={settings.soundEnabled}
                    onExercisePassed={handleExercisePassed}
                    onSelectBookUnit={setActiveBookUnitId}
                  />
                )}

                {activeTab === 'playground' && (
                  <PlaygroundView
                    currentTheme={settings.theme}
                    soundEnabled={settings.soundEnabled}
                  />
                )}

                {activeTab === 'coverage' && (
                  <CoverageView currentTheme={settings.theme} />
                )}

                {activeTab === 'sources' && (
                  <SourcesView currentTheme={settings.theme} />
                )}

                {activeTab === 'exam' && (
                  <ExamView
                    student={student}
                    currentTheme={settings.theme}
                    onSaveExamResult={handleSaveExamResult}
                    onViewCertificate={() => setIsCertificateModalOpen(true)}
                    soundEnabled={settings.soundEnabled}
                  />
                )}

                {activeTab === 'capstone' && (
                  <CapstoneView
                    student={student}
                    currentTheme={settings.theme}
                    onToggleCapstoneItem={handleToggleCapstoneItem}
                    soundEnabled={settings.soundEnabled}
                  />
                )}

                {activeTab === 'settings' && (
                  <SettingsView
                    settings={settings}
                    onUpdateSettings={(newSettings) => setSettings(prev => ({ ...prev, ...newSettings }))}
                    student={student}
                    onExportData={handleExportData}
                    onImportData={handleImportData}
                    onResetData={handleResetData}
                    soundEnabled={settings.soundEnabled}
                  />
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer
        onNavigateTab={(tab) => {
          setActiveLessonId(null);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        currentTheme={settings.theme}
        soundEnabled={settings.soundEnabled}
      />

      {/* Color Themes Switcher Modal (Requested by user) */}
      <ColorThemeModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        currentTheme={settings.theme}
        onSelectTheme={(themeId) => setSettings(prev => ({ ...prev, theme: themeId }))}
        soundEnabled={settings.soundEnabled}
      />

      {/* Student Profile / Auth Modal */}
      <AuthModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        student={student}
        onSaveStudent={(updated) => setStudent(prev => ({ ...prev, ...updated }))}
        soundEnabled={settings.soundEnabled}
      />

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateModalOpen}
        onClose={() => setIsCertificateModalOpen(false)}
        student={student}
        soundEnabled={settings.soundEnabled}
      />

      {/* Floating Celebratory Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Floating Smart Python AI Assistant (Gemini) */}
      <PythonAiAssistant
        activeTab={activeLessonId ? 'path' : activeTab}
        activeLesson={activeLesson || null}
        activeBookChapter={BOOK_CHAPTERS.find(c => c.id === activeBookUnitId) || BOOK_CHAPTERS[0]}
        student={student}
        currentTheme={settings.theme}
        soundEnabled={settings.soundEnabled}
      />
    </div>
  );
}

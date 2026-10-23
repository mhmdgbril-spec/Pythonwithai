import React, { useState } from 'react';
import { StudentProfile } from '../types';
import { X, User, School, Award, Sparkles, Check } from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  onSaveStudent: (updated: Partial<StudentProfile>) => void;
  soundEnabled: boolean;
}

const AVATARS = ['👨‍💻', '👩‍💻', '🚀', '💡', '🧠', '🌟', '🏆', '🤖'];
const GRADES = [
  'الأول الثانوي — المسار العام',
  'الثاني الثانوي — مسار علوم الحاسب والهندسة',
  'الثاني الثانوي — مسار إدارة الأعمال',
  'الثالث الثانوي — مسار التقنية الرقمية المتقدم',
  'طالب حر / زائر شغوف'
];

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  student,
  onSaveStudent,
  soundEnabled
}) => {
  const [name, setName] = useState(student.name);
  const [grade, setGrade] = useState(student.grade);
  const [avatar, setAvatar] = useState(student.avatar);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    playSound('success', soundEnabled);
    onSaveStudent({
      name: name.trim() || 'طالب النخبة',
      grade,
      avatar
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <User className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                الملف الأكاديمي للطالب
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                مدارس النخبة العلمية الأهلية بالدمام · مادة التقنية الرقمية
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              playSound('click', soundEnabled);
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Avatar Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              اختر رمزك الأكاديمي (Avatar)
            </label>
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {AVATARS.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => {
                    playSound('click', soundEnabled);
                    setAvatar(av);
                  }}
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl transition ${
                    avatar === av
                      ? 'bg-emerald-500/20 border-2 border-emerald-500 scale-105'
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 border border-transparent'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              اسم الطالب الثلاثي (كما سيظهر في الشهادة المعتمدة)
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="مثال: عبدالله محمد الشمري"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </div>

          {/* Grade / Section */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              الصف والمرحلة الدراسية
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Stats Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-slate-400 text-[10px]">الدروس المنجزة</div>
              <div className="font-bold text-slate-800 dark:text-white mt-0.5">
                {student.completedLessons.length}
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">نقاط الخبرة</div>
              <div className="font-bold text-amber-500 mt-0.5">
                {student.xp} XP
              </div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">حالة الامتحان</div>
              <div className="font-bold text-emerald-500 mt-0.5">
                {student.examPassed ? 'مجتاز ✓' : 'لم يجتز بعد'}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                playSound('click', soundEnabled);
                onClose();
              }}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
            >
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

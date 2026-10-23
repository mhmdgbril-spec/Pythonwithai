import React, { useRef } from 'react';
import { StudentProfile } from '../types';
import { X, Printer, Award, CheckCircle2, School } from 'lucide-react';
import { playSound } from '../utils/sound';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  student: StudentProfile;
  soundEnabled: boolean;
}

export const CertificateModal: React.FC<Props> = ({
  isOpen,
  onClose,
  student,
  soundEnabled
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const score = student.examScore || 95;
  const issueDate = student.examDate || new Date().toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    playSound('click', soundEnabled);
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Modal Controls */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-sm text-slate-800 dark:text-white">
              شهادة الإنجاز المعتمدة
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ كـ PDF</span>
            </button>
            <button
              onClick={() => {
                playSound('click', soundEnabled);
                onClose();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
              aria-label="إغلاق الشهادة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-6 sm:p-10 bg-amber-50/30 dark:bg-slate-950 overflow-x-auto">
          <div 
            ref={certRef}
            className="relative min-w-[620px] p-8 sm:p-12 rounded-3xl bg-white text-slate-900 border-8 border-double border-amber-600/30 shadow-xl text-center space-y-6"
          >
            {/* Watermark Crest */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
              <School className="w-96 h-96 text-amber-900" />
            </div>

            {/* Header: School and Badge */}
            <div className="flex items-center justify-between border-b border-amber-600/20 pb-4">
              <div className="text-right">
                <div className="text-xs font-bold text-slate-600">المملكة العربية السعودية</div>
                <div className="text-xs text-slate-500">وزارة التعليم</div>
                <div className="text-xs font-black text-emerald-800">مدارس النخبة العلمية الأهلية بالدمام</div>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-500 text-white flex items-center justify-center font-black text-xl shadow-md border-2 border-amber-300">
                Hero
              </div>

              <div className="text-left text-xs text-slate-500">
                <div>الرقم الأكاديمي للشهادة:</div>
                <div className="font-mono font-bold text-slate-700">HERO-PY-{Math.floor(10000 + Math.random() * 90000)}</div>
                <div>تاريخ الإصدار: {issueDate}</div>
              </div>
            </div>

            {/* Certificate Title */}
            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold uppercase tracking-widest text-amber-700">
                HERO OF PYTHON · CERTIFICATE OF MASTERY
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                شهادة بطل بايثون (Hero of Python) المعتمدة
              </h2>
              <div className="w-32 h-1 bg-amber-500 mx-auto rounded-full" />
            </div>

            {/* Recipient statement */}
            <div className="space-y-4 py-4 max-w-xl mx-auto text-slate-700 text-sm leading-relaxed">
              <p>تشهد إدارة منصة Hero of Python التعليمية للتقنية الرقمية بأن الطالب المتميز:</p>
              <div className="text-2xl font-black text-emerald-800 border-b-2 border-emerald-600/30 pb-2 inline-block px-8">
                {student.name}
              </div>
              <p className="pt-2 text-xs text-slate-600">
                الصف الدراسي: <strong className="text-slate-800">{student.grade}</strong> — مدارس النخبة العلمية الأهلية بالدمام
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                قد أتم بنجاح متطلبات دراسة لغة بايثون والبرمجة وهندسة البرمجيات ومبادئ الذكاء الاصطناعي، واجتاز الامتحان الشامل النهائي بنسبة تفوق:
              </p>
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-amber-100/70 border border-amber-300 text-amber-900 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>النتيجة النهائية: {score}% (متميز مع مرتبة الشرف)</span>
              </div>
            </div>

            {/* Signatures */}
            <div className="pt-6 border-t border-amber-600/20 grid grid-cols-2 gap-8 text-center text-xs">
              <div className="space-y-1">
                <div className="text-slate-500">إشراف وتدريس:</div>
                <div className="text-base font-black text-slate-900">أ/ محمد جبريل</div>
                <div className="text-slate-600 font-medium">معلم التقنية الرقمية والحاسب الآلي</div>
                <div className="font-serif italic text-emerald-800 text-sm pt-1">Mohamed Gabriel</div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-500">الاعتماد المدرسي:</div>
                <div className="text-base font-black text-slate-900">مدارس النخبة العلمية الأهلية</div>
                <div className="text-slate-600 font-medium">الدمام · المملكة العربية السعودية</div>
                <div className="text-amber-700 text-xs font-bold pt-1">ختم الاعتماد الرقمي ✓</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 flex justify-end print:hidden">
          <button
            onClick={() => {
              playSound('click', soundEnabled);
              onClose();
            }}
            className="px-6 py-2.5 rounded-xl font-bold text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 transition"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};

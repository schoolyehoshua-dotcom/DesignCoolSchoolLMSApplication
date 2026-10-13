import { useState } from 'react';
import type { Assignment, Role } from '../types';
import { classes, assignments } from '../data';
import { useLanguage } from '../contexts/LanguageContext';
import { localize } from '../localization';

interface DashboardProps {
  currentClassId: string;
  role: Role;
}

function LiveClassBanner({ currentClassId, role }: { currentClassId: string; role: Role }) {
  const { language } = useLanguage();
  const he = language === 'he';
  const [joining, setJoining] = useState(false);
  const cls = classes.find(c => c.id === currentClassId)!;

  const handleJoin = () => {
    setJoining(true);
    setTimeout(() => setJoining(false), 3000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl p-6 md:p-8"
      style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #0EA5E9 100%)' }}>
      {/* Decorative blobs */}
      <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-20" style={{ background: '#fff' }} />
      <div className="absolute -bottom-12 -left-4 w-36 h-36 rounded-full opacity-10" style={{ background: '#fff' }} />

      <div className="relative z-20 flex flex-col xl:flex-row xl:items-center gap-5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-700"
              style={{ background: '#F43F5E', color: '#fff' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                {role === 'teacher'
                  ? (he ? 'מרכז השידור' : 'LIVE CLASS STUDIO')
                  : (he ? 'בשידור חי' : 'LIVE NOW')}
            </span>
            <span className="text-white/70 text-sm">{localize(cls.name, language)}</span>
          </div>
          <h2 className="font-display font-800 text-white text-2xl md:text-3xl leading-tight">
            {he ? 'העברה דרך קרום התא' : 'Cell Membrane Transport'}
          </h2>
          <p className="text-white/70 text-sm mt-1">
            {he ? 'עם ד״ר לוי · 42 תלמידים מחוברים · התחיל לפני 8 דקות' : 'with Dr. Levi · 42 students online · Started 8 min ago'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full xl:w-auto xl:min-w-max flex-shrink-0">
          <button onClick={handleJoin}
            className="flex items-center justify-center gap-2 w-full px-5 py-3 rounded-2xl font-display font-700 text-base transition-all hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            style={{ background: '#fff', color: '#7C3AED' }}>
            {joining ? (
              <>
                <span className="w-4 h-4 border-2 border-violet-300 border-t-violet-700 rounded-full animate-spin" />
                {role === 'teacher'
                  ? (he ? 'יוצרים את השיעור...' : 'Creating class...')
                  : (he ? 'נכנסים לשיעור...' : 'Entering class...')}
              </>
            ) : (
              <>
                {role === 'teacher' ? (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                )}
                {role === 'teacher'
                  ? (he ? 'יצירת שיעור חי' : 'Create Live Class')
                  : (he ? 'כניסה לשיעור' : 'Enter Live Class')}
              </>
            )}
          </button>

          <button className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-2xl font-700 text-sm transition-all hover:bg-white/10 whitespace-nowrap"
            style={{ border: '1.5px solid rgba(255,255,255,0.4)', color: '#fff' }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 8a3 3 0 010 8M17.657 5.657A8 8 0 0112 4a8 8 0 100 16 8 8 0 005.657-2.343"/>
            </svg>
            {he ? 'שיתוף הזמנה ב־QR' : 'Share QR Invite'}
          </button>
        </div>
      </div>

      {/* Jitsi attribution */}
      <div className="relative z-10 mt-4 flex items-center gap-1.5">
        <svg className="w-3.5 h-3.5 text-white/50" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
        <span className="text-white/50 text-xs">
          {he ? 'מופעל באמצעות Jitsi Meet · מוצפן מקצה לקצה' : 'Powered by Jitsi Meet · End-to-end encrypted'}
        </span>
      </div>
    </div>
  );
}

function AssignmentComposer({ onAdd, onClose, availableClasses }: {
  onAdd: (assignment: Assignment) => void;
  onClose: () => void;
  availableClasses: typeof classes;
}) {
  const { language } = useLanguage();
  const he = language === 'he';
  const [title, setTitle] = useState('');
  const [classId, setClassId] = useState(availableClasses[0].id);
  const [dueDate, setDueDate] = useState('2026-09-24');
  const [type, setType] = useState<Assignment['type']>('homework');

  const publish = () => {
    if (!title.trim()) return;
    onAdd({ id: `a-${Date.now()}`, title: title.trim(), classId, dueDate, type, weight: 0.6, submitted: false });
    onClose();
  };

  return (
    <div className="rounded-3xl p-5 mb-3 bg-card border border-primary/30">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-800">{he ? 'משימה חדשה להגשה' : 'New class assignment'}</h3>
          <p className="text-xs text-muted">{he ? 'פרסום ישירות לכיתה שאת/ה מלמד/ת' : 'Publish directly to one of your classes'}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-xl bg-surface" aria-label={he ? 'סגירה' : 'Close'}>×</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder={he ? 'שם המשימה' : 'Assignment title'}
          className="sm:col-span-2 px-3 py-2.5 rounded-xl border outline-none bg-surface border-border" />
        <select value={classId} onChange={e => setClassId(e.target.value)}
          className="px-3 py-2.5 rounded-xl border outline-none bg-surface border-border">
          {availableClasses.map(cls => <option key={cls.id} value={cls.id}>{localize(cls.name, language)}</option>)}
        </select>
        <select value={type} onChange={e => setType(e.target.value as Assignment['type'])}
          className="px-3 py-2.5 rounded-xl border outline-none bg-surface border-border">
          <option value="homework">{he ? 'שיעורי בית' : 'Homework'}</option>
          <option value="quiz">{he ? 'בוחן' : 'Quiz'}</option>
          <option value="exam">{he ? 'מבחן' : 'Exam'}</option>
          <option value="bagrut">{he ? 'בגרות' : 'Bagrut'}</option>
        </select>
        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
          className="px-3 py-2.5 rounded-xl border outline-none bg-surface border-border" />
        <button onClick={publish} disabled={!title.trim()}
          className="px-4 py-2.5 rounded-xl font-700 bg-primary text-primary-fg disabled:opacity-50">
          {he ? 'פרסום לכיתה' : 'Publish to class'}
        </button>
      </div>
    </div>
  );
}

function ClassCard({ cls, role }: { cls: typeof classes[0]; role: Role }) {
  const { language } = useLanguage();
  const he = language === 'he';
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3 transition-all hover:scale-[1.02] cursor-pointer"
      style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
      <div className="flex items-start justify-between">
        <div>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-800 text-base mb-2"
            style={{ background: cls.color }}>
            {localize(cls.subject, language)[0]}
          </div>
          <h3 className="font-display font-700 text-base leading-tight">{localize(cls.name, language)}</h3>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{localize(cls.teacher, language)}</p>
        </div>
        <span className="text-xs font-600 px-2 py-1 rounded-lg" style={{ background: cls.color + '20', color: cls.color }}>
          {localize(cls.subject, language)}
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span style={{ color: 'var(--muted)' }}>{he ? 'התקדמות' : 'Progress'}</span>
          <span className="font-700 font-mono" style={{ color: cls.color }}>{cls.progress}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${cls.progress}%`, background: cls.color }} />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--muted)' }}>
        <span>{cls.students} {he ? 'תלמידים' : 'students'}</span>
        <button className="font-700 hover:opacity-70 transition-all" style={{ color: 'var(--primary)' }}>
          {role === 'teacher' ? (he ? 'ניהול ←' : 'Manage →') : (he ? 'פתיחה ←' : 'Open →')}
        </button>
      </div>
    </div>
  );
}

function AssignmentCard({ a }: { a: typeof assignments[0] }) {
  const { language } = useLanguage();
  const he = language === 'he';
  const cls = classes.find(c => c.id === a.classId)!;
  const daysLeft = Math.ceil((new Date(a.dueDate).getTime() - Date.now()) / 86400000);
  const typeColors: Record<string, string> = {
    homework: '#7C3AED',
    exam: '#F43F5E',
    bagrut: '#F59E0B',
    quiz: '#3B82F6',
  };
  const typeLabels: Record<string, string> = {
    homework: he ? 'שיעורי בית' : 'Homework',
    exam: he ? 'מבחן' : 'Exam',
    bagrut: he ? 'בגרות' : 'Bagrut',
    quiz: he ? 'בוחן' : 'Quiz',
  };

  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl transition-all hover:opacity-80 cursor-pointer"
      style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
      <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
        style={{ background: typeColors[a.type] + '20' }}>
        <span className="text-lg">
          {a.type === 'homework' ? '📄' : a.type === 'exam' ? '📋' : a.type === 'bagrut' ? '🎓' : '⚡'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-700 text-sm truncate">{localize(a.title, language)}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs font-600 px-1.5 py-0.5 rounded-md" style={{ background: cls.color + '20', color: cls.color }}>
            {localize(cls.subject, language)}
          </span>
          <span className="text-xs" style={{ color: 'var(--muted)' }}>
            {new Date(a.dueDate).toLocaleDateString(he ? 'he-IL' : 'en-GB', { day: 'numeric', month: 'short' })}
          </span>
        </div>
      </div>
      <div className="flex-shrink-0 flex flex-col items-end gap-1">
        <span className="text-xs font-700 px-2 py-0.5 rounded-full"
          style={{ background: typeColors[a.type] + '20', color: typeColors[a.type] }}>
          {typeLabels[a.type]}
        </span>
        <span className="text-xs font-600" style={{ color: daysLeft <= 2 ? '#F43F5E' : 'var(--muted)' }}>
          {daysLeft <= 0 ? (he ? 'להגשה היום' : 'Due today') : (he ? `נותרו ${daysLeft} ימים` : `${daysLeft}d left`)}
        </span>
      </div>
    </div>
  );
}

function QuickStats({ role }: { role: Role }) {
  const { language } = useLanguage();
  const he = language === 'he';
  const stats = role === 'teacher'
    ? [
        { label: he ? 'הגשות ממתינות' : 'Pending Submissions', value: '14', icon: '📬', color: '#7C3AED' },
        { label: he ? 'ממוצע כיתתי' : 'Avg. Class Grade', value: '84%', icon: '📊', color: '#10B981' },
        { label: he ? 'תלמידים פעילים' : 'Active Students', value: '118', icon: '👥', color: '#3B82F6' },
        { label: he ? 'השלמת מסלול' : 'Path Completion', value: '62%', icon: '🎯', color: '#F59E0B' },
      ]
    : [
        { label: he ? 'נקודות XP' : 'XP Points', value: '1,240', icon: '⭐', color: '#F59E0B' },
        { label: he ? 'רצף נוכחי' : 'Current Streak', value: he ? '7 ימים' : '7 days', icon: '🔥', color: '#F43F5E' },
        { label: he ? 'ממוצע ציונים' : 'Avg. Grade', value: '87%', icon: '📈', color: '#10B981' },
        { label: he ? 'להגשה השבוע' : 'Due This Week', value: '4', icon: '📅', color: '#7C3AED' },
      ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map(s => (
        <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: s.color + '18' }}>
            {s.icon}
          </div>
          <div>
            <div className="font-display font-800 text-xl" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs font-500 leading-tight" style={{ color: 'var(--muted)' }}>{s.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ currentClassId, role }: DashboardProps) {
  const { language } = useLanguage();
  const he = language === 'he';
  const [teacherAssignments, setTeacherAssignments] = useState<Assignment[]>(assignments);
  const [showComposer, setShowComposer] = useState(false);
  const teacherClasses = classes.filter(cls => cls.teacher === 'Dr. Levi');
  const teacherClassIds = new Set(teacherClasses.map(cls => cls.id));
  const upcoming = teacherAssignments
    .filter(a => !a.submitted && (role !== 'teacher' || teacherClassIds.has(a.classId)))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5">
      <LiveClassBanner currentClassId={currentClassId} role={role} />
      <QuickStats role={role} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* My Classes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-800 text-lg">
              {role === 'teacher' ? (he ? 'הכיתות שאני מלמד/ת' : 'Classes I Teach') : (he ? 'הכיתות שלי' : 'My Classes')}
            </h2>
            <button className="text-sm font-700" style={{ color: 'var(--primary)' }}>{he ? 'הצגת הכול ←' : 'View all →'}</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(role === 'teacher' ? teacherClasses : classes).slice(0, 4).map(cls => (
              <ClassCard key={cls.id} cls={cls} role={role} />
            ))}
          </div>
        </div>

        {/* Upcoming */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-800 text-lg">
              {role === 'teacher' ? (he ? 'משימות לכיתות שלי' : 'Assignments for My Classes') : (he ? 'הגשות קרובות' : 'Upcoming Due')}
            </h2>
            {role === 'teacher' ? (
              <button onClick={() => setShowComposer(true)} className="text-sm font-700 px-3 py-1.5 rounded-xl bg-primary text-primary-fg">
                {he ? '+ הוספת משימה' : '+ Add assignment'}
              </button>
            ) : (
              <button className="text-sm font-700" style={{ color: 'var(--primary)' }}>{he ? 'לוח שנה ←' : 'Calendar →'}</button>
            )}
          </div>
          {role === 'teacher' && showComposer && (
            <AssignmentComposer
              onClose={() => setShowComposer(false)}
              onAdd={assignment => setTeacherAssignments(current => [assignment, ...current])}
              availableClasses={teacherClasses}
            />
          )}
          <div className="flex flex-col gap-2.5">
            {upcoming.map(a => (
              <AssignmentCard key={a.id} a={a} />
            ))}
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div>
        <h2 className="font-display font-800 text-lg mb-3">{he ? 'הודעות אחרונות' : 'Recent Announcements'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { author: he ? 'ד״ר לוי' : 'Dr. Levi', cls: he ? 'ביולוגיה י״א 1' : 'Biology 11A', time: he ? 'לפני שעתיים' : '2h ago', content: he ? 'אנא עברו על פרקים 4–5 לפני השיעור החי מחר. הבוחן על מעבר בקרום יכלול מנגנוני מעבר פעיל וסביל.' : 'Please review chapters 4-5 before our live session tomorrow. The membrane transport quiz will cover active and passive transport mechanisms.', color: '#10B981' },
            { author: he ? 'מר כהן' : 'Mr. Cohen', cls: he ? 'מתמטיקה י״א' : 'Mathematics 11', time: he ? 'לפני 4 שעות' : '4h ago', content: he ? 'מועד מבחן האמצע אושר: 22 בספטמבר. תרגול נוסף הועלה למסלול הלמידה. זכרו להשלים תחילה את כל 5 שלבי החימום.' : 'Mid-term exam date confirmed: September 22nd. Practice problems uploaded to the learning path. Remember to complete all 5 warmup nodes first.', color: '#7C3AED' },
          ].map((ann, i) => (
            <div key={i} className="rounded-2xl p-4" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg text-white font-display font-700 text-sm flex items-center justify-center"
                  style={{ background: ann.color }}>
                  {ann.author[0]}
                </div>
                <div>
                  <span className="text-sm font-700">{ann.author}</span>
                  <span className="text-xs ml-1.5" style={{ color: 'var(--muted)' }}>{ann.cls} · {ann.time}</span>
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{ann.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

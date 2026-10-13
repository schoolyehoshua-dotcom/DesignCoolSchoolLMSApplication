import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { localize } from '../localization';
import type { Role } from '../types';
import { assignments, classes } from '../data';

interface LibraryPath {
  id: string;
  topic: string;
  subject: string;
  target: string;
  nodes: number;
  completed: number;
  xp: number;
  color: string;
  emoji: string;
  createdAt: string;
}

const MOCK_PATHS: LibraryPath[] = [
  { id: 'p1', topic: 'WWII Operations', subject: 'History', target: 'Oct 1', nodes: 10, completed: 6, xp: 480, color: '#F59E0B', emoji: '🌍', createdAt: 'Sep 2' },
  { id: 'p2', topic: 'Quadratic Equations', subject: 'Math', target: 'Sep 25', nodes: 8, completed: 3, xp: 240, color: '#7C3AED', emoji: '📐', createdAt: 'Sep 5' },
  { id: 'p3', topic: 'Cell Membrane Biology', subject: 'Biology', target: 'Sep 20', nodes: 6, completed: 6, xp: 360, color: '#10B981', emoji: '🔬', createdAt: 'Sep 1' },
];

const SUBJECT_COLORS: Record<string, string> = {
  History: '#F59E0B',
  Math: '#7C3AED',
  Biology: '#10B981',
  Physics: '#3B82F6',
  Chemistry: '#F43F5E',
  English: '#8B5CF6',
  Geography: '#14B8A6',
  Art: '#EC4899',
};

const SUBJECT_EMOJIS: Record<string, string> = {
  History: '🌍',
  Math: '📐',
  Biology: '🔬',
  Physics: '⚛️',
  Chemistry: '🧪',
  English: '📚',
  Geography: '🗺️',
  Art: '🎨',
};

function PathCard({ path, onOpen }: { path: LibraryPath; onOpen: () => void }) {
  const { language } = useLanguage();
  const he = language === 'he';
  const progress = Math.round((path.completed / path.nodes) * 100);
  const isComplete = path.completed === path.nodes;

  return (
    <div className="rounded-3xl p-5 flex flex-col gap-4 transition-all hover:scale-[1.02] cursor-pointer"
      style={{ background: 'var(--card)', border: `1.5px solid ${isComplete ? path.color + '55' : 'var(--border)'}` }}
      onClick={onOpen}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl text-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: path.color + '20' }}>
            {path.emoji}
          </div>
          <div>
            <h3 className="font-display font-800 text-base leading-tight">{localize(path.topic, language)}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-700 px-2 py-0.5 rounded-full"
                style={{ background: path.color + '20', color: path.color }}>
                {localize(path.subject, language)}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted)' }}>🔒 {he ? 'פרטי' : 'Private'}</span>
            </div>
          </div>
        </div>
        {isComplete && (
          <span className="flex items-center gap-1 text-xs font-700 px-2 py-1 rounded-full"
            style={{ background: '#10B981' + '20', color: '#10B981' }}>
            ✓ {he ? 'הושלם' : 'Done'}
          </span>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span style={{ color: 'var(--muted)' }}>{path.completed}/{path.nodes} {he ? 'שלבים' : 'nodes'}</span>
          <span className="font-700" style={{ color: path.color }}>{progress}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: path.color }} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-600">
            <span>⭐</span>
            <span style={{ color: '#F59E0B' }}>{path.xp} XP</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-600" style={{ color: 'var(--muted)' }}>
            <span>🎯</span>
            <span>{he ? 'יעד' : 'Target'}: {localize(path.target, language)}</span>
          </div>
        </div>
        <button className="text-xs font-700 px-3 py-1.5 rounded-xl transition-all hover:opacity-80"
          style={{ background: 'var(--primary)', color: '#fff' }}>
          {isComplete ? (he ? 'חזרה' : 'Review') : (he ? 'המשך ←' : 'Continue →')}
        </button>
      </div>
    </div>
  );
}

function GeneratorModal({ onClose, onGenerate }: { onClose: () => void; onGenerate: (p: LibraryPath) => void }) {
  const { language } = useLanguage();
  const he = language === 'he';
  const [topic, setTopic] = useState('');
  const [subject, setSubject] = useState('History');
  const [target, setTarget] = useState('');
  const [difficulty, setDifficulty] = useState('Adaptive');
  const [generating, setGenerating] = useState(false);

  const handleGenerate = () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setTimeout(() => {
      const color = SUBJECT_COLORS[subject] || '#7C3AED';
      onGenerate({
        id: `p${Date.now()}`,
        topic: topic.trim(),
        subject,
        target: target || 'Open-ended',
        nodes: 8,
        completed: 0,
        xp: 0,
        color,
        emoji: SUBJECT_EMOJIS[subject] || '📚',
        createdAt: 'Today',
      });
      setGenerating(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-3xl p-6 shadow-2xl"
        style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'var(--primary)' + '20' }}>🤖</div>
            <div>
              <h2 className="font-display font-800 text-xl">{he ? 'מחולל מסלולים עם AI' : 'AI Path Generator'}</h2>
              <p className="text-xs" style={{ color: 'var(--muted)' }}>{he ? 'פרטי · גלוי רק לך' : 'Private · Only visible to you'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center hover:opacity-70 transition-all"
            style={{ background: 'var(--surface)' }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--muted)' }}>{he ? 'נושא *' : 'Topic *'}</label>
            <input type="text" value={topic} onChange={e => setTopic(e.target.value)}
              placeholder={he ? 'לדוגמה: מלחמת העולם השנייה, נגזרות, יצירות שייקספיר...' : 'e.g. WWII Operations, Calculus derivatives, Shakespearean themes...'}
              className="w-full px-4 py-3 rounded-2xl text-sm border outline-none focus:ring-2 transition-all"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--muted)' }}>{he ? 'מקצוע' : 'Subject'}</label>
              <select value={subject} onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-3 rounded-2xl text-sm border outline-none"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                {Object.keys(SUBJECT_COLORS).map(s => <option key={s} value={s}>{localize(s, language)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--muted)' }}>{he ? 'רמת קושי' : 'Difficulty'}</label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}
                className="w-full px-3 py-3 rounded-2xl text-sm border outline-none"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                <option value="Adaptive">{he ? 'מותאמת אישית' : 'Adaptive'}</option>
                <option value="Easy">{he ? 'קלה' : 'Easy'}</option>
                <option value="Medium">{he ? 'בינונית' : 'Medium'}</option>
                <option value="Hard">{he ? 'קשה' : 'Hard'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--muted)' }}>{he ? 'יעד להשלמה (לא חובה)' : 'Completion Target (optional)'}</label>
            <input type="text" value={target} onChange={e => setTarget(e.target.value)}
              placeholder={he ? 'לדוגמה: 15 באוקטובר, לפני המבחן הבא...' : 'e.g. October 15, Before next exam...'}
              className="w-full px-4 py-3 rounded-2xl text-sm border outline-none focus:ring-2 transition-all"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} />
          </div>

          {/* Preview tags */}
          <div className="p-3 rounded-2xl" style={{ background: 'var(--surface)' }}>
            <p className="text-xs font-600 mb-2" style={{ color: 'var(--muted)' }}>{he ? 'ה־AI ייצור:' : 'AI will generate:'}</p>
            <div className="flex flex-wrap gap-2">
              {(he
                ? ['📖 שלבי שיעור', '⚡ שלבי בוחן', '🏁 נקודות ביקורת', '🏆 אתגר מסכם', '⭐ תגמולי XP']
                : ['📖 Lesson nodes', '⚡ Quiz nodes', '🏁 Checkpoints', '🏆 Boss challenge', '⭐ XP rewards']).map(tag => (
                <span key={tag} className="text-xs font-600 px-2 py-1 rounded-lg"
                  style={{ background: 'var(--card)', color: 'var(--muted)' }}>{tag}</span>
              ))}
            </div>
          </div>

          <button onClick={handleGenerate} disabled={!topic.trim() || generating}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-display font-700 text-base transition-all hover:opacity-80 disabled:opacity-50"
            style={{ background: 'var(--primary)', color: '#fff' }}>
            {generating ? (
              <><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {he ? 'יוצרים את המסלול שלך...' : 'Generating your path...'}</>
            ) : (
              <><span>✨</span> {he ? 'יצירת המסלול הפרטי שלי' : 'Generate My Private Path'}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function TeacherAssignmentLibrary() {
  const { language } = useLanguage();
  const he = language === 'he';
  const [classFilter, setClassFilter] = useState('all');
  const teacherClasses = classes.filter(cls => cls.teacher === 'Dr. Levi');
  const teacherClassIds = new Set(teacherClasses.map(cls => cls.id));
  const visibleAssignments = assignments.filter(a =>
    teacherClassIds.has(a.classId) && (classFilter === 'all' || a.classId === classFilter)
  );

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-display font-800 text-2xl">{he ? 'ספריית המטלות שלי' : 'My Assignment Library'}</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {he ? 'כל העבודות שפרסמת, מסודרות לפי הכיתות שאת/ה מלמד/ת.' : 'Browse every assignment you published, organized by the classes you teach.'}
          </p>
        </div>
        <select value={classFilter} onChange={e => setClassFilter(e.target.value)}
          className="px-4 py-2.5 rounded-2xl text-sm font-700 border outline-none"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }}>
          <option value="all">{he ? 'כל הכיתות שאני מלמד/ת' : 'All classes I teach'}</option>
          {teacherClasses.map(cls => <option key={cls.id} value={cls.id}>{localize(cls.name, language)}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          { label: he ? 'מטלות שפורסמו' : 'Published', value: visibleAssignments.length, color: 'var(--primary)' },
          { label: he ? 'כיתות פעילות' : 'Active classes', value: teacherClasses.length, color: 'var(--accent)' },
          { label: he ? 'ממתינות לבדיקה' : 'Awaiting review', value: 14, color: '#F59E0B' },
        ].map(stat => (
          <div key={stat.label} className="rounded-2xl p-4 bg-card border border-border">
            <div className="font-display font-800 text-2xl" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs font-600 text-muted">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl overflow-hidden bg-card border border-border">
        <div className="p-5 border-b border-border">
          <h2 className="font-display font-800 text-lg">{he ? 'עבודות שנתתי לתלמידים' : 'Assignments given to students'}</h2>
        </div>
        <div className="divide-y divide-border">
          {visibleAssignments.map(assignment => {
            const cls = classes.find(item => item.id === assignment.classId)!;
            const submittedCount = assignment.submitted ? Math.round(cls.students * 0.86) : Math.round(cls.students * 0.57);
            return (
              <div key={assignment.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center font-display font-800 text-white"
                  style={{ background: cls.color }}>
                  {localize(cls.subject, language)[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-700">{localize(assignment.title, language)}</div>
                  <div className="text-xs text-muted mt-1">
                    {localize(cls.name, language)} · {he ? 'עד' : 'Due'} {new Date(assignment.dueDate).toLocaleDateString(he ? 'he-IL' : 'en-GB')}
                  </div>
                </div>
                <div className="sm:w-44">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-muted">{he ? 'הוגשו' : 'Submitted'}</span>
                    <span className="font-700">{submittedCount}/{cls.students}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden bg-surface">
                    <div className="h-full rounded-full" style={{ width: `${submittedCount / cls.students * 100}%`, background: cls.color }} />
                  </div>
                </div>
                <button className="px-3 py-2 rounded-xl text-sm font-700 bg-primary/10 text-primary">
                  {he ? 'פתיחת המטלה' : 'Open assignment'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function StudentLibrary({ role }: { role: Role }) {
  const { language } = useLanguage();
  const he = language === 'he';
  const [paths, setPaths] = useState<LibraryPath[]>(MOCK_PATHS);
  const [showGenerator, setShowGenerator] = useState(false);
  const [activePathId, setActivePathId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const totalXP = paths.reduce((s, p) => s + p.xp, 0);
  const completedPaths = paths.filter(p => p.completed === p.nodes).length;

  const filtered = paths.filter(p =>
    p.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (role === 'teacher') return <TeacherAssignmentLibrary />;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-800 text-2xl">{he ? '📚 הספרייה הפרטית שלי' : '📚 My Private Library'}</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{he ? 'מסלולי הלמידה האישיים שלך שנוצרו בעזרת AI · פרטיים לחלוטין' : 'Your personal AI-generated learning paths · Fully private from classmates'}</p>
        </div>
        <button onClick={() => setShowGenerator(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-display font-700 text-sm transition-all hover:opacity-80"
          style={{ background: 'var(--primary)', color: '#fff' }}>
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
          {he ? 'מסלול חדש' : 'New Path'}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: he ? 'סך המסלולים' : 'Total Paths', value: paths.length, icon: '🗺️', color: '#7C3AED' },
          { label: he ? 'הושלמו' : 'Completed', value: completedPaths, icon: '✅', color: '#10B981' },
          { label: he ? 'סך XP' : 'Total XP', value: totalXP.toLocaleString(), icon: '⭐', color: '#F59E0B' },
        ].map(s => (
          <div key={s.label} className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
            <span className="text-2xl">{s.icon}</span>
            <div>
              <div className="font-display font-800 text-xl" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs font-500" style={{ color: 'var(--muted)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--muted)' }}>
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          placeholder={he ? 'חיפוש במסלולים שלך...' : 'Search your paths...'}
          className="w-full pl-11 pr-4 py-3 rounded-2xl text-sm border outline-none focus:ring-2 transition-all"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--text)' }} />
      </div>

      {/* Path grid */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <span className="text-5xl">🔍</span>
          <p className="text-sm font-600" style={{ color: 'var(--muted)' }}>{he ? 'לא נמצאו מסלולים מתאימים' : 'No paths match your search'}</p>
          <button onClick={() => setSearchQuery('')} className="text-sm font-700" style={{ color: 'var(--primary)' }}>{he ? 'ניקוי החיפוש' : 'Clear search'}</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(path => (
            <PathCard key={path.id} path={path} onOpen={() => setActivePathId(path.id)} />
          ))}

          {/* Create new path CTA card */}
          <button onClick={() => setShowGenerator(true)}
            className="rounded-3xl p-5 flex flex-col items-center justify-center gap-3 transition-all hover:opacity-80 border-dashed border-2 min-h-48"
            style={{ borderColor: 'var(--border)', background: 'transparent' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'var(--surface)' }}>✨</div>
            <div className="text-center">
              <div className="font-display font-700 text-base">{he ? 'יצירת מסלול חדש' : 'Create New Path'}</div>
              <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{he ? 'מבוסס AI · בכל נושא · פרטי' : 'AI-powered · Any topic · Private'}</div>
            </div>
          </button>
        </div>
      )}

      {/* Privacy notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl" style={{ background: 'var(--surface)' }}>
        <span className="text-lg">🔒</span>
        <div>
          <p className="text-sm font-700">{he ? 'המסלולים שלך פרטיים לחלוטין' : 'Your paths are completely private'}</p>
          <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>
            {he ? 'מסלולי הלמידה האישיים שלך אינם גלויים לתלמידים או למורים. זהו מרחב הלימוד הפרטי שלך.' : 'Your personal learning paths are never visible to classmates or teachers. This is your private study workspace.'}
          </p>
        </div>
      </div>

      {showGenerator && (
        <GeneratorModal
          onClose={() => setShowGenerator(false)}
          onGenerate={p => setPaths(prev => [p, ...prev])}
        />
      )}
    </div>
  );
}

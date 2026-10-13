import { useState } from 'react';
import type { Role } from '../types';
import { bioPathNodes, classes } from '../data';
import { useLanguage } from '../contexts/LanguageContext';
import { localize } from '../localization';

interface LearningPathProps {
  role: Role;
  currentClassId: string;
}

const NODE_COLORS = {
  completed: { bg: '#10B981', border: '#059669', text: '#fff' },
  current: { bg: '#7C3AED', border: '#6D28D9', text: '#fff' },
  locked: { bg: 'var(--surface)', border: 'var(--border)', text: 'var(--muted)' },
};

const NODE_ICONS: Record<string, string> = {
  lesson: '📖',
  quiz: '⚡',
  boss: '🏆',
  checkpoint: '🏁',
};

const NODE_TYPE_LABELS_HE: Record<string, string> = {
  lesson: 'שיעור',
  quiz: 'בוחן',
  boss: 'אתגר מסכם',
  checkpoint: 'נקודת ביקורת',
};

function NodeMap({ nodes, xpTotal }: { nodes: typeof bioPathNodes; xpTotal: number }) {
  const { language } = useLanguage();
  const he = language === 'he';
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const earned = nodes.filter(n => n.status === 'completed').reduce((s, n) => s + n.xp, 0);
  const possible = nodes.reduce((s, n) => s + n.xp, 0);

  return (
    <div className="flex flex-col items-center gap-6">
      {/* XP Bar */}
      <div className="w-full max-w-md rounded-2xl p-4" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>
            <span className="font-display font-700 text-sm">{he ? 'התקדמות XP' : 'XP Progress'}</span>
          </div>
          <span className="font-mono font-700 text-sm" style={{ color: '#F59E0B' }}>{earned} / {possible} XP</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
          <div className="h-full rounded-full xp-bar-fill" style={{
            width: `${(earned / possible) * 100}%`,
            background: 'linear-gradient(90deg, #F59E0B, #FBBF24)',
            ['--xp-width' as string]: `${(earned / possible) * 100}%`,
          }} />
        </div>
      </div>

      {/* SVG Node Map */}
      <div className="w-full max-w-sm relative" style={{ height: '520px' }}>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100" preserveAspectRatio="xMidYMid meet">
          {/* Draw connecting lines */}
          {nodes.map((node, i) => {
            if (i === 0) return null;
            const prev = nodes[i - 1];
            return (
              <line key={`line-${i}`}
                x1={`${prev.x}%`} y1={`${prev.y}%`}
                x2={`${node.x}%`} y2={`${node.y}%`}
                stroke={node.status === 'locked' ? 'var(--border)' : node.status === 'current' ? '#7C3AED' : '#10B981'}
                strokeWidth="2"
                strokeDasharray={node.status === 'locked' ? '4 3' : 'none'}
                strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Nodes as HTML elements */}
        {nodes.map(node => {
          const colors = NODE_COLORS[node.status];
          const isHovered = hoveredNode === node.id;
          const isCurrent = node.status === 'current';

          return (
            <div key={node.id}
              className="absolute flex flex-col items-center gap-1 cursor-pointer"
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: isCurrent ? 10 : 5,
              }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}>

              {/* Pulse ring for current node */}
              {isCurrent && (
                <div className="absolute rounded-full"
                  style={{
                    inset: '-8px',
                    background: '#7C3AED33',
                    animation: 'pulse-ring 1.8s ease-out infinite',
                  }} />
              )}

              {/* Node circle */}
              <div className="w-14 h-14 rounded-full flex items-center justify-center transition-all text-2xl"
                style={{
                  background: colors.bg,
                  border: `3px solid ${colors.border}`,
                  transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                  boxShadow: isCurrent ? `0 0 20px ${colors.bg}66` : 'none',
                  opacity: node.status === 'locked' ? 0.5 : 1,
                }}>
                {node.status === 'locked'
                  ? <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                  : NODE_ICONS[node.type]
                }
              </div>

              {/* Label */}
              <div className="text-center px-2 py-0.5 rounded-lg text-xs font-700 whitespace-nowrap"
                style={{
                  background: 'var(--card)',
                  color: node.status === 'locked' ? 'var(--muted)' : 'var(--text)',
                  border: '1px solid var(--border)',
                  maxWidth: '80px',
                  fontSize: '10px',
                  lineHeight: '1.3',
                }}>
                {localize(node.title, language)}
              </div>

              {/* XP badge */}
              {node.status !== 'locked' && (
                <div className="text-xs font-mono font-700 px-1.5 py-0.5 rounded-full"
                  style={{ background: '#F59E0B20', color: '#F59E0B', fontSize: '9px' }}>
                  +{node.xp} XP
                </div>
              )}

              {/* Hover tooltip */}
              {isHovered && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 rounded-xl px-3 py-2 text-xs shadow-xl whitespace-nowrap z-20"
                  style={{ background: 'var(--text)', color: 'var(--card)' }}>
                  <div className="font-700">{localize(node.title, language)}</div>
                  <div className="opacity-70">
                    {he
                      ? NODE_TYPE_LABELS_HE[node.type]
                      : node.type} · {node.xp} XP
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TeacherPathEditor() {
  const { language } = useLanguage();
  const he = language === 'he';
  const teacherClasses = classes.filter(cls => cls.teacher === 'Dr. Levi');
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [audienceType, setAudienceType] = useState<'class' | 'grade'>('class');
  const [audience, setAudience] = useState(teacherClasses[0].id);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => { setGenerating(false); setGenerated(true); }, 2000);
  };

  return (
    <div className="rounded-3xl p-6" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
          style={{ background: 'var(--primary)' + '20' }}>🤖</div>
        <div>
          <h3 className="font-display font-700 text-base">{he ? 'מחולל מסלולים עם AI' : 'AI Path Generator'}</h3>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>{he ? 'יצירת מסלול למידה אינטראקטיבי מתוך הסילבוס' : 'Generate an interactive learning path from your syllabus'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 rounded-2xl bg-surface">
        <div>
          <label className="block text-xs font-700 mb-1.5 text-muted">{he ? 'פרסום עבור' : 'Publish for'}</label>
          <select value={audienceType} onChange={e => {
            const nextType = e.target.value as 'class' | 'grade';
            setAudienceType(nextType);
            setAudience(nextType === 'class' ? teacherClasses[0].id : '11');
          }} className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none bg-card border-border">
            <option value="class">{he ? 'כיתה שאני מלמד/ת' : 'A class I teach'}</option>
            <option value="grade">{he ? 'שכבה' : 'Grade level'}</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-700 mb-1.5 text-muted">
            {audienceType === 'class' ? (he ? 'בחירת כיתה' : 'Choose class') : (he ? 'בחירת שכבה' : 'Choose grade')}
          </label>
          <select value={audience} onChange={e => setAudience(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none bg-card border-border">
            {audienceType === 'class'
              ? teacherClasses.map(cls => <option key={cls.id} value={cls.id}>{localize(cls.name, language)}</option>)
              : ['9', '10', '11', '12'].map(grade => <option key={grade} value={grade}>{he ? `שכבה ${grade}` : `Grade ${grade}`}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[
          { label: he ? 'נושא בסילבוס' : 'Syllabus Topic', placeholder: he ? 'לדוגמה: ביולוגיה של התא, יחידה 2' : 'e.g. Cell Biology Unit 2', type: 'text' },
          { label: he ? 'מסגרת זמן' : 'Timeframe', placeholder: he ? 'לדוגמה: שבועיים' : 'e.g. 2 weeks', type: 'text' },
          { label: he ? 'רמת קושי' : 'Difficulty', placeholder: he ? 'מותאמת אישית' : 'Adaptive', type: 'select' },
        ].map(field => (
          <div key={field.label}>
            <label className="block text-xs font-700 mb-1.5" style={{ color: 'var(--muted)' }}>{field.label}</label>
            {field.type === 'select' ? (
              <select className="w-full px-3 py-2 rounded-xl text-sm border outline-none"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }}>
                <option>{he ? 'מותאמת אישית' : 'Adaptive'}</option>
                <option>{he ? 'מתחילים' : 'Beginner'}</option>
                <option>{he ? 'בינונית' : 'Intermediate'}</option>
                <option>{he ? 'מתקדמת' : 'Advanced'}</option>
              </select>
            ) : (
              <input type="text" placeholder={field.placeholder}
                className="w-full px-3 py-2 rounded-xl text-sm border outline-none focus:ring-2 transition-all"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--text)' }} />
            )}
          </div>
        ))}
      </div>

      <button onClick={handleGenerate}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-700 text-sm transition-all hover:opacity-80"
        style={{ background: 'var(--primary)', color: '#fff' }}>
        {generating ? (
          <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {he ? 'יוצרים בעזרת AI...' : 'Generating with AI...'}</>
        ) : (
          <><span>✨</span> {he ? 'יצירת מסלול AI' : 'Generate AI Path'}</>
        )}
      </button>

      {generated && (
        <div className="mt-4 p-3 rounded-xl text-sm"
          style={{ background: '#10B981' + '15', border: '1px solid #10B981' + '40', color: '#10B981' }}>
          {he
            ? `המסלול נוצר ופורסם עבור ${audienceType === 'class' ? localize(teacherClasses.find(cls => cls.id === audience)?.name || '', language) : `שכבה ${audience}`}. נוספו 8 שלבים למשך שבועיים.`
            : `Path generated and published to ${audienceType === 'class' ? teacherClasses.find(cls => cls.id === audience)?.name : `Grade ${audience}`}. 8 nodes were added for two weeks.`}
        </div>
      )}
    </div>
  );
}

const STUDENT_PROGRESS = [
  { name: 'Noa Ben-David', node: 6, progress: 74, state: 'active' },
  { name: 'Yosef Avraham', node: 4, progress: 48, state: 'active' },
  { name: 'Maya Goldstein', node: 8, progress: 100, state: 'done' },
  { name: 'Lior Cohen', node: 3, progress: 31, state: 'needs-help' },
  { name: 'Tamar Levy', node: 5, progress: 62, state: 'active' },
  { name: 'Eitan Mizrahi', node: 2, progress: 18, state: 'needs-help' },
];

function TeacherProgressTracker() {
  const { language } = useLanguage();
  const he = language === 'he';
  const [filter, setFilter] = useState<'all' | 'active' | 'needs-help' | 'done'>('all');
  const visible = STUDENT_PROGRESS.filter(student => filter === 'all' || student.state === filter);

  return (
    <div className="rounded-3xl p-5 bg-card border border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h2 className="font-display font-800 text-lg">{he ? 'איפה כל תלמיד נמצא במסלול' : 'Student position in the path'}</h2>
          <p className="text-xs text-muted mt-1">{he ? 'מעקב חי לפי השלב האחרון שכל תלמיד פתח' : 'Live view based on the last node each student opened'}</p>
        </div>
        <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-surface">
          {([
            ['all', he ? 'כולם' : 'All'],
            ['active', he ? 'פעילים' : 'Active'],
            ['needs-help', he ? 'צריכים עזרה' : 'Needs help'],
            ['done', he ? 'סיימו' : 'Done'],
          ] as const).map(([value, label]) => (
            <button key={value} onClick={() => setFilter(value)}
              className="px-3 py-1.5 rounded-lg text-xs font-700 transition-all"
              style={{ background: filter === value ? 'var(--card)' : 'transparent', color: filter === value ? 'var(--primary)' : 'var(--muted)' }}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((student, index) => {
          const node = bioPathNodes[Math.max(0, student.node - 1)];
          const color = student.state === 'done' ? '#10B981' : student.state === 'needs-help' ? '#F59E0B' : '#7C3AED';
          return (
            <div key={student.name} className="p-3 rounded-2xl bg-surface">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-800"
                  style={{ background: `hsl(${index * 43 + 210}, 60%, 50%)` }}>
                  {localize(student.name, language).split(/[\s־-]/).map(part => part[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-700 truncate">{localize(student.name, language)}</span>
                    <span className="font-mono text-xs font-700" style={{ color }}>{student.progress}%</span>
                  </div>
                  <div className="text-xs text-muted truncate">
                    {he ? `שלב ${student.node}: ` : `Node ${student.node}: `}{localize(node.title, language)}
                  </div>
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden bg-card mt-3">
                <div className="h-full rounded-full" style={{ width: `${student.progress}%`, background: color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function LearningPath({ role, currentClassId }: LearningPathProps) {
  const { language } = useLanguage();
  const he = language === 'he';
  const cls = classes.find(c => c.id === currentClassId)!;
  const completedCount = bioPathNodes.filter(n => n.status === 'completed').length;

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-800 text-2xl">{he ? '🗺️ מסלול למידה' : '🗺️ Learning Path'}</h1>
          <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{localize(cls.name, language)} · {he ? 'מסלול סילבוס שנוצר בעזרת AI' : 'AI-Generated Syllabus Path'}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl"
          style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <span className="text-lg">🏆</span>
          <div>
            <div className="font-display font-700 text-sm">{completedCount}/{bioPathNodes.length} {he ? 'הושלמו' : 'Complete'}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>{he ? 'מסלול ביולוגיה' : 'Biology Path'}</div>
          </div>
        </div>
      </div>

      {role === 'teacher' && <TeacherPathEditor />}
      {role === 'teacher' && <TeacherProgressTracker />}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Node Map */}
        <div className="lg:col-span-2 rounded-3xl p-6" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
          <h2 className="font-display font-700 text-base mb-4">
            {role === 'teacher' ? (he ? 'תצוגה מקדימה של המסלול הכיתתי' : 'Class Path Preview') : (he ? 'המסע שלך' : 'Your Journey')}
          </h2>
          <NodeMap nodes={bioPathNodes} xpTotal={1240} />
        </div>

        {/* Legend + Stats */}
        <div className="flex flex-col gap-4">
          {/* Node legend */}
          <div className="rounded-3xl p-5" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
            <h3 className="font-display font-700 text-sm mb-3">{he ? 'סוגי שלבים' : 'Node Types'}</h3>
            {Object.entries(NODE_ICONS).map(([type, icon]) => (
              <div key={type} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid var(--border)' }}>
                <span className="text-xl">{icon}</span>
                <div>
                  <div className="text-sm font-700 capitalize">
                    {he ? NODE_TYPE_LABELS_HE[type] : type}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>
                    {type === 'lesson' ? (he ? 'תוכן הלימוד המרכזי' : 'Core learning content') :
                     type === 'quiz' ? (he ? 'בדיקת ידע' : 'Knowledge check') :
                     type === 'boss' ? (he ? 'אתגר סיום היחידה' : 'Unit final challenge') :
                     (he ? 'סקירת אבן דרך' : 'Milestone review')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status legend */}
          <div className="rounded-3xl p-5" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
            <h3 className="font-display font-700 text-sm mb-3">{he ? 'סטטוס' : 'Status'}</h3>
            {[
              { status: 'completed', label: he ? 'הושלם' : 'Completed', color: '#10B981' },
              { status: 'current', label: he ? 'בתהליך' : 'In Progress', color: '#7C3AED' },
              { status: 'locked', label: he ? 'נעול' : 'Locked', color: 'var(--muted)' },
            ].map(s => (
              <div key={s.status} className="flex items-center gap-3 py-2">
                <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ background: s.color + '33', border: `2px solid ${s.color}` }} />
                <span className="text-sm font-600" style={{ color: s.status === 'locked' ? 'var(--muted)' : 'var(--text)' }}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Streak */}
          {role === 'student' && (
            <div className="rounded-3xl p-5" style={{ background: 'linear-gradient(135deg, #F59E0B22, #F43F5E11)', border: '1.5px solid #F59E0B33' }}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔥</span>
                <div>
                  <div className="font-display font-800 text-2xl" style={{ color: '#F59E0B' }}>7</div>
                  <div className="text-sm font-600" style={{ color: 'var(--muted)' }}>{he ? 'ימי רצף! המשיכו כך!' : 'Day streak! Keep going!'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

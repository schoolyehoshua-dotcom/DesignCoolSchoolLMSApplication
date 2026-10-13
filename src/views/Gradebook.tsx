import { useState } from 'react';
import type { Role } from '../types';
import { classes, studentGrades, gradeWeights } from '../data';
import { useLanguage } from '../contexts/LanguageContext';
import { localize } from '../localization';

interface GradebookProps {
  role: Role;
  currentClassId: string;
}

function WeightSlider({ label, color, value, onChange }: {
  label: string; color: string; value: number; onChange: (v: number) => void
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-700">{label}</span>
        <span className="font-mono font-700 text-sm" style={{ color }}>{Math.round(value * 100)}%</span>
      </div>
      <div className="relative h-3 rounded-full" style={{ background: 'var(--surface)' }}>
        <div className="absolute left-0 top-0 h-full rounded-full transition-all" style={{ width: `${value * 100}%`, background: color }} />
        <input type="range" min={0} max={100} value={Math.round(value * 100)}
          onChange={e => onChange(parseInt(e.target.value) / 100)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
        <div className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-lg transition-all"
          style={{ left: `calc(${value * 100}% - 10px)`, background: color }} />
      </div>
    </div>
  );
}

function TeacherView({ currentClassId }: { currentClassId: string }) {
  const { language } = useLanguage();
  const he = language === 'he';
  const [weights, setWeights] = useState({ exam: 0.2, participation: 0.2, assignments: 0.6 });
  const cls = classes.find(c => c.id === currentClassId)!;

  const total = weights.exam + weights.participation + weights.assignments;
  const balanced = Math.abs(total - 1) < 0.01;

  const studentRows = [
    { name: 'Noa Ben-David', exam: 82, participation: 90, assignments: 88 },
    { name: 'Yosef Avraham', exam: 75, participation: 78, assignments: 72 },
    { name: 'Maya Goldstein', exam: 94, participation: 95, assignments: 97 },
    { name: 'Lior Cohen', exam: 68, participation: 65, assignments: 71 },
    { name: 'Tamar Levy', exam: 88, participation: 82, assignments: 85 },
    { name: 'Eitan Mizrahi', exam: 79, participation: 88, assignments: 83 },
  ];

  const calcFinal = (row: typeof studentRows[0]) =>
    Math.round(row.exam * weights.exam + row.participation * weights.participation + row.assignments * weights.assignments);

  return (
    <div className="flex flex-col gap-5">
      {/* Weight Setup Panel */}
      <div className="rounded-3xl p-6" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-display font-800 text-xl">{he ? 'הגדרת משקלי ציון' : 'Grade Weight Setup'}</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>{localize(cls.name, language)} · {localize(cls.teacher, language)}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-700 ${balanced ? '' : 'opacity-60'}`}
              style={{ background: balanced ? '#10B981' + '20' : '#F43F5E' + '20', color: balanced ? '#10B981' : '#F43F5E' }}>
              {balanced ? (
                <><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7"/></svg> {he ? 'מאוזן' : 'Balanced'}</>
              ) : (
                <><span>⚠️</span> {Math.round(total * 100)}% {he ? 'בסך הכול' : 'total'}</>
              )}
            </div>
            <button className="px-4 py-1.5 rounded-xl text-sm font-700 transition-all hover:opacity-80"
              style={{ background: 'var(--primary)', color: '#fff' }}>
              {he ? 'שמירה' : 'Save'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <WeightSlider label={he ? '📋 מבחנים' : '📋 Exams'} color="#F43F5E" value={weights.exam}
            onChange={v => setWeights(w => ({ ...w, exam: v }))} />
          <WeightSlider label={he ? '🙋 השתתפות' : '🙋 Participation'} color="#3B82F6" value={weights.participation}
            onChange={v => setWeights(w => ({ ...w, participation: v }))} />
          <WeightSlider label={he ? '📄 מטלות' : '📄 Assignments'} color="#7C3AED" value={weights.assignments}
            onChange={v => setWeights(w => ({ ...w, assignments: v }))} />
        </div>

        {/* Visual weight bar */}
        <div className="mt-5 h-4 rounded-full overflow-hidden flex">
          <div className="h-full transition-all" style={{ width: `${weights.exam * 100}%`, background: '#F43F5E' }} />
          <div className="h-full transition-all" style={{ width: `${weights.participation * 100}%`, background: '#3B82F6' }} />
          <div className="h-full transition-all" style={{ width: `${weights.assignments * 100}%`, background: '#7C3AED' }} />
        </div>
        <div className="flex gap-4 mt-2">
          {[
            ['#F43F5E', he ? 'מבחנים' : 'Exams'],
            ['#3B82F6', he ? 'השתתפות' : 'Participation'],
            ['#7C3AED', he ? 'מטלות' : 'Assignments'],
          ].map(([color, label]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
              <span className="text-xs font-500" style={{ color: 'var(--muted)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Grade Table */}
      <div className="rounded-3xl overflow-hidden" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
        <div className="p-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="font-display font-800 text-xl">{he ? 'ציוני תלמידים' : 'Student Grades'}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'var(--surface)' }}>
                {(he
                  ? ['תלמיד/ה', 'מבחנים (20%)', 'השתתפות (20%)', 'מטלות (60%)', 'ציון סופי', 'פעולה']
                  : ['Student', 'Exams (20%)', 'Participation (20%)', 'Assignments (60%)', 'Final Grade', 'Action']).map(h => (
                  <th key={h} className="text-start px-4 py-3 text-xs font-700" style={{ color: 'var(--muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {studentRows.map((row, i) => {
                const final = calcFinal(row);
                const gradeColor = final >= 90 ? '#10B981' : final >= 75 ? '#3B82F6' : final >= 60 ? '#F59E0B' : '#F43F5E';
                return (
                  <tr key={i} className="transition-all hover:opacity-80" style={{ borderTop: '1px solid var(--border)' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg font-display font-700 text-xs flex items-center justify-center text-white flex-shrink-0"
                          style={{ background: `hsl(${i * 47 + 200}, 60%, 50%)` }}>
                          {localize(row.name, language).split(/[\s־-]/).map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <span className="font-600 text-sm">{localize(row.name, language)}</span>
                      </div>
                    </td>
                    {[row.exam, row.participation, row.assignments].map((v, vi) => (
                      <td key={vi} className="px-4 py-3">
                        <input type="number" defaultValue={v} min={0} max={100}
                          className="w-16 px-2 py-1 rounded-lg font-mono text-sm font-600 text-center border outline-none focus:ring-2 transition-all"
                          style={{
                            background: 'var(--surface)',
                            borderColor: 'var(--border)',
                            color: 'var(--text)',
                          }} />
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      <span className="font-display font-800 text-base font-mono" style={{ color: gradeColor }}>
                        {final}
                      </span>
                      <span className="text-xs ml-1" style={{ color: 'var(--muted)' }}>/100</span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-xs font-700 px-2.5 py-1.5 rounded-lg transition-all hover:opacity-80"
                        style={{ background: 'var(--primary)' + '20', color: 'var(--primary)' }}>
                        {he ? 'משוב' : 'Feedback'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StudentView({ currentClassId }: { currentClassId: string }) {
  const { language } = useLanguage();
  const he = language === 'he';
  const cls = classes.find(c => c.id === currentClassId)!;
  const grades = studentGrades[currentClassId] || { exam: 0, participation: 0, assignments: 0, feedback: '' };

  const finalGrade = Math.round(
    grades.exam * gradeWeights.exam +
    grades.participation * gradeWeights.participation +
    grades.assignments * gradeWeights.assignments
  );

  const gradeColor = finalGrade >= 90 ? '#10B981' : finalGrade >= 75 ? '#3B82F6' : finalGrade >= 60 ? '#F59E0B' : '#F43F5E';

  const components = [
    { label: he ? 'מבחנים' : 'Exams', weight: gradeWeights.exam, score: grades.exam, color: '#F43F5E', icon: '📋' },
    { label: he ? 'השתתפות' : 'Participation', weight: gradeWeights.participation, score: grades.participation, color: '#3B82F6', icon: '🙋' },
    { label: he ? 'מטלות' : 'Assignments', weight: gradeWeights.assignments, score: grades.assignments, color: '#7C3AED', icon: '📄' },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Final grade hero */}
      <div className="rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6"
        style={{ background: 'var(--card)', border: `2px solid ${gradeColor}44` }}>
        <div className="relative w-36 h-36 flex-shrink-0">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r="50" fill="none" stroke="var(--surface)" strokeWidth="12" />
            <circle cx="60" cy="60" r="50" fill="none" stroke={gradeColor} strokeWidth="12"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - finalGrade / 100)}`}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 1.2s ease' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display font-900 text-4xl" style={{ color: gradeColor }}>{finalGrade}</span>
            <span className="text-xs font-700" style={{ color: 'var(--muted)' }}>/ 100</span>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="font-display font-800 text-2xl">{localize(cls.name, language)}</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
            {he ? `עם ${localize(cls.teacher, language)} · כיתה י״א` : `with ${cls.teacher} · Grade 11`}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-2xl font-display font-900" style={{ color: gradeColor }}>
              {finalGrade >= 90 ? 'A' : finalGrade >= 80 ? 'B' : finalGrade >= 70 ? 'C' : 'D'}
            </span>
            <span className="px-3 py-1 rounded-full text-sm font-700"
              style={{ background: gradeColor + '20', color: gradeColor }}>
              {finalGrade >= 90 ? (he ? 'מצוין' : 'Excellent') : finalGrade >= 80 ? (he ? 'טוב' : 'Good') : finalGrade >= 70 ? (he ? 'מספק' : 'Satisfactory') : (he ? 'טעון שיפור' : 'Needs Work')}
            </span>
          </div>
          <div className="mt-3 p-3 rounded-2xl" style={{ background: 'var(--surface)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm">💬</span>
              <span className="text-xs font-700" style={{ color: 'var(--muted)' }}>{he ? 'משוב מהמורה' : 'Teacher Feedback'}</span>
            </div>
            <p className="text-sm leading-relaxed">{grades.feedback ? localize(grades.feedback, language) : (he ? 'אין עדיין משוב.' : 'No feedback yet.')}</p>
          </div>
        </div>
      </div>

      {/* Grade breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {components.map(comp => {
          const weighted = Math.round(comp.score * comp.weight);
          return (
            <div key={comp.label} className="rounded-3xl p-5 flex flex-col gap-3"
              style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{comp.icon}</span>
                  <div>
                    <div className="font-700 text-sm">{comp.label}</div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>{he ? 'משקל' : 'Weight'}: {Math.round(comp.weight * 100)}%</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-900 text-2xl font-mono" style={{ color: comp.color }}>{comp.score}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>+{weighted} {he ? 'נק׳' : 'pts'}</div>
                </div>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
                <div className="h-full rounded-full" style={{ width: `${comp.score}%`, background: comp.color, transition: 'width 1s ease' }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Class selector */}
      <div className="rounded-3xl p-5" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
        <h3 className="font-display font-700 text-base mb-4">{he ? 'סקירת כל הכיתות' : 'All Classes Overview'}</h3>
        <div className="flex flex-col gap-3">
          {classes.map(cls => {
            const g = studentGrades[cls.id] || { exam: 0, participation: 0, assignments: 0 };
            const f = Math.round(g.exam * gradeWeights.exam + g.participation * gradeWeights.participation + g.assignments * gradeWeights.assignments);
            const fc = f >= 90 ? '#10B981' : f >= 75 ? '#3B82F6' : f >= 60 ? '#F59E0B' : '#F43F5E';
            return (
              <div key={cls.id} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-display font-700 text-sm flex-shrink-0"
                  style={{ background: cls.color }}>{localize(cls.subject, language)[0]}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-700">{localize(cls.name, language)}</span>
                    <span className="font-mono font-700 text-sm" style={{ color: fc }}>{f}</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface)' }}>
                    <div className="h-full rounded-full" style={{ width: `${f}%`, background: fc }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Gradebook({ role, currentClassId }: GradebookProps) {
  const { language } = useLanguage();
  const he = language === 'he';
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5">
      <h1 className="font-display font-800 text-2xl">
        {role === 'teacher' ? (he ? '📊 יומן ציונים' : '📊 Gradebook') : (he ? '📈 הציונים שלי' : '📈 My Grades')}
      </h1>
      {role === 'teacher' ? <TeacherView currentClassId={currentClassId} /> : <StudentView currentClassId={currentClassId} />}
    </div>
  );
}

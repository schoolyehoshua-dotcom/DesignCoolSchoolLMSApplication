import { useState } from 'react';
import { classes, assignments, timetable } from '../data';
import { useLanguage } from '../contexts/LanguageContext';
import { localize } from '../localization';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const DAYS_HE = ['יום שני', 'יום שלישי', 'יום רביעי', 'יום חמישי', 'יום שישי'];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function WeeklyGrid() {
  const { language } = useLanguage();
  const he = language === 'he';
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);

  return (
    <div className="rounded-3xl overflow-hidden" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
      {/* Header row */}
      <div className="grid" style={{ gridTemplateColumns: '56px repeat(5, 1fr)' }}>
        <div style={{ background: 'var(--surface)', borderBottom: '1.5px solid var(--border)' }} className="p-3" />
        {(he ? DAYS_HE : DAYS).map(day => (
          <div key={day} style={{ background: 'var(--surface)', borderBottom: '1.5px solid var(--border)', borderLeft: '1px solid var(--border)' }}
            className="p-3 text-center">
            <div className="font-display font-700 text-sm">{he ? day.replace('יום ', '') : day.slice(0, 3)}</div>
            <div className="text-xs mt-0.5 hidden md:block" style={{ color: 'var(--muted)' }}>{day}</div>
          </div>
        ))}
      </div>

      {/* Time rows */}
      {HOURS.map(hour => (
        <div key={hour} className="grid" style={{ gridTemplateColumns: '56px repeat(5, 1fr)', minHeight: '64px' }}>
          {/* Time label */}
          <div className="flex items-start justify-center pt-2" style={{ borderBottom: '1px solid var(--border)' }}>
            <span className="font-mono text-xs font-500" style={{ color: 'var(--muted)' }}>{hour}:00</span>
          </div>
          {/* Day cells */}
          {DAYS.map((_, dayIndex) => {
            const slot = timetable.find(s => s.day === dayIndex && s.startHour === hour);
            const cls = slot ? classes.find(c => c.id === slot.classId) : null;
            const slotKey = slot ? `${dayIndex}-${hour}` : '';

            return (
              <div key={dayIndex} className="relative p-1.5"
                style={{ borderLeft: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
                {slot && cls && (
                  <div
                    className="h-full rounded-xl p-2 cursor-pointer transition-all"
                    style={{
                      background: cls.color + '22',
                      border: `1.5px solid ${cls.color}55`,
                      minHeight: `${slot.duration * 60}px`,
                      transform: hoveredSlot === slotKey ? 'scale(1.02)' : 'scale(1)',
                    }}
                    onMouseEnter={() => setHoveredSlot(slotKey)}
                    onMouseLeave={() => setHoveredSlot(null)}>
                    <div className="font-700 text-xs leading-tight" style={{ color: cls.color }}>{localize(cls.subject, language)}</div>
                    <div className="text-xs mt-0.5 hidden md:block" style={{ color: 'var(--muted)' }}>{localize(slot.room, language)}</div>
                    {slot.duration > 1 && (
                      <div className="text-xs mt-1 font-600" style={{ color: cls.color + 'cc' }}>
                        {hour}:00–{hour + slot.duration}:00
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function MiniCalendar() {
  const { language } = useLanguage();
  const he = language === 'he';
  const [month, setMonth] = useState(8); // September (0-indexed)
  const [year] = useState(2026);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const blanks = firstDay === 0 ? 6 : firstDay - 1;

  const eventDays = assignments.reduce<Record<number, typeof assignments[0][]>>((acc, a) => {
    const d = new Date(a.dueDate);
    if (d.getMonth() === month && d.getFullYear() === year) {
      const day = d.getDate();
      if (!acc[day]) acc[day] = [];
      acc[day].push(a);
    }
    return acc;
  }, {});

  const typeColors: Record<string, string> = {
    homework: '#7C3AED',
    exam: '#F43F5E',
    bagrut: '#F59E0B',
    quiz: '#3B82F6',
  };

  return (
    <div className="rounded-3xl p-5" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-700 text-base">
          {new Date(year, month).toLocaleDateString(he ? 'he-IL' : 'en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-1">
          <button onClick={() => setMonth(m => Math.max(0, m - 1))}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition-all"
            style={{ background: 'var(--surface)' }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button onClick={() => setMonth(m => Math.min(11, m + 1))}
            className="w-7 h-7 rounded-lg flex items-center justify-center hover:opacity-70 transition-all"
            style={{ background: 'var(--surface)' }}>
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {(he ? ['ב׳', 'ג׳', 'ד׳', 'ה׳', 'ו׳', 'ש׳', 'א׳'] : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']).map(d => (
          <div key={d} className="text-center text-xs font-700 py-1" style={{ color: 'var(--muted)' }}>{d}</div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: blanks }).map((_, i) => <div key={`b${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const events = eventDays[day] || [];
          const isToday = day === 8 && month === 8 && year === 2026;

          return (
            <div key={day} className="aspect-square flex flex-col items-center justify-center rounded-xl relative cursor-pointer transition-all hover:opacity-80"
              style={{
                background: isToday ? 'var(--primary)' : events.length > 0 ? 'var(--surface)' : 'transparent',
              }}>
              <span className="text-xs font-700" style={{ color: isToday ? '#fff' : 'var(--text)' }}>{day}</span>
              {events.length > 0 && !isToday && (
                <div className="flex gap-0.5 mt-0.5">
                  {events.slice(0, 3).map((e, ei) => (
                    <span key={ei} className="w-1.5 h-1.5 rounded-full" style={{ background: typeColors[e.type] }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 flex flex-wrap gap-3" style={{ borderTop: '1px solid var(--border)' }}>
        {Object.entries(he
          ? { homework: 'שיעורי בית', exam: 'מבחן', bagrut: 'בגרות', quiz: 'בוחן' }
          : { homework: 'Homework', exam: 'Exam', bagrut: 'Bagrut', quiz: 'Quiz' }).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: typeColors[type] }} />
            <span className="text-xs font-500" style={{ color: 'var(--muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingEvents() {
  const { language } = useLanguage();
  const he = language === 'he';
  const upcoming = assignments
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 6);

  const typeColors: Record<string, string> = {
    homework: '#7C3AED',
    exam: '#F43F5E',
    bagrut: '#F59E0B',
    quiz: '#3B82F6',
  };

  return (
    <div className="rounded-3xl p-5" style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}>
      <h3 className="font-display font-700 text-base mb-4">{he ? 'אירועים קרובים' : 'Upcoming Events'}</h3>
      <div className="flex flex-col gap-2">
        {upcoming.map(a => {
          const cls = classes.find(c => c.id === a.classId)!;
          const daysLeft = Math.ceil((new Date(a.dueDate).getTime() - Date.now()) / 86400000);
          return (
            <div key={a.id} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex-shrink-0 flex flex-col items-center justify-center"
                style={{ background: typeColors[a.type] + '18' }}>
                <span className="font-mono font-700 text-sm leading-none" style={{ color: typeColors[a.type] }}>
                  {new Date(a.dueDate).getDate()}
                </span>
                <span className="text-xs" style={{ color: typeColors[a.type] + 'aa' }}>
                  {new Date(a.dueDate).toLocaleDateString(he ? 'he-IL' : 'en-US', { month: 'short' })}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-700 truncate">{localize(a.title, language)}</div>
                <div className="text-xs" style={{ color: 'var(--muted)' }}>{localize(cls.name, language)}</div>
              </div>
              <span className="text-xs font-700 flex-shrink-0" style={{ color: daysLeft <= 2 ? '#F43F5E' : 'var(--muted)' }}>
                {daysLeft <= 0 ? (he ? 'היום' : 'Today') : (he ? `${daysLeft} ימים` : `${daysLeft}d`)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Timetable() {
  const { language } = useLanguage();
  const he = language === 'he';
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="font-display font-800 text-2xl">{he ? 'מערכת שעות ולוח שנה' : 'Schedule & Calendar'}</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm font-600" style={{ color: 'var(--muted)' }}>{he ? 'השבוע של 7–11 בספטמבר 2026' : 'Week of Sep 7–11, 2026'}</span>
          <button className="px-3 py-1.5 rounded-xl text-sm font-700 transition-all hover:opacity-80"
            style={{ background: 'var(--primary)', color: '#fff' }}>
            {he ? 'היום' : 'Today'}
          </button>
        </div>
      </div>

      <WeeklyGrid />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <MiniCalendar />
        <UpcomingEvents />
      </div>
    </div>
  );
}

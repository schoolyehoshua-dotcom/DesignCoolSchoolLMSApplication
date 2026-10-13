import type { View } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  view: View;
  setView: (v: View) => void;
}

const navItems: { id: View; labelKey: 'hub' | 'schedule' | 'grades' | 'path' | 'library' | 'settings'; icon: JSX.Element }[] = [
  {
    id: 'dashboard',
    labelKey: 'hub',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
  },
  {
    id: 'timetable',
    labelKey: 'schedule',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
  },
  {
    id: 'gradebook',
    labelKey: 'grades',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
  },
  {
    id: 'learning-path',
    labelKey: 'path',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>
  },
  {
    id: 'library',
    labelKey: 'library',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>
  },
  {
    id: 'settings',
    labelKey: 'settings',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0015 19.4a1.7 1.7 0 00-1 .6 1.7 1.7 0 00-.4 1.1V21H9.6v-.1A1.7 1.7 0 008.5 19.4a1.7 1.7 0 00-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 004.6 15a1.7 1.7 0 00-.6-1 1.7 1.7 0 00-1.1-.4H3V9.6h.1A1.7 1.7 0 004.6 8.5a1.7 1.7 0 00-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 009 4.6a1.7 1.7 0 001-.6 1.7 1.7 0 00.4-1.1V3h4v.1A1.7 1.7 0 0015.5 4.6a1.7 1.7 0 001.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0019.4 9c.14.38.36.72.65.99.3.27.68.42 1.08.42H21v4h-.1A1.7 1.7 0 0019.4 15z"/></svg>
  },
];

export default function Sidebar({ view, setView }: SidebarProps) {
  const { t } = useLanguage();
  return (
    <aside className="w-16 md:w-20 flex flex-col items-center py-4 gap-2 flex-shrink-0"
      style={{ background: 'var(--card)', borderRight: '1px solid var(--border)' }}>
      {navItems.map(item => {
        const active = view === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            title={t(item.labelKey)}
            className="flex flex-col items-center gap-1 w-12 py-2.5 rounded-2xl transition-all group"
            style={{
              background: active ? 'var(--primary)' : 'transparent',
              color: active ? 'var(--primary-fg)' : 'var(--muted)',
            }}>
            <div className="w-5 h-5" style={{ color: active ? 'var(--primary-fg)' : 'var(--muted)' }}>
              {item.icon}
            </div>
            <span className="text-xs font-700 hidden md:block" style={{ fontSize: '10px' }}>
              {t(item.labelKey)}
            </span>
          </button>
        );
      })}
    </aside>
  );
}

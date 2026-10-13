import { useState, useRef, useEffect } from 'react';
import type { Role, View } from '../types';
import { classes, notifications as notifData } from '../data';
import { useLanguage } from '../contexts/LanguageContext';
import { localize } from '../localization';

interface HeaderProps {
  dark: boolean;
  setDark: (v: boolean) => void;
  currentClassId: string;
  setCurrentClassId: (id: string) => void;
  role: Role;
  setRole: (r: Role) => void;
  setView: (view: View) => void;
}

export default function Header({ dark, setDark, currentClassId, setCurrentClassId, role, setRole, setView }: HeaderProps) {
  const { t, language } = useLanguage();
  const [showNotifs, setShowNotifs] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showClasses, setShowClasses] = useState(false);
  const [notifs, setNotifs] = useState(notifData);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const classRef = useRef<HTMLDivElement>(null);

  const unread = notifs.filter(n => !n.read).length;
  const currentClass = classes.find(c => c.id === currentClassId)!;
  const availableClasses = role === 'teacher'
    ? classes.filter(cls => cls.teacher === 'Dr. Levi')
    : classes;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setShowProfile(false);
      if (classRef.current && !classRef.current.contains(e.target as Node)) setShowClasses(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = () => setNotifs(notifs.map(n => ({ ...n, read: true })));

  const notifIcon = (type: string) => {
    if (type === 'live') return '🔴';
    if (type === 'grade') return '📝';
    if (type === 'exam') return '📋';
    if (type === 'xp') return '⭐';
    return '📌';
  };

  return (
    <header style={{ background: 'var(--card)', borderBottom: '1px solid var(--border)' }}
      className="h-16 flex items-center px-6 gap-4 z-50 sticky top-0">
      {/* Logo */}
      <div className="flex items-center gap-2 mr-2">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-display font-900 text-sm"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #10B981)' }}>C</div>
        <span className="font-display font-800 text-xl hidden sm:block" style={{ color: 'var(--primary)' }}>CoolSchool</span>
      </div>

      {/* Class Switcher */}
      <div ref={classRef} className="relative ml-2">
        <button onClick={() => setShowClasses(!showClasses)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-600 transition-all hover:opacity-80"
          style={{ background: currentClass.color + '22', color: currentClass.color, border: `1.5px solid ${currentClass.color}44` }}>
          <span className="w-2 h-2 rounded-full" style={{ background: currentClass.color }} />
          <span className="hidden sm:block">{localize(currentClass.name, language)}</span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        {showClasses && (
          <div className="absolute top-full left-0 mt-2 w-56 rounded-2xl shadow-xl border overflow-hidden z-50"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            {availableClasses.map(cls => (
              <button key={cls.id} onClick={() => { setCurrentClassId(cls.id); setShowClasses(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:opacity-80 transition-all"
                style={{ background: currentClassId === cls.id ? cls.color + '18' : 'transparent' }}>
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cls.color }} />
                <div>
                  <div className="font-600" style={{ color: 'var(--text)' }}>{localize(cls.name, language)}</div>
                  <div className="text-xs" style={{ color: 'var(--muted)' }}>{localize(cls.teacher, language)}</div>
                </div>
                {currentClassId === cls.id && (
                  <svg className="w-4 h-4 ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: cls.color }}>
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
            <div style={{ borderTop: '1px solid var(--border)' }} className="p-3">
              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-600 transition-all hover:opacity-80"
                style={{ background: 'var(--primary)', color: 'var(--primary-fg)' }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                {t('joinClass')}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1" />

      {/* Role Toggle */}
      <div className="hidden md:flex items-center gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)' }}>
        {(['student', 'teacher'] as Role[]).map(r => (
          <button key={r} onClick={() => {
            setRole(r);
            if (r === 'teacher') {
              const firstTeacherClass = classes.find(cls => cls.teacher === 'Dr. Levi');
              if (firstTeacherClass && !classes.some(cls => cls.id === currentClassId && cls.teacher === 'Dr. Levi')) {
                setCurrentClassId(firstTeacherClass.id);
              }
            }
          }}
            className="px-3 py-1 rounded-lg text-xs font-700 capitalize transition-all"
            style={{
              background: role === r ? 'var(--primary)' : 'transparent',
              color: role === r ? 'var(--primary-fg)' : 'var(--muted)',
            }}>
            {t(r)}
          </button>
        ))}
      </div>

      {/* Dark mode toggle */}
      <button onClick={() => setDark(!dark)}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:opacity-70"
        style={{ background: 'var(--surface)' }}>
        {dark
          ? <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
          : <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        }
      </button>

      {/* Notifications */}
      <div ref={notifRef} className="relative">
        <button onClick={() => setShowNotifs(!showNotifs)}
          className="w-9 h-9 rounded-xl flex items-center justify-center relative transition-all hover:opacity-70"
          style={{ background: 'var(--surface)' }}>
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"/>
          </svg>
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-700 text-white"
              style={{ background: '#F43F5E' }}>{unread}</span>
          )}
        </button>
        {showNotifs && (
          <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-xl border overflow-hidden z-50"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <span className="font-display font-700 text-base">{t('notifications')}</span>
              <button onClick={markAllRead} className="text-xs font-600" style={{ color: 'var(--primary)' }}>{t('markAllRead')}</button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifs.map(n => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 transition-all"
                  style={{ background: n.read ? 'transparent' : 'var(--primary)11', borderBottom: '1px solid var(--border)' }}>
                  <span className="text-base mt-0.5">{notifIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-500 leading-snug">{localize(n.text, language)}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{localize(n.time, language)}</p>
                  </div>
                  {!n.read && <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--primary)' }} />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div ref={profileRef} className="relative">
        <button onClick={() => setShowProfile(!showProfile)}
          className="flex items-center gap-2 p-1 pr-3 rounded-xl transition-all hover:opacity-80"
          style={{ background: 'var(--surface)' }}>
          <div className="w-7 h-7 rounded-lg text-white font-display font-700 text-sm flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #EC4899)' }}>
            {role === 'teacher' ? 'T' : 'S'}
          </div>
          <span className="text-sm font-600 hidden sm:block">
            {localize(role === 'teacher' ? 'Dr. Levi' : 'Noa Ben-David', language)}
          </span>
        </button>
        {showProfile && (
          <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl shadow-xl border overflow-hidden z-50"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="font-700">{localize(role === 'teacher' ? 'Dr. Levi' : 'Noa Ben-David', language)}</div>
              <div className="text-xs" style={{ color: 'var(--muted)' }}>{t('grade')} · {t(role)}</div>
            </div>
            {(['profile', 'settings', 'help', 'signOut'] as const).map(item => (
              <button key={item}
                onClick={() => {
                  if (item === 'settings') setView('settings');
                  setShowProfile(false);
                }}
                className="w-full text-start px-4 py-2.5 text-sm font-500 hover:opacity-70 transition-all"
                style={{ color: item === 'signOut' ? '#F43F5E' : 'var(--text)' }}>
                {t(item)}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}

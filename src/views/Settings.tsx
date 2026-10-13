import { useEffect, useState } from 'react';
import type { Language, Role } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { localize } from '../localization';

interface SettingsProps {
  dark: boolean;
  setDark: (dark: boolean) => void;
  role: Role;
}

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-primary bg-primary/10">
      {children}
    </div>
  );
}

export default function Settings({ dark, setDark, role }: SettingsProps) {
  const { language, setLanguage, t } = useLanguage();
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('coolschool-font-size') || 'medium');

  const languageOptions: { value: Language; label: string; detail: string }[] = [
    { value: 'he', label: t('hebrew'), detail: 'עברית · מימין לשמאל' },
    { value: 'en', label: t('english'), detail: 'English · Left to right' },
    { value: 'ar', label: t('arabic'), detail: 'العربية · من اليمين إلى اليسار' },
  ];

  useEffect(() => {
    localStorage.setItem('coolschool-font-size', fontSize);
    document.documentElement.dataset.fontSize = fontSize;
  }, [fontSize]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-700 mb-3 bg-primary/10 text-primary">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0015 19.4a1.7 1.7 0 00-1 .6 1.7 1.7 0 00-.4 1.1V21H9.6v-.1A1.7 1.7 0 008.5 19.4a1.7 1.7 0 00-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 004.6 15a1.7 1.7 0 00-.6-1 1.7 1.7 0 00-1.1-.4H3V9.6h.1A1.7 1.7 0 004.6 8.5a1.7 1.7 0 00-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 009 4.6a1.7 1.7 0 001-.6 1.7 1.7 0 00.4-1.1V3h4v.1A1.7 1.7 0 0015.5 4.6a1.7 1.7 0 001.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0019.4 9c.14.38.36.72.65.99.3.27.68.42 1.08.42H21v4h-.1A1.7 1.7 0 0019.4 15z" />
            </svg>
            CoolSchool
          </div>
          <h1 className="font-display font-800 text-3xl">{t('appSettings')}</h1>
          <p className="mt-1 text-sm text-muted">{t('settingsSubtitle')}</p>
        </div>

        <div className="rounded-3xl p-5 md:p-6 bg-card border border-border">
          <div className="flex items-start gap-4 mb-5">
            <SectionIcon>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15 15 0 010 20M12 2a15 15 0 000 20" />
              </svg>
            </SectionIcon>
            <div>
              <h2 className="font-display font-800 text-lg">{t('language')}</h2>
              <p className="text-sm text-muted">{t('languageDescription')}</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {languageOptions.map(option => {
              const selected = language === option.value;
              return (
                <button key={option.value} onClick={() => setLanguage(option.value)}
                  className="flex items-center justify-between gap-3 p-4 rounded-2xl text-start transition-all border"
                  style={{
                    background: selected ? 'var(--primary)' + '12' : 'var(--surface)',
                    borderColor: selected ? 'var(--primary)' : 'var(--border)',
                  }}>
                  <div>
                    <div className="font-700">{option.label}</div>
                    <div className="text-xs mt-0.5 text-muted" dir={option.value === 'he' ? 'rtl' : 'ltr'}>{option.detail}</div>
                  </div>
                  <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                    style={{ borderColor: selected ? 'var(--primary)' : 'var(--muted)' }}>
                    {selected && <span className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-3xl p-5 md:p-6 bg-card border border-border">
            <div className="flex items-start gap-4 mb-5">
              <SectionIcon>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" />
                </svg>
              </SectionIcon>
              <div>
                <h2 className="font-display font-800 text-lg">{t('appearance')}</h2>
                <p className="text-sm text-muted">{t('appearanceDescription')}</p>
              </div>
            </div>
            <div className="flex p-1 rounded-2xl bg-surface">
              {[false, true].map(value => (
                <button key={String(value)} onClick={() => setDark(value)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-700 transition-all"
                  style={{
                    background: dark === value ? 'var(--card)' : 'transparent',
                    color: dark === value ? 'var(--primary)' : 'var(--muted)',
                    boxShadow: dark === value ? '0 2px 8px rgba(0,0,0,.08)' : 'none',
                  }}>
                  {value ? t('dark') : t('light')}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl p-5 md:p-6 bg-card border border-border">
            <div className="flex items-start gap-4 mb-5">
              <SectionIcon>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19L9 5h2l5 14M6 14h8M16 9h5M18.5 6.5v5" />
                </svg>
              </SectionIcon>
              <div>
                <h2 className="font-display font-800 text-lg">{t('fontSize')}</h2>
                <p className="text-sm text-muted">{t('fontSizeDescription')}</p>
              </div>
            </div>
            <div className="flex p-1 rounded-2xl bg-surface">
              {(['small', 'medium', 'large'] as const).map(size => (
                <button key={size} onClick={() => setFontSize(size)}
                  className="flex-1 py-2.5 rounded-xl font-700 transition-all"
                  style={{
                    background: fontSize === size ? 'var(--card)' : 'transparent',
                    color: fontSize === size ? 'var(--primary)' : 'var(--muted)',
                  }}>
                  {t(size)}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl p-5 md:p-6 bg-card border border-border">
            <div className="flex items-start gap-4 mb-5">
              <SectionIcon>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0116 0" />
                </svg>
              </SectionIcon>
              <div>
                <h2 className="font-display font-800 text-lg">{t('account')}</h2>
                <p className="text-sm text-muted">{t('accountDescription')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-surface">
              <div className="w-10 h-10 rounded-xl text-white font-display font-800 flex items-center justify-center bg-primary">
                {role === 'teacher' ? 'T' : 'S'}
              </div>
              <div>
                <div className="text-sm font-700">{localize(role === 'teacher' ? 'Dr. Levi' : 'Noa Ben-David', language)}</div>
                <div className="text-xs text-muted">{t('role')}: {t(role)}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl p-5 bg-primary/10 border border-primary/20 flex items-start gap-4">
          <SectionIcon>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
            </svg>
          </SectionIcon>
          <div>
            <h2 className="font-display font-800 text-base">{t('gradeAverage')}</h2>
            <p className="text-sm text-muted mt-1">
              {role === 'teacher' ? t('teacherAverageExplanation') : t('studentAverageExplanation')}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs text-muted">
          <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 13l4 4L19 7" /></svg>
          {t('saved')}
        </div>
      </div>
    </div>
  );
}

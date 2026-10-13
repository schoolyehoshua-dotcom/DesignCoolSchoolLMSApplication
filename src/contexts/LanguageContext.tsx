import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Language } from '../types';

const translations = {
  he: {
    hub: 'מרכז',
    schedule: 'מערכת',
    grades: 'ציונים',
    path: 'מסלול',
    library: 'ספרייה',
    settings: 'הגדרות',
    student: 'תלמיד',
    teacher: 'מורה',
    notifications: 'התראות',
    markAllRead: 'סימון הכול כנקרא',
    joinClass: 'הצטרפות לכיתה עם QR',
    profile: 'פרופיל',
    help: 'עזרה',
    signOut: 'יציאה',
    grade: 'כיתה י״א',
    appSettings: 'הגדרות האפליקציה',
    settingsSubtitle: 'התאימו את CoolSchool לאופן שבו נוח לכם ללמוד.',
    language: 'שפה',
    languageDescription: 'בחרו את שפת הממשק. השינוי נשמר אוטומטית.',
    hebrew: 'עברית',
    english: 'English',
    arabic: 'العربية',
    appearance: 'תצוגה',
    appearanceDescription: 'בחרו את ערכת הנושא שמתאימה לכם.',
    light: 'בהיר',
    dark: 'כהה',
    account: 'חשבון',
    accountDescription: 'הפרטים האישיים והעדפות החשבון שלכם.',
    role: 'תפקיד נוכחי',
    saved: 'השינויים נשמרים אוטומטית',
    fontSize: 'גודל גופן',
    fontSizeDescription: 'בחרו את גודל הטקסט הנוח לכם.',
    small: 'קטן',
    medium: 'רגיל',
    large: 'גדול',
    gradeAverage: 'מה מציג ממוצע הציונים?',
    studentAverageExplanation: 'במצב תלמיד מוצג הממוצע האישי שלך, המחושב מכל רכיבי הציון והמשקלים בכל הכיתות שלך.',
    teacherAverageExplanation: 'במצב מורה מוצג הממוצע הכיתתי של התלמידים בכיתה שנבחרה כעת.',
  },
  en: {
    hub: 'Hub',
    schedule: 'Schedule',
    grades: 'Grades',
    path: 'Path',
    library: 'Library',
    settings: 'Settings',
    student: 'Student',
    teacher: 'Teacher',
    notifications: 'Notifications',
    markAllRead: 'Mark all read',
    joinClass: 'Join Class with QR',
    profile: 'Profile',
    help: 'Help',
    signOut: 'Sign Out',
    grade: 'Grade 11',
    appSettings: 'App Settings',
    settingsSubtitle: 'Make CoolSchool work the way you like to learn.',
    language: 'Language',
    languageDescription: 'Choose the interface language. Your choice is saved automatically.',
    hebrew: 'עברית',
    english: 'English',
    arabic: 'العربية',
    appearance: 'Appearance',
    appearanceDescription: 'Choose the theme that feels best for you.',
    light: 'Light',
    dark: 'Dark',
    account: 'Account',
    accountDescription: 'Your personal details and account preferences.',
    role: 'Current role',
    saved: 'Changes are saved automatically',
    fontSize: 'Font size',
    fontSizeDescription: 'Choose the text size that is most comfortable for you.',
    small: 'Small',
    medium: 'Default',
    large: 'Large',
    gradeAverage: 'Whose grade average is shown?',
    studentAverageExplanation: 'In student mode, this is your personal weighted average across your classes.',
    teacherAverageExplanation: 'In teacher mode, this is the class average for the currently selected class.',
  },
  ar: {
    hub: 'الرئيسية',
    schedule: 'الجدول',
    grades: 'العلامات',
    path: 'المسار',
    library: 'المكتبة',
    settings: 'الإعدادات',
    student: 'طالب',
    teacher: 'معلّم',
    notifications: 'الإشعارات',
    markAllRead: 'تحديد الكل كمقروء',
    joinClass: 'الانضمام إلى صف عبر QR',
    profile: 'الملف الشخصي',
    help: 'المساعدة',
    signOut: 'تسجيل الخروج',
    grade: 'الصف الحادي عشر',
    appSettings: 'إعدادات التطبيق',
    settingsSubtitle: 'خصص CoolSchool بالطريقة التي تناسب تعلمك.',
    language: 'اللغة',
    languageDescription: 'اختر لغة الواجهة. يتم حفظ اختيارك تلقائياً.',
    hebrew: 'עברית',
    english: 'English',
    arabic: 'العربية',
    appearance: 'المظهر',
    appearanceDescription: 'اختر المظهر الذي يناسبك.',
    light: 'فاتح',
    dark: 'داكن',
    account: 'الحساب',
    accountDescription: 'بياناتك الشخصية وتفضيلات حسابك.',
    role: 'الدور الحالي',
    saved: 'يتم حفظ التغييرات تلقائياً',
    fontSize: 'حجم الخط',
    fontSizeDescription: 'اختر حجم النص الأكثر راحة لك.',
    small: 'صغير',
    medium: 'عادي',
    large: 'كبير',
    gradeAverage: 'لمن يعود معدل العلامات؟',
    studentAverageExplanation: 'في وضع الطالب، يظهر معدلك الشخصي الموزون في جميع صفوفك.',
    teacherAverageExplanation: 'في وضع المعلّم، يظهر معدل طلاب الصف المحدد حالياً.',
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('coolschool-language');
    return saved === 'en' || saved === 'he' || saved === 'ar' ? saved : 'he';
  });

  useEffect(() => {
    localStorage.setItem('coolschool-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' || language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  useEffect(() => {
    document.documentElement.dataset.fontSize = localStorage.getItem('coolschool-font-size') || 'medium';
  }, []);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    setLanguage: setLanguageState,
    t: key => translations[language][key],
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

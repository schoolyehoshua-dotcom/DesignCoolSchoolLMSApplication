import { useState } from 'react';
import type { View, Role } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Timetable from './views/Timetable';
import Gradebook from './views/Gradebook';
import LearningPath from './views/LearningPath';
import StudentLibrary from './views/StudentLibrary';
import Settings from './views/Settings';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  const [dark, setDark] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  const [role, setRole] = useState<Role>('student');
  const [currentClassId, setCurrentClassId] = useState('bio11a');

  return (
    <LanguageProvider>
    <div className={dark ? 'dark' : ''} style={{ height: '100%' }}>
      <div className="flex flex-col h-full transition-theme" style={{ background: 'var(--bg)' }}>
        <Header
          dark={dark}
          setDark={setDark}
          currentClassId={currentClassId}
          setCurrentClassId={setCurrentClassId}
          role={role}
          setRole={setRole}
          setView={setView}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar view={view} setView={setView} />
          <main className="flex-1 overflow-hidden flex flex-col">
            {view === 'dashboard' && (
              <Dashboard currentClassId={currentClassId} role={role} />
            )}
            {view === 'timetable' && <Timetable />}
            {view === 'gradebook' && (
              <Gradebook role={role} currentClassId={currentClassId} />
            )}
            {view === 'learning-path' && (
              <LearningPath role={role} currentClassId={currentClassId} />
            )}
            {view === 'library' && <StudentLibrary role={role} />}
            {view === 'settings' && <Settings dark={dark} setDark={setDark} role={role} />}
          </main>
        </div>
      </div>
    </div>
    </LanguageProvider>
  );
}

export type View = 'dashboard' | 'timetable' | 'gradebook' | 'learning-path' | 'library' | 'settings';
export type Role = 'teacher' | 'student';
export type Language = 'he' | 'en' | 'ar';

export interface ClassInfo {
  id: string;
  name: string;
  subject: string;
  color: string;
  teacher: string;
  students: number;
  progress: number;
}

export interface Assignment {
  id: string;
  title: string;
  classId: string;
  dueDate: string;
  type: 'homework' | 'exam' | 'bagrut' | 'quiz';
  weight: number;
  submitted?: boolean;
  grade?: number;
  feedback?: string;
}

export interface TimetableSlot {
  day: number;
  startHour: number;
  duration: number;
  classId: string;
  room: string;
}

export interface PathNode {
  id: string;
  title: string;
  type: 'lesson' | 'quiz' | 'boss' | 'checkpoint';
  status: 'completed' | 'current' | 'locked';
  xp: number;
  x: number;
  y: number;
}

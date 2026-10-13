import type { ClassInfo, Assignment, TimetableSlot, PathNode } from './types';

export const classes: ClassInfo[] = [
  { id: 'bio11a', name: 'Biology 11A', subject: 'Biology', color: '#10B981', teacher: 'Dr. Levi', students: 28, progress: 62 },
  { id: 'math11', name: 'Mathematics 11', subject: 'Math', color: '#7C3AED', teacher: 'Mr. Cohen', students: 30, progress: 45 },
  { id: 'hist11', name: 'History 11B', subject: 'History', color: '#F59E0B', teacher: 'Ms. Mizrahi', students: 26, progress: 78 },
  { id: 'eng11', name: 'English Lit 11', subject: 'English', color: '#3B82F6', teacher: 'Ms. Shapiro', students: 24, progress: 55 },
  { id: 'chem11', name: 'Chemistry 11A', subject: 'Chemistry', color: '#F43F5E', teacher: 'Dr. Ben-Dor', students: 22, progress: 33 },
];

export const assignments: Assignment[] = [
  { id: 'a1', title: 'Cell Membrane Essay', classId: 'bio11a', dueDate: '2026-09-10', type: 'homework', weight: 0.6, submitted: false },
  { id: 'a2', title: 'Photosynthesis Quiz', classId: 'bio11a', dueDate: '2026-09-12', type: 'quiz', weight: 0.2, submitted: false },
  { id: 'a3', title: 'Bagrut Prep Exam', classId: 'bio11a', dueDate: '2026-09-18', type: 'bagrut', weight: 0.2, submitted: false },
  { id: 'a4', title: 'Quadratic Equations HW', classId: 'math11', dueDate: '2026-09-11', type: 'homework', weight: 0.6, submitted: true, grade: 88, feedback: 'Good work, review Q4.' },
  { id: 'a5', title: 'WWII Operations Essay', classId: 'hist11', dueDate: '2026-09-15', type: 'homework', weight: 0.6, submitted: false },
  { id: 'a6', title: 'Mid-Term Exam', classId: 'math11', dueDate: '2026-09-22', type: 'exam', weight: 0.2, submitted: false },
  { id: 'a7', title: 'Shakespeare Analysis', classId: 'eng11', dueDate: '2026-09-13', type: 'homework', weight: 0.6, submitted: true, grade: 95, feedback: 'Excellent literary analysis!' },
  { id: 'a8', title: 'Chemistry Lab Report', classId: 'chem11', dueDate: '2026-09-16', type: 'homework', weight: 0.6, submitted: false },
];

export const timetable: TimetableSlot[] = [
  { day: 0, startHour: 8, duration: 1, classId: 'bio11a', room: 'Lab 3' },
  { day: 0, startHour: 10, duration: 1, classId: 'math11', room: 'Room 12' },
  { day: 0, startHour: 13, duration: 1, classId: 'eng11', room: 'Room 5' },
  { day: 1, startHour: 9, duration: 2, classId: 'chem11', room: 'Lab 1' },
  { day: 1, startHour: 12, duration: 1, classId: 'hist11', room: 'Room 8' },
  { day: 2, startHour: 8, duration: 1, classId: 'math11', room: 'Room 12' },
  { day: 2, startHour: 11, duration: 1, classId: 'bio11a', room: 'Lab 3' },
  { day: 2, startHour: 14, duration: 1, classId: 'eng11', room: 'Room 5' },
  { day: 3, startHour: 9, duration: 1, classId: 'hist11', room: 'Room 8' },
  { day: 3, startHour: 11, duration: 2, classId: 'chem11', room: 'Lab 1' },
  { day: 3, startHour: 13, duration: 1, classId: 'math11', room: 'Room 12' },
  { day: 4, startHour: 8, duration: 1, classId: 'bio11a', room: 'Lab 3' },
  { day: 4, startHour: 10, duration: 1, classId: 'eng11', room: 'Room 5' },
];

export const bioPathNodes: PathNode[] = [
  { id: 'n1', title: 'Cell Theory', type: 'lesson', status: 'completed', xp: 50, x: 50, y: 85 },
  { id: 'n2', title: 'Cell Types', type: 'lesson', status: 'completed', xp: 50, x: 25, y: 72 },
  { id: 'n3', title: 'Cell Quiz', type: 'quiz', status: 'completed', xp: 100, x: 50, y: 60 },
  { id: 'n4', title: 'Membrane Structure', type: 'lesson', status: 'current', xp: 75, x: 75, y: 48 },
  { id: 'n5', title: 'Transport', type: 'lesson', status: 'locked', xp: 75, x: 50, y: 36 },
  { id: 'n6', title: 'Checkpoint', type: 'checkpoint', status: 'locked', xp: 150, x: 25, y: 24 },
  { id: 'n7', title: 'Photosynthesis', type: 'lesson', status: 'locked', xp: 75, x: 50, y: 12 },
  { id: 'n8', title: 'Unit Boss', type: 'boss', status: 'locked', xp: 300, x: 75, y: 0 },
];

export const studentGrades: Record<string, { exam: number; participation: number; assignments: number; feedback: string }> = {
  bio11a: { exam: 82, participation: 90, assignments: 88, feedback: 'Excellent engagement in class discussions. Keep up the strong essay work!' },
  math11: { exam: 76, participation: 85, assignments: 88, feedback: 'Good homework completion. Focus on exam preparation for the mid-term.' },
  hist11: { exam: 91, participation: 80, assignments: 94, feedback: 'Outstanding historical analysis in your WWII essay.' },
  eng11: { exam: 88, participation: 92, assignments: 95, feedback: 'Your Shakespeare analysis showed real depth of understanding.' },
  chem11: { exam: 70, participation: 75, assignments: 0, feedback: 'Lab report still pending. Please submit by Friday.' },
};

export const gradeWeights = {
  exam: 0.2,
  participation: 0.2,
  assignments: 0.6,
};

export const notifications = [
  { id: 1, text: 'New assignment posted in Biology 11A', time: '5m ago', read: false, type: 'assignment' },
  { id: 2, text: 'Live class starting in 10 minutes — Math 11', time: '10m ago', read: false, type: 'live' },
  { id: 3, text: 'Dr. Levi graded your Cell Essay', time: '1h ago', read: false, type: 'grade' },
  { id: 4, text: 'Bagrut prep exam scheduled for Sep 18', time: '2h ago', read: true, type: 'exam' },
  { id: 5, text: 'You earned 150 XP on the Biology path!', time: '3h ago', read: true, type: 'xp' },
];

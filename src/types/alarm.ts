export interface Alarm {
  id: string;
  time: string; // HH:MM format
  label: string;
  enabled: boolean;
  repeatDays: number[]; // 0-6 (Sun-Sat)
  snoozeMinutes: number;
  tone: string;
  vibration: boolean;
  mathChallenge: boolean;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD format
  time?: string; // HH:MM format
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export interface DayNote {
  date: string; // YYYY-MM-DD format
  content: string;
}

export type Theme = 'dark' | 'light';

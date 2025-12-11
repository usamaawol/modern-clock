import { useState, useEffect } from 'react';
import { Task, DayNote } from '@/types/alarm';

const TASKS_KEY = 'wakewise-tasks';
const NOTES_KEY = 'wakewise-notes';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const stored = localStorage.getItem(TASKS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const [notes, setNotes] = useState<DayNote[]>(() => {
    const stored = localStorage.getItem(NOTES_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    // Some older mobile browsers / WebViews do not support crypto.randomUUID.
    // Use a simple fallback so adding a task never crashes.
    const generateId = () => {
      try {
        // @ts-ignore
        if (typeof crypto !== 'undefined' && crypto.randomUUID) {
          // @ts-ignore
          return crypto.randomUUID();
        }
      } catch (e) {
        // ignore and use fallback below
      }
      return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    };

    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date(),
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const getTasksForDate = (date: string): Task[] => {
    return tasks.filter(task => task.date === date);
  };

  const getTodayTasks = (): Task[] => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    return getTasksForDate(today);
  };

  const getCompletionRate = (date?: string): number => {
    const targetTasks = date ? getTasksForDate(date) : getTodayTasks();
    if (targetTasks.length === 0) return 0;
    const completed = targetTasks.filter(t => t.completed).length;
    return Math.round((completed / targetTasks.length) * 100);
  };

  const setDayNote = (date: string, content: string) => {
    setNotes(prev => {
      const existing = prev.findIndex(n => n.date === date);
      if (existing >= 0) {
        const updated = [...prev];
        updated[existing] = { date, content };
        return updated;
      }
      return [...prev, { date, content }];
    });
  };

  const getDayNote = (date: string): string => {
    return notes.find(n => n.date === date)?.content || '';
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    getTasksForDate,
    getTodayTasks,
    getCompletionRate,
    setDayNote,
    getDayNote,
  };
};

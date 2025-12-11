import { useState, useEffect } from 'react';
import { Alarm } from '@/types/alarm';

const STORAGE_KEY = 'wakewise-alarms';

export const useAlarms = () => {
  const [alarms, setAlarms] = useState<Alarm[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Unable to access localStorage, starting with empty alarms', e);
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms));
  }, [alarms]);

  const addAlarm = (alarm: Omit<Alarm, 'id' | 'createdAt'>) => {
    const id = (crypto && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `${Date.now()}-${Math.floor(Math.random()*1e6)}`;
    const newAlarm: Alarm = {
      ...alarm,
      id,
      createdAt: new Date(),
    };
    setAlarms(prev => [...prev, newAlarm]);
    return newAlarm;
  };

  const updateAlarm = (id: string, updates: Partial<Alarm>) => {
    setAlarms(prev =>
      prev.map(alarm => (alarm.id === id ? { ...alarm, ...updates } : alarm))
    );
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  const toggleAlarm = (id: string) => {
    setAlarms(prev =>
      prev.map(alarm =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm
      )
    );
  };

  const getNextAlarm = (): Alarm | null => {
    const now = new Date();
    const enabledAlarms = alarms.filter(a => a.enabled);
    
    if (enabledAlarms.length === 0) return null;

    let nextAlarm: Alarm | null = null;
    let minDiff = Infinity;

    enabledAlarms.forEach(alarm => {
      const [hours, minutes] = alarm.time.split(':').map(Number);
      const alarmDate = new Date();
      alarmDate.setHours(hours, minutes, 0, 0);

      if (alarmDate <= now) {
        alarmDate.setDate(alarmDate.getDate() + 1);
      }

      const diff = alarmDate.getTime() - now.getTime();
      if (diff < minDiff) {
        minDiff = diff;
        nextAlarm = alarm;
      }
    });

    return nextAlarm;
  };

  return {
    alarms,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    toggleAlarm,
    getNextAlarm,
  };
};

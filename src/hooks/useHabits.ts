import { useState, useEffect, useCallback } from 'react';
import { Habit, HabitLog } from '../types';
import { getTodayDateString } from '../utils';
import { subDays, format, parseISO } from 'date-fns';

const HABITS_STORAGE_KEY = 'focus_habits';
const LOGS_STORAGE_KEY = 'focus_habit_logs';

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedHabits = localStorage.getItem(HABITS_STORAGE_KEY);
    const storedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
    
    if (storedHabits) {
      try {
        setHabits(JSON.parse(storedHabits));
      } catch (e) {
        console.error("Failed to parse habits", e);
      }
    } else {
      // Default habits for a new user
      const defaultHabits: Habit[] = [
        { id: '1', name: 'Read 10 pages', icon: 'Book', color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400', type: 'boolean', createdAt: getTodayDateString() },
        { id: '2', name: 'Drink Water', icon: 'Droplet', color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400', type: 'numeric', target: 8, unit: 'glasses', createdAt: getTodayDateString() },
        { id: '3', name: 'Exercise', icon: 'Activity', color: 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400', type: 'boolean', createdAt: getTodayDateString() },
      ];
      setHabits(defaultHabits);
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(defaultHabits));
    }

    if (storedLogs) {
      try {
        setLogs(JSON.parse(storedLogs));
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }
    
    setIsLoaded(true);
  }, []);

  // Save to local storage whenever state changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
    }
  }, [habits, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
    }
  }, [logs, isLoaded]);

  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'createdAt'>) => {
    const newHabit: Habit = {
      ...habit,
      id: crypto.randomUUID(),
      createdAt: getTodayDateString(),
    };
    setHabits(prev => [...prev, newHabit]);
  }, []);

  const updateHabit = useCallback((id: string, updates: Partial<Habit>) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, ...updates } : h));
  }, []);

  const deleteHabit = useCallback((id: string) => {
    setHabits(prev => prev.filter(h => h.id !== id));
    setLogs(prev => prev.filter(l => l.habitId !== id));
  }, []);

  const toggleHabit = useCallback((habitId: string, date: string) => {
    setLogs(prev => {
      const existingLog = prev.find(l => l.habitId === habitId && l.date === date);
      if (existingLog) {
        return prev.map(l => l.id === existingLog.id ? { ...l, completed: !l.completed } : l);
      } else {
        return [...prev, { id: crypto.randomUUID(), habitId, date, completed: true }];
      }
    });
  }, []);

  const updateNumericHabit = useCallback((habitId: string, date: string, value: number, completed: boolean) => {
    setLogs(prev => {
      const existingLog = prev.find(l => l.habitId === habitId && l.date === date);
      if (existingLog) {
        return prev.map(l => l.id === existingLog.id ? { ...l, value, completed } : l);
      } else {
        return [...prev, { id: crypto.randomUUID(), habitId, date, completed, value }];
      }
    });
  }, []);

  const getLog = useCallback((habitId: string, date: string) => {
    return logs.find(l => l.habitId === habitId && l.date === date);
  }, [logs]);

  const getStreak = useCallback((habitId: string) => {
    let streak = 0;
    const todayStr = getTodayDateString();
    const todayLog = getLog(habitId, todayStr);
    
    let checkDate = new Date();
    
    if (todayLog?.completed) {
      streak = 1;
      checkDate = subDays(checkDate, 1);
    } else {
      // If today is not completed, we check if yesterday was completed to keep the streak alive
      checkDate = subDays(checkDate, 1);
    }

    while (true) {
      const dateStr = format(checkDate, 'yyyy-MM-dd');
      const log = getLog(habitId, dateStr);
      if (log?.completed) {
        streak++;
        checkDate = subDays(checkDate, 1);
      } else {
        break;
      }
    }
    
    return streak;
  }, [getLog]);

  const getWeeklyProgress = useCallback((date: Date = new Date()) => {
    const weekDates = Array.from({ length: 7 }).map((_, i) => {
      return format(subDays(date, 6 - i), 'yyyy-MM-dd');
    });

    let totalPossible = habits.length * 7;
    let totalCompleted = 0;

    weekDates.forEach(d => {
      habits.forEach(h => {
        const log = getLog(h.id, d);
        if (log?.completed) {
          totalCompleted++;
        }
      });
    });

    return {
      completedCount: totalCompleted,
      totalCount: totalPossible,
      completionRate: totalPossible === 0 ? 0 : totalCompleted / totalPossible,
      weekDates
    };
  }, [habits, getLog]);

  return {
    habits,
    logs,
    isLoaded,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    updateNumericHabit,
    getLog,
    getStreak,
    getWeeklyProgress
  };
}

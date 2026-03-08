import { Habit, HabitLog } from '../types';
import { HabitItem } from './HabitItem';
import { getTodayDateString } from '../utils';

interface HabitListProps {
  habits: Habit[];
  logs: HabitLog[];
  onToggle: (habitId: string, date: string) => void;
  onUpdateValue: (habitId: string, date: string, value: number, completed: boolean) => void;
  getStreak: (habitId: string) => number;
  onDelete: (habitId: string) => void;
}

export function HabitList({ habits, logs, onToggle, onUpdateValue, getStreak, onDelete }: HabitListProps) {
  const today = getTodayDateString();

  return (
    <div className="space-y-4">
      {habits.map((habit) => {
        const log = logs.find(l => l.habitId === habit.id && l.date === today);
        const streak = getStreak(habit.id);

        return (
          <HabitItem
            key={habit.id}
            habit={habit}
            log={log}
            streak={streak}
            onToggle={() => onToggle(habit.id, today)}
            onUpdateValue={(value) => {
              const isCompleted = habit.target ? value >= habit.target : false;
              onUpdateValue(habit.id, today, value, isCompleted);
            }}
            onDelete={() => onDelete(habit.id)}
          />
        );
      })}
      {habits.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-zinc-500 border border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl">
          <p>No habits yet. Add one to get started.</p>
        </div>
      )}
    </div>
  );
}

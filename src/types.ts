export type HabitType = 'boolean' | 'numeric';

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  type: HabitType;
  target?: number; // e.g., 8 glasses of water
  unit?: string; // e.g., 'glasses', 'pages'
  createdAt: string;
}

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
  value?: number; // For numeric habits
}

export interface WeeklyStats {
  completedCount: number;
  totalCount: number;
  completionRate: number;
}

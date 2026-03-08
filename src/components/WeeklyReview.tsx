import { format, parseISO } from 'date-fns';
import { Habit, HabitLog } from '../types';
import { cn } from '../utils';

interface WeeklyReviewProps {
  habits: Habit[];
  logs: HabitLog[];
  weekDates: string[];
}

export function WeeklyReview({ habits, logs, weekDates }: WeeklyReviewProps) {
  return (
    <div className="mt-12">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-6 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-black dark:bg-white"></span>
        Weekly Review
      </h2>
      
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[600px]">
          {/* Header Row */}
          <div className="flex mb-4">
            <div className="w-48 shrink-0"></div>
            <div className="flex-1 flex justify-between">
              {weekDates.map(dateStr => (
                <div key={dateStr} className="flex flex-col items-center w-10">
                  <span className="text-xs font-medium text-gray-400 dark:text-zinc-500 uppercase tracking-wider">
                    {format(parseISO(dateStr), 'EEE')}
                  </span>
                  <span className={cn(
                    "text-sm font-semibold mt-1 w-7 h-7 flex items-center justify-center rounded-full",
                    format(new Date(), 'yyyy-MM-dd') === dateStr 
                      ? "bg-black dark:bg-white text-white dark:text-black" 
                      : "text-gray-700 dark:text-zinc-300"
                  )}>
                    {format(parseISO(dateStr), 'd')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Habit Rows */}
          <div className="space-y-3">
            {habits.map(habit => (
              <div key={habit.id} className="flex items-center">
                <div className="w-48 shrink-0 flex items-center gap-3 pr-4">
                  <div className={cn("w-2 h-2 rounded-full", habit.color.split(' ')[0], habit.color.split(' ')[2])}></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-zinc-300 truncate">{habit.name}</span>
                </div>
                <div className="flex-1 flex justify-between">
                  {weekDates.map(dateStr => {
                    const log = logs.find(l => l.habitId === habit.id && l.date === dateStr);
                    const isCompleted = log?.completed;
                    
                    return (
                      <div key={dateStr} className="w-10 flex justify-center">
                        <div className={cn(
                          "w-6 h-6 rounded-md transition-colors",
                          isCompleted ? "bg-black dark:bg-white" : "bg-gray-100 dark:bg-zinc-800"
                        )}></div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

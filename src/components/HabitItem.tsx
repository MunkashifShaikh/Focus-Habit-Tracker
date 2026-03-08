import { Habit, HabitLog } from '../types';
import * as LucideIcons from 'lucide-react';
import { cn } from '../utils';
import { motion } from 'motion/react';

interface HabitItemProps {
  habit: Habit;
  log?: HabitLog;
  streak: number;
  onToggle: () => void;
  onUpdateValue: (value: number) => void;
  onDelete?: () => void;
}

export function HabitItem({ habit, log, streak, onToggle, onUpdateValue, onDelete }: HabitItemProps) {
  // @ts-ignore - dynamic icon
  const Icon = LucideIcons[habit.icon] || LucideIcons.Circle;
  const isCompleted = log?.completed || false;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200",
        isCompleted 
          ? "bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800" 
          : "bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800/80 hover:border-gray-200 dark:hover:border-zinc-700 hover:shadow-sm"
      )}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <button
          onClick={onToggle}
          className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center transition-colors shrink-0",
            isCompleted ? habit.color : "bg-gray-100 dark:bg-zinc-800 text-gray-400 dark:text-zinc-500 hover:bg-gray-200 dark:hover:bg-zinc-700"
          )}
        >
          <Icon size={24} strokeWidth={isCompleted ? 2.5 : 2} />
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-base truncate transition-colors",
            isCompleted ? "text-gray-500 dark:text-zinc-500 line-through" : "text-gray-900 dark:text-zinc-100"
          )}>
            {habit.name}
          </h3>
          <div className="flex items-center gap-3 mt-1 text-xs font-medium">
            <span className={cn(
              "flex items-center gap-1",
              streak > 0 ? "text-orange-500" : "text-gray-400 dark:text-zinc-500"
            )}>
              <LucideIcons.Flame size={12} className={streak > 0 ? "fill-orange-500" : ""} />
              {streak} {streak === 1 ? 'day' : 'days'}
            </span>
            {habit.type === 'numeric' && habit.target && (
              <span className="text-gray-400 dark:text-zinc-500 flex items-center gap-1">
                <LucideIcons.Target size={12} />
                {log?.value || 0} / {habit.target} {habit.unit}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pl-4 shrink-0">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
           {onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="w-8 h-8 rounded-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 flex items-center justify-center text-gray-400 dark:text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shadow-sm"
            >
              <LucideIcons.Trash2 size={14} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {habit.type === 'numeric' && habit.target && !isCompleted && (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => onUpdateValue(Math.max(0, (log?.value || 0) - 1))}
                className="w-8 h-8 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <LucideIcons.Minus size={16} />
              </button>
              <span className="w-6 text-center font-medium text-sm dark:text-zinc-100">{log?.value || 0}</span>
              <button 
                onClick={() => onUpdateValue(Math.min(habit.target!, (log?.value || 0) + 1))}
                className="w-8 h-8 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <LucideIcons.Plus size={16} />
              </button>
            </div>
          )}
          
          {habit.type === 'boolean' && (
            <button
              onClick={onToggle}
              className={cn(
                "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                isCompleted 
                  ? "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black" 
                  : "border-gray-200 dark:border-zinc-700 text-transparent hover:border-gray-300 dark:hover:border-zinc-600"
              )}
            >
              <LucideIcons.Check size={16} strokeWidth={3} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

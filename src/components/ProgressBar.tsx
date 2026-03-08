import { motion } from 'motion/react';

interface ProgressBarProps {
  completed: number;
  total: number;
}

export function ProgressBar({ completed, total }: ProgressBarProps) {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mb-8 bg-gray-50 dark:bg-zinc-900/50 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Today's Progress</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
            {completed} of {total} habits completed
          </p>
        </div>
        <div className="text-3xl font-light text-gray-900 dark:text-zinc-100 tracking-tighter">
          {percentage}%
        </div>
      </div>
      
      <div className="h-2 w-full bg-gray-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-black dark:bg-white rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

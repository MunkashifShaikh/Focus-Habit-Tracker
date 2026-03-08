import { useState } from 'react';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { HabitList } from './components/HabitList';
import { WeeklyReview } from './components/WeeklyReview';
import { AddHabitModal } from './components/AddHabitModal';
import { useHabits } from './hooks/useHabits';
import { getTodayDateString } from './utils';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  const {
    habits,
    logs,
    isLoaded,
    addHabit,
    toggleHabit,
    updateNumericHabit,
    getStreak,
    getWeeklyProgress,
    deleteHabit
  } = useHabits();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950"><div className="w-8 h-8 border-4 border-gray-200 dark:border-zinc-800 border-t-black dark:border-t-white rounded-full animate-spin"></div></div>;
  }

  const todayStr = getTodayDateString();
  const todayLogs = logs.filter(l => l.date === todayStr && l.completed);
  const completedToday = todayLogs.length;
  const totalHabits = habits.length;
  
  const weeklyProgress = getWeeklyProgress();

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 font-sans selection:bg-gray-200 dark:selection:bg-zinc-800 selection:text-black dark:selection:text-white transition-colors duration-200">
      <div className="max-w-2xl mx-auto px-6 py-8">
        <Header />
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ProgressBar completed={completedToday} total={totalHabits} />
          
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">Today's Habits</h2>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900"
            >
              <Plus size={16} />
              Add Habit
            </button>
          </div>
          
          <HabitList 
            habits={habits} 
            logs={logs} 
            onToggle={toggleHabit} 
            onUpdateValue={updateNumericHabit}
            getStreak={getStreak}
            onDelete={deleteHabit}
          />
          
          <WeeklyReview 
            habits={habits} 
            logs={logs} 
            weekDates={weeklyProgress.weekDates} 
          />
        </motion.main>
      </div>

      <AddHabitModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={addHabit} 
      />
    </div>
  );
}

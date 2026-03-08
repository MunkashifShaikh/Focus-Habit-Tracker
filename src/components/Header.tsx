import { format } from 'date-fns';
import { Target, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function Header() {
  const today = new Date();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleDark = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  return (
    <header className="flex items-center justify-between py-6 border-b border-gray-100 dark:border-zinc-800 mb-8 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-xl flex items-center justify-center transition-colors">
          <Target size={20} />
        </div>
        <div>
          <h1 className="font-semibold text-gray-900 dark:text-zinc-100 leading-tight transition-colors">Focus</h1>
          <p className="text-sm text-gray-500 dark:text-zinc-400 transition-colors">{format(today, 'EEEE, MMMM do')}</p>
        </div>
      </div>
      <button 
        onClick={toggleDark} 
        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </header>
  );
}

import { useState, useEffect, useRef } from 'react';
import { HabitType } from '../types';
import * as LucideIcons from 'lucide-react';
import { cn } from '../utils';

interface AddHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (habit: { name: string; icon: string; color: string; type: HabitType; target?: number; unit?: string }) => void;
}

const ICONS = ['Book', 'Droplet', 'Activity', 'Coffee', 'Sun', 'Moon', 'Heart', 'Star', 'Zap', 'Music'];
const COLORS = [
  'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
  'bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400',
  'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400',
  'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/20 dark:text-yellow-400',
  'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400',
  'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400',
  'bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400',
  'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
];

export function AddHabitModal({ isOpen, onClose, onAdd }: AddHabitModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [type, setType] = useState<HabitType>('boolean');
  const [target, setTarget] = useState<number>(1);
  const [unit, setUnit] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    onAdd({
      name: name.trim(),
      icon,
      color,
      type,
      target: type === 'numeric' ? target : undefined,
      unit: type === 'numeric' ? unit : undefined,
    });
    
    // Reset form
    setName('');
    setIcon(ICONS[0]);
    setColor(COLORS[0]);
    setType('boolean');
    setTarget(1);
    setUnit('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 dark:bg-black/70 backdrop-blur-sm overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="bg-white dark:bg-zinc-900 rounded-3xl w-full max-w-md p-6 shadow-xl border border-gray-100 dark:border-zinc-800 my-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-zinc-100">New Habit</h2>
          <button onClick={onClose} className="p-2 text-gray-400 dark:text-zinc-500 hover:text-gray-600 dark:hover:text-zinc-300 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
            <LucideIcons.X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Read 10 pages"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setType('boolean')}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl border font-medium text-sm transition-all",
                  type === 'boolean' ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
                )}
              >
                Yes / No
              </button>
              <button
                type="button"
                onClick={() => setType('numeric')}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl border font-medium text-sm transition-all",
                  type === 'numeric' ? "bg-black dark:bg-white text-white dark:text-black border-black dark:border-white" : "bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600"
                )}
              >
                Numeric Target
              </button>
            </div>
          </div>

          {type === 'numeric' && (
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Target</label>
                <input
                  type="number"
                  min="1"
                  value={target}
                  onChange={(e) => setTarget(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. glasses"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-zinc-700 bg-transparent dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Icon</label>
            <div className="grid grid-cols-5 gap-3">
              {ICONS.map((iconName) => {
                // @ts-ignore
                const Icon = LucideIcons[iconName];
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setIcon(iconName)}
                    className={cn(
                      "aspect-square rounded-xl flex items-center justify-center transition-all",
                      icon === iconName ? "bg-gray-900 dark:bg-white text-white dark:text-black" : "bg-gray-50 dark:bg-zinc-800/50 text-gray-500 dark:text-zinc-400 hover:bg-gray-100 dark:hover:bg-zinc-800"
                    )}
                  >
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-zinc-300 mb-2">Color</label>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                    c.split(' ')[0],
                    c.split(' ')[2],
                    color === c ? "ring-2 ring-offset-2 ring-black dark:ring-white dark:ring-offset-zinc-900" : "hover:scale-110"
                  )}
                >
                  {color === c && <LucideIcons.Check size={16} className={cn(c.split(' ')[1], c.split(' ')[3])} />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-medium hover:bg-gray-900 dark:hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            Create Habit
          </button>
        </form>
      </div>
    </div>
  );
}

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'pill' | 'icon';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  showLabel = false,
  variant = 'icon'
}) => {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  if (variant === 'pill') {
    return (
      <button
        id="theme-toggle-pill"
        onClick={toggleTheme}
        type="button"
        className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
          isDark 
            ? 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:bg-slate-800' 
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-xs'
        } ${className}`}
        title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      >
        <div className="relative w-4 h-4 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {isDark ? (
              <motion.div
                key="dark"
                initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                transition={{ duration: 0.18 }}
              >
                <Moon className="w-4 h-4 text-emerald-400" />
              </motion.div>
            ) : (
              <motion.div
                key="light"
                initial={{ opacity: 0, rotate: 90, scale: 0.5 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -90, scale: 0.5 }}
                transition={{ duration: 0.18 }}
              >
                <Sun className="w-4 h-4 text-amber-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <span className="text-xs font-semibold">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      </button>
    );
  }

  return (
    <motion.button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
      className={`relative p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
        isDark 
          ? 'bg-slate-800/80 border-slate-700/80 text-slate-200 hover:bg-slate-700 hover:text-white' 
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-xs'
      } ${className}`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: -60, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.7 }}
            transition={{ duration: 0.18 }}
          >
            <Moon className="w-4 h-4 text-emerald-400" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: 60, scale: 0.7 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: -60, scale: 0.7 }}
            transition={{ duration: 0.18 }}
          >
            <Sun className="w-4 h-4 text-amber-500" />
          </motion.div>
        )}
      </AnimatePresence>
      {showLabel && (
        <span className="ml-2 text-xs font-semibold">
          {isDark ? 'Dark' : 'Light'}
        </span>
      )}
    </motion.button>
  );
};

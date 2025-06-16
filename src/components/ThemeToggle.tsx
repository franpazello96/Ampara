'use client';

import { useTheme } from './ThemeProvider';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="bg-white/25 p-2 rounded-2xl fixed top-4 right-4 z-50"
    >
      {theme === 'dark' ? <Moon size={24} /> : <Sun size={24} />}
    </button>
  );
}

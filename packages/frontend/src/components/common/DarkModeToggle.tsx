import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../../hooks/useDarkMode';

export function DarkModeToggle() {
  const { theme, toggle } = useDarkMode();

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full text-app-text-secondary hover:bg-app-bg-tertiary transition-colors"
      aria-label="切换暗色模式"
    >
      {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

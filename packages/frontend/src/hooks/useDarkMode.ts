import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export function useDarkMode() {
  const { theme, toggle, setTheme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const stored = localStorage.getItem('ai-news-theme');
    if (!stored) {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      if (mq.matches) setTheme('dark');
      const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [setTheme]);

  return { theme, toggle };
}

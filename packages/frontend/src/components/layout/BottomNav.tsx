import { NavLink } from 'react-router-dom';
import { Home, Search, Bookmark, Sparkles } from 'lucide-react';
import { useBookmarks } from '../../hooks/useBookmarks';

const navItems = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/digest', icon: Sparkles, label: '日报' },
  { to: '/search', icon: Search, label: '搜索' },
  { to: '/bookmarks', icon: Bookmark, label: '书签' },
];

export function BottomNav() {
  const { count } = useBookmarks();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-app-bg-primary/80 backdrop-blur-md border-t border-app-border pb-safe">
      <div className="max-w-app mx-auto flex items-center justify-around h-14 px-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `relative flex flex-col items-center justify-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
                isActive ? 'text-app-accent' : 'text-app-text-tertiary hover:text-app-text-secondary'
              }`
            }
          >
            <Icon size={22} />
            <span className="text-[10px] font-medium">{label}</span>
            {label === '书签' && count > 0 && (
              <span className="absolute top-0 right-0 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] px-1">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

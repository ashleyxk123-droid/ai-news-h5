import { NavLink } from 'react-router-dom';
import { Home, Search, Bookmark, Sparkles } from 'lucide-react';
import { useBookmarks } from '../../hooks/useBookmarks';

const navItems = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/digest', icon: Sparkles, label: '日报' },
  { to: '/search', icon: Search, label: '搜索' },
  { to: '/bookmarks', icon: Bookmark, label: '书签' },
];

export function Sidebar() {
  const { count } = useBookmarks();

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-screen sticky top-0 border-r border-app-border bg-app-bg-secondary px-3 py-4">
      <NavLink to="/" className="font-bold text-lg text-app-text-primary mb-6 px-3">
        🤖 AI 科技新闻
      </NavLink>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-app-accent text-white'
                  : 'text-app-text-secondary hover:bg-app-bg-tertiary hover:text-app-text-primary'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
            {label === '书签' && count > 0 && (
              <span className="ml-auto min-w-[20px] h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs px-1.5">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-app-border">
        <p className="text-[11px] text-app-text-tertiary px-3">
          每天了解最新 AI 资讯与科普
        </p>
      </div>
    </aside>
  );
}

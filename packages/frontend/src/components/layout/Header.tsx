import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { DarkModeToggle } from '../common/DarkModeToggle';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  backTo?: string;
}

export function Header({ title, showBack, backTo = '/' }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-app-bg-primary/80 backdrop-blur-md border-b border-app-border">
      <div className="flex items-center justify-between h-12 px-4 md:px-6">
        <div className="flex items-center gap-2">
          {showBack ? (
            <Link to={backTo} className="text-app-accent font-medium text-sm">
              ← 返回
            </Link>
          ) : (
            <Link to="/" className="font-bold text-lg text-app-text-primary md:hidden">
              🤖 AI 科技新闻
            </Link>
          )}
        </div>

        {title && (
          <h1 className="absolute left-1/2 -translate-x-1/2 font-medium text-sm text-app-text-primary truncate max-w-[200px]">
            {title}
          </h1>
        )}

        <div className="flex items-center gap-1 md:ml-auto">
          <Link
            to="/search"
            className="p-2 rounded-full text-app-text-secondary hover:bg-app-bg-tertiary transition-colors md:hidden"
            aria-label="搜索"
          >
            <Search size={20} />
          </Link>
          <DarkModeToggle />
        </div>
      </div>
    </header>
  );
}

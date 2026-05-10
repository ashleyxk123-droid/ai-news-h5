import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import type { CategoryInfo } from '../../types';

interface CategoryTabsProps {
  categories: CategoryInfo[];
}

export function CategoryTabs({ categories }: CategoryTabsProps) {
  const { categoryId } = useParams<{ categoryId: string }>();
  const active = categoryId || 'all';
  const navigate = useNavigate();
  const tabsRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const allTabs = [{ id: 'all', nameZh: '全部', nameEn: 'All' }, ...categories];

  useEffect(() => {
    const idx = allTabs.findIndex(t => t.id === active);
    if (idx >= 0) setActiveIndex(idx);
  }, [active]);

  return (
    <div className="sticky top-12 z-30 bg-app-bg-primary border-b border-app-border">
      <div
        ref={tabsRef}
        className="flex gap-1 overflow-x-auto px-4 md:px-6 py-2 hide-scrollbar"
      >
        {allTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id === 'all' ? '/' : `/category/${tab.id}`)}
            className={`shrink-0 px-3 md:px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              active === tab.id
                ? 'bg-app-accent text-white'
                : 'bg-app-bg-tertiary text-app-text-secondary hover:text-app-text-primary'
            }`}
          >
            {tab.nameZh}
          </button>
        ))}
      </div>
    </div>
  );
}

import { useRef, useEffect, useCallback } from 'react';
import type { Article, CategoryInfo } from '../../types';
import { NewsCard } from './NewsCard';
import { NewsCardSkeleton } from './NewsCardSkeleton';

interface NewsListProps {
  articles: Article[];
  categories: CategoryInfo[];
  isLoading: boolean;
  hasMore: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export function NewsList({
  articles,
  isLoading,
  hasMore,
  isFetchingNextPage,
  onLoadMore,
}: NewsListProps) {
  const observerRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !isFetchingNextPage) {
        onLoadMore();
      }
    },
    [hasMore, isFetchingNextPage, onLoadMore]
  );

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleIntersect, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleIntersect]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-4 md:p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <NewsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:p-4">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
      <div ref={observerRef} className="h-px" />
      {isFetchingNextPage && (
        <div className="py-4 text-center text-sm text-app-text-tertiary">
          加载中...
        </div>
      )}
      {!hasMore && articles.length > 0 && (
        <div className="py-6 text-center text-sm text-app-text-tertiary">
          — 已经到底了 —
        </div>
      )}
    </div>
  );
}

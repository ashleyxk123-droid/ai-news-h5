import { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchNews } from '../utils/api';
import { NewsCard } from '../components/news/NewsCard';
import { NewsCardSkeleton } from '../components/news/NewsCardSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Search, X } from 'lucide-react';

export function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query.trim()), 400);
    return () => clearTimeout(timer);
  }, [query]);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['news', 'search', debouncedQuery],
    queryFn: ({ pageParam = 1 }) =>
      fetchNews({ q: debouncedQuery, page: pageParam, pageSize: 20 }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
    enabled: debouncedQuery.length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const articles = data?.pages.flatMap((p) => p.data) ?? [];

  return (
    <div>
      <div className="sticky top-12 z-30 bg-app-bg-primary border-b border-app-border px-4 py-2">
        <div className="flex items-center gap-2 bg-app-bg-tertiary rounded-lg px-3 py-2">
          <Search size={18} className="text-app-text-tertiary shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索AI新闻..."
            className="flex-1 bg-transparent text-sm text-app-text-primary placeholder:text-app-text-tertiary outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-0.5 rounded-full text-app-text-tertiary hover:text-app-text-primary"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {!debouncedQuery ? (
        <EmptyState
          icon={<Search size={48} />}
          title="搜索AI科技新闻"
          description="输入关键词搜索"
        />
      ) : isLoading ? (
        <div>
          {Array.from({ length: 4 }).map((_, i) => (
            <NewsCardSkeleton key={i} />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <EmptyState title="未找到相关文章" description={`没有找到与 "${debouncedQuery}" 相关的内容`} />
      ) : (
        <div>
          <p className="px-4 py-2 text-xs text-app-text-tertiary">
            搜索 "{debouncedQuery}" 找到 {data?.pages[0]?.total || 0} 条结果
          </p>
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
          {isFetchingNextPage && (
            <div className="py-4 text-center text-sm text-app-text-tertiary">加载中...</div>
          )}
        </div>
      )}
    </div>
  );
}

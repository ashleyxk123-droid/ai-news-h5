import { useParams } from 'react-router-dom';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchNews, fetchDigest } from '../utils/api';
import { CategoryTabs } from '../components/news/CategoryTabs';
import { NewsList } from '../components/news/NewsList';
import { DigestCard } from '../components/digest/DigestCard';
import { EmptyState } from '../components/common/EmptyState';
import { useEffect } from 'react';

export function HomePage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId || '';

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryKey: ['news', category],
    queryFn: ({ pageParam = 1 }) => fetchNews({ category, page: pageParam, pageSize: 20 }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
  });

  const { data: digestData } = useQuery({
    queryKey: ['digest'],
    queryFn: fetchDigest,
    staleTime: 10 * 60 * 1000,
    enabled: !category,
  });

  const articles = data?.pages.flatMap((p) => p.data) ?? [];
  const categories = data?.pages[0]?.categories ?? [];
  const digest = digestData?.data;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category]);

  return (
    <div>
      <CategoryTabs categories={categories} />
      {!category && digest && (
        <div className="md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-0 md:px-0">
          <div className="md:col-span-full">
            <DigestCard digest={digest} />
          </div>
        </div>
      )}
      {error ? (
        <EmptyState title="加载失败" description="请检查网络连接后重试" />
      ) : (
        <NewsList
          articles={articles}
          categories={categories}
          isLoading={isLoading}
          hasMore={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={fetchNextPage}
        />
      )}
    </div>
  );
}

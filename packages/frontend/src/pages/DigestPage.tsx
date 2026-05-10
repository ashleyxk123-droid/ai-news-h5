import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fetchDigest } from '../utils/api';
import { NewsCard } from '../components/news/NewsCard';
import { EmptyState } from '../components/common/EmptyState';
import { Sparkles } from 'lucide-react';

const categoryNameMap: Record<string, string> = {
  llm: '大语言模型', robotics: '机器人', academic: '学术前沿',
  cv: '计算机视觉', industry: '行业应用', 'ai-safety': 'AI安全', agi: 'AGI',
};

export function DigestPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['digest'],
    queryFn: fetchDigest,
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="p-4 space-y-4 skeleton-pulse">
        <div className="h-6 bg-app-skeleton rounded w-1/2" />
        <div className="h-4 bg-app-skeleton rounded w-3/4" />
        <div className="h-20 bg-app-skeleton rounded" />
      </div>
    );
  }

  if (error || !data?.data) {
    return <EmptyState title="日报加载失败" description="请稍后重试" />;
  }

  const digest = data.data;

  return (
    <div>
      <div className="sticky top-12 z-30 bg-app-bg-primary border-b border-app-border px-4 py-3">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} className="text-blue-500" />
          <h2 className="text-lg font-bold text-app-text-primary">AI 今日速览</h2>
        </div>
        <p className="text-xs text-app-text-tertiary">
          {format(new Date(digest.date), 'yyyy年M月d日')} · {digest.totalArticles} 篇文章 · {digest.sourceCount} 个来源
        </p>
      </div>

      {/* Top Stories */}
      <section className="border-b border-app-border">
        <h3 className="px-4 py-3 text-sm font-semibold text-app-text-secondary">
          头条精选
        </h3>
        {digest.topStories.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </section>

      {/* By Category */}
      {digest.categories.map((cat) => (
        <section key={cat.categoryId} className="border-b border-app-border">
          <h3 className="px-4 py-3 text-sm font-semibold text-app-text-secondary">
            {categoryNameMap[cat.categoryId] || cat.categoryNameZh}
          </h3>
          {cat.topArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </section>
      ))}
    </div>
  );
}

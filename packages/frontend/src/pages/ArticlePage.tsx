import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchArticle } from '../utils/api';
import { fullDate } from '../utils/formatDate';
import { BookmarkButton } from '../components/news/BookmarkButton';
import { NewsCard } from '../components/news/NewsCard';
import { EmptyState } from '../components/common/EmptyState';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import '../styles/article.css';

const categoryNameMap: Record<string, string> = {
  llm: '大语言模型', robotics: '机器人', academic: '学术前沿',
  cv: '计算机视觉', industry: '行业应用', 'ai-safety': 'AI安全', agi: 'AGI',
};

export function ArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => fetchArticle(articleId!),
    enabled: !!articleId,
    staleTime: 10 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="p-4 md:max-w-[720px] md:mx-auto md:py-8 space-y-3 skeleton-pulse">
        <div className="h-4 bg-app-skeleton rounded w-1/3" />
        <div className="h-6 bg-app-skeleton rounded w-3/4" />
        <div className="h-3 bg-app-skeleton rounded w-full" />
        <div className="h-3 bg-app-skeleton rounded w-full" />
        <div className="h-3 bg-app-skeleton rounded w-2/3" />
      </div>
    );
  }

  if (error || !data) {
    return <EmptyState title="文章加载失败" description="请返回重试" />;
  }

  const { data: article, related } = data;

  return (
    <div>
      <div className="sticky top-12 z-30 bg-app-bg-primary/80 backdrop-blur-md border-b border-app-border px-4 h-11 flex items-center gap-3">
        <Link to="/" className="text-app-accent">
          <ArrowLeft size={20} />
        </Link>
        <span className="text-sm text-app-text-secondary truncate">{article.sourceName}</span>
      </div>

      <article className="p-4 md:max-w-[720px] md:mx-auto md:py-8">
        <h1 className="text-xl md:text-2xl font-bold text-app-text-primary leading-snug mb-3">
          {article.title}
        </h1>

        <div className="flex items-center flex-wrap gap-2 mb-4 text-xs text-app-text-tertiary">
          <span className="font-medium text-app-text-secondary">{article.sourceName}</span>
          <span>{fullDate(article.publishedAt, article.language)}</span>
          {article.language === 'en' && (
            <span className="px-1.5 py-0.5 rounded bg-app-bg-tertiary">EN</span>
          )}
          {article.category && (
            <span className="px-1.5 py-0.5 rounded bg-app-tag-bg text-app-tag-text font-medium">
              {categoryNameMap[article.category] || article.category}
            </span>
          )}
          {article.author && <span>作者: {article.author}</span>}
        </div>

        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-app-border">
          <BookmarkButton article={article} />
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-app-bg-tertiary text-app-text-secondary hover:text-app-accent transition-colors"
          >
            <ExternalLink size={14} />
            阅读原文
          </a>
        </div>

        {article.content ? (
          <div
            className="article-body article-detail"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        ) : (
          <div className="text-app-text-secondary leading-relaxed whitespace-pre-wrap">
            {article.summary}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <div className="border-t border-app-border pt-2 mt-4 md:max-w-[900px] md:mx-auto">
          <h3 className="px-4 md:px-6 py-3 text-sm font-semibold text-app-text-secondary">
            相关文章
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-4 md:px-4">
            {related.map((r) => (
              <NewsCard key={r.id} article={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

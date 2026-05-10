import { Link } from 'react-router-dom';
import type { Article } from '../../types';
import { relativeTime } from '../../utils/formatDate';
import { BookmarkButton } from './BookmarkButton';

interface NewsCardProps {
  article: Article;
}

const categoryColorMap: Record<string, string> = {
  llm: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  robotics: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  academic: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  cv: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  industry: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300',
  'ai-safety': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  agi: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
};

const categoryNameMap: Record<string, string> = {
  llm: 'LLM',
  robotics: '机器人',
  academic: '学术',
  cv: '视觉',
  industry: '行业',
  'ai-safety': '安全',
  agi: 'AGI',
};

export function NewsCard({ article }: NewsCardProps) {
  const showTitle = article.titleZh || article.title;
  const showSummary = article.summaryZh || article.summary;
  const isTranslated = !!article.titleZh;

  return (
    <Link
      to={`/article/${article.id}`}
      className="block p-4 border-b border-app-border md:border md:rounded-xl md:shadow-sm hover:bg-app-bg-secondary md:hover:shadow-md active:bg-app-bg-tertiary transition-all"
    >
      <div className="flex gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-medium text-app-text-primary leading-snug line-clamp-2 mb-2">
            {showTitle}
          </h3>
          <p className="text-[13px] text-app-text-secondary leading-relaxed line-clamp-2 mb-2.5">
            {showSummary}
          </p>
          <div className="flex items-center gap-2 text-xs text-app-text-tertiary">
            <span className="font-medium text-app-text-secondary">{article.sourceName}</span>
            <span>·</span>
            <span>{relativeTime(article.publishedAt, article.language)}</span>
            {article.language === 'en' && (
              <span className="px-1.5 py-0.5 rounded bg-app-bg-tertiary text-[10px]">EN</span>
            )}
            {isTranslated && (
              <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-[10px]">中文</span>
            )}
            {article.category && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${categoryColorMap[article.category] || 'bg-gray-100 text-gray-600'}`}>
                {categoryNameMap[article.category] || article.category}
              </span>
            )}
          </div>
        </div>
        <div className="shrink-0 flex flex-col items-center justify-start gap-2">
          {article.imageUrl && (
            <img
              src={article.imageUrl}
              alt=""
              className="w-16 h-16 rounded-lg object-cover bg-app-bg-tertiary"
              loading="lazy"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          )}
          <BookmarkButton article={article} />
        </div>
      </div>
    </Link>
  );
}

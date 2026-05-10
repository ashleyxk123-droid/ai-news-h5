import { useBookmarks } from '../hooks/useBookmarks';
import { NewsCard } from '../components/news/NewsCard';
import { EmptyState } from '../components/common/EmptyState';
import { Bookmark, Trash2 } from 'lucide-react';

export function BookmarksPage() {
  const { bookmarkedArticles, removeAll, count } = useBookmarks();

  return (
    <div>
      <div className="sticky top-12 z-30 bg-app-bg-primary border-b border-app-border px-4 h-11 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-app-text-primary">我的收藏 ({count})</h2>
        {count > 0 && (
          <button
            onClick={removeAll}
            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
          >
            <Trash2 size={14} />
            清空
          </button>
        )}
      </div>
      {bookmarkedArticles.length === 0 ? (
        <EmptyState
          icon={<Bookmark size={48} />}
          title="还没有收藏"
          description="浏览文章时点击书签图标即可收藏"
        />
      ) : (
        <div>
          {bookmarkedArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}

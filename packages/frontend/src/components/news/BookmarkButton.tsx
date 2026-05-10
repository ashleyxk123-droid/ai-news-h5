import { Bookmark } from 'lucide-react';
import { useBookmarks } from '../../hooks/useBookmarks';
import type { Article } from '../../types';
import toast from 'react-hot-toast';

interface BookmarkButtonProps {
  article: Article;
  className?: string;
}

export function BookmarkButton({ article, className = '' }: BookmarkButtonProps) {
  const { isBookmarked, toggle } = useBookmarks();
  const bookmarked = isBookmarked(article.id);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(article);
    toast.success(bookmarked ? '已取消收藏' : '已收藏');
  };

  return (
    <button
      onClick={handleToggle}
      className={`p-2 rounded-full transition-colors ${className} ${
        bookmarked
          ? 'text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
          : 'text-app-text-tertiary hover:bg-app-bg-tertiary'
      }`}
      aria-label={bookmarked ? '取消收藏' : '收藏'}
    >
      <Bookmark size={18} fill={bookmarked ? 'currentColor' : 'none'} />
    </button>
  );
}

import { useBookmarkStore } from '../store/bookmarkStore';
import type { Article } from '../types';

export function useBookmarks() {
  const { bookmarkedIds, bookmarkedArticles, toggle, isBookmarked, getAll, removeAll } = useBookmarkStore();

  return {
    bookmarkedIds,
    bookmarkedArticles,
    toggle: (article: Article) => toggle(article),
    isBookmarked: (id: string) => isBookmarked(id),
    getAll,
    removeAll,
    count: bookmarkedIds.length,
  };
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Article } from '../types';

interface BookmarkState {
  bookmarkedIds: string[];
  bookmarkedArticles: Article[];
  toggle: (article: Article) => void;
  isBookmarked: (id: string) => boolean;
  getAll: () => Article[];
  removeAll: () => void;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarkedIds: [],
      bookmarkedArticles: [],
      toggle: (article) => {
        const { bookmarkedIds, bookmarkedArticles } = get();
        if (bookmarkedIds.includes(article.id)) {
          set({
            bookmarkedIds: bookmarkedIds.filter(id => id !== article.id),
            bookmarkedArticles: bookmarkedArticles.filter(a => a.id !== article.id),
          });
        } else {
          set({
            bookmarkedIds: [...bookmarkedIds, article.id],
            bookmarkedArticles: [...bookmarkedArticles, article],
          });
        }
      },
      isBookmarked: (id) => get().bookmarkedIds.includes(id),
      getAll: () => get().bookmarkedArticles,
      removeAll: () => set({ bookmarkedIds: [], bookmarkedArticles: [] }),
    }),
    { name: 'ai-news-bookmarks' }
  )
);

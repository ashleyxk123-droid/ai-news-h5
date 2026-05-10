import { createHashRouter } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { ArticlePage } from './pages/ArticlePage';
import { SearchPage } from './pages/SearchPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { DigestPage } from './pages/DigestPage';

export const router = createHashRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'category/:categoryId', element: <HomePage /> },
      { path: 'article/:articleId', element: <ArticlePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'bookmarks', element: <BookmarksPage /> },
      { path: 'digest', element: <DigestPage /> },
    ],
  },
]);

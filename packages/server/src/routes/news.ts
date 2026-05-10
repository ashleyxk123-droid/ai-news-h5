import { Router, Request, Response } from 'express';
import { fetchAllFeeds, getArticleById, searchArticles, filterByCategory } from '../services/rssFetcher.js';
import { generateDigest } from '../services/digestService.js';
import { getAllCategories } from '../services/categorizer.js';
import { FEED_SOURCES } from '../services/feedSources.js';

export const newsRouter = Router();

newsRouter.get('/news', async (req: Request, res: Response) => {
  try {
    const category = (req.query.category as string) || '';
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const lang = (req.query.lang as 'zh' | 'en' | 'all') || 'all';
    const query = (req.query.q as string) || '';

    let articles = await fetchAllFeeds({ lang });

    if (query) {
      articles = searchArticles(articles, query);
    }

    if (category && category !== 'all') {
      articles = filterByCategory(articles, category);
    }

    const total = articles.length;
    const start = (page - 1) * pageSize;
    const paged = articles.slice(start, start + pageSize);

    res.json({
      data: paged,
      page,
      pageSize,
      total,
      hasMore: start + pageSize < total,
      categories: getAllCategories(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error fetching news:', err);
    res.status(500).json({ error: 'Failed to fetch news', message: (err as Error).message });
  }
});

newsRouter.get('/news/:id', async (req: Request, res: Response) => {
  try {
    const articles = await fetchAllFeeds();
    const article = getArticleById(articles, req.params.id);
    if (!article) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }

    const relatedArticles = articles
      .filter(a => a.id !== article.id && a.category === article.category)
      .slice(0, 5);

    res.json({ data: article, related: relatedArticles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch article' });
  }
});

newsRouter.get('/categories', (_req: Request, res: Response) => {
  res.json({ data: getAllCategories() });
});

newsRouter.get('/digest', async (req: Request, res: Response) => {
  try {
    const articles = await fetchAllFeeds();
    const digest = generateDigest(articles);
    res.json({ data: digest });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate digest' });
  }
});

newsRouter.get('/search', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string) || '';
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    if (!query.trim()) {
      res.json({ data: [], page: 1, pageSize, total: 0, hasMore: false });
      return;
    }

    const articles = await fetchAllFeeds();
    const results = searchArticles(articles, query);
    const total = results.length;
    const start = (page - 1) * pageSize;
    const paged = results.slice(start, start + pageSize);

    res.json({
      data: paged,
      page,
      pageSize,
      total,
      hasMore: start + pageSize < total,
    });
  } catch (err) {
    res.status(500).json({ error: 'Search failed' });
  }
});

newsRouter.get('/sources', (_req: Request, res: Response) => {
  res.json({
    data: FEED_SOURCES.map(s => ({
      id: s.id,
      name: s.name,
      language: s.language,
      defaultCategory: s.defaultCategory,
    })),
  });
});

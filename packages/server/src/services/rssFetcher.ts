import Parser from 'rss-parser';
import { FEED_SOURCES } from './feedSources.js';
import { detectCategory } from './categorizer.js';
import { sanitize, sanitizeFull, extractImage } from '../utils/sanitizer.js';
import { apiCache, feedCache } from '../utils/cache.js';

const parser = new Parser({
  timeout: 15000,
  maxRedirects: 3,
  headers: {
    'User-Agent': 'AI-News-H5/1.0 (RSS Reader)',
  },
});

export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  sourceId: string;
  sourceName: string;
  sourceUrl: string;
  language: 'zh' | 'en';
  category: string;
  publishedAt: string;
  url: string;
  imageUrl?: string;
  author?: string;
}

function hashUrl(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

async function fetchSingleFeed(source: typeof FEED_SOURCES[0]): Promise<Article[]> {
  const cacheKey = `feed:${source.id}`;
  const cached = feedCache.get<Article[]>(cacheKey);
  if (cached) return cached;

  const tryFetch = async (url: string): Promise<Article[]> => {
    const feed = await parser.parseURL(url);
    return feed.items.map((item) => {
      const title = item.title || '';
      const rawContent = item['content:encoded'] || item.content || '';
      const summary = sanitize(item.contentSnippet || item.content || '', 250);
      return {
        id: hashUrl(item.link || title),
        title,
        summary,
        content: sanitizeFull(rawContent),
        sourceId: source.id,
        sourceName: source.name,
        sourceUrl: source.url,
        language: source.language,
        category: detectCategory(title, summary, source.defaultCategory),
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
        url: item.link || '',
        imageUrl: extractImage(item),
        author: item.creator || item.author,
      };
    });
  };

  try {
    const articles = await tryFetch(source.url);
    feedCache.set(cacheKey, articles);
    return articles;
  } catch (err) {
    console.error(`Failed to fetch ${source.name} (${source.id}):`, (err as Error).message);
    if (source.fallbackUrl) {
      try {
        const articles = await tryFetch(source.fallbackUrl);
        feedCache.set(cacheKey, articles);
        return articles;
      } catch (err2) {
        console.error(`Fallback also failed for ${source.name}`);
      }
    }
    return [];
  }
}

export async function fetchAllFeeds(options: {
  sources?: string[];
  lang?: 'zh' | 'en' | 'all';
} = {}): Promise<Article[]> {
  const cacheKey = `all:${options.lang || 'all'}:${options.sources?.join(',') || 'all'}`;
  const cached = apiCache.get<Article[]>(cacheKey);
  if (cached) return cached;

  let sources = FEED_SOURCES;
  if (options.lang && options.lang !== 'all') {
    sources = sources.filter(s => s.language === options.lang);
  }
  if (options.sources?.length) {
    sources = sources.filter(s => options.sources.includes(s.id));
  }

  const results = await Promise.allSettled(sources.map(s => fetchSingleFeed(s)));

  const allArticles: Article[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') allArticles.push(...r.value);
  }

  allArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  apiCache.set(cacheKey, allArticles);
  return allArticles;
}

export function getArticleById(articles: Article[], id: string): Article | undefined {
  return articles.find(a => a.id === id);
}

export function searchArticles(articles: Article[], query: string): Article[] {
  const q = query.toLowerCase();
  return articles.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.summary.toLowerCase().includes(q) ||
    a.sourceName.toLowerCase().includes(q)
  );
}

export function filterByCategory(articles: Article[], category: string): Article[] {
  if (!category || category === 'all') return articles;
  return articles.filter(a => a.category === category);
}

import { Article } from './rssFetcher.js';
import { getAllCategories } from './categorizer.js';

export interface DigestItem {
  categoryId: string;
  categoryNameZh: string;
  categoryNameEn: string;
  topArticles: Article[];
}

export interface DailyDigest {
  date: string;
  totalArticles: number;
  sourceCount: number;
  categories: DigestItem[];
  topStories: Article[];
}

export function generateDigest(articles: Article[]): DailyDigest {
  const categories = getAllCategories();
  const sourceIds = new Set(articles.map(a => a.sourceId));

  const digestCategories: DigestItem[] = categories.map(cat => {
    const catArticles = articles
      .filter(a => a.category === cat.id)
      .slice(0, 3);
    return {
      categoryId: cat.id,
      categoryNameZh: cat.nameZh,
      categoryNameEn: cat.nameEn,
      topArticles: catArticles,
    };
  }).filter(d => d.topArticles.length > 0);

  const topStories = articles.slice(0, 10);

  return {
    date: new Date().toISOString().split('T')[0],
    totalArticles: articles.length,
    sourceCount: sourceIds.size,
    categories: digestCategories,
    topStories,
  };
}

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
  titleZh?: string;
  summaryZh?: string;
}

export interface CategoryInfo {
  id: string;
  nameZh: string;
  nameEn: string;
}

export interface NewsResponse {
  data: Article[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
  categories: CategoryInfo[];
  timestamp: string;
}

export interface ArticleResponse {
  data: Article;
  related: Article[];
}

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

export type Theme = 'light' | 'dark';

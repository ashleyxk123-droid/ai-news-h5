import axios from 'axios';
import type { NewsResponse, ArticleResponse, DailyDigest, CategoryInfo, Article } from '../types';

const BASE = import.meta.env.BASE_URL;
const isStatic = !!import.meta.env.VITE_STATIC;

const api = axios.create({ baseURL: '/api' });

// 静态模式下从预生成的 JSON 文件读取
async function getStatic<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}data/${path}`);
  if (!res.ok) throw new Error(`Static data not found: ${path}`);
  return res.json();
}

export async function fetchNews(params: {
  category?: string;
  page?: number;
  pageSize?: number;
  lang?: string;
  q?: string;
}): Promise<NewsResponse> {
  if (isStatic) {
    if (params.q) return searchNews(params.q, params.page);
    const file = params.category ? `news-${params.category}.json` : 'news.json';
    const data = await getStatic<NewsResponse>(file);
    // 语言过滤
    if (params.lang && params.lang !== 'all') {
      data.data = data.data.filter(a => a.language === params.lang);
      data.total = data.data.length;
    }
    // 分页
    const page = params.page || 1;
    const ps = params.pageSize || 20;
    const start = (page - 1) * ps;
    data.data = data.data.slice(start, start + ps);
    data.hasMore = start + ps < data.total;
    data.page = page;
    data.pageSize = ps;
    return data;
  }
  const { data } = await api.get<NewsResponse>('/news', { params });
  return data;
}

export async function fetchArticle(id: string): Promise<ArticleResponse> {
  if (isStatic) {
    return getStatic<ArticleResponse>(`article-${id}.json`);
  }
  const { data } = await api.get<ArticleResponse>(`/news/${id}`);
  return data;
}

export async function fetchDigest(): Promise<{ data: DailyDigest }> {
  if (isStatic) {
    return getStatic<{ data: DailyDigest }>('digest.json');
  }
  const { data } = await api.get<{ data: DailyDigest }>('/digest');
  return data;
}

export async function searchNews(q: string, page = 1): Promise<NewsResponse> {
  if (isStatic) {
    const all = await getStatic<NewsResponse>('news.json');
    const query = q.toLowerCase();
    all.data = all.data.filter(a =>
      a.title.toLowerCase().includes(query) ||
      a.summary.toLowerCase().includes(query) ||
      a.sourceName.toLowerCase().includes(query)
    );
    all.total = all.data.length;
    const ps = 20;
    const start = (page - 1) * ps;
    all.data = all.data.slice(start, start + ps);
    all.hasMore = start + ps < all.total;
    return all;
  }
  const { data } = await api.get<NewsResponse>('/search', { params: { q, page } });
  return data;
}

export async function fetchCategories(): Promise<{ data: CategoryInfo[] }> {
  if (isStatic) {
    return getStatic<{ data: CategoryInfo[] }>('categories.json');
  }
  const { data } = await api.get<{ data: CategoryInfo[] }>('/categories');
  return data;
}

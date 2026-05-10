import { fetchAllFeeds } from '../packages/server/src/services/rssFetcher.js';
import { generateDigest } from '../packages/server/src/services/digestService.js';
import { getAllCategories } from '../packages/server/src/services/categorizer.js';
import { FEED_SOURCES } from '../packages/server/src/services/feedSources.js';
import { translateArticles } from './translate.js';
import { writeFileSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../packages/frontend/public/data');

// 加载 .env
function loadEnv() {
  try {
    const envPath = join(__dirname, '../.env');
    const content = readFileSync(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const m = line.match(/^\s*(\w+)\s*=\s*(.+)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].trim();
      }
    }
  } catch { /* .env not found, use system env */ }
}

async function main() {
  loadEnv();

  console.log('[generate-data] Fetching all RSS feeds...');
  const articles = await fetchAllFeeds();
  console.log(`[generate-data] Fetched ${articles.length} articles`);

  // 翻译英文文章
  console.log('[generate-data] Translating English articles...');
  await translateArticles(articles);

  const digest = generateDigest(articles);
  const categories = getAllCategories();

  mkdirSync(OUT_DIR, { recursive: true });

  // 全量新闻列表
  writeFileSync(join(OUT_DIR, 'news.json'), JSON.stringify({
    data: articles,
    page: 1,
    pageSize: articles.length,
    total: articles.length,
    hasMore: false,
    categories,
    timestamp: new Date().toISOString(),
  }));

  // 每日摘要
  writeFileSync(join(OUT_DIR, 'digest.json'), JSON.stringify({ data: digest }));

  // 分类列表
  writeFileSync(join(OUT_DIR, 'categories.json'), JSON.stringify({ data: categories }));

  // 按分类拆分
  for (const cat of categories) {
    const catArticles = articles.filter(a => a.category === cat.id);
    writeFileSync(join(OUT_DIR, `news-${cat.id}.json`), JSON.stringify({
      data: catArticles,
      page: 1,
      pageSize: catArticles.length,
      total: catArticles.length,
      hasMore: false,
      categories,
      timestamp: new Date().toISOString(),
    }));
  }

  // 单篇文章详情
  for (const article of articles) {
    const related = articles
      .filter(a => a.id !== article.id && a.category === article.category)
      .slice(0, 5);
    writeFileSync(join(OUT_DIR, `article-${article.id}.json`), JSON.stringify({
      data: article,
      related,
    }));
  }

  // 索引文件
  writeFileSync(join(OUT_DIR, 'index.json'), JSON.stringify({
    total: articles.length,
    sources: FEED_SOURCES.length,
    translated: articles.filter(a => a.titleZh).length,
    generatedAt: new Date().toISOString(),
    categories,
  }));

  const enTranslated = articles.filter(a => a.titleZh).length;
  console.log(`[generate-data] Done! ${articles.length} articles, ${enTranslated} translated to Chinese`);
}

main().catch(err => {
  console.error('[generate-data] Error:', err);
  process.exit(1);
});

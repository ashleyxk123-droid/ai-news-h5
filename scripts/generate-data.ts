import { fetchAllFeeds } from '../packages/server/src/services/rssFetcher.js';
import { generateDigest } from '../packages/server/src/services/digestService.js';
import { getAllCategories } from '../packages/server/src/services/categorizer.js';
import { FEED_SOURCES } from '../packages/server/src/services/feedSources.js';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../packages/frontend/public/data');

async function main() {
  console.log('[generate-data] Fetching all RSS feeds...');
  const articles = await fetchAllFeeds();
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

  // 按分类拆分（给前端按分类筛选用）
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

  // 单篇文章详情（含相关文章）
  for (const article of articles) {
    const related = articles
      .filter(a => a.id !== article.id && a.category === article.category)
      .slice(0, 5);
    writeFileSync(join(OUT_DIR, `article-${article.id}.json`), JSON.stringify({
      data: article,
      related,
    }));
  }

  // 总索引文件
  writeFileSync(join(OUT_DIR, 'index.json'), JSON.stringify({
    total: articles.length,
    sources: FEED_SOURCES.length,
    generatedAt: new Date().toISOString(),
    categories,
  }));

  console.log(`[generate-data] Done! ${articles.length} articles from ${new Set(articles.map(a => a.sourceId)).size} sources`);
  console.log(`[generate-data] Output: ${OUT_DIR}`);
}

main().catch(err => {
  console.error('[generate-data] Error:', err);
  process.exit(1);
});

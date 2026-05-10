/**
 * DeepSeek API 翻译服务
 * 将英文文章标题和摘要翻译为中文
 */

const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;
if (!DEEPSEEK_API_KEY) {
  console.warn('[translate] DEEPSEEK_API_KEY not set, skipping translation');
}

interface Article {
  id: string;
  title: string;
  summary: string;
  language: 'zh' | 'en';
  titleZh?: string;
  summaryZh?: string;
}

export async function translateArticles(articles: Article[]): Promise<void> {
  if (!DEEPSEEK_API_KEY) return;

  const enArticles = articles.filter(a => a.language === 'en');
  if (enArticles.length === 0) {
    console.log('[translate] No English articles to translate');
    return;
  }

  console.log(`[translate] Translating ${enArticles.length} English articles...`);

  // 批量翻译（每批 10 篇）
  const batchSize = 10;
  for (let i = 0; i < enArticles.length; i += batchSize) {
    const batch = enArticles.slice(i, i + batchSize);
    await translateBatch(batch);
    console.log(`[translate]   batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(enArticles.length / batchSize)} done`);
  }
}

async function translateBatch(articles: Article[]): Promise<void> {
  const items = articles.map((a, idx) => {
    const lines: string[] = [];
    lines.push(`[${idx}] title: ${a.title}`);
    if (a.summary && a.summary.length > 20) {
      lines.push(`[${idx}] summary: ${a.summary.substring(0, 300)}`);
    }
    return lines.join('\n');
  }).join('\n\n');

  const prompt = `Translate the following English AI news articles into Simplified Chinese. Keep technical terms like model names (ChatGPT, Claude, GPT-4, etc.) in original. Output format exactly as shown with [N] prefix. Do not add extra text.

${items}

Output format:
[N] title-zh: <Chinese title>
[N] summary-zh: <Chinese summary>`;

  try {
    const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!res.ok) {
      console.error(`[translate] API error: ${res.status} ${await res.text()}`);
      return;
    }

    const data = await res.json() as { choices: { message: { content: string } }[] };
    const output = data.choices[0].message.content;

    // 解析输出
    for (const article of articles) {
      const idx = articles.indexOf(article);
      const titleMatch = output.match(new RegExp(`\\[${idx}\\]\\s*title-zh:\\s*(.+?)(?=\\n|\\n\\[|$)`));
      const summaryMatch = output.match(new RegExp(`\\[${idx}\\]\\s*summary-zh:\\s*(.+?)(?=\\n\\n\\[|\\n\\[|$)`));

      if (titleMatch) article.titleZh = titleMatch[1].trim();
      if (summaryMatch) article.summaryZh = summaryMatch[1].trim();
    }
  } catch (err) {
    console.error(`[translate] Request failed: ${(err as Error).message}`);
  }

  // API 限速：每秒 1 次请求
  await new Promise(r => setTimeout(r, 1000));
}

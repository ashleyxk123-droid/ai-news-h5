export interface FeedSource {
  id: string;
  name: string;
  url: string;
  language: 'zh' | 'en';
  defaultCategory: string;
  fallbackUrl?: string;
}

export const FEED_SOURCES: FeedSource[] = [
  {
    id: 'jiqizhixin',
    name: '机器之心',
    url: 'https://www.jiqizhixin.com/rss',
    language: 'zh',
    defaultCategory: 'industry',
  },
  {
    id: 'qbitai',
    name: '量子位',
    url: 'https://www.qbitai.com/feed',
    language: 'zh',
    defaultCategory: 'industry',
  },
  {
    id: 'leiphone-ai',
    name: '雷锋网 AI',
    url: 'https://rsshub.app/leiphone/category/ai',
    language: 'zh',
    defaultCategory: 'industry',
  },
  {
    id: '36kr-ai',
    name: '36氪 AI',
    url: 'https://rsshub.app/36kr/motif/ai',
    language: 'zh',
    defaultCategory: 'industry',
  },
  {
    id: 'synced',
    name: 'Synced (机器之心英文)',
    url: 'https://syncedreview.com/feed/',
    language: 'en',
    defaultCategory: 'academic',
  },
  {
    id: 'hn-ai',
    name: 'Hacker News AI',
    url: 'https://hnrss.org/frontpage?q=ai+OR+llm+OR+openai+OR+gpt+OR+claude+OR+gemini',
    language: 'en',
    defaultCategory: 'llm',
  },
  {
    id: 'techcrunch-ai',
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    language: 'en',
    defaultCategory: 'industry',
  },
  {
    id: 'arxiv-cs-ai',
    name: 'arXiv cs.AI',
    url: 'https://rss.arxiv.org/rss/cs.AI',
    language: 'en',
    defaultCategory: 'academic',
  },
  {
    id: 'arxiv-cs-cl',
    name: 'arXiv cs.CL',
    url: 'https://rss.arxiv.org/rss/cs.CL',
    language: 'en',
    defaultCategory: 'academic',
  },
  {
    id: 'mit-tr-ai',
    name: 'MIT Tech Review AI',
    url: 'https://www.technologyreview.com/feed/topic/artificial-intelligence/',
    language: 'en',
    defaultCategory: 'industry',
  },
  {
    id: 'theverge-ai',
    name: 'The Verge AI',
    url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
    language: 'en',
    defaultCategory: 'industry',
  },
  {
    id: 'venturebeat-ai',
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/category/ai/feed/',
    language: 'en',
    defaultCategory: 'industry',
  },
];

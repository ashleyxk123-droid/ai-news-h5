export interface CategoryDef {
  id: string;
  nameZh: string;
  nameEn: string;
  keywords: string[];
  keywordsEn: string[];
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'llm',
    nameZh: '大语言模型',
    nameEn: 'LLM',
    keywords: ['大模型', '大语言模型', '语言模型', 'LLM', 'GPT', 'Claude', 'Gemini',
      'Llama', '文心一言', '通义千问', 'ChatGLM', '百川', 'Moonshot', 'DeepSeek', 'Qwen'],
    keywordsEn: ['llm', 'large language model', 'gpt', 'claude', 'gemini',
      'llama', 'openai', 'anthropic', 'mistral', 'chatgpt', 'deepseek'],
  },
  {
    id: 'robotics',
    nameZh: '机器人',
    nameEn: 'Robotics',
    keywords: ['机器人', '机械臂', '具身智能', '人形机器人', '四足', '无人驾驶',
      '自动驾驶', 'Figure', 'Tesla Bot', '擎天柱', '具身'],
    keywordsEn: ['robot', 'robotics', 'humanoid', 'embodied', 'autonomous vehicle',
      'self-driving', 'quadruped', 'boston dynamics'],
  },
  {
    id: 'academic',
    nameZh: '学术前沿',
    nameEn: 'Academic',
    keywords: ['论文', 'arXiv', 'NeurIPS', 'ICML', 'CVPR', 'ACL', 'EMNLP',
      'ICLR', 'AAAI', '顶会', '预印本', 'Benchmark', 'SOTA', '推理'],
    keywordsEn: ['paper', 'arxiv', 'neurips', 'icml', 'cvpr', 'acl', 'emnlp',
      'iclr', 'benchmark', 'state-of-the-art', 'pretrain', 'reasoning'],
  },
  {
    id: 'cv',
    nameZh: '计算机视觉',
    nameEn: 'CV',
    keywords: ['计算机视觉', '图像生成', '视频生成', 'Stable Diffusion', 'DALL-E',
      'Midjourney', 'Sora', '目标检测', '分割', '视觉', '多模态'],
    keywordsEn: ['computer vision', 'image generation', 'video generation',
      'stable diffusion', 'dall-e', 'midjourney', 'sora', 'multimodal', 'vision'],
  },
  {
    id: 'industry',
    nameZh: '行业应用',
    nameEn: 'Industry',
    keywords: ['融资', '估值', '商业化', '落地', 'IPO', '收购', '营收',
      '产品发布', '开源', '创业', 'A轮', 'B轮', 'C轮'],
    keywordsEn: ['funding', 'series', 'valuation', 'acquisition', 'revenue',
      'product launch', 'enterprise', 'startup', 'commercial', 'raise'],
  },
  {
    id: 'ai-safety',
    nameZh: 'AI 安全与治理',
    nameEn: 'AI Safety',
    keywords: ['安全', '对齐', 'Alignment', '越狱', '红队', '幻觉',
      '监管', '法规', '伦理', '欧盟AI法案', '深度伪造'],
    keywordsEn: ['safety', 'alignment', 'jailbreak', 'red team', 'hallucination',
      'regulation', 'ethics', 'eu ai act', 'deepfake', 'deep fake'],
  },
  {
    id: 'agi',
    nameZh: 'AGI 讨论',
    nameEn: 'AGI',
    keywords: ['AGI', '通用人工智能', '超级智能', '意识', '图灵测试',
      '奇点', 'Ilya Sutskever', '超级对齐', 'ASI'],
    keywordsEn: ['agi', 'artificial general intelligence', 'superintelligence',
      'singularity', 'consciousness', 'superalignment', 'asi'],
  },
];

export function detectCategory(title: string, summary: string, defaultCategory: string): string {
  const text = `${title} ${summary}`.toLowerCase();
  const scores: { id: string; score: number }[] = [];

  for (const cat of CATEGORIES) {
    let score = 0;
    for (const kw of cat.keywords) {
      if (text.includes(kw.toLowerCase())) score += 2;
    }
    for (const kw of cat.keywordsEn) {
      if (text.includes(kw.toLowerCase())) score += 1;
    }
    scores.push({ id: cat.id, score });
  }

  scores.sort((a, b) => b.score - a.score);
  if (scores[0].score >= 2) return scores[0].id;
  return defaultCategory;
}

export function getCategoryName(categoryId: string, lang: 'zh' | 'en' = 'zh'): string {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  if (!cat) return categoryId;
  return lang === 'zh' ? cat.nameZh : cat.nameEn;
}

export function getAllCategories() {
  return CATEGORIES.map(c => ({ id: c.id, nameZh: c.nameZh, nameEn: c.nameEn }));
}

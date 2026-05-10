import { Link } from 'react-router-dom';
import { Sparkles, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import type { DailyDigest } from '../../types';

interface DigestCardProps {
  digest: DailyDigest;
}

export function DigestCard({ digest }: DigestCardProps) {
  return (
    <Link
      to="/digest"
      className="block mx-4 md:mx-4 mt-3 mb-1 p-4 md:p-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md active:scale-[0.98] transition-transform md:col-span-full"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Sparkles size={18} />
          <span className="font-semibold text-sm">AI 今日速览</span>
        </div>
        <ChevronRight size={18} />
      </div>
      <p className="text-xs text-white/80 mb-2">
        {format(new Date(digest.date), 'M月d日')} · {digest.totalArticles} 篇文章 · {digest.sourceCount} 个来源
      </p>
      <div className="flex flex-wrap gap-1">
        {digest.categories.slice(0, 4).map(c => (
          <span key={c.categoryId} className="px-2 py-0.5 rounded-full bg-white/20 text-xs">
            {c.categoryNameZh} ({c.topArticles.length})
          </span>
        ))}
      </div>
    </Link>
  );
}

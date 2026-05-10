import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import { zhCN, enUS } from 'date-fns/locale';

export function relativeTime(dateStr: string, lang: 'zh' | 'en' = 'zh'): string {
  const d = new Date(dateStr);
  const locale = lang === 'zh' ? zhCN : enUS;

  if (isToday(d)) {
    return formatDistanceToNow(d, { addSuffix: true, locale });
  }
  if (isYesterday(d)) {
    return lang === 'zh' ? '昨天' : 'Yesterday';
  }
  return format(d, lang === 'zh' ? 'MM-dd' : 'MMM dd');
}

export function fullDate(dateStr: string, lang: 'zh' | 'en' = 'zh'): string {
  const d = new Date(dateStr);
  return format(d, lang === 'zh' ? 'yyyy年MM月dd日 HH:mm' : 'MMM dd, yyyy HH:mm');
}

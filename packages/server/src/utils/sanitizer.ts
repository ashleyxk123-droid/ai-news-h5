import sanitizeHtml from 'sanitize-html';

export function sanitize(html: string, maxLength = 300): string {
  const cleaned = sanitizeHtml(html, {
    allowedTags: [],
    allowedAttributes: {},
  });
  const text = cleaned.replace(/\s+/g, ' ').trim();
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
}

export function sanitizeFull(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li', 'h3', 'h4', 'blockquote', 'img', 'pre', 'code'],
    allowedAttributes: {
      a: ['href'],
      img: ['src', 'alt'],
    },
  });
}

export function extractImage(item: Record<string, unknown>): string | undefined {
  const content = (item['content:encoded'] as string) || (item.content as string) || '';
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

export function extractImageFromContent(content: string): string | undefined {
  const match = content.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1];
}

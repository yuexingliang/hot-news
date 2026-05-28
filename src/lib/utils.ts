import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';
import { pinyin } from 'pinyin-pro';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeSlug(input: string) {
  // 中文 → 拼音；英文/数字保持原样
  const hasCJK = /[\u4e00-\u9fa5]/.test(input);
  const text = hasCJK
    ? pinyin(input, { toneType: 'none', type: 'string', nonZh: 'consecutive' })
    : input;
  const base = slugify(text, { lower: true, strict: true, trim: true });
  return base || `post-${Date.now()}`;
}

export function formatDate(d: Date | string) {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export function readingTime(text: string) {
  const wordsPerMinute = 350;
  const words = text.replace(/<[^>]*>/g, '').length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export function excerpt(text: string, n = 120) {
  const plain = text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  return plain.length > n ? plain.slice(0, n) + '…' : plain;
}

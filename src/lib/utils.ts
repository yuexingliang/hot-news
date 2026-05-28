import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import slugify from 'slugify';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function makeSlug(input: string) {
  const base = slugify(input, { lower: true, strict: true, trim: true });
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

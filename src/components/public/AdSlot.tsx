import { prisma } from '@/lib/prisma';
import AdSlotClient from './AdSlotClient';

/**
 * 服务端预加载广告位内容，客户端组件负责曝光/点击上报。
 */
export default async function AdSlot({ code, className = '' }: { code: string; className?: string }) {
  const slot = await prisma.adSlot
    .findUnique({ where: { code } })
    .catch(() => null);
  if (!slot || !slot.enabled) return null;
  // 时间窗
  const now = new Date();
  if (slot.startAt && now < slot.startAt) return null;
  if (slot.endAt && now > slot.endAt) return null;
  if (!slot.html && !slot.imageUrl) return null;
  return <AdSlotClient code={code} html={slot.html} imageUrl={slot.imageUrl} linkUrl={slot.linkUrl} className={className} />;
}

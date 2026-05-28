import { site } from '@/lib/site';

export const metadata = { title: '关于我们' };

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20 max-w-3xl mx-auto px-4 prose-article">
      <h1>关于 {site.name}</h1>
      <p>{site.description}</p>
      <h2>我们的定位</h2>
      <p>资讯+软文混合站：用热点资讯吸引流量，通过精选推广位实现变现，为读者提供优质内容，为品牌主提供高效投放渠道。</p>
      <h2>联系我们</h2>
      <p>合作邮箱：hello@example.com</p>
    </div>
  );
}

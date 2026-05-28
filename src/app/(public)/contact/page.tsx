export const metadata = { title: '联系我们' };
export default function ContactPage() {
  return (
    <div className="pt-24 pb-20 max-w-2xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-6"><span className="text-gradient">联系我们</span></h1>
      <div className="glass p-6 space-y-3">
        <p>📧 邮箱：hello@example.com</p>
        <p>💬 微信：HotNews-Service</p>
        <p>🐦 商务合作：见 <a href="/promotion-apply" className="text-brand-400 hover:underline">投放推广</a></p>
      </div>
    </div>
  );
}

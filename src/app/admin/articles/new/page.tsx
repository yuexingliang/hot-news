import ArticleEditor from '@/components/admin/ArticleEditor';

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold"><span className="text-gradient">新建文章</span></h1>
      <ArticleEditor />
    </div>
  );
}

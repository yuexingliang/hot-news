import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';

export default function ArticleContent({
  contentType,
  content,
}: {
  contentType: 'MARKDOWN' | 'HTML' | 'RICH';
  content: string;
}) {
  if (contentType === 'HTML' || contentType === 'RICH') {
    // content 入库时已经在 API 层过滤过（lib/sanitize.ts），此处直接渲染
    return <div className="user-html prose-article" dangerouslySetInnerHTML={{ __html: content }} />;
  }
  return (
    <div className="prose-article">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

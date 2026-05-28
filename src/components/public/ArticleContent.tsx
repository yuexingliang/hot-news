import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { sanitizeUserHtml } from '@/lib/sanitize';

export default function ArticleContent({
  contentType,
  content,
}: {
  contentType: 'MARKDOWN' | 'HTML' | 'RICH';
  content: string;
}) {
  if (contentType === 'HTML' || contentType === 'RICH') {
    // 服务端二次过滤一次，确保安全
    const safe = sanitizeUserHtml(content);
    return <div className="user-html prose-article" dangerouslySetInnerHTML={{ __html: safe }} />;
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

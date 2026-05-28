import DOMPurify from 'isomorphic-dompurify';

/**
 * 用户提交 HTML 的白名单过滤
 * - 允许大部分排版/样式标签，让用户能写出"炫酷"的内容
 * - 禁止 script、危险事件处理、危险协议 (javascript:)
 */
export function sanitizeUserHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'a', 'abbr', 'b', 'blockquote', 'br', 'caption', 'code', 'div', 'em',
      'figure', 'figcaption', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr',
      'i', 'img', 'li', 'mark', 'ol', 'p', 'pre', 'q', 's', 'section',
      'small', 'span', 'strong', 'sub', 'sup', 'table', 'tbody', 'td',
      'tfoot', 'th', 'thead', 'tr', 'u', 'ul', 'video', 'source',
      'iframe', 'audio', 'picture',
      'svg', 'path', 'circle', 'rect', 'line', 'polygon', 'g',
      'details', 'summary', 'kbd', 'time',
    ],
    ALLOWED_ATTR: [
      'href', 'src', 'alt', 'title', 'class', 'style', 'id', 'target',
      'rel', 'width', 'height', 'colspan', 'rowspan', 'controls',
      'autoplay', 'loop', 'muted', 'poster', 'data-src', 'srcset',
      'allowfullscreen', 'frameborder', 'sandbox', 'loading',
      'viewbox', 'fill', 'stroke', 'stroke-width', 'd', 'cx', 'cy', 'r',
      'x', 'y', 'x1', 'y1', 'x2', 'y2', 'points', 'transform',
      'open', 'datetime',
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|data:image\/(?:png|jpe?g|gif|webp|svg\+xml));)?/i,
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button', 'meta', 'link', 'base'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],
    ADD_ATTR: ['target'],
    ALLOW_DATA_ATTR: true,
  });
}

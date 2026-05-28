import type { Metadata, Viewport } from 'next';
import './globals.css';
import 'highlight.js/styles/github-dark.css';
import { site } from '@/lib/site';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  keywords: ['热点', '资讯', '推广', '软文', '科技', '财经'],
  openGraph: {
    type: 'website',
    locale: site.locale,
    url: site.url,
    siteName: site.name,
    title: site.name,
    description: site.description,
  },
  twitter: { card: 'summary_large_image', title: site.name, description: site.description },
  robots: { index: true, follow: true },
  alternates: { canonical: '/' },
};

export const viewport: Viewport = {
  themeColor: '#0b1020',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const baidu = process.env.NEXT_PUBLIC_BAIDU_ANALYTICS;
  const ga = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS;
  const adsense = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {adsense && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsense}`}
            crossOrigin="anonymous"
          />
        )}
        {ga && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${ga}');`,
              }}
            />
          </>
        )}
        {baidu && (
          <script
            dangerouslySetInnerHTML={{
              __html: `var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?${baidu}";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s);})();`,
            }}
          />
        )}
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

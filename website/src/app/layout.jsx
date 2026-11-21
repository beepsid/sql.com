import './globals.css';
import { Providers } from '../components/ThemeProvider';
import Navbar from '../components/Navbar';
import { getAllTopics } from '../lib/contentLoader';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from '../lib/site';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · learn SQL with notes, examples and practice problems`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    'sql notes',
    'learn sql',
    'sql tutorial',
    'sql practice',
    'sql interview questions',
    'sql examples',
    'postgresql',
    'window functions',
    'sql joins',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} · learn SQL with notes, examples and practice problems`,
    description: SITE_DESCRIPTION,
    url: '/',
    images: [{ url: '/icon-512.png', width: 512, height: 512, alt: SITE_NAME }],
  },
  twitter: { card: 'summary', title: SITE_NAME, description: SITE_DESCRIPTION, images: ['/icon-512.png'] },
  robots: { index: true, follow: true },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfaf8' },
    { media: '(prefers-color-scheme: dark)', color: '#121316' },
  ],
};

export default function RootLayout({ children }) {
  const topics = getAllTopics().map(({ level, slug, title, intro }) => ({ level, slug, title, intro }));

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <Navbar topics={topics} />
          <main>{children}</main>
          <footer className="footer">
            {SITE_NAME} · free sql notes and practice · <a href="/glossary/">glossary</a> ·{' '}
            <a href="/sample-data/">sample data</a> · <a href="/sql-functions/">functions</a>
          </footer>
        </Providers>
      </body>
    </html>
  );
}

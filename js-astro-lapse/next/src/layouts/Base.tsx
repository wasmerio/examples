import GoogleAnalytics from '@/components/GoogleAnalytics';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import StoreBadge from '@/components/StoreBadge';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

/**
 * Hand-written counterpart of the Astro build's src/layouts/Base.astro: same
 * props, same markup. Head tags are rendered here and React hoists them into
 * <head>, so each page sets its own title, description and canonical. Next adds
 * the charset and viewport meta itself.
 */
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://lapse-next.startfrom.co';

interface Props {
  /** The page path, e.g. "/about/" (the generator passes it). Used for the canonical URL. */
  route: string;
  title: string;
  description: string;
  image?: string;
  /** The 404 page has no nav or footer, as in the Framer template. */
  bare?: boolean;
  noindex?: boolean;
  children?: React.ReactNode;
}

export default function Base({ route, title, description, image = '/assets/site/og.jpg', bare = false, noindex = false, children }: Props) {
  const canonical = new URL(route, SITE).href;
  const ogImage = new URL(image, SITE).href;
  const analytics = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === 'true';
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <link rel="icon" type="image/png" href="/favicon.png" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      {/* Next already marks its not-found page noindex; one tag is enough. */}
      {noindex && route !== '/404/' && <meta name="robots" content="noindex" />}
      {!bare && <Nav />}
      <main>{children}</main>
      {!bare && <Footer />}
      <StoreBadge />
      {analytics && <Analytics />}
      {analytics && <SpeedInsights />}
      <GoogleAnalytics />
    </>
  );
}

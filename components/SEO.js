import Head from 'next/head';
import { useRouter } from 'next/router';

const SEO = ({
  title = 'ABWCI - Association of Business Women in Commerce & Industry',
  description = 'Empowering Business Women through Global Networks. Join ABWCI to connect, grow, and transform economies through women entrepreneurship.',
  keywords = 'ABWCI, business women, women entrepreneurs, commerce, industry, women empowerment, business network, women in business',
  image = '/abwci.ico', // Default OG image
  url,
  type = 'website',
  author = 'Chittaranjan',
  authorUrl = 'https://github.com/chittaranjans',
  siteName = 'ABWCI',
  locale = 'en_US',
  noindex = false,
  nofollow = false,
  canonical,
}) => {
  const router = useRouter();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://abwci.org';
  const fullUrl = url || `${baseUrl}${router.asPath}`;
  const canonicalUrl = canonical || fullUrl;
  const ogImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

  // Robots meta
  const robotsContent = [];
  if (noindex) robotsContent.push('noindex');
  if (nofollow) robotsContent.push('nofollow');
  if (robotsContent.length === 0) robotsContent.push('index', 'follow');

  // Structured Data (JSON-LD) for Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName,
    url: baseUrl,
    logo: `${baseUrl}/abwci.ico`,
    description: description,
    sameAs: [
      // Add social media links here if available
    ],
  };

  // Website Schema
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteName,
    url: baseUrl,
    description: description,
    publisher: {
      '@type': 'Organization',
      name: siteName,
    },
  };

  // Breadcrumb Schema (if needed, can be customized per page)
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
    ],
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={`${author} - ${authorUrl}`} />
      <meta name="developer" content={author} />
      <meta name="robots" content={robotsContent.join(', ')} />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:creator" content="@abwci" /> {/* Update with actual Twitter handle if available */}

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#653A96" />
      <meta name="msapplication-TileColor" content="#653A96" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      {/* Favicons */}
      <link rel="icon" href="/abwci.ico" />
      <link rel="shortcut icon" href="/abwci.ico" type="image/x-icon" />
      <link rel="apple-touch-icon" href="/abwci.ico" />

      {/* Structured Data (JSON-LD) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <meta name="generator" content={`Next.js - Developed by ${author}`} />
      <meta name="copyright" content={`© ${new Date().getFullYear()} ${siteName}. Developed by ${author}`} />
    </Head>
  );
};

export default SEO;


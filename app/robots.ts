import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.wb6ya.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/ar/admin/', '/en/admin/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

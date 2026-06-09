import { MetadataRoute } from 'next';
import { getSitemapBlogs } from '@/services/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://blog.wb6ya.com';

  const blogs = await getSitemapBlogs();

  const blogEntries: MetadataRoute.Sitemap = blogs.flatMap((blog) => [
    {
      url: `${baseUrl}/ar/blog/${blog._id}`,
      lastModified: new Date(blog.updatedAt || blog.createdAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/en/blog/${blog._id}`,
      lastModified: new Date(blog.updatedAt || blog.createdAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  ]);

  return [
    {
      url: `${baseUrl}/ar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/en`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...blogEntries,
  ];
}

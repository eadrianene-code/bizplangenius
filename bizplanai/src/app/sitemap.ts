import { getAllPosts } from '@/lib/blog';
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
      const baseUrl = 'https://www.bizplangenius.com';

  const posts = getAllPosts();

  const blogUrls = posts.map((post) => ({
          url: `${baseUrl}/blog/${post.slug}`,
          lastModified: new Date(post.date),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
  }));

  return [
      {
                url: baseUrl,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 1,
      },
      {
                url: `${baseUrl}/blog`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.8,
      },
          ...blogUrls,
      {
                url: `${baseUrl}/terms`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.3,
      },
      {
                url: `${baseUrl}/privacy`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.3,
      },
        ];
}

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
                url: `${baseUrl}/spy`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
      },
      {
                url: `${baseUrl}/blog`,
                lastModified: new Date(),
                changeFrequency: 'daily',
                priority: 0.8,
      },
          ...blogUrls,
      {
                url: `${baseUrl}/startup-cost-calculator`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
      },
      {
                url: `${baseUrl}/business-name-generator`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
      },
      {
                url: `${baseUrl}/compare`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.8,
      },
      {
                url: `${baseUrl}/investor-emails`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
      },
      {
                url: `${baseUrl}/bundles`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.9,
      },
      {
                url: `${baseUrl}/brand-kit`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
      },
      {
                url: `${baseUrl}/social-pack`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
      },
      {
                url: `${baseUrl}/pitch-deck`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.7,
      },
      {
                url: `${baseUrl}/build-website`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
      },
      {
                url: `${baseUrl}/free-competitor-check`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
      },
      {
                url: `${baseUrl}/monitoring`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
      },
      {
                url: `${baseUrl}/refer`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.6,
      },
      {
                url: `${baseUrl}/about`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.5,
      },
      {
                url: `${baseUrl}/methodology`,
                lastModified: new Date(),
                changeFrequency: 'monthly',
                priority: 0.7,
      },
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

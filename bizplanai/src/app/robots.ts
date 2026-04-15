import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
          rules: [
            {
                      userAgent: '*',
                      allow: '/',
                      disallow: ['/api/', '/success', '/generate', '/tools/', '/dashboard'],
            },
                ],
          sitemap: 'https://www.bizplangenius.com/sitemap.xml',
    };
}

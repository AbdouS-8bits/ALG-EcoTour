import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/_next/',
          '/static/',
        ],
      },
    ],
    sitemap: '/sitemap.xml',
    host: process.env.NEXT_PUBLIC_SITE_URL || 'https://localhost:3000',
  };
}

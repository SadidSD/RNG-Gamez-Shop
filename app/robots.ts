import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rnggamez.com';
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/admin/',
                '/account/',
                '/checkout/',
                '/order-success/',
                '/verify-email/'
            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}

import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.rng-gamez.com';
    
    // 1. Define Static Routes
    const staticRoutes = ['', '/about', '/shop', '/singles', '/sealed', '/buylist', '/events'].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // 2. Fetch Dynamic Product Routes
    let productRoutes: MetadataRoute.Sitemap = [];
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    
    try {
        const res = await fetch(`${apiUrl}/public/products`, {
            next: { revalidate: 3600 } // Cache for 1 hour
        });
        if (res.ok) {
            const products = await res.json();
            if (Array.isArray(products)) {
                productRoutes = products.map((product: any) => ({
                    url: `${baseUrl}/product/${product.id}`,
                    lastModified: new Date(product.updatedAt || new Date()),
                    changeFrequency: 'weekly' as const,
                    priority: 0.6,
                }));
            }
        }
    } catch (error) {
        console.warn('[Sitemap] Failed to fetch products for dynamic sitemap generation:', error);
    }

    return [...staticRoutes, ...productRoutes];
}

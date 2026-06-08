import React from 'react';
import { Metadata } from 'next';
import ProductDetailView from '@/components/product/ProductDetailView';

interface ProductPageProps {
    params: {
        id: string;
    };
}

async function getProduct(id: string) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
    try {
        const res = await fetch(`${apiUrl}/public/products/${id}`, {
            next: { revalidate: 3600 }, // Cache for 1 hour
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error('Error fetching product in server component:', error);
        return null;
    }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const product = await getProduct(params.id);
    if (!product) {
        return {
            title: 'Product Not Found | RNG Gamez',
            description: 'The requested product could not be found.',
        };
    }

    const cleanDescription = product.description || `Buy ${product.name} from the ${product.set} set. Available now in multiple conditions at RNG Gamez.`;
    const image = product.images?.[0] || '/placeholder.png';

    return {
        title: `${product.name} - ${product.set} (#${product.collectorNumber})`,
        description: cleanDescription,
        openGraph: {
            title: `${product.name} - ${product.set} | RNG Gamez`,
            description: cleanDescription,
            images: [{ url: image }],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${product.name} - ${product.set} | RNG Gamez`,
            description: cleanDescription,
            images: [image],
        },
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const product = await getProduct(params.id);

    if (!product) {
        return (
            <div className="min-h-screen bg-[#F1F1F1] pt-40 text-center font-bold text-gray-800">
                Product Not Found
            </div>
        );
    }

    // JSON-LD Structured Data for search engine rich snippets
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': product.name,
        'image': product.images,
        'description': product.description || `Buy ${product.name} from the ${product.set} set.`,
        'sku': product.variants?.[0]?.sku || product.id,
        'offers': {
            '@type': 'AggregateOffer',
            'priceCurrency': 'USD',
            'lowPrice': Math.min(...product.variants.map((v: any) => Number(v.price))),
            'highPrice': Math.max(...product.variants.map((v: any) => Number(v.price))),
            'offerCount': product.variants.length,
            'availability': product.variants.some((v: any) => (v.inventory?.quantity || 0) > 0)
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
        },
    };

    return (
        <>
            {/* Inject Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            
            <ProductDetailView product={product} />
        </>
    );
}

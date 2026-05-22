'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Package, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface SealedProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
    set: string;
    category?: { name: string };
}

export default function SealedProductsSection() {
    const [products, setProducts] = useState<SealedProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [scrollPos, setScrollPos] = useState(0);

    useEffect(() => {
        fetchFeatured();
    }, []);

    const fetchFeatured = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const apiKey = process.env.NEXT_PUBLIC_API_KEY;
            if (!apiUrl) return;

            // Fetch booster boxes as featured sealed products
            const res = await fetch(`${apiUrl}/public/products?category=booster-boxes`, {
                headers: { 'x-api-key': apiKey || '' },
                cache: 'no-store',
            });

            if (res.ok) {
                const data = await res.json();
                setProducts((data.data || []).slice(0, 8));
            }
        } catch (error) {
            console.error('Error fetching sealed products:', error);
        } finally {
            setLoading(false);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        const container = document.getElementById('sealed-scroll');
        if (!container) return;
        const amount = 320;
        container.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    if (loading || products.length === 0) return null;

    return (
        <section className="py-16 bg-[#F1F1F1]">
            <div className="max-w-7xl mx-auto px-6">
                {/* Section Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight" style={{ fontFamily: 'Europa Grotesk SH, sans-serif' }}>
                            SEALED PRODUCTS
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">Factory sealed booster boxes, bundles & more</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => scroll('left')}
                            className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-all shadow-sm"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="p-2 rounded-full bg-white border border-gray-200 text-gray-500 hover:border-purple-300 hover:text-purple-600 transition-all shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
                        <Link
                            href="/sealed"
                            className="ml-2 flex items-center gap-1 px-5 py-2 rounded-full bg-purple-500 text-white text-sm font-semibold
                                       hover:bg-purple-600 transition-colors shadow-md shadow-purple-200"
                        >
                            View All
                            <ArrowRight size={14} />
                        </Link>
                    </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div
                    id="sealed-scroll"
                    className="flex gap-5 overflow-x-auto scrollbar-none pb-2 -mx-2 px-2"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {products.map((product) => (
                        <Link
                            key={product.id}
                            href={`/product/${product.id}`}
                            className="group shrink-0 w-[280px]"
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
                                            transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/50 hover:border-purple-200 hover:-translate-y-1">
                                {/* Image */}
                                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                    {product.images?.[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                            sizes="280px"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package size={48} className="text-gray-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <p className="text-[10px] text-purple-500 font-bold uppercase tracking-wider mb-1">
                                        {product.category?.name || 'Sealed'}
                                    </p>
                                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug mb-2 min-h-[2.5em]">
                                        {product.name}
                                    </h3>
                                    <span className="text-lg font-extrabold text-gray-900">
                                        ${Number(product.price).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

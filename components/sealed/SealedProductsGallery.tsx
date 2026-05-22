'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Package, Box, ChevronDown, Sparkles, ShoppingCart } from 'lucide-react';

interface SealedProduct {
    id: string;
    name: string;
    price: number;
    images: string[];
    set: string;
    category?: { name: string; slug: string };
    variants?: { id: string; condition: string; inventory?: { quantity: number } }[];
    tags?: string[];
}

const CATEGORY_FILTERS = ['All', 'Booster Boxes', 'Booster Packs', 'Bundles', 'Precon Decks', "Collector's Editions"] as const;

const CATEGORY_COLORS: Record<string, string> = {
    'Booster Boxes': 'bg-violet-100 text-violet-700',
    'Booster Packs': 'bg-blue-100 text-blue-700',
    'Bundles': 'bg-amber-100 text-amber-700',
    'Precon Decks': 'bg-emerald-100 text-emerald-700',
    "Collector's Editions": 'bg-rose-100 text-rose-700',
    'Starter Kits': 'bg-teal-100 text-teal-700',
};

export default function SealedProductsGallery() {
    const [products, setProducts] = useState<SealedProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    useEffect(() => {
        fetchSealedProducts();
    }, []);

    const fetchSealedProducts = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const apiKey = process.env.NEXT_PUBLIC_API_KEY;
            if (!apiUrl) return;

            // Fetch all sealed products in a single call using comma-separated categories
            const categorySlugs = [
                'booster-boxes', 
                'booster-packs', 
                'bundles', 
                'precon-decks', 
                'collectors-editions', 
                'starter-kits'
            ].join(',');

            const res = await fetch(`${apiUrl}/public/products?category=${categorySlugs}&take=50`, {
                headers: { 'x-api-key': apiKey || '' },
                cache: 'no-store',
            });

            if (res.ok) {
                const data = await res.json();
                setProducts(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching sealed products:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = useMemo(() => {
        let filtered = products;

        if (activeCategory !== 'All') {
            filtered = filtered.filter(p => p.category?.name === activeCategory);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(q) ||
                (p.set || '').toLowerCase().includes(q)
            );
        }

        return filtered;
    }, [products, searchQuery, activeCategory]);

    const getStock = (product: SealedProduct) => {
        return product.variants?.reduce((sum, v) => sum + (v.inventory?.quantity || 0), 0) || 0;
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="aspect-square bg-gray-100 animate-pulse" />
                            <div className="p-4 space-y-3">
                                <div className="h-5 bg-gray-100 rounded-full animate-pulse w-3/4" />
                                <div className="h-4 bg-gray-100 rounded-full animate-pulse w-1/2" />
                                <div className="h-8 bg-gray-100 rounded-full animate-pulse w-1/3" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6">
            {/* Search & Category Filters */}
            <div className="mb-8">
                <div className="relative mb-4">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search sealed products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-gray-200 text-gray-900
                                   placeholder:text-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100
                                   transition-all text-sm shadow-sm"
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                    {CATEGORY_FILTERS.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border
                                ${activeCategory === cat
                                    ? 'bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-200'
                                    : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                    <span className="ml-auto shrink-0 text-xs text-gray-400 tabular-nums font-medium">
                        {filteredProducts.length} products
                    </span>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                    const stock = getStock(product);
                    const categoryName = product.category?.name || 'Sealed';
                    const badgeColor = CATEGORY_COLORS[categoryName] || 'bg-gray-100 text-gray-600';

                    return (
                        <Link key={product.id} href={`/product/${product.id}`} className="group">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden
                                            transition-all duration-300 hover:shadow-lg hover:shadow-purple-100/50 hover:border-purple-200 hover:-translate-y-1">
                                {/* Product Image */}
                                <div className="relative aspect-square bg-gray-50 overflow-hidden">
                                    {product.images?.[0] ? (
                                        <Image
                                            src={product.images[0]}
                                            alt={product.name}
                                            fill
                                            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Package size={48} className="text-gray-300" />
                                        </div>
                                    )}

                                    {/* Stock Badge */}
                                    <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                                        ${stock > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                                        {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                                    </div>

                                    {/* Category Badge */}
                                    <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${badgeColor}`}>
                                        {categoryName}
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="p-4">
                                    <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wide mb-1">
                                        {product.set}
                                    </p>
                                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug mb-3">
                                        {product.name}
                                    </h3>
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-extrabold text-gray-900">
                                            ${Number(product.price).toFixed(2)}
                                        </span>
                                        <button className="p-2 rounded-full bg-purple-50 text-purple-500 hover:bg-purple-100 transition-colors"
                                                onClick={(e) => { e.preventDefault(); }}>
                                            <ShoppingCart size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Empty State */}
            {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-24">
                    <Box size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-semibold">No sealed products found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
}

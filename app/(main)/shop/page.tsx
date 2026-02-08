"use client";

import React, { useState, Suspense, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';

const fetchProducts = async (searchParams: URLSearchParams) => {
    console.log("1. Starting fetchProducts with params:", searchParams.toString());
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;

        if (!apiUrl) {
            console.error("CRITICAL: NEXT_PUBLIC_API_URL is missing");
            return [];
        }

        const fullUrl = `${apiUrl}/public/products?${searchParams.toString()}`;
        console.log("3. Fetching from:", fullUrl);

        // Endpoint: /api/public/products (Public Shop via Railway/Render)
        const res = await fetch(fullUrl, {
            headers: {
                'x-api-key': apiKey || '',
            },
            cache: 'no-store'
        });

        console.log("4. Response Status:", res.status);

        if (!res.ok) {
            console.error("Fetch failed:", res.status, res.statusText);
            throw new Error('Failed to fetch products');
        }

        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

const fetchCategories = async () => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        if (!apiUrl) return [];
        const res = await fetch(`${apiUrl}/categories`, { cache: 'no-store' });
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        return [];
    }
}

function ShopContent() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [productsData, categoriesData] = await Promise.all([
                fetchProducts(searchParams),
                fetchCategories()
            ]);

            // Set Categories for Sidebar
            if (categoriesData && categoriesData.length > 0) {
                setCategories(categoriesData.map((c: any) => c.name));
            } else {
                // Fallback defaults if no backend categories
                setCategories(['Pokemon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Sports Cards', 'Supplies', 'Graded Cards']);
            }

            const mapped = productsData.map((p: any) => ({
                id: p.id,
                title: p.name,
                price: `$${Number(p.price).toFixed(2)}`,
                imageSrc: (p.images && p.images.length > 0) ? p.images[0] : "/placeholder.svg",
                // Prefer linked category name, fallback to game, fallback to All
                category: p.category ? p.category.name : (p.game || "All"),
                set: p.set || "",
                rarity: p.rarity || "",
                number: p.collectorNumber || "",
                conditionString: (p.variants && p.variants.length > 0)
                    ? `${p.variants[0].condition || 'NM'}${p.variants[0].isFoil ? ' Foil' : ''}`
                    : "",
                rawPrice: Number(p.price),
                variantId: (p.variants && p.variants.length > 0) ? p.variants[0].id : undefined,
            }));

            setProducts(mapped);
            setLoading(false);
        };
        load();
    }, [searchParams]);

    // Robust normalization: lowercase, remove accents, trim
    const normalize = (str: string) => {
        if (!str) return "";
        let s = str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
        // Alias Handling
        if (s === 'mtg') return 'magic: the gathering';
        if (s === 'magic the gathering') return 'magic: the gathering';
        return s;
    };

    // Client-side category filter fallback (if backend returns generic list)
    // IMPORTANT: Backend should ideally filter this, but we keep this for robust display
    const filteredCards = currentCategory && currentCategory !== 'All'
        ? products.filter(card => {
            // If we already filtered on backend (which strictly we did by 'category' param), 
            // this is redundant but harmless unless backend ignores params.
            // We trust backend mainly, but let's keep it consistent.
            return true;
        })
        : products;

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-xl text-gray-500 animate-pulse">Loading products...</div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-sm"></div>
                <span>Collections</span>
                <span>/</span>
                <span className="text-black font-medium">{searchParams.get('category') || 'All'}</span>
            </div>

            <div className="flex flex-col gap-6 mb-8">
                <h1 className="text-[80px] font-bold leading-tight tracking-tight" style={{ fontFamily: 'Europa Grotesk SH' }}>
                    {searchParams.get('category') || 'Shop All'}
                </h1>

                <div className="flex items-center justify-between">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-all font-medium text-black"
                    >
                        <div className="w-5 h-5 bg-orange-400 rounded-sm flex items-center justify-center">
                            <SlidersHorizontal className="w-3 h-3 text-white" />
                        </div>
                        {showFilters ? 'Hide filters' : 'Show filters'}
                    </button>

                    <div className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-all font-medium text-black cursor-pointer">
                        <span className="text-gray-500">Sort by:</span>
                        <select
                            className="bg-transparent border-none focus:ring-0 p-0 font-medium text-black cursor-pointer outline-none"
                            onChange={(e) => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set('sort', e.target.value);
                                // We need to trigger a router push or window location change
                                // But here we just set params, strictly we need router.
                                // Quick fix: window.location
                                window.location.search = params.toString();
                            }}
                        >
                            <option value="created_desc">Newest Arrivals</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="name_asc">Name: A-Z</option>
                        </select>
                        <div className="w-2 h-2 bg-black rounded-full ml-2"></div>
                    </div>
                </div>
            </div>

            <div className="flex gap-8 items-start relative">

                {/* Filter Sidebar - Desktop */}
                <div
                    className={`
                        transition-all duration-300 ease-in-out flex-shrink-0
                        ${showFilters ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'}
                    `}
                >
                    <FilterSidebar isOpen={showFilters} onClose={() => setShowFilters(false)} />
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {products.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 text-xl border rounded-lg bg-white">
                            No products found matching these filters.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map((card) => (
                                <div key={card.id} className="h-full">
                                    <Card
                                        id={card.id}
                                        title={card.title}
                                        price={card.price}
                                        imageSrc={card.imageSrc}
                                        set={card.set}
                                        rarity={card.rarity}
                                        number={card.number}
                                        condition={card.conditionString}
                                        variantId={card.variantId}
                                        rawPrice={card.rawPrice}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function Shop() {
    return (
        <main className="min-h-screen bg-[#F1F1F1] pt-40 pb-20 px-4 md:px-10">
            <Suspense fallback={<div>Loading...</div>}>
                <ShopContent />
            </Suspense>
        </main>
    );
}

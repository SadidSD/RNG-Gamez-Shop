"use client";

import React, { useState, Suspense, useEffect } from 'react';
import Card from '@/components/ui/Card';
import FilterSidebar from '@/components/ui/FilterSidebar';
import { SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const fetchProducts = async () => {
    console.log("1. Starting fetchProducts...");
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;

        console.log("2. Env Vars:", { apiUrl, apiKey });

        if (!apiUrl) {
            console.error("CRITICAL: NEXT_PUBLIC_API_URL is missing");
            return [];
        }

        const fullUrl = `${apiUrl}/public/products`;
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
        console.log("5. Data received:", data);
        // Return .data because backend returns { store: "...", count: N, data: [] }
        return data.data || [];
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};

function ShopContent() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await fetchProducts();

            // Map backend data to frontend Card format
            // Backend: { id, name, price, image, ... }
            // Frontend: { id, title, price, imageSrc, ... }
            const mapped = data.map((p: any) => ({
                id: p.id,
                title: p.name,
                price: `$${Number(p.price).toFixed(2)}`,
                imageSrc: p.image || "/placeholder.svg",
                // Map Backend 'game' or 'categoryId' to Frontend 'category'
                // User wants "Pokemon Cards", so we expect p.game to be "Pokemon Cards"
                category: p.game || "All",
            }));

            setProducts(mapped);
            setLoading(false);
        };
        load();
    }, []);

    const filteredCards = currentCategory && currentCategory !== 'All'
        ? products.filter(card => card.category === currentCategory)
        : products;

    if (loading) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center">
                <div className="text-xl text-gray-500 animate-pulse">Loading products from store...</div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto">
            {/* DEBUG BANNER - REMOVE LATER */}
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <strong className="font-bold">DEBUG MODE:</strong>
                <span className="block sm:inline"> API URL: {process.env.NEXT_PUBLIC_API_URL || "MISSING"}</span>
                <span className="block sm:inline"> | API KEY: {process.env.NEXT_PUBLIC_API_KEY ? "Set" : "MISSING"}</span>
            </div>
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-sm"></div>
                <span>Collections</span>
                <span>/</span>
                <span className="text-black font-medium">{currentCategory || 'All'}</span>
            </div>

            <div className="flex flex-col gap-6 mb-8">
                <h1 className="text-[80px] font-bold leading-tight tracking-tight" style={{ fontFamily: 'Europa Grotesk SH' }}>
                    {currentCategory || 'Shop All'}
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
                        <select className="bg-transparent border-none focus:ring-0 p-0 font-medium text-black cursor-pointer outline-none">
                            <option>Featured</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                            <option>Newest Arrivals</option>
                        </select>
                        <div className="w-2 h-2 bg-black rounded-full ml-2"></div>
                    </div>
                </div>
            </div>

            <div className="flex gap-8 items-start">
                {/* Filter Sidebar - Conditionally rendered or hidden */}
                <div className={`transition-all duration-300 ease-in-out ${showFilters ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'}`}>
                    <FilterSidebar isOpen={true} onClose={() => setShowFilters(false)} />
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredCards.map((card) => (
                            <div key={card.id} className="h-full">
                                <Card
                                    id={card.id}
                                    title={card.title}
                                    price={card.price}
                                    imageSrc={card.imageSrc}
                                />
                            </div>
                        ))}
                    </div>
                    {filteredCards.length === 0 && (
                        <div className="text-center py-20 text-gray-500 text-xl">
                            No products found in this category.
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

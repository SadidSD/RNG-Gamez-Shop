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
                fetchProducts(),
                fetchCategories()
            ]);

            // Set Categories for Sidebar
            if (categoriesData && categoriesData.length > 0) {
                setCategories(categoriesData.map((c: any) => c.name));
            } else {
                // Fallback defaults if no backend categories
                setCategories(['Pokémon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Sports Cards', 'Supplies', 'Graded Cards']);
            }

            const mapped = productsData.map((p: any) => ({
                id: p.id,
                title: p.name,
                price: `$${Number(p.price).toFixed(2)}`,
                imageSrc: (p.images && p.images.length > 0) ? p.images[0] : "/placeholder.svg",
                // Prefer linked category name, fallback to game, fallback to All
                category: p.category ? p.category.name : (p.game || "All"),
            }));

            setProducts(mapped);
            setLoading(false);
        };
        load();
    }, []);

    const filteredCards = currentCategory && currentCategory !== 'All'
        ? products.filter(card => {
            const cardCat = (card.category || "").toLowerCase().trim();
            const filterCat = (currentCategory || "").toLowerCase().trim();
            return cardCat === filterCat;
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
            {/* DEBUG BANNER - REMOVE LATER */}
            {/* ... banner code ... */}

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
                    <FilterSidebar isOpen={true} onClose={() => setShowFilters(false)} categories={categories} />
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

"use client";

import React, { useState, Suspense, useEffect } from 'react';
import Card from '@/components/ui/Card';
import { FilterSidebar } from '@/components/shop/FilterSidebar';
import { SlidersHorizontal } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

const fetchSingles = async (searchParams: URLSearchParams) => {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const apiKey = process.env.NEXT_PUBLIC_API_KEY;
        if (!apiUrl) return [];

        // Always inject singles=true so only individual trading cards are returned
        const params = new URLSearchParams(searchParams.toString());
        params.set('singles', 'true');

        const res = await fetch(`${apiUrl}/public/products?${params.toString()}`, {
            headers: { 'x-api-key': apiKey || '' },
            cache: 'no-store',
        });

        if (!res.ok) throw new Error('Failed to fetch singles');
        const data = await res.json();
        return data.data || [];
    } catch (error) {
        console.error('Error fetching singles:', error);
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
    } catch {
        return [];
    }
};

function SinglesContent() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const [productsData, categoriesData] = await Promise.all([
                fetchSingles(searchParams),
                fetchCategories(),
            ]);

            if (categoriesData && categoriesData.length > 0) {
                setCategories(categoriesData.map((c: any) => c.name));
            } else {
                setCategories(['Pokemon', 'Magic: The Gathering', 'Yu-Gi-Oh!', 'Sports Cards']);
            }

            const mapped = productsData.map((p: any) => ({
                id: p.id,
                title: p.name,
                price: `$${Number(p.price).toFixed(2)}`,
                imageSrc: p.images?.[0] || '/placeholder.svg',
                category: p.category ? p.category.name : (p.game || 'All'),
                set: p.set || '',
                rarity: p.rarity || '',
                number: p.collectorNumber || '',
                conditionString: p.variants?.length > 0
                    ? `${p.variants[0].condition || 'NM'}${p.variants[0].isFoil ? ' Foil' : ''}`
                    : '',
                rawPrice: Number(p.price),
                variantId: p.variants?.[0]?.id,
            }));

            setProducts(mapped);
            setLoading(false);
        };
        load();
    }, [searchParams]);

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', e.target.value);
        router.push(`/singles?${params.toString()}`);
    };

    const displayTitle = searchParams.get('category') || 'Singles';

    return (
        <div className="max-w-[1600px] mx-auto">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-sm"></div>
                <span>Singles</span>
                {searchParams.get('category') && (
                    <>
                        <span>/</span>
                        <span className="text-black font-medium">{searchParams.get('category')}</span>
                    </>
                )}
            </div>

            <div className="flex flex-col gap-4 md:gap-6 mb-8">
                <h1
                    className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight tracking-tight"
                    style={{ fontFamily: 'Europa Grotesk SH' }}
                >
                    {displayTitle}
                </h1>

                <div className="flex flex-wrap items-center justify-between gap-3">
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
                            onChange={handleSortChange}
                            defaultValue={searchParams.get('sort') || 'created_desc'}
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
                {/* Filter Sidebar */}
                <div
                    className={`transition-all duration-300 ease-in-out flex-shrink-0 ${
                        showFilters ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'
                    }`}
                >
                    <FilterSidebar isOpen={showFilters} onClose={() => setShowFilters(false)} />
                </div>

                {/* Product Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="min-h-[50vh] flex items-center justify-center">
                            <div className="text-xl text-gray-500 animate-pulse">Loading singles...</div>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 text-xl border rounded-lg bg-white">
                            No singles found matching these filters.
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

export default function Singles() {
    return (
        <main className="min-h-screen bg-[#F1F1F1] pt-28 md:pt-40 pb-20 px-4 md:px-10">
            <Suspense fallback={<div>Loading...</div>}>
                <SinglesContent />
            </Suspense>
        </main>
    );
}

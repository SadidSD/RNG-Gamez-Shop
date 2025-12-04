"use client";

import React, { useState, Suspense } from 'react';
import Card from '@/components/ui/Card';
import FilterSidebar from '@/components/ui/FilterSidebar';
import { SlidersHorizontal } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

const CARDS = [
    {
        id: 1,
        title: "Pokémon Tripack ME02: Phantasmal Flames – English",
        price: "$4000.00",
        imageSrc: "/cover.jpg",
        category: "Pokémon"
    },
    {
        id: 2,
        title: "Magic Card Example 1",
        price: "$10.00",
        imageSrc: "/magic.jpg",
        category: "Magic: The Gathering"
    },
    {
        id: 3,
        title: "Yu-Gi-Oh Card Example 1",
        price: "$20.00",
        imageSrc: "/YuGiOh.jpg",
        category: "Yu-Gi-Oh!"
    },
    {
        id: 4,
        title: "Graded Card Example 1",
        price: "$500.00",
        imageSrc: "/graded.jpg",
        category: "Graded Cards"
    },
    {
        id: 5,
        title: "Pokémon Tripack ME02: Phantasmal Flames – English",
        price: "$4000.00",
        imageSrc: "/cover.jpg",
        category: "Pokémon"
    },
    {
        id: 6,
        title: "Magic Card Example 2",
        price: "$20.00",
        imageSrc: "/magic.jpg",
        category: "Magic: The Gathering"
    },
    {
        id: 7,
        title: "Pokémon Tripack ME02: Phantasmal Flames – English",
        price: "$4000.00",
        imageSrc: "/cover.jpg",
        category: "Pokémon"
    },
    {
        id: 8,
        title: "Pokémon Tripack ME02: Phantasmal Flames – English",
        price: "$4000.00",
        imageSrc: "/cover.jpg",
        category: "Pokémon"
    }
];

function ShopContent() {
    const [showFilters, setShowFilters] = useState(false);
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');

    const filteredCards = currentCategory
        ? CARDS.filter(card => card.category === currentCategory)
        : CARDS;

    return (
        <div className="max-w-[1600px] mx-auto">
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

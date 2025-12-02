"use client";

import React from 'react';
import Card from '@/components/ui/Card';

export default function MTGPage() {
    // Dummy data for products
    const products = [
        {
            id: 1,
            title: "Magic Card Example 1",
            price: "$10.00",
            imageSrc: "/magic.jpg"
        },
        {
            id: 2,
            title: "Magic Card Example 2",
            price: "$20.00",
            imageSrc: "/magic.jpg"
        },
        {
            id: 3,
            title: "Magic Card Example 3",
            price: "$30.00",
            imageSrc: "/magic.jpg"
        },
        {
            id: 4,
            title: "Magic Card Example 4",
            price: "$40.00",
            imageSrc: "/magic.jpg"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F1F1F1] pt-40 pb-20 px-6">
            <div className="max-w-[1600px] mx-auto">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <span className="w-4 h-4 bg-purple-500 rounded-sm"></span>
                    <span>Magic The Gathering</span>
                    <span>/</span>
                    <span className="text-black font-medium">All</span>
                </div>

                {/* Header */}
                <h1 className="text-[80px] font-bold text-black leading-tight mb-12" style={{ fontFamily: 'Europa Grotesk SH' }}>
                    Magic The Gathering
                </h1>

                {/* Controls */}
                <div className="flex items-center justify-between mb-12">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors">
                        <span className="w-5 h-5 bg-orange-400 rounded-sm"></span>
                        <span className="font-medium text-black">Show filters</span>
                    </button>

                    <div className="flex items-center gap-4">
                        <span className="text-gray-500">Sort by:</span>
                        <button className="flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-gray-200 hover:bg-gray-50 transition-colors min-w-[160px] justify-between">
                            <span className="font-medium text-black">Featured</span>
                            <span className="w-2 h-2 bg-black rounded-full"></span>
                        </button>
                    </div>
                </div>

                {/* Product Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card
                            key={product.id}
                            id={product.id}
                            title={product.title}
                            price={product.price}
                            imageSrc={product.imageSrc}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

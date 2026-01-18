"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import Card from '@/components/ui/Card';

export default function ProductPage({ params }: { params: { id: string } }) {
    const [quantity, setQuantity] = useState(1);
    const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

    const handleQuantityChange = (type: 'increase' | 'decrease') => {
        if (type === 'decrease' && quantity > 1) {
            setQuantity(quantity - 1);
        } else if (type === 'increase') {
            setQuantity(quantity + 1);
        }
    };

    // Dummy data for recommended products
    const recommendedProducts = [
        {
            id: 1,
            title: "Pokemon Tripack ME02: Phantasmal Flames – English",
            price: "$4,000.00",
            imageSrc: "/pokemon.jpg"
        },
        {
            id: 2,
            title: "Pokemon Tripack ME02: Phantasmal Flames – English",
            price: "$4,000.00",
            imageSrc: "/pokemon.jpg"
        },
        {
            id: 3,
            title: "Pokemon Tripack ME02: Phantasmal Flames – English",
            price: "$4,000.00",
            imageSrc: "/pokemon.jpg"
        },
        {
            id: 4,
            title: "Pokemon Tripack ME02: Phantasmal Flames – English",
            price: "$4,000.00",
            imageSrc: "/pokemon.jpg"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F1F1F1] pt-40 pb-20 px-6">
            <div className="max-w-[1200px] mx-auto bg-white rounded-[30px] p-8 md:p-12 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Left Column - Images */}
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            {/* Thumbnails */}
                            <div className="flex flex-col gap-4">
                                <div className="w-20 h-20 bg-gray-100 rounded-lg border border-black overflow-hidden relative">
                                    {/* Placeholder for thumbnail */}
                                    <div className="absolute inset-0 bg-[url('/diagonal-stripes.png')] opacity-10"></div>
                                </div>
                            </div>

                            {/* Main Image */}
                            <div className="flex-1 aspect-square bg-gray-200 rounded-[20px] overflow-hidden relative">
                                {/* Placeholder pattern matching design */}
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#ffffff_10px,#ffffff_20px)] opacity-20"></div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Details */}
                    <div className="flex flex-col gap-6">
                        <h1 className="text-4xl font-bold text-black">Title</h1>

                        <div className="flex flex-col gap-1">
                            <span className="text-2xl font-bold text-black">Free</span>
                            <span className="text-gray-500">10 in stock</span>
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center bg-gray-100 rounded-lg">
                                <button
                                    onClick={() => handleQuantityChange('decrease')}
                                    className="p-3 hover:bg-gray-200 rounded-l-lg transition-colors"
                                >
                                    <Minus size={16} className="text-black" />
                                </button>
                                <span className="w-12 text-center font-medium text-black">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange('increase')}
                                    className="p-3 hover:bg-gray-200 rounded-r-lg transition-colors"
                                >
                                    <Plus size={16} className="text-black" />
                                </button>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3 mt-4">
                            <button className="w-full bg-[#B266FF] text-white font-bold py-4 rounded-xl hover:bg-[#9933FF] transition-colors">
                                Add to Cart
                            </button>
                            <button className="w-full bg-[#0F172A] text-white font-bold py-4 rounded-xl hover:bg-[#1E293B] transition-colors">
                                Buy Now
                            </button>
                        </div>

                        {/* Description Accordion */}
                        <div className="mt-6 border-t border-gray-200 pt-6">
                            <button
                                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                                className="flex items-center justify-between w-full mb-4"
                            >
                                <span className="text-lg font-bold text-black">Product description</span>
                                <ChevronDown
                                    size={20}
                                    className={`text-black transition-transform duration-300 ${isDescriptionOpen ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ${isDescriptionOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    Adjust your personal notification preferences and choose which updates you want to receive. These settings will only be applied to your personal account.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recommended Products Section */}
            <div className="max-w-[1200px] mx-auto mt-20">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-4xl font-bold text-black" style={{ fontFamily: 'Europa Grotesk SH' }}>Recommended products</h2>
                    <button className="px-6 py-2 bg-[#D8B4FE] text-black font-bold rounded-full hover:bg-[#C084FC] transition-colors">
                        See More
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {recommendedProducts.map((product) => (
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

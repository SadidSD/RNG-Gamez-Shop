"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-gray-200 py-4 last:border-0">
            <button
                className="flex items-center justify-between w-full text-left mb-2 group"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-semibold text-lg">{title}</span>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500 group-hover:text-black" /> : <ChevronDown className="w-5 h-5 text-gray-500 group-hover:text-black" />}
            </button>
            {isOpen && (
                <div className="mt-2 space-y-2">
                    {children}
                </div>
            )}
        </div>
    );
};

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    categories: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose, categories }) => {
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('category');

    const handleCategoryChange = (category: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (category === currentCategory) {
            params.delete('category');
        } else {
            params.set('category', category);
        }
        router.push(`/shop?${params.toString()}`);
    };

    if (!isOpen) return null;

    return (
        <div className="w-full md:w-64 flex-shrink-0 bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-fit">
            <div className="flex items-center justify-between mb-4 md:hidden">
                <h2 className="text-xl font-bold">Filters</h2>
                <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <FilterSection title="Categories">
                {categories.map((category) => (
                    <label key={category} className="flex items-center space-x-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 text-[#B266FF] focus:ring-[#B266FF]"
                            checked={currentCategory === category}
                            onChange={() => handleCategoryChange(category)}
                        />
                        <span className="text-gray-700 group-hover:text-black transition-colors">{category}</span>
                    </label>
                ))}
            </FilterSection>

            <FilterSection title="Price Range">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#B266FF]"
                            placeholder="Min"
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                        />
                    </div>
                    <span className="text-gray-400">-</span>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <input
                            type="number"
                            className="w-full pl-6 pr-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-[#B266FF]"
                            placeholder="Max"
                            value={priceRange.max}
                            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                        />
                    </div>
                </div>
            </FilterSection>

            <FilterSection title="Availability">
                <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="checkbox" className="rounded border-gray-300 text-[#B266FF] focus:ring-[#B266FF]" />
                    <span className="text-gray-700 group-hover:text-black transition-colors">In Stock</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer group">
                    <input type="checkbox" className="rounded border-gray-300 text-[#B266FF] focus:ring-[#B266FF]" />
                    <span className="text-gray-700 group-hover:text-black transition-colors">Pre-order</span>
                </label>
            </FilterSection>
        </div>
    );
};

export default FilterSidebar;

"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
    id: number | string;
    title: string;
    price: string;
    imageSrc: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, title, price, imageSrc }) => {
    return (
        <div className="bg-white rounded-[30px] p-4 flex flex-col gap-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <Link href={`/product/${id}`} className="block">
                {/* Image Container */}
                <div className="relative aspect-square w-full bg-white rounded-[20px] overflow-hidden flex items-center justify-center p-4">
                    <div className="relative w-full h-full">
                        <Image
                            src={imageSrc}
                            alt={title}
                            fill
                            className="object-contain hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 px-2 mt-4">
                    <h3 className="text-lg font-medium text-black leading-tight line-clamp-2 min-h-[3rem]">
                        {title}
                    </h3>
                    <p className="text-lg font-bold text-black">
                        {price}
                    </p>
                </div>
            </Link>

            {/* Add to Cart Button */}
            <button className="w-full bg-[#B266FF] text-black font-bold py-3 px-6 rounded-full flex items-center justify-between hover:bg-[#9933FF] hover:text-white transition-all duration-300 group">
                <span className="uppercase text-sm tracking-wider">Add to cart</span>
                <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
            </button>
        </div>
    );
};

export default ProductCard;

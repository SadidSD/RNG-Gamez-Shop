import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useShopCart } from '@/context/ShopCartContext';

interface CardProps {
    id: number | string;
    title: string;
    price: string;
    imageSrc: string;
    set?: string;
    rarity?: string;
    number?: string;
    condition?: string;
    variantId?: string;
    rawPrice?: number;
}

const Card: React.FC<CardProps> = ({ id, title, price, imageSrc, set, rarity, number, condition, variantId, rawPrice }) => {
    const { addItem } = useShopCart();
    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent Link navigation
        console.log('Card AddToCart clicked:', { id, variantId, rawPrice, title });
        if (variantId && rawPrice) {
            addItem({
                variantId,
                productId: String(id),
                name: title,
                set: set || '',
                condition: condition || 'NM',
                price: rawPrice,
                image: imageSrc
            });
            setIsAdded(true);
            setTimeout(() => setIsAdded(false), 1500);
        } else {
            console.warn('Cannot add to cart: Missing variantId or rawPrice');
        }
    };

    return (
        <div className="group/card bg-[#FAFAFA] rounded-[30px] p-2 shadow-[0px_1px_2px_0px_rgba(4,13,36,0.23)] w-full h-full flex flex-col overflow-hidden hover:shadow-[0px_4px_12px_rgba(4,13,36,0.15)] transition-shadow duration-300">
            <Link href={`/product/${id}`} className="block flex-1 flex flex-col">
                <div className="bg-[#FAFAFA] rounded-[30px] shadow-[2px_2px_5px_2px_rgba(4,13,36,0.15)] mb-4 overflow-hidden relative aspect-[4/3]">
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-contain p-2 transition-transform duration-500 ease-out group-hover/card:scale-110"
                    />
                </div>
                <div className="px-2 mb-4 flex-1 flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-black leading-tight line-clamp-2">
                        {title}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                        {set && <span className="bg-gray-200 px-2 py-0.5 rounded-full">{set}</span>}
                        {number && <span>#{number}</span>}
                        {rarity && <span className="capitalize text-gray-400">{rarity}</span>}
                        {condition && <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider">{condition}</span>}
                    </div>
                    <p className="text-xl font-bold text-black mt-auto pt-2">
                        {price}
                    </p>
                </div>
            </Link>
            <button
                onClick={handleAddToCart}
                disabled={isAdded || !variantId}
                className={`group/button relative overflow-hidden font-bold py-3 md:py-4 rounded-full flex items-center justify-between transition-all duration-300 px-4 md:px-6 lg:px-8 w-full ${isAdded ? 'bg-green-500 text-white' : 'bg-[#B266FF] text-black hover:text-white'}`}
            >
                {isAdded ? (
                    <span className="flex items-center justify-center w-full gap-2">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        ADDED
                    </span>
                ) : (
                    <>
                        <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                            <span className="absolute top-full left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[#9933FF] transition-all duration-500 ease-out group-hover/button:top-1/2 group-hover/button:-translate-y-1/2"></span>
                        </span>
                        <span className="relative z-10 text-sm md:text-base">ADD TO CART</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </>
                )}
            </button>
        </div>
    );
};

export default Card;

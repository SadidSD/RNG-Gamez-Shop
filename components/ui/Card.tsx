import React from 'react';
import Image from 'next/image';

interface CardProps {
    title: string;
    price: string;
    imageSrc: string;
}

const Card: React.FC<CardProps> = ({ title, price, imageSrc }) => {
    return (
        <div className="group/card bg-[#FAFAFA] rounded-[30px] p-2 shadow-[0px_1px_2px_0px_rgba(4,13,36,0.23)] w-[350px] h-[467px] flex flex-col overflow-hidden hover:shadow-[0px_4px_12px_rgba(4,13,36,0.15)] transition-shadow duration-300">
            <div className="bg-[#FAFAFA] rounded-[30px] shadow-[2px_2px_5px_2px_rgba(4,13,36,0.15)] mb-4 overflow-hidden flex-1 relative">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-500 ease-out group-hover/card:scale-110"
                />
            </div>
            <div className="flex flex-col gap-4">
                <div className="px-2">
                    <h3 className="text-2xl font-medium text-black leading-tight line-clamp-2">
                        {title}
                    </h3>
                    <p className="text-2xl font-bold text-black">
                        {price}
                    </p>
                </div>
                <button className="group/button relative overflow-hidden bg-[#B266FF] text-black font-bold py-4 rounded-r-full flex items-center justify-between transition-colors duration-300 hover:text-white -ml-2 mr-2 px-8 pr-6">
                    <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-r-full">
                        <span className="absolute top-full left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-[#9933FF] transition-all duration-500 ease-out group-hover/button:top-1/2 group-hover/button:-translate-y-1/2"></span>
                    </span>
                    <span className="relative z-10">ADD TO CART</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Card;

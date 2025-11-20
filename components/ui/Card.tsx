import React from 'react';
import Image from 'next/image';

interface CardProps {
    title: string;
    price: string;
    imageSrc: string;
}

const Card: React.FC<CardProps> = ({ title, price, imageSrc }) => {
    return (
        <div className="bg-[#FAFAFA] rounded-[30px] p-2 shadow-lg w-[350px] flex flex-col overflow-hidden">
            <div className="bg-white rounded-[30px] shadow-[0_0_3px_rgba(0,0,0,0.2)] mb-4 overflow-hidden">
                <div className="relative w-full h-[250px]">
                    <Image
                        src={imageSrc}
                        alt={title}
                        fill
                        className="object-cover"
                    />
                </div>
            </div>
            <div className="flex flex-col gap-4 px-2">
                <h3 className="text-2xl font-medium text-black leading-tight line-clamp-2">
                    {title}
                </h3>
                <p className="text-2xl font-bold text-black">
                    {price}
                </p>
                <button className="bg-[#B266FF] hover:bg-[#9933FF] text-black font-bold py-4 px-6 rounded-r-full rounded-l-none flex items-center justify-between transition-colors mt-2 -ml-4 pl-6 w-[calc(100%+1rem)]">
                    <span className="text-lg">ADD TO CART</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <circle cx="8" cy="21" r="1" />
                        <circle cx="19" cy="21" r="1" />
                        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Card;

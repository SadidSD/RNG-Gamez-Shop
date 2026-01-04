import React from 'react';
import Image from 'next/image';

const CategoryGrid = () => {
    return (
        <div className="w-full min-h-screen bg-[#F1F1F1] p-10 flex items-center justify-center">
            <div className="w-full max-w-[1600px] h-[800px] flex gap-6">
                {/* Left Column */}
                <div className="w-2/3 flex flex-col gap-6">
                    {/* Top Row */}
                    <div className="h-1/2 flex gap-6">
                        <div className="relative w-1/2 h-full rounded-[30px] overflow-hidden group shadow-lg">
                            <Image src="/graded.jpg" alt="Graded Cards" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-x-0 bottom-0 h-2/3 backdrop-blur-md [mask-image:linear-gradient(to_top,black,transparent)] pointer-events-none" />
                            <a href="/shop?category=Graded Cards" className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-gray-100 transition-colors uppercase tracking-wider text-sm whitespace-nowrap">
                                GRADED CARDS
                            </a>
                        </div>
                        <div className="relative w-1/2 h-full rounded-[30px] overflow-hidden group shadow-lg">
                            <Image src="/YuGiOh.jpg" alt="Yu-Gi-Oh" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                            <div className="absolute inset-x-0 bottom-0 h-2/3 backdrop-blur-md [mask-image:linear-gradient(to_top,black,transparent)] pointer-events-none" />
                            <a href="/shop?category=Yu-Gi-Oh!" className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-gray-100 transition-colors uppercase tracking-wider text-sm whitespace-nowrap">
                                YU-GI-OH
                            </a>
                        </div>
                    </div>
                    {/* Bottom Row */}
                    <div className="relative h-1/2 w-full rounded-[30px] overflow-hidden group shadow-lg">
                        <Image src="/pokemon.jpg" alt="Pokemon" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 backdrop-blur-md [mask-image:linear-gradient(to_top,black,transparent)] pointer-events-none" />
                        <a href="/shop?category=Pokemon" className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-gray-100 transition-colors uppercase tracking-wider text-sm whitespace-nowrap">
                            POKEMON
                        </a>
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-1/3 flex flex-col gap-6">
                    <div className="relative flex-grow rounded-[30px] overflow-hidden group shadow-lg">
                        <Image src="/magic.jpg" alt="Magic The Gathering" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute inset-x-0 bottom-0 h-2/3 backdrop-blur-md [mask-image:linear-gradient(to_top,black,transparent)] pointer-events-none" />
                        <a href="/shop?category=Magic: The Gathering" className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white text-black font-bold py-3 px-8 rounded-xl shadow-lg hover:bg-gray-100 transition-colors uppercase tracking-wider text-sm whitespace-nowrap">
                            MAGIC THE GATHERING
                        </a>
                    </div>
                    <div className="relative h-[120px] bg-[#040D24] rounded-[30px] shadow-lg flex items-center justify-center overflow-hidden group">
                        <a href="/shop?category=Supplies" className="bg-white text-black font-bold py-3 px-12 rounded-xl shadow-lg hover:bg-gray-100 transition-colors uppercase tracking-wider text-sm">
                            MERCH
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryGrid;

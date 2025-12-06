"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowUpRight, CircleDollarSign, Coins, CreditCard } from 'lucide-react';

const SellYourCardsSection = () => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="w-full min-h-screen bg-[#F1F1F1] py-20 px-10 flex flex-col items-center">
            {/* Header */}
            <div className="text-center max-w-3xl mb-20">
                <h2 className="text-[80px] font-bold text-black leading-tight mb-6 uppercase" style={{ fontFamily: 'Europa Grotesk SH' }}>
                    SELL YOUR CARDS
                </h2>
                <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                    SELL YOUR CARDS eahowivuosehbveuwsobv ev bouwvbewobv bur evbes jbewoubvweo be bvevb oeubveo oew bveou veu uoebv uoeb vebwo bveouw beuov bouewuvb weobv oeu uwe ve beu
                </p>
                <motion.button
                    className="bg-[#B266FF] px-8 py-3 rounded-full font-bold flex items-center gap-2 mx-auto transition-colors hover:bg-[#9933FF]"
                    onHoverStart={() => setIsHovered(true)}
                    onHoverEnd={() => setIsHovered(false)}
                    layout
                >
                    <motion.span
                        layout
                        className={`text-xl transition-colors duration-300 ${isHovered ? "text-white order-2" : "text-black order-1"}`}
                    >
                        Sell Now
                    </motion.span>
                    <motion.div
                        layout
                        className={`rounded-full p-1 transition-colors duration-300 ${isHovered ? "bg-black order-1" : "bg-white order-2"}`}
                    >
                        <ArrowUpRight className={`w-4 h-4 transition-colors duration-300 ${isHovered ? "text-white" : "text-[#B266FF]"}`} />
                    </motion.div>
                </motion.button>
            </div>

            {/* Grid */}
            <div className="w-full max-w-[1600px] grid grid-cols-3 gap-8">
                {/* Box 1 */}
                <div className="relative h-[500px] bg-gray-300 rounded-[30px] overflow-hidden group">
                    <Image
                        src="/sellYourCards.png"
                        alt="Sell Your Cards"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-6 left-6 right-6 bg-[#040D24]/90 backdrop-blur-sm rounded-[20px] p-6 flex items-center gap-4 z-10">
                        <div className="bg-white rounded-full p-2">
                            <CircleDollarSign className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-white font-bold text-xl uppercase tracking-wider">
                            SELL YOUR CARDS
                        </span>
                    </div>
                </div>

                {/* Box 2 */}
                <div className="relative h-[500px] bg-gray-300 rounded-[30px] overflow-hidden group">
                    <Image
                        src="/getCreditScore.jpg"
                        alt="Get Credit Scores"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-6 left-6 right-6 bg-[#040D24]/90 backdrop-blur-sm rounded-[20px] p-6 flex items-center gap-4 z-10">
                        <div className="bg-white rounded-full p-2">
                            <Coins className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-white font-bold text-xl uppercase tracking-wider">
                            GET CREDIT SCORES
                        </span>
                    </div>
                </div>

                {/* Box 3 */}
                <div className="relative h-[500px] bg-gray-300 rounded-[30px] overflow-hidden group">
                    <Image
                        src="/buyNewCards.jpg"
                        alt="Buy New Cards"
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute bottom-6 left-6 right-6 bg-[#040D24]/90 backdrop-blur-sm rounded-[20px] p-6 flex items-center gap-4 z-10">
                        <div className="bg-white rounded-full p-2">
                            <CreditCard className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-white font-bold text-xl uppercase tracking-wider">
                            BUY NEW CARDS
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellYourCardsSection;

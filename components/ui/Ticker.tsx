"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Ticker = () => {
    const items = [
        { id: 1, text: "Free Shipping on Orders Above $50" },
        { id: 2, text: "Sell Your Cards" },
        { id: 3, text: "20% off" },
    ];

    return (
        <div className="w-full bg-[#B266FF] overflow-hidden py-6 border-y border-white/10">
            <div className="flex whitespace-nowrap">
                <motion.div
                    className="flex items-center gap-32 pr-32"
                    animate={{ x: "-100%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 50, // Adjust speed as needed
                    }}
                >
                    {[...items, ...items, ...items, ...items].map((item, index) => (
                        <div key={index} className="flex items-center gap-10">
                            <Image src="/RNG-logo.png" alt="RNG Logo" width={100} height={100} className="object-contain" />
                            <span className="text-3xl font-bold text-white tracking-wider" style={{ fontFamily: 'Europa Grotesk SH' }}>
                                {item.text}
                            </span>
                        </div>
                    ))}
                </motion.div>
                <motion.div
                    className="flex items-center gap-32 pr-32"
                    animate={{ x: "-100%" }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 50, // Match duration above
                    }}
                >
                    {[...items, ...items, ...items, ...items].map((item, index) => (
                        <div key={`clone-${index}`} className="flex items-center gap-10">
                            <Image src="/RNG-logo.png" alt="RNG Logo" width={100} height={100} className="object-contain" />
                            <span className="text-3xl font-bold text-white tracking-wider" style={{ fontFamily: 'Europa Grotesk SH' }}>
                                {item.text}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default Ticker;

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "@/components/ui/Card";

interface ProductSliderSectionProps {
    title: string;
    cards: Array<{
        id: number | string;
        title: string;
        price: string;
        imageSrc: string;
    }>;
    linkUrl?: string;
    linkText?: string;
}

export default function ProductSliderSection({
    title,
    cards,
    linkUrl = "/shop",
    linkText = "See more",
}: ProductSliderSectionProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(4);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsPerPage(1);
            } else if (window.innerWidth < 768) {
                setItemsPerPage(2);
            } else if (window.innerWidth < 1024) {
                setItemsPerPage(3);
            } else {
                setItemsPerPage(4);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev + 1 > cards.length - itemsPerPage ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev - 1 < 0 ? cards.length - itemsPerPage : prev - 1
        );
    };

    return (
        <div className="w-full py-20 bg-[#F1F1F1]">
            <div className="w-full max-w-[1600px] mx-auto px-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-12 px-20">
                    <p
                        className="font-bold text-[72px] text-black tracking-[0.03em] leading-[1.2em]"
                        style={{ fontFamily: "Europa Grotesk SH" }}
                    >
                        {title}
                    </p>
                    <a
                        href={linkUrl}
                        className="group relative overflow-hidden text-lg font-bold text-black bg-[#B266FF] px-6 py-3 rounded-full transition-colors duration-300 hover:text-white"
                    >
                        <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
                            <span className="absolute top-full left-1/2 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-[#9933FF] transition-all duration-500 ease-out group-hover:top-1/2 group-hover:-translate-y-1/2"></span>
                        </span>
                        <span className="relative z-10 flex items-center justify-center transition-transform duration-300 group-hover:-translate-x-3">
                            {linkText}
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={3}
                                stroke="currentColor"
                                className="absolute left-full w-5 h-5 -translate-x-2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                                />
                            </svg>
                        </span>
                    </a>
                </div>

                {/* Slider Row */}
                <div className="flex items-center gap-5">
                    {/* Prev Button */}
                    <button
                        onClick={prevSlide}
                        className="flex-shrink-0 z-10 w-14 h-14 flex items-center justify-center rounded-2xl bg-[#B266FF] text-white shadow-lg hover:bg-[#9933FF] transition-all"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    {/* Slider Window */}
                    <div className="flex-1 overflow-hidden py-10 px-4">
                        <motion.div
                            className="flex gap-6"
                            animate={{ x: `calc(-${currentIndex} * (100% + 24px) / ${itemsPerPage})` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        >
                            {cards.map((card) => (
                                <motion.div
                                    key={card.id}
                                    className="flex-shrink-0 flex justify-center"
                                    style={{
                                        width: `calc((100% - ${(itemsPerPage - 1) * 24}px) / ${itemsPerPage})`,
                                    }}
                                >
                                    <Card
                                        id={card.id}
                                        title={card.title}
                                        price={card.price}
                                        imageSrc={card.imageSrc}
                                    />
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={nextSlide}
                        className="flex-shrink-0 z-10 w-14 h-14 flex items-center justify-center rounded-2xl bg-[#B266FF] text-white shadow-lg hover:bg-[#9933FF] transition-all"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </div>
            </div>
        </div>
    );
}

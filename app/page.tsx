"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Ticker from "@/components/ui/Ticker";
import CategoryGrid from "@/components/ui/CategoryGrid";
import SellYourCardsSection from "@/components/ui/SellYourCardsSection";
import SocialMediaSection from "@/components/ui/SocialMediaSection";

const CARDS = [
  {
    id: 1,
    title: "Pokémon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  },
  {
    id: 2,
    title: "Pokémon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  },
  {
    id: 3,
    title: "Pokémon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  },
  {
    id: 4,
    title: "Pokémon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  },
  {
    id: 5,
    title: "Pokémon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  },
  {
    id: 6,
    title: "Pokémon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  },
  {
    id: 7,
    title: "Pokémon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  },
  {
    id: 8,
    title: "Pokémon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  }
];

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 4;

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + 1 > CARDS.length - itemsPerPage ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - 1 < 0 ? CARDS.length - itemsPerPage : prev - 1
    );
  };

  return (
    <main className="min-h-screen">
      <div className="relative h-screen w-full">
        <Image
          src="/cover.jpg"
          alt="Cover"
          fill
          priority
          unoptimized
          style={{ objectFit: "cover" }}
        />
        {/* Add your page content here, over the cover image */}
        <div className="absolute inset-0 flex flex-col items-start justify-center pl-20">
          <div className="mt-4 ">
            {/* TEXT SETUP APPLIED HERE */}
            <p className="font-bold text-[72px] text-[#F1F1F1] tracking-[0.03em] leading-[1.2em]" style={{ fontFamily: 'Europa Grotesk SH' }}>
              CHECK OUT
            </p>
            <p className="font-bold text-[72px] text-[#F1F1F1] tracking-[0.03em] leading-[1.2em]" style={{ fontFamily: 'Europa Grotesk SH' }}>
              WHATS NEW
            </p>
            <Button className="mt-2">Shop Now</Button>
          </div>
        </div>

        {/* Gradient Box Overlay */}
        <div
          className="absolute top-[80%] right-50 transform -translate-y-1/2 w-[250px] h-[200px] rounded-[30px] overflow-hidden"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
        </div>
      </div>

      {/* New Section */}
      <div className="relative min-h-screen w-full p-10 bg-[#F1F1F1]">
        <div className="absolute top-10 left-10 right-10 flex justify-between items-center">
          <p className="font-bold text-[72px] text-black tracking-[0.03em] leading-[1.2em]" style={{ fontFamily: 'Europa Grotesk SH' }}>
            WHAT'S HOT
          </p>
          <a href="/shop" className="text-xl font-bold text-white bg-[#B266FF] px-8 py-3 rounded-full hover:bg-[#9933FF] transition-colors">
            See more
          </a>
        </div>

        <div className="mt-40 relative w-full max-w-[1600px] mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-[-60px] top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-[-60px] top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slider Container */}
          <div className="overflow-hidden w-full py-20">
            <motion.div
              className="flex gap-5"
              animate={{ x: `-${currentIndex * (100 / itemsPerPage)}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {CARDS.map((card) => (
                <motion.div
                  key={card.id}
                  className="flex-shrink-0 flex justify-center"
                  style={{ width: 'calc((100% - 72px) / 4)' }}
                >
                  <Card
                    title={card.title}
                    price={card.price}
                    imageSrc={card.imageSrc}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      <Ticker />
      <CategoryGrid />
      <SellYourCardsSection />
      <div className="h-screen w-full bg-[#F1F1F1]" />
      <SocialMediaSection />
    </main>
  );
}
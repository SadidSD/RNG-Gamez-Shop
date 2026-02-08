"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import QuickBrowseSection from '@/components/ui/QuickBrowseSection';
import ProductSliderSection from "@/components/ui/ProductSliderSection";
import Ticker from "@/components/ui/Ticker";
import CategoryGrid from "@/components/ui/CategoryGrid";
import SellYourCardsSection from "@/components/ui/SellYourCardsSection";
import ReviewsSection from "@/components/ui/ReviewsSection";
import SocialMediaSection from "@/components/ui/SocialMediaSection";
import StoreLocationSection from "@/components/ui/StoreLocationSection";


const CARDS = [
  {
    id: 1,
    title: "Pokemon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  },
  {
    id: 2,
    title: "Pokemon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  },
  {
    id: 3,
    title: "Pokemon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  },
  {
    id: 4,
    title: "Pokemon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  },
  {
    id: 5,
    title: "Pokemon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  },
  {
    id: 6,
    title: "Pokemon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  },
  {
    id: 7,
    title: "Pokemon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  },
  {
    id: 8,
    title: "Pokemon Tripack ME02: Phantasmal Flames – English",
    price: "$4000.00",
    imageSrc: "/cover.jpg"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <div className="relative h-screen w-full bg-black">
        <Image
          src="/hero-bg-final.jpg"
          alt="Cover"
          fill
          priority
          quality={100}
          style={{ objectFit: "contain" }}
        />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        {/* Add your page content here, over the cover image */}
        <div className="absolute inset-0 flex flex-col justify-center">

          <div className="pl-40 mt-4">
            {/* TEXT SETUP APPLIED HERE */}
            <div className="max-w-2xl">
              <h1 className="font-bold text-[60px] text-[#F1F1F1] tracking-tight leading-[1.1em] mb-6" style={{ fontFamily: 'Europa Grotesk SH' }}>
                Find the exact card you’re looking for.
              </h1>
              <p className="text-xl text-gray-200 mb-8 leading-relaxed max-w-lg">
                Browse thousands of Magic: The Gathering cards by set, condition, language, and format — updated with real market pricing.
              </p>
              <div className="flex gap-4">
                <Button className="text-lg px-8 py-4 bg-[#B266FF] hover:bg-[#9944FF] text-white">
                  Browse Cards
                </Button>
                <Button variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white/10">
                  Sell Cards
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Box Overlay */}
        <div
          className="absolute top-[80%] right-80 transform -translate-y-1/2 w-[340px] h-[250px] rounded-[35px] overflow-hidden hidden xl:block"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex flex-col justify-center h-full px-8">
            <h3 className="text-6xl font-bold text-white tracking-wide" style={{ fontFamily: 'Europa Grotesk SH' }}>200k+</h3>
            <p className="text-lg text-gray-200 font-medium tracking-wide mt-2 mb-4">SATISFIED BUYERS ON</p>
            <div className="flex items-center -space-x-4">
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-[#FFFFFF20] relative z-10">
                <img src="/RNG-logo.png" alt="RNG" className="w-full h-full object-cover" />
              </div>
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-[#FFFFFF20] relative z-20">
                <img src="/images/ebay-logo.png" alt="eBay" className="w-12 h-auto" />
              </div>
              <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-[#FFFFFF20] relative z-30">
                <img src="/images/tcgplayer-logo-v2.jpg" alt="TCGPlayer" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuickBrowseSection />

      <ProductSliderSection title="WHAT'S HOT" cards={CARDS} />

      <Ticker />
      {/* <CategoryGrid /> */}
      <SellYourCardsSection />
      <ReviewsSection />
      <SocialMediaSection />
      <StoreLocationSection />
    </main>
  );
}
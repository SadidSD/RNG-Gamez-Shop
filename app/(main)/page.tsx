"use client";

import Image from "next/image";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
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
        <div className="absolute inset-0 flex flex-col justify-center">

          <div className="pl-20 mt-4">
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
          className="absolute top-[80%] right-20 transform -translate-y-1/2 w-[250px] h-[200px] rounded-[30px] overflow-hidden hidden xl:block"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex flex-col justify-center h-full px-6">
            <h3 className="text-4xl font-bold text-white tracking-wide" style={{ fontFamily: 'Europa Grotesk SH' }}>200k+</h3>
            <p className="text-sm text-gray-200 font-medium tracking-wide mt-1 mb-3">SATISFIED BUYERS ON</p>
            <div className="flex items-center -space-x-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-[#FFFFFF20] relative z-10">
                <img src="/RNG-logo.png" alt="RNG" className="w-full h-full object-cover" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-[#FFFFFF20] relative z-20">
                <img src="/images/ebay-logo.png" alt="eBay" className="w-8 h-auto" />
              </div>
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-[#FFFFFF20] relative z-30">
                <img src="/images/tcgplayer-logo-v2.jpg" alt="TCGPlayer" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ProductSliderSection title="WHAT'S HOT" cards={CARDS} />
      <ProductSliderSection title="POKEMON" cards={CARDS} />
      <ProductSliderSection title="MAGIC THE GATHERING" cards={CARDS} />

      <Ticker />
      <CategoryGrid />
      <SellYourCardsSection />
      <ReviewsSection />
      <SocialMediaSection />
      <StoreLocationSection />
    </main>
  );
}
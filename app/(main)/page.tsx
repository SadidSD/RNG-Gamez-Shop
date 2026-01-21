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
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
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
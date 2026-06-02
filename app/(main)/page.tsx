"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import QuickBrowseSection from '@/components/ui/QuickBrowseSection';
import ProductSliderSection from "@/components/ui/ProductSliderSection";
import Ticker from "@/components/ui/Ticker";
import SellYourCardsSection from "@/components/ui/SellYourCardsSection";
import SocialMediaSection from "@/components/ui/SocialMediaSection";
import StoreLocationSection from "@/components/ui/StoreLocationSection";




export default function Home() {
  const [hotCards, setHotCards] = useState<any[]>([]);
  const [sealedProducts, setSealedProducts] = useState<any[]>([]);

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiUrl) return;

    const headers = { 'x-api-key': apiKey || '' };

    // Fetch most-sold cards (What's Hot)
    async function fetchBestsellers() {
      try {
        const res = await fetch(`${apiUrl}/public/products/bestsellers?take=12`, {
          headers,
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          const mapped = (data.data || []).map((p: any) => ({
            id: p.id,
            title: p.name,
            price: `$${Number(p.price ?? 0).toFixed(2)}`,
            imageSrc: p.images?.[0] || "/placeholder.svg"
          }));
          setHotCards(mapped);
        }
      } catch (err) {
        console.error("Error fetching bestsellers:", err);
      }
    }

    // Fetch sealed products for the second slider
    async function fetchSealed() {
      try {
        const categories = ['booster-boxes', 'booster-packs', 'bundles', 'precon-decks', 'collectors-editions'].join(',');
        const res = await fetch(`${apiUrl}/public/products?category=${categories}&take=12`, {
          headers,
          cache: 'no-store'
        });
        if (res.ok) {
          const data = await res.json();
          const shuffled = (data.data || []).sort(() => 0.5 - Math.random());
          const mapped = shuffled.map((p: any) => ({
            id: p.id,
            title: p.name,
            price: `$${Number(p.price).toFixed(2)}`,
            imageSrc: p.images?.[0] || "/placeholder.svg"
          }));
          setSealedProducts(mapped);
        }
      } catch (error) {
        console.error("Error fetching sealed products:", error);
      }
    }

    fetchBestsellers();
    fetchSealed();
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden">
      <div className="relative h-screen w-full bg-black">
        <Image
          src="/hero-bg-final.jpg"
          alt="Cover"
          fill
          priority
          quality={100}
          style={{ objectFit: "cover" }}
        />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
        {/* Add your page content here, over the cover image */}
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="px-6 md:px-16 lg:pl-40 mt-4">
            <div className="max-w-2xl">
              <h1 className="font-bold text-4xl sm:text-5xl lg:text-[60px] text-[#F1F1F1] tracking-tight leading-[1.1em] mb-4 md:mb-6" style={{ fontFamily: 'Europa Grotesk SH' }}>
                Find the exact card you're looking for.
              </h1>
              <p className="text-base md:text-xl text-gray-200 mb-6 md:mb-8 leading-relaxed max-w-lg">
                Browse thousands of Magic: The Gathering cards by set, condition, language, and format — updated with real market pricing.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/shop">
                  <Button className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 bg-[#B266FF] hover:bg-[#9944FF] text-white w-full sm:w-auto">
                    Browse Cards
                  </Button>
                </Link>
                <Link href="/buylist">
                  <Button variant="outline" className="text-base md:text-lg px-6 md:px-8 py-3 md:py-4 border-white text-white hover:bg-white/10 w-full sm:w-auto">
                    Sell Cards
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Gradient Box Overlay */}
        <div
          className="absolute bottom-8 right-16 md:right-24 xl:right-96 xl:top-[80%] xl:bottom-auto xl:-translate-y-1/2 w-[240px] sm:w-[280px] xl:w-[340px] h-[180px] sm:h-[210px] xl:h-[250px] rounded-[25px] xl:rounded-[35px] overflow-hidden hidden sm:block"
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
                <img src="/images/tcgplayer-logo-v2.jpg" alt="TCGPlayer" className="w-full h-auto object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <QuickBrowseSection />

      {hotCards.length > 0 && (
        <ProductSliderSection
          title="WHAT'S HOT"
          cards={hotCards}
          linkUrl="/shop?sort=bestselling"
          linkText="See All"
        />
      )}

      {sealedProducts.length > 0 && (
        <ProductSliderSection 
          title="SEALED PRODUCTS" 
          cards={sealedProducts} 
          linkUrl="/sealed"
          linkText="Browse Sealed"
        />
      )}

      <Ticker />
      {/* <CategoryGrid /> */}
      <SellYourCardsSection />
      <SocialMediaSection />
      <StoreLocationSection />
    </main>
  );
}
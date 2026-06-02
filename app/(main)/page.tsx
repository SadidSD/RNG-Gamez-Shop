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
          className="absolute bottom-8 right-6 md:right-12 xl:right-80 xl:top-[80%] xl:bottom-auto xl:-translate-y-1/2 w-[240px] sm:w-[280px] xl:w-[320px] rounded-[25px] xl:rounded-[30px] overflow-hidden hidden sm:block"
          style={{
            background: 'rgba(15, 10, 30, 0.55)',
            backdropFilter: 'blur(24px) saturate(160%)',
            WebkitBackdropFilter: 'blur(24px) saturate(160%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 12px 40px 0 rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255,255,255,0.12)'
          }}
        >
          <div className="flex flex-col px-6 py-5 gap-3">
            {/* Stat */}
            <div>
              <span className="text-5xl font-extrabold text-white leading-none" style={{ fontFamily: 'Europa Grotesk SH, sans-serif', letterSpacing: '-1px' }}>200k+</span>
              <p className="text-xs font-semibold text-gray-300 tracking-[0.15em] mt-1 uppercase">Satisfied Buyers</p>
            </div>

            {/* Star rating */}
            <div className="flex items-center gap-1.5">
              {[1,2,3,4,5].map(i => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#FBBF24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
              <span className="text-xs text-gray-300 ml-1 font-medium">4.9 / 5.0</span>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)' }} />

            {/* Marketplace logos */}
            <div className="flex flex-col gap-2">
              <p className="text-[10px] font-semibold text-gray-400 tracking-[0.12em] uppercase">Shop us on</p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="w-5 h-5 rounded-full overflow-hidden bg-white flex-shrink-0">
                    <img src="/RNG-logo.png" alt="RNG" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-semibold text-white whitespace-nowrap">RNG Gamez</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg px-3 py-1.5" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="w-5 h-5 rounded overflow-hidden bg-white flex-shrink-0 flex items-center justify-center">
                    <img src="/images/tcgplayer-logo.png" alt="TCGPlayer" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-semibold text-white whitespace-nowrap">TCGPlayer</span>
                </div>
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
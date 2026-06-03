import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Gamepad2, Swords, DollarSign, Layers, Star,
    Flame, Sparkles, Gem, Box, Shield,
    Scroll, Zap, Skull, Crown, Ghost,
    ArrowRight, Coins, Trophy, ShoppingBag
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// --- Data Structure ---
type QuickBrowseItem = {
    id: string;
    label: string;
    icon: React.ElementType;
    href: string;
    description?: string;
    imageSrc?: string;
};

type QuickBrowseSectionData = {
    id: string;
    label: string;
    icon: React.ElementType;
    items: QuickBrowseItem[];
};

const QUICK_BROWSE_DATA: QuickBrowseSectionData[] = [
    {
        id: 'formats',
        label: 'Play Formats',
        icon: Gamepad2,
        items: [
            { id: 'commander', label: 'Commander', icon: Crown, href: '/singles?category=magic-the-gathering&format=commander', description: 'Multiplayer fun', imageSrc: '/images/commander-format.png' },
            { id: 'modern', label: 'Modern', icon: Zap, href: '/singles?category=magic-the-gathering&format=modern', description: 'Fast & competitive', imageSrc: '/images/modern-format-v2.jpg' },
            { id: 'pioneer', label: 'Pioneer', icon: Swords, href: '/singles?category=magic-the-gathering&format=pioneer', description: 'Recent sets', imageSrc: '/images/pioneer-format-v2.jpg' },
            { id: 'standard', label: 'Standard', icon: Layers, href: '/singles?category=magic-the-gathering&format=standard', description: 'Applying rotation', imageSrc: '/images/standard-format-v2.jpg' },
            { id: 'legacy', label: 'Legacy', icon: Scroll, href: '/singles?category=magic-the-gathering&format=legacy', description: 'Deep history', imageSrc: '/images/legacy-format-v2.jpg' },
            { id: 'vintage', label: 'Vintage', icon: Gem, href: '/singles?category=magic-the-gathering&format=vintage', description: 'Power nine era', imageSrc: '/images/vintage-format-v2.jpg' },
        ]
    },
    {
        id: 'roles',
        label: 'Card Roles',
        icon: Swords,
        items: [
            { id: 'lands', label: 'Lands', icon: Layers, href: '/singles?category=magic-the-gathering&type=Land', description: 'Mana base', imageSrc: '/images/lands-role-v1.jpg' },
            { id: 'mana-rocks', label: 'Mana Rocks', icon: Gem, href: '/singles?category=magic-the-gathering&type=Artifact', description: 'Ramp up', imageSrc: '/images/mana-rocks-role-v1.png' },
            { id: 'removal', label: 'Removal', icon: Skull, href: '/singles?category=magic-the-gathering&oracle=destroy', description: 'Destroy & exile', imageSrc: '/images/removal-role-v1.png' },
            { id: 'card-draw', label: 'Card Draw', icon: Scroll, href: '/singles?category=magic-the-gathering&oracle=draw', description: 'Refill hand', imageSrc: '/images/card-draw-role-v1.jpg' },
            { id: 'finishers', label: 'Finishers', icon: Flame, href: '/singles?category=magic-the-gathering&oracle=win', description: 'Win the game', imageSrc: '/images/finishers-role-v1.png' },
        ]
    },
    {
        id: 'price',
        label: 'Price & Deals',
        icon: DollarSign,
        items: [
            { id: 'under-1', label: 'Under $1', icon: Coins, href: '/shop?priceMax=1', description: 'Budget friendly', imageSrc: '/images/under-1-price-v1.jpg' },
            { id: 'budget', label: 'Budget Picks', icon: Shield, href: '/shop?priceMax=5', description: 'High value/cost', imageSrc: '/images/budget-price-v2.png' },
            { id: 'high-end', label: 'High-End', icon: Gem, href: '/shop?priceMin=50', description: 'Premium cards', imageSrc: '/images/high-end-price-v1.png' },
            { id: 'on-sale', label: 'On Sale', icon: ShoppingBag, href: '/shop?sale=true', description: 'Discounted items', imageSrc: '/images/on-sale-price-v4.png' },
        ]
    },
    {
        id: 'collections',
        label: 'Collections',
        icon: Box,
        items: [
            { id: 'latest', label: 'Latest Sets', icon: Sparkles, href: '/shop?sort=created_desc', description: 'New arrivals', imageSrc: '/images/latest-sets-collection-v2.png' },
            { id: 'old-border', label: 'Old Border', icon: Scroll, href: '/shop?category=magic-the-gathering&type=Old', description: 'Classic look', imageSrc: '/images/old-border-collection-v1.png' },
            { id: 'promos', label: 'Promos', icon: Star, href: '/shop?rarity=Promo', description: 'Special prints', imageSrc: '/images/promos-collection-v1.png' },
            { id: 'secret-lair', label: 'Secret Lair', icon: Ghost, href: '/shop?set=Secret Lair', description: 'Exclusive drops', imageSrc: '/images/secret-lair-collection-v1.jpg' },
        ]
    },
    {
        id: 'store-picks',
        label: 'Store Picks',
        icon: Star,
        items: [
            { id: 'best-sellers', label: 'Best Sellers', icon: Trophy, href: '/shop?sort=bestselling', description: 'Community favorites', imageSrc: '/images/best-sellers-store-pick-v1.png' },
            { id: 'staff-picks', label: 'Staff Picks', icon: Crown, href: '/shop?category=magic-the-gathering&tag=staff-pick', description: 'Curated by us', imageSrc: '/images/staff-picks-store-pick-v1.png' },
            { id: 'trending', label: 'Trending', icon: Flame, href: '/shop?sort=trending', description: 'Hot right now', imageSrc: '/images/trending-store-pick-v1.png' },
            { id: 'recently-added', label: 'Recently Added', icon: Box, href: '/shop?sort=created_desc', description: 'Fresh stock', imageSrc: '/images/recently-added-store-pick-v1.png' },
        ]
    }
];

export default function QuickBrowseSection() {
    const [activeTab, setActiveTab] = useState('formats');

    return (
        <section className="bg-[#F1F1F1] min-h-screen flex flex-col justify-center py-16 border-b border-black/5">
            <div className="container mx-auto px-4 md:px-8">

                <div className="mb-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-black mb-3" style={{ fontFamily: 'Europa Grotesk SH' }}>
                        Quick Browse
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Find cards by format, role, or value
                    </p>
                </div>

                <div className="flex flex-col gap-12">
                    <div className="w-full flex justify-center overflow-x-auto pb-4 md:pb-0 scrollbar-hide">
                        <div className="flex gap-2 bg-white/50 backdrop-blur-sm p-1.5 rounded-2xl border border-black/5">
                            {QUICK_BROWSE_DATA.map((section) => {
                                const Icon = section.icon;
                                const isActive = activeTab === section.id;

                                return (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveTab(section.id)}
                                        className={`
                                            flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap
                                            ${isActive
                                                ? 'bg-black text-white font-bold shadow-lg shadow-black/10'
                                                : 'text-gray-600 hover:bg-black/5 hover:text-black'
                                            }
                                        `}
                                    >
                                        <Icon size={18} className={isActive ? "text-[#B266FF]" : "text-current"} />
                                        <span className="text-base">{section.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="w-full min-h-[400px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.2 }}
                                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                            >
                                {QUICK_BROWSE_DATA.find(s => s.id === activeTab)?.items.map((item) => {
                                    const ItemIcon = item.icon;

                                    return (
                                        <Link
                                            key={item.id}
                                            href={item.href}
                                            className="group relative flex flex-col overflow-hidden bg-white border border-black/5 rounded-2xl hover:border-black/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full"
                                        >
                                            <div className="relative h-36 sm:h-48 w-full overflow-hidden bg-gray-100">
                                                {item.imageSrc ? (
                                                    <Image
                                                        src={item.imageSrc}
                                                        alt={item.label}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                                        <ItemIcon size={48} className="text-gray-400 group-hover:text-[#B266FF] transition-colors" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                                                <div className="absolute top-4 right-4">
                                                    <div className="p-2 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 group-hover:bg-[#B266FF] group-hover:border-[#B266FF] transition-colors">
                                                        <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                                                        <div className="p-2 rounded-lg bg-black/5 text-black group-hover:text-[#B266FF] transition-colors w-fit">
                                                            <ItemIcon size={18} />
                                                        </div>
                                                        <h3 className="text-base sm:text-lg font-bold text-black group-hover:text-[#B266FF] transition-colors break-words">
                                                            {item.label}
                                                        </h3>
                                                    </div>
                                                </div>

                                                {item.description && (
                                                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </Link>
                                    );
                                })}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}

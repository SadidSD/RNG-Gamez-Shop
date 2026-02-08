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
// Mimics backend model: id, label, icon, section, queryRules
// We map 'section' to the Tab ID.

type QuickBrowseItem = {
    id: string;
    label: string;
    icon: React.ElementType;
    href: string; // Pre-built URL with query params
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
        icon: Gamepad2, // Represents gameplay
        items: [
            { id: 'commander', label: 'Commander', icon: Crown, href: '/products?category=Magic-The-Gathering&format=commander', description: 'Multiplayer fun', imageSrc: '/images/commander-format.png' },
            { id: 'modern', label: 'Modern', icon: Zap, href: '/products?category=Magic-The-Gathering&format=modern', description: 'Fast & competitive', imageSrc: '/images/modern-format-v2.jpg' },
            { id: 'pioneer', label: 'Pioneer', icon: Swords, href: '/products?category=Magic-The-Gathering&format=pioneer', description: 'Recent sets', imageSrc: '/images/pioneer-format-v2.jpg' },
            { id: 'standard', label: 'Standard', icon: Layers, href: '/products?category=Magic-The-Gathering&format=standard', description: 'Applying rotation', imageSrc: '/images/standard-format-v2.jpg' },
            { id: 'legacy', label: 'Legacy', icon: Scroll, href: '/products?category=Magic-The-Gathering&format=legacy', description: 'Deep history', imageSrc: '/images/legacy-format-v2.jpg' },
            { id: 'vintage', label: 'Vintage', icon: Gem, href: '/products?category=Magic-The-Gathering&format=vintage', description: 'Power nine era', imageSrc: '/images/vintage-format-v2.jpg' },
        ]
    },
    {
        id: 'roles',
        label: 'Card Roles',
        icon: Swords, // Represents function/utility
        items: [
            { id: 'lands', label: 'Lands', icon: Layers, href: '/products?category=Magic-The-Gathering&type=Land', description: 'Mana base', imageSrc: '/images/lands-role-v1.jpg' },
            { id: 'mana-rocks', label: 'Mana Rocks', icon: Gem, href: '/products?category=Magic-The-Gathering&type=Artifact&uptype=Mana', description: 'Ramp up', imageSrc: '/images/mana-rocks-role-v1.png' },
            { id: 'removal', label: 'Removal', icon: Skull, href: '/products?category=Magic-The-Gathering&function=removal', description: 'Destroy & exile', imageSrc: '/images/removal-role-v1.png' },
            { id: 'card-draw', label: 'Card Draw', icon: Scroll, href: '/products?category=Magic-The-Gathering&function=draw', description: 'Refill hand', imageSrc: '/cover.jpg' },
            { id: 'finishers', label: 'Finishers', icon: Flame, href: '/products?category=Magic-The-Gathering&function=finisher', description: 'Win the game', imageSrc: '/cover.jpg' },
        ]
    },
    {
        id: 'price',
        label: 'Price & Deals',
        icon: DollarSign,
        items: [
            { id: 'under-1', label: 'Under $1', icon: Coins, href: '/products?category=Magic-The-Gathering&price_max=1', description: 'Budget friendly', imageSrc: '/cover.jpg' },
            { id: 'budget', label: 'Budget Picks', icon: Shield, href: '/products?category=Magic-The-Gathering&tag=budget', description: 'High value/cost', imageSrc: '/cover.jpg' },
            { id: 'high-end', label: 'High-End', icon: Gem, href: '/products?category=Magic-The-Gathering&price_min=50', description: 'Premium cards', imageSrc: '/cover.jpg' },
            { id: 'on-sale', label: 'On Sale', icon: ShoppingBag, href: '/products?category=Magic-The-Gathering&sale=true', description: 'Discounted items', imageSrc: '/cover.jpg' },
        ]
    },
    {
        id: 'collections',
        label: 'Collections',
        icon: Box,
        items: [
            { id: 'latest', label: 'Latest Sets', icon: Sparkles, href: '/products?category=Magic-The-Gathering&sort=newest', description: 'New arrivals', imageSrc: '/cover.jpg' },
            { id: 'old-border', label: 'Old Border', icon: Scroll, href: '/products?category=Magic-The-Gathering&frame=old', description: 'Classic look', imageSrc: '/cover.jpg' },
            { id: 'promos', label: 'Promos', icon: Star, href: '/products?category=Magic-The-Gathering&rarity=promo', description: 'Special prints', imageSrc: '/cover.jpg' },
            { id: 'secret-lair', label: 'Secret Lair', icon: Ghost, href: '/products?category=Magic-The-Gathering&set=secret-lair', description: 'Exclusive drops', imageSrc: '/cover.jpg' },
        ]
    },
    {
        id: 'store-picks',
        label: 'Store Picks',
        icon: Star,
        items: [
            { id: 'best-sellers', label: 'Best Sellers', icon: Trophy, href: '/products?category=Magic-The-Gathering&sort=bestselling', description: 'Community favorites', imageSrc: '/cover.jpg' },
            { id: 'staff-picks', label: 'Staff Picks', icon: Crown, href: '/products?category=Magic-The-Gathering&tag=staff-pick', description: 'Curated by us', imageSrc: '/cover.jpg' },
            { id: 'trending', label: 'Trending', icon: Flame, href: '/products?category=Magic-The-Gathering&sort=trending', description: 'Hot right now', imageSrc: '/cover.jpg' },
            { id: 'recently-added', label: 'Recently Added', icon: Box, href: '/products?category=Magic-The-Gathering&sort=date_added', description: 'Fresh stock', imageSrc: '/cover.jpg' },
        ]
    }
];

export default function QuickBrowseSection() {
    const [activeTab, setActiveTab] = useState('formats');

    return (
        <section className="bg-[#F1F1F1] min-h-screen flex flex-col justify-center py-16 border-b border-black/5">
            <div className="container mx-auto px-4 md:px-8">

                {/* Header */}
                <div className="mb-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-black mb-3" style={{ fontFamily: 'Europa Grotesk SH' }}>
                        Quick Browse
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Find cards by format, role, or value
                    </p>
                </div>

                {/* Tabs System */}
                <div className="flex flex-col gap-12">

                    {/* Horizontal Tabs List */}
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

                    {/* Content Area */}
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
                                            {/* Image Area */}
                                            <div className="relative h-48 w-full overflow-hidden bg-gray-100">
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

                                            {/* Content Area */}
                                            <div className="p-6 flex-1 flex flex-col">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="p-2 rounded-lg bg-black/5 text-black group-hover:text-[#B266FF] transition-colors">
                                                        <ItemIcon size={18} />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-black group-hover:text-[#B266FF] transition-colors">
                                                        {item.label}
                                                    </h3>
                                                </div>

                                                {item.description && (
                                                    <p className="text-sm text-gray-500 mt-auto">
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

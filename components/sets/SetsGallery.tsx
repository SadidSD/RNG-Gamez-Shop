'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Calendar, Grid3x3, ChevronDown, Layers, Sparkles } from 'lucide-react';

interface MTGSet {
    id: string;
    code: string;
    name: string;
    set_type: string;
    released_at: string;
    card_count: number;
    icon_svg_uri: string;
    digital: boolean;
}

const SET_TYPE_CONFIG: Record<string, { label: string; bg: string; border: string; badge: string; iconBg: string }> = {
    expansion:       { label: 'Expansion',       bg: 'bg-violet-50',  border: 'border-violet-100', badge: 'bg-violet-100 text-violet-700',  iconBg: 'bg-violet-100' },
    core:            { label: 'Core Set',        bg: 'bg-blue-50',    border: 'border-blue-100',   badge: 'bg-blue-100 text-blue-700',      iconBg: 'bg-blue-100' },
    masters:         { label: 'Masters',         bg: 'bg-amber-50',   border: 'border-amber-100',  badge: 'bg-amber-100 text-amber-700',    iconBg: 'bg-amber-100' },
    commander:       { label: 'Commander',       bg: 'bg-emerald-50', border: 'border-emerald-100', badge: 'bg-emerald-100 text-emerald-700', iconBg: 'bg-emerald-100' },
    draft_innovation:{ label: 'Draft Innovation', bg: 'bg-rose-50',   border: 'border-rose-100',   badge: 'bg-rose-100 text-rose-700',      iconBg: 'bg-rose-100' },
    funny:           { label: 'Un-Set',          bg: 'bg-orange-50',  border: 'border-orange-100', badge: 'bg-orange-100 text-orange-700',  iconBg: 'bg-orange-100' },
    starter:         { label: 'Starter',         bg: 'bg-teal-50',    border: 'border-teal-100',   badge: 'bg-teal-100 text-teal-700',      iconBg: 'bg-teal-100' },
    promo:           { label: 'Promo',           bg: 'bg-fuchsia-50', border: 'border-fuchsia-100', badge: 'bg-fuchsia-100 text-fuchsia-700', iconBg: 'bg-fuchsia-100' },
    planechase:      { label: 'Planechase',      bg: 'bg-indigo-50',  border: 'border-indigo-100', badge: 'bg-indigo-100 text-indigo-700',  iconBg: 'bg-indigo-100' },
    archenemy:       { label: 'Archenemy',       bg: 'bg-red-50',     border: 'border-red-100',    badge: 'bg-red-100 text-red-700',        iconBg: 'bg-red-100' },
};

const DEFAULT_CONFIG = { label: 'Other', bg: 'bg-gray-50', border: 'border-gray-100', badge: 'bg-gray-100 text-gray-600', iconBg: 'bg-gray-100' };

const FILTER_TYPES = ['all', 'expansion', 'core', 'masters', 'commander', 'draft_innovation', 'funny', 'promo'] as const;

const ITEMS_PER_PAGE = 24;

export default function SetsGallery() {
    const [sets, setSets] = useState<MTGSet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [storeCounts, setStoreCounts] = useState<Record<string, number>>({});

    useEffect(() => {
        fetchSets();
        fetchStoreCounts();
    }, []);

    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
    }, [searchQuery, filterType]);

    const fetchSets = async () => {
        try {
            const response = await fetch('https://api.scryfall.com/sets');
            const data = await response.json();

            const validSets = data.data
                .filter((set: MTGSet) =>
                    set.set_type !== 'token' &&
                    set.set_type !== 'memorabilia' &&
                    !set.digital
                )
                .sort((a: MTGSet, b: MTGSet) =>
                    new Date(b.released_at).getTime() - new Date(a.released_at).getTime()
                );

            setSets(validSets);
        } catch (error) {
            console.error('Error fetching sets:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStoreCounts = async () => {
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const apiKey = process.env.NEXT_PUBLIC_API_KEY;
            if (!apiUrl) return;

            const res = await fetch(`${apiUrl}/public/products/sets/counts`, {
                headers: { 'x-api-key': apiKey || '' },
                cache: 'no-store',
            });

            if (res.ok) {
                const data = await res.json();
                setStoreCounts(data);
            }
        } catch (error) {
            console.error('Error fetching store counts:', error);
        }
    };

    const filteredSets = useMemo(() => {
        let filtered = sets;

        if (filterType !== 'all') {
            filtered = filtered.filter(set => set.set_type === filterType);
        }

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter(set =>
                set.name.toLowerCase().includes(q) ||
                set.code.toLowerCase().includes(q)
            );
        }

        return filtered;
    }, [sets, searchQuery, filterType]);

    const visibleSets = filteredSets.slice(0, visibleCount);
    const hasMore = visibleCount < filteredSets.length;

    const getConfig = (type: string) => SET_TYPE_CONFIG[type] || DEFAULT_CONFIG;

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            <div className="p-6 flex flex-col items-center gap-4">
                                <div className="w-16 h-16 rounded-xl bg-gray-100 animate-pulse" />
                                <div className="w-3/4 h-5 rounded-full bg-gray-100 animate-pulse" />
                                <div className="w-1/2 h-4 rounded-full bg-gray-100 animate-pulse" />
                                <div className="w-2/3 h-3 rounded-full bg-gray-100 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6">
            {/* Search & Filters */}
            <div className="mb-6">
                {/* Search Bar */}
                <div className="relative mb-3">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search sets by name or code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-full bg-white border border-gray-200 text-gray-900
                                   placeholder:text-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100
                                   transition-all text-sm shadow-sm"
                    />
                </div>

                {/* Type Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                    {FILTER_TYPES.map((type) => {
                        const config = getConfig(type);
                        const isActive = filterType === type;
                        return (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border
                                    ${isActive
                                        ? 'bg-purple-500 text-white border-purple-500 shadow-md shadow-purple-200'
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600'
                                    }`}
                            >
                                {type === 'all' ? 'All Sets' : config.label}
                            </button>
                        );
                    })}

                    {/* Result Count */}
                    <span className="ml-auto shrink-0 text-xs text-gray-400 tabular-nums font-medium">
                        {filteredSets.length} sets
                    </span>
                </div>
            </div>

            {/* Sets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pt-6">
                {visibleSets.map((set) => {
                    const config = getConfig(set.set_type);
                    return (
                        <Link
                            key={set.id}
                            href={`/shop?set=${encodeURIComponent(set.name)}`}
                            className="group"
                        >
                            <div className={`
                                relative overflow-hidden rounded-2xl bg-white
                                border border-gray-100
                                shadow-sm
                                p-6
                                transition-all duration-300 ease-out
                                hover:shadow-lg hover:shadow-purple-100/50
                                hover:border-purple-200
                                hover:-translate-y-1
                            `}>
                                {/* Content */}
                                <div className="flex flex-col items-center text-center gap-3">
                                    {/* Set Icon */}
                                    <div className={`w-16 h-16 rounded-xl ${config.iconBg} flex items-center justify-center
                                                    group-hover:scale-110 transition-transform duration-300`}>
                                        <img
                                            src={set.icon_svg_uri}
                                            alt={`${set.name} icon`}
                                            className="w-9 h-9 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>

                                    {/* Set Name */}
                                    <div>
                                        <h3 className="text-sm font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2 leading-snug mb-1">
                                            {set.name}
                                        </h3>
                                        <span className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                                            {set.code}
                                        </span>
                                    </div>

                                    {/* Meta Row */}
                                    <div className="flex items-center gap-3 text-[11px] text-gray-400">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={11} />
                                            {formatDate(set.released_at)}
                                        </span>
                                        <span className="w-px h-3 bg-gray-200" />
                                        <span className="flex items-center gap-1">
                                            <Grid3x3 size={11} />
                                            {storeCounts[set.name] ?? 0} in stock
                                        </span>
                                    </div>

                                    {/* Type Badge */}
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${config.badge}`}>
                                        {config.label}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Load More */}
            {hasMore && (
                <div className="flex justify-center mt-12">
                    <button
                        onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                        className="group flex items-center gap-2 px-8 py-3 rounded-full
                                   bg-white border border-gray-200 shadow-sm
                                   text-sm font-semibold text-gray-600
                                   hover:border-purple-400 hover:text-purple-600 hover:shadow-md hover:shadow-purple-100/50
                                   transition-all duration-300"
                    >
                        <span>Load More Sets</span>
                        <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                    </button>
                </div>
            )}

            {/* Empty State */}
            {filteredSets.length === 0 && (
                <div className="text-center py-24">
                    <Sparkles size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 text-lg font-semibold">No sets found</p>
                    <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
}

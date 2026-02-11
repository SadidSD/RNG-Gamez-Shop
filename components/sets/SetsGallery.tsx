'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Calendar, Grid3x3 } from 'lucide-react';
import { Input } from '@/components/ui/Input';

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

export default function SetsGallery() {
    const [sets, setSets] = useState<MTGSet[]>([]);
    const [filteredSets, setFilteredSets] = useState<MTGSet[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetchSets();
    }, []);

    useEffect(() => {
        filterSets();
    }, [sets, searchQuery, filterType]);

    const fetchSets = async () => {
        try {
            const response = await fetch('https://api.scryfall.com/sets');
            const data = await response.json();

            // Filter out token sets and digital-only sets, sort by release date
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
            setFilteredSets(validSets);
        } catch (error) {
            console.error('Error fetching sets:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterSets = () => {
        let filtered = sets;

        // Filter by type
        if (filterType !== 'all') {
            filtered = filtered.filter(set => set.set_type === filterType);
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(set =>
                set.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                set.code.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredSets(filtered);
    };

    const getSetTypeColor = (type: string) => {
        const colors: { [key: string]: string } = {
            'core': 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
            'expansion': 'from-purple-500/20 to-purple-600/20 border-purple-500/30',
            'masters': 'from-yellow-500/20 to-yellow-600/20 border-yellow-500/30',
            'commander': 'from-green-500/20 to-green-600/20 border-green-500/30',
            'draft_innovation': 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
            'funny': 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
        };
        return colors[type] || 'from-gray-500/20 to-gray-600/20 border-gray-500/30';
    };

    const formatSetType = (type: string) => {
        return type.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className="h-80 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6">
            {/* Filters */}
            <div className="mb-8 space-y-4">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                        type="text"
                        placeholder="Search sets by name or code..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-12"
                    />
                </div>

                {/* Type Filters */}
                <div className="flex flex-wrap gap-2">
                    {['all', 'expansion', 'core', 'masters', 'commander', 'draft_innovation'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilterType(type)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${filterType === type
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {type === 'all' ? 'All Sets' : formatSetType(type)}
                        </button>
                    ))}
                </div>

                {/* Results Count */}
                <p className="text-gray-400 text-sm">
                    Showing {filteredSets.length} of {sets.length} sets
                </p>
            </div>

            {/* Sets Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSets.map((set) => (
                    <Link
                        key={set.id}
                        href={`/shop?set=${set.code}`}
                        className="group"
                    >
                        <div className={`
                            h-80 rounded-2xl border backdrop-blur-sm
                            bg-gradient-to-br ${getSetTypeColor(set.set_type)}
                            p-6 flex flex-col items-center justify-center
                            transition-all duration-300
                            hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20
                        `}>
                            {/* Set Icon */}
                            <div className="w-24 h-24 mb-6 relative">
                                <img
                                    src={set.icon_svg_uri}
                                    alt={`${set.name} icon`}
                                    className="w-full h-full object-contain filter drop-shadow-lg"
                                />
                            </div>

                            {/* Set Info */}
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                                    {set.name}
                                </h3>
                                <p className="text-gray-400 text-sm font-mono uppercase">
                                    {set.code}
                                </p>
                                <div className="flex items-center gap-4 justify-center text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar size={14} />
                                        {formatDate(set.released_at)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Grid3x3 size={14} />
                                        {set.card_count} cards
                                    </span>
                                </div>
                                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-gray-300">
                                    {formatSetType(set.set_type)}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {filteredSets.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-lg">No sets found matching your criteria</p>
                </div>
            )}
        </div>
    );
}

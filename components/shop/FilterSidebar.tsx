'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { X } from 'lucide-react';

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

export function FilterSidebar({ isOpen, onClose, className }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Helper to update URL
    const updateFilter = (key: string, value: string | boolean | null) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value !== '' && value !== false && value !== null && value !== undefined) {
            params.set(key, String(value));
        } else {
            params.delete(key);
        }

        // --- NAVIGATION LOGIC ---
        let targetPath = pathname;

        // --- EXCLUSION & PAGE JUMPING ---
        // 1. If we are setting a specific category, clear 'singles' flag
        if (key === 'category' && value) {
            params.delete('singles');

            // If we are on the /singles page but filtering for a category (especially sealed), 
            // we MUST jump to /shop or else the /singles page's hardcoded filter will hide everything.
            if (targetPath === '/singles') {
                targetPath = '/shop';
            }
        }
        
        // 2. If we are setting 'singles' flag, clear specific category
        if (key === 'singles' && value === 'true') {
            params.delete('category');
        }

        // Reset page on filter change
        params.delete('page');

        router.push(`${targetPath}?${params.toString()}`);
    };

    // -- State for Inputs (Debounced/OnBlur) --
    const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '');
    const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '');
    const [cmcMin, setCmcMin] = useState(searchParams.get('cmcMin') || '');
    const [cmcMax, setCmcMax] = useState(searchParams.get('cmcMax') || '');

    // Sync local input state if URL changes externally (e.g. Reset)
    useEffect(() => {
        setPriceMin(searchParams.get('priceMin') || '');
        setPriceMax(searchParams.get('priceMax') || '');
        setCmcMin(searchParams.get('cmcMin') || '');
        setCmcMax(searchParams.get('cmcMax') || '');
    }, [searchParams]);

    // -- Immediate Handlers --
    const selectedColors = searchParams.get('colors')?.split(',') || [];
    const cardType = searchParams.get('type') || '';
    const format = searchParams.get('format') || '';
    const foil = searchParams.get('foil') === 'true';
    const inStock = searchParams.get('inStock') === 'true';

    const toggleColor = (color: string) => {
        const current = selectedColors;
        const next = current.includes(color)
            ? current.filter(c => c !== color)
            : [...current, color];

        updateFilter('colors', next.length > 0 ? next.join(',') : null);
    };

    const clearFilters = () => {
        router.push(pathname);
        if (window.innerWidth < 1024) onClose();
    };

    const ColorToggle = ({ color, label, bg }: { color: string, label: string, bg: string }) => (
        <button
            onClick={() => toggleColor(color)}
            className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
                ${selectedColors.includes(color)
                    ? 'border-blue-500 scale-110 shadow-md'
                    : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'
                }
            `}
            style={{ backgroundColor: bg }}
            title={label}
        >
            {selectedColors.includes(color) && <div className="w-2 h-2 bg-white rounded-full" />}
        </button>
    );

    return (
        <div className={`bg-white p-6 rounded-lg border border-gray-100 shadow-sm h-fit ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold font-heading">Filters</h3>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={clearFilters} className="px-3 py-1 h-8 text-xs">
                        Reset
                    </Button>
                    <button onClick={onClose} className="lg:hidden p-1 hover:bg-gray-100 rounded">
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="space-y-8">
                {/* Layer 1: Identity */}
                <div>
                    <Label className="mb-3 block text-sm font-semibold text-muted-foreground uppercase tracking-wider">Identity</Label>

                    {/* Colors */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        <ColorToggle color="W" label="White" bg="#F9FAFB" />
                        <ColorToggle color="U" label="Blue" bg="#3B82F6" />
                        <ColorToggle color="B" label="Black" bg="#1F2937" />
                        <ColorToggle color="R" label="Red" bg="#EF4444" />
                        <ColorToggle color="G" label="Green" bg="#10B981" />
                        <ColorToggle color="C" label="Colorless" bg="#9CA3AF" />
                    </div>

                    {/* Type */}
                    <div className="mb-4">
                        <Label className="text-xs text-gray-500 mb-1 block">Card Type</Label>
                        <select
                            className="w-full border rounded-md p-2 text-sm bg-white"
                            value={cardType}
                            onChange={(e) => updateFilter('type', e.target.value)}
                        >
                            <option value="">Any Type</option>
                            <option value="Creature">Creature</option>
                            <option value="Instant">Instant</option>
                            <option value="Sorcery">Sorcery</option>
                            <option value="Enchantment">Enchantment</option>
                            <option value="Artifact">Artifact</option>
                            <option value="Planeswalker">Planeswalker</option>
                            <option value="Land">Land</option>
                        </select>
                    </div>

                    {/* Mana Value */}
                    <div>
                        <Label className="text-xs text-gray-500 mb-1 block">Mana Value (CMC)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="0"
                                value={cmcMin}
                                onChange={(e) => setCmcMin(e.target.value)}
                                onBlur={() => updateFilter('cmcMin', cmcMin)}
                                onKeyDown={(e) => e.key === 'Enter' && updateFilter('cmcMin', cmcMin)}
                                className="h-9 w-20"
                            />
                            <span className="text-gray-400">-</span>
                            <Input
                                type="number"
                                placeholder="Any"
                                value={cmcMax}
                                onChange={(e) => setCmcMax(e.target.value)}
                                onBlur={() => updateFilter('cmcMax', cmcMax)}
                                onKeyDown={(e) => e.key === 'Enter' && updateFilter('cmcMax', cmcMax)}
                                className="h-9 w-20"
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Layer 2: Categories */}
                <div>
                    <Label className="mb-3 block text-sm font-semibold text-muted-foreground uppercase tracking-wider">Product Categories</Label>
                    <div className="space-y-1">
                        <button
                            onClick={() => {
                                // If we are on /singles, "All Products" means going back to the full shop
                                router.push('/shop');
                            }}
                            className={`
                                w-full text-left px-3 py-1.5 rounded-md text-sm transition-all
                                ${(pathname === '/shop' && !searchParams.get('category') && !searchParams.get('singles'))
                                    ? 'bg-purple-100 text-purple-700 font-semibold'
                                    : 'hover:bg-gray-50 text-gray-600'
                                }
                            `}
                        >
                            All Products
                        </button>
                        <button
                            onClick={() => updateFilter('singles', 'true')}
                            className={`
                                w-full text-left px-3 py-1.5 rounded-md text-sm transition-all
                                ${(searchParams.get('singles') === 'true' || (pathname === '/singles' && !searchParams.get('category')))
                                    ? 'bg-purple-100 text-purple-700 font-semibold'
                                    : 'hover:bg-gray-50 text-gray-600'
                                }
                            `}
                        >
                            Singles
                        </button>
                        {[
                            { name: 'Booster Boxes', value: 'Booster Boxes' },
                            { name: 'Booster Packs', value: 'Booster Packs' },
                            { name: 'Bundles', value: 'Bundles' },
                            { name: 'Precon Decks', value: 'Precon Decks' },
                            { name: "Collector's Editions", value: "Collector's Editions" },
                        ].map(cat => (
                            <button
                                key={cat.name}
                                onClick={() => updateFilter('category', cat.value)}
                                className={`
                                    w-full text-left px-3 py-1.5 rounded-md text-sm transition-all
                                    ${searchParams.get('category') === cat.value
                                        ? 'bg-purple-100 text-purple-700 font-semibold'
                                        : 'hover:bg-gray-50 text-gray-600'
                                    }
                                `}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Layer 3: Game / Set - Format */}
                <div>
                    <Label className="mb-3 block text-sm font-semibold text-muted-foreground uppercase tracking-wider">Game</Label>
                    <div className="space-y-2">
                        <Label className="text-xs text-gray-500 mb-1 block">Format Legality</Label>
                        <select
                            className="w-full border rounded-md p-2 text-sm bg-white"
                            value={format}
                            onChange={(e) => updateFilter('format', e.target.value)}
                        >
                            <option value="">Any Format</option>
                            <option value="commander">Commander</option>
                            <option value="modern">Modern</option>
                            <option value="standard">Standard</option>
                            <option value="pioneer">Pioneer</option>
                            <option value="legacy">Legacy</option>
                            <option value="vintage">Vintage</option>
                            <option value="pauper">Pauper</option>
                        </select>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Layer 3: Market / Buyable */}
                <div>
                    <Label className="mb-3 block text-sm font-semibold text-muted-foreground uppercase tracking-wider">Market</Label>

                    {/* Price Range */}
                    <div className="mb-4">
                        <Label className="text-xs text-gray-500 mb-1 block">Price ($)</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                type="number"
                                placeholder="Min"
                                value={priceMin}
                                onChange={(e) => setPriceMin(e.target.value)}
                                onBlur={() => updateFilter('priceMin', priceMin)}
                                onKeyDown={(e) => e.key === 'Enter' && updateFilter('priceMin', priceMin)}
                                className="h-9"
                            />
                            <span className="text-gray-400">-</span>
                            <Input
                                type="number"
                                placeholder="Max"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
                                onBlur={() => updateFilter('priceMax', priceMax)}
                                onKeyDown={(e) => e.key === 'Enter' && updateFilter('priceMax', priceMax)}
                                className="h-9"
                            />
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={inStock}
                                onChange={(e) => updateFilter('inStock', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm group-hover:text-black transition-colors text-gray-600">In Stock Only</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={foil}
                                onChange={(e) => updateFilter('foil', e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm group-hover:text-black transition-colors text-gray-600">Foil / Etched</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

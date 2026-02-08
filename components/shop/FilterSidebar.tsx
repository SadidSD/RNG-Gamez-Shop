'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { ChevronDown, ChevronUp, X, Filter, RotateCcw } from 'lucide-react';

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

export function FilterSidebar({ isOpen, onClose, className }: FilterSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // -- State --
    const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '');
    const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '');
    const [cmcMin, setCmcMin] = useState(searchParams.get('cmcMin') || '');
    const [cmcMax, setCmcMax] = useState(searchParams.get('cmcMax') || '');
    const [foil, setFoil] = useState(searchParams.get('foil') === 'true');
    const [inStock, setInStock] = useState(searchParams.get('inStock') === 'true');
    const [format, setFormat] = useState(searchParams.get('format') || '');
    const [cardType, setCardType] = useState(searchParams.get('type') || '');

    // Multi-select for colors
    const [selectedColors, setSelectedColors] = useState<string[]>(
        searchParams.get('colors')?.split(',') || []
    );

    // -- Sync with URL --
    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());

        // Helper to set/delete
        const updateParam = (key: string, value: string | boolean) => {
            if (value !== '' && value !== false && value !== null && value !== undefined) {
                params.set(key, String(value));
            } else {
                params.delete(key);
            }
        };

        updateParam('priceMin', priceMin);
        updateParam('priceMax', priceMax);
        updateParam('cmcMin', cmcMin);
        updateParam('cmcMax', cmcMax);
        updateParam('foil', foil);
        updateParam('inStock', inStock);
        updateParam('format', format);
        updateParam('type', cardType);

        if (selectedColors.length > 0) {
            params.set('colors', selectedColors.join(','));
        } else {
            params.delete('colors');
        }

        // Reset page on filter change
        params.delete('page');

        router.push(`/shop?${params.toString()}`);
        if (window.innerWidth < 1024) {
            onClose(); // Close mobile drawer on apply
        }
    };

    const clearFilters = () => {
        setPriceMin('');
        setPriceMax('');
        setCmcMin('');
        setCmcMax('');
        setFoil(false);
        setInStock(false);
        setFormat('');
        setCardType('');
        setSelectedColors([]);
        router.push('/shop');
        if (window.innerWidth < 1024) onClose();
    };

    const toggleColor = (color: string) => {
        setSelectedColors(prev =>
            prev.includes(color)
                ? prev.filter(c => c !== color)
                : [...prev, color]
        );
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
                            onChange={(e) => setCardType(e.target.value)}
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
                                className="h-9 w-20"
                            />
                            <span className="text-gray-400">-</span>
                            <Input
                                type="number"
                                placeholder="Any"
                                value={cmcMax}
                                onChange={(e) => setCmcMax(e.target.value)}
                                className="h-9 w-20"
                            />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-100" />

                {/* Layer 2: Game / Set - Format */}
                <div>
                    <Label className="mb-3 block text-sm font-semibold text-muted-foreground uppercase tracking-wider">Game</Label>
                    <div className="space-y-2">
                        <Label className="text-xs text-gray-500 mb-1 block">Format Legality</Label>
                        <select
                            className="w-full border rounded-md p-2 text-sm bg-white"
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
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
                                className="h-9"
                            />
                            <span className="text-gray-400">-</span>
                            <Input
                                type="number"
                                placeholder="Max"
                                value={priceMax}
                                onChange={(e) => setPriceMax(e.target.value)}
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
                                onChange={(e) => setInStock(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm group-hover:text-black transition-colors text-gray-600">In Stock Only</span>
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={foil}
                                onChange={(e) => setFoil(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span className="text-sm group-hover:text-black transition-colors text-gray-600">Foil / Etched</span>
                        </label>
                    </div>
                </div>

                <Button onClick={applyFilters} className="w-full">
                    Apply Filters
                </Button>
            </div>
        </div>
    );
}

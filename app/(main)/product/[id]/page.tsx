"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, Minus, Plus, ShoppingCart, Check, X, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useShopCart } from '@/context/ShopCartContext';
import { MtgSymbols } from '@/components/ui/MtgSymbols';

interface ProductVariant {
    id: string;
    condition: string;
    isFoil: boolean;
    language: string;
    price: number | string;
    inventory: { quantity: number } | null;
}

interface Card {
    oracleId: string;
    name: string;
    oracleText: string;
    legalities: any;
    manaCost?: string;
    manaValue?: number;
    typeLine?: string;
    colors?: string[];
    power?: string;
    toughness?: string;
    loyalty?: string;
}

interface Product {
    id: string;
    name: string;
    set: string;
    rarity: string;
    collectorNumber: string;
    images: string[];
    card: Card;
    variants: ProductVariant[];
}

export default function ProductPage({ params }: { params: { id: string } }) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState<'details' | 'legalities' | 'rulings'>('details');

    // Selectors
    const [selectedCondition, setSelectedCondition] = useState<string>('NM');
    const [selectedFoil, setSelectedFoil] = useState<boolean>(false);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('English');

    const { addItem } = useShopCart();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/public/products/${params.id}`);
                const data = await res.json();
                setProduct(data);

                // Set default variant
                if (data.variants && data.variants.length > 0) {
                    const defaultVar = data.variants[0];
                    setSelectedVariant(defaultVar);
                    setSelectedCondition(defaultVar.condition);
                    setSelectedFoil(defaultVar.isFoil);
                    setSelectedLanguage(defaultVar.language);
                }
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [params.id]);

    // Update selected variant when selectors change
    useEffect(() => {
        if (!product) return;
        const found = product.variants.find(v =>
            v.condition === selectedCondition &&
            v.isFoil === selectedFoil &&
            v.language === selectedLanguage
        );
        setSelectedVariant(found || null);
    }, [selectedCondition, selectedFoil, selectedLanguage, product]);

    const [isAdded, setIsAdded] = useState(false);

    const handleAddToCart = () => {
        if (!product || !selectedVariant) return;

        addItem({
            variantId: selectedVariant.id,
            productId: product.id,
            name: product.name,
            set: product.set || 'Unknown Set',
            condition: selectedVariant.condition,
            price: Number(selectedVariant.price),
            image: product.images?.[0] || '/placeholder.png'
        }, quantity);

        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 1500);
    };

    if (loading) return <div className="min-h-screen bg-[#F1F1F1] pt-40 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full"></div></div>;
    if (!product) return <div className="min-h-screen bg-[#F1F1F1] pt-40 text-center">Product not found</div>;

    // Derived Data
    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Magic: The Gathering', href: '/shop?category=Magic:%20The%20Gathering' },
        { label: product.set || 'Set', href: `/shop?set=${product.set}` },
        { label: product.name, isActive: true }
    ];

    const stock = selectedVariant?.inventory?.quantity || 0;
    const isOutOfStock = stock === 0;

    return (
        <div className="min-h-screen bg-[#F1F1F1] pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-7xl mx-auto">
                <Breadcrumbs items={breadcrumbs} className="mb-8" />

                <div className="bg-white rounded-[30px] p-6 md:p-10 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Left Column: Images (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col gap-6">
                        <div className="relative aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden border border-black/5 shadow-inner">
                            {product.images?.[0] ? (
                                <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-contain p-4 hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                            )}
                            {/* Badges */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                {selectedFoil && <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">FOIL</span>}
                                {product.rarity === 'Mythic' && <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">MYTHIC</span>}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Details & Buy Box (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        {/* Header */}
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black text-black mb-2 tracking-tight" style={{ fontFamily: 'Europa Grotesk SH' }}>
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 text-gray-500 text-sm font-medium">
                                <span className="bg-gray-100 px-3 py-1 rounded-full text-black flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-black"></span>
                                    {product.set}
                                </span>
                                <span>#{product.collectorNumber}</span>
                                <span className="capitalize">{product.rarity}</span>
                            </div>
                        </div>

                        {/* Buy Box */}
                        <div className="bg-gray-50 rounded-2xl p-6 border border-black/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Selectors */}
                                <div className="space-y-6">
                                    {/* Printing / Finish Selector */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Version</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setSelectedFoil(false)}
                                                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 transition-all ${!selectedFoil ? 'bg-white border-black shadow-sm' : 'bg-gray-100 border-transparent text-gray-500 hover:bg-white hover:border-gray-200'}`}
                                            >
                                                <span className="text-sm font-bold">Normal</span>
                                            </button>
                                            <button
                                                onClick={() => setSelectedFoil(true)}
                                                className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl border-2 transition-all ${selectedFoil ? 'bg-white border-purple-500 text-purple-700 shadow-sm' : 'bg-gray-100 border-transparent text-gray-500 hover:bg-white hover:border-purple-200'}`}
                                            >
                                                <span className="text-sm font-bold">Foil</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Condition Selector */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Condition</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {['NM', 'LP', 'MP', 'HP'].map(cond => (
                                                <button
                                                    key={cond}
                                                    onClick={() => setSelectedCondition(cond)}
                                                    className={`py-2 rounded-lg text-xs font-bold border-2 transition-all ${selectedCondition === cond ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`}
                                                >
                                                    {cond}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="mt-2 text-right">
                                            <Link href="#" className="text-xs text-purple-600 font-bold hover:underline">Condition Guide</Link>
                                        </div>
                                    </div>

                                    {/* Language Selector (Mock) */}
                                    <div>
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Language</label>
                                        <select
                                            value={selectedLanguage}
                                            onChange={(e) => setSelectedLanguage(e.target.value)}
                                            className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-black focus:border-black block p-2.5 font-bold"
                                        >
                                            <option value="English">English</option>
                                            <option value="Japanese">Japanese</option>
                                            <option value="German">German</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Price & Action */}
                                <div className="flex flex-col h-full">
                                    <div className="bg-white rounded-2xl border border-black/5 p-5 shadow-sm flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-baseline justify-between mb-1">
                                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Current Price</p>
                                                {/* Market Range Mock */}
                                                <div className="text-xs font-medium text-gray-400">
                                                    Market: <span className="text-gray-600">$59 - $74</span>
                                                </div>
                                            </div>

                                            {selectedVariant ? (
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-5xl font-black text-black tracking-tight">${Number(selectedVariant.price).toFixed(2)}</span>
                                                    <span className="text-gray-400 font-bold text-lg">USD</span>
                                                </div>
                                            ) : (
                                                <div className="text-3xl font-bold text-gray-300">Unavailable</div>
                                            )}

                                            <p className={`text-sm mt-3 font-bold flex items-center gap-2 ${stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                <span className={`w-2 h-2 rounded-full ${stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                                {stock > 0 ? `${stock} in stock` : 'Out of Stock'}
                                            </p>
                                        </div>

                                        {stock > 0 && (
                                            <div className="mt-8 space-y-3">
                                                <div className="flex flex-col 2xl:flex-row items-stretch 2xl:items-center gap-3">
                                                    <div className="flex items-center justify-between bg-gray-100 rounded-xl h-14 border border-transparent hover:border-gray-200 transition-colors">
                                                        <button
                                                            type="button"
                                                            onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                                                            className="px-6 h-full hover:bg-gray-200 rounded-l-xl transition-colors text-gray-500 hover:text-black"
                                                        >
                                                            <Minus size={18} />
                                                        </button>
                                                        <span className="w-10 text-center font-black text-lg">{quantity}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => quantity < stock && setQuantity(q => q + 1)}
                                                            className="px-6 h-full hover:bg-gray-200 rounded-r-xl transition-colors text-gray-500 hover:text-black"
                                                        >
                                                            <Plus size={18} />
                                                        </button>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleAddToCart}
                                                        disabled={isAdded}
                                                        className={`flex-1 font-bold h-14 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 text-lg whitespace-nowrap ${isAdded ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-[#B266FF] hover:bg-[#9933FF] text-white shadow-purple-500/20'}`}
                                                    >
                                                        {isAdded ? (
                                                            <>
                                                                <Check size={20} className="shrink-0" />
                                                                Added to Cart!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ShoppingCart size={20} className="shrink-0" />
                                                                Add to Cart
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                                <p className="text-center text-xs text-gray-400 font-medium">+ Shipping: Calculated at checkout</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="mt-4 grid grid-cols-2 gap-3">
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white p-2 rounded-lg border border-gray-100 justify-center">
                                            <ShieldCheck size={14} className="text-green-500" />
                                            Authenticity Guarantee
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-white p-2 rounded-lg border border-gray-100 justify-center">
                                            <Check size={14} className="text-blue-500" />
                                            Verified Seller
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Other Listings Mock */}
                            <div className="border-t border-gray-200 pt-4 mt-2">
                                <button className="flex items-center justify-between w-full text-sm font-bold text-gray-600 hover:text-black transition-colors group">
                                    <span>View 3 other listings from $62.00</span>
                                    <ChevronDown size={16} className="group-hover:translate-y-0.5 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Information Tabs */}
                        <div>
                            <div className="flex border-b border-gray-200 mb-6">
                                {['details', 'legalities', 'rulings'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`px-6 py-3 text-sm font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === tab ? 'border-black text-black' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {activeTab === 'details' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-black uppercase text-xs tracking-widest">Oracle Text</h3>
                                            {product.card?.manaCost && (
                                                <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm">
                                                    <span className="text-[10px] font-black text-gray-400 mr-1 uppercase">Cost</span>
                                                    <MtgSymbols text={product.card.manaCost} />
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed font-serif text-lg">
                                            {product.card?.oracleText ? (
                                                <MtgSymbols text={product.card.oracleText} />
                                            ) : (
                                                "No oracle text available."
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Type Line</span>
                                            <p className="font-bold text-sm leading-tight mt-1">{product.card?.typeLine || "Card"}</p>
                                        </div>
                                        {product.card?.colors && product.card.colors.length > 0 && (
                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Color</span>
                                                <div className="flex gap-1 mt-1">
                                                    {product.card.colors.map(c => (
                                                        <span key={c} className={`w-4 h-4 rounded-full border border-black/10 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${c === 'W' ? 'bg-yellow-100 text-yellow-800' : c === 'U' ? 'bg-blue-500' : c === 'B' ? 'bg-gray-800' : c === 'R' ? 'bg-red-500' : c === 'G' ? 'bg-green-600' : 'bg-gray-400'}`}>
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {(product.card?.power || product.card?.toughness) && (
                                            <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm ring-1 ring-black/5">
                                                <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Stats</span>
                                                <p className="font-black text-xl mt-0.5">{product.card.power} / {product.card.toughness}</p>
                                            </div>
                                        )}
                                        {product.card?.loyalty && (
                                            <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                                                <span className="text-purple-400 text-[10px] uppercase font-black tracking-widest">Loyalty</span>
                                                <p className="font-black text-xl mt-0.5 text-purple-700">{product.card.loyalty}</p>
                                            </div>
                                        )}
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Mana Value</span>
                                            <p className="font-bold text-sm mt-1">{product.card?.manaValue ?? "N/A"}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'legalities' && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {product.card?.legalities ?
                                        ['commander', 'modern', 'standard', 'pauper', 'legacy', 'vintage'].map(format => {
                                            const status = product.card.legalities[format] || 'not_legal';
                                            const isLegal = status === 'legal';
                                            return (
                                                <div key={format} className={`flex items-center justify-between p-3 rounded-lg border ${isLegal ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-60'}`}>
                                                    <span className="capitalize font-bold text-sm">{format}</span>
                                                    <div className="flex items-center gap-1.5">
                                                        {isLegal ? <Check size={14} className="text-green-600" /> : <X size={14} className="text-gray-400" />}
                                                        <span className={`text-xs font-bold uppercase ${isLegal ? 'text-green-700' : 'text-gray-500'}`}>
                                                            {isLegal ? 'Legal' : 'Not Legal'}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                        : <p className="text-gray-500 col-span-3">Legality data not available.</p>}
                                </div>
                            )}

                            {activeTab === 'rulings' && (
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center text-gray-500 italic animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    No rulings available for this card yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SearchBox() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const router = useRouter();
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Fetch suggestions with debounce
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (!query.trim() || query.trim().length < 2) {
                setSuggestions([]);
                setShowDropdown(false);
                return;
            }

            setLoading(true);
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const apiKey = process.env.NEXT_PUBLIC_API_KEY;

                if (!apiUrl) return;

                const res = await fetch(`${apiUrl}/public/products?name=${encodeURIComponent(query.trim())}`, {
                    headers: { 'x-api-key': apiKey || '' },
                    cache: 'no-store'
                });

                if (res.ok) {
                    const data = await res.json();
                    // Show top 5 suggestions
                    setSuggestions(data.data?.slice(0, 5) || []);
                    setShowDropdown(true);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setShowDropdown(false);
        if (query.trim()) {
            router.push(`/shop?name=${encodeURIComponent(query.trim())}`);
        } else {
            router.push(`/shop`);
        }
    };

    const handleSuggestionClick = (productId: string) => {
        setShowDropdown(false);
        setQuery("");
        router.push(`/product/${productId}`);
    };

    return (
        <div className="relative w-full max-w-md group" ref={dropdownRef}>
            <form onSubmit={handleSubmit} className="relative w-full">
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>

                {/* Glass Container */}
                <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-sm transition-all duration-300 hover:bg-white/15">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => {
                            if (suggestions.length > 0) setShowDropdown(true);
                        }}
                        className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-white/50 px-4 py-2 font-['Europa_Grotesk_SH'] tracking-wide"
                        style={{ fontFamily: 'Europa Grotesk SH' }}
                    />
                    <div className="pr-2">
                        <button type="submit" className="flex items-center justify-center p-1.5 rounded-full bg-white/10 border border-white/10 text-white/70 hover:bg-white/20 transition-colors cursor-pointer">
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b from-purple-900/95 to-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-80 overflow-y-auto">
                        {suggestions.map((product) => (
                            <button
                                key={product.id}
                                onClick={() => handleSuggestionClick(product.id)}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors text-left border-b border-white/5 last:border-none"
                            >
                                <div className="w-10 h-14 relative flex-shrink-0 bg-white/5 rounded overflow-hidden">
                                    <Image
                                        src={(product.images && product.images.length > 0) ? product.images[0] : '/placeholder.svg'}
                                        alt={product.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white text-sm font-medium truncate">
                                        {product.name}
                                    </p>
                                    <p className="text-white/50 text-xs truncate">
                                        {product.set || product.category?.name || "TCG"}
                                    </p>
                                </div>
                                <div className="text-green-400 text-sm font-bold">
                                    ${Number(product.price).toFixed(2)}
                                </div>
                            </button>
                        ))}
                    </div>
                    <div className="p-2 border-t border-white/10 bg-black/50">
                        <button
                            onClick={handleSubmit}
                            className="w-full text-center text-xs text-purple-300 hover:text-purple-200 py-1 transition-colors"
                        >
                            View all results for "{query}"
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

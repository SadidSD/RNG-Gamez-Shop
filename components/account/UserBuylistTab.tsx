"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function UserBuylistTab() {
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOffers() {
            try {
                const token = Cookies.get("tcg-shop-token");
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/buylist/offers/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOffers(res.data);
            } catch (error) {
                console.error("Failed to fetch buylist offers", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOffers();
    }, []);

    if (loading) return <div className="text-gray-400">Loading offers...</div>;

    if (offers.length === 0) {
        return (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                <p className="text-gray-400">You haven't submitted any buylist offers yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {offers.map((offer) => (
                <div key={offer.id} className="bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-white">Offer ID: {offer.id.slice(0, 8)}...</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                offer.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                                offer.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                offer.status === 'REJECTED' ? 'bg-red-500/20 text-red-400' :
                                'bg-purple-500/20 text-purple-400'
                            }`}>
                                {offer.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                            {new Date(offer.createdAt).toLocaleDateString()}
                        </p>
                        <div className="text-sm text-gray-300">
                            {offer.items?.length || 0} cards submitted
                        </div>
                    </div>
                    <div className="flex flex-col md:items-end justify-between">
                        <span className="text-sm text-gray-400 mb-1">Total Credit Value</span>
                        <span className="font-bold text-lg text-green-400">${Number(offer.totalCredit).toFixed(2)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

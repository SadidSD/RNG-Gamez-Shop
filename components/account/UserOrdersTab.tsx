"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default function UserOrdersTab() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const token = Cookies.get("tcg-shop-token");
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(res.data);
            } catch (error) {
                console.error("Failed to fetch orders", error);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    if (loading) return <div className="text-gray-400">Loading orders...</div>;

    if (orders.length === 0) {
        return (
            <div className="text-center py-12 bg-white/5 rounded-xl border border-white/10">
                <p className="text-gray-400">You haven't placed any orders yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {orders.map((order) => (
                <div key={order.id} className="bg-white/5 rounded-xl border border-white/10 p-6 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-white">Order #{order.orderNumber}</span>
                            <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                order.status === 'COMPLETED' || order.status === 'SHIPPED' ? 'bg-green-500/20 text-green-400' :
                                order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-gray-500/20 text-gray-400'
                            }`}>
                                {order.status}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                        <div className="text-sm text-gray-300">
                            {order.items?.length || 0} items
                        </div>
                    </div>
                    <div className="flex flex-col md:items-end justify-between">
                        <span className="font-bold text-lg text-white">${Number(order.total).toFixed(2)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
}

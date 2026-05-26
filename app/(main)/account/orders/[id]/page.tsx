"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Package, MapPin, Calendar, Clock, CreditCard, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import Cookies from "js-cookie";

interface OrderItem {
    id: string;
    productName: string;
    variantSku: string;
    quantity: number;
    price: string;
}

interface Order {
    id: string;
    orderNumber: number;
    status: string;
    paymentStatus: string;
    total: string;
    createdAt: string;
    shippingName: string;
    shippingAddress: string;
    shippingCity: string;
    shippingState: string;
    shippingCountry: string;
    shippingZip: string;
    trackingNumber: string;
    labelUrl: string;
    items: OrderItem[];
}

export default function OrderTrackingPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrderDetails() {
            try {
                const token = Cookies.get("tcg-shop-token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
                const res = await axios.get(`${apiUrl}/orders/customer/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setOrder(res.data);
            } catch (err: any) {
                console.error("Error fetching order tracking details", err);
                setError(err.response?.data?.message || "Failed to load order tracking details.");
            } finally {
                setLoading(false);
            }
        }

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black pt-28 pb-20 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-black pt-28 pb-20 flex flex-col items-center justify-center px-4">
                <p className="text-red-400 text-lg mb-6">{error || "Order not found."}</p>
                <Link href="/account" className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors border border-white/10">
                    <ChevronLeft size={18} />
                    Back to Account
                </Link>
            </div>
        );
    }

    // Determine tracking steps
    const status = order.status.toUpperCase();
    const steps = [
        { label: "Placed", desc: "Order submitted", active: true },
        { label: "Paid", desc: "Payment confirmed", active: status !== "PENDING" && status !== "CANCELLED" },
        { label: "Shipped", desc: "In transit via USPS", active: status === "SHIPPED" || status === "COMPLETED" },
        { label: "Delivered", desc: "Arrived at destination", active: status === "COMPLETED" }
    ];

    const isCancelled = status === "CANCELLED";

    return (
        <div className="min-h-screen pt-28 pb-20 bg-black relative">
            {/* Ambient background blur */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-5"></div>
            </div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                {/* Back Link */}
                <Link href="/account" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                    <ChevronLeft size={18} />
                    <span>Back to Account</span>
                </Link>

                <div className="flex flex-col gap-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white mb-1">
                                Order #{order.orderNumber}
                            </h1>
                            <p className="text-sm text-gray-400">
                                Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: "long" })}
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                            <span className="text-xs text-gray-400">Total Amount</span>
                            <span className="text-2xl font-extrabold text-white">${Number(order.total).toFixed(2)}</span>
                        </div>
                    </div>

                    {/* Cancelled Alert */}
                    {isCancelled && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex items-center gap-3">
                            <Clock size={24} />
                            <div>
                                <h3 className="font-semibold">Order Cancelled</h3>
                                <p className="text-sm text-red-400/80">This order was cancelled. If you believe this is an error, please contact support.</p>
                            </div>
                        </div>
                    )}

                    {/* Progress Tracker */}
                    {!isCancelled && (
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                            <h2 className="text-lg font-semibold text-white mb-8">Delivery Status</h2>
                            
                            {/* Desktop Timeline */}
                            <div className="relative flex justify-between items-start">
                                {/* Line in background */}
                                <div className="absolute top-5 left-[6%] right-[6%] h-[2px] bg-white/10 z-0"></div>
                                <div 
                                    className="absolute top-5 left-[6%] h-[2px] bg-purple-500 transition-all duration-700 z-0"
                                    style={{ 
                                        width: status === "COMPLETED" ? "88%" : 
                                               status === "SHIPPED" ? "58%" : 
                                               status === "PAID" ? "29%" : "0%" 
                                    }}
                                ></div>

                                {steps.map((step, idx) => (
                                    <div key={idx} className="flex flex-col items-center text-center relative z-10 w-[20%]">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors duration-500 ${
                                            step.active 
                                                ? "bg-purple-500 border-purple-400 text-white" 
                                                : "bg-black border-white/10 text-gray-500"
                                        }`}>
                                            <Package size={18} />
                                        </div>
                                        <h4 className={`mt-3 font-semibold text-sm transition-colors ${
                                            step.active ? "text-white" : "text-gray-500"
                                        }`}>
                                            {step.label}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-1 max-w-[120px] hidden sm:block">
                                            {step.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tracking Code Card */}
                    {order.trackingNumber && (
                        <div className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">Track Your Package</h3>
                                    <p className="text-sm text-gray-400">Carrier: USPS (United States Postal Service)</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                                <span className="font-mono text-lg text-white font-bold bg-black/40 border border-white/5 px-4 py-2 rounded-lg text-center sm:text-left">
                                    {order.trackingNumber}
                                </span>
                                <a 
                                    href={`https://tools.usps.com/go/TrackConfirmAction?qtc_tcd1=${order.trackingNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold rounded-xl transition-colors text-center"
                                >
                                    <span>Track on USPS</span>
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Order Details & Summary Split */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Items & Shipping */}
                        <div className="md:col-span-2 flex flex-col gap-6">
                            {/* Items List */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Items Ordered</h3>
                                <div className="divide-y divide-white/5">
                                    {order.items?.map((item) => (
                                        <div key={item.id} className="py-4 flex justify-between items-center gap-4 first:pt-0 last:pb-0">
                                            <div>
                                                <h4 className="font-semibold text-white text-sm sm:text-base">
                                                    {item.productName}
                                                </h4>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-xs px-2 py-0.5 bg-white/5 rounded border border-white/5 text-gray-400 font-mono">
                                                        {item.variantSku || "N/A"}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        Qty: {item.quantity}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-sm sm:text-base font-bold text-white">
                                                ${(Number(item.price) * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping Details */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <MapPin size={18} className="text-purple-400" />
                                    <span>Shipping Destination</span>
                                </h3>
                                <div className="text-gray-300 space-y-1 text-sm sm:text-base">
                                    <p className="font-semibold text-white">{order.shippingName}</p>
                                    <p>{order.shippingAddress}</p>
                                    <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                                    <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mt-2">{order.shippingCountry}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary & Pricing */}
                        <div className="flex flex-col gap-6">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
                                <h3 className="text-lg font-semibold text-white mb-2">Order Summary</h3>
                                <div className="space-y-2 text-sm text-gray-400">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="text-white">${Number(order.total).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-white">$0.00</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax</span>
                                        <span className="text-white">$0.00</span>
                                    </div>
                                </div>
                                <hr className="border-white/10" />
                                <div className="flex justify-between items-center">
                                    <span className="text-white font-medium">Grand Total</span>
                                    <span className="text-xl font-bold text-white">${Number(order.total).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
                                <h3 className="text-sm font-semibold text-white mb-1 uppercase tracking-wider text-gray-400">Payment Status</h3>
                                <div className="flex items-center gap-2">
                                    <CreditCard size={16} className="text-purple-400" />
                                    <span className={`text-sm font-bold capitalize ${
                                        order.paymentStatus === 'PAID' ? 'text-green-400' : 'text-yellow-400'
                                    }`}>
                                        {order.paymentStatus.toLowerCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { 
    ArrowLeft, 
    Calendar, 
    Mail, 
    MapPin, 
    CreditCard, 
    Package, 
    Truck, 
    Download,
    ExternalLink,
    Loader2,
    CheckCircle,
    RefreshCw
} from "lucide-react"

interface OrderItem {
    id: string
    productName: string
    variantSku: string | null
    quantity: number
    price: string
}

interface Customer {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
}

interface Order {
    id: string
    orderNumber: number
    status: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED" | "REFUNDED"
    paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED"
    total: string
    createdAt: string
    paidAt: string | null
    stripeSessionId: string | null
    trackingNumber: string | null
    labelUrl: string | null
    easypostShipmentId: string | null
    shippingName: string | null
    shippingAddress: string | null
    shippingCity: string | null
    shippingState: string | null
    shippingCountry: string | null
    shippingZip: string | null
    customer: Customer | null
    items: OrderItem[]
}

interface Rate {
    id: string
    carrier: string
    service: string
    rate: string
    deliveryDays: number | null
    estDeliveryDate: string | null
}

interface RatesData {
    shipmentId: string
    rates: Rate[]
}

export default function OrderDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [statusUpdating, setStatusUpdating] = useState(false)
    const [newStatus, setNewStatus] = useState<Order["status"] | "">("")
    
    // EasyPost Shipping state
    const [ratesLoading, setRatesLoading] = useState(false)
    const [ratesData, setRatesData] = useState<RatesData | null>(null)
    const [selectedRateId, setSelectedRateId] = useState<string>("")
    const [fulfilling, setFulfilling] = useState(false)
    const [shippingError, setShippingError] = useState<string | null>(null)

    const fetchOrder = async () => {
        setLoading(true)
        try {
            const token = Cookies.get("tcg-shop-token")
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setOrder(res.data)
            setNewStatus(res.data.status)
        } catch (error) {
            console.error("Failed to fetch order:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) fetchOrder()
    }, [id])

    const handleUpdateStatus = async () => {
        if (!newStatus || newStatus === order?.status) return
        setStatusUpdating(true)
        try {
            const token = Cookies.get("tcg-shop-token")
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setOrder(res.data)
            alert("Order status updated successfully!")
        } catch (error) {
            console.error("Failed to update status:", error)
            alert("Failed to update status. Please try again.")
        } finally {
            setStatusUpdating(false)
        }
    }

    const fetchShippingRates = async () => {
        setRatesLoading(true)
        setShippingError(null)
        try {
            const token = Cookies.get("tcg-shop-token")
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/rates`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setRatesData(res.data)
            if (res.data.rates && res.data.rates.length > 0) {
                // Select cheapest rate by default
                const cheapest = res.data.rates.reduce((min: Rate, r: Rate) => 
                    Number(r.rate) < Number(min.rate) ? r : min, res.data.rates[0]
                )
                setSelectedRateId(cheapest.id)
            }
        } catch (error: any) {
            console.error("Failed to fetch shipping rates:", error)
            setShippingError(error.response?.data?.message || "Failed to generate rates. Please check shipping address.")
        } finally {
            setRatesLoading(false)
        }
    }

    const handleFulfillOrder = async () => {
        if (!selectedRateId || !ratesData) return
        setFulfilling(true)
        setShippingError(null)
        try {
            const token = Cookies.get("tcg-shop-token")
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/fulfill`,
                {
                    easypostRateId: selectedRateId,
                    easypostShipmentId: ratesData.shipmentId
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setOrder(res.data)
            setRatesData(null) // Reset rates selection
            alert("Order fulfilled and label purchased successfully!")
        } catch (error: any) {
            console.error("Failed to fulfill order:", error)
            setShippingError(error.response?.data?.message || "Fulfillment failed. Please try again.")
        } finally {
            setFulfilling(false)
        }
    }

    if (loading) {
        return (
            <div className="py-24 flex flex-col items-center justify-center text-neutral-400">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-4" />
                <span className="text-sm tracking-wide">Loading order details...</span>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="py-24 text-center">
                <p className="text-lg text-rose-400 font-semibold">Order not found.</p>
                <Link href="/admin/orders" className="text-purple-400 hover:underline mt-4 inline-block">
                    Return to orders list
                </Link>
            </div>
        )
    }

    const getStatusStyles = (status: Order["status"]) => {
        switch (status) {
            case "PENDING":
                return "bg-amber-500/10 text-amber-400 border border-amber-500/20"
            case "PAID":
                return "bg-blue-500/10 text-blue-400 border border-blue-500/20"
            case "SHIPPED":
                return "bg-purple-500/10 text-purple-400 border border-purple-500/20"
            case "COMPLETED":
                return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
            case "CANCELLED":
                return "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            default:
                return "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20"
        }
    }

    return (
        <div className="space-y-8">
            {/* Header / Back Link */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <Link href="/admin/orders" className="group flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-all mb-2">
                        <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                        <span>Back to Orders</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black text-white">Order #{order.orderNumber}</h1>
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(order.status)}`}>
                            {order.status}
                        </span>
                    </div>
                </div>
                
                {/* Status Dropdown Panel */}
                <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-4 flex items-center gap-3 backdrop-blur-md">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mb-1">Set Order Status</span>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value as Order["status"])}
                            className="bg-neutral-950 border border-neutral-800 text-white rounded-lg h-9 px-3 text-xs focus:border-purple-500 focus:outline-none"
                        >
                            <option value="PENDING">PENDING</option>
                            <option value="PAID">PAID</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                            <option value="REFUNDED">REFUNDED</option>
                        </select>
                    </div>
                    <button
                        onClick={handleUpdateStatus}
                        disabled={statusUpdating || newStatus === order.status}
                        className="h-9 px-4 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-xs font-bold transition-all flex items-center gap-1.5 self-end"
                    >
                        {statusUpdating ? (
                            <Loader2 size={12} className="animate-spin" />
                        ) : (
                            "Update"
                        )}
                    </button>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Columns (Order Items, Shipping Panel) */}
                <div className="lg:col-span-2 space-y-8">
                    
                    {/* FULFILLMENT & SHIPPING RATES (EasyPost Integration) */}
                    {order.status === "PAID" && (
                        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md space-y-6">
                            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">EasyPost Fulfillment</h3>
                                        <p className="text-xs text-neutral-400">Fetch live carrier rates and purchase shipping labels.</p>
                                    </div>
                                </div>
                                {!ratesData && (
                                    <button
                                        onClick={fetchShippingRates}
                                        disabled={ratesLoading}
                                        className="h-9 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all flex items-center gap-2"
                                    >
                                        {ratesLoading ? (
                                            <>
                                                <Loader2 size={14} className="animate-spin text-black" />
                                                <span>Calculating...</span>
                                            </>
                                        ) : (
                                            <>
                                                <RefreshCw size={14} />
                                                <span>Get Rates</span>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>

                            {shippingError && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                                    <span>⚠️ {shippingError}</span>
                                </div>
                            )}

                            {/* Rates List */}
                            {ratesData && (
                                <div className="space-y-4">
                                    <div className="border border-neutral-800/80 rounded-xl overflow-hidden">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-bold border-b border-neutral-800/80">
                                                    <th className="py-3 px-4">Carrier</th>
                                                    <th className="py-3 px-4">Service</th>
                                                    <th className="py-3 px-4 text-center">Delivery Time</th>
                                                    <th className="py-3 px-4 text-right">Price</th>
                                                    <th className="py-3 px-4 text-center">Select</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-800/40 text-neutral-300">
                                                {ratesData.rates.map((rate) => (
                                                    <tr 
                                                        key={rate.id} 
                                                        onClick={() => setSelectedRateId(rate.id)}
                                                        className={`hover:bg-white/[0.02] cursor-pointer transition-colors ${selectedRateId === rate.id ? "bg-purple-900/10" : ""}`}
                                                    >
                                                        <td className="py-3 px-4 font-semibold text-white">{rate.carrier}</td>
                                                        <td className="py-3 px-4">{rate.service}</td>
                                                        <td className="py-3 px-4 text-center">
                                                            {rate.deliveryDays ? `${rate.deliveryDays} Days` : "N/A"}
                                                            {rate.estDeliveryDate && (
                                                                <span className="block text-[10px] text-neutral-400 mt-0.5">
                                                                    Est: {new Date(rate.estDeliveryDate).toLocaleDateString()}
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td className="py-3 px-4 text-right font-bold text-white">${Number(rate.rate).toFixed(2)}</td>
                                                        <td className="py-3 px-4 text-center">
                                                            <input
                                                                type="radio"
                                                                name="shipping_rate"
                                                                checked={selectedRateId === rate.id}
                                                                onChange={() => setSelectedRateId(rate.id)}
                                                                className="accent-purple-500"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={() => setRatesData(null)}
                                            className="px-4 py-2 rounded-xl border border-neutral-800 hover:bg-neutral-800 text-xs font-semibold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleFulfillOrder}
                                            disabled={fulfilling || !selectedRateId}
                                            className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-xs font-bold transition-all flex items-center gap-1.5"
                                        >
                                            {fulfilling ? (
                                                <>
                                                    <Loader2 size={14} className="animate-spin" />
                                                    <span>Purchasing Label...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle size={14} />
                                                    <span>Buy Label & Fulfill</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* FULFILLED INFO PANEL */}
                    {order.trackingNumber && (
                        <div className="bg-gradient-to-r from-purple-950/20 to-neutral-900/40 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-md space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                                    <Package size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Shipping Details</h3>
                                    <p className="text-xs text-neutral-400">This order has been fulfilled.</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                <div className="bg-black/20 rounded-xl p-4 border border-neutral-800/40">
                                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Tracking Number</span>
                                    <span className="font-mono text-sm font-bold text-white mt-1 block">{order.trackingNumber}</span>
                                    <a 
                                        href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="text-xs text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1 mt-2 transition-colors"
                                    >
                                        <span>Track on USPS</span>
                                        <ExternalLink size={12} />
                                    </a>
                                </div>

                                {order.labelUrl && (
                                    <div className="bg-black/20 rounded-xl p-4 border border-neutral-800/40 flex flex-col justify-between">
                                        <div>
                                            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Shipping Label</span>
                                            <span className="text-xs text-neutral-300 mt-1 block">Label purchased via EasyPost.</span>
                                        </div>
                                        <a 
                                            href={order.labelUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/20 rounded-lg text-xs font-semibold inline-flex items-center justify-center gap-1.5 mt-4 transition-all"
                                        >
                                            <Download size={14} />
                                            <span>Download Label</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ITEMS LIST */}
                    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
                        <h3 className="font-semibold text-white border-b border-neutral-800/80 pb-3 flex items-center gap-2">
                            <Package size={18} className="text-purple-400" />
                            <span>Items Ordered ({order.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                        </h3>

                        <div className="border border-neutral-800/60 rounded-xl overflow-hidden">
                            <table className="w-full text-left text-xs md:text-sm border-collapse">
                                <thead>
                                    <tr className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-bold text-[10px] border-b border-neutral-800/80">
                                        <th className="py-3 px-4">Product Name</th>
                                        <th className="py-3 px-4">SKU</th>
                                        <th className="py-3 px-4 text-center">Qty</th>
                                        <th className="py-3 px-4 text-right">Price</th>
                                        <th className="py-3 px-4 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-800/40 text-neutral-300">
                                    {order.items.map((item) => (
                                        <tr key={item.id} className="hover:bg-white/[0.01] transition-colors">
                                            <td className="py-4 px-4 font-medium text-white">{item.productName}</td>
                                            <td className="py-4 px-4 font-mono text-xs text-neutral-400">{item.variantSku || "N/A"}</td>
                                            <td className="py-4 px-4 text-center font-semibold">{item.quantity}</td>
                                            <td className="py-4 px-4 text-right">${Number(item.price).toFixed(2)}</td>
                                            <td className="py-4 px-4 text-right font-bold text-white">${(Number(item.price) * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <tr className="bg-neutral-950/40 font-bold border-t border-neutral-800/80 text-sm">
                                        <td colSpan={4} className="py-4 px-4 text-right text-neutral-400">Grand Total</td>
                                        <td className="py-4 px-4 text-right text-purple-400 text-lg">${Number(order.total).toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column (Customer & Payment Info) */}
                <div className="space-y-8">
                    
                    {/* CUSTOMER PROFILE */}
                    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
                        <h3 className="font-semibold text-white border-b border-neutral-800/80 pb-3 flex items-center gap-2">
                            <Mail size={18} className="text-purple-400" />
                            <span>Customer Profile</span>
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Name</span>
                                <span className="text-sm font-semibold text-white mt-0.5 block">
                                    {order.customer ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}` : "Guest Customer"}
                                </span>
                            </div>
                            <div>
                                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Email</span>
                                <span className="text-sm text-neutral-300 mt-0.5 block break-all">{order.customer?.email || "No email"}</span>
                            </div>
                        </div>
                    </div>

                    {/* SHIPPING ADDRESS */}
                    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
                        <h3 className="font-semibold text-white border-b border-neutral-800/80 pb-3 flex items-center gap-2">
                            <MapPin size={18} className="text-purple-400" />
                            <span>Shipping Address</span>
                        </h3>
                        {order.shippingAddress ? (
                            <div className="text-neutral-300 text-sm space-y-1 leading-relaxed">
                                <p className="font-bold text-white">{order.shippingName || "No Name"}</p>
                                <p>{order.shippingAddress}</p>
                                <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                                <p>{order.shippingCountry || "US"}</p>
                            </div>
                        ) : (
                            <p className="text-xs text-neutral-500 italic">No shipping address provided.</p>
                        )}
                    </div>

                    {/* PAYMENT DETAILS */}
                    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
                        <h3 className="font-semibold text-white border-b border-neutral-800/80 pb-3 flex items-center gap-2">
                            <CreditCard size={18} className="text-purple-400" />
                            <span>Payment & History</span>
                        </h3>
                        <div className="space-y-4 text-xs md:text-sm">
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Payment Status</span>
                                    <span className={`inline-flex px-2 py-0.5 rounded font-bold text-xs mt-1
                                        ${order.paymentStatus === "PAID" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}
                                    `}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Paid At</span>
                                    <span className="text-neutral-300 block mt-1 font-medium">
                                        {order.paidAt ? new Date(order.paidAt).toLocaleString() : "Unpaid"}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Order Placed</span>
                                <span className="text-neutral-300 block mt-1 font-medium">
                                    {new Date(order.createdAt).toLocaleString()}
                                </span>
                            </div>

                            {order.stripeSessionId && (
                                <div>
                                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Stripe Session ID</span>
                                    <span className="font-mono text-neutral-400 text-xs block mt-1 truncate" title={order.stripeSessionId}>
                                        {order.stripeSessionId}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </div>
    )
}

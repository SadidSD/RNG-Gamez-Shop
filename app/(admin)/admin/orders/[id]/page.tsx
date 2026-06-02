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
    Loader2,
    CheckCircle,
    Edit,
    Trash2,
    Plus,
    Minus,
    X,
    ExternalLink
} from "lucide-react"

interface OrderItem {
    id: string
    productName: string
    variantSku: string | null
    quantity: number
    price: string
    variantId: string | null
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
    shippingName: string | null
    shippingAddress: string | null
    shippingCity: string | null
    shippingState: string | null
    shippingCountry: string | null
    shippingZip: string | null
    customer: Customer | null
    items: OrderItem[]
}

export default function OrderDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [statusUpdating, setStatusUpdating] = useState(false)
    const [newStatus, setNewStatus] = useState<Order["status"] | "">("")
    
    // Manual Fulfillment state
    const [trackingNumber, setTrackingNumber] = useState("")
    const [carrier, setCarrier] = useState("USPS")
    const [fulfilling, setFulfilling] = useState(false)

    // QC Editing state
    const [qcModalOpen, setQcModalOpen] = useState(false)
    const [editItems, setEditItems] = useState<{ variantId: string; productName: string; sku: string; price: number; quantity: number }[]>([])
    const [qcUpdating, setQcUpdating] = useState(false)

    const fetchOrder = async () => {
        setLoading(true)
        try {
            const token = Cookies.get("tcg-shop-token")
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setOrder(res.data)
            setNewStatus(res.data.status)
            setTrackingNumber(res.data.trackingNumber || "")
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

    const handleManualFulfillment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!trackingNumber) return
        setFulfilling(true)
        try {
            const token = Cookies.get("tcg-shop-token")
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`,
                { 
                    status: "SHIPPED", 
                    trackingNumber: trackingNumber.trim() 
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setOrder(res.data)
            alert("Order marked as Shipped and tracking details saved!")
        } catch (error) {
            console.error("Fulfillment failed:", error)
            alert("Failed to save shipping tracking. Please try again.")
        } finally {
            setFulfilling(false)
        }
    }

    // Initialize QC Edit Modal items
    const openQcModal = () => {
        if (!order) return
        const mapped = order.items.map(item => ({
            variantId: item.variantId || "",
            productName: item.productName,
            sku: item.variantSku || "N/A",
            price: Number(item.price),
            quantity: item.quantity
        })).filter(item => item.variantId !== "")
        setEditItems(mapped)
        setQcModalOpen(true)
    }

    const handleQtyChange = (variantId: string, diff: number) => {
        setEditItems(prev => 
            prev.map(item => {
                if (item.variantId === variantId) {
                    const newQty = Math.max(0, item.quantity + diff)
                    return { ...item, quantity: newQty }
                }
                return item
            })
        )
    }

    const handleRemoveItem = (variantId: string) => {
        setEditItems(prev => prev.filter(item => item.variantId !== variantId))
    }

    const saveQcAdjustments = async () => {
        setQcUpdating(true)
        try {
            const token = Cookies.get("tcg-shop-token")
            const formattedItems = editItems
                .filter(item => item.quantity > 0)
                .map(item => ({
                    variantId: item.variantId,
                    quantity: item.quantity
                }))

            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/items`,
                { items: formattedItems },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setOrder(res.data)
            setQcModalOpen(false)
            alert("QC order items adjustments successfully saved and synchronized!")
        } catch (error: any) {
            console.error("QC save failed:", error)
            alert(error.response?.data?.message || "Failed to save adjustments.")
        } finally {
            setQcUpdating(false)
        }
    }

    const qcTotal = editItems.reduce((acc, item) => acc + (item.price * item.quantity), 0)

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
                    
                    {/* MANUAL FULFILLMENT PANEL (Pirate Ship Workflow) */}
                    {order.status === "PAID" && (
                        <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
                            <div className="flex items-center gap-3 border-b border-neutral-800/80 pb-3">
                                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                                    <Truck size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Manual Fulfillment (Pirate Ship)</h3>
                                    <p className="text-xs text-neutral-400">Mark order as shipped by pasting the tracking number from Pirate Ship.</p>
                                </div>
                            </div>

                            <form onSubmit={handleManualFulfillment} className="flex flex-col md:flex-row gap-3 pt-2">
                                <div className="flex-1 flex flex-col gap-1.5">
                                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Carrier</label>
                                    <select 
                                        value={carrier}
                                        onChange={(e) => setCarrier(e.target.value)}
                                        className="bg-neutral-950 border border-neutral-800 text-white rounded-xl h-10 px-3 text-sm focus:border-purple-500 focus:outline-none"
                                    >
                                        <option value="USPS">USPS</option>
                                        <option value="UPS">UPS</option>
                                        <option value="FedEx">FedEx</option>
                                        <option value="DHL">DHL</option>
                                    </select>
                                </div>
                                <div className="flex-[2] flex flex-col gap-1.5">
                                    <label className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Tracking Number</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 9400100000000000000000"
                                        required
                                        value={trackingNumber}
                                        onChange={(e) => setTrackingNumber(e.target.value)}
                                        className="bg-neutral-950 border border-neutral-800 text-white rounded-xl h-10 px-4 text-sm focus:border-purple-500 focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={fulfilling || !trackingNumber}
                                    className="h-10 px-6 rounded-xl bg-white hover:bg-neutral-200 text-black text-sm font-bold transition-all flex items-center justify-center gap-1.5 self-end w-full md:w-auto"
                                >
                                    {fulfilling ? (
                                        <Loader2 size={16} className="animate-spin text-black" />
                                    ) : (
                                        <CheckCircle size={16} />
                                    )}
                                    <span>Fulfill Order</span>
                                </button>
                            </form>
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

                            <div className="bg-black/20 rounded-xl p-4 border border-neutral-800/40">
                                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Tracking Number ({carrier})</span>
                                <span className="font-mono text-sm font-bold text-white mt-1 block">{order.trackingNumber}</span>
                                <a 
                                    href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${order.trackingNumber}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="text-xs text-purple-400 hover:text-purple-300 font-medium inline-flex items-center gap-1 mt-2 transition-colors"
                                >
                                    <span>Track on Carrier Website</span>
                                    <ExternalLink size={12} />
                                </a>
                            </div>
                        </div>
                    )}

                    {/* ITEMS LIST */}
                    <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md space-y-4">
                        <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                            <h3 className="font-semibold text-white flex items-center gap-2">
                                <Package size={18} className="text-purple-400" />
                                <span>Items Ordered ({order.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                            </h3>

                            {/* QC Adjust button (only block completed/cancelled orders) */}
                            {["PENDING", "PAID"].includes(order.status) && (
                                <button
                                    onClick={openQcModal}
                                    className="h-8 px-3 rounded-lg border border-purple-500/30 bg-purple-950/20 hover:bg-purple-900/20 text-purple-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all"
                                >
                                    <Edit size={12} />
                                    <span>QC Adjust Items</span>
                                </button>
                            )}
                        </div>

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

            {/* QC EDIT MODAL */}
            {qcModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full flex flex-col backdrop-blur-md shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-neutral-800/80 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Edit className="text-purple-400" size={20} />
                                    <span>QC Quantity & Grade Adjustments</span>
                                </h3>
                                <p className="text-xs text-neutral-400 mt-1">
                                    Modify quantities, remove damaged cards, and re-compute order totals. Inventory counts will be updated.
                                </p>
                            </div>
                            <button
                                onClick={() => setQcModalOpen(false)}
                                className="h-9 w-9 rounded-xl border border-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Items list */}
                        <div className="p-6 overflow-y-auto max-h-[50vh] space-y-4">
                            {editItems.length === 0 ? (
                                <div className="py-10 text-center text-neutral-500 text-sm">
                                    No modifiable items found.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {editItems.map((item) => (
                                        <div 
                                            key={item.variantId} 
                                            className={`flex flex-col md:flex-row md:items-center justify-between p-4 bg-neutral-950/60 rounded-xl border border-neutral-800/80 gap-4 transition-all
                                                ${item.quantity === 0 ? "opacity-40 bg-red-950/5 border-red-500/10" : ""}
                                            `}
                                        >
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-white">{item.productName}</p>
                                                <p className="text-[10px] font-mono text-neutral-500 mt-0.5">SKU: {item.sku}</p>
                                                <p className="text-xs text-purple-400 font-bold mt-1">${item.price.toFixed(2)}</p>
                                            </div>

                                            {/* Count Adjustment controls */}
                                            <div className="flex items-center gap-4 justify-between md:justify-end">
                                                <div className="flex items-center bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden h-9">
                                                    <button
                                                        onClick={() => handleQtyChange(item.variantId, -1)}
                                                        className="w-9 h-full hover:bg-white/5 flex items-center justify-center text-neutral-400 transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="w-12 text-center text-sm font-bold text-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQtyChange(item.variantId, 1)}
                                                        className="w-9 h-full hover:bg-white/5 flex items-center justify-center text-neutral-400 transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveItem(item.variantId)}
                                                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white transition-colors"
                                                    title="Remove Item"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer / Total summary */}
                        <div className="p-6 border-t border-neutral-800/80 bg-neutral-950/20 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-center md:text-left">
                                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Adjusted Total</span>
                                <span className="text-xl font-black text-purple-400 mt-1 block">${qcTotal.toFixed(2)}</span>
                            </div>

                            <div className="flex gap-2 w-full md:w-auto">
                                <button
                                    onClick={() => setQcModalOpen(false)}
                                    className="flex-1 md:flex-none h-10 px-4 rounded-xl border border-neutral-800 hover:bg-neutral-800 text-xs font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveQcAdjustments}
                                    disabled={qcUpdating}
                                    className="flex-1 md:flex-none h-10 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-purple-500/20"
                                >
                                    {qcUpdating ? (
                                        <Loader2 size={14} className="animate-spin" />
                                    ) : (
                                        <CheckCircle size={14} />
                                    )}
                                    <span>Save QC Adjustments</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Cookies from "js-cookie"
import Link from "next/link"
import { 
    Search, 
    Eye, 
    CheckCircle2, 
    Truck, 
    TrendingUp, 
    Clock, 
    AlertCircle, 
    CheckSquare,
    Loader2,
    ShoppingBag
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
    customer: Customer | null
    items: OrderItem[]
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")

    const fetchOrders = async () => {
        setLoading(true)
        try {
            const token = Cookies.get("tcg-shop-token")
            const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setOrders(res.data)
            setFilteredOrders(res.data)
        } catch (error) {
            console.error("Failed to fetch orders:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    useEffect(() => {
        let result = orders

        // Search filter (number or email)
        if (searchTerm) {
            const term = searchTerm.toLowerCase()
            result = result.filter(order => 
                order.orderNumber.toString().includes(term) || 
                order.customer?.email.toLowerCase().includes(term) ||
                (order.customer?.firstName && order.customer.firstName.toLowerCase().includes(term)) ||
                (order.customer?.lastName && order.customer.lastName.toLowerCase().includes(term))
            )
        }

        // Status filter
        if (statusFilter !== "ALL") {
            result = result.filter(order => order.status === statusFilter)
        }

        setFilteredOrders(result)
    }, [searchTerm, statusFilter, orders])

    const handleUpdateStatus = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId)
        try {
            const token = Cookies.get("tcg-shop-token")
            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            // Update local state without full reload
            setOrders(prev => 
                prev.map(order => 
                    order.id === orderId 
                        ? { 
                            ...order, 
                            status: newStatus as any, 
                            paymentStatus: newStatus === "PAID" ? "PAID" : order.paymentStatus 
                          } 
                        : order
                )
            )
        } catch (error) {
            console.error("Failed to update status:", error)
            alert("Failed to update status. Please try again.")
        } finally {
            setUpdatingId(null)
        }
    }

    // Metrics calculations
    const totalRevenue = orders
        .filter(o => ["PAID", "SHIPPED", "COMPLETED"].includes(o.status))
        .reduce((sum, o) => sum + Number(o.total), 0)

    const pendingFulfillment = orders.filter(o => o.status === "PAID").length
    const pendingPayment = orders.filter(o => o.status === "PENDING").length

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
            {/* Page Title */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-white">Orders</h1>
                <p className="text-sm text-neutral-400 mt-1">Manage, fulfill, and track customer transactions.</p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-purple-500/10 pointer-events-none">
                        <TrendingUp size={80} />
                    </div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Total Sales</p>
                    <p className="text-3xl font-black text-white mt-2">${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="text-[10px] text-emerald-400 flex items-center gap-1 mt-2">
                        <span>Paid & Shipped orders</span>
                    </p>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-blue-500/10 pointer-events-none">
                        <Clock size={80} />
                    </div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Pending Fulfillment</p>
                    <p className="text-3xl font-black text-white mt-2">{pendingFulfillment}</p>
                    <p className="text-[10px] text-blue-400 flex items-center gap-1 mt-2">
                        <span>Requires shipping label</span>
                    </p>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-amber-500/10 pointer-events-none">
                        <AlertCircle size={80} />
                    </div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Pending Payment</p>
                    <p className="text-3xl font-black text-white mt-2">{pendingPayment}</p>
                    <p className="text-[10px] text-amber-400 flex items-center gap-1 mt-2">
                        <span>Checkout sessions active</span>
                    </p>
                </div>

                <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-emerald-500/10 pointer-events-none">
                        <CheckSquare size={80} />
                    </div>
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">Total Orders</p>
                    <p className="text-3xl font-black text-white mt-2">{orders.length}</p>
                    <p className="text-[10px] text-neutral-400 flex items-center gap-1 mt-2">
                        <span>Across all statuses</span>
                    </p>
                </div>
            </div>

            {/* Filter and search controls */}
            <div className="bg-neutral-900/20 border border-neutral-800/60 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between backdrop-blur-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" size={16} />
                    <input
                        type="text"
                        placeholder="Search by Order #, email, or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-neutral-950/60 border border-neutral-800/80 text-white placeholder:text-neutral-600 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 rounded-xl pl-10 pr-4 h-10 text-sm transition-all"
                    />
                </div>

                {/* Filter buttons */}
                <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
                    {["ALL", "PENDING", "PAID", "SHIPPED", "COMPLETED", "CANCELLED"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`
                                px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                                ${statusFilter === status 
                                    ? "bg-purple-600 text-white shadow-lg shadow-purple-500/10" 
                                    : "bg-neutral-900/50 text-neutral-400 hover:text-white border border-neutral-800/60"
                                }
                            `}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-3" />
                        <span className="text-sm">Fetching orders...</span>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-neutral-500 text-center px-4">
                        <ShoppingBag size={48} className="text-neutral-700 mb-3" />
                        <p className="text-base font-semibold text-neutral-300">No orders found</p>
                        <p className="text-xs text-neutral-500 mt-1">Try adjusting your filters or search terms.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-neutral-800/80 text-[10px] uppercase tracking-wider text-neutral-400 bg-neutral-900/50">
                                    <th className="py-4 px-6 font-bold">Order #</th>
                                    <th className="py-4 px-6 font-bold">Customer</th>
                                    <th className="py-4 px-6 font-bold">Date</th>
                                    <th className="py-4 px-6 font-bold text-center">Items</th>
                                    <th className="py-4 px-6 font-bold text-right">Total</th>
                                    <th className="py-4 px-6 font-bold text-center">Status</th>
                                    <th className="py-4 px-6 font-bold text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-800/40 text-sm">
                                {filteredOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="py-4 px-6 font-mono font-bold text-purple-400">
                                            #{order.orderNumber}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="font-semibold text-white">
                                                {order.customer ? `${order.customer.firstName || ""} ${order.customer.lastName || ""}` : "Guest Customer"}
                                            </div>
                                            <div className="text-xs text-neutral-400 mt-0.5 truncate max-w-[200px]">
                                                {order.customer?.email || "No email"}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-neutral-300">
                                            {new Date(order.createdAt).toLocaleDateString(undefined, { 
                                                month: "short", 
                                                day: "numeric", 
                                                year: "numeric" 
                                            })}
                                        </td>
                                        <td className="py-4 px-6 text-center text-neutral-300 font-semibold">
                                            {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                                        </td>
                                        <td className="py-4 px-6 text-right font-bold text-white">
                                            ${Number(order.total).toFixed(2)}
                                        </td>
                                        <td className="py-4 px-6 text-center">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyles(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/admin/orders/${order.id}`}
                                                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </Link>

                                                {/* Quick Actions */}
                                                {order.status === "PENDING" && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, "PAID")}
                                                        disabled={updatingId === order.id}
                                                        className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition-all disabled:opacity-50"
                                                        title="Mark Paid"
                                                    >
                                                        {updatingId === order.id ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <CheckCircle2 size={16} />
                                                        )}
                                                    </button>
                                                )}

                                                {order.status === "PAID" && (
                                                    <Link
                                                        href={`/admin/orders/${order.id}`}
                                                        className="p-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-400 hover:text-white transition-all"
                                                        title="Fulfill & Ship"
                                                    >
                                                        <Truck size={16} />
                                                    </Link>
                                                )}

                                                {order.status === "SHIPPED" && (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order.id, "COMPLETED")}
                                                        disabled={updatingId === order.id}
                                                        className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-all disabled:opacity-50"
                                                        title="Complete Order"
                                                    >
                                                        {updatingId === order.id ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <CheckCircle2 size={16} />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

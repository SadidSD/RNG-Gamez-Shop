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
    ShoppingBag,
    Printer,
    X
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

    // Batch Actions & Pull List Modal State
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [pullListOpen, setPullListOpen] = useState(false)
    const [pullListItems, setPullListItems] = useState<any[]>([])
    const [pullListLoading, setPullListLoading] = useState(false)

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

    // Clear selection when filter changes
    useEffect(() => {
        setSelectedIds([])
    }, [statusFilter])

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

    const generatePullList = async () => {
        if (selectedIds.length === 0) return
        setPullListLoading(true)
        setPullListOpen(true)
        try {
            const token = Cookies.get("tcg-shop-token")
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/orders/pull-list?ids=${selectedIds.join(",")}`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setPullListItems(res.data)
        } catch (error) {
            console.error("Failed to generate pull list:", error)
            alert("Failed to generate pull list.")
            setPullListOpen(false)
        } finally {
            setPullListLoading(false)
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
        <div className="space-y-8 print:hidden">
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
                        <span>Requires pulling & shipping</span>
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

            {/* Batch Action Bar */}
            {selectedIds.length > 0 && (
                <div className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-200">
                    <div className="flex items-center gap-3">
                        <CheckSquare className="text-purple-400" size={20} />
                        <span className="text-sm font-semibold text-purple-200">{selectedIds.length} orders selected</span>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={generatePullList}
                            className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-purple-500/20"
                        >
                            <Printer size={14} />
                            <span>Generate Pull List</span>
                        </button>
                        <button
                            onClick={() => setSelectedIds([])}
                            className="h-9 px-4 rounded-xl border border-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-white text-xs font-semibold transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

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
                                    <th className="py-4 px-4 w-12 text-center">
                                        <input
                                            type="checkbox"
                                            checked={filteredOrders.length > 0 && selectedIds.length === filteredOrders.length}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(filteredOrders.map(o => o.id))
                                                } else {
                                                    setSelectedIds([])
                                                }
                                            }}
                                            className="rounded border-neutral-800 text-purple-600 focus:ring-purple-500 bg-neutral-950 cursor-pointer"
                                        />
                                    </th>
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
                                        <td className="py-4 px-4 text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(order.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedIds(prev => [...prev, order.id])
                                                    } else {
                                                        setSelectedIds(prev => prev.filter(id => id !== order.id))
                                                    }
                                                }}
                                                className="rounded border-neutral-800 text-purple-600 focus:ring-purple-500 bg-neutral-950 cursor-pointer"
                                            />
                                        </td>
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

            {/* Pull List Overlay (Printable Modal) */}
            {pullListOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto print:fixed print:inset-0 print:p-0 print:bg-white print:backdrop-blur-none">
                    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-4xl w-full max-h-[85vh] flex flex-col backdrop-blur-md shadow-2xl overflow-hidden print:border-none print:bg-white print:max-h-none print:shadow-none print:w-full">
                        {/* Header */}
                        <div className="p-6 border-b border-neutral-800/80 flex items-center justify-between print:hidden">
                            <div>
                                <h3 className="text-lg font-bold text-white">Batch Pull List (Pick List)</h3>
                                <p className="text-xs text-neutral-400 mt-1">Aggregated and sorted for inventory box retrieval.</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => window.print()}
                                    className="h-9 px-4 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-bold transition-all flex items-center gap-1.5"
                                >
                                    <Printer size={14} />
                                    <span>Print List</span>
                                </button>
                                <button
                                    onClick={() => setPullListOpen(false)}
                                    className="h-9 w-9 rounded-xl border border-neutral-850 hover:bg-neutral-800 text-neutral-400 hover:text-white flex items-center justify-center transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        {/* Printable Content */}
                        <div className="p-6 overflow-y-auto flex-1 print:p-0 print:overflow-visible print:text-black">
                            {pullListLoading ? (
                                <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
                                    <Loader2 className="h-8 w-8 animate-spin text-purple-500 mb-3" />
                                    <span>Aggregating pull list data...</span>
                                </div>
                            ) : pullListItems.length === 0 ? (
                                <div className="py-20 text-center text-neutral-500">
                                    No cards to pull.
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Print Title Header */}
                                    <div className="hidden print:block mb-6 border-b border-neutral-300 pb-3">
                                        <h1 className="text-xl font-bold tracking-wider text-black">RNG GAMEZ — COMBINED PULL LIST</h1>
                                        <div className="flex justify-between items-center text-[10px] text-neutral-500 mt-1">
                                            <span>Generated: {new Date().toLocaleString()}</span>
                                            <span>Orders Included: {selectedIds.length}</span>
                                        </div>
                                    </div>

                                    <div className="border border-neutral-800 print:border-black rounded-xl overflow-hidden print:rounded-none">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead>
                                                <tr className="bg-neutral-950 text-neutral-400 uppercase tracking-wider font-bold text-[10px] border-b border-neutral-800 print:bg-neutral-100 print:text-black print:border-black">
                                                    <th className="py-3 px-4">Game</th>
                                                    <th className="py-3 px-4">Set Name</th>
                                                    <th className="py-3 px-4">Card Name</th>
                                                    <th className="py-3 px-4 text-center">Cond / Foil</th>
                                                    <th className="py-3 px-4 text-center">SKU</th>
                                                    <th className="py-3 px-4 text-center">Box Location</th>
                                                    <th className="py-3 px-4 text-right">Pull Qty</th>
                                                    <th className="py-3 px-4 text-center print:table-cell hidden w-16">Pulled</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-800 print:divide-neutral-300 text-neutral-300 print:text-black">
                                                {pullListItems.map((item) => (
                                                    <tr key={item.variantId} className="hover:bg-white/[0.01] print:bg-white print:border-b print:border-neutral-200">
                                                        <td className="py-3 px-4 font-bold text-white print:text-black uppercase">{item.game}</td>
                                                        <td className="py-3 px-4 font-medium text-neutral-300 print:text-black">{item.set}</td>
                                                        <td className="py-3 px-4 font-semibold text-white print:text-black">{item.productName}</td>
                                                        <td className="py-3 px-4 text-center font-medium">
                                                            <span className="text-purple-300 print:text-black">{item.condition}</span>
                                                            {item.isFoil && <span className="ml-1 text-[9px] bg-purple-500/20 text-purple-300 font-bold px-1 py-0.5 rounded print:border print:border-black print:text-black">FOIL</span>}
                                                        </td>
                                                        <td className="py-3 px-4 text-center font-mono text-[10px] text-neutral-500 print:text-black">{item.sku}</td>
                                                        <td className="py-3 px-4 text-center text-emerald-400 print:text-black font-semibold">{item.location}</td>
                                                        <td className="py-3 px-4 text-right font-black text-white print:text-black text-sm">{item.quantity}</td>
                                                        <td className="py-3 px-4 text-center print:table-cell hidden">
                                                            <div className="w-4 h-4 border border-black rounded mx-auto" />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-neutral-400 print:text-black pt-4">
                                        <span>Items pulled match sorting box structure NM $\rightarrow$ LP $\rightarrow$ MP.</span>
                                        <span className="font-bold text-white print:text-black">
                                            Total Cards: {pullListItems.reduce((acc, item) => acc + item.quantity, 0)}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

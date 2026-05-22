"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { CreditCard, Package, Settings, LogOut, Loader2 } from "lucide-react";
import UserOrdersTab from "@/components/account/UserOrdersTab";
import UserBuylistTab from "@/components/account/UserBuylistTab";

export default function AccountPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("profile");

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
            </div>
        );
    }

    if (!user) {
        // Redirect or show login message
        if (typeof window !== 'undefined') {
            router.push('/login');
        }
        return null;
    }

    return (
        <div className="min-h-screen pt-28 pb-20 bg-black relative">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-purple-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ fontFamily: 'Europa Grotesk SH' }}>
                        My Account
                    </h1>
                    <p className="text-gray-400">Manage your orders, buylist offers, and store credit.</p>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sticky top-32">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab("profile")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                        activeTab === "profile" ? "bg-purple-500/20 text-purple-300 font-medium border border-purple-500/20" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                                    }`}
                                >
                                    <Settings size={18} />
                                    Profile Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                        activeTab === "orders" ? "bg-purple-500/20 text-purple-300 font-medium border border-purple-500/20" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                                    }`}
                                >
                                    <Package size={18} />
                                    Order History
                                </button>
                                <button
                                    onClick={() => setActiveTab("buylist")}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                                        activeTab === "buylist" ? "bg-purple-500/20 text-purple-300 font-medium border border-purple-500/20" : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                                    }`}
                                >
                                    <CreditCard size={18} />
                                    Buylist History
                                </button>
                                <hr className="border-white/10 my-4" />
                                <button
                                    onClick={logout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                    <LogOut size={18} />
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-grow">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 min-h-[400px]">
                            {activeTab === "profile" && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="border-b border-white/10 pb-6 mb-6">
                                        <h2 className="text-2xl font-semibold text-white mb-6">Profile Information</h2>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                                                <div className="text-lg text-white bg-black/20 p-3 rounded-lg border border-white/5">{user.email}</div>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Role</label>
                                                <div className="text-lg text-white bg-black/20 p-3 rounded-lg border border-white/5 capitalize">{user.role.toLowerCase()}</div>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">First Name</label>
                                                <div className="text-lg text-white bg-black/20 p-3 rounded-lg border border-white/5">{user.firstName || "Not provided"}</div>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                                                <div className="text-lg text-white bg-black/20 p-3 rounded-lg border border-white/5">{user.lastName || "Not provided"}</div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <h2 className="text-2xl font-semibold text-white mb-6">Financials</h2>
                                        <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between">
                                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center text-green-400">
                                                    <CreditCard size={24} />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">Available Store Credit</h3>
                                                    <p className="text-sm text-gray-400">Can be used automatically during checkout</p>
                                                </div>
                                            </div>
                                            <div className="text-3xl font-bold text-green-400 tracking-tight">
                                                ${(user.creditBalance || 0).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "orders" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <h2 className="text-2xl font-semibold text-white mb-2">Order History</h2>
                                    <p className="text-gray-400 mb-6">View and track your recent orders.</p>
                                    <UserOrdersTab />
                                </div>
                            )}

                            {activeTab === "buylist" && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <h2 className="text-2xl font-semibold text-white mb-2">Buylist Offers</h2>
                                    <p className="text-gray-400 mb-6">Track the status of your submitted cards.</p>
                                    <UserBuylistTab />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

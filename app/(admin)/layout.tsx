"use client"

import { useAuth } from "@/context/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import axios from "axios"
import Cookies from "js-cookie"
import { 
    LayoutDashboard, 
    ShoppingBag, 
    Package, 
    Coins, 
    Calendar, 
    Users, 
    ArrowLeft, 
    Loader2,
    Menu,
    X,
    LogOut,
    KeyRound,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertCircle
} from "lucide-react"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading, logout } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Password change modal state
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrentPw, setShowCurrentPw] = useState(false)
    const [showNewPw, setShowNewPw] = useState(false)
    const [showConfirmPw, setShowConfirmPw] = useState(false)
    const [pwLoading, setPwLoading] = useState(false)
    const [pwError, setPwError] = useState("")
    const [pwSuccess, setPwSuccess] = useState("")

    const resetPasswordForm = () => {
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setShowCurrentPw(false)
        setShowNewPw(false)
        setShowConfirmPw(false)
        setPwError("")
        setPwSuccess("")
    }

    const handlePasswordChange = async () => {
        setPwError("")
        setPwSuccess("")

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPwError("All fields are required.")
            return
        }
        if (newPassword.length < 6) {
            setPwError("New password must be at least 6 characters.")
            return
        }
        if (newPassword !== confirmPassword) {
            setPwError("New passwords do not match.")
            return
        }
        if (currentPassword === newPassword) {
            setPwError("New password must be different from current password.")
            return
        }

        setPwLoading(true)
        try {
            const token = Cookies.get("tcg-shop-token")
            await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setPwSuccess("Password updated successfully!")
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
            setTimeout(() => {
                setShowPasswordModal(false)
                resetPasswordForm()
            }, 2000)
        } catch (err: any) {
            const msg = err?.response?.data?.message
            if (msg === "Invalid current password") {
                setPwError("The current password you entered is incorrect.")
            } else {
                setPwError(msg || "Failed to update password. Please try again.")
            }
        } finally {
            setPwLoading(false)
        }
    }

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/login")
            } else if (!["ADMIN", "STAFF", "OWNER"].includes(user.role)) {
                router.push("/")
            }
        }
    }, [user, loading, router])

    if (loading || !user || !["ADMIN", "STAFF", "OWNER"].includes(user.role)) {
        return (
            <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#09090B] text-white">
                <Loader2 className="h-10 w-10 animate-spin text-purple-500 mb-4" />
                <p className="text-sm text-neutral-400 tracking-wide">Securing admin environment...</p>
            </div>
        )
    }

    const navigation = [
        { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Buylist", href: "#", icon: Coins, disabled: true },
        { name: "Events", href: "#", icon: Calendar, disabled: true },
        { name: "Customers", href: "#", icon: Users, disabled: true },
    ]

    return (
        <div className="min-h-screen bg-[#09090B] text-white font-sans flex flex-col lg:flex-row relative">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none z-0" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none z-0" />

            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-neutral-900/40 border-b border-neutral-800/80 backdrop-blur-md sticky top-0 z-40 w-full">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-black tracking-widest uppercase">RNG ADMIN</span>
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {user.role}
                    </span>
                </div>
                <button 
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="p-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 text-white transition-colors"
                >
                    {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </header>

            {/* Sidebar (Desktop & Mobile Drawer) */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-neutral-900/60 border-r border-neutral-800/80 backdrop-blur-xl flex flex-col justify-between p-6 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen lg:flex
                ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>
                <div className="space-y-8">
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-black tracking-widest text-white uppercase">RNG GAMEZ</h2>
                            <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest mt-1">Management Portal</p>
                        </div>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1 rounded-lg hover:bg-neutral-800 text-neutral-400"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="space-y-1.5">
                        {navigation.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname.startsWith(item.href) && item.href !== "#"
                            return (
                                <Link
                                    key={item.name}
                                    href={item.disabled ? "#" : item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`
                                        group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                                        ${isActive 
                                            ? "bg-purple-600/20 text-purple-200 border border-purple-500/20 shadow-md shadow-purple-500/5" 
                                            : "text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent"
                                        }
                                        ${item.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                    `}
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} className={isActive ? "text-purple-400" : "text-neutral-400 group-hover:text-white transition-colors"} />
                                        <span>{item.name}</span>
                                    </div>
                                    {item.disabled && (
                                        <span className="text-[8px] font-semibold tracking-wider text-neutral-500 bg-neutral-800 px-1.5 py-0.5 rounded uppercase">
                                            Store
                                        </span>
                                    )}
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="space-y-4 pt-6 border-t border-neutral-800/80">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-300 font-bold border border-purple-500/20">
                            {user.email[0].toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-white truncate">{user.email}</p>
                            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-0.5">{user.role}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => { resetPasswordForm(); setShowPasswordModal(true); setSidebarOpen(false); }}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all w-full text-left"
                    >
                        <KeyRound size={14} />
                        <span>Change Password</span>
                    </button>

                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-all w-full"
                    >
                        <ArrowLeft size={14} />
                        <span>Back to Storefront</span>
                    </Link>

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full text-left"
                    >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div 
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div onClick={() => { setShowPasswordModal(false); resetPasswordForm(); }} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative w-full max-w-md mx-4 bg-neutral-900 border border-neutral-700/80 rounded-2xl p-6 md:p-8 shadow-2xl shadow-purple-500/5">
                        <button
                            onClick={() => { setShowPasswordModal(false); resetPasswordForm(); }}
                            className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-purple-600/20 flex items-center justify-center">
                                <KeyRound size={20} className="text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Change Password</h3>
                                <p className="text-xs text-neutral-400">Update your admin account password</p>
                            </div>
                        </div>

                        {pwSuccess && (
                            <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 text-green-300 text-sm rounded-xl px-4 py-3 mb-4">
                                <CheckCircle2 size={16} />
                                {pwSuccess}
                            </div>
                        )}

                        {pwError && (
                            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-300 text-sm rounded-xl px-4 py-3 mb-4">
                                <AlertCircle size={16} />
                                {pwError}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Current Password */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPw ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        placeholder="Enter current password"
                                        className="w-full bg-neutral-800/50 border border-neutral-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                                    >
                                        {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNewPw ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Enter new password (min 6 chars)"
                                        className="w-full bg-neutral-800/50 border border-neutral-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPw(!showNewPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                                    >
                                        {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-xs font-medium text-neutral-400 mb-1.5">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPw ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter new password"
                                        className="w-full bg-neutral-800/50 border border-neutral-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                                    >
                                        {showConfirmPw ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => { setShowPasswordModal(false); resetPasswordForm(); }}
                                className="flex-1 px-4 py-3 rounded-xl text-sm font-medium text-neutral-400 bg-neutral-800/50 border border-neutral-700/50 hover:bg-neutral-800 hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordChange}
                                disabled={pwLoading || !!pwSuccess}
                                className="flex-1 px-4 py-3 rounded-xl text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {pwLoading ? (
                                    <>
                                        <Loader2 size={14} className="animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-8 lg:p-10 z-10 overflow-x-hidden relative">
                {children}
            </main>
        </div>
    )
}


"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SearchBox from "./SearchBox";
import { useAuth } from "@/context/AuthContext";
import { useShopCart } from "@/context/ShopCartContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { openCart, items } = useShopCart();

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
    const isAdmin = user && ["ADMIN", "STAFF", "OWNER"].includes(user.role);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== "undefined") {
                if (window.scrollY > lastScrollY && window.scrollY > 80) {
                    setIsVisible(false);
                    setMobileMenuOpen(false); // close menu on scroll-hide
                } else {
                    setIsVisible(true);
                }
                setLastScrollY(window.scrollY);
            }
        };

        if (typeof window !== "undefined") {
            window.addEventListener("scroll", controlNavbar);
            return () => window.removeEventListener("scroll", controlNavbar);
        }
    }, [lastScrollY]);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [mobileMenuOpen]);

    const navLinks = [
        { name: "Singles", href: "/singles" },
        { name: "Buylist", href: "/buylist" },
        { name: "Sealed", href: "/sealed" },
        { name: "Sets", href: "/sets" },
        { name: "Formats", href: "/shop" },
        { name: "Events", href: "/events" },
        { name: "New Arrivals", href: "/shop?sort=newest" },
    ];

    return (
        <>
            {/* Free Shipping Announcement Bar */}
            <div className={`fixed top-0 left-0 right-0 z-[60] transition-transform duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"}`}>
                <div className="bg-gradient-to-r from-purple-700 via-purple-600 to-purple-700 text-white text-center py-2 px-4 text-xs sm:text-sm font-medium tracking-wide flex items-center justify-center gap-2">
                    <span>🚚</span>
                    <span>FREE SHIPPING on orders over <strong>$75</strong> — Flat rate <strong>$4.99</strong> under $75 · NJ Sales Tax (6.625%) applied at checkout</span>
                </div>
            </div>

            <nav
                className={`fixed top-[33px] left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 py-2 bg-purple-900/20 backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${
                    isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
            >
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/">
                        <Image
                            src="/RNG-logo.png"
                            alt="RNG Logo"
                            width={72}
                            height={28}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Desktop Navigation Links */}
                <div className="hidden lg:flex items-center gap-5">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-colors ${
                                link.name === "Buylist"
                                    ? "px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
                                    : "text-gray-200 hover:text-white"
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-4 text-white">
                    {/* Desktop Search */}
                    <div className="w-64 xl:w-80 hidden lg:block">
                        <SearchBox />
                    </div>

                    <div className="flex items-center gap-2 md:gap-3">
                        {/* Cart Button */}
                        <button
                            className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
                            onClick={openCart}
                            aria-label="Open cart"
                        >
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                    {cartCount}
                                </span>
                            )}
                        </button>

                        {/* Desktop User Menu */}
                        {user ? (
                            <div className="hidden lg:flex items-center gap-3">
                                <div className="flex flex-col items-end">
                                    <span className="text-xs text-purple-300 font-semibold uppercase tracking-wider">
                                        Store Credit
                                    </span>
                                    <span className="text-sm font-bold text-green-400">
                                        ${(user.creditBalance || 0).toFixed(2)}
                                    </span>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                            <User size={20} />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56 bg-black/95 backdrop-blur-xl border border-white/10 text-white rounded-xl shadow-2xl p-2 z-[100]">
                                        <div className="px-2 py-2 mb-1 border-b border-white/10">
                                            <p className="text-xs text-purple-300 font-semibold uppercase tracking-wider mb-1">Signed in as</p>
                                            <p className="text-sm font-medium truncate">{user.email}</p>
                                        </div>
                                        {isAdmin && (
                                            <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-white/10 focus:text-white transition-colors p-0 mt-1">
                                                <Link href="/admin/orders" className="w-full px-2 py-1.5 font-semibold text-purple-300">Admin Dashboard</Link>
                                            </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem className="cursor-pointer rounded-lg focus:bg-white/10 focus:text-white transition-colors p-0 mt-1">
                                            <Link href="/account" className="w-full px-2 py-1.5">My Account</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={logout} className="cursor-pointer rounded-lg text-red-400 focus:bg-red-500/20 focus:text-red-300 transition-colors mt-1">
                                            Logout
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden lg:inline-flex px-4 py-1.5 text-sm font-semibold rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                Sign In
                            </Link>
                        )}

                        {/* Mobile Hamburger */}
                        <button
                            className="lg:hidden p-2 rounded-full hover:bg-white/10 transition-colors"
                            onClick={() => setMobileMenuOpen((v) => !v)}
                            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Mobile Overlay Menu ── */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            className="fixed top-0 right-0 bottom-0 z-50 w-[85vw] max-w-sm bg-gradient-to-b from-purple-950/95 to-black/95 backdrop-blur-xl border-l border-white/10 flex flex-col lg:hidden overflow-y-auto"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
                                <Image
                                    src="/RNG-logo.png"
                                    alt="RNG Logo"
                                    width={64}
                                    height={26}
                                    className="object-contain"
                                />
                                <button
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="p-2 rounded-full hover:bg-white/10 transition-colors text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Search */}
                            <div className="px-6 pt-5 pb-4">
                                <SearchBox />
                            </div>

                            {/* Store Credit (if logged in) */}
                            {user && (
                                <div className="mx-6 mb-4 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500/10 to-teal-500/10 border border-green-500/20 flex items-center justify-between">
                                    <span className="text-sm text-gray-300">Store Credit</span>
                                    <span className="font-bold text-green-400 text-lg">
                                        ${(user.creditBalance || 0).toFixed(2)}
                                    </span>
                                </div>
                            )}

                            {/* Nav Links */}
                            <nav className="flex-1 px-6 py-2 space-y-1">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 + 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
                                                link.name === "Buylist"
                                                    ? "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
                                                    : "text-gray-300 hover:text-white hover:bg-white/5"
                                            }`}
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            {/* Bottom Auth */}
                            <div className="px-6 py-6 border-t border-white/10">
                                {user ? (
                                    <div className="space-y-3">
                                        <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">
                                            Signed in as
                                        </p>
                                        <p className="text-sm text-white font-medium truncate">
                                            {user.email}
                                        </p>
                                        <div className="space-y-2 pt-1">
                                            {isAdmin && (
                                                <Link
                                                    href="/admin/orders"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="block w-full text-center px-4 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-colors"
                                                >
                                                    Admin Dashboard
                                                </Link>
                                            )}
                                            <div className="flex gap-3">
                                                <Link
                                                    href="/account"
                                                    onClick={() => setMobileMenuOpen(false)}
                                                    className="flex-1 text-center px-4 py-2.5 rounded-xl bg-purple-600/30 text-purple-200 text-sm font-semibold hover:bg-purple-600/50 transition-colors"
                                                >
                                                    My Account
                                                </Link>
                                                <button
                                                    onClick={() => {
                                                        logout();
                                                        setMobileMenuOpen(false);
                                                    }}
                                                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 text-sm font-semibold hover:bg-red-500/20 transition-colors"
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <Link
                                            href="/login"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex-1 text-center px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                                        >
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setMobileMenuOpen(false)}
                                            className="flex-1 text-center px-4 py-3 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/5 transition-colors"
                                        >
                                            Register
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

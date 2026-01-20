import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, User, ChevronDown } from "lucide-react";
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
    const { user, logout } = useAuth();
    const { openCart, items } = useShopCart();

    const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY) { // if scroll down hide the navbar
                    setIsVisible(false);
                } else { // if scroll up show the navbar
                    setIsVisible(true);
                }

                // remember current page location to use in the next move
                setLastScrollY(window.scrollY);
            }
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('scroll', controlNavbar);

            // cleanup function
            return () => {
                window.removeEventListener('scroll', controlNavbar);
            };
        }
    }, [lastScrollY]);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Grading Cards", href: "/shop?category=Graded Cards" },
        { name: "Buylist", href: "/buylist" },
        { name: "Magic The Gathering", href: "/shop?category=Magic: The Gathering" },
        { name: "Pokemon", href: "/shop?category=Pokemon" },
        { name: "Events", href: "/events" },
    ];

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-2 bg-purple-900/20 backdrop-blur-md border-b border-white/10 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                {/* Logo */}
                <div className="flex items-center">
                    <Link href="/">
                        <Image
                            src="/RNG-logo.png"
                            alt="RNG Logo"
                            width={80}
                            height={32}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Navigation Links */}
                <div className="hidden md:flex items-center gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${link.name === "Buylist"
                                ? "bg-purple-500/20 text-purple-200 hover:bg-purple-500/30"
                                : "text-gray-200 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <button className="flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium text-gray-200 hover:bg-white/10 hover:text-white transition-colors">
                        Others <ChevronDown size={16} />
                    </button>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-4 text-white">
                    <div className="w-64">
                        <SearchBox />
                    </div>
                    <button
                        className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
                        onClick={openCart}
                    >
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                                    <User size={20} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem className="font-semibold">{user.email}</DropdownMenuItem>
                                <DropdownMenuItem><Link href="/account">My Account</Link></DropdownMenuItem>
                                <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login" className="p-2 rounded-full hover:bg-white/10 transition-colors">
                            <span className="text-sm font-semibold">Sign In</span>
                        </Link>
                    )}
                </div>
            </nav>
        </>
    );
}

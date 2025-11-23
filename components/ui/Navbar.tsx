import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingCart, User, ChevronDown } from "lucide-react";

export default function Navbar() {
    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Grading Cards", href: "/grading" },
        { name: "Buylist", href: "/buylist" },
        { name: "Magic The Gathering", href: "/mtg" },
        { name: "Pokémon", href: "/pokemon" },
        { name: "Events", href: "/events" },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-2 bg-purple-900/20 backdrop-blur-md border-b border-white/10">
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
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <Search size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <ShoppingCart size={20} />
                </button>
                <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <User size={20} />
                </button>
            </div>
        </nav>
    );
}

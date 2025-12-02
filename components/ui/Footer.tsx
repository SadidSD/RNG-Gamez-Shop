import React from 'react';
import { Instagram, Facebook, Twitter, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="w-full bg-[#050511] text-white py-16 px-6 md:px-20">
            <div className="max-w-7xl mx-auto">
                {/* Top Section: Newsletter */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-20">
                    <div className="max-w-xl">
                        <h2 className="text-5xl md:text-6xl font-bold leading-tight">
                            Subscribe to Our Newsletter
                        </h2>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative w-full md:w-[400px]">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full bg-transparent border border-gray-600 rounded-full py-4 px-6 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                                suppressHydrationWarning
                            />
                        </div>
                        <button className="bg-[#B266FF] hover:bg-[#9e4df5] text-black font-medium py-4 px-8 rounded-full flex items-center gap-2 transition-colors">
                            Subscribe
                            <div className="bg-black rounded-full p-1">
                                <ArrowUpRight className="w-4 h-4 text-white" />
                            </div>
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-gray-800 mb-8" />

                {/* Bottom Section */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-gray-400">
                    <div>
                        © 2025 RNG-Gamez. All rights reserved.
                    </div>

                    <div className="flex items-center gap-6">
                        <Link href="#" className="p-2 border border-gray-600 rounded-full hover:border-white hover:text-white transition-colors">
                            <Instagram className="w-5 h-5" />
                        </Link>
                        <Link href="#" className="p-2 border border-gray-600 rounded-full hover:border-white hover:text-white transition-colors">
                            <Facebook className="w-5 h-5" />
                        </Link>
                        {/* TikTok Icon (using SVG as it might not be in all lucide versions or just generic) */}
                        <Link href="#" className="p-2 border border-gray-600 rounded-full hover:border-white hover:text-white transition-colors">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-music-2"
                            >
                                <path d="M9 18V5l12-2v13" />
                                <circle cx="6" cy="18" r="3" />
                                <circle cx="18" cy="16" r="3" />
                            </svg>
                        </Link>
                        <Link href="#" className="p-2 border border-gray-600 rounded-full hover:border-white hover:text-white transition-colors">
                            <Twitter className="w-5 h-5" /> {/* Using Twitter for X */}
                        </Link>
                    </div>

                    <div>
                        <Link href="#" className="hover:text-white transition-colors">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

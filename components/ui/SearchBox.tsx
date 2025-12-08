import { Search } from "lucide-react";

export default function SearchBox() {
    return (
        <div className="relative w-full max-w-md group">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur opacity-30 group-hover:opacity-60 transition duration-500"></div>

            {/* Glass Container */}
            <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-full shadow-sm transition-all duration-300 hover:bg-white/15">
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full bg-transparent border-none outline-none text-white text-sm placeholder-white/50 px-4 py-2 font-['Europa_Grotesk_SH'] tracking-wide"
                    style={{ fontFamily: 'Europa Grotesk SH' }}
                />
                <div className="pr-2">
                    <button className="flex items-center justify-center p-1.5 rounded-full bg-white/10 border border-white/10 text-white/70 hover:bg-white/20 transition-colors cursor-pointer">
                        <Search className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

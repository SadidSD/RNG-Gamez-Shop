import { Search } from "lucide-react";

export default function SearchBox() {
    return (
        <div className="relative w-full max-w-3xl group">
            {/* Glow Effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>

            {/* Glass Container */}
            <div className="relative flex items-center bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all duration-300 hover:bg-white/15">
                <Search className="w-8 h-8 text-white/70 ml-6" />
                <input
                    type="text"
                    placeholder="Search for cards, sets, or products..."
                    className="w-full bg-transparent border-none outline-none text-white text-2xl placeholder-white/50 px-6 py-6 font-['Europa_Grotesk_SH'] tracking-wide"
                    style={{ fontFamily: 'Europa Grotesk SH' }}
                />
                <div className="pr-4">
                    <button className="hidden md:flex items-center justify-center p-2 rounded-lg bg-white/10 border border-white/10 text-white/70 hover:bg-white/20 transition-colors cursor-pointer">
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

import { Metadata } from 'next';
import SetsGallery from '@/components/sets/SetsGallery';

export const metadata: Metadata = {
    title: 'Magic: The Gathering Sets | RNG Gamez',
    description: 'Browse all Magic: The Gathering sets with official set symbols and icons.',
};

export default function SetsPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <h1 className="text-5xl font-bold font-heading mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Explore Magic Sets
                </h1>
                <p className="text-gray-400 text-lg">
                    Discover every Magic: The Gathering set with official symbols and release information
                </p>
            </div>

            {/* Sets Gallery */}
            <SetsGallery />
        </div>
    );
}

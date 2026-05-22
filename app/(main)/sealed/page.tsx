import { Metadata } from 'next';
import SealedProductsGallery from '@/components/sealed/SealedProductsGallery';

export const metadata: Metadata = {
    title: 'Sealed Products | RNG Gamez',
    description: 'Browse booster boxes, bundles, collector editions, and preconstructed decks for Magic: The Gathering.',
};

export default function SealedPage() {
    return (
        <div className="min-h-screen pt-24 pb-16">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 mb-10">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                    <span className="inline-block w-2 h-2 rounded-sm bg-purple-500" />
                    <span>Collections</span>
                    <span>/</span>
                    <span className="text-purple-600 font-medium">Sealed Products</span>
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight mb-3 text-gray-900" style={{ fontFamily: 'Europa Grotesk SH, sans-serif' }}>
                    Sealed <span className="text-purple-500">Products</span>
                </h1>
                <p className="text-gray-500 text-lg max-w-xl">
                    Booster boxes, bundles, collector editions, and preconstructed decks — factory sealed and ready to open.
                </p>
            </div>

            {/* Gallery */}
            <SealedProductsGallery />
        </div>
    );
}

/** @type {import('next').NextConfig} */
// Allowed Image Domains: Scryfall, PokemonTCG, YouTube, Backend
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.youtube.com',
            },
            {
                protocol: 'https',
                hostname: 'cards.scryfall.io',
            },
            {
                protocol: 'https',
                hostname: 'images.pokemontcg.io',
            },
            {
                protocol: 'https',
                hostname: '*.onrender.com',
            }
        ],
    },
};

export default nextConfig;

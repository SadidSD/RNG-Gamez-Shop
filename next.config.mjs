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
                hostname: 'rng-game-backend-cx6f.onrender.com',
            }
        ],
    },
};

export default nextConfig;

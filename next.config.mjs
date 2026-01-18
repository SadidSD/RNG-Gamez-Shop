/** @type {import('next').NextConfig} */
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
                hostname: 'rng-game-backend-production.up.railway.app',
            }
        ],
    },
};

export default nextConfig;

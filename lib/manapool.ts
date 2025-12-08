// Manapool API Client
// This is a placeholder implementation. Update with actual Manapool API endpoints and authentication.

import { Game, Card } from '@/types';

// const MANAPOOL_API_BASE = process.env.NEXT_PUBLIC_MANAPOOL_API_URL || 'https://api.manapool.com';
// const MANAPOOL_API_KEY = process.env.NEXT_PUBLIC_MANAPOOL_API_KEY || '';

// Cache for games data
let gamesCache: Game[] | null = null;
let gamesCacheTime: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetch available card games from Manapool API
 */
export async function fetchGames(): Promise<Game[]> {
    // Return cached data if still valid
    if (gamesCache && Date.now() - gamesCacheTime < CACHE_DURATION) {
        return gamesCache;
    }

    try {
        // TODO: Replace with actual Manapool API endpoint
        // const response = await fetch(`${MANAPOOL_API_BASE}/games`, {
        //   headers: {
        //     'Authorization': `Bearer ${MANAPOOL_API_KEY}`,
        //     'Content-Type': 'application/json',
        //   },
        // });

        // if (!response.ok) {
        //   throw new Error(`Failed to fetch games: ${response.statusText}`);
        // }

        // const data = await response.json();
        // gamesCache = data.games;
        // gamesCacheTime = Date.now();
        // return gamesCache;

        // Temporary mock data until API is integrated
        const mockGames: Game[] = [
            { id: 'mtg', name: 'Magic: The Gathering', icon: '🎴', image: '/magic-gathering.png' },
            { id: 'flesh-and-blood', name: 'Flesh and Blood', icon: '⚔️', image: '/flesh-and-blood.png' },
            { id: 'pokemon', name: 'Pokémon', icon: '⚡', image: '/pokemon.png' },
            { id: 'one-piece', name: 'One Piece', icon: '🏴‍☠️', image: '/one-piece.png' },
            { id: 'lorcana', name: 'Lorcana', icon: '✨', image: '/lorcana.png' },
        ];

        gamesCache = mockGames;
        gamesCacheTime = Date.now();
        return mockGames;
    } catch (error) {
        console.error('Error fetching games:', error);
        // Return empty array on error
        return [];
    }
}

/**
 * Search for cards in a specific game
 */
export async function searchCards(gameName: string, query: string): Promise<Card[]> {
    try {
        // Mock search implementation
        const cards = await getGameCards(gameName);
        return cards.filter(card =>
            card.name.toLowerCase().includes(query.toLowerCase()) ||
            card.set.toLowerCase().includes(query.toLowerCase())
        );
    } catch (error) {
        console.error('Error searching cards:', error);
        return [];
    }
}

/**
 * Get all cards for a specific game
 */
export async function getGameCards(gameName: string): Promise<Card[]> {
    try {
        // Temporary mock data with images
        const cards: Record<string, Card[]> = {
            'Magic: The Gathering': [
                { id: 'mtg-1', name: 'Black Lotus', set: 'Alpha', image: '/black-lotus.png', cashPrice: 45000.00, creditPrice: 50000.00, rarity: 'Rare', game: 'Magic: The Gathering' },
                { id: 'mtg-2', name: 'The One Ring', set: 'Tales of Middle-earth', image: '/one-ring.png', cashPrice: 2000000.00, creditPrice: 2200000.00, rarity: 'Mythic', game: 'Magic: The Gathering' },
                { id: 'mtg-3', name: 'Mox Sapphire', set: 'Alpha', image: '/black-lotus.png', cashPrice: 15000.00, creditPrice: 17000.00, rarity: 'Rare', game: 'Magic: The Gathering' },
            ],
            'Pokémon': [
                { id: 'pkm-1', name: 'Charizard', set: 'Base Set', image: '/charizard.png', cashPrice: 3000.00, creditPrice: 3500.00, rarity: 'Holo Rare', game: 'Pokémon' },
                { id: 'pkm-2', name: 'Pikachu Illustrator', set: 'Promo', image: '/pikachu.png', cashPrice: 5000000.00, creditPrice: 5500000.00, rarity: 'Promo', game: 'Pokémon' },
                { id: 'pkm-3', name: 'Blastoise', set: 'Base Set', image: '/charizard.png', cashPrice: 1500.00, creditPrice: 1800.00, rarity: 'Holo Rare', game: 'Pokémon' },
            ],
            'Yu-Gi-Oh': [ // Note: Yu-Gi-Oh is not in the game list above but for completeness
                { id: 'ygo-1', name: 'Blue-Eyes White Dragon', set: 'LOB', image: '/blue-eyes.png', cashPrice: 1200.00, creditPrice: 1500.00, rarity: 'Ultra Rare', game: 'Yu-Gi-Oh' },
            ],
            'Flesh and Blood': [
                { id: 'fab-1', name: 'Fyendal\'s Spring Tunic', set: 'Welcome to Rathe', image: '/flesh-and-blood.png', cashPrice: 150.00, creditPrice: 180.00, rarity: 'Legendary', game: 'Flesh and Blood' },
            ],
            'One Piece': [
                { id: 'op-1', name: 'Monkey D. Luffy', set: 'Romance Dawn', image: '/one-piece.png', cashPrice: 800.00, creditPrice: 950.00, rarity: 'Leader', game: 'One Piece' },
            ],
            'Lorcana': [
                { id: 'lor-1', name: 'Elsa - Spirit of Winter', set: 'The First Chapter', image: '/lorcana.png', cashPrice: 600.00, creditPrice: 700.00, rarity: 'Enchanted', game: 'Lorcana' },
            ]
        };

        const result = cards[gameName] || [];
        console.log(`Fetching all cards for game "${gameName}": ${result.length} cards found`);
        return result;

    } catch (error) {
        console.error('Error fetching game cards:', error);
        return [];
    }
}

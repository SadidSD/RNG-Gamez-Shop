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
        // TODO: Replace with actual Manapool API endpoint
        // const response = await fetch(
        //   `${MANAPOOL_API_BASE}/cards/search?game=${encodeURIComponent(gameName)}&q=${encodeURIComponent(query)}`,
        //   {
        //     headers: {
        //       'Authorization': `Bearer ${MANAPOOL_API_KEY}`,
        //       'Content-Type': 'application/json',
        //     },
        //   }
        // );

        // if (!response.ok) {
        //   throw new Error(`Failed to search cards: ${response.statusText}`);
        // }

        // const data = await response.json();
        // return data.cards;

        // Temporary: return empty array until API is integrated
        console.log(`Searching for "${query}" in game "${gameName}"`);
        return [];
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
        // TODO: Replace with actual Manapool API endpoint
        // const response = await fetch(
        //   `${MANAPOOL_API_BASE}/cards?game=${encodeURIComponent(gameName)}`,
        //   {
        //     headers: {
        //       'Authorization': `Bearer ${MANAPOOL_API_KEY}`,
        //       'Content-Type': 'application/json',
        //     },
        //   }
        // );

        // if (!response.ok) {
        //   throw new Error(`Failed to fetch game cards: ${response.statusText}`);
        // }

        // const data = await response.json();
        // return data.cards;

        // Temporary: return empty array until API is integrated
        console.log(`Fetching all cards for game "${gameName}"`);
        return [];
    } catch (error) {
        console.error('Error fetching game cards:', error);
        return [];
    }
}

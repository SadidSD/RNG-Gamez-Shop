// Bulk input parser utilities with fuzzy matching

import { Card, BulkParseResult } from '@/types';

/**
 * Calculate string similarity using Levenshtein distance
 */
function calculateSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();

    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else if (j > 0) {
                let newValue = costs[j - 1];
                if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                    newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                }
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) {
            costs[s2.length] = lastValue;
        }
    }

    const maxLength = Math.max(s1.length, s2.length);
    return maxLength === 0 ? 1 : (maxLength - costs[s2.length]) / maxLength;
}

/**
 * Fuzzy match a card name against the card database
 */
export function fuzzyMatchCard(
    cardName: string,
    cardDatabase: Card[],
    threshold: number = 0.7
): { card: Card; confidence: number } | null {
    let bestMatch: { card: Card; confidence: number } | null = null;

    for (const card of cardDatabase) {
        const similarity = calculateSimilarity(cardName, card.name);

        if (similarity >= threshold) {
            if (!bestMatch || similarity > bestMatch.confidence) {
                bestMatch = { card, confidence: similarity };
            }
        }
    }

    return bestMatch;
}

/**
 * Parse a single line of text input
 * Expected format: [Quantity] [Card Name]
 * Examples: "5 Charizard", "1 Black Lotus"
 */
function parseLine(line: string): { quantity: number; cardName: string } | null {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
        return null;
    }

    // Match pattern: number followed by space and card name
    const match = trimmed.match(/^(\d+)\s+(.+)$/);

    if (match) {
        const quantity = parseInt(match[1], 10);
        const cardName = match[2].trim();

        if (quantity > 0 && cardName) {
            return { quantity, cardName };
        }
    }

    // If no quantity found, assume quantity of 1
    if (trimmed && !/^\d+$/.test(trimmed)) {
        return { quantity: 1, cardName: trimmed };
    }

    return null;
}

/**
 * Parse text input and match against card database
 */
export function parseTextInput(
    text: string,
    cardDatabase: Card[]
): BulkParseResult[] {
    const lines = text.split('\n');
    const results: BulkParseResult[] = [];

    for (const line of lines) {
        const parsed = parseLine(line);

        if (parsed) {
            const match = fuzzyMatchCard(parsed.cardName, cardDatabase);

            results.push({
                quantity: parsed.quantity,
                cardName: parsed.cardName,
                matchedCard: match?.card,
                confidence: match?.confidence,
            });
        }
    }

    return results;
}

/**
 * Parse uploaded file and extract text content
 */
export async function parseFile(
    file: File,
    cardDatabase: Card[]
): Promise<BulkParseResult[]> {
    try {
        const text = await file.text();

        // Check if it's a CSV file
        if (file.name.toLowerCase().endsWith('.csv')) {
            return parseCSV(text, cardDatabase);
        }

        // Otherwise treat as plain text
        return parseTextInput(text, cardDatabase);
    } catch (error) {
        console.error('Error parsing file:', error);
        throw new Error('Failed to parse file. Please ensure it contains valid text.');
    }
}

/**
 * Parse CSV format
 * Expected columns: quantity, name (or similar variations)
 */
function parseCSV(text: string, cardDatabase: Card[]): BulkParseResult[] {
    const lines = text.split('\n');
    const results: BulkParseResult[] = [];

    if (lines.length === 0) {
        return results;
    }

    // Try to detect header row
    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('quantity') || firstLine.includes('name');
    const startIndex = hasHeader ? 1 : 0;

    // Detect column indices
    let quantityIndex = 0;
    let nameIndex = 1;

    if (hasHeader) {
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        quantityIndex = headers.findIndex(h => h.includes('quantity') || h.includes('qty') || h.includes('count'));
        nameIndex = headers.findIndex(h => h.includes('name') || h.includes('card'));

        if (quantityIndex === -1) quantityIndex = 0;
        if (nameIndex === -1) nameIndex = 1;
    }

    // Parse data rows
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const columns = line.split(',').map(c => c.trim());

        if (columns.length >= 2) {
            const quantityStr = columns[quantityIndex];
            const cardName = columns[nameIndex];
            const quantity = parseInt(quantityStr, 10);

            if (!isNaN(quantity) && quantity > 0 && cardName) {
                const match = fuzzyMatchCard(cardName, cardDatabase);

                results.push({
                    quantity,
                    cardName,
                    matchedCard: match?.card,
                    confidence: match?.confidence,
                });
            }
        }
    }

    return results;
}

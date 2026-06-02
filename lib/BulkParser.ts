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
 * Expected format: [Quantity] [Card Name] [Set] [Condition]
 * Examples: "5 Charizard [Base Set] [LP]", "1 Black Lotus [Alpha Edition] [Near Mint]"
 */
const CONDITIONS_MAP: Record<string, 'Near Mint' | 'Lightly Played' | 'Moderately Played' | 'Heavily Played' | 'Damaged'> = {
    'nm': 'Near Mint',
    'near mint': 'Near Mint',
    'nearmint': 'Near Mint',
    'lp': 'Lightly Played',
    'lightly played': 'Lightly Played',
    'lightlyplayed': 'Lightly Played',
    'mp': 'Moderately Played',
    'moderately played': 'Moderately Played',
    'moderatelyplayed': 'Moderately Played',
    'hp': 'Heavily Played',
    'heavily played': 'Heavily Played',
    'heavilyplayed': 'Heavily Played',
    'dmg': 'Damaged',
    'd': 'Damaged',
    'damaged': 'Damaged'
};

function normalizeCondition(val: string): 'Near Mint' | 'Lightly Played' | 'Moderately Played' | 'Heavily Played' | 'Damaged' | null {
    const clean = val.trim().toLowerCase();
    return CONDITIONS_MAP[clean] || null;
}

export interface ParsedLine {
    quantity: number;
    cardName: string;
    set?: string;
    condition?: 'Near Mint' | 'Lightly Played' | 'Moderately Played' | 'Heavily Played' | 'Damaged';
}

function parseLine(line: string): ParsedLine | null {
    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) {
        return null;
    }

    let quantity = 1;
    let remainingText = trimmed;

    // Match pattern: number followed by space and the rest of the text
    const qtyMatch = trimmed.match(/^(\d+)\s+(.+)$/);
    if (qtyMatch) {
        quantity = parseInt(qtyMatch[1], 10);
        remainingText = qtyMatch[2].trim();
    }

    // Extract all bracketed content [...] from remainingText
    const bracketRegex = /\[([^\]]+)\]/g;
    const brackets: string[] = [];
    let match;
    while ((match = bracketRegex.exec(remainingText)) !== null) {
        brackets.push(match[1].trim());
    }

    // Clean card name by removing bracketed segments
    const cardName = remainingText.replace(/\[[^\]]+\]/g, '').replace(/\s+/g, ' ').trim();
    if (!cardName) {
        return null;
    }

    let set: string | undefined;
    let condition: 'Near Mint' | 'Lightly Played' | 'Moderately Played' | 'Heavily Played' | 'Damaged' | undefined;

    if (brackets.length >= 2) {
        // First bracket is set, second is condition (or check if either is condition)
        const cond1 = normalizeCondition(brackets[0]);
        const cond2 = normalizeCondition(brackets[1]);

        if (cond2) {
            condition = cond2;
            set = brackets[0];
        } else if (cond1) {
            condition = cond1;
            set = brackets[1];
        } else {
            // Neither is standard condition, default first as set
            set = brackets[0];
        }
    } else if (brackets.length === 1) {
        const cond = normalizeCondition(brackets[0]);
        if (cond) {
            condition = cond;
        } else {
            set = brackets[0];
        }
    }

    return {
        quantity,
        cardName,
        ...(set ? { set } : {}),
        ...(condition ? { condition } : {})
    };
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
                condition: parsed.condition
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
 * Expected columns: quantity, name, set, condition (or similar variations)
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
    let setIndex = -1;
    let conditionIndex = -1;

    if (hasHeader) {
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        quantityIndex = headers.findIndex(h => h.includes('quantity') || h.includes('qty') || h.includes('count'));
        nameIndex = headers.findIndex(h => h.includes('name') || h.includes('card'));
        setIndex = headers.findIndex(h => h.includes('set') || h.includes('edition'));
        conditionIndex = headers.findIndex(h => h.includes('condition') || h.includes('cond') || h.includes('status'));

        if (quantityIndex === -1) quantityIndex = 0;
        if (nameIndex === -1) nameIndex = 1;
    }

    // Parse data rows
    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const columns = line.split(',').map(c => c.trim());

        if (columns.length > Math.max(quantityIndex, nameIndex)) {
            const quantityStr = columns[quantityIndex];
            const cardName = columns[nameIndex];
            const quantity = parseInt(quantityStr, 10);

            if (!isNaN(quantity) && quantity > 0 && cardName) {
                const setVal = setIndex !== -1 && columns[setIndex] ? columns[setIndex] : undefined;
                const condValRaw = conditionIndex !== -1 && columns[conditionIndex] ? columns[conditionIndex] : undefined;
                const condVal = condValRaw ? (normalizeCondition(condValRaw) || undefined) : undefined;

                const match = fuzzyMatchCard(cardName, cardDatabase);

                results.push({
                    quantity,
                    cardName,
                    matchedCard: match?.card,
                    confidence: match?.confidence,
                    condition: condVal
                });
            }
        }
    }

    return results;
}

export function parseRawTextInput(text: string): ParsedLine[] {
    const lines = text.split('\n');
    const results: ParsedLine[] = [];

    for (const line of lines) {
        const parsed = parseLine(line);
        if (parsed) {
            results.push(parsed);
        }
    }

    return results;
}

export async function parseRawFile(file: File): Promise<ParsedLine[]> {
    try {
        const text = await file.text();

        if (file.name.toLowerCase().endsWith('.csv')) {
            return parseRawCSV(text);
        }

        return parseRawTextInput(text);
    } catch (error) {
        console.error('Error parsing file:', error);
        throw new Error('Failed to parse file. Please ensure it contains valid text.');
    }
}

function parseRawCSV(text: string): ParsedLine[] {
    const lines = text.split('\n');
    const results: ParsedLine[] = [];

    if (lines.length === 0) {
        return results;
    }

    const firstLine = lines[0].toLowerCase();
    const hasHeader = firstLine.includes('quantity') || firstLine.includes('name');
    const startIndex = hasHeader ? 1 : 0;

    let quantityIndex = 0;
    let nameIndex = 1;
    let setIndex = -1;
    let conditionIndex = -1;

    if (hasHeader) {
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        quantityIndex = headers.findIndex(h => h.includes('quantity') || h.includes('qty') || h.includes('count'));
        nameIndex = headers.findIndex(h => h.includes('name') || h.includes('card'));
        setIndex = headers.findIndex(h => h.includes('set') || h.includes('edition'));
        conditionIndex = headers.findIndex(h => h.includes('condition') || h.includes('cond') || h.includes('status'));

        if (quantityIndex === -1) quantityIndex = 0;
        if (nameIndex === -1) nameIndex = 1;
    }

    for (let i = startIndex; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const columns = line.split(',').map(c => c.trim());

        if (columns.length > Math.max(quantityIndex, nameIndex)) {
            const quantityStr = columns[quantityIndex];
            const cardName = columns[nameIndex];
            const quantity = parseInt(quantityStr, 10);

            if (!isNaN(quantity) && quantity > 0 && cardName) {
                const setVal = setIndex !== -1 && columns[setIndex] ? columns[setIndex] : undefined;
                const condValRaw = conditionIndex !== -1 && columns[conditionIndex] ? columns[conditionIndex] : undefined;
                const condVal = condValRaw ? (normalizeCondition(condValRaw) || undefined) : undefined;

                results.push({
                    quantity,
                    cardName,
                    ...(setVal ? { set: setVal } : {}),
                    ...(condVal ? { condition: condVal } : {})
                });
            }
        }
    }

    return results;
}

export interface Card {
    id: string;
    name: string;
    set: string;
    setIcon?: string;
    image: string;
    cashPrice: number;
    creditPrice: number;
    rarity?: string;
    cardNumber?: string;
    condition?: 'Near Mint' | 'Lightly Played' | 'Moderately Played' | 'Heavily Played' | 'Damaged';
    game?: string;
    isFoil?: boolean;
}

export interface CartItem {
    card: Card;
    quantity: number;
}

export interface Set {
    id: string;
    name: string;
    icon?: string;
    releaseDate?: string;
}

export interface Game {
    id: string;
    name: string;
    icon?: string;
    image?: string;
}

export interface CartTotals {
    totalCash: number;
    totalCredit: number;
    itemCount: number;
}

export interface BulkParseResult {
    quantity: number;
    cardName: string;
    matchedCard?: Card;
    confidence?: number;
}

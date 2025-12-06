'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Card, CartTotals } from '@/types';

interface CartContextType {
    items: CartItem[];
    addItem: (card: Card, quantity: number) => void;
    removeItem: (cardId: string) => void;
    updateQuantity: (cardId: string, quantity: number) => void;
    clearCart: () => void;
    totals: CartTotals;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CREDIT_BONUS_MULTIPLIER = 1.2; // 20% bonus for store credit

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('tcg-buylist-cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (error) {
                console.error('Failed to load cart from localStorage:', error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('tcg-buylist-cart', JSON.stringify(items));
    }, [items]);

    const addItem = (card: Card, quantity: number) => {
        setItems((prevItems) => {
            const existingItem = prevItems.find((item) => item.card.id === card.id);

            if (existingItem) {
                return prevItems.map((item) =>
                    item.card.id === card.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }

            return [...prevItems, { card, quantity }];
        });
    };

    const removeItem = (cardId: string) => {
        setItems((prevItems) => prevItems.filter((item) => item.card.id !== cardId));
    };

    const updateQuantity = (cardId: string, quantity: number) => {
        if (quantity <= 0) {
            removeItem(cardId);
            return;
        }

        setItems((prevItems) =>
            prevItems.map((item) =>
                item.card.id === cardId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const openCart = () => setIsOpen(true);
    const closeCart = () => setIsOpen(false);

    // Calculate totals
    const totals: CartTotals = items.reduce(
        (acc, item) => ({
            totalCash: acc.totalCash + item.card.cashPrice * item.quantity,
            totalCredit: acc.totalCredit + (item.card.creditPrice * item.quantity * CREDIT_BONUS_MULTIPLIER),
            itemCount: acc.itemCount + item.quantity,
        }),
        { totalCash: 0, totalCredit: 0, itemCount: 0 }
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totals,
                isOpen,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ShopCartItem {
    variantId: string;
    productId: string;
    name: string;
    set: string;
    condition: string;
    price: number;
    image: string;
    quantity: number;
}

interface ShopCartContextType {
    items: ShopCartItem[];
    addItem: (item: Omit<ShopCartItem, 'quantity'>, quantity?: number) => void;
    removeItem: (variantId: string) => void;
    updateQuantity: (variantId: string, quantity: number) => void;
    clearCart: () => void;
    total: number;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
}

const ShopCartContext = createContext<ShopCartContextType | undefined>(undefined);

export function ShopCartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<ShopCartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Persist to local storage
    useEffect(() => {
        const saved = localStorage.getItem('tcg-shop-cart');
        if (saved) {
            try {
                setItems(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load shop cart', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tcg-shop-cart', JSON.stringify(items));
    }, [items]);

    const addItem = (newItem: Omit<ShopCartItem, 'quantity'>, quantity = 1) => {
        setItems(prev => {
            const existing = prev.find(i => i.variantId === newItem.variantId);
            if (existing) {
                return prev.map(i => i.variantId === newItem.variantId
                    ? { ...i, quantity: i.quantity + quantity }
                    : i
                );
            }
            return [...prev, { ...newItem, quantity }];
        });
        console.log('Added item to cart:', newItem, quantity);
        setIsOpen(true); // Auto open on add
    };

    const removeItem = (variantId: string) => {
        setItems(prev => prev.filter(i => i.variantId !== variantId));
    };

    const updateQuantity = (variantId: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(variantId);
            return;
        }
        setItems(prev => prev.map(i => i.variantId === variantId ? { ...i, quantity } : i));
    };

    const clearCart = () => setItems([]);

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <ShopCartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            total,
            isOpen,
            openCart: () => setIsOpen(true),
            closeCart: () => setIsOpen(false),
            toggleCart: () => setIsOpen(prev => !prev)
        }}>
            {children}
        </ShopCartContext.Provider>
    );
}

export function useShopCart() {
    const context = useContext(ShopCartContext);
    if (!context) throw new Error("useShopCart must be used within ShopCartProvider");
    return context;
}

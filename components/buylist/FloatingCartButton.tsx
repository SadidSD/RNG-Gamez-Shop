'use client';

import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/BuylistCartContext';
import { ShoppingBag } from 'lucide-react';

const FloatingCartButton = () => {
    const { items, openCart } = useCart();

    // Always show button, so users know where the cart is
    // if (items.length === 0) return null;

    return (
        <AnimatePresence>
            <FloatContainer
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={openCart}
            >
                <ShoppingBag size={24} color="white" />
                {items.length > 0 && <CountBadge>{items.length}</CountBadge>}
            </FloatContainer>
        </AnimatePresence>
    );
};

const FloatContainer = styled(motion.button)`
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: linear-gradient(135deg, #B473FF 0%, #9917FF 100%);
    border: none;
    box-shadow: 0 4px 15px rgba(180, 115, 255, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 50;
    
    &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #FF00CC, #3333FF);
        z-index: -1;
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.3s;
    }

    &:hover::before {
        opacity: 0.5;
    }
`;

const CountBadge = styled.div`
    position: absolute;
    top: -5px;
    right: -5px;
    background: #FF4444;
    color: white;
    font-size: 0.75rem;
    font-weight: bold;
    min-width: 24px;
    height: 24px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
`;

export default FloatingCartButton;

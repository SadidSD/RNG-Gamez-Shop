"use client";

import React from 'react';
import { X } from 'lucide-react';

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full max-w-[500px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col rounded-l-[30px] ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <h2 className="text-2xl font-bold text-black">Your Cart</h2>
                        <span className="bg-gray-100 text-black font-bold px-3 py-1 rounded-full text-sm">0</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X size={24} className="text-black" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#F5F3FF]/30">
                    <p className="text-lg text-gray-500 font-medium">The cart is empty</p>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-white">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-xl font-bold text-black">Subtotal</span>
                        <span className="text-xl font-bold text-black">$0</span>
                    </div>
                    <button className="w-full bg-[#D8B4FE] text-white font-bold py-4 rounded-xl hover:bg-[#C084FC] transition-colors">
                        Checkout
                    </button>
                </div>
            </div>
        </>
    );
};

export default CartSidebar;

'use client';

import StyledComponentsRegistry from '@/lib/registry';
import { CartProvider } from '@/context/BuylistCartContext';
import CartDrawer from '@/components/buylist/CartDrawer';
import FloatingCartButton from '@/components/buylist/FloatingCartButton';

export default function BuylistLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <StyledComponentsRegistry>
            <CartProvider>
                {children}
                <FloatingCartButton />
                <CartDrawer />
            </CartProvider>
        </StyledComponentsRegistry>
    );
}

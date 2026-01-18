'use client';

import StyledComponentsRegistry from '@/lib/registry';
import { CartProvider } from '@/context/BuylistCartContext';
import CartDrawer from '@/components/buylist/CartDrawer';

export default function BuylistLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <StyledComponentsRegistry>
            <CartProvider>
                {children}
                <CartDrawer />
            </CartProvider>
        </StyledComponentsRegistry>
    );
}

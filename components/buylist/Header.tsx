'use client';

import React from 'react';
import styled from 'styled-components';
import { useRouter, usePathname } from 'next/navigation';
import { useCart } from '@/context/BuylistCartContext';

const Header: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { totals, openCart } = useCart();
    const showBackButton = pathname !== '/buylist';

    return (
        <HeaderContainer>
            <LeftSection>
                {showBackButton ? (
                    <BackButton onClick={() => router.push('/buylist')}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Back</span>
                    </BackButton>
                ) : (
                    <Logo onClick={() => router.push('/buylist')}>
                        TCG Buylist
                    </Logo>
                )}
            </LeftSection>

            <RightSection>
                <CartButton onClick={openCart}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    {totals.itemCount > 0 && (
                        <CartBadge>{totals.itemCount}</CartBadge>
                    )}
                </CartButton>
            </RightSection>
        </HeaderContainer>
    );
};

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #B473FF, #9917FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
  transition: all 300ms ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #666666;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  cursor: pointer;
  transition: all 300ms ease;
  font-size: 1rem;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: rgba(180, 115, 255, 0.05);
    border-color: #B473FF;
    color: #B473FF;
    transform: translateX(-4px);
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CartButton = styled.button`
  position: relative;
  background: linear-gradient(135deg, rgba(180, 115, 255, 0.08), rgba(153, 23, 255, 0.08));
  border: 1px solid rgba(180, 115, 255, 0.2);
  color: #B473FF;
  padding: 0.75rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 300ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;

  svg {
    width: 24px;
    height: 24px;
  }

  &:hover {
    background: linear-gradient(135deg, rgba(180, 115, 255, 0.12), rgba(153, 23, 255, 0.12));
    border-color: rgba(180, 115, 255, 0.4);
    transform: scale(1.05);
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  background: linear-gradient(135deg, #EF4444, #DC2626);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  min-width: 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
`;

export default Header;

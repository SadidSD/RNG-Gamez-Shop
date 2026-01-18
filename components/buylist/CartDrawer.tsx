'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/BuylistCartContext';
import axios from 'axios';

const CartDrawer: React.FC = () => {
  const { items, removeItem, updateQuantity, totals, isOpen, closeCart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit'>('cash');
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCheckout = async () => {
    if (!customerName || !email) {
      alert('Please enter your name and email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        customerName: customerName,
        customerEmail: email,
        items: items.map(item => ({
          cardName: item.card.name,
          condition: item.card.condition || 'NM', // Default to NM if missing
          isFoil: false, // You might want to track foil status in cart item
          offerPrice: paymentMethod === 'cash' ? item.card.cashPrice : item.card.creditPrice, // Or base price?
          // NOTE: Backend expects 'offerPrice' per unit.
          // Usually buylist offers are based on a specific rate.
          // For now sending the displayed price (Cash or Credit value).
          quantity: item.quantity
        }))
      };

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      await axios.post(`${apiUrl}/buylist/offers`, payload, {
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY }
      });

      setSubmitStatus('success');
      setTimeout(() => {
        clearCart();
        closeCart();
        setSubmitStatus('idle');
        setCustomerName('');
        setEmail('');
      }, 2000);

    } catch (error) {
      console.error('Checkout failed:', error);
      setSubmitStatus('error');
      alert('Failed to submit offer. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <DrawerContainer
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <DrawerHeader>
              <Title>Your Buylist</Title>
              <CloseButton onClick={closeCart}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </CloseButton>
            </DrawerHeader>

            <ItemsList>
              {items.length === 0 ? (
                <EmptyState>
                  <EmptyIcon>🛒</EmptyIcon>
                  <EmptyText>Your buylist is empty</EmptyText>
                  <EmptySubtext>Add cards to get started</EmptySubtext>
                </EmptyState>
              ) : submitStatus === 'success' ? (
                <EmptyState>
                  <EmptyIcon>✅</EmptyIcon>
                  <EmptyText>Offer Submitted!</EmptyText>
                  <EmptySubtext>We will review it shortly.</EmptySubtext>
                </EmptyState>
              ) : (
                items.map((item) => (
                  <CartItemCard key={item.card.id}>
                    <ItemImage src={item.card.image} alt={item.card.name} />
                    <ItemDetails>
                      <ItemName>{item.card.name}</ItemName>
                      <ItemSet>
                        <span>{item.card.setIcon}</span>
                        <span>{item.card.set}</span>
                      </ItemSet>
                      <ItemPrices>
                        <PriceTag>
                          <PriceLabel>Cash:</PriceLabel>
                          <PriceValue>${(item.card.cashPrice * item.quantity).toFixed(2)}</PriceValue>
                        </PriceTag>
                        <PriceTag>
                          <PriceLabel>Credit:</PriceLabel>
                          <PriceValue className="credit">${(item.card.creditPrice * item.quantity).toFixed(2)}</PriceValue>
                        </PriceTag>
                      </ItemPrices>
                    </ItemDetails>
                    <ItemActions>
                      <QuantityControl>
                        <QuantityButton onClick={() => updateQuantity(item.card.id, item.quantity - 1)}>
                          -
                        </QuantityButton>
                        <QuantityDisplay>{item.quantity}</QuantityDisplay>
                        <QuantityButton onClick={() => updateQuantity(item.card.id, item.quantity + 1)}>
                          +
                        </QuantityButton>
                      </QuantityControl>
                      <RemoveButton onClick={() => removeItem(item.card.id)}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </RemoveButton>
                    </ItemActions>
                  </CartItemCard>
                ))
              )}
            </ItemsList>

            {items.length > 0 && submitStatus !== 'success' && (
              <SummarySection>
                <SummaryTitle>Summary</SummaryTitle>

                <FormGroup>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>

                <PaymentMethodSelector>
                  <PaymentMethodLabel>Choose Payout Method:</PaymentMethodLabel>
                  <PaymentOptions>
                    <PaymentOption
                      $active={paymentMethod === 'cash'}
                      onClick={() => setPaymentMethod('cash')}
                    >
                      <RadioCircle $active={paymentMethod === 'cash'}>
                        {paymentMethod === 'cash' && <RadioDot />}
                      </RadioCircle>
                      <span>Cash</span>
                    </PaymentOption>
                    <PaymentOption
                      $active={paymentMethod === 'credit'}
                      onClick={() => setPaymentMethod('credit')}
                    >
                      <RadioCircle $active={paymentMethod === 'credit'}>
                        {paymentMethod === 'credit' && <RadioDot />}
                      </RadioCircle>
                      <span>Store Credit <CreditBonus>+20%</CreditBonus></span>
                    </PaymentOption>
                  </PaymentOptions>
                </PaymentMethodSelector>

                <TotalRow className="cash">
                  <TotalLabel>Total Cash Payout</TotalLabel>
                  <TotalValue>${totals.totalCash.toFixed(2)}</TotalValue>
                </TotalRow>
                <TotalRow className="credit">
                  <TotalLabel>Total Store Credit <BonusBadge>+20%</BonusBadge></TotalLabel>
                  <TotalValue>${totals.totalCredit.toFixed(2)}</TotalValue>
                </TotalRow>
                <CheckoutButton onClick={handleCheckout} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <svg height={24} width={24} fill="#FFFFFF" viewBox="0 0 24 24">
                        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
                      </svg>
                      <span>Complete Buylist Submission</span>
                    </>
                  )}
                </CheckoutButton>
              </SummarySection>
            )}
          </DrawerContainer>
        </>
      )}
    </AnimatePresence>
  );
};

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 10px;
`;

const Input = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    &:focus {
        outline: none;
        border-color: #B473FF;
    }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  z-index: 999;
`;

const DrawerContainer = styled(motion.div)`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.1);

  @media (max-width: 640px) {
    max-width: 100%;
  }
`;

const DrawerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #B473FF, #9917FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CloseButton = styled.button`
  background: transparent;
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #666666;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 300ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: #EF4444;
    color: #EF4444;
    transform: rotate(90deg);
  }
`;

const ItemsList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  opacity: 0.3;
`;

const EmptyText = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  color: #666666;
`;

const EmptySubtext = styled.p`
  font-size: 0.875rem;
  color: #6B7280;
`;

const CartItemCard = styled.div`
  background: #FAFAFA;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  gap: 1rem;
  transition: all 300ms ease;

  &:hover {
    background: #FFFFFF;
    border-color: rgba(180, 115, 255, 0.3);
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 112px;
  object-fit: cover;
  border-radius: 0.5rem;
  background: #FFFFFF;
`;

const ItemDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ItemName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const ItemSet = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666666;
`;

const ItemPrices = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: auto;
`;

const PriceTag = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PriceLabel = styled.span`
  font-size: 0.75rem;
  color: #6B7280;
  text-transform: uppercase;
`;

const PriceValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: #10B981;

  &.credit {
    color: #B473FF;
  }
`;

const ItemActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 2rem;
  padding: 0.25rem;
`;

const QuantityButton = styled.button`
  background: rgba(180, 115, 255, 0.1);
  border: 1px solid rgba(180, 115, 255, 0.3);
  color: #1a1a1a;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 300ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 600;

  &:hover {
    background: rgba(180, 115, 255, 0.2);
    border-color: #B473FF;
  }
`;

const QuantityDisplay = styled.span`
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: #1a1a1a;
`;

const RemoveButton = styled.button`
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #EF4444;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 300ms ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: #EF4444;
  }
`;

const SummarySection = styled.div`
  padding: 2rem;
  background: #F9FAFB;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SummaryTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #666666;
  margin-bottom: 0.5rem;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #FFFFFF;
  border-radius: 0.75rem;
  border: 1px solid rgba(0, 0, 0, 0.08);

  &.cash {
    border-color: rgba(16, 185, 129, 0.3);
  }

  &.credit {
    border-color: rgba(180, 115, 255, 0.3);
  }
`;

const TotalLabel = styled.span`
  font-size: 0.875rem;
  color: #666666;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const BonusBadge = styled.span`
  background: linear-gradient(135deg, #B473FF, #9917FF);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
`;

const TotalValue = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
`;

const CheckoutButton = styled.button`
  border: none;
  width: 100%;
  height: 4em;
  border-radius: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background: linear-gradient(0deg, #B473FF, #9917FF);
  cursor: pointer;
  transition: all 450ms ease-in-out;
  margin-top: 1rem;

  svg {
    fill: white;
  }

  span {
    font-weight: 600;
    color: white;
    font-size: 1rem;
  }

  &:hover {
    box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4),
      inset 0px -4px 0px 0px rgba(0, 0, 0, 0.2),
      0px 0px 0px 2px rgba(255, 255, 255, 0.15),
      0px 0px 20px 2px rgba(153, 23, 255, 0.2),
      0px 0px 40px 4px rgba(180, 115, 255, 0.15);
    transform: translateY(-2px);
  }
`;

const PaymentMethodSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const PaymentMethodLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #666666;
`;

const PaymentOptions = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const PaymentOption = styled.button<{ $active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1rem;
  background: ${props => props.$active ? '#FFFFFF' : '#FAFAFA'};
  border: 2px solid ${props => props.$active ? '#B473FF' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 300ms ease;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.$active ? '#1a1a1a' : '#666666'};

  &:hover {
    border-color: #B473FF;
    background: #FFFFFF;
  }
`;

const RadioCircle = styled.div<{ $active: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${props => props.$active ? '#B473FF' : 'rgba(0, 0, 0, 0.2)'};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 300ms ease;
`;

const RadioDot = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #B473FF;
`;

const CreditBonus = styled.span`
  background: linear-gradient(135deg, #B473FF, #9917FF);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 9999px;
  margin-left: 0.25rem;
`;

export default CartDrawer;

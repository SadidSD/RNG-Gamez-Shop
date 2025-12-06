'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Card } from '@/types';
import { useCart } from '@/context/BuylistCartContext';

interface CardResultProps {
    card: Card;
}

const CardResult: React.FC<CardResultProps> = ({ card }) => {
    const [quantity, setQuantity] = useState(1);
    const [condition, setCondition] = useState<'Near Mint' | 'Lightly Played' | 'Moderately Played' | 'Heavily Played' | 'Damaged'>('Near Mint');
    const { addItem } = useCart();

    const handleAddToCart = () => {
        if (quantity > 0) {
            addItem({ ...card, condition }, quantity);
            setQuantity(1);
        }
    };

    return (
        <CardContainer>
            <CardImageWrapper>
                <CardImage src={card.image} alt={card.name} />
                <RarityBadge>{card.rarity}</RarityBadge>
            </CardImageWrapper>

            <CardInfo>
                <CardName>{card.name}</CardName>
                <CardSet>
                    <span>{card.set}</span>
                </CardSet>

                <ConditionSelector>
                    <ConditionLabel>Condition:</ConditionLabel>
                    <ConditionDropdown value={condition} onChange={(e) => setCondition(e.target.value as any)}>
                        <option value="Near Mint">Near Mint</option>
                        <option value="Lightly Played">Lightly Played</option>
                        <option value="Moderately Played">Moderately Played</option>
                        <option value="Heavily Played">Heavily Played</option>
                        <option value="Damaged">Damaged</option>
                    </ConditionDropdown>
                </ConditionSelector>

                <PriceSection>
                    <PriceRow>
                        <PriceLabel>Cash</PriceLabel>
                        <PriceValue className="cash">${card.cashPrice.toFixed(2)}</PriceValue>
                    </PriceRow>
                    <PriceRow>
                        <PriceLabel>Credit</PriceLabel>
                        <PriceValue className="credit">${card.creditPrice.toFixed(2)}</PriceValue>
                    </PriceRow>
                </PriceSection>

                <AddToCartSection>
                    <QuantityInput
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                    <AddButton onClick={handleAddToCart}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Add
                    </AddButton>
                </AddToCartSection>
            </CardInfo>
        </CardContainer>
    );
};

const CardContainer = styled.div`
  background: #FAFAFA;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 12px;
  overflow: hidden;
  transition: all 300ms ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
`;

const CardImageWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 5/7;
  background: #FFFFFF;
  padding: 1rem;
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const RarityBadge = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  color: #F59E0B;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgba(245, 158, 11, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CardInfo = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const CardName = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  line-height: 1.4;
`;

const CardSet = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #666666;
`;

const ConditionSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ConditionLabel = styled.label`
  font-size: 0.75rem;
  color: #666666;
  font-weight: 600;
  text-transform: uppercase;
`;

const ConditionDropdown = styled.select`
  padding: 0.75rem;
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  color: #1a1a1a;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 300ms ease;

  &:focus {
    outline: none;
    border-color: #B473FF;
    box-shadow: 0 0 0 3px rgba(180, 115, 255, 0.1);
  }

  &:hover {
    border-color: rgba(180, 115, 255, 0.3);
  }
`;

const PriceSection = styled.div`
  display: flex;
  gap: 1rem;
  padding: 0.75rem;
  background: #FFFFFF;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const PriceRow = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const PriceLabel = styled.span`
  font-size: 0.75rem;
  color: #999999;
  text-transform: uppercase;
  font-weight: 600;
`;

const PriceValue = styled.span`
  font-size: 1.125rem;
  font-weight: 700;
  
  &.cash {
    color: #10B981;
  }
  
  &.credit {
    color: #B473FF;
  }
`;

const AddToCartSection = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: auto;
`;

const QuantityInput = styled.input`
  width: 70px;
  padding: 0.75rem;
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  color: #1a1a1a;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  transition: all 300ms ease;

  &:focus {
    outline: none;
    border-color: #B473FF;
    box-shadow: 0 0 0 3px rgba(180, 115, 255, 0.1);
  }

  /* Remove spinner arrows */
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  -moz-appearance: textfield;
`;

const AddButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #B473FF, #9917FF);
  border: none;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 300ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(180, 115, 255, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(180, 115, 255, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default CardResult;

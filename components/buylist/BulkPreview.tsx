'use client';

import React from 'react';
import styled from 'styled-components';
import { BulkParseResult } from '@/types';

interface BulkPreviewProps {
    results: BulkParseResult[];
    onRemove: (index: number) => void;
    onQuantityChange: (index: number, quantity: number) => void;
}

const BulkPreview: React.FC<BulkPreviewProps> = ({ results, onRemove, onQuantityChange }) => {
    if (results.length === 0) {
        return null;
    }

    const matchedCount = results.filter(r => r.matchedCard).length;
    const unmatchedCount = results.length - matchedCount;

    return (
        <PreviewContainer>
            <PreviewHeader>
                <PreviewTitle>Preview ({results.length} cards)</PreviewTitle>
                <PreviewStats>
                    <StatItem className="success">✓ {matchedCount} matched</StatItem>
                    {unmatchedCount > 0 && (
                        <StatItem className="error">⚠ {unmatchedCount} unmatched</StatItem>
                    )}
                </PreviewStats>
            </PreviewHeader>

            <PreviewList>
                {results.map((result, index) => (
                    <PreviewItem key={index} $isMatched={!!result.matchedCard}>
                        {result.matchedCard ? (
                            <>
                                <CardImage src={result.matchedCard.image} alt={result.matchedCard.name} />
                                <CardDetails>
                                    <CardName>{result.matchedCard.name}</CardName>
                                    <CardSet>{result.matchedCard.set}</CardSet>
                                    {result.confidence && result.confidence < 1 && (
                                        <MatchConfidence>
                                            {Math.round(result.confidence * 100)}% match
                                        </MatchConfidence>
                                    )}
                                    <PriceRow>
                                        <PriceItem>
                                            <PriceLabel>Cash:</PriceLabel>
                                            <PriceValue className="cash">${result.matchedCard.cashPrice.toFixed(2)}</PriceValue>
                                        </PriceItem>
                                        <PriceItem>
                                            <PriceLabel>Credit:</PriceLabel>
                                            <PriceValue className="credit">${result.matchedCard.creditPrice.toFixed(2)}</PriceValue>
                                        </PriceItem>
                                    </PriceRow>
                                </CardDetails>
                            </>
                        ) : (
                            <UnmatchedDetails>
                                <UnmatchedIcon>❌</UnmatchedIcon>
                                <UnmatchedText>
                                    <UnmatchedName>{result.cardName}</UnmatchedName>
                                    <UnmatchedMessage>Card not found in database</UnmatchedMessage>
                                </UnmatchedText>
                            </UnmatchedDetails>
                        )}

                        <ItemActions>
                            <QuantityControl>
                                <QuantityLabel>Qty:</QuantityLabel>
                                <QuantityInput
                                    type="number"
                                    min="1"
                                    value={result.quantity}
                                    onChange={(e) => onQuantityChange(index, Math.max(1, parseInt(e.target.value) || 1))}
                                />
                            </QuantityControl>
                            <RemoveButton onClick={() => onRemove(index)}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </RemoveButton>
                        </ItemActions>
                    </PreviewItem>
                ))}
            </PreviewList>
        </PreviewContainer>
    );
};

const PreviewContainer = styled.div`
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  overflow: hidden;
`;

const PreviewHeader = styled.div`
  padding: 1.5rem;
  background: #FAFAFA;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`;

const PreviewTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const PreviewStats = styled.div`
  display: flex;
  gap: 1rem;
`;

const StatItem = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  
  &.success {
    color: #10B981;
  }
  
  &.error {
    color: #EF4444;
  }
`;

const PreviewList = styled.div`
  max-height: 500px;
  overflow-y: auto;
`;

const PreviewItem = styled.div<{ $isMatched: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: ${props => props.$isMatched ? '#FFFFFF' : 'rgba(239, 68, 68, 0.02)'};
  transition: background 200ms ease;

  &:hover {
    background: ${props => props.$isMatched ? '#FAFAFA' : 'rgba(239, 68, 68, 0.05)'};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const CardImage = styled.img`
  width: 60px;
  height: 84px;
  object-fit: contain;
  border-radius: 0.25rem;
  background: #F1F1F1;
`;

const CardDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CardName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const CardSet = styled.div`
  font-size: 0.75rem;
  color: #666666;
`;

const MatchConfidence = styled.div`
  font-size: 0.75rem;
  color: #F59E0B;
  font-weight: 500;
`;

const PriceRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.25rem;
`;

const PriceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const PriceLabel = styled.span`
  font-size: 0.75rem;
  color: #999999;
`;

const PriceValue = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  
  &.cash {
    color: #10B981;
  }
  
  &.credit {
    color: #B473FF;
  }
`;

const UnmatchedDetails = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UnmatchedIcon = styled.div`
  font-size: 2rem;
`;

const UnmatchedText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const UnmatchedName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const UnmatchedMessage = styled.div`
  font-size: 0.75rem;
  color: #EF4444;
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const QuantityLabel = styled.span`
  font-size: 0.75rem;
  color: #666666;
  font-weight: 500;
`;

const QuantityInput = styled.input`
  width: 60px;
  padding: 0.5rem;
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.375rem;
  color: #1a1a1a;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;

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

const RemoveButton = styled.button`
  padding: 0.5rem;
  background: transparent;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.375rem;
  color: #EF4444;
  cursor: pointer;
  transition: all 200ms ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: #EF4444;
  }
`;

export default BulkPreview;

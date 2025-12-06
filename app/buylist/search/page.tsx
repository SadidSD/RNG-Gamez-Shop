'use client';

import React, { useState, useMemo } from 'react';
import styled from 'styled-components';
import Header from '@/components/buylist/Header';
import SearchBar from '@/components/buylist/SearchBar';
import SetSelector from '@/components/buylist/SetSelector';
import CardResult from '@/components/buylist/CardResult';
import { mockCards, mockSets } from '@/lib/mockData';

export default function SearchPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSet, setSelectedSet] = useState<string | null>(null);

    const filteredCards = useMemo(() => {
        return mockCards.filter(card => {
            const matchesSearch = searchTerm === '' ||
                card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (card.cardNumber && card.cardNumber.includes(searchTerm));

            const matchesSet = selectedSet === null || card.set === mockSets.find(s => s.id === selectedSet)?.name;

            return matchesSearch && matchesSet;
        });
    }, [searchTerm, selectedSet]);

    return (
        <PageContainer>
            <Header />
            <MainContent>
                <SearchSection>
                    <SearchControls>
                        <SearchBarWrapper>
                            <SearchBar value={searchTerm} onChange={setSearchTerm} />
                        </SearchBarWrapper>
                        <SetSelector selectedSet={selectedSet} onSelectSet={setSelectedSet} />
                    </SearchControls>
                </SearchSection>

                <ResultsSection>
                    {filteredCards.length === 0 ? (
                        <EmptyState>
                            <EmptyIcon>🔍</EmptyIcon>
                            <EmptyText>No cards found</EmptyText>
                            <EmptySubtext>Try adjusting your search or filters</EmptySubtext>
                        </EmptyState>
                    ) : (
                        <>
                            <ResultsHeader>
                                <ResultsCount>{filteredCards.length} cards found</ResultsCount>
                            </ResultsHeader>
                            <CardsGrid>
                                {filteredCards.map((card) => (
                                    <CardResult key={card.id} card={card} />
                                ))}
                            </CardsGrid>
                        </>
                    )}
                </ResultsSection>
            </MainContent>
        </PageContainer>
    );
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: #F1F1F1;
  padding-top: 60px;
`;

const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SearchSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SearchControls = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SearchBarWrapper = styled.div`
  flex: 1;
`;

const ResultsSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ResultsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResultsCount = styled.p`
  font-size: 1rem;
  color: #666666;
  font-weight: 500;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;

  @media (max-width: 640px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  gap: 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 5rem;
  opacity: 0.3;
`;

const EmptyText = styled.p`
  font-size: 1.5rem;
  font-weight: 600;
  color: #666666;
`;

const EmptySubtext = styled.p`
  font-size: 1rem;
  color: #999999;
`;

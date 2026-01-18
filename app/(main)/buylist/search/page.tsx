'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { debounce } from 'lodash';

import SearchBar from '@/components/buylist/SearchBar';
import SetSelector from '@/components/buylist/SetSelector';
import CardResult from '@/components/buylist/CardResult';

// Interfaces matching Backend BuylistFeaturedCard / Search Result
interface BuylistCard {
  id: string;
  name: string;
  set?: string;
  game: string;
  image: string;
  basePrice?: number;
  isRemote?: boolean;
}

// Interface compatible with CardResult's expectations
interface FrontendCard extends BuylistCard {
  cashPrice: number;
  creditPrice: number;
  rarity: string;
  cardNumber?: string;
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSet, setSelectedSet] = useState<string | null>(null);
  const [cards, setCards] = useState<FrontendCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Helper to map backend data to frontend
  const mapToFrontend = (data: BuylistCard[]): FrontendCard[] => {
    if (!Array.isArray(data)) return [];

    return data.map(c => ({
      ...c,
      // Fallbacks for display
      rarity: '', // Backend doesn't send rarity for featured yet
      set: c.set || 'Unknown Set',
      // Pricing Logic
      cashPrice: c.basePrice ? Number(c.basePrice) : 0,
      creditPrice: c.basePrice ? Number(c.basePrice) * 1.3 : 0, // Mock: 30% bonus
      cardNumber: ''
    }));
  };

  // Fetch Featured Cards on Mount
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/buylist/featured`, {
          headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY }
        });
        setCards(mapToFrontend(res.data));
      } catch (error) {
        console.error('Failed to load featured buylist:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch featured if NOT searching
    if (!searchTerm) {
      fetchFeatured();
    }
  }, [searchTerm]);

  // Search Logic (Debounced)
  const performSearch = async (query: string) => {
    if (!query) {
      setIsSearching(false);
      return;
    }

    try {
      setLoading(true);
      setIsSearching(true);
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/buylist/search`, {
        params: { query },
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY }
      });

      const data = res.data;

      // Merge local and remote
      const merged = [
        ...(data.local || []),
        ...(data.remote || [])
      ];

      setCards(mapToFrontend(merged));
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(performSearch, 500), []);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setIsSearching(false);
    }
  }, [searchTerm, debouncedSearch]);


  // Client-side Set Filter (Optional)
  const filteredCards = cards.filter(card => {
    return selectedSet === null || (card.set && card.set === selectedSet);
  });

  return (
    <PageContainer>
      <MainContent>
        <SearchSection>
          <SearchControls>
            <SearchBarWrapper>
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
            </SearchBarWrapper>
            {/* <SetSelector selectedSet={selectedSet} onSelectSet={setSelectedSet} />  */}
          </SearchControls>
        </SearchSection>

        <ResultsSection>
          {loading ? (
            <LoadingState>Searching Universe...</LoadingState>
          ) : filteredCards.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🔍</EmptyIcon>
              <EmptyText>{searchTerm ? 'No cards found' : 'Start typing to search'}</EmptyText>
              <EmptySubtext>Try searching for "Pikachu" or "Lotus"</EmptySubtext>
            </EmptyState>
          ) : (
            <>
              <ResultsHeader>
                <ResultsCount>
                  {filteredCards.length} result{filteredCards.length !== 1 ? 's' : ''}
                  {searchTerm ? ' found' : ' (Featured)'}
                </ResultsCount>
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

const LoadingState = styled.div`
  text-align: center;
  padding: 4rem;
  font-size: 1.2rem;
  color: #666;
`;

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
  margin-top: 3rem;
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

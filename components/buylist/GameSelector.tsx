'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Game } from '@/types';
import { fetchGames } from '@/lib/manapool';

interface GameSelectorProps {
    onSelectGame: (game: Game) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onSelectGame }) => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGames = async () => {
            setLoading(true);
            const fetchedGames = await fetchGames();
            setGames(fetchedGames);
            setLoading(false);
        };

        loadGames();
    }, []);

    if (loading) {
        return (
            <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>Loading games...</LoadingText>
            </LoadingContainer>
        );
    }

    return (
        <SelectorContainer>
            <ContentBox>
                <Title>Select Game</Title>
                <GamesGrid>
                    {games.map((game) => (
                        <GameBox key={game.id} onClick={() => onSelectGame(game)}>
                            {game.image && (
                                <GameImage src={game.image} alt={game.name} />
                            )}
                            <GameName>{game.name}</GameName>
                        </GameBox>
                    ))}
                </GamesGrid>
            </ContentBox>
        </SelectorContainer>
    );
};

const SelectorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  width: 100%;
  padding: 2rem;
`;

const ContentBox = styled.div`
  background: #FFFFFF;
  border: 3px solid #FFFFFF;
  padding: 3rem 4rem;
  max-width: 700px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 2rem 2.5rem;
    max-width: 90%;
  }
`;

const Title = styled.h2`
  font-size: 1.75rem;
  font-weight: 400;
  color: #000000;
  text-align: center;
  margin: 0;
  letter-spacing: 0.02em;
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const GameBox = styled.div`
  background: #F5F5F5;
  border: 2px solid #E0E0E0;
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 250ms ease;
  min-height: 180px;

  &:hover {
    border-color: #B473FF;
    background: #FFFFFF;
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const GameImage = styled.img`
  width: 100%;
  height: 100px;
  object-fit: contain;
  border-radius: 8px;
`;

const GameName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  color: #000000;
  text-align: center;
  margin: 0;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  gap: 1rem;
`;

const LoadingSpinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top-color: #000000;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #000000;
  font-weight: 400;
`;

export default GameSelector;

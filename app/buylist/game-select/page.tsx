'use client';

import React, { useEffect, useState, Suspense } from 'react';
import styled from 'styled-components';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/buylist/Header';
import GameSelector from '@/components/buylist/GameSelector';
import { Game } from '@/types';

function GameSelectContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode'); // 'category' or 'bulk'
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  const handleGameSelect = (game: Game) => {
    setSelectedGame(game);

    // Store selected game in sessionStorage for later use
    sessionStorage.setItem('selectedGame', JSON.stringify(game));

    // Navigate based on mode
    if (mode === 'bulk') {
      router.push('/buylist/bulk');
    } else {
      router.push('/buylist/search');
    }
  };

  return <GameSelector onSelectGame={handleGameSelect} />;
}

export default function GameSelectPage() {
  return (
    <PageContainer>
      <Header />
      <MainContent>
        <Suspense fallback={<div>Loading...</div>}>
          <GameSelectContent />
        </Suspense>
      </MainContent>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 100vh;
  background: #4A4A4A;
  padding-top: 60px;
`;

const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px);
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #1a1a1a, #B473FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: #666666;
  text-align: center;
  margin-top: -2rem;
`;

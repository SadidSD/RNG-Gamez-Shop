'use client';

import React from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';


export default function BuylistPage() {
  const router = useRouter();

  return (
    <PageContainer>

      <MainContent>
        <Title>SELL YOUR CARDS</Title>
        <Subtitle>Choose how you'd like to submit your cards</Subtitle>

        <ActionCardsContainer>
          <ActionCard onClick={() => router.push('/buylist/search')}>
            <CardIconLarge>
              {/* Using a placeholder or emoji if image is missing, or use the image if available in public */}
              <span style={{ fontSize: '4rem' }}>🎴</span>
            </CardIconLarge>
            <CardTitle>Select Cards</CardTitle>
            <CardDescription>Search and select individual cards from our database</CardDescription>
          </ActionCard>

          <ActionCard onClick={() => router.push('/buylist/bulk')}>
            <CardIconLarge>
              <span style={{ fontSize: '4rem' }}>📦</span>
            </CardIconLarge>
            <CardTitle>Bulk Submission</CardTitle>
            <CardDescription>Submit multiple cards at once for faster processing</CardDescription>
          </ActionCard>
        </ActionCardsContainer>
      </MainContent>
    </PageContainer>
  );
}


const PageContainer = styled.div`
  min-height: 100vh;
  background: #F1F1F1;
  padding-top: 60px; /* Add padding for global navbar if needed */
`;

const MainContent = styled.main`
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3rem;
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

const ActionCardsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 900px;
  margin-top: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled.div`
  background: #FAFAFA;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 2rem;
  padding: 3rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  cursor: pointer;
  transition: all 450ms ease-in-out;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(180, 115, 255, 0.05), rgba(153, 23, 255, 0.05));
    opacity: 0;
    transition: opacity 450ms ease-in-out;
  }

  &:hover {
    transform: translateY(-8px);
    border-color: #B473FF;
    box-shadow: 0 20px 60px rgba(180, 115, 255, 0.15),
                0 8px 16px rgba(0, 0, 0, 0.08);

    &::before {
      opacity: 1;
    }
  }
`;

const CardIconLarge = styled.div`
  width: 160px;
  height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(180, 115, 255, 0.08), rgba(153, 23, 255, 0.08));
  border: 2px solid rgba(180, 115, 255, 0.2);
  border-radius: 50%;
  color: #B473FF;
  transition: all 450ms ease-in-out;
  position: relative;
  z-index: 1;

  ${ActionCard}:hover & {
    background: linear-gradient(135deg, rgba(180, 115, 255, 0.15), rgba(153, 23, 255, 0.15));
    border-color: #B473FF;
    color: #B473FF;
    transform: scale(1.1);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  text-align: center;
  position: relative;
  z-index: 1;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #666666;
  text-align: center;
  line-height: 1.6;
  position: relative;
  z-index: 1;
`;

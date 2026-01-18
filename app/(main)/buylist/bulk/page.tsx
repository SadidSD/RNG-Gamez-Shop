'use client';

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/navigation';

import BulkPreview from '@/components/buylist/BulkPreview';
import { BulkParseResult } from '@/types';
import { parseTextInput, parseFile } from '@/lib/BulkParser';
import { mockCards } from '@/lib/mockData';
import { useCart } from '@/context/BuylistCartContext';

export default function BulkPage() {
  // const router = useRouter();
  const { addItem } = useCart();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [textInput, setTextInput] = useState('');
  const [parseResults, setParseResults] = useState<BulkParseResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParseText = () => {
    if (!textInput.trim()) {
      setError('Please enter some card data');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const results = parseTextInput(textInput, mockCards);
      setParseResults(results);

      if (results.length === 0) {
        setError('No valid card entries found. Please check the format.');
      }
    } catch (err) {
      setError('Failed to parse input. Please check the format.');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const results = await parseFile(file, mockCards);
      setParseResults(results);

      if (results.length === 0) {
        setError('No valid card entries found in file. Please check the format.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse file');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveResult = (index: number) => {
    setParseResults(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index: number, quantity: number) => {
    setParseResults(prev => prev.map((result, i) =>
      i === index ? { ...result, quantity } : result
    ));
  };

  const handleAddToCart = () => {
    const matchedResults = parseResults.filter(r => r.matchedCard);

    if (matchedResults.length === 0) {
      setError('No matched cards to add to cart');
      return;
    }

    // Add all matched cards to cart
    matchedResults.forEach(result => {
      if (result.matchedCard) {
        addItem(result.matchedCard, result.quantity);
      }
    });

    // Clear the form
    setTextInput('');
    setParseResults([]);
    setError(null);

    // Show success message (you could add a toast notification here)
    alert(`Successfully added ${matchedResults.length} card(s) to cart!`);
  };

  const handleClear = () => {
    setTextInput('');
    setParseResults([]);
    setError(null);
  };

  return (
    <PageContainer>

      <MainContent>
        <Title>BULK SUBMISSION</Title>
        <Subtitle>Submit multiple cards at once for faster processing</Subtitle>

        <ContentGrid>
          <InputSection>
            <SectionTitle>Enter Card List</SectionTitle>
            <FormatInstructions>
              <InstructionTitle>Format:</InstructionTitle>
              <InstructionText>[Quantity] [Card Name]</InstructionText>
              <InstructionExample>
                Example:<br />
                5 Charizard<br />
                3 Pikachu<br />
                1 Black Lotus
              </InstructionExample>
            </FormatInstructions>

            <TextArea
              placeholder="Enter your card list here...&#10;Example:&#10;5 Charizard&#10;3 Pikachu&#10;1 Black Lotus"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
            />

            <ButtonGroup>
              <ParseButton onClick={handleParseText} disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Parse List'}
              </ParseButton>
              <ClearButton onClick={handleClear}>Clear</ClearButton>
            </ButtonGroup>

            <Divider>
              <DividerLine />
              <DividerText>OR</DividerText>
              <DividerLine />
            </Divider>

            <FileUploadSection>
              <FileUploadButton onClick={() => fileInputRef.current?.click()}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Upload File (TXT, CSV, or any text file)
              </FileUploadButton>
              <HiddenFileInput
                ref={fileInputRef}
                type="file"
                accept=".txt,.csv,text/*"
                onChange={handleFileUpload}
              />
            </FileUploadSection>

            {error && <ErrorMessage>{error}</ErrorMessage>}
          </InputSection>

          <PreviewSection>
            {parseResults.length > 0 ? (
              <>
                <BulkPreview
                  results={parseResults}
                  onRemove={handleRemoveResult}
                  onQuantityChange={handleQuantityChange}
                />

                <AddToCartButton
                  onClick={handleAddToCart}
                  disabled={parseResults.filter(r => r.matchedCard).length === 0}
                >
                  Add {parseResults.filter(r => r.matchedCard).length} Card(s) to Cart
                </AddToCartButton>
              </>
            ) : (
              <EmptyPreview>
                <EmptyIcon>📋</EmptyIcon>
                <EmptyText>Your parsed cards will appear here</EmptyText>
                <EmptySubtext>Enter a card list or upload a file to get started</EmptySubtext>
              </EmptyPreview>
            )}
          </PreviewSection>
        </ContentGrid>
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

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #1a1a1a, #B473FF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.125rem;
  color: #666666;
  text-align: center;
  margin-top: -1.5rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1a1a1a;
`;

const FormatInstructions = styled.div`
  background: #FAFAFA;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  padding: 1rem;
`;

const InstructionTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  color: #666666;
  margin-bottom: 0.5rem;
`;

const InstructionText = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  color: #B473FF;
  font-weight: 600;
  margin-bottom: 0.75rem;
`;

const InstructionExample = styled.div`
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  color: #666666;
  line-height: 1.6;
`;

const TextArea = styled.textarea`
  width: 100%;
  min-height: 300px;
  padding: 1rem;
  background: #FFFFFF;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  color: #1a1a1a;
  font-size: 0.875rem;
  font-family: 'Courier New', monospace;
  line-height: 1.6;
  resize: vertical;
  transition: all 300ms ease;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    outline: none;
    border-color: #B473FF;
    box-shadow: 0 0 0 3px rgba(180, 115, 255, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const ParseButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #B473FF, #9917FF);
  border: none;
  color: white;
  padding: 1rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 300ms ease;
  box-shadow: 0 4px 12px rgba(180, 115, 255, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(180, 115, 255, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ClearButton = styled.button`
  padding: 1rem 2rem;
  background: #FFFFFF;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem;
  color: #666666;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 300ms ease;

  &:hover {
    border-color: rgba(239, 68, 68, 0.3);
    color: #EF4444;
    background: rgba(239, 68, 68, 0.05);
  }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: rgba(0, 0, 0, 0.1);
`;

const DividerText = styled.span`
  font-size: 0.875rem;
  color: #999999;
  font-weight: 600;
`;

const FileUploadSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FileUploadButton = styled.button`
  width: 100%;
  padding: 1.5rem;
  background: #FFFFFF;
  border: 2px dashed rgba(180, 115, 255, 0.3);
  border-radius: 0.75rem;
  color: #B473FF;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 300ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;

  &:hover {
    border-color: #B473FF;
    background: rgba(180, 115, 255, 0.05);
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.75rem;
  color: #EF4444;
  font-size: 0.875rem;
  font-weight: 500;
`;

const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const EmptyPreview = styled.div`
  background: #FFFFFF;
  border: 2px dashed rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 4rem;
  opacity: 0.3;
`;

const EmptyText = styled.p`
  font-size: 1.125rem;
  font-weight: 600;
  color: #666666;
`;

const EmptySubtext = styled.p`
  font-size: 0.875rem;
  color: #999999;
  text-align: center;
`;

const AddToCartButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #10B981, #059669);
  border: none;
  color: white;
  padding: 1.25rem 2rem;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 300ms ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(16, 185, 129, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

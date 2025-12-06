'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Set } from '@/types';
import { mockSets } from '@/lib/mockData';

interface SetSelectorProps {
    selectedSet: string | null;
    onSelectSet: (setId: string | null) => void;
}

const SetSelector: React.FC<SetSelectorProps> = ({ selectedSet, onSelectSet }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const selectedSetData = mockSets.find(set => set.id === selectedSet);

    const filteredSets = mockSets.filter(set =>
        set.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectSet = (setId: string | null) => {
        onSelectSet(setId);
        setIsOpen(false);
        setSearchTerm('');
    };

    return (
        <SelectorContainer>
            <SelectorButton onClick={() => setIsOpen(!isOpen)}>
                <ButtonContent>
                    {selectedSetData ? (
                        <>
                            <span>{selectedSetData.name}</span>
                        </>
                    ) : (
                        <span>Select Set</span>
                    )}
                </ButtonContent>
                <ChevronIcon $isOpen={isOpen}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </ChevronIcon>
            </SelectorButton>

            {isOpen && (
                <>
                    <Overlay onClick={() => setIsOpen(false)} />
                    <Dropdown>
                        <DropdownHeader>
                            <DropdownTitle>Select Card Set</DropdownTitle>
                            <SearchInput
                                type="text"
                                placeholder="Search sets..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                        </DropdownHeader>
                        <SetList>
                            <SetItem onClick={() => handleSelectSet(null)} $isSelected={!selectedSet}>
                                <SetIcon> </SetIcon>
                                <SetName>All Sets</SetName>
                                {!selectedSet && <CheckIcon>✓</CheckIcon>}
                            </SetItem>
                            {filteredSets.map((set) => (
                                <SetItem
                                    key={set.id}
                                    onClick={() => handleSelectSet(set.id)}
                                    $isSelected={selectedSet === set.id}
                                >
                                    <SetName>{set.name}</SetName>
                                    {selectedSet === set.id && <CheckIcon>✓</CheckIcon>}
                                </SetItem>
                            ))}
                        </SetList>
                    </Dropdown>
                </>
            )}
        </SelectorContainer>
    );
};

const SelectorContainer = styled.div`
  position: relative;
  width: 250px;
`;

const SelectorButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  background: #FAFAFA;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 3rem;
  color: #1a1a1a;
  cursor: pointer;
  transition: all 300ms ease;
  gap: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &:hover {
    border-color: rgba(180, 115, 255, 0.3);
    background: #FFFFFF;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  color: #666666;
`;

const ChevronIcon = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  color: #666666;
  transition: transform 300ms ease;
  transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
`;

const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 100;
  overflow: hidden;
  animation: slideDown 200ms ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const DropdownHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  background: #FAFAFA;
`;

const DropdownTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: 600;
  color: #666666;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  background: #FFFFFF;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  color: #1a1a1a;
  font-size: 0.875rem;

  &::placeholder {
    color: #999999;
  }

  &:focus {
    outline: none;
    border-color: #B473FF;
    box-shadow: 0 0 0 3px rgba(180, 115, 255, 0.1);
  }
`;

const SetList = styled.div`
  max-height: 300px;
  overflow-y: auto;
  background: #FFFFFF;
`;

const SetItem = styled.div<{ $isSelected: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  cursor: pointer;
  transition: all 200ms ease;
  background: ${props => props.$isSelected ? 'rgba(180, 115, 255, 0.08)' : 'transparent'};
  border-left: 3px solid ${props => props.$isSelected ? '#B473FF' : 'transparent'};

  &:hover {
    background: rgba(180, 115, 255, 0.05);
  }
`;

const SetIcon = styled.span`
  font-size: 1.5rem;
`;

const SetName = styled.span`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1a1a1a;
`;

const CheckIcon = styled.span`
  color: #10B981;
  font-weight: 700;
  font-size: 1.25rem;
`;

export default SetSelector;

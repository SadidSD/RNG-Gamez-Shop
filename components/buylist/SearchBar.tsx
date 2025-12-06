'use client';

import React from 'react';
import styled from 'styled-components';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    placeholder = "Search Card Name or Card Number..."
}) => {
    return (
        <SearchContainer>
            <SearchIcon>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </SearchIcon>
            <SearchInput
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            {value && (
                <ClearButton onClick={() => onChange('')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </ClearButton>
            )}
        </SearchContainer>
    );
};

const SearchContainer = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1.5rem;
  color: #666666;
  display: flex;
  align-items: center;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 1.25rem 3.5rem 1.25rem 4rem;
  background: #FAFAFA;
  border: 2px solid rgba(0, 0, 0, 0.08);
  border-radius: 3rem;
  color: #1a1a1a;
  font-size: 1rem;
  transition: all 300ms ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  &::placeholder {
    color: #999999;
  }

  &:focus {
    outline: none;
    border-color: #B473FF;
    background: #FFFFFF;
    box-shadow: 0 0 0 4px rgba(180, 115, 255, 0.1);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 1.5rem;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #EF4444;
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  transition: all 300ms ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  &:hover {
    background: rgba(239, 68, 68, 0.15);
    border-color: #EF4444;
  }
`;

export default SearchBar;

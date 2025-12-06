'use client';

import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    icon?: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    icon,
    type = 'button',
    disabled = false,
    className
}) => {
    return (
        <StyledButton
            onClick={onClick}
            $variant={variant}
            type={type}
            disabled={disabled}
            className={className}
        >
            {icon && <span className="icon">{icon}</span>}
            <span className="text">{children}</span>
        </StyledButton>
    );
};

const StyledButton = styled.button<{ $variant: 'primary' | 'secondary' | 'ghost' }>`
  border: none;
  min-width: 15em;
  height: 5em;
  border-radius: 3em;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  background: ${props => props.$variant === 'primary' ? '#1C1A1C' : 'transparent'};
  cursor: pointer;
  transition: all 450ms ease-in-out;
  position: relative;
  
  ${props => props.$variant === 'ghost' && `
    border: 2px solid rgba(255, 255, 255, 0.1);
  `}

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 800ms ease;
    
    svg {
      fill: #AAAAAA;
      transition: all 800ms ease;
    }
  }

  .text {
    font-weight: 600;
    color: #AAAAAA;
    font-size: medium;
    transition: all 300ms ease;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(0deg, #B473FF, #9917FF);
    box-shadow: inset 0px 1px 0px 0px rgba(255, 255, 255, 0.4),
      inset 0px -4px 0px 0px rgba(0, 0, 0, 0.2),
      0px 0px 0px 4px rgba(255, 255, 255, 0.2),
      0px 0px 180px 0px #9917FF;
    transform: translateY(-2px);

    .text {
      color: white;
    }

    .icon svg {
      fill: white;
      transform: scale(1.2);
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SparkleIcon = () => (
    <svg height={24} width={24} fill="#FFFFFF" viewBox="0 0 24 24" data-name="Layer 1" id="Layer_1">
        <path d="M10,21.236,6.755,14.745.264,11.5,6.755,8.255,10,1.764l3.245,6.491L19.736,11.5l-6.491,3.245ZM18,21l1.5,3L21,21l3-1.5L21,18l-1.5-3L18,18l-3,1.5ZM19.333,4.667,20.5,7l1.167-2.333L24,3.5,21.667,2.333,20.5,0,19.333,2.333,17,3.5Z" />
    </svg>
);

export default Button;

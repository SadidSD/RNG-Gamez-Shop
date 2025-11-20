import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`group relative overflow-hidden bg-white text-black font-bold py-2 px-6 rounded-full transition-colors duration-300 hover:text-white ${className}`}
    >
      <span className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-full">
        <span className="absolute top-full left-1/2 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-purple-600 transition-all duration-500 ease-out group-hover:top-1/2 group-hover:-translate-y-1/2"></span>
      </span>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;

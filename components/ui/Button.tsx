import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className }) => {
  return (
    <motion.button
      onClick={onClick}
      className={`relative overflow-hidden bg-white font-bold py-2 px-6 rounded-full ${className}`}
      initial="initial"
      whileHover="hover"
      animate="initial"
    >
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        aria-hidden="true"
      >
        <motion.div
          className="w-4 h-4 rounded-full bg-[#A855F7]" // Using a nice purple (purple-500/600 equivalent)
          variants={{
            initial: { scale: 0, opacity: 0 },
            hover: { scale: 40, opacity: 1 }, // Scale large enough to cover the button
          }}
          transition={{
            type: "spring",
            duration: 0.5,
            bounce: 0.1,
          }}
        />
      </motion.div>

      <motion.span
        className="relative z-10"
        variants={{
          initial: { color: "#000000" },
          hover: { color: "#ffffff" },
        }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.span>
    </motion.button>
  );
};

export default Button;

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, onClick, className, type = "button", disabled }) => {
  return (
    <motion.button
      // ... (props)
      className={`relative overflow-hidden bg-white font-bold py-3 px-8 rounded-full ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      initial="initial"
      whileHover={disabled ? "initial" : "hover"}
      animate="initial"
    >
      {/* The Expanding Circle */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#B266FF]"
        variants={{
          initial: { scale: 1, translateY: "150%" },
          hover: { scale: 150, translateY: 0 },
        }}
        transition={{
          type: "spring",
          duration: 0.5,
          bounce: 0.1,
          delay: 0
        }}
      />

      <div className="relative z-10 flex items-center justify-center">
        <motion.span
          className="block"
          variants={{
            initial: { x: 0, color: "#000000" },
            hover: { x: -8, color: "#ffffff" },
          }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.span>

        <motion.div
          className="absolute right-[-20px]"
          variants={{
            initial: { opacity: 0, x: -10, color: "#000000" },
            hover: { opacity: 1, x: -4, color: "#ffffff" },
          }}
          transition={{ duration: 0.3 }}
        >
          <ArrowRight size={20} />
        </motion.div>
      </div>
    </motion.button>
  );
};

export default Button;

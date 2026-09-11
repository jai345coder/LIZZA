import React from 'react';

/**
 * StickerBadge - A Gen Z neubrutalist rotated sticker badge component.
 * 
 * @param {string} text - Text inside badge
 * @param {string} variant - 'lime' | 'pink' | 'orange' | 'yellow' | 'dark' | 'white'
 * @param {string} rotate - 'left' | 'right' | 'none' or custom angle
 * @param {string} className - Additional CSS classes
 */
export default function StickerBadge({ 
  text, 
  variant = 'lime', 
  rotate = 'left',
  size = 'md',
  className = '' 
}) {
  const variantStyles = {
    lime: 'bg-[#CCFF00] text-[#1E1E1E]',
    pink: 'bg-[#FF2E93] text-white',
    orange: 'bg-[#FF6B35] text-white',
    yellow: 'bg-[#FFE600] text-[#1E1E1E]',
    dark: 'bg-[#1E1E1E] text-white',
    white: 'bg-white text-[#1E1E1E]',
  };

  const rotateStyles = {
    left: 'rotate-[-3deg]',
    right: 'rotate-[4deg]',
    slightLeft: 'rotate-[-1.5deg]',
    slightRight: 'rotate-[1.5deg]',
    none: 'rotate-0',
  };

  const sizeStyles = {
    sm: 'text-[10px] sm:text-xs px-2 py-0.5 tracking-wider',
    md: 'text-xs sm:text-sm px-2.5 py-1 tracking-wider',
    lg: 'text-sm sm:text-base px-3.5 py-1.5 tracking-wide',
  };

  return (
    <span 
      className={`inline-block font-heading font-extrabold uppercase rounded-lg border-2 border-[#1E1E1E] shadow-[2px_2px_0px_#1E1E1E] transition-transform duration-200 select-none ${variantStyles[variant] || variantStyles.lime} ${rotateStyles[rotate] || rotate} ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {text}
    </span>
  );
}

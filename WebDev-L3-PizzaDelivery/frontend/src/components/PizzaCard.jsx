import React from 'react';
import StickerBadge from './StickerBadge.jsx';

/**
 * PizzaCard - Reusable menu pizza card component for Lizza.
 */
export default function PizzaCard({
  id,
  name,
  price,
  description,
  badgeText,
  badgeVariant = 'lime',
  image,
  bgPattern = 'checkered', // 'checkered' | 'lime' | 'pink' | 'orange' | 'solid'
  onAdd,
  onCustomize,
  isFeatured = false,
  fixedWidth = false,
  className = ''
}) {
  const bgPatternStyles = {
    checkered: 'bg-[radial-gradient(#FF2E93_1px,transparent_1px)] [background-size:12px_12px] bg-[#FFF0F5]',
    lime: 'bg-[#CCFF00]',
    pink: 'bg-[#FF2E93]',
    orange: 'bg-[#FF6B35]',
    solid: 'bg-amber-50',
    purple: 'bg-[#9D4EDD]',
    teal: 'bg-[#00F5D4]',
  };

  const widthClass = fixedWidth ? 'w-[260px] sm:w-[285px] flex-shrink-0 snap-start' : '';

  return (
    <div className={`neo-card flex flex-col justify-between overflow-hidden bg-white group transition-all duration-200 hover:-translate-y-1.5 hover:neo-shadow-lg ${isFeatured && !fixedWidth ? 'col-span-1 md:col-span-2' : ''} ${widthClass} ${className}`}>
      {/* Top Media Header */}
      <div className={`relative w-full ${isFeatured && !fixedWidth ? 'h-52 sm:h-64' : 'h-48 sm:h-52'} overflow-hidden border-b-2.5 border-[#1E1E1E] flex items-center justify-center p-3 ${bgPatternStyles[bgPattern] || bgPatternStyles.solid}`}>
        {/* Sticker Badge Overlay (Anchored Top-Left) */}
        {badgeText && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <StickerBadge text={badgeText} variant={badgeVariant} rotate="left" size="sm" />
          </div>
        )}

        {/* Product Image */}
        <img
          src={image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80'}
          alt={name}
          className="max-h-full max-w-full object-contain drop-shadow-[0_8px_12px_rgba(0,0,0,0.25)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2"
        />
      </div>

      {/* Card Content Details */}
      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5 min-h-[44px]">
            <h3 className="font-heading font-extrabold text-base sm:text-lg text-[#1E1E1E] leading-snug group-hover:text-[#FF6B35] transition-colors uppercase tracking-tight" title={name}>
              {name}
            </h3>
            <span className="font-heading font-black text-base sm:text-lg text-[#FF6B35] whitespace-nowrap">
              ${typeof price === 'number' ? price.toFixed(2) : price}
            </span>
          </div>

          {description && (
            <p className="text-xs text-gray-600 font-medium line-clamp-2 mb-3 leading-relaxed min-h-[32px]">
              {description}
            </p>
          )}
        </div>

        {/* Action Buttons Aligned at Bottom */}
        <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
          <button
            onClick={() => onAdd && onAdd(id)}
            className="flex-1 neo-btn py-2 px-3 bg-[#FF6B35] hover:bg-[#ff5a22] text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-1 cursor-pointer active:translate-y-0.5"
          >
            <span>ADD</span>
            <span className="text-base leading-none">+</span>
          </button>
          
          {onCustomize && (
            <button
              onClick={() => onCustomize && onCustomize(id)}
              className="neo-btn py-2 px-2.5 bg-white hover:bg-gray-100 text-[#1E1E1E] font-heading font-bold text-xs uppercase rounded-xl cursor-pointer"
              title="Customize pizza"
            >
              ⚙️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


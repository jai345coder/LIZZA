import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Check, ArrowRight } from 'lucide-react';

export default function BuilderScreen({ onNextStep, onOpenCart, cartCount = 2 }) {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [selectedBase, setSelectedBase] = useState('Hand-Tossed');

  const bases = [
    {
      id: 'hand-tossed',
      name: 'Hand-Tossed',
      desc: 'Classic airy crust with a slight chew. The OG.',
      extra: '+$0.00',
      image: '/images/dough.png'
    },
    {
      id: 'thin-crust',
      name: 'Thin Crust',
      desc: 'Super crispy & light for maximum topping flavor.',
      extra: '+$1.00',
      image: '/images/dough.png'
    },
    {
      id: 'cauliflower',
      name: 'Cauliflower',
      desc: 'Gluten-free & wholesome, surprisingly crispy!',
      extra: '+$2.50',
      image: '/images/dough.png'
    }
  ];

  const handleCartClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      navigate('/order-summary');
    }
  };

  const handleNextClick = () => {
    if (onNextStep) {
      onNextStep();
    } else {
      navigate('/order-summary');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F0] pb-28 w-full relative flex flex-col">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#FFF5F0] px-4 md:px-6 py-3.5 flex items-center justify-between border-b-2 border-black/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#FF6B35] neo-border flex items-center justify-center">
            <span className="text-white font-heading font-black text-sm">L</span>
          </div>
          <span className="font-heading font-extrabold text-2xl tracking-tight text-[#C4380B] italic">
            Lizza
          </span>
        </div>

        <button
          onClick={handleCartClick}
          className="relative bg-white neo-btn p-2 rounded-xl flex items-center justify-center hover:bg-amber-50 cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5 text-black stroke-[2.5]" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-[#FF4081] text-white font-extrabold text-[11px] w-5 h-5 rounded-full neo-border flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </header>

      <main className="px-4 md:px-6 py-4 space-y-5 flex-1">
        {/* Step Indicator Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 1, label: '1. Base' },
            { id: 2, label: '2. Sauce' },
            { id: 3, label: '3. Cheese' }
          ].map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`py-2 px-4 rounded-xl font-heading font-extrabold text-sm whitespace-nowrap neo-btn transition-all cursor-pointer ${
                activeStep === step.id
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              {step.label}
            </button>
          ))}
        </div>

        {/* Header Heading */}
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-black tracking-tight leading-tight">
            Pick your{' '}
            <span className="underline decoration-[#C4380B] decoration-4 underline-offset-4 text-[#C4380B]">
              foundation
            </span>{' '}
            🍕
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-gray-700">
            Every great pizza starts with a legendary crust. Choose yours wisely!
          </p>
        </div>

        {/* Option Selection Cards - Horizontal scroll on mobile, grid layout on tablet/desktop */}
        <div className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible no-scrollbar py-2 px-1">
          {bases.map((base) => {
            const isSelected = selectedBase === base.name;
            return (
              <div
                key={base.id}
                onClick={() => setSelectedBase(base.name)}
                className={`min-w-[240px] sm:min-w-0 flex-shrink-0 sm:flex-shrink bg-white rounded-3xl neo-border-thick p-4 sm:p-5 flex flex-col items-center text-center relative cursor-pointer transition-all ${
                  isSelected ? 'border-[#C4380B] neo-shadow-lg ring-2 ring-[#C4380B]/20' : 'neo-shadow opacity-90'
                }`}
              >
                {/* Active Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-4 right-4 w-8 h-8 sm:w-9 sm:h-9 bg-[#C4380B] text-white rounded-full neo-border flex items-center justify-center">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
                  </div>
                )}

                {/* Dough Image Circle */}
                <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#FFE8D6] neo-border flex items-center justify-center overflow-hidden mb-4 p-2 shadow-inner">
                  <img
                    src={base.image}
                    alt={base.name}
                    className="w-28 h-28 sm:w-36 sm:h-36 object-contain drop-shadow-md"
                  />
                </div>

                <h3 className="font-heading font-extrabold text-lg sm:text-xl text-black mb-1">
                  {base.name}
                </h3>
                <p className="text-xs font-medium text-gray-600 mb-4 px-2 line-clamp-2">
                  {base.desc}
                </p>

                {/* Price Pill Badge */}
                <span className="bg-[#FF80AB] text-black font-heading font-extrabold text-xs py-1.5 px-4 rounded-full neo-badge mt-auto">
                  {base.extra}
                </span>
              </div>
            );
          })}
        </div>

        {/* Feature Badges */}
        <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
          <div className="flex-1 bg-[#FFD6E0] neo-border neo-shadow-sm p-3 rounded-full flex items-center justify-center gap-2">
            <span className="font-heading font-extrabold text-xs sm:text-sm text-black">
              Freshly Baked 🔥
            </span>
          </div>

          <div className="flex-1 bg-[#FFE8D6] neo-border neo-shadow-sm p-3 rounded-full flex items-center justify-center gap-2">
            <span className="font-heading font-extrabold text-xs sm:text-sm text-black">
              100% Organic 🌿
            </span>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Action Bar */}
      <footer className="sticky bottom-0 z-30 bg-white neo-border-thick border-t-2 px-4 md:px-6 py-3.5 flex items-center justify-between shadow-2xl">
        <div>
          <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest font-heading block">
            TOTAL PRICE
          </span>
          <span className="font-heading font-black text-xl sm:text-2xl text-[#C4380B]">
            $10.00
          </span>
        </div>

        <button
          onClick={handleNextClick}
          className="bg-[#FF6B35] text-white neo-btn font-heading font-extrabold text-base py-3 px-5 sm:px-6 rounded-2xl flex items-center gap-2 hover:bg-[#FF5A26] cursor-pointer"
        >
          <span>Next Step</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </footer>
    </div>
  );
}


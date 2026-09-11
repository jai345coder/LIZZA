import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Truck, Ticket, ArrowRight, ShoppingBag, FileText } from 'lucide-react';

export default function CheckoutScreen({ onPayNow, onBackToBuilder, onOpenCart, cartCount = 2 }) {
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(true);

  const handleBackClick = () => {
    if (onBackToBuilder) {
      onBackToBuilder();
    } else {
      navigate('/build');
    }
  };

  const handlePayClick = () => {
    if (onPayNow) {
      onPayNow();
    } else {
      navigate('/orders/1/track');
    }
  };

  const handleCartClick = () => {
    if (onOpenCart) {
      onOpenCart();
    } else {
      navigate('/order-summary');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5F0] pb-24 w-full relative">
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

      <main className="px-4 md:px-6 py-4 space-y-5">
        {/* Back Link */}
        <button
          onClick={handleBackClick}
          className="flex items-center gap-1.5 text-[#C4380B] font-heading font-extrabold text-sm hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 stroke-[3]" />
          <span>Edit My Pizza</span>
        </button>

        {/* 2-Column Responsive Layout on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left Column: Masterpiece & Delivery info */}
          <div className="space-y-5">
            {/* Your Custom Masterpiece Card */}
            <div className="bg-white neo-card p-4 relative overflow-hidden space-y-3">
              {/* CHEF'S KISS Tilted Pink Badge */}
              <div className="absolute top-2 right-2 rotate-6 z-10">
                <span className="bg-[#FF80AB] text-black font-heading font-extrabold text-[10px] uppercase px-3 py-1 rounded-md neo-badge">
                  CHEF'S KISS
                </span>
              </div>

              {/* Pizza Visual Banner */}
              <div className="w-full h-44 bg-[#FFF5F0] rounded-xl neo-border relative overflow-hidden flex items-center justify-center">
                <img
                  src="/images/pepperoni.png"
                  alt="Custom Pizza"
                  className="w-40 h-40 object-contain drop-shadow-md"
                />
              </div>

              {/* Details */}
              <div>
                <h3 className="font-heading font-extrabold text-xl text-black">
                  Your Custom Masterpiece
                </h3>
                <p className="text-xs font-semibold text-gray-500">
                  Custom Build #2910
                </p>
              </div>

              {/* Topping Pills */}
              <div className="flex flex-wrap gap-2 pt-1">
                {['Thin Crust', 'Classic Tomato', 'Mozzarella', 'Extra Pepperoni'].map((item) => (
                  <span
                    key={item}
                    className="bg-[#FFE8D6] text-black neo-border px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                  >
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Deliver to Home Card */}
            <div className="bg-[#FFE8D6] neo-card p-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1E1E1E] text-white flex items-center justify-center flex-shrink-0">
                  <Truck className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="font-heading font-extrabold text-sm text-black leading-tight">
                    Deliver to Home
                  </h4>
                  <p className="text-[11px] font-medium text-gray-600">
                    123 Neon Street, Cyber District, 90210
                  </p>
                </div>
              </div>

              <button className="bg-white neo-btn px-3 py-1.5 rounded-xl text-xs font-bold text-black hover:bg-gray-50 cursor-pointer flex-shrink-0">
                Change
              </button>
            </div>
          </div>

          {/* Right Column: Bill Summary, Promo, Pay */}
          <div className="space-y-5">
            {/* Bill Summary Card */}
            <div className="bg-white neo-card p-5 space-y-3 relative">
              <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-2">
                <FileText className="w-5 h-5 text-black stroke-[2.5]" />
                <h4 className="font-heading font-extrabold text-base text-black">
                  Bill Summary
                </h4>
              </div>

              <div className="space-y-2 text-xs sm:text-sm font-semibold text-gray-700 pt-1">
                <div className="flex justify-between">
                  <span>Base Pizza (Large)</span>
                  <span className="font-bold text-black">$10.00</span>
                </div>
                <div className="flex justify-between">
                  <span>Toppings (x3)</span>
                  <span className="font-bold text-black">$2.50</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-black">$1.99</span>
                </div>
              </div>

              {/* Divider with OFFER APPLIED Tilted Neon Green Badge */}
              <div className="relative pt-3 pb-2">
                <div className="border-t-2 border-black"></div>
                {promoApplied && (
                  <div className="absolute right-2 -top-2 rotate-[-4deg]">
                    <span className="bg-[#AEEA00] text-black font-heading font-extrabold text-[10px] uppercase px-2.5 py-0.5 rounded-md neo-badge">
                      OFFER APPLIED
                    </span>
                  </div>
                )}
              </div>

              {/* TOTAL */}
              <div className="flex items-baseline justify-between pt-1">
                <span className="font-heading font-black text-xl text-black">
                  TOTAL
                </span>
                <span className="font-heading font-black text-2xl sm:text-3xl text-[#C4380B]">
                  $14.49
                </span>
              </div>
            </div>

            {/* Promo Code Box */}
            <div className="bg-[#E5E5E5] neo-card p-2 px-3 flex items-center gap-2">
              <Ticket className="w-5 h-5 text-gray-700 stroke-[2.5]" />
              <input
                type="text"
                placeholder="Promo Code?"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-transparent border-none text-xs sm:text-sm font-bold text-black placeholder:text-gray-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setPromoApplied(true)}
                className="text-xs font-extrabold text-[#C4380B] hover:underline px-2 cursor-pointer"
              >
                Apply
              </button>
            </div>

            {/* Action Pay Button */}
            <div className="pt-2 text-center space-y-2">
              <button
                onClick={handlePayClick}
                className="w-full bg-[#FF6B35] text-white neo-btn font-heading font-black text-xl py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#FF5A26] cursor-pointer"
              >
                <span>PAY NOW</span>
                <ArrowRight className="w-6 h-6 stroke-[3]" />
              </button>

              <p className="text-[10px] sm:text-xs font-bold text-gray-500">
                Secure payment via LizzaPay™
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


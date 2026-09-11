import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, MessageSquare, Bike, ChefHat, PartyPopper, FileCheck } from 'lucide-react';

export default function TrackerScreen({ onOpenCart, cartCount = 2 }) {
  const navigate = useNavigate();

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

      <main className="px-4 md:px-6 py-5 space-y-6">
        {/* Main Heading & ETA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-black tracking-tight leading-tight">
              Your pizza is on <br className="hidden sm:inline" />a{' '}
              <span className="underline decoration-[#C4380B] decoration-4 underline-offset-4 text-[#C4380B]">
                journey!
              </span>
            </h2>
          </div>

          {/* ETA Pink Badge */}
          <div className="inline-block transform -rotate-2 self-start sm:self-auto">
            <div className="bg-[#FF80AB] text-black font-heading font-black text-sm sm:text-base px-5 py-2 sm:px-6 sm:py-2.5 rounded-xl neo-border neo-shadow">
              ETA: 12 MINS
            </div>
          </div>
        </div>

        {/* 2-Column Responsive Layout on tablet/desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Left Column: Progress Timeline & Map */}
          <div className="space-y-5">
            {/* Progress Tracker Horizontal Step Timeline */}
            <div className="bg-white neo-card p-4 sm:p-5 space-y-4">
              <div className="relative flex items-center justify-between px-1">
                {/* Connecting line */}
                <div className="absolute top-6 sm:top-7 left-4 right-4 h-1 bg-gray-200 -z-0"></div>
                <div className="absolute top-6 sm:top-7 left-4 w-2/3 h-1 bg-[#FF6B35] -z-0"></div>

                {/* Step 1: Order Received */}
                <div className="flex flex-col items-center gap-1.5 z-10 w-14 sm:w-16">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFE8D6] neo-border flex items-center justify-center">
                    <FileCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#C4380B]" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-black font-heading text-center leading-tight">
                    Order Received
                  </span>
                </div>

                {/* Step 2: In Kitchen */}
                <div className="flex flex-col items-center gap-1.5 z-10 w-14 sm:w-16">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFE8D6] neo-border flex items-center justify-center">
                    <ChefHat className="w-4 h-4 sm:w-5 sm:h-5 text-[#C4380B]" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-extrabold text-black font-heading text-center leading-tight">
                    In Kitchen
                  </span>
                </div>

                {/* Step 3: Out for Delivery (Active Glow) */}
                <div className="flex flex-col items-center gap-1.5 z-10 w-14 sm:w-16">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#FF6B35] neo-border animate-pulse-glow flex items-center justify-center text-white scale-110">
                    <Bike className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-black text-[#FF5A26] font-heading text-center leading-tight">
                    Out for Delivery
                  </span>
                </div>

                {/* Step 4: Delivered */}
                <div className="flex flex-col items-center gap-1.5 z-10 w-14 sm:w-16 opacity-40">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 border-2 border-gray-300 flex items-center justify-center">
                    <PartyPopper className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 font-heading text-center leading-tight">
                    Delivered
                  </span>
                </div>
              </div>
            </div>

            {/* Live Order Simulation Map Card */}
            <div className="bg-white neo-card p-4 space-y-3 relative overflow-hidden">
              <p className="text-center font-heading font-extrabold text-xs text-black tracking-wide">
                Track Your Order - Lizza
              </p>

              <div className="w-full h-56 sm:h-64 bg-[#F4F1EA] neo-border rounded-xl relative overflow-hidden p-2">
                {/* Map Roads & Route Grid Simulation */}
                <svg className="w-full h-full absolute inset-0 opacity-40" viewBox="0 0 300 200">
                  <path d="M 20 180 L 120 120 L 180 140 L 260 40" stroke="#1E1E1E" strokeWidth="6" fill="none" strokeDasharray="6 4" />
                  <path d="M 0 50 L 300 50" stroke="#DDD" strokeWidth="4" fill="none" />
                  <path d="M 0 120 L 300 120" stroke="#DDD" strokeWidth="4" fill="none" />
                  <path d="M 100 0 L 100 200" stroke="#DDD" strokeWidth="4" fill="none" />
                  <path d="M 220 0 L 220 200" stroke="#DDD" strokeWidth="4" fill="none" />
                </svg>

                {/* Estimated Delivery Time Box on Map */}
                <div className="absolute top-3 left-4 bg-white neo-border px-3 py-1.5 rounded-lg z-10 text-[10px] sm:text-xs font-bold">
                  <span className="block text-gray-500 font-semibold">Order #A3489</span>
                  <span className="text-black font-extrabold">Estimated Delivery: 24 min</span>
                </div>

                {/* Lizza HQ Pin */}
                <div className="absolute bottom-4 left-6 flex items-center gap-1.5 bg-white neo-border p-1.5 px-2.5 rounded-lg z-10">
                  <span className="text-sm">🍕</span>
                  <span className="text-[10px] sm:text-xs font-black font-heading text-black">Lizza HQ</span>
                </div>

                {/* Courier Live Bike Pin */}
                <div className="absolute top-20 right-16 z-20 animate-bounce">
                  <div className="bg-[#FF6B35] text-white p-2.5 rounded-xl neo-border shadow-lg">
                    <Bike className="w-5 h-5 stroke-[3]" />
                  </div>
                </div>

                {/* Customer Destination Pin */}
                <div className="absolute top-6 right-8 bg-white neo-border p-2 rounded-xl z-10">
                  <span className="text-sm">🏠</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Courier & Communication info */}
          <div className="space-y-5">
            {/* Courier Info Card */}
            <div className="bg-[#FFE8D6] neo-card p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#FF80AB] neo-border flex items-center justify-center text-xl font-bold">
                  👨‍🍳
                </div>
                <div>
                  <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block font-heading">
                    YOUR COURIER
                  </span>
                  <h4 className="font-heading font-extrabold text-base sm:text-lg text-black leading-tight">
                    Marco P.
                  </h4>
                </div>
              </div>

              <div className="bg-[#AEEA00] text-black font-heading font-black text-xs sm:text-sm px-3 py-1 rounded-lg neo-border flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-black stroke-none" />
                <span>4.9</span>
              </div>
            </div>

            {/* Communication / Message Card */}
            <div className="bg-[#FFE8D6] neo-card p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white neo-border flex items-center justify-center text-black flex-shrink-0">
                <MessageSquare className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest block font-heading">
                  NEED TO TALK?
                </span>
                <h4 className="font-heading font-extrabold text-sm sm:text-base text-black leading-tight">
                  Message Marco
                </h4>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


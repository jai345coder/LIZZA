import React, { useState, useEffect, useRef } from 'react';
import StickerBadge from '../components/StickerBadge.jsx';
import CursorStickerTrail from '../components/CursorStickerTrail.jsx';
import PizzaLogoIcon from '../components/PizzaLogoIcon.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

const CURVED_PIZZA_ITEMS = [
  {
    id: 1,
    name: 'Buffalo Rizz',
    tag: '🔥 HOT',
    borderColorDark: 'border-[#CCFF00]',
    borderColorLight: 'border-[#FF6B35]',
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    name: 'BBQ Chaos',
    tag: '✨ NEW',
    borderColorDark: 'border-[#FF007F]',
    borderColorLight: 'border-[#FF2E93]',
    image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    name: 'Truffle Bomb',
    tag: '🍄 BEST',
    borderColorDark: 'border-[#FFE600]',
    borderColorLight: 'border-[#FFE600]',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 4,
    name: 'Pepperoni Party',
    tag: '🍕 CLASSIC',
    borderColorDark: 'border-[#CCFF00]',
    borderColorLight: 'border-[#FF6B35]',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 5,
    name: 'Cheesy Pull',
    tag: '🧀 EXTRA',
    borderColorDark: 'border-[#FF007F]',
    borderColorLight: 'border-[#FF2E93]',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 6,
    name: 'Veggie Supreme',
    tag: '🌱 FRESH',
    borderColorDark: 'border-[#00CBD6]',
    borderColorLight: 'border-[#00CBD6]',
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 7,
    name: 'Spicy Honey',
    tag: '🍯 SWEET',
    borderColorDark: 'border-[#FFE600]',
    borderColorLight: 'border-[#FFE600]',
    image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 8,
    name: 'Margherita Vibe',
    tag: '⭐ 5-STAR',
    borderColorDark: 'border-[#CCFF00]',
    borderColorLight: 'border-[#FF6B35]',
    image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?w=300&auto=format&fit=crop&q=80',
  },
];

/**
 * Infinite Curved Pizza Arch Motion Component
 */
function InfiniteCurvedPizzaTrack({ isDark }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animFrame;
    const animate = () => {
      setProgress((prev) => (prev + 0.0012) % 1);
      animFrame = requestAnimationFrame(animate);
    };
    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  const total = CURVED_PIZZA_ITEMS.length;

  return (
    <div className="relative w-full max-w-4xl h-64 mt-8 flex items-center justify-center overflow-hidden">
      {/* Upper Arch Curve SVG */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 240" fill="none">
        <path
          d="M 40 220 Q 400 10 760 220"
          stroke={isDark ? '#CCFF00' : '#FF6B35'}
          strokeWidth="3"
          strokeDasharray="10 10"
          className="opacity-75 transition-colors duration-300"
        />
      </svg>

      {/* Moving Pizza Items along quadratic Bézier curve */}
      {CURVED_PIZZA_ITEMS.map((item, idx) => {
        const itemProgress = (progress + idx / total) % 1;

        // Quadratic Bézier math: P(t) = (1-t)^2 P0 + 2(1-t)t P1 + t^2 P2
        const t = itemProgress;
        const x = (1 - t) * (1 - t) * 40 + 2 * (1 - t) * t * 400 + t * t * 760;
        const y = (1 - t) * (1 - t) * 220 + 2 * (1 - t) * t * 10 + t * t * 220;

        // Scale & Opacity curves: larger at peak (t ~ 0.5), transparent at ends (t ~ 0 or 1)
        const distFromCenter = Math.abs(t - 0.5);
        const opacity = Math.sin(t * Math.PI);
        const scale = 0.65 + (1 - distFromCenter * 2) * 0.45;

        const borderColor = isDark ? item.borderColorDark : item.borderColorLight;
        const bgColor = isDark ? 'bg-[#1C1C1E]' : 'bg-white';

        return (
          <div
            key={item.id}
            className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{
              left: `${(x / 800) * 100}%`,
              top: `${(y / 240) * 100}%`,
              opacity: Math.max(0, opacity),
              transform: `translate(-50%, -50%) scale(${scale})`,
              zIndex: Math.round(opacity * 10),
            }}
          >
            <div className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 ${borderColor} p-1 ${bgColor} neo-shadow flex items-center justify-center overflow-hidden group-hover:scale-125 transition-transform duration-200`}>
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded-full"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              <span className="absolute bottom-1 bg-black/80 text-white font-heading font-black text-[9px] px-1.5 py-0.5 rounded border border-white/30 backdrop-blur-sm whitespace-nowrap">
                {item.tag}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function LandingPage({ onNavigate }) {
  const { isDark, toggleTheme } = useTheme();
  const [labStep, setLabStep] = useState(1);
  const [baked, setBaked] = useState(false);
  const lowdownRef = useRef(null);

  const handleNav = (target) => {
    if (onNavigate) {
      onNavigate(target);
    }
  };

  return (
    <div className={`min-h-screen w-full relative overflow-x-hidden font-sans selection:bg-[#CCFF00] selection:text-black transition-colors duration-300 ${
      isDark ? 'bg-[#0D0D0E] text-white' : 'bg-[#FFF5F0] text-[#1E1E1E]'
    }`}>
      {/* Interactive Cursor Emoji Trail Animation (First fold only, stops at THE LOWDOWN section) */}
      <CursorStickerTrail boundaryRef={lowdownRef} />

      {/* ----------------- NAVBAR ----------------- */}
      <nav className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between border-b relative z-20 transition-colors ${
        isDark ? 'border-white/10' : 'border-black/10'
      }`}>
        {/* Brand Logo */}
        <div 
          onClick={() => handleNav('menu')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className={`w-11 h-11 neo-border neo-shadow rounded-2xl flex items-center justify-center rotate-[-4deg] group-hover:rotate-0 transition-transform ${
            isDark ? 'bg-[#1C1C1E] border-white/20' : 'bg-white border-[#1E1E1E]'
          }`}>
            <PizzaLogoIcon className="w-8 h-8" />
          </div>
          <span className={`font-heading font-black text-3xl sm:text-4xl tracking-tight group-hover:scale-105 transition-all ${
            isDark ? 'text-[#CCFF00]' : 'text-[#FF6B35]'
          }`}>
            LIZZA
          </span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-heading font-extrabold tracking-wide uppercase">
          <button 
            onClick={() => handleNav('menu')}
            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-[#CCFF00]' : 'hover:text-[#FF6B35]'}`}
          >
            Menu
          </button>
          <button 
            onClick={() => handleNav('builder')}
            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-[#CCFF00]' : 'hover:text-[#FF6B35]'}`}
          >
            Build Your Own
          </button>
          <button 
            onClick={() => handleNav('track')}
            className={`transition-colors cursor-pointer ${isDark ? 'hover:text-[#CCFF00]' : 'hover:text-[#FF6B35]'}`}
          >
            Track Order
          </button>
          <a href="#vibe-check" className={`transition-colors cursor-pointer ${isDark ? 'hover:text-[#CCFF00]' : 'hover:text-[#FF6B35]'}`}>
            Reviews
          </a>
        </div>

        {/* Action Buttons & Theme Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          {/* Light / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`px-2 py-1.5 sm:px-3 sm:py-2 font-heading font-extrabold text-[10px] sm:text-xs uppercase rounded-xl neo-border cursor-pointer transition-all flex items-center gap-1 sm:gap-1.5 ${
              isDark
                ? 'bg-[#1C1C1E] text-[#CCFF00] border-white/20 hover:border-[#CCFF00]'
                : 'bg-white text-[#FF6B35] border-[#1E1E1E] hover:bg-gray-50'
            }`}
            title="Toggle Light/Dark Mode"
          >
            <span className="text-sm">{isDark ? '🌙' : '☀️'}</span>
            <span className="hidden sm:inline">{isDark ? 'DARK' : 'LIGHT'}</span>
          </button>

          <button
            onClick={() => handleNav('login')}
            className={`px-2 py-1.5 sm:px-4 sm:py-2 border-2 font-heading font-bold text-[10px] sm:text-xs uppercase rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              isDark
                ? 'border-white text-white hover:bg-white hover:text-black'
                : 'border-[#1E1E1E] text-[#1E1E1E] bg-white hover:bg-[#1E1E1E] hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => handleNav('summary')}
            className={`px-2 py-1.5 sm:px-4 sm:py-2 font-heading font-black text-[10px] sm:text-xs uppercase rounded-xl border-2 border-black neo-shadow-sm transition-transform cursor-pointer whitespace-nowrap ${
              isDark
                ? 'bg-[#CCFF00] text-black hover:bg-[#b8e600]'
                : 'bg-[#FF6B35] text-white hover:bg-[#ff5a22]'
            }`}
          >
            Your Box
          </button>
        </div>
      </nav>

      {/* ----------------- HERO SECTION ----------------- */}
      <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Evenly Spaced Decorative Stickers (6 Total: 3 Left, 3 Right) */}
        {/* Left Side Stickers */}
        <div className="absolute top-12 left-6 hidden lg:block rotate-[-12deg] z-10 pointer-events-auto hover:rotate-0 hover:scale-110 transition-all cursor-pointer">
          <StickerBadge text="🍕 100% CHAOS" variant={isDark ? 'lime' : 'orange'} size="md" />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 left-8 hidden lg:block rotate-[10deg] z-10 pointer-events-auto hover:rotate-0 hover:scale-110 transition-all cursor-pointer">
          <StickerBadge text="⚡ HOT & READY 24/7" variant="pink" size="sm" />
        </div>
        <div className="absolute bottom-12 left-6 hidden lg:block rotate-[-8deg] z-10 pointer-events-auto hover:rotate-0 hover:scale-110 transition-all cursor-pointer">
          <StickerBadge text="🔥 NO RULES JUST DOUGH" variant="yellow" size="md" />
        </div>

        {/* Right Side Stickers */}
        <div className="absolute top-12 right-6 hidden lg:block rotate-[12deg] z-10 pointer-events-auto hover:rotate-0 hover:scale-110 transition-all cursor-pointer">
          <StickerBadge text="🧀 CHEESE OVERLOAD" variant={isDark ? 'orange' : 'lime'} size="md" />
        </div>
        <div className="absolute top-1/2 -translate-y-1/2 right-8 hidden lg:block rotate-[-10deg] z-10 pointer-events-auto hover:rotate-0 hover:scale-110 transition-all cursor-pointer">
          <StickerBadge text="🌶️ SPICY VIBE" variant="pink" size="sm" />
        </div>
        <div className="absolute bottom-12 right-6 hidden lg:block rotate-[8deg] z-10 pointer-events-auto hover:rotate-0 hover:scale-110 transition-all cursor-pointer">
          <StickerBadge text="📦 CRUST HQ" variant={isDark ? 'lime' : 'yellow'} size="md" />
        </div>

        {/* Top Decorative Floating Badges */}
        <div className="mb-4">
          <StickerBadge text="🔥 NEW DROP OUT NOW" variant="pink" size="md" />
        </div>

        {/* Main Headline with Stacked Sticker Badges */}
        <div className="relative inline-block my-2">
          <h1 className={`font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.95] max-w-5xl ${
            isDark ? 'text-white' : 'text-[#1E1E1E]'
          }`}>
            PIZZA HITS DIFFERENT
          </h1>
          {/* Stacked Neobrutalist Sticker Badge directly overlapping the title */}
          <div className="absolute -bottom-3 sm:-bottom-5 right-4 sm:right-16 transform rotate-[-8deg] z-10 hover:rotate-0 hover:scale-105 transition-all cursor-pointer">
            <StickerBadge text="🍕 100% FRESH & CHAOTIC" variant={isDark ? 'pink' : 'lime'} size="lg" className="neo-shadow-lg" />
          </div>
        </div>

        {/* Sub CTA Button */}
        <div className="mt-8 relative z-20">
          <button
            onClick={() => handleNav('menu')}
            className={`neo-btn px-8 py-4 font-heading font-black text-base sm:text-lg uppercase tracking-wider rounded-2xl flex items-center gap-3 transition-all cursor-pointer ${
              isDark
                ? 'bg-white text-black shadow-[4px_4px_0px_#CCFF00] hover:bg-[#CCFF00]'
                : 'bg-[#FF6B35] text-white shadow-[4px_4px_0px_#1E1E1E] hover:bg-[#ff5a22]'
            }`}
          >
            ORDER NOW <span className="text-xl">⚡</span>
          </button>
        </div>

        {/* Infinite Curved Dotted Arc Pizza Animation */}
        <InfiniteCurvedPizzaTrack isDark={isDark} />
      </section>

      {/* ----------------- SECTION 1: THE LOWDOWN ----------------- */}
      <section ref={lowdownRef} className={`w-full border-y py-16 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDark ? 'bg-[#141416] border-white/10' : 'bg-white border-black/10'
      }`}>
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Title */}
          <div className="inline-block">
            <span className={`font-heading font-black text-2xl sm:text-3xl px-4 py-1 rounded-md uppercase tracking-wide neo-border border-black ${
              isDark ? 'bg-[#CCFF00] text-black' : 'bg-[#FF6B35] text-white'
            }`}>
              THE LOWDOWN
            </span>
          </div>

          {/* 3 Step Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className={`neo-border p-6 rounded-2xl relative space-y-4 transition-all ${
              isDark ? 'bg-[#1C1C1E] border-white/20 hover:border-[#CCFF00]' : 'bg-[#FFF5F0] border-[#1E1E1E] hover:border-[#FF6B35]'
            }`}>
              <div className={`w-8 h-8 font-heading font-black flex items-center justify-center rounded-lg neo-border border-black text-sm ${
                isDark ? 'bg-[#FF007F] text-white' : 'bg-[#FF6B35] text-white'
              }`}>
                1
              </div>
              <div className="text-3xl">🎯</div>
              <h3 className={`font-heading font-black text-xl uppercase tracking-tight ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                PICK IT
              </h3>
              <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Select the pie. Find the vibe that matches your hunger level. No basic options allowed.
              </p>
            </div>

            {/* Step 2 */}
            <div className={`neo-border p-6 rounded-2xl relative space-y-4 transition-all ${
              isDark ? 'bg-[#1C1C1E] border-white/20 hover:border-[#CCFF00]' : 'bg-[#FFF5F0] border-[#1E1E1E] hover:border-[#FF6B35]'
            }`}>
              <div className={`w-8 h-8 font-heading font-black flex items-center justify-center rounded-lg neo-border border-black text-sm ${
                isDark ? 'bg-[#FF007F] text-white' : 'bg-[#FF6B35] text-white'
              }`}>
                2
              </div>
              <div className="text-3xl">🛠️</div>
              <h3 className={`font-heading font-black text-xl uppercase tracking-tight ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                BUILD IT
              </h3>
              <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Go wild. Stack toppings like you stack code. Your rules, our oven.
              </p>
            </div>

            {/* Step 3 */}
            <div className={`neo-border p-6 rounded-2xl relative space-y-4 transition-all ${
              isDark ? 'bg-[#1C1C1E] border-white/20 hover:border-[#CCFF00]' : 'bg-[#FFF5F0] border-[#1E1E1E] hover:border-[#FF6B35]'
            }`}>
              <div className={`w-8 h-8 font-heading font-black flex items-center justify-center rounded-lg neo-border border-black text-sm ${
                isDark ? 'bg-[#FF007F] text-white' : 'bg-[#FF6B35] text-white'
              }`}>
                3
              </div>
              <div className="text-3xl">🚚</div>
              <h3 className={`font-heading font-black text-xl uppercase tracking-tight ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                GET IT
              </h3>
              <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Hot, fast, and dropped at your door before the next match starts. We got you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 2: HYPE DROPS ----------------- */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10">
        <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-white/10' : 'border-black/10'}`}>
          <div className="relative">
            <h2 className={`font-heading font-black text-3xl sm:text-4xl uppercase tracking-tight ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
              HYPE DROPS
            </h2>
            <div className={`h-1.5 w-full mt-1 rounded-full ${isDark ? 'bg-[#FF007F]' : 'bg-[#FF6B35]'}`}></div>
          </div>
          <button 
            onClick={() => handleNav('menu')}
            className={`font-heading font-black text-xs uppercase hover:underline cursor-pointer tracking-wider ${
              isDark ? 'text-[#CCFF00]' : 'text-[#FF6B35]'
            }`}
          >
            SEE ALL &gt;&gt;
          </button>
        </div>

        {/* Product Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className={`neo-border rounded-2xl p-4 flex flex-col justify-between space-y-4 group transition-all ${
            isDark ? 'bg-[#18181A] border-white/20 hover:border-[#CCFF00]' : 'bg-white border-[#1E1E1E] neo-shadow hover:border-[#FF6B35]'
          }`}>
            <div className="relative h-48 rounded-xl overflow-hidden neo-border border-black/10 bg-gray-100">
              <span className="absolute top-2 left-2 z-10">
                <StickerBadge text="SPICY AF 🌶️" variant="pink" size="sm" />
              </span>
              <img
                src="https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500&auto=format&fit=crop&q=80"
                alt="Buffalo Rizz"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="space-y-2">
              <h3 className={`font-heading font-black text-xl uppercase ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                BUFFALO RIZZ
              </h3>
              <p className={`text-xs leading-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Crispy chicken, nuclear buffalo sauce, ranch drizzle, jalapeños. Not for the weak.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className={`font-heading font-black text-lg ${isDark ? 'text-[#CCFF00]' : 'text-[#FF6B35]'}`}>
                $18.99
              </span>
              <button
                onClick={() => handleNav('builder')}
                className={`px-4 py-2 font-heading font-black text-xs uppercase rounded-xl neo-border border-black cursor-pointer transition-all ${
                  isDark ? 'bg-[#CCFF00] text-black hover:bg-[#b8e600]' : 'bg-[#FF6B35] text-white hover:bg-[#ff5a22]'
                }`}
              >
                ADD 🛒
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className={`neo-border rounded-2xl p-4 flex flex-col justify-between space-y-4 group transition-all ${
            isDark ? 'bg-[#18181A] border-white/20 hover:border-[#CCFF00]' : 'bg-white border-[#1E1E1E] neo-shadow hover:border-[#FF6B35]'
          }`}>
            <div className="relative h-48 rounded-xl overflow-hidden neo-border border-black/10 bg-gray-100">
              <span className="absolute top-2 left-2 z-10">
                <StickerBadge text="NEW DROP! ✨" variant="lime" size="sm" />
              </span>
              <img
                src="https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=500&auto=format&fit=crop&q=80"
                alt="BBQ Chaos"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="space-y-2">
              <h3 className={`font-heading font-black text-xl uppercase ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                BBQ CHAOS
              </h3>
              <p className={`text-xs leading-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Smoked gouda, sweet BBQ, crispy bacon, red onions. A certified banger.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className={`font-heading font-black text-lg ${isDark ? 'text-[#CCFF00]' : 'text-[#FF6B35]'}`}>
                $20.99
              </span>
              <button
                onClick={() => handleNav('builder')}
                className={`px-4 py-2 font-heading font-black text-xs uppercase rounded-xl neo-border border-black cursor-pointer transition-all ${
                  isDark ? 'bg-[#CCFF00] text-black hover:bg-[#b8e600]' : 'bg-[#FF6B35] text-white hover:bg-[#ff5a22]'
                }`}
              >
                ADD 🛒
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className={`neo-border rounded-2xl p-4 flex flex-col justify-between space-y-4 group transition-all ${
            isDark ? 'bg-[#18181A] border-white/20 hover:border-[#CCFF00]' : 'bg-white border-[#1E1E1E] neo-shadow hover:border-[#FF6B35]'
          }`}>
            <div className="relative h-48 rounded-xl overflow-hidden neo-border border-black/10 bg-gray-100">
              <span className="absolute top-2 left-2 z-10">
                <StickerBadge text="LIMITED 🍄" variant="yellow" size="sm" />
              </span>
              <img
                src="https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=500&auto=format&fit=crop&q=80"
                alt="Truffle Bomb"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="space-y-2">
              <h3 className={`font-heading font-black text-xl uppercase ${isDark ? 'text-white' : 'text-[#1E1E1E]'}`}>
                TRUFFLE BOMB
              </h3>
              <p className={`text-xs leading-normal ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Black truffle oil, wild mushrooms, fresh mozzarella, garlic confit.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className={`font-heading font-black text-lg ${isDark ? 'text-[#CCFF00]' : 'text-[#FF6B35]'}`}>
                $22.99
              </span>
              <button
                onClick={() => handleNav('builder')}
                className={`px-4 py-2 font-heading font-black text-xs uppercase rounded-xl neo-border border-black cursor-pointer transition-all ${
                  isDark ? 'bg-[#CCFF00] text-black hover:bg-[#b8e600]' : 'bg-[#FF6B35] text-white hover:bg-[#ff5a22]'
                }`}
              >
                ADD 🛒
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 3: THE VIBE CHECK ----------------- */}
      <section id="vibe-check" className={`w-full border-y py-20 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDark ? 'bg-[#141416] border-white/10' : 'bg-[#FFF5F0] border-black/10'
      }`}>
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="relative">
            <h2 className={`font-heading font-black text-3xl sm:text-4xl uppercase tracking-tight border-b-2 pb-3 ${
              isDark ? 'text-white border-white/20' : 'text-[#1E1E1E] border-black/10'
            }`}>
              THE VIBE CHECK
            </h2>
          </div>

          {/* Testimonial Cards Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Column 1 - Two Small Cards */}
            <div className="space-y-6 flex flex-col justify-between">
              <div className={`neo-border p-5 rounded-2xl space-y-2 ${
                isDark ? 'bg-[#1C1C1E] border-white/20 text-white' : 'bg-white border-[#1E1E1E] text-[#1E1E1E] neo-shadow-sm'
              }`}>
                <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                  <span>@NightOwlGamer</span>
                  <span>1h ago</span>
                </div>
                <p className="text-xs sm:text-sm font-medium">
                  "Yes this pizza literally saved my ranked match. The crust is built &amp; cheese. 🍕🔥 #Lizza"
                </p>
              </div>

              <div className={`neo-border p-5 rounded-2xl space-y-2 ${
                isDark ? 'bg-[#1C1C1E] border-white/20 text-white' : 'bg-white border-[#1E1E1E] text-[#1E1E1E] neo-shadow-sm'
              }`}>
                <div className="text-[#FFE600] text-sm tracking-widest">
                  ★ ★ ★ ★ ★
                </div>
                <p className="text-xs sm:text-sm font-medium">
                  "Delivery guy pulled up in a tricked out EV. Vibe was immaculate. Pizza was even hotter."
                </p>
              </div>
            </div>

            {/* Column 2 - Neon Highlight Box */}
            <div className={`neo-border border-black p-8 rounded-2xl flex flex-col justify-center text-center space-y-4 neo-shadow ${
              isDark ? 'bg-[#FF007F] text-white' : 'bg-[#FF6B35] text-white'
            }`}>
              <div className="flex items-center justify-between text-xs font-heading font-black uppercase text-black">
                <span>TRENDING</span>
                <span>📈</span>
              </div>
              <p className="font-heading font-black text-2xl sm:text-3xl text-white italic leading-snug uppercase">
                "11/10 would risk it all for another slice."
              </p>
            </div>

            {/* Column 3 - Single Card */}
            <div className={`neo-border p-6 rounded-2xl flex flex-col justify-center space-y-3 ${
              isDark ? 'bg-[#1C1C1E] border-white/20 text-white' : 'bg-white border-[#1E1E1E] text-[#1E1E1E] neo-shadow-sm'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                <span>@SamCoder</span>
                <span>4h ago</span>
              </div>
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                "Late night deployment fuel sorted. Lizza is the only dependency I need. 💻"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- SECTION 4: THE LATE NIGHT LAB ----------------- */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className={`neo-border rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center transition-colors ${
          isDark ? 'bg-[#141416] border-white/20' : 'bg-white border-[#1E1E1E] neo-shadow-lg'
        }`}>
          {/* Left Text Column */}
          <div className="space-y-6">
            <div>
              <span className={`font-heading font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider neo-border border-black ${
                isDark ? 'bg-[#CCFF00] text-black' : 'bg-[#FF6B35] text-white'
              }`}>
                EXPERIMENTAL PHASE
              </span>
            </div>

            <h2 className={`font-heading font-black text-4xl sm:text-5xl uppercase tracking-tight leading-none ${
              isDark ? 'text-white' : 'text-[#1E1E1E]'
            }`}>
              THE LATE NIGHT LAB
            </h2>

            <p className={`text-xs sm:text-sm font-medium leading-relaxed max-w-md ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>
              Enter the matrix of crust and cheese. Build your ultimate creation using our high-spec topping selector. Warning: Highly addictive.
            </p>

            <button
              onClick={() => handleNav('builder')}
              className={`neo-btn px-6 py-3.5 font-heading font-black text-sm uppercase tracking-wider rounded-xl neo-border border-black cursor-pointer flex items-center gap-2 transition-all ${
                isDark ? 'bg-[#CCFF00] text-black hover:bg-[#b8e600]' : 'bg-[#FF6B35] text-white hover:bg-[#ff5a22]'
              }`}
            >
              INITIATE BUILD 🎛️
            </button>
          </div>

          {/* Right Retro Terminal Window */}
          <div className={`neo-border rounded-2xl overflow-hidden neo-shadow ${
            isDark ? 'bg-[#0B0B0C] border-white/30' : 'bg-[#FFF5F0] border-[#1E1E1E]'
          }`}>
            {/* Terminal Header */}
            <div className={`px-4 py-2.5 border-b flex items-center justify-between ${
              isDark ? 'bg-[#1F1F23] border-white/20' : 'bg-gray-200 border-black/10'
            }`}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
              </div>
              <span className={`font-mono text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Source: v2.Lizza
              </span>
            </div>

            {/* Terminal Content */}
            <div className="p-6 space-y-4">
              <button
                onClick={() => setLabStep(1)}
                className={`w-full p-4 neo-border rounded-xl font-heading font-black text-sm uppercase flex items-center justify-between cursor-pointer transition-colors ${
                  labStep === 1
                    ? isDark
                      ? 'bg-[#FF007F] text-white border-black'
                      : 'bg-[#FF6B35] text-white border-black'
                    : isDark
                    ? 'bg-[#18181A] text-gray-300 border-white/20'
                    : 'bg-white text-[#1E1E1E] border-[#1E1E1E]'
                }`}
              >
                <span>SELECT BASE</span>
                <span>+</span>
              </button>

              <button
                onClick={() => setLabStep(2)}
                className={`w-full p-4 neo-border rounded-xl font-heading font-black text-sm uppercase flex items-center justify-between cursor-pointer transition-colors ${
                  labStep === 2
                    ? isDark
                      ? 'bg-[#CCFF00] text-black border-black'
                      : 'bg-[#CCFF00] text-black border-black'
                    : isDark
                    ? 'bg-[#18181A] text-gray-300 border-white/20'
                    : 'bg-white text-[#1E1E1E] border-[#1E1E1E]'
                }`}
              >
                <span>LOAD TOPPINGS</span>
                <span>+</span>
              </button>

              <button
                onClick={() => {
                  setBaked(true);
                  setTimeout(() => setBaked(false), 2500);
                }}
                className={`w-full p-4 neo-border font-heading font-black text-sm uppercase flex items-center justify-between cursor-pointer transition-colors ${
                  isDark
                    ? 'border-white/20 bg-[#18181A] text-gray-400 hover:bg-[#252528]'
                    : 'border-[#1E1E1E] bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{baked ? '🔥 BAKING IN PROGRESS...' : 'EXECUTE BAKE'}</span>
                <span>🔒</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- FOOTER ----------------- */}
      <footer className={`w-full border-t py-10 px-4 sm:px-6 lg:px-8 text-center space-y-6 transition-colors ${
        isDark ? 'border-white/10' : 'border-black/10'
      }`}>
        <div className="flex justify-center">
          <span className={`font-heading font-black text-3xl tracking-tight ${
            isDark ? 'text-[#CCFF00]' : 'text-[#FF6B35]'
          }`}>
            Lizza
          </span>
        </div>

        <div className={`flex flex-wrap justify-center gap-6 font-heading font-bold text-xs uppercase tracking-wider ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          <a href="#" className="hover:text-[#FF6B35] transition-colors">PRIVACY</a>
          <a href="#" className="hover:text-[#FF6B35] transition-colors">TERMS</a>
          <a href="#" className="hover:text-[#FF6B35] transition-colors">ALLERGENS</a>
          <a href="#" className="hover:text-[#FF6B35] transition-colors">INFO</a>
        </div>

        <p className={`text-[11px] font-heading font-bold uppercase tracking-widest ${
          isDark ? 'text-gray-600' : 'text-gray-500'
        }`}>
          © 2026 LIZZA DIGITAL COLLECTIVE. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
}

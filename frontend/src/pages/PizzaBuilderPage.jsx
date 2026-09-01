import React, { useState, useEffect } from 'react';
import PageShell from '../components/PageShell.jsx';
import StickerBadge from '../components/StickerBadge.jsx';
import { useCart } from '../context/CartContext.jsx';
import menuService from '../services/menuService.js';

/**
 * Page 3: Pizza Builder (4-Step Flow)
 */
export default function PizzaBuilderPage({ onNavigate }) {
  const { addToCart } = useCart();
  const [menuItems, setMenuItems] = useState([]);
  const [activeStep, setActiveStep] = useState(1);
  const [size, setSize] = useState('Medium 12"');
  const [crust, setCrust] = useState('Stuffed Cheese Crust');
  const [sauce, setSauce] = useState('Classic Tomato');
  const [cheese, setCheese] = useState('Regular Mozzarella');
  const [toppings, setToppings] = useState(['Pepperoni', 'Hot Honey']);

  useEffect(() => {
    async function loadMenuOptions() {
      try {
        const data = await menuService.fetchMenu();
        if (Array.isArray(data)) {
          setMenuItems(data);
        }
      } catch (err) {
        console.warn("Error fetching menu options for builder:", err);
      }
    }
    loadMenuOptions();
  }, []);


  const steps = [
    { num: 1, name: 'Size & Crust' },
    { num: 2, name: 'Sauce Base' },
    { num: 3, name: 'Cheese Level' },
    { num: 4, name: 'Toppings' },
  ];

  const sizeOptions = [
    { label: 'Small 10"', price: 12.00, desc: '6 Slices (Solo Vibe)' },
    { label: 'Medium 12"', price: 15.00, desc: '8 Slices (Crowd Favorite)' },
    { label: 'Large 16"', price: 19.00, desc: '12 Slices (Party Mode)' },
  ];

  const crustOptions = [
    { label: 'Classic NY Dough', price: 0 },
    { label: 'Stuffed Cheese Crust', price: 2.50 },
    { label: 'Crispy Thin Crust', price: 0 },
    { label: 'Detroit Deep Dish', price: 3.00 },
  ];

  const sauceOptions = [
    { label: 'Classic Tomato', color: 'bg-red-500' },
    { label: 'Garlic White Sauce', color: 'bg-amber-100' },
    { label: 'Spicy Buffalo', color: 'bg-orange-500' },
    { label: 'Truffle Pesto', color: 'bg-emerald-600' },
  ];

  const cheeseOptions = [
    { label: 'Light Cheese', price: 0 },
    { label: 'Regular Mozzarella', price: 0 },
    { label: 'Extra Chaos Cheese', price: 1.50 },
    { label: 'Dairy-Free Vegan', price: 2.00 },
  ];

  const availableToppings = [
    { id: 'Pepperoni', name: 'Pepperoni 🍕', price: 1.50 },
    { id: 'Hot Honey', name: 'Hot Honey Drizzle 🍯', price: 1.00 },
    { id: 'Jalapeños', name: 'Jalapeños 🌶️', price: 1.00 },
    { id: 'Mushrooms', name: 'Wild Mushrooms 🍄', price: 1.25 },
    { id: 'Crispy Basil', name: 'Crispy Basil 🌿', price: 0.75 },
    { id: 'Bacon', name: 'Smoked Bacon 🥓', price: 1.75 },
  ];

  const toggleTopping = (id) => {
    setToppings((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  // Base price calculation
  const sizeObj = sizeOptions.find((s) => s.label === size) || sizeOptions[1];
  const crustObj = crustOptions.find((c) => c.label === crust) || crustOptions[0];
  const cheeseObj = cheeseOptions.find((ch) => ch.label === cheese) || cheeseOptions[0];
  const toppingsTotal = toppings.reduce((acc, tId) => {
    const t = availableToppings.find((item) => item.id === tId);
    return acc + (t ? t.price : 0);
  }, 0);

  const totalPrice = sizeObj.price + crustObj.price + cheeseObj.price + toppingsTotal;

  return (
    <PageShell activeTab="builder" onNavigate={onNavigate}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 neo-card">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="font-heading font-black text-3xl text-[#1E1E1E] uppercase tracking-tight">
                PIZZA BUILDER 🛠️
              </h1>
              <StickerBadge text="CUSTOM LAB" variant="pink" rotate="right" size="sm" />
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase">
              Design your own chaotic masterpiece step-by-step
            </p>
          </div>

          <div className="neo-border bg-[#CCFF00] px-4 py-2 rounded-2xl flex items-center gap-3">
            <span className="font-heading font-extrabold text-xs uppercase">Est. Total:</span>
            <span className="font-heading font-black text-2xl text-[#1E1E1E]">${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* 4-Step Flow Stepper Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {steps.map((step) => {
            const isActive = activeStep === step.num;
            const isDone = activeStep > step.num;
            return (
              <button
                key={step.num}
                onClick={() => setActiveStep(step.num)}
                className={`p-3 rounded-2xl font-heading font-extrabold text-xs uppercase tracking-wider neo-border flex items-center gap-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF6B35] text-white neo-shadow'
                    : isDone
                    ? 'bg-[#CCFF00] text-[#1E1E1E]'
                    : 'bg-white text-gray-600'
                }`}
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                  isActive ? 'bg-white text-[#FF6B35]' : 'bg-[#1E1E1E] text-white'
                }`}>
                  {isDone ? '✓' : step.num}
                </span>
                <span>{step.name}</span>
              </button>
            );
          })}
        </div>

        {/* Main Builder Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Options Controller (Cols 1-7) */}
          <div className="lg:col-span-7 bg-white neo-card p-6 space-y-6">
            
            {/* Step 1: Size & Crust */}
            {activeStep === 1 && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase">
                  1. Select Size
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {sizeOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setSize(opt.label)}
                      className={`p-4 rounded-2xl border-2.5 border-[#1E1E1E] text-left transition-all cursor-pointer ${
                        size === opt.label ? 'bg-[#FF6B35] text-white neo-shadow' : 'bg-[#FFF5F0] hover:bg-white'
                      }`}
                    >
                      <div className="font-heading font-extrabold text-sm">{opt.label}</div>
                      <div className="text-xs font-bold mt-1 opacity-90">${opt.price.toFixed(2)}</div>
                      <div className="text-[10px] mt-2 font-medium opacity-80">{opt.desc}</div>
                    </button>
                  ))}
                </div>

                <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase pt-4">
                  Select Crust Style
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {crustOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setCrust(opt.label)}
                      className={`p-3.5 rounded-2xl border-2.5 border-[#1E1E1E] text-left transition-all cursor-pointer ${
                        crust === opt.label ? 'bg-[#CCFF00] text-[#1E1E1E] neo-shadow' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-heading font-extrabold text-xs uppercase">{opt.label}</div>
                      <div className="text-xs font-bold text-[#FF6B35] mt-1">
                        {opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'FREE'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Sauce Base */}
            {activeStep === 2 && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase">
                  2. Pick Sauce Base
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sauceOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setSauce(opt.label)}
                      className={`p-4 rounded-2xl border-2.5 border-[#1E1E1E] text-left flex items-center gap-3 transition-all cursor-pointer ${
                        sauce === opt.label ? 'bg-[#1E1E1E] text-white neo-shadow' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 border-black ${opt.color}`} />
                      <div className="font-heading font-extrabold text-sm uppercase">{opt.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Cheese Level */}
            {activeStep === 3 && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase">
                  3. Cheese Intensity
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {cheeseOptions.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => setCheese(opt.label)}
                      className={`p-4 rounded-2xl border-2.5 border-[#1E1E1E] text-left transition-all cursor-pointer ${
                        cheese === opt.label ? 'bg-[#FF2E93] text-white neo-shadow' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-heading font-extrabold text-sm uppercase">{opt.label}</div>
                      <div className="text-xs font-bold mt-1 opacity-90">
                        {opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'Included'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Toppings Selection */}
            {activeStep === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="font-heading font-black text-xl text-[#1E1E1E] uppercase">
                  4. Load Up Toppings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {availableToppings.map((top) => {
                    const isSelected = toppings.includes(top.id);
                    return (
                      <button
                        key={top.id}
                        onClick={() => toggleTopping(top.id)}
                        className={`p-3.5 rounded-2xl border-2.5 border-[#1E1E1E] text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected ? 'bg-[#CCFF00] text-[#1E1E1E] neo-shadow' : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <div className="font-heading font-extrabold text-xs uppercase">{top.name}</div>
                          <div className="text-[11px] font-bold text-gray-600 mt-0.5">+${top.price.toFixed(2)}</div>
                        </div>
                        <span className="font-black text-lg">{isSelected ? '✓' : '+'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step Control Buttons */}
            <div className="flex items-center justify-between pt-4 border-t-2 border-[#1E1E1E]">
              <button
                onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                disabled={activeStep === 1}
                className="neo-btn py-2.5 px-4 bg-white text-[#1E1E1E] font-heading font-bold text-xs uppercase rounded-xl disabled:opacity-40 cursor-pointer"
              >
                ← Back
              </button>

              {activeStep < 4 ? (
                <button
                  onClick={() => setActiveStep((prev) => Math.min(4, prev + 1))}
                  className="neo-btn py-2.5 px-6 bg-[#FF6B35] text-white font-heading font-black text-xs uppercase rounded-xl cursor-pointer"
                >
                  Next Step →
                </button>
              ) : (
                <button
                  onClick={() => {
                    addToCart({
                      itemId: `custom-${Date.now()}`,
                      name: `CUSTOM CHAOS PIZZA (${size})`,
                      size,
                      crust,
                      sauce,
                      cheese,
                      toppings,
                      price: totalPrice,
                      quantity: 1,
                    });
                    if (onNavigate) onNavigate('summary');
                  }}
                  className="neo-btn py-3 px-6 bg-[#CCFF00] text-[#1E1E1E] font-heading font-black text-xs uppercase rounded-xl cursor-pointer"
                >
                  ADD TO BOX (${totalPrice.toFixed(2)}) 🍕
                </button>
              )}
            </div>
          </div>

          {/* Right Live Pizza Preview Graphic (Cols 8-12) */}
          <div className="lg:col-span-5 neo-card bg-[#FFF5F0] p-6 flex flex-col justify-between items-center text-center space-y-6">
            <div className="w-full">
              <StickerBadge text="LIVE PREVIEW 🎨" variant="yellow" rotate="left" size="sm" />
              <h3 className="font-heading font-black text-2xl text-[#1E1E1E] uppercase mt-2">
                YOUR CHAOS CRUST
              </h3>
            </div>

            {/* Simulated Graphic Pizza Circle */}
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-full bg-amber-200 border-4 border-[#1E1E1E] shadow-[6px_6px_0px_#1E1E1E] flex items-center justify-center p-4 overflow-hidden">
              {/* Inner Sauce Circle */}
              <div className="w-48 h-48 sm:w-52 sm:h-52 rounded-full bg-red-500 border-2 border-red-700 flex items-center justify-center relative">
                {/* Cheese Overlay */}
                <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-amber-100/90 border-2 border-amber-300 flex flex-wrap items-center justify-center p-2 gap-2">
                  {/* Toppings Emblems */}
                  {toppings.map((t, idx) => (
                    <span key={idx} className="text-xl animate-bounce" style={{ animationDelay: `${idx * 0.1}s` }}>
                      {t.includes('Pepperoni') ? '🍕' : t.includes('Honey') ? '🍯' : t.includes('Jalap') ? '🌶️' : '🍄'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary Chips */}
            <div className="w-full space-y-2 text-left bg-white neo-border p-4 rounded-2xl">
              <div className="text-xs font-heading font-bold uppercase text-gray-500">Summary:</div>
              <div className="text-xs font-heading font-black uppercase text-[#1E1E1E]">
                {size} • {crust} • {sauce}
              </div>
              <div className="text-xs font-bold text-[#FF6B35]">
                Toppings: {toppings.length > 0 ? toppings.join(', ') : 'Just Cheese'}
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageShell>
  );
}

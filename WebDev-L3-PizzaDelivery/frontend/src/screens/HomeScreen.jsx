import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Plus, Pizza as PizzaIcon } from 'lucide-react';

export default function HomeScreen({ onSelectPizza, onOpenCart, cartCount = 2 }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Pizza');
  const [searchQuery, setSearchQuery] = useState('');

  const pizzas = [
    {
      id: 1,
      name: 'Pepperoni Party',
      price: '$12.99',
      numericPrice: 12.99,
      bg: 'bg-[#FFE500]',
      badge: '🔥 Popular',
      badgeBg: 'bg-[#FF80AB]',
      badgePos: 'top-left',
      image: '/images/pepperoni.png'
    },
    {
      id: 2,
      name: 'Veggie Vibes',
      price: '$10.50',
      numericPrice: 10.50,
      bg: 'bg-[#00CBD6]',
      topTag: 'Lizza',
      image: '/images/veggie.png'
    },
    {
      id: 3,
      name: 'BBQ Chaos',
      price: '$14.25',
      numericPrice: 14.25,
      bg: 'bg-[#FF5722]',
      badge: 'New ✨',
      badgeBg: 'bg-[#E0E0E0]',
      badgePos: 'top-right',
      image: '/images/bbq.png'
    },
    {
      id: 4,
      name: 'Margherita Classic',
      price: '$11.00',
      numericPrice: 11.00,
      bg: 'bg-[#E53935]',
      image: '/images/margherita.png'
    }
  ];

  const filteredPizzas = pizzas.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePizzaClick = (pizza) => {
    if (onSelectPizza) {
      onSelectPizza(pizza);
    } else {
      navigate('/build');
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
            <PizzaIcon className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-[#C4380B] italic">
            Hi, Pizza Lover!
          </span>
        </div>

        {/* Cart Button */}
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
        {/* Hero Card */}
        <div className="bg-[#FFF0E8] neo-card p-5 md:p-6 space-y-3 relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-black leading-tight tracking-tight uppercase">
              Crust We <br />Trust.
            </h2>
            <p className="text-xs sm:text-sm font-semibold text-gray-700 max-w-[280px] mt-1">
              Fresh ingredients, chaotic toppings, total vibes.
            </p>
          </div>

          {/* Search Box */}
          <div className="flex items-center gap-2 pt-1 md:pt-0 w-full md:w-72">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search your craving..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white neo-border rounded-xl py-2.5 px-3 text-xs sm:text-sm font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5A26]"
              />
            </div>
            <button className="bg-[#FF6B35] neo-btn p-2.5 rounded-xl text-white flex items-center justify-center cursor-pointer">
              <Search className="w-4 h-4 stroke-[3]" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2.5 max-w-md sm:max-w-lg">
          {['Pizza', 'Sides', 'Drinks'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl font-heading font-extrabold text-sm neo-btn transition-all cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-white text-black hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Product Cards Grid - Collapses to 1 column on mobile, 2 columns on tablet/desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-5">
          {filteredPizzas.map((pizza) => (
            <div
              key={pizza.id}
              className="bg-white neo-card p-3 relative flex flex-col group cursor-pointer"
              onClick={() => handlePizzaClick(pizza)}
            >
              {/* Tilted Sticker Badges */}
              {pizza.badge && (
                <div
                  className={`absolute z-20 ${
                    pizza.badgePos === 'top-left' ? '-top-3 -left-2 -rotate-6' : '-top-3 -right-2 rotate-6'
                  }`}
                >
                  <span
                    className={`${pizza.badgeBg} text-black font-heading font-extrabold text-xs px-3 py-1 rounded-md neo-badge inline-block shadow-sm`}
                  >
                    {pizza.badge}
                  </span>
                </div>
              )}

              {/* Pizza Image Canvas Area */}
              <div
                className={`w-full h-48 sm:h-56 ${pizza.bg} rounded-xl neo-border relative overflow-hidden flex items-center justify-center p-2`}
              >
                {pizza.topTag && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm neo-border px-3 py-0.5 rounded-full z-10">
                    <span className="font-heading font-black text-xs text-[#00838F] italic">
                      {pizza.topTag}
                    </span>
                  </div>
                )}
                <img
                  src={pizza.image}
                  alt={pizza.name}
                  className="w-40 h-40 sm:w-48 sm:h-48 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Pizza Details & Add Button */}
              <div className="flex items-center justify-between mt-3 px-1">
                <div>
                  <h3 className="font-heading font-bold text-base text-black tracking-tight">
                    {pizza.name}
                  </h3>
                  <p className="font-heading font-black text-sm text-[#C4380B]">
                    {pizza.price}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePizzaClick(pizza);
                  }}
                  className="bg-[#FF6B35] text-black neo-btn w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#FF5A26] hover:text-white cursor-pointer"
                >
                  <Plus className="w-5 h-5 stroke-[3]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


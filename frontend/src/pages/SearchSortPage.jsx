import React, { useState, useEffect } from 'react';
import PageShell from '../components/PageShell.jsx';
import PizzaCard from '../components/PizzaCard.jsx';
import StickerBadge from '../components/StickerBadge.jsx';
import { useCart } from '../context/CartContext.jsx';
import menuService from '../services/menuService.js';

/**
 * Page 8: Search & Sort Page
 */
export default function SearchSortPage({ onNavigate }) {
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [backendItems, setBackendItems] = useState([]);

  useEffect(() => {
    async function loadMenu() {
      try {
        const data = await menuService.fetchMenu();
        if (Array.isArray(data)) {
          setBackendItems(data);
        }
      } catch (err) {
        console.warn('Error loading search menu items:', err);
      }
    }
    loadMenu();
  }, []);

  const allPizzas = [
    {
      _id: '60d5ec49f1d2c80015f8a001',
      id: '60d5ec49f1d2c80015f8a001',
      name: 'THE CHAOS PEPPERONI',
      price: 18.99,
      description: 'Double pep, hot honey drizzle, chaotic crust, zero rules.',
      badgeText: 'NEW DROP 🔥',
      badgeVariant: 'lime',
      bgPattern: 'checkered',
      tag: 'spicy',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 2,
      name: 'FIREBREATHER',
      price: 19.99,
      description: 'Spicy ground beef, jalapeños, hot chili crunch & habanero honey.',
      badgeText: 'SPICY AF 🌶️',
      badgeVariant: 'pink',
      bgPattern: 'lime',
      tag: 'spicy',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 3,
      name: 'VEGAN CHAOS SUPREME',
      price: 17.50,
      description: 'Plant-based sausage, vegan mozzarella, roasted peppers & arugula.',
      badgeText: 'VEGAN 🌱',
      badgeVariant: 'lime',
      bgPattern: 'solid',
      tag: 'vegan',
      image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 4,
      name: 'CLASSIC MARGH',
      price: 16.00,
      description: 'Fresh basil, fior di latte mozzarella, slow roasted tomato sauce.',
      badgeText: 'OG VIBES 🧀',
      badgeVariant: 'yellow',
      bgPattern: 'solid',
      tag: 'cheese',
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 5,
      name: 'TRUFFLE MONSTER',
      price: 21.50,
      description: 'Wild forest mushrooms, black truffle cream, thyme & parmesan.',
      badgeText: 'LUXE DROP ✨',
      badgeVariant: 'dark',
      bgPattern: 'orange',
      tag: 'luxe',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
    },
    {
      id: 6,
      name: 'HONEY BACON CRUNCH',
      price: 18.50,
      description: 'Crispy bacon, hot honey, smoked gouda, garlic oil drizzle.',
      badgeText: 'BESTSELLER ⭐',
      badgeVariant: 'orange',
      bgPattern: 'checkered',
      tag: 'bestseller',
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const formattedBackendPizzas = (backendItems || []).map((b) => ({
    _id: b._id,
    id: b._id,
    name: b.name,
    price: b.basePrice || b.price || 0,
    description: b.description || 'Database inventory menu item',
    badgeText: b.isAvailable ? 'LIVE DB 📦' : 'OUT OF STOCK 🛑',
    badgeVariant: 'lime',
    bgPattern: 'checkered',
    tag: b.category ? b.category.toLowerCase() : 'all',
    image: b.image || b.img || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80',
  }));

  const combinedPizzas = [...formattedBackendPizzas, ...allPizzas];

  // Filtering logic
  const filtered = combinedPizzas.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = activeFilter === 'all' || item.tag === activeFilter || item.tag.includes(activeFilter);
    return matchesSearch && matchesTag;
  });

  return (
    <PageShell activeTab="search" onNavigate={onNavigate}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Header & Search Bar Input */}
        <div className="bg-white neo-card p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="font-heading font-black text-3xl text-[#1E1E1E] uppercase tracking-tight">
                SEARCH & FILTER 🔍
              </h1>
              <p className="text-xs font-bold text-gray-500 uppercase">
                Find your exact craving in seconds
              </p>
            </div>
            <StickerBadge text={`${filtered.length} RESULTS`} variant="lime" size="sm" />
          </div>

          {/* Big Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by topping, pizza name, or flavor (e.g. Pepperoni, Spicy, Truffle)..."
              className="w-full neo-border neo-shadow-sm rounded-2xl px-5 py-4 bg-[#FFF5F0] font-heading font-extrabold text-sm sm:text-base text-[#1E1E1E] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 font-black text-gray-400 hover:text-[#1E1E1E] cursor-pointer"
              >
                ✕ CLEAR
              </button>
            )}
          </div>

          {/* Quick Tag Filters & Sort Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar w-full sm:w-auto">
              {[
                { id: 'all', label: 'All Items' },
                { id: 'spicy', label: '🌶️ Spicy AF' },
                { id: 'vegan', label: '🌱 Vegan' },
                { id: 'cheese', label: '🧀 Extra Cheese' },
                { id: 'bestseller', label: '⭐ Bestsellers' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`py-2 px-3.5 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider neo-border transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === f.id
                      ? 'bg-[#FF6B35] text-white neo-shadow rotate-[-1deg]'
                      : 'bg-white text-[#1E1E1E] hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 neo-border rounded-xl px-3 py-2 bg-[#FFF5F0] self-end sm:self-auto">
              <span className="text-xs font-heading font-extrabold uppercase">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-heading font-bold text-xs uppercase focus:outline-none cursor-pointer"
              >
                <option value="popular">Popularity</option>
                <option value="low-to-high">Price: Low to High</option>
                <option value="high-to-low">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white neo-card p-12 text-center space-y-4">
            <span className="text-5xl block">🔍</span>
            <h3 className="font-heading font-black text-2xl uppercase">NO MATCHING CRUSTS FOUND</h3>
            <p className="text-sm font-medium text-gray-500 max-w-md mx-auto">
              We couldn't find any pizzas matching "{searchQuery}". Try searching for something else or clear filters!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="neo-btn py-3 px-6 bg-[#CCFF00] text-[#1E1E1E] font-heading font-black text-xs uppercase rounded-xl cursor-pointer"
            >
              Reset Filters 🔄
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((pizza) => (
              <PizzaCard
                key={pizza.id}
                {...pizza}
                onAdd={() => {
                  addToCart(pizza);
                  if (onNavigate) onNavigate('summary');
                }}
                onCustomize={() => onNavigate && onNavigate('builder')}
              />
            ))}
          </div>
        )}

      </div>
    </PageShell>
  );
}

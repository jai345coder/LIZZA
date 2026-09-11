import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Pizza, ShoppingBag, Truck } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home, path: '/dashboard' },
    { id: 'build', label: 'Builder', icon: Pizza, path: '/build' },
    { id: 'summary', label: 'Summary', icon: ShoppingBag, path: '/order-summary' },
    { id: 'track', label: 'Tracking', icon: Truck, path: '/orders/1/track' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none p-2 pb-3">
      <nav className="w-full max-w-md sm:max-w-xl md:max-w-3xl lg:max-w-5xl bg-white neo-border-thick rounded-2xl p-2 px-3 sm:px-6 flex items-center justify-around neo-shadow pointer-events-auto transition-all duration-300">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            location.pathname === item.path ||
            (item.id === 'track' && (location.pathname.startsWith('/orders/') || location.pathname === '/tracker'));

          const handleClick = () => {
            if (onTabChange) onTabChange(item.id);
            navigate(item.path);
          };

          return (
            <button
              key={item.id}
              onClick={handleClick}
              className={`flex-1 max-w-[120px] py-1.5 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#FF6B35] text-white neo-border neo-shadow-sm font-black scale-105'
                  : 'text-gray-700 hover:text-black font-bold'
              }`}
            >
              <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'stroke-[3]' : 'stroke-[2.5]'}`} />
              <span className="text-[10px] sm:text-xs font-heading leading-none">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}


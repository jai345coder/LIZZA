import React from 'react';

/**
 * MobileNav - Bottom tab navigation for mobile devices.
 */
export default function MobileNav({ activeTab, onNavigate, cartCount = 0 }) {
  const tabs = [
    { id: 'menu', label: 'Menu', icon: '🍕' },
    { id: 'builder', label: 'Build', icon: '🛠️' },
    { id: 'summary', label: 'Box', icon: '🛍️', badge: cartCount },
    { id: 'track', label: 'Track', icon: '🛵' },
    { id: 'profile', label: 'You', icon: '⚡' },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#FFF5F0]/95 backdrop-blur-md border-t-3 border-[#1E1E1E] px-2 py-2 shadow-[0_-4px_10px_rgba(0,0,0,0.1)]">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate && onNavigate(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#CCFF00] text-[#1E1E1E] neo-border neo-shadow-sm translate-y-[-2px]'
                  : 'text-[#1E1E1E] hover:bg-white/60'
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              <span className="font-heading font-extrabold text-[10px] uppercase mt-1 tracking-tight">
                {tab.label}
              </span>
              {tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF2E93] text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center neo-border">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

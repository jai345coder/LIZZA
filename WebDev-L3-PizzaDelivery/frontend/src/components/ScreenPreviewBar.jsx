import React from 'react';

export default function ScreenPreviewBar({ currentScreen, onSelectScreen }) {
  const screens = [
    { id: 'auth', label: '1. Login UI' },
    { id: 'home', label: '2. Home UI' },
    { id: 'builder', label: '3. Builder UI' },
    { id: 'checkout', label: '4. Checkout UI' },
    { id: 'tracker', label: '5. Tracker UI' },
  ];

  return (
    <div className="bg-[#1E1E1E] text-white p-2.5 px-4 sticky top-0 z-50 flex items-center justify-between border-b-2 border-black shadow-md overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 flex-shrink-0 mr-3">
        <span className="text-xs font-black font-heading text-[#FF6B35] tracking-widest uppercase">
          🍕 Lizza UI Screens:
        </span>
      </div>

      <div className="flex gap-2 flex-shrink-0">
        {screens.map((screen) => (
          <button
            key={screen.id}
            onClick={() => onSelectScreen(screen.id)}
            className={`text-xs font-heading font-extrabold px-3 py-1 rounded-lg border-2 transition-all ${
              currentScreen === screen.id
                ? 'bg-[#FF6B35] text-white border-white shadow-[2px_2px_0px_#FFF]'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {screen.label}
          </button>
        ))}
      </div>
    </div>
  );
}

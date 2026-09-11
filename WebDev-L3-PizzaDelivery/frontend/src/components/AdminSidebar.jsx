import React from 'react';
import StickerBadge from './StickerBadge.jsx';

/**
 * AdminSidebar - Neubrutalist sidebar for Kitchen HQ & Admin pages.
 */
export default function AdminSidebar({ activeTab = 'admin-orders', onNavigate }) {
  const adminNavItems = [
    { id: 'admin-orders', label: 'Live Orders', icon: '📺' },
    { id: 'admin-inventory', label: 'Inventory', icon: '📦' },
    { id: 'admin-menu', label: 'Menu Editor', icon: '✂️' },
    { id: 'admin-analytics', label: 'Analytics', icon: '📊' },
    { id: 'admin-settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#FFF5F0] border-b-3 lg:border-b-0 lg:border-r-3 border-[#1E1E1E] p-4 lg:p-6 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        {/* Header Branding */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-9 h-9 bg-[#1E1E1E] text-white rounded-xl font-heading font-black text-xl flex items-center justify-center neo-border">
              👾
            </div>
            <h2 className="font-heading font-black text-2xl text-[#1E1E1E] tracking-tight">
              KITCHEN HQ
            </h2>
          </div>
          <div className="mt-2">
            <StickerBadge text="🟢 ORDER FLOW: HIGH" variant="lime" rotate="left" size="sm" />
          </div>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="space-y-2 pt-2">
          {adminNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate && onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-heading font-extrabold text-sm uppercase tracking-wider transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FF6B35] text-white neo-border neo-shadow-sm rotate-[-1deg]'
                    : 'bg-white text-[#1E1E1E] hover:bg-gray-100 border-2 border-transparent'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action CTA Banner */}
        <div className="pt-2">
          <button 
            onClick={() => onNavigate && onNavigate('menu')}
            className="w-full neo-btn py-3 px-4 bg-[#FF2E93] text-white font-heading font-extrabold text-sm uppercase rounded-xl tracking-wider text-center cursor-pointer rotate-[1deg]"
          >
            🔥 NEW DROP
          </button>
        </div>
      </div>

      {/* Footer Support / Logout */}
      <div className="pt-6 border-t-2 border-[#1E1E1E]/20 space-y-2 mt-6 lg:mt-0">
        <button 
          onClick={() => onNavigate && onNavigate('profile')}
          className="w-full flex items-center gap-2 text-xs font-heading font-bold text-gray-600 hover:text-[#1E1E1E] uppercase cursor-pointer"
        >
          <span>❓</span> Support & Help
        </button>
        <button 
          onClick={() => onNavigate && onNavigate('login')}
          className="w-full flex items-center gap-2 text-xs font-heading font-bold text-red-500 hover:text-red-700 uppercase cursor-pointer"
        >
          <span>🚪</span> Exit Admin / Logout
        </button>
      </div>
    </aside>
  );
}

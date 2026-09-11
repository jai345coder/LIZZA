import React, { useState } from 'react';
import StickerBadge from './StickerBadge.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';

/**
 * ScreenPreviewSidebar - Slide-out sidebar drawer for quick navigation across Lizza pages.
 * Hidden on login/register section, and Admin sections are strictly restricted to Admin users.
 */
export default function ScreenPreviewSidebar({ activeTab, onNavigate, pages }) {
  const { isAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Hide page navigator on login/register page
  if (activeTab === 'login') {
    return null;
  }

  const customerPages = pages.filter((p) => !p.id.startsWith('admin'));
  const adminPages = pages.filter((p) => p.id.startsWith('admin'));

  return (
    <>
      {/* Floating Toggle Tab pinned to the left side */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-24 left-0 z-50 neo-btn py-3 px-2 sm:px-3 bg-[#1E1E1E] text-[#CCFF00] font-heading font-black text-xs uppercase rounded-r-2xl shadow-xl flex items-center gap-2 cursor-pointer transition-transform hover:translate-x-1"
        title="Toggle Pages Navigation Sidebar"
      >
        <span className="text-base">📱</span>
        <span className="hidden sm:inline">NAVIGATE</span>
        <span className="text-sm">{isOpen ? '◄' : '►'}</span>
      </button>

      {/* Backdrop Overlay when drawer is open */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 transition-opacity"
        />
      )}

      {/* Slide-out Sidebar Drawer */}
      <aside
        className={`fixed top-0 left-0 bottom-0 w-72 sm:w-80 bg-white border-r-3 border-[#1E1E1E] shadow-[8px_0_25px_rgba(0,0,0,0.15)] z-50 flex flex-col justify-between transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b-2.5 border-[#1E1E1E] bg-[#FFF5F0] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-[#FF6B35] text-white neo-border rounded-xl flex items-center justify-center font-heading font-black text-lg rotate-[-4deg]">
              🍕
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-[#1E1E1E] uppercase leading-tight">
                PAGE NAVIGATOR
              </h3>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                Quick Navigation
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-xl bg-white neo-border font-black text-sm flex items-center justify-center hover:bg-gray-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Page List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Customer Flow Pages */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-heading font-black uppercase tracking-wider text-gray-400">
                Customer Flow
              </span>
              <StickerBadge text="USER" variant="lime" size="sm" />
            </div>

            <div className="space-y-1.5">
              {customerPages.map((page) => {
                const isActive = activeTab === page.id;
                return (
                  <button
                    key={page.id}
                    onClick={() => {
                      onNavigate(page.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${
                      isActive
                        ? 'bg-[#FF6B35] text-white neo-border neo-shadow-sm rotate-[-1deg]'
                        : 'bg-[#FFF5F0] text-[#1E1E1E] hover:bg-white border-2 border-transparent'
                    }`}
                  >
                    <span>{page.label}</span>
                    {isActive && <span className="text-sm">➔</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin Flow Pages - ONLY VISIBLE TO ADMIN LOGINS */}
          {isAdmin && (
            <div className="space-y-2 pt-2 border-t-2 border-gray-100">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-heading font-black uppercase tracking-wider text-gray-400">
                  Admin & HQ Flow
                </span>
                <StickerBadge text="ADMIN" variant="pink" size="sm" />
              </div>

              <div className="space-y-1.5">
                {adminPages.map((page) => {
                  const isActive = activeTab === page.id;
                  return (
                    <button
                      key={page.id}
                      onClick={() => {
                        onNavigate(page.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-between cursor-pointer ${
                        isActive
                          ? 'bg-[#FF2E93] text-white neo-border neo-shadow-sm rotate-[1deg]'
                          : 'bg-[#FFF5F0] text-[#1E1E1E] hover:bg-white border-2 border-transparent'
                      }`}
                    >
                      <span>{page.label}</span>
                      {isActive && <span className="text-sm">➔</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 border-[#1E1E1E] bg-[#FFF5F0] text-center space-y-3">
          <button
            onClick={toggleTheme}
            className="w-full neo-btn py-2 px-3 bg-white text-[#1E1E1E] rounded-xl font-heading font-extrabold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isDark ? '☀️' : '🌙'}</span>
            <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
          </button>
          <p className="text-[10px] font-heading font-bold text-gray-500 uppercase tracking-widest">
            LIZZA PIZZA CO. • NO RULES. JUST DOUGH.
          </p>
        </div>
      </aside>
    </>
  );
}

import React, { useState } from 'react';
import StickerBadge from './StickerBadge.jsx';
import AuthContext, { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
/**
 * Navbar - Top header navigation bar for Lizza app.
 */
export default function Navbar({ 
  activeTab = 'menu', 
  onNavigate, 
  cartCount = 2,
  user: userProp,
  isAdmin: isAdminProp
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user: authUser, isAdmin: authIsAdmin } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const currentUser = userProp || authUser;
  const currentIsAdmin = isAdminProp !== undefined ? isAdminProp : authIsAdmin;

  const navItems = [
    { id: 'menu', label: 'Menu', scrollTo: 'pizzas' },
    { id: 'drinks', label: 'Drinks 🥤', scrollTo: 'drinks' },
    { id: 'reviews', label: 'Reviews ⭐', scrollTo: 'reviews' },
    { id: 'builder', label: 'Build Your Own', pageId: 'builder' },
    { id: 'track', label: 'Track Order', pageId: 'track' },
    { id: 'deals', label: 'Deals 🏷️', scrollTo: 'pizzas' },
  ];

  const handleNavClick = (item) => {
    if (item.scrollTo) {
      if (activeTab !== 'menu' && onNavigate) {
        onNavigate('menu');
        setTimeout(() => {
          const elem = document.getElementById(item.scrollTo);
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const elem = document.getElementById(item.scrollTo);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } else if (item.pageId && onNavigate) {
      onNavigate(item.pageId);
    }
  };

  return (
    <header className="w-full bg-[#FFF5F0] border-b-3 border-[#1E1E1E] sticky top-0 z-40 shadow-sm">
      {/* Top Banner Notice */}
      <div className="bg-[#1E1E1E] text-white text-[11px] sm:text-xs font-heading uppercase tracking-widest py-1 px-4 overflow-hidden flex items-center justify-between">
        <div className="animate-marquee whitespace-nowrap flex gap-8 items-center w-full justify-center">
          <span>🍕 FREE DELIVERY ON ORDERS OVER $25 WITH CODE <span className="text-[#CCFF00] font-bold">CHAOS25</span></span>
          <span className="hidden md:inline text-[#FF2E93]">• NO RULES. JUST DOUGH. •</span>
          <span className="hidden lg:inline text-[#FF6B35]">HOT & READY 24/7</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          onClick={() => {
            if (onNavigate) onNavigate('menu');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#FF6B35] neo-border neo-shadow-sm rounded-2xl flex items-center justify-center font-heading font-black text-white text-xl sm:text-2xl rotate-[-4deg] group-hover:rotate-0 transition-transform">
            🍕
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-black text-2xl sm:text-3xl text-[#1E1E1E] tracking-tight leading-none">
              LIZZA
            </span>
            <span className="text-[9px] font-bold tracking-widest text-[#FF6B35] uppercase -mt-0.5">
              Pizza Co.
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item)}
                className={`px-3 py-2 rounded-xl font-heading font-extrabold text-xs xl:text-sm uppercase tracking-wide transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#CCFF00] text-[#1E1E1E] neo-border neo-shadow-sm rotate-[-1deg]'
                    : 'text-[#1E1E1E] hover:bg-white/80 hover:text-[#FF6B35]'
                }`}
              >
                {item.label}
              </button>
            );
          })}

{/* /**  @kitechen hq button not required */ }
          {/* {currentIsAdmin && (
            <button
              onClick={() => onNavigate && onNavigate('admin-orders')}
              className={`px-3 py-1.5 rounded-xl font-heading font-bold text-xs uppercase transition-all cursor-pointer ml-2 ${
                activeTab?.startsWith('admin')
                  ? 'bg-[#FF2E93] text-white neo-border neo-shadow-sm'
                  : 'bg-[#1E1E1E] text-white hover:bg-black'
              }`}
            >
              Kitchen HQ 🛠️
            </button>
          )} */}
        </nav>

        {/* Right Actions (Sign In, Cart, Theme Toggle, Profile, Mobile Toggle) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dark / Light Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="neo-btn p-2 sm:px-3 sm:py-2 bg-white text-[#1E1E1E] rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-transform hover:scale-105"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme Mode"
          >
            <span className="text-base sm:text-lg">{isDark ? '☀️' : '🌙'}</span>
            {/* <span className="hidden md:inline font-black text-[11px]">
              {isDark ? '☀️' : '🌙'}
            </span> */}
          </button>

          {/* Sign In Button - Hidden if user is logged in */}
          {!currentUser ? (
            <button
              onClick={() => onNavigate && onNavigate('login')}
              className="neo-btn px-3 py-2 bg-white hover:bg-amber-50 text-[#1E1E1E] rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider cursor-pointer"
            >
              Sign In
            </button>
          ) : null}

          {/* Cart Icon Button */}
          <button
            onClick={() => {
              const elem = document.getElementById('your-box-cart') || document.getElementById('summary');
              if (elem) {
                elem.scrollIntoView({ behavior: 'smooth' });
              } else if (onNavigate) {
                onNavigate('summary');
              }
            }}
            className="relative neo-btn p-2.5 sm:px-3.5 sm:py-2 bg-[#FF6B35] text-white rounded-xl font-heading font-bold text-sm flex items-center gap-2 cursor-pointer"
            title="View Box / Cart"
          >
            <span className="text-lg">🛍️</span>
            <span className="hidden sm:inline uppercase text-xs font-black">Your Box</span>
            {cartCount > 0 && (
              <span className="bg-[#CCFF00] text-[#1E1E1E] text-xs font-black w-5 h-5 rounded-full flex items-center justify-center neo-border -mr-1">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile Avatar */}
          <button
            onClick={() => onNavigate && onNavigate('profile')}
            className={`neo-btn p-1.5 sm:p-2 bg-white rounded-xl flex items-center gap-2 cursor-pointer ${
              activeTab === 'profile' ? 'ring-2 ring-[#FF6B35]' : ''
            }`}
            title="User Profile"
          >
            <div className="w-7 h-7 rounded-lg bg-[#FF2E93] text-white font-black text-xs flex items-center justify-center neo-border uppercase">
              {currentUser?.avatar || (currentUser?.name ? currentUser.name[0] : currentUser?.username ? currentUser.username[0] : '⚡')}
            </div>
            <span className="hidden xl:inline font-heading font-bold text-xs uppercase pr-1 text-[#1E1E1E]">
              {currentUser?.name || currentUser?.username || currentUser?.email?.split('@')[0] || 'User'}
            </span>
          </button>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden neo-btn p-2.5 bg-white text-[#1E1E1E] rounded-xl font-bold text-xl cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FFF5F0] border-t-2 border-[#1E1E1E] px-4 py-4 space-y-2 shadow-lg animate-fadeIn">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                handleNavClick(item);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-heading font-extrabold text-base uppercase tracking-wider ${
                activeTab === item.id
                  ? 'bg-[#CCFF00] text-[#1E1E1E] neo-border neo-shadow-sm'
                  : 'bg-white text-[#1E1E1E] neo-border'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => {
              onNavigate && onNavigate('login');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-4 py-3 bg-[#FFE600] text-[#1E1E1E] neo-border rounded-xl font-heading font-extrabold text-base uppercase tracking-wider"
          >
            Sign In 🔑
          </button>
          {isAdmin && (
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => {
                  onNavigate && onNavigate('admin-inventory');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 px-3 bg-[#1E1E1E] text-white font-heading font-bold text-xs uppercase rounded-xl neo-border text-center"
              >
                Admin Inventory
              </button>
              <button
                onClick={() => {
                  onNavigate && onNavigate('admin-orders');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2.5 px-3 bg-[#FF2E93] text-white font-heading font-bold text-xs uppercase rounded-xl neo-border text-center"
              >
                Kitchen HQ
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

import React from 'react';
import Navbar from './Navbar.jsx';
import MobileNav from './MobileNav.jsx';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * PageShell - Main full-screen edge-to-edge shell wrapper for Lizza pages.
 */
export default function PageShell({
  children,
  activeTab,
  onNavigate,
  cartCount = 2,
  user: userProp,
  isAdmin: isAdminProp,
  hideNav = false,
  className = ''
}) {
  const { user: authUser, isAdmin: authIsAdmin } = useAuth();
  const currentUser = userProp || authUser;
  const currentIsAdmin = isAdminProp !== undefined ? isAdminProp : authIsAdmin;

  return (
    <div className="min-h-screen w-full bg-[#FFF5F0] text-[#1E1E1E] flex flex-col font-sans relative overflow-x-hidden selection:bg-[#CCFF00] selection:text-[#1E1E1E]">
      {/* Header Navigation */}
      {!hideNav && (
        <Navbar
          activeTab={activeTab}
          onNavigate={onNavigate}
          cartCount={cartCount}
          user={currentUser}
          isAdmin={currentIsAdmin}
        />
      )}

      {/* Main Content Area */}
      <main className={`flex-1 w-full pb-20 lg:pb-8 ${className}`}>
        {children}
      </main>

      {/* Bottom Mobile Tab Bar */}
      {!hideNav && (
        <MobileNav
          activeTab={activeTab}
          onNavigate={onNavigate}
          cartCount={cartCount}
        />
      )}
    </div>
  );
}
